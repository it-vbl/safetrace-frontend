import { configureStore } from '@reduxjs/toolkit';
import komoditasReducer from './slices/komoditas';
import kecamatanSanggauReducer from './slices/kecamatanSanggau';
import stdbReducer from './slices/stdb';
import referensiReducer from './slices/referensi';
import pekebunReducer from './slices/pekebun';
import wilayah from './slices/wilayah';
import createKebunFormReducer from './slices/createKebunForm';
import kebunReducer from './slices/kebun';

const store = configureStore({
  reducer: {
    komoditas: komoditasReducer,
    kecamatanSanggau: kecamatanSanggauReducer,
    stdb: stdbReducer,
    referensi: referensiReducer,
    pekebun: pekebunReducer,
    wilayah,
    createKebunForm: createKebunFormReducer,
    kebun: kebunReducer,
  },
});

export default store;
