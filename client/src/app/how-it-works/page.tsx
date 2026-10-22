import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import HowItWorksContent from './HowItWorksContent';

export const metadata: Metadata = pageMetadata('howItWorks');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('howItWorks'), breadcrumbNode('howItWorks')] }} />
      <HowItWorksContent />
    </>
  );
}
