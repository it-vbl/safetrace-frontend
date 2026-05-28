import { useCallback, useState } from 'react';

import { getListKebun } from '@/services/pekebun';

const useKebun = ({
  page_size = 10,
  page = 1,
  search = '',
  kelompok = '',
  rspo = '',
  ispo = '',
  legalitas = '',
  petani_id = '',
  start_date = '',
  end_date = '',
} = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kebunList, setKebunList] = useState([]);
  const [totalKebun, setTotalKebun] = useState(0);

  const fetchKebun = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (page_size) params.set('page_size', page_size);
      if (page) params.set('page', page);
      if (search) params.set('search', search);
      if (kelompok) params.set('kelompok_tani', kelompok);
      if (rspo) params.set('rspo', rspo === 'sudah');
      if (ispo) params.set('ispo', ispo === 'sudah');
      if (legalitas) params.set('jenis_legalitas', legalitas);
      if (petani_id) params.set('petani_id', petani_id);
      if (start_date) params.set('start_date', start_date);
      if (end_date) params.set('end_date', end_date);

      const response = await getListKebun(params.toString());

      if (response?.data?.status === 'success') {
        const kebunData = response.data.data.results || [];
        setKebunList(kebunData);
        setTotalKebun(response.data.data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching kebun:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [page_size, page, search, kelompok, rspo, ispo, legalitas, petani_id, start_date, end_date]);

  // Transform kebun data for table display
  const transformKebunForTable = useCallback((kebunData) => {
    if (!kebunData || kebunData.length === 0) return [];

    return kebunData.map((kebun) => {
      // Transform geom coordinates from [lng, lat] to [lat, lng] for display
      const geomCoordinates = kebun?.geom?.coordinates?.[0]?.map((coord) => [
        coord[1],
        coord[0],
      ]);

      return {
        ...kebun,
        pekebun: { nama: kebun.nama_petani || '' },
        kelompok: kebun.kelompok_tani || '',
        lahan: {
          kecamatan_label: '', // Not available in API response
          desa_label: '', // Not available in API response
          luas_lahan: kebun.luas_kebun ? kebun.luas_kebun * 10000 : 0, // Convert Ha to m2
        },
        peta: {
          titik_koordinat: kebun.titik_koordinat || null,
          geom:
            kebun.geom && geomCoordinates
              ? {
                  coordinates: geomCoordinates,
                }
              : null,
        },
        waktu_tanam: kebun.waktu_tanam || '',
        rspo: kebun.is_rspo ? 'Sudah' : 'Belum',
        ispo: kebun.is_ispo ? 'Sudah' : 'Belum',
        legalitas: kebun.jenis_legalitas_label || '',
        risiko_deforestasi: kebun.risiko_deforestasi || '',
        lokasi_kebun: kebun.lokasi_kebun || '',
        luas_kebun: kebun.luas_kebun || 0,
      };
    });
  }, []);

  // Transform kebun data for map display
  const transformKebunForMap = useCallback((kebunData) => {
    if (!kebunData || kebunData.length === 0) return [];

    return kebunData.map((kebun) => {
      // Transform geom coordinates from [lng, lat] to [lat, lng] for Leaflet
      // The API returns coordinates as [[[lng, lat], [lng, lat], ...]]
      // MapView expects coordinates as [[lat, lng], [lat, lng], ...]
      const geomCoordinates = kebun?.geom?.coordinates?.[0]?.map((coord) => [
        coord[1],
        coord[0],
      ]);

      return {
        ...kebun,
        peta: {
          geom:
            kebun.geom && geomCoordinates
              ? {
                  type: 'Polygon',
                  coordinates: geomCoordinates,
                }
              : null,
          titik_koordinat: kebun.titik_koordinat || null,
        },
        lahan: {
          status_lahan_label: '', // Not available in API response
          luas_lahan: kebun.luas_kebun ? kebun.luas_kebun * 10000 : 0, // Convert Ha to m2
          kecamatan_label: '', // Not available in API response
          desa_label: '', // Not available in API response
        },
        komoditas_info: '', // Not available in API response
        pekebun: {
          nama: kebun.nama_petani || '',
        },
        status_stdb: '', // Not available in API response
        status_stdb_label: '', // Not available in API response
        kelompok_tani: kebun.kelompok_tani || '',
        lokasi_kebun: kebun.lokasi_kebun || '',
      };
    });
  }, []);

  return {
    kebunList,
    loading,
    error,
    totalKebun,
    fetchKebun,
    transformKebunForTable,
    transformKebunForMap,
  };
};

export default useKebun;
