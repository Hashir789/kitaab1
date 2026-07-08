import { Breakpoint } from "@/constants/enums"

export interface UIState {
  sidebarExpanded: boolean,
  viewport: {
    width: number,
    height: number
  }
}

export interface ViewportPayload {
  width: number;
  height: number;
}