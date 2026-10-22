import type { MetadataRoute } from 'next';
import { SITE_URL, ROUTES, type RouteKey } from '@/lib/site';
import { SEO } from '@/lib/seo';

/**
 * sitemap.xml, generated from the route register rather than maintained by hand.
 * A sitemap that drifts from the site is worse than none, because it teaches the
 * crawler to distrust it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const order: RouteKey[] = [
    'home', 'platform', 'marketplace', 'inspections', 'financing', 'services',
    'diaspora', 'howItWorks', 'developers', 'insights', 'about', 'technology',
    'faq', 'contact', 'privacyNotice', 'cookieNotice', 'dataRights', 'terms',
  ];
  const lastModified = new Date();

  return order.map((key) => {
    const path = ROUTES[key].path;
    return {
      url: SITE_URL + (path === '/' ? '' : path),
      lastModified,
      changeFrequency: SEO[key].changeFrequency,
      priority: SEO[key].priority,
    };
  });
}
