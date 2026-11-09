'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSubmissionsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/compliance');
  }, [router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
      Redirecting to Data Rights & Compliance...
    </div>
  );
}
