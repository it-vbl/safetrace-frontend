import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    sidebarOpen: true,
    sidebarCollapsed: false,
    isMobileScreen: false,
    mapviewFilterSidebarOpen: true,
    mapviewRightSidebarOpen: true,
  },
  reducers: {
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setIsMobileScreen: (state, action) => {
      state.isMobileScreen = action.payload;
    },
    setMapviewFilterSidebarOpen: (state, action) => {
      state.mapviewFilterSidebarOpen = action.payload;
    },
    setMapviewRightSidebarOpen: (state, action) => {
      state.mapviewRightSidebarOpen = action.payload;
    },
  },
});

export const {
  setSidebarOpen,
  setSidebarCollapsed,
  setIsMobileScreen,
  setMapviewFilterSidebarOpen,
  setMapviewRightSidebarOpen,
} = appSlice.actions;
export default appSlice.reducer;
