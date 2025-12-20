import { createSlice } from '@reduxjs/toolkit';

export const referensiSlice = createSlice({
  name: 'referensi',
  initialState: {
    stdbStatuses: [],
    pendidikanTerakhir: [],
    statusLahan: [],
    jenisLahan: [],
    jenisPupuk: [],
    asalBenih: [],
    polaTanam: [],
    komoditasKelembagaan: [],
    jenisKelamin: [],
    eksPlasma: [],
    userRoles: [],
    statusPerkawinan: [],
    statusPekerja: [],
    kelompokTani: [],
    sumberKontak: [],
    jenisLegalitas: [],
  },
  reducers: {
    setSTDBStatuses: (state, action) => {
      state.stdbStatuses = action.payload;
    },
    setPendidikanTerakhir: (state, action) => {
      state.pendidikanTerakhir = action.payload;
    },
    setStatusLahan: (state, action) => {
      state.statusLahan = action.payload;
    },
    setJenisLahan: (state, action) => {
      state.jenisLahan = action.payload;
    },
    setJenisPupuk: (state, action) => {
      state.jenisPupuk = action.payload;
    },
    setAsalBenih: (state, action) => {
      state.asalBenih = action.payload;
    },
    setPolaTanam: (state, action) => {
      state.polaTanam = action.payload;
    },
    setKomoditasKelembagaan: (state, action) => {
      state.komoditasKelembagaan = action.payload;
    },
    setJenisKelamin: (state, action) => {
      state.jenisKelamin = action.payload;
    },
    setEksPlasma: (state, action) => {
      state.eksPlasma = action.payload;
    },
    setUserRoles: (state, action) => {
      state.userRoles = action.payload;
    },
    setStatusPerkawinan: (state, action) => {
      state.statusPerkawinan = action.payload;
    },
    setStatusPekerja: (state, action) => {
      state.statusPekerja = action.payload;
    },
    setKelompokTani: (state, action) => {
      state.kelompokTani = action.payload;
    },
    setSumberKontak: (state, action) => {
      state.sumberKontak = action.payload;
    },
    setJenisLegalitas: (state, action) => {
      state.jenisLegalitas = action.payload;
    },
  },
});

export const {
  setSTDBStatuses,
  setPendidikanTerakhir,
  setStatusLahan,
  setJenisLahan,
  setJenisPupuk,
  setAsalBenih,
  setPolaTanam,
  setKomoditasKelembagaan,
  setJenisKelamin,
  setEksPlasma,
  setUserRoles,
  setStatusPerkawinan,
  setStatusPekerja,
  setKelompokTani,
  setSumberKontak,
  setJenisLegalitas,
} = referensiSlice.actions;
export default referensiSlice.reducer;
