import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import HomeContent from './HomeContent';

export const metadata: Metadata = pageMetadata('home');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('home'), breadcrumbNode('home')] }} />
      <HomeContent />
    </>
  );
}
