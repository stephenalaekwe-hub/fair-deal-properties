import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import DataRightsContent from './DataRightsContent';

export const metadata: Metadata = pageMetadata('dataRights');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('dataRights'), breadcrumbNode('dataRights')] }} />
      <DataRightsContent />
    </>
  );
}
