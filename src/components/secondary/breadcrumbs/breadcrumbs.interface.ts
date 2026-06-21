export type BreadcrumbsProps = {
  gap?: number;
  count?: number;
  padding?: number;
  className?: string;
  ariaLabel?: string;
  buttonWidth?: number;
  buttonHeight?: number;
  mobileOffset?: number;
  getLabel?: (index: number) => string;
};