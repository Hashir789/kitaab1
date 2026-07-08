import { initialState } from './initialState';
import { ViewportPayload } from './interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarExpanded(state, action: PayloadAction<boolean>) {
      state.sidebarExpanded = action.payload;
    },
    setViewport(state, action: PayloadAction<ViewportPayload>) {
      const { width, height } = action.payload;

      state.viewport.width = width;
      state.viewport.height = height;
    }
  }
});

export default uiSlice.reducer;
export const { setSidebarExpanded, setViewport } = uiSlice.actions;