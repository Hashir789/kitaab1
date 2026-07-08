import { RootState } from "@/store";

export const selectViewportWidth = (state: RootState) =>
  state.ui.viewport.width;

export const selectSidebarExpanded = (state: RootState) =>
  state.ui.sidebarExpanded;