'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Alert } from '@mui/material';
import { Dataset } from '@/types/data';
import DatasetForm from '@/components/dataset-form/DatasetForm';
import { DatasetFormValues } from '@/components/dataset-form/DatasetFormTypes';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    if ('errors' in error) {
      return extractErrorMessage((error as Record<string, unknown>).errors);
    }

    const entries = Object.entries(error as Record<string, unknown>);
    if (entries.length > 0) {
      return entries.map(([k, v]) => `${k}: ${extractErrorMessage(v)}`).join(', ');
    }
  }

  if (Array.isArray(error)) {
    return error.map(extractErrorMessage).join(', ');
  }

  return 'An error occurred';
}

export default function UpdateDatasetPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDataset, setLoadingDataset] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/data?name=${slug}`)
      .then((r: Response) => {
        if (!r.ok) {
          throw new Error('Dataset not found');
        }

        return r.json();
      })
      .then((data: Dataset) => {
        setDataset(data);
        setError(null);
      })
      .catch(() => {
        setError('Dataset not found');
      })
      .finally(() => {
        setLoadingDataset(false);
      });
  }, [slug]);

  const handleSave = async ({ title, description, items }: DatasetFormValues) => {
    setError(null);

    const newSlug = slugify(title);
    const filledItems = items.filter(name => name.trim());

    if (!title.trim()) { setError('Dataset name is required'); return; }
    if (newSlug.length < 3) { setError('Dataset name must be at least 3 characters'); return; }
    if (filledItems.length < 2) { setError('At least 2 items are required'); return; }

    setLoading(true);

    try {
      const res = await fetch(`/api/data?slug=${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: newSlug,
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
        setError(extractErrorMessage(data.error));
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDataset = async () => {
    const confirmed = window.confirm('Delete this dataset? This cannot be undone.');

    if (!confirmed) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/data?slug=${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(extractErrorMessage(data.error || data.message));
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDataset) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!dataset) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
        <Alert severity="error">{error || 'Dataset not found'}</Alert>
      </Box>
    );
  }

  return (
    <DatasetForm
      key={slug}
      initialTitle={dataset.title}
      initialDescription={dataset.description || ''}
      initialItems={dataset.items.map(item => item.name)}
      loading={loading}
      error={error}
      saveLabel="SAVE"
      showDelete
      onSave={handleSave}
      onCancel={() => router.push('/')}
      onDelete={handleDeleteDataset}
    />
  );
}