import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import FinancingContent from './FinancingContent';

export const metadata: Metadata = pageMetadata('financing');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('financing'), breadcrumbNode('financing')] }} />
      <FinancingContent />
    </>
  );
}
