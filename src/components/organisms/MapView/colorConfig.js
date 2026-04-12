import L from 'leaflet';

import 'leaflet.pattern';

const stripePattern = new L.StripePattern({
  weight: 1, // thickness of stripe
  spaceWeight: 6, // spacing between stripes
  color: '#2394C6', // stripe color
  fillOpacity: 1,
  angle: 135, // diagonal angle
});

const hguPattern = new L.StripePattern({
  weight: 2, // thickness of stripe
  spaceWeight: 6, // spacing between stripes
  color: '#007AB9', // stripe color
  fillOpacity: 1,
  angle: -135, // diagonal angle
});

const wiupPattern = new L.StripePattern({
  weight: 2, // thickness of stripe
  spaceWeight: 6, // spacing between stripes
  color: '#131313', // stripe color
  fillOpacity: 1,
  angle: 135, // diagonal angle
});

// 👇 Call this once after you have map instance
export function registerPatterns(map) {
  stripePattern.addTo(map);
  wiupPattern.addTo(map);
  hguPattern.addTo(map);
}

const filledColorOptions = {
  fill: '#C0C0C0',
  color: '#C0C0C0',
  fillOpacity: 1,
  weight: 0,
};

const lahanGambutFeaturesPathOptions = [
  {
    key: 'Gambut Topogen Air Payau (50 cm - < 100 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#FFBBBD',
      color: '#FFBBBD',
    },
  },
  {
    key: 'Gambut Topogen Air Payau (100 cm - < 200 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#FF757B',
      color: '#FF757B',
    },
  },
  {
    key: 'Gambut Topogen Air Payau (200 cm - < 300 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#FF0000',
      color: '#FF0000',
    },
  },
  {
    key: 'Gambut Topogen Air Payau (300 cm - < 500 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#B80000',
      color: '#B80000',
    },
  },
  {
    key: 'Gambut Topogen Air Payau (500 cm - < 700 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#7E0100',
      color: '#7E0100',
    },
  },
  {
    key: 'Gambut Topogen Air Tawar (50 cm - < 100 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#ABFFE7',
      color: '#ABFFE7',
    },
  },
  {
    key: 'Gambut Topogen Air Tawar (100 cm - < 200 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#01FFDE',
      color: '#01FFDE',
    },
  },
  {
    key: 'Gambut Topogen Air Tawar (200 cm - < 300 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#01FFC1',
      color: '#01FFC1',
    },
  },
  {
    key: 'Gambut Topogen Air Tawar (300 cm - < 500 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#00EAA4',
      color: '#00EAA4',
    },
  },
  {
    key: 'Gambut Topogen Air Tawar (500 cm - < 700 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#00AB82',
      color: '#00AB82',
    },
  },
  {
    key: 'Tepi Kubah Gambut (50 cm - < 100 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#82FF5B',
      color: '#82FF5B',
    },
  },
  {
    key: 'Tepi Kubah Gambut (100 cm - < 200 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#00EA00',
      color: '#00EA00',
    },
  },
  {
    key: 'Tepi Kubah Gambut (200 cm - < 300 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#02C501',
      color: '#02C501',
    },
  },
  {
    key: 'Kubah Gambut (300 cm - < 500 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#00B100',
      color: '#00B100',
    },
  },
  {
    key: 'Kubah Gambut (500 cm - < 700 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#008400',
      color: '#008400',
    },
  },
  {
    key: 'Kubah Gambut (> 700 cm)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#004E01',
      color: '#004E01',
    },
  },
  {
    key: 'Rawa Belakang Pasang Surut',
    pathOptions: {
      ...filledColorOptions,
      fill: '#FFE4B8',
      color: '#FFE4B8',
    },
  },
  {
    key: 'Rawa Belakang Sungai Meander (Backswamp)  ',
    pathOptions: {
      ...filledColorOptions,
      fill: '#FFC3FF',
      color: '#FFC3FF',
    },
  },
  {
    key: 'Rawa Lebak Pematang (Dangkal)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#EEFCC7',
      color: '#EEFCC7',
    },
  },
  {
    key: 'Rawa Lebak Tengahan',
    pathOptions: {
      ...filledColorOptions,
      fill: '#CAFEDC',
      color: '#CAFEDC',
    },
  },
  {
    key: 'Bekas Aliran Sungai Lama',
    pathOptions: {
      ...filledColorOptions,
      fill: '#B9D3FF',
      color: '#B9D3FF',
    },
  },
  {
    key: 'Dataran Fluvio-Marin',
    pathOptions: {
      ...filledColorOptions,
      fill: '#23504F',
      color: '#23504F',
    },
  },
  {
    key: 'Dataran Pasang Surut (Tidal Flats)',
    pathOptions: {
      ...filledColorOptions,
      fill: '#F5F562',
      color: '#F5F562',
    },
  },
  {
    key: 'Depresi Aluvial/Rawa Lebak',
    pathOptions: {
      ...filledColorOptions,
      fill: '#737300',
      color: '#737300',
    },
  },
];

