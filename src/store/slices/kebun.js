import { createSlice } from '@reduxjs/toolkit';

export const kebunSlice = createSlice({
  name: 'kebun',
  initialState: { detailKebun: {} },
  reducers: {
    setDetailKebun: (state, action) => {
      state.detailKebun = action.payload;
    },
  },
});

export const { setDetailKebun } = kebunSlice.actions;
export default kebunSlice.reducer;
