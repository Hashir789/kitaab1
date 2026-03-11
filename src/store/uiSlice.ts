import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  viewportWidth: number;
  viewportHeight: number;
  isBelow710: boolean;
  isBelow880: boolean;
  isBelow1124: boolean;
}

const initialState: UiState = {
  viewportWidth: 1920,
  viewportHeight: 1080,
  isBelow710: false,
  isBelow880: false,
  isBelow1124: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    updateViewport: (state, action: PayloadAction<{ width: number; height: number }>) => {
      const { width, height } = action.payload;
      state.viewportWidth = width;
      state.viewportHeight = height;
      state.isBelow710 = width < 710;
      state.isBelow880 = width < 880;
      state.isBelow1124 = width < 1124;
    },
  },
});

export default uiSlice.reducer;
export const { updateViewport } = uiSlice.actions;
