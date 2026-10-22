import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import AboutContent from './AboutContent';

export const metadata: Metadata = pageMetadata('about');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('about'), breadcrumbNode('about')] }} />
      <AboutContent />
    </>
  );
}
