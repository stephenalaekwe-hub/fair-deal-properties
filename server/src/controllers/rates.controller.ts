import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { priceListenerJob } from '../jobs/priceListener';

export const getFinancingRoutes = async (req: Request, res: Response): Promise<void> => {
  try {
    const routes = await prisma.financingRoute.findMany({
      orderBy: { id: 'asc' },
    });
    res.json({ ok: true, data: routes });
  } catch (err) {
    console.error('GetFinancingRoutes error:', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve financing routes.' });
  }
};

export const compareFinancing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyValueMillions, downPaymentPercent, termYears } = req.body;

    const pv = Number(propertyValueMillions) || 50;
    const dpPct = Number(downPaymentPercent) || 20;
    const yr = Number(termYears) || 15;

    const routes = await prisma.financingRoute.findMany();

    const comparisons = routes.map((r) => {
      const ratePct = r.interestRatePct ? Number(r.interestRatePct) : null;
      const effectiveTerm = Math.min(yr, r.maxTermYears || yr);
      const minEq = r.minEquityPct ? Number(r.minEquityPct) : 0;
      const actualDp = Math.max(dpPct, minEq);
      const loanAmount = pv * (1 - actualDp / 100);

      let monthlyRepaymentMillions: number | null = null;
      let totalCostMillions: number | null = null;

      if (ratePct !== null && ratePct > 0) {
        const monthlyRate = ratePct / 100 / 12;
        const totalMonths = effectiveTerm * 12;
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        monthlyRepaymentMillions = (loanAmount * monthlyRate * factor) / (factor - 1);
        totalCostMillions = monthlyRepaymentMillions * totalMonths + (pv * actualDp) / 100;
      }

      return {
        id: r.id,
        name: r.name,
        institution: r.institution,
        interestRatePct: ratePct,
        minEquityPct: minEq,
        maxTermYears: r.maxTermYears,
        appliedTermYears: effectiveTerm,
        appliedDownPaymentPct: actualDp,
        loanAmountMillions: loanAmount,
        monthlyRepaymentMillions,
        totalCostMillions,
        lastVerified: r.lastVerified,
        verificationNote: r.verificationNote,
      };
    });

    res.json({ ok: true, data: comparisons });
  } catch (err) {
    console.error('CompareFinancing error:', err);
    res.status(500).json({ ok: false, error: 'Failed to run mortgage comparison.' });
  }
};

// ─── Admin Rate & Scraper Management ─────────────────────────────────────────

export const updateFinancingRoute = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { interestRatePct, minEquityPct, maxTermYears, verificationNote, isAutoSynced } = req.body;

    const updated = await prisma.financingRoute.update({
      where: { id },
      data: {
        interestRatePct: interestRatePct !== undefined ? Number(interestRatePct) : undefined,
        minEquityPct: minEquityPct !== undefined ? Number(minEquityPct) : undefined,
        maxTermYears: maxTermYears !== undefined ? Number(maxTermYears) : undefined,
        verificationNote,
        isAutoSynced,
        lastVerified: new Date().toISOString().split('T')[0],
      },
    });

    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error('UpdateFinancingRoute error:', err);
    res.status(500).json({ ok: false, error: 'Failed to update financing route.' });
  }
};

export const getScrapedLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const logs = await prisma.scrapedPriceLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ ok: true, data: logs });
  } catch (err) {
    console.error('GetScrapedLogs error:', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve scraper logs.' });
  }
};

export const applyScrapedLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const log = await prisma.scrapedPriceLog.findUnique({ where: { id } });

    if (!log) {
      res.status(404).json({ ok: false, error: 'Log entry not found.' });
      return;
    }

    if (log.targetType === 'MORTGAGE_RATE') {
      const numericRate = parseFloat(log.newValue.replace('%', ''));
      await prisma.financingRoute.update({
        where: { id: log.targetReference },
        data: {
          interestRatePct: numericRate,
          lastVerified: new Date().toISOString().split('T')[0],
          verificationNote: `Updated automatically from ${log.sourceName}`,
        },
      });
    } else if (log.targetType === 'LISTING') {
      const numericPrice = parseFloat(log.newValue.replace(/[^0-9.]/g, ''));
      await prisma.listing.update({
        where: { slug: log.targetReference },
        data: {
          priceMillionsNGN: numericPrice,
          priceDisplay: `₦${numericPrice}M`,
        },
      });
    }

    const updated = await prisma.scrapedPriceLog.update({
      where: { id },
      data: { status: 'APPLIED', appliedAt: new Date() },
    });

    res.json({ ok: true, data: updated, message: 'Detected value applied to live database.' });
  } catch (err) {
    console.error('ApplyScrapedLog error:', err);
    res.status(500).json({ ok: false, error: 'Failed to apply scraped value.' });
  }
};

export const triggerListenerNow = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await priceListenerJob.runAllChecks();
    res.json({ ok: true, data: result, message: 'Price listener scan executed successfully.' });
  } catch (err) {
    console.error('TriggerListenerNow error:', err);
    res.status(500).json({ ok: false, error: 'Failed to trigger price listener.' });
  }
};
