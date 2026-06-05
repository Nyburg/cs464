'use client';

import { useState } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { DatasetFormProps } from './DatasetFormTypes';
import DatasetItemRow from './DatasetItemRow';

const defaultItems = ['', ''];

export default function DatasetForm({
  initialTitle = '',
  initialDescription = '',
  initialItems = defaultItems,
  loading = false,
  error = null,
  saveLabel = 'SAVE',
  showDelete = false,
  onSave,
  onCancel,
  onDelete,
}: DatasetFormProps) {

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [items, setItems] = useState<string[]>(
  initialItems.length > 0 ? initialItems : ['', '']
  );

  const handleAddItem = () => setItems(prev => [...prev, '']);

  const handleItemChange = (index: number, value: string) => {
    setItems(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleDeleteItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= items.length) {
      return;
    }

    setItems(prev => {
      const copy = [...prev];
      [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
      return copy;
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2, position: 'relative', pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <IconButton onClick={onCancel} aria-label="close">
          <CloseIcon sx={{ fontSize: 36, fontWeight: 'bold' }} />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Dataset name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          slotProps={{ input: { 'aria-label': 'dataset name' } }}
        />
      </Box>

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
  {items.map((item, index) => (
    <DatasetItemRow
      key={index}
      item={item}
      index={index}
      itemCount={items.length}
      onChange={handleItemChange}
      onDelete={handleDeleteItem}
      onMove={moveItem}
    />
  ))}
</Box>

<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
  <IconButton onClick={handleAddItem} aria-label="add item">
    <AddIcon sx={{ fontSize: 52 }} />
  </IconButton>
  <Typography variant="body2" align="center">
    Add new item
  </Typography>
</Box>

{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}

<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
  <Button variant="outlined" onClick={onCancel} disabled={loading} sx={{ flex: 1, py: 1.5 }}>
    Cancel
  </Button>

  <Button
    variant="outlined"
    onClick={() => onSave({ title, description, items })}
    disabled={loading}
    sx={{ flex: 1, py: 1.5 }}
  >
    {loading ? 'Saving...' : saveLabel}
  </Button>
</Box>

{showDelete && onDelete && (
  <Button
    variant="outlined"
    color="error"
    fullWidth
    onClick={onDelete}
    disabled={loading}
  >
    Delete Dataset
  </Button>
)}
    </Box>
  );
}