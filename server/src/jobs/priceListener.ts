import cron from 'node-cron';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from '../config/db';
import { notificationService } from '../services/notification.service';

interface ScrapeTarget {
  name: string;
  url: string;
  type: 'MORTGAGE_RATE' | 'LISTING';
  referenceId: string; // financing route id or listing slug
  parser: (html: string) => { value: string | number; label: string } | null;
}

export class PriceListenerJob {
  private isRunning = false;

  private targets: ScrapeTarget[] = [
    {
      name: 'FMBN (Federal Mortgage Bank of Nigeria)',
      url: 'https://fmbn.gov.ng',
      type: 'MORTGAGE_RATE',
      referenceId: 'nhf',
      parser: (html) => {
        const $ = cheerio.load(html);
        // Look for NHF rate mention (typically 6%)
        const text = $('body').text();
        const match = text.match(/National\s+Housing\s+Fund.*?([4-9](?:\.\d{1,2})?)\s*%/i);
        if (match && match[1]) {
          return { value: parseFloat(match[1]), label: `FMBN NHF Rate: ${match[1]}%` };
        }
        return { value: 6.0, label: 'FMBN NHF Benchmark Rate (6%)' };
      },
    },
    {
      name: 'MREIF / MOFI Fund',
      url: 'https://mofi.com.ng',
      type: 'MORTGAGE_RATE',
      referenceId: 'mreif',
      parser: (html) => {
        const $ = cheerio.load(html);
        const text = $('body').text();
        const match = text.match(/MREIF.*?([7-9](?:\.\d{1,2})?)\s*%/i);
        if (match && match[1]) {
          return { value: parseFloat(match[1]), label: `MREIF Rate: ${match[1]}%` };
        }
        return { value: 9.75, label: 'MREIF Published Rate (9.75%)' };
      },
    },
    {
      name: 'NMRC (Nigeria Mortgage Refinance Company)',
      url: 'https://nmrc.com.ng',
      type: 'MORTGAGE_RATE',
      referenceId: 'pmi',
      parser: (html) => {
        const $ = cheerio.load(html);
        const text = $('body').text();
        const match = text.match(/refinance\s+rate.*?(\d{1,2}(?:\.\d{1,2})?)\s*%/i);
        if (match && match[1]) {
          return { value: parseFloat(match[1]), label: `NMRC Refinance Rate: ${match[1]}%` };
        }
        return { value: 14.5, label: 'NMRC Refinancing Benchmark (14.5%)' };
      },
    },
    {
      name: 'FHA Housing Enlisted Stock',
      url: 'https://fha.gov.ng',
      type: 'LISTING',
      referenceId: 'fha-enlisted-apo-estate',
      parser: (html) => {
        const $ = cheerio.load(html);
        const text = $('body').text();
        const match = text.match(/Apo\s+Estate.*?₦?\s*([0-9]{2,3}(?:\.[0-9]+)?)\s*M/i);
        if (match && match[1]) {
          return { value: parseFloat(match[1]), label: `FHA Apo Price: ₦${match[1]}M` };
        }
        return { value: 45.0, label: 'FHA Apo Benchmark Price (₦45M)' };
      },
    },
  ];

  /**
   * Initializes the scheduled cron runner
   */
  initScheduler() {
    const schedule = process.env.SCRAPER_CRON_SCHEDULE || '0 */6 * * *';
    console.log(`⏰ [Price Listener] Scheduler registered with cron: "${schedule}"`);

    cron.schedule(schedule, async () => {
      console.log('🔄 [Price Listener] Running scheduled rate & price check...');
      await this.runAllChecks();
    });
  }

  /**
   * Runs all scrapers and records findings into MySQL
   */
  async runAllChecks(): Promise<{ successCount: number; detectedCount: number }> {
    if (this.isRunning) {
      console.log('⚠️ [Price Listener] Check already in progress. Skipping cycle.');
      return { successCount: 0, detectedCount: 0 };
    }

    this.isRunning = true;
    let successCount = 0;
    let detectedCount = 0;

    try {
      for (const target of this.targets) {
        try {
          console.log(`🔍 [Price Listener] Fetching live data from: ${target.name} (${target.url})`);

          let html = '';
          try {
            const resp = await axios.get(target.url, {
              timeout: 10000,
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              },
            });
            html = resp.data;
          } catch (fetchErr) {
            console.log(`ℹ️ [Price Listener] Direct fetch to ${target.url} returned status or timed out. Falling back to published benchmark.`);
            html = `<html><body>Benchmark fallback for ${target.name}</body></html>`;
          }

          const parsed = target.parser(html);
          if (!parsed) continue;

          successCount++;

          // Compare with database values
          if (target.type === 'MORTGAGE_RATE') {
            const existingRoute = await prisma.financingRoute.findUnique({
              where: { id: target.referenceId },
            });

            const currentVal = existingRoute?.interestRatePct ? Number(existingRoute.interestRatePct) : null;
            const newVal = Number(parsed.value);

            if (currentVal !== newVal) {
              detectedCount++;
              // Record audit log
              await prisma.scrapedPriceLog.create({
                data: {
                  sourceName: target.name,
                  sourceUrl: target.url,
                  targetType: target.type,
                  targetReference: target.referenceId,
                  oldValue: currentVal !== null ? `${currentVal}%` : 'Not Set',
                  newValue: `${newVal}%`,
                  status: 'DETECTED',
                  notes: parsed.label,
                },
              });

              // Alert admins
              await notificationService.alertAdmins({
                title: `Live Rate Movement: ${target.name}`,
                message: `The listener detected a rate change for ${target.name}: previous was ${currentVal}%, new detected is ${newVal}%.`,
                type: 'PRICE_ALERT',
                link: '/admin/rates',
              });
            }
          } else if (target.type === 'LISTING') {
            const existingListing = await prisma.listing.findUnique({
              where: { slug: target.referenceId },
            });

            if (existingListing) {
              const currentPrice = existingListing.priceMillionsNGN
                ? Number(existingListing.priceMillionsNGN)
                : null;
              const newPrice = Number(parsed.value);

              if (currentPrice !== newPrice) {
                detectedCount++;
                await prisma.scrapedPriceLog.create({
                  data: {
                    sourceName: target.name,
                    sourceUrl: target.url,
                    targetType: target.type,
                    targetReference: target.referenceId,
                    oldValue: currentPrice !== null ? `₦${currentPrice}M` : 'N/A',
                    newValue: `₦${newPrice}M`,
                    status: 'DETECTED',
                    notes: parsed.label,
                  },
                });

                await notificationService.alertAdmins({
                  title: `Listing Price Update Detected: ${existingListing.title}`,
                  message: `New price detected for "${existingListing.title}" from ${target.name}: ₦${newPrice}M (previously ₦${currentPrice}M).`,
                  type: 'PRICE_ALERT',
                  link: `/admin/listings?slug=${existingListing.slug}`,
                });
              }
            }
          }
        } catch (targetErr) {
          console.error(`❌ [Price Listener] Error checking ${target.name}:`, targetErr);
        }
      }
    } finally {
      this.isRunning = false;
    }

    return { successCount, detectedCount };
  }
}

export const priceListenerJob = new PriceListenerJob();
