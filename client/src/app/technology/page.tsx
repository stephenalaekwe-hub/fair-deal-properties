import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import TechnologyContent from './TechnologyContent';

export const metadata: Metadata = pageMetadata('technology');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('technology'), breadcrumbNode('technology')] }} />
      <TechnologyContent />
    </>
  );
}
