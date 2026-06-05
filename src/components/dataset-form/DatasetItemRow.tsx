import { Box, Typography, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

type DatasetItemRowProps = {
  item: string;
  index: number;
  itemCount: number;
  onChange: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
};

function placeholderFor(index: number) {
  if (index === 0) return '1st Item';
  if (index === 1) return '2nd Item';
  if (index === 2) return '3rd Item';
  return `${index + 1}th Item`;
}

export default function DatasetItemRow({
  item,
  index,
  itemCount,
  onChange,
  onDelete,
  onMove,
}: DatasetItemRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ width: 24, textAlign: 'right', flexShrink: 0, color: 'text.secondary' }}>
        {index + 1}
      </Typography>

      <TextField
        fullWidth
        value={item}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={placeholderFor(index)}
        size="small"
      />

      <IconButton
        onClick={() => onMove(index, -1)}
        aria-label="move item up"
        disabled={index === 0}
      >
        <ArrowUpwardIcon />
      </IconButton>

      <IconButton
        onClick={() => onMove(index, 1)}
        aria-label="move item down"
        disabled={index === itemCount - 1}
      >
        <ArrowDownwardIcon />
      </IconButton>

      <IconButton
        onClick={() => onDelete(index)}
        aria-label="delete item"
        disabled={itemCount <= 2}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}