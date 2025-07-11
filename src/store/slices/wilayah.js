import { createSlice } from '@reduxjs/toolkit';

export const wilayahSlice = createSlice({
  name: 'wilayah',
  initialState: { listProvinsi: [], listKota: [], listKecamatan: [], listDesa: [] },
  reducers: {
    setListProvinsi: (state, action) => {
      state.listProvinsi = action.payload;
    },
    setListKota: (state, action) => {
      state.listKota = action.payload;
    },
    setListKecamatan: (state, action) => {
      state.listKecamatan = action.payload;
    },
    setListDesa: (state, action) => {
      state.listDesa = action.payload;
    },
  },
});

export const { setListDesa, setListKecamatan, setListKota, setListProvinsi } = wilayahSlice.actions;
export default wilayahSlice.reducer;
