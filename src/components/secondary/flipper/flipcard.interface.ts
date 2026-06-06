import { ReactNode } from "react";

export type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  ariaLabel?: string;
  className?: string;
  flipped?: boolean;
  width?: number | string;
  height?: number | string;
  initialFlipped?: boolean;
};