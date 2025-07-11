import { createSlice } from '@reduxjs/toolkit';

export const stdbSlice = createSlice({
  name: 'stdb',
  initialState: { stdb: [], filterKomoditas: [] },
  reducers: {
    setSTDB: (state, action) => {
      state.stdb = action.payload;
    },
    setFilterKomoditas: (state, action) => {
      state.filterKomoditas = action.payload;
    },
  },
});

export const { setSTDB, setFilterKomoditas } = stdbSlice.actions;
export default stdbSlice.reducer;
