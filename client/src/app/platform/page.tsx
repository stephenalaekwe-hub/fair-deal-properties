import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import PlatformContent from './PlatformContent';

export const metadata: Metadata = pageMetadata('platform');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('platform'), breadcrumbNode('platform')] }} />
      <PlatformContent />
    </>
  );
}
