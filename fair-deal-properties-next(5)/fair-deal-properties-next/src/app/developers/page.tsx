import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import DevelopersContent from './DevelopersContent';

export const metadata: Metadata = pageMetadata('developers');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('developers'), breadcrumbNode('developers')] }} />
      <DevelopersContent />
    </>
  );
}
