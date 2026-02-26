import React from 'react';
import styles from './skeleton.module.css';

type SkeletonVariant = 'text' | 'avatar' | 'card' | 'circle' | 'rect' | 'button';

interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: SkeletonVariant;
  style?: React.CSSProperties;
  borderRadius?: number | string;
  animationSpeed?: 'slow' | 'normal' | 'fast';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  style,
  borderRadius,
  animationSpeed = 'normal',
  ...rest
}) => {
  const getDefaultSizes = () => {
    switch (variant) {
      case 'text':
        return { height: 18, borderRadius: 6 };
      case 'avatar':
      case 'circle':
        return { width: 64, height: 64, borderRadius: '50%' };
      case 'card':
        return { height: 240, borderRadius: 12 };
      case 'button':
        return { height: 44, borderRadius: 8 };
      case 'rect':
      default:
        return { borderRadius: 8 };
    }
  };

  const defaults = getDefaultSizes();

  const finalWidth = width ?? defaults.width ?? '100%';
  const finalHeight = height ?? defaults.height ?? 18;
  const finalRadius =
    borderRadius !== undefined ? borderRadius : defaults.borderRadius ?? 8;

  const animationClass =
    animationSpeed === 'slow'
      ? styles.shimmerSlow
      : animationSpeed === 'fast'
      ? styles.shimmerFast
      : styles.shimmer;

  return (
    <span
      aria-hidden="true"
      role="presentation"
      className={`${styles.skeleton} ${animationClass} ${className ?? ''}`}
      style={{
        width: finalWidth,
        height: finalHeight,
        borderRadius: finalRadius,
        ...style,
      }}
      {...rest}
    />
  );
};

export default Skeleton;