import { ReactNode } from "react";

export interface AyahProps {
  verse: number;
  font?: string;
  chapter: number;
  arabicText: string;
  className?: string;
  translation: string | ReactNode;
}