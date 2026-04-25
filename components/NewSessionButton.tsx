'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

export default function NewSessionButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);

    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Untitled Session',
        language: 'javascript',
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.id) {
      router.push('/session/' + data.id);
    }
  }

  return (
    <Button onClick={handleCreate} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
          Creating...
        </>
      ) : (
        <>
          <Plus className='w-4 h-4 mr-2' />
          New Session
        </>
      )}
    </Button>
  );
}
