import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { webPageNode, breadcrumbNode } from '@/lib/schema';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = pageMetadata('privacyNotice');

export default function Page() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org',
                      '@graph': [webPageNode('privacyNotice'), breadcrumbNode('privacyNotice')] }} />
      <PrivacyContent />
    </>
  );
}
