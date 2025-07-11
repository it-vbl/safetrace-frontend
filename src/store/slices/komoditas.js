import { createSlice } from '@reduxjs/toolkit';

export const komoditasSlice = createSlice({
  name: 'komoditas',
  initialState: { komoditas: [] },
  reducers: {
    setKomoditas: (state, action) => {
      state.komoditas = action.payload;
    },
  },
});

export const { setKomoditas } = komoditasSlice.actions;
export default komoditasSlice.reducer;
