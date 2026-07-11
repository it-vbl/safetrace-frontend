'use client';

import { useEffect, useMemo, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import DashboardCard2 from '@/components/atoms/DashboardCard2';
import Heading from '@/components/atoms/Typography/Heading';
import Select from '@/components/molecules/Select';
import JumlahSTDBBerdasarkanKomoditasPieChart from '@/components/organisms/JumlahSTDBBerdasarkanKomoditasPieChart'; // Importing the Pie Chart component
import LahanTanamPerKomoditasCard from '@/components/organisms/LahanTanamPerKomoditasCard';
import STDBProcessStepChart from '@/components/organisms/STDBProcessStepChart'; // Importing the chart component
import useAnalisis from '@/hooks/useAnalisis';
import useReferences from '@/hooks/useReferences';
import numberFormat from '@/libs/utils/numberFormat';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const periodeOptions = [
  { value: '1week', label: '1 Minggu' },
  { value: '1month', label: '1 Bulan' },
  { value: '3month', label: '3 Bulan' },
  { value: '1year', label: '1 Tahun' },
];

const MapDashboard = () => {
  const [komoditas, setKomoditas] = useState('');
  const [periode, setPeriode] = useState('1month');

  const {
    loading,
    stdbStatistik,
    jenisPupukStatistik,
    polaTanamStatistik,
    eksPlasmaStatistik,
    fetchStdbStatistik,
    fetchJenisPupukStatistik,
    fetchPolaTanamStatistik,
    fetchEksPlasmaStatistik,
  } = useAnalisis();
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const dateRange = getDateRangeFromPeriod(periode);
    const params = {
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
    };

    await Promise.all([
      fetchStdbStatistik(params),
      fetchJenisPupukStatistik(params),
      fetchPolaTanamStatistik(params),
      fetchEksPlasmaStatistik(params),
    ]);
  };

  const getDateRangeFromPeriod = (period) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '1week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3month':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    handleFilterChange();
  }, [periode, komoditas]);

  const dateRange = useMemo(() => getDateRangeFromPeriod(periode), [periode]);

  const handleFilterChange = async () => {
    const dateRange = getDateRangeFromPeriod(periode);
    const params = {
      komoditas: komoditas || '',
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
    };

    await Promise.all([
      fetchStdbStatistik(params),
      fetchJenisPupukStatistik(params),
      fetchPolaTanamStatistik(params),
      fetchEksPlasmaStatistik(params),
    ]);
  };

  const dashboardCard = useMemo(() => {
    return [
      {
        tag: 'Data STDB',
        value: stdbStatistik.total_stdb || 0,
      },
      {
        tag: 'STDB Telah Terbit',
        value: stdbStatistik.total_stdb_telah_terbit || 0,
        tagBg: '#D0FAED',
      },
      {
        tag: 'STDB Tidak Terbit',
        value: stdbStatistik.total_stdb_tidak_terbit || 0,
        tagBg: '#FDD0CE',
      },
      {
        tag: 'Total Luas Kebun (ha)',
        value: stdbStatistik.total_luas_kebun_polygon || 0,
      },
      {
        tag: 'Total Luas Kebun Sertifikat (ha)',
        value: stdbStatistik.total_luas_kebun_sertifikat || 0,
      },
      {
        tag: 'Pekebun',
        value: stdbStatistik.total_pekebun || 0,
      },
      {
        tag: 'Kebun',
        value: stdbStatistik.total_kebun || 0,
      },
      {
        tag: 'Kecamatan',
        value: stdbStatistik.total_kecamatan || 0,
      },
    ];
  }, [stdbStatistik, loading]);

  const DashboardCard = ({ value, tagBg, tag }) => {
    return (
      <div className="flex flex-col items-start rounded-[2px] border border-neutral-300 p-3 sm:p-4">
        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          {numberFormat(value)}
        </span>
        <div
          style={{ background: tagBg || '#00000033' }}
          className={`rounded-[4px] text-xs sm:text-sm p-2 px-2 sm:px-3 py-1 mt-2`}
        >
          {tag}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 sm:mb-6">
          <Heading
            level={1}
            className="text-xl sm:text-2xl lg:text-3xl mb-4 lg:mb-0"
          >
            DATA ANALISIS SEPANJANG WAKTU
          </Heading>
          <div className="flex sm:flex-row sm:items-end sm:justify-end gap-3 sm:gap-4 w-full lg:w-auto">
            <Select
              options={[]}
              value={komoditas}
              onChange={(e) => setKomoditas(e.target.value)}
              placeholder="Pilih Komoditas"
              className="w-full sm:w-48"
            />
            <Select
              options={periodeOptions}
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              placeholder="Pilih Periode"
              className="w-full sm:w-40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {dashboardCard?.map((data) => {
            return (
              <DashboardCard
                key={data?.tag}
                value={data?.value}
                tag={data?.tag}
                tagBg={data?.tagBg}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="col-span-1 lg:col-span-3">
            <LahanTanamPerKomoditasCard
              komoditas={komoditas}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>

          <div className="flex flex-col gap-4">
            <DashboardCard2
              title={'Jenis Pupuk'}
              data={
                jenisPupukStatistik
                  ? [
                      {
                        label: 'Organik',
                        value: jenisPupukStatistik.organik || 0,
                      },
                      {
                        label: 'Anorganik',
                        value: jenisPupukStatistik.anorganik || 0,
                      },
                      {
                        label: 'Kombinasi',
                        value: jenisPupukStatistik.kombinasi || 0,
                      },
                    ]
                  : [
                      { label: 'Organik', value: 0 },
                      { label: 'Anorganik', value: 0 },
                      { label: 'Kombinasi', value: 0 },
                    ]
              }
              tagBg={'#FDD0CE'}
            />

            <DashboardCard2
              title={'Pola Tanam'}
              data={
                polaTanamStatistik
                  ? [
                      {
                        label: 'Monokultur',
                        value: polaTanamStatistik.monokultur || 0,
                      },
                      {
                        label: 'Polikultur',
                        value: polaTanamStatistik.polikultur || 0,
                      },
                    ]
                  : [
                      { label: 'Monokultur', value: 0 },
                      { label: 'Polikultur', value: 0 },
                    ]
              }
              tagBg={'#FDD0CE'}
            />

            <DashboardCard2
              title={'Eks Plasma'}
              data={
                eksPlasmaStatistik
                  ? [
                      { label: 'Ya Plasma', value: eksPlasmaStatistik.ya || 0 },
                      {
                        label: 'Tidak Plasma',
                        value: eksPlasmaStatistik.tidak || 0,
                      },
                    ]
                  : [
                      { label: 'Ya Plasma', value: 0 },
                      { label: 'Tidak Plasma', value: 0 },
                    ]
              }
              tagBg={'#D0FAED'}
            />
          </div>
          <div className="md:col-span-2 ">
            <STDBProcessStepChart
              komoditas={komoditas}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>
          <div className="md:col-span-2 ">
            <JumlahSTDBBerdasarkanKomoditasPieChart
              komoditas={komoditas}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;
