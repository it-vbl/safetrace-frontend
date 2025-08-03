import { createSlice } from '@reduxjs/toolkit';

export const stdbSlice = createSlice({
  name: 'stdb',
  initialState: { stdb: [], filterKomoditas: [], filterKecamatan: [], filterSTDBStatus: [] },
  reducers: {
    setSTDB: (state, action) => {
      state.stdb = action.payload;
    },
    setFilterKomoditas: (state, action) => {
      state.filterKomoditas = action.payload;
    },
    setFilterKecamatan: (state, action) => {
      state.filterKecamatan = action.payload;
    },
    setFilterSTDBStatus: (state, action) => {
      state.filterSTDBStatus = action.payload;
    },
  },
});

export const { setSTDB, setFilterKomoditas, setFilterKecamatan, setFilterSTDBStatus } = stdbSlice.actions;
export default stdbSlice.reducer;
