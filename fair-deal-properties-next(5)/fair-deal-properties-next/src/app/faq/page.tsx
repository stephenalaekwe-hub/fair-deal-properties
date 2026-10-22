import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import FaqContent from './FaqContent';

export const metadata: Metadata = pageMetadata('faq');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('faq'), breadcrumbNode('faq')] }} />
      <FaqContent />
    </>
  );
}
