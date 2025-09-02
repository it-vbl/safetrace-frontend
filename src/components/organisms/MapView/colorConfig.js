import L from 'leaflet';

import 'leaflet.pattern';

const stripePattern = new L.StripePattern({
  weight: 1, // thickness of stripe
  spaceWeight: 6, // spacing between stripes
  color: '#2394C6', // stripe color
  fillOpacity: 1,
  angle: 135, // diagonal angle
});

// 👇 Call this once after you have map instance
export function registerPatterns(map) {
  stripePattern.addTo(map);
}

const colorObject = {
  1: {
    key: 'sipekebun-desa',
    pathOptions: {
      fill: '#C0C0C0',
      fillOpacity: 0,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      weight: 1,
    },
  },
  2: {
    key: 'sipekebun-desa',
    pathOptions: {
      color: `#7A7A7A`,
      dashArray: '2 6',
      dashOffset: '1',
      lineCap: 'square',
      weight: 1,
      fillOpacity: 0,
    },
  },
  3: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      color: `#7A7A7A`,
      fillOpacity: 0,
      lineCap: 'square',
      lineJoin: 'square',
      dashArray: '2 4 2 4 10 4',
      dashOffset: '1',
      weight: 1,
    },
  },
  4: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      fillColor: '#9B4E23',
      stroke: true,
      fillOpacity: 1,
      color: `#654230`,
      weight: 1,
    },
  },
  5: {
    key: 'sipekebun-kecamatan',
    pathOptions: {
      fillColor: '#C93D80',
      fillOpacity: 1,
      border: false,
      weight: 0,
    },
  },
  6: {
    key: 'sipekebun_hgu',
    pathOptions: {
      fillColor: '#2394C6',
      fillOpacity: 1,
      border: false,
      weight: 0,
    },
  },

  // ✅ NEW: Polygon with diagonal stripe pattern
  7: {
    key: 'sipekebun-stripe',
    pathOptions: {
      fillPattern: stripePattern, // use the pattern
      color: '#2394C6', // border color
      weight: 1,
      fillOpacity: 1,
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

export function getColorOptions(idOrKey) {
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

  return byKey || FALLBACK_COLOR_OPTIONS;
}
