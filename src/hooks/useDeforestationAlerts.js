import { useCallback, useEffect, useState } from 'react';

import { getDeforestationAlerts } from '@/services/alert';

const useDeforestationAlerts = ({
  page = 1,
  page_size = 10,
  search = '',
  kabupaten = '',
  kecamatan = '',
  source_type = 'glad',
} = {}) => {
  const [alertList, setAlertList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalAlerts, setTotalAlerts] = useState(0);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        page_size,
        kabupaten: kabupaten ? String(kabupaten).replace(/\./g, '') : '',
        kecamatan: kecamatan ? String(kecamatan).replace(/\./g, '') : '',
        source_type,
      };

      // Only add search if it's not empty
      if (search && search.trim() !== '') {
        params.search = search;
      }

      const response = await getDeforestationAlerts(params);
      const data = response?.data?.data;

      if (data) {
        setAlertList(data.results || []);
        setTotalAlerts(data.count || 0);
      }
    } catch (err) {
      console.error('Error fetching deforestation alerts:', err);
      setError(err);
      setAlertList([]);
      setTotalAlerts(0);
    } finally {
      setLoading(false);
    }
  }, [page, page_size, search, kabupaten, kecamatan, source_type]);

  const transformAlertsForTable = useCallback((alerts) => {
    return alerts.map((alert) => ({
      id: alert.id,
      id_alert: alert.label || `ALERT-${alert.id}`,
      lokasi_alert: alert.titik_lokasi || { coordinates: [] },
      area_deforestasi: alert.area_ha || 0,
      tanggal_terdeteksi: alert.date || '-',
      alert_type: alert.source_type?.toUpperCase() || '-',
      kabupaten: alert.kabupaten || '-',
      kecamatan: alert.kecamatan || '-',
      desa: alert.desa || '-',
      provinsi: alert.provinsi || '-',
      obyek_terdampak: alert.obyek_terdampak || '-',
      geom: alert.geom || null,
      created_at: alert.created_at || '-',
      updated_at: alert.updated_at || '-',
    }));
  }, []);

  return {
    alertList,
    loading,
    error,
    totalAlerts,
    fetchAlerts,
    transformAlertsForTable,
  };
};

export default useDeforestationAlerts;
