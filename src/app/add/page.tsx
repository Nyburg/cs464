'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatasetForm from '@/components/dataset-form/DatasetForm';
import { DatasetFormValues } from '@/components/dataset-form/DatasetFormTypes';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+$/, '');
}

export default function AddDatasetPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async ({ title, description, items }: DatasetFormValues) => {
    setError(null);

    const slug = slugify(title);
    const filledItems = items.filter(name => name.trim());

    if (!title.trim()) {
      setError('Dataset name is required');
      return;
    }

    if (slug.length < 3) {
      setError('Dataset name must be at least 3 characters');
      return;
    }

    if (filledItems.length < 2) {
      setError('At least 2 items are required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title: title.trim(),
          description: description.trim() || undefined,
          items: filledItems.map((name, index) => ({
            name: name.trim(),
            order: index + 1,
          })),
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save dataset');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DatasetForm
      loading={loading}
      error={error}
      onSave={handleSave}
      onCancel={() => router.push('/')}
    />
  );
}