export type SliderDotsProps = {
  gap?: number;
  count: number;
  dotSize?: number;
  ariaLabel?: string;
  activeIndex: number;
  holeBackground?: string;
  onChange?: (index: number) => void;
};