export default function isKebunDataComplete(data) {
  // Rule 1: Komoditas must be filled with at least 1 item
  if (!Array.isArray(data.komoditas) || data.komoditas.length === 0) {
    return true;
  }

  // Rule 2: Polygon coordinate must have at least 3 points
  const coordinates = data?.peta?.geom?.coordinates?.[0];
  if (!Array.isArray(coordinates) || coordinates.length < 3) {
    return true;
  }

  // Rule 3: Check if any other field is missing or empty
  const requiredFields = [
    'lahan.eks_plasma',
    'lahan.status_lahan',
    'lahan.no_dokumen',
    'lahan.luas_lahan',
    'lahan.kecamatan',
    'lahan.desa',
    'pola_tanam',
    'komoditas_info',
    'jenis_pupuk',
    'mitra_penjualan',
    'peta.titik_koordinat.type',
    'peta.titik_koordinat.coordinates',
    'peta.geom.type',
  ];

  for (const path of requiredFields) {
    const keys = path.split('.');
    let current = data;

    for (const key of keys) {
      if (current && Object.prototype.hasOwnProperty.call(current, key)) {
        current = current[key];
      } else {
        return true;
      }
    }

    // Also check for null, undefined, or empty string/array
    if (
      current === undefined ||
      current === null ||
      (typeof current === 'string' && current.trim() === '') ||
      (Array.isArray(current) && current.length === 0)
    ) {
      return true;
    }
  }

  return false;
}
