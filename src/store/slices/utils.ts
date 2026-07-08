import { Breakpoint } from "@/constants/enums";

export const getBreakpoint = (width: number) => {
  if (width < 768) return Breakpoint.Mobile;
  if (width < 1024) return Breakpoint.Tablet;
  return Breakpoint.Desktop;
}