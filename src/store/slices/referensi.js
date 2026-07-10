import { createSlice } from '@reduxjs/toolkit';

export const referensiSlice = createSlice({
  name: 'referensi',
  initialState: {
    pendidikanTerakhir: [],
    statusLahan: [],
    jenisLahan: [],
    jenisPupuk: [],
    asalBenih: [],
    polaTanam: [],
    jenisKelamin: [],
    eksPlasma: [],
    userRoles: [],
    statusPerkawinan: [],
    statusPekerja: [],
    kelompokTani: [],
    jenisLegalitas: [],
    statusKeanggotaan: [],
    registeredVia: [],
    requestOtpVia: [],
    whispStatus: [],
    pilihanBulan: [],
    deforestationAlertType: [],
    komoditas: [],
    jenisPekerjaan: [],
    jenisApd: [],
  },
  reducers: {
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
    setJenisLegalitas: (state, action) => {
      state.jenisLegalitas = action.payload;
    },
    setStatusKeanggotaan: (state, action) => {
      state.statusKeanggotaan = action.payload;
    },
    setRegisteredVia: (state, action) => {
      state.registeredVia = action.payload;
    },
    setRequestOtpVia: (state, action) => {
      state.requestOtpVia = action.payload;
    },
    setWhispStatus: (state, action) => {
      state.whispStatus = action.payload;
    },
    setPilihanBulan: (state, action) => {
      state.pilihanBulan = action.payload;
    },
    setDeforestationAlertType: (state, action) => {
      state.deforestationAlertType = action.payload;
    },
    setKomoditas: (state, action) => {
      state.komoditas = action.payload;
    },
    setJenisPekerjaan: (state, action) => {
      state.jenisPekerjaan = action.payload;
    },
    setJenisApd: (state, action) => {
      state.jenisApd = action.payload;
    },
  },
});

export const {
  setPendidikanTerakhir,
  setStatusLahan,
  setJenisLahan,
  setJenisPupuk,
  setAsalBenih,
  setPolaTanam,
  setJenisKelamin,
  setEksPlasma,
  setUserRoles,
  setStatusPerkawinan,
  setStatusPekerja,
  setKelompokTani,
  setJenisLegalitas,
  setStatusKeanggotaan,
  setRegisteredVia,
  setRequestOtpVia,
  setWhispStatus,
  setPilihanBulan,
  setDeforestationAlertType,
  setKomoditas,
  setJenisPekerjaan,
  setJenisApd,
} = referensiSlice.actions;
export default referensiSlice.reducer;
