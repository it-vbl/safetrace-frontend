import { createSlice } from '@reduxjs/toolkit';

export const kecamatanSanggauSlice = createSlice({
  name: 'kecamatanSanggau',
  initialState: { kecamatanSanggau: [] },
  reducers: {
    setKecamatanSanggau: (state, action) => {
      state.kecamatanSanggau = action.payload;
    },
  },
});

export const { setKecamatanSanggau } = kecamatanSanggauSlice.actions;
export default kecamatanSanggauSlice.reducer;
