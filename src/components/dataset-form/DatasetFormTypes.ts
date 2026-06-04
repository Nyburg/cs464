export type DatasetFormValues = {
  title: string;
  description: string;
  items: string[];
};

export type DatasetFormProps = {
  initialTitle?: string;
  initialDescription?: string;
  initialItems?: string[];
  loading?: boolean;
  error?: string | null;
  saveLabel?: string;
  showDelete?: boolean;
  onSave: (values: DatasetFormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
};