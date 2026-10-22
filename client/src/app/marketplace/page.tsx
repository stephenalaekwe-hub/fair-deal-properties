import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import MarketplaceContent from './MarketplaceContent';

export const metadata: Metadata = pageMetadata('marketplace');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('marketplace'), breadcrumbNode('marketplace')] }} />
      <MarketplaceContent />
    </>
  );
}
