import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import TermsContent from './TermsContent';

export const metadata: Metadata = pageMetadata('terms');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('terms'), breadcrumbNode('terms')] }} />
      <TermsContent />
    </>
  );
}
