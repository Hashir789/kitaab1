import { ReactNode } from "react";

export interface DictionaryProps {
  word: string;
  origin?: string;
  pluralOf?: string;
  className?: string;
  darkMode?: boolean;
  pronunciation?: string;
  meaning: string | ReactNode;
}