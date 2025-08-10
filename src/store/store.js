import { configureStore } from '@reduxjs/toolkit';

import appReducer from './slices/app';
import createKebunFormReducer from './slices/createKebunForm';
import kebunReducer from './slices/kebun';
import kecamatanSanggauReducer from './slices/kecamatanSanggau';
import komoditasReducer from './slices/komoditas';
import pekebunReducer from './slices/pekebun';
import referensiReducer from './slices/referensi';
import selectedUser from './slices/selectedUser';
import staticLayerReducer from './slices/staticLayer';
import stdbReducer from './slices/stdb';
import wilayah from './slices/wilayah';

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
    app: appReducer,
    staticLayer: staticLayerReducer,
    selectedUser: selectedUser,
  },
});

export default store;
