import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: { 
    sidebarOpen: true,
    isMobileScreen: false,
  },
  reducers: {
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setIsMobileScreen: (state, action) => {
      state.isMobileScreen = action.payload;
    },
  },
});

export const { setSidebarOpen, setIsMobileScreen } = appSlice.actions;
export default appSlice.reducer;
