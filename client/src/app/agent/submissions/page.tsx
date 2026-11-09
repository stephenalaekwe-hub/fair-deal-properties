'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentSubmissionsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/agent/enquiries');
  }, [router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
      Redirecting to Assigned Property Enquiries...
    </div>
  );
}
