import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: { 
    sidebarOpen: true,
    sidebarCollapsed: false,
    isMobileScreen: false,
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
  },
});

export const { setSidebarOpen, setSidebarCollapsed, setIsMobileScreen } = appSlice.actions;
export default appSlice.reducer;
