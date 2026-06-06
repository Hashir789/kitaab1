export interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  borderRadius?: number | string;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  variant?: 'text' | 'avatar' | 'card' | 'circle' | 'rect' | 'button';
}