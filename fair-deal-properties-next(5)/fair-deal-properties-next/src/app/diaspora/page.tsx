import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import DiasporaContent from './DiasporaContent';

export const metadata: Metadata = pageMetadata('diaspora');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('diaspora'), breadcrumbNode('diaspora')] }} />
      <DiasporaContent />
    </>
  );
}
