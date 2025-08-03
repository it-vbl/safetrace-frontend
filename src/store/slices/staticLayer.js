import { createSlice } from '@reduxjs/toolkit';

export const staticLayerSlice = createSlice({
  name: 'staticSlayer',
  initialState: { staticLayerList: [], staticLayersDetail: {} },
  reducers: {
    setStaticLayerList: (state, action) => {
      state.staticLayerList = action.payload;
    },
    setStaticLayerDetail: (state, action) => {
      state.staticLayersDetail = action.payload;
    },
  },
});

export const { setStaticLayerList, setStaticLayerDetail } = staticLayerSlice.actions;
export default staticLayerSlice.reducer;
