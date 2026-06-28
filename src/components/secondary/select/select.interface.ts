import type { iconState } from "@/constants/enums";
import type { ReactNode } from "react";

export type SelectOption = {
  value: string | number;
  label: string;
};

export type SelectProps = {
  id: string;
  label: string;
  value: string | number | null;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  placeholder: string;
  ariaLabel: string;
  required?: boolean;
  helperText?: string;
  iconState?: iconState;
  width?: string | number;
  dropdownVariant?: "default" | "white";
};

export type SelectFieldProps = SelectProps & {
  rightIcon?: ReactNode;
};
