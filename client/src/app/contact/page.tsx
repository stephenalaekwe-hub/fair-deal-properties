import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import ContactContent from './ContactContent';

export const metadata: Metadata = pageMetadata('contact');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('contact'), breadcrumbNode('contact')] }} />
      <ContactContent />
    </>
  );
}