const kawasanHutanFeatureColors = [
  {
    key: 'Kawasan Suaka Alam/Kawasan Pelestarian Alam (KPA/KPA)',
    pathOptions: {
      fill: '#DD40FF',
      fillOpacity: 1,
      color: `#DD40FF`,
    },
  },
  {
    key: 'Hutan Lindung (HL)',
    pathOptions: {
      fill: '#06BE4E',
      fillOpacity: 1,
      color: `#06BE4E`,
    },
  },
  {
    key: 'Hutan Produksi Terbatas (HPT)',
    pathOptions: {
      fill: '#3FFF01',
      fillOpacity: 1,
      color: `#3FFF01`,
    },
  },
  {
    key: 'Hutan Produksi (HP)',
    pathOptions: {
      fill: '#FFFF04',
      fillOpacity: 1,
      color: `#FFFF04`,
    },
  },
  {
    key: 'Hutan Produksi yang Dapat Dikonversi (HPK)',
    pathOptions: {
      fill: '#FE9CC3',
      fillOpacity: 1,
      color: `#FE9CC3`,
    },
  },
  {
    key: 'Tubuh Air',
    pathOptions: {
      fill: '#01FFF1',
      fillOpacity: 1,
      color: `#01FFF1`,
    },
  },
];

const colorObject = {
  1: {
    key: 'kabupaten',
    pathOptions: {
      fill: '#C0C0C0',
      fillOpacity: 0,
      color: `#000000`,
      weight: 3,
      dashArray: '15 10 15 10',
      // dashOffset: '1',
      lineCap: 'square',
    },
  },
  2: {
    key: 'kecamatan',
    pathOptions: {
      fill: '#C0C0C0',
      fillOpacity: 0,
      color: `#000000`,
      weight: 2,
      dashArray: '15 8 5 8 15 8 5 8',
      // dashOffset: '1',
      lineCap: 'square',
    },
  },
  3: {
    key: 'desa',
    pathOptions: {
      fill: '#C0C0C0',
      fillOpacity: 0,
      color: `#000000`,
      weight: 1,
      dashArray: '15 6 2 6 2 6 15 6 2 6 2 6',
      // dashOffset: '1',
      lineCap: 'square',
    },
  },
  4: {
    key: 'perijinan perkebunan',
    pathOptions: {
      fill: '#7C1A1F',
      fillOpacity: 0,
      color: `#7C1A1F`,
      weight: 3,
      lineCap: 'round',
    },
  },
  5: {
    key: 'hak guna usaha',
    pathOptions: {
      fillPattern: hguPattern,
      color: '#007AB9', // border color
      weight: 1,
      fillOpacity: 1,
    },
  },
  6: {
    key: 'wilayah izin usaha pertambangan',
    pathOptions: {
      fillPattern: wiupPattern,
      color: '#131313', // border color
      weight: 1,
      fillOpacity: 1,
    },
  },
  7: {
    key: 'perizinan berusaha pemanfaatan hutan',
    pathOptions: {
      fill: '#FF7502',
      fillOpacity: 0,
      color: `#FF7502`,
      weight: 2,
      lineCap: 'round',
    },
  },
  8: {
    key: 'pabrik sawit 2',
    pathOptions: {
      fill: '#000000',
      fillOpacity: 1,
      color: `#ffffff`,
      weight: 1,
      lineCap: 'round',
    },
  },
  9: {
    key: 'tutupan sawit',
    pathOptions: {
      fill: '#DB79A8',
      fillOpacity: 1,
      color: `#DB79A8`,
      weight: 1,
      lineCap: 'round',
    },
  },
  10: {
    key: 'tutupan hutan',
    pathOptions: {
      fill: '#528957',
      fillOpacity: 1,
      color: `#528957`,
      weight: 1,
      lineCap: 'round',
    },
  },
};

export const FALLBACK_COLOR_OPTIONS = {
  key: 'fallback',
  pathOptions: {
    color: '#3388ff',
    weight: 1,
    fillOpacity: 0.2,
  },
};

export function getColorOptions(idOrKey, properties = null) {
  if (idOrKey === undefined || idOrKey === null) {
    return FALLBACK_COLOR_OPTIONS;
  }

  // Try numeric lookup by id
  const maybeNumber = typeof idOrKey === 'number' ? idOrKey : Number(idOrKey);
  if (!Number.isNaN(maybeNumber)) {
    const byId = colorObject[maybeNumber];
    if (byId) return byId;
  }

  // Try lookup by 'key' string
  const byKey = Object.values(colorObject).find(
    (cfg) => cfg && cfg.key === String(idOrKey)
  );

  if (idOrKey === 'kawasan hutan_2') {
    const kawasanHutanFeatureColor = kawasanHutanFeatureColors.find(
      (color) => color.key === properties?.Deskripsi
    );
    if (kawasanHutanFeatureColor) {
      return kawasanHutanFeatureColor;
    }
  }

  if (idOrKey === 'lahan gambut 2') {
    const lahanGambutFeatureColor = lahanGambutFeaturesPathOptions.find(
      (color) => color.key === properties?.LANDFORM
    );
    if (lahanGambutFeatureColor) {
      return lahanGambutFeatureColor;
    }
  }

  return byKey || FALLBACK_COLOR_OPTIONS;
}
