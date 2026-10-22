import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * robots.txt
 *
 * AI and answer-engine crawlers are permitted deliberately. The firm publishes
 * verified market intelligence in order to be cited, and an answer engine that cannot
 * read the Insights pages cannot name Fair Deal Properties as the source. Reverse it
 * by moving those agents to `disallow`.
 *
 * The API surface is excluded: it is a transaction surface, not content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
