import { createSlice } from '@reduxjs/toolkit';

export const pekebunSlice = createSlice({
  name: 'pekebun',
  initialState: { pekebuns: [], onPendataanPekebuns: [], detailPekebun: {}, listKebun: [] },
  reducers: {
    setPekebuns: (state, action) => {
      state.pekebuns = action.payload;
    },
    setOnPendataanPekebuns: (state, action) => {
      state.onPendataanPekebuns = action.payload;
    },
    setDetailPekebun: (state, action) => {
      state.detailPekebun = action.payload;
    },
    setListKebun: (state, action) => {
      state.listKebun = action.payload;
    },
  },
});

export const { setPekebuns, setOnPendataanPekebuns, setDetailPekebun, setListKebun } = pekebunSlice.actions;
export default pekebunSlice.reducer;
