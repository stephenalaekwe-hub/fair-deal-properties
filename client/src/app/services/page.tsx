import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import ServicesContent from './ServicesContent';

export const metadata: Metadata = pageMetadata('services');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('services'), breadcrumbNode('services')] }} />
      <ServicesContent />
    </>
  );
}
