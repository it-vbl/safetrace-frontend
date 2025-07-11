import { createSlice } from '@reduxjs/toolkit';

export const createKebunFormSlice = createSlice({
  name: 'createKebunForm',
  initialState: { handleSubmit: null },
  reducers: {
    setHandleSubmit: (state, action) => {
      state.handleSubmit = action.payload;
    },
  },
});

export const { setHandleSubmit } = createKebunFormSlice.actions;
export default createKebunFormSlice.reducer;
