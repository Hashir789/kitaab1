export type DatePickerProps = {
  id: string;
  label: string;
  value: string;
  maxDate?: Date;
  isError?: boolean;
  ariaLabel?: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};