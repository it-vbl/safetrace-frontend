'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import RingkasanCard from '@/components/molecules/RingkasanCard';
import Select from '@/components/molecules/Select';
import useRingkasan from '@/hooks/useRingkasan';
import { getCurrentUserRoles, isDisbunak } from '@/libs/permissions';

const periodeOptions = [
  { value: '1week', label: '1 Minggu' },
  { value: '1month', label: '1 Bulan' },
  { value: '3month', label: '3 Bulan' },
  { value: '1year', label: '1 Tahun' },
];

const RingkasanPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDisbunakUser = mounted ? isDisbunak(getCurrentUserRoles()) : false;
  const [komoditas, setKomoditas] = useState('');
  const [periode, setPeriode] = useState('1month');

  const {
    loading,
    error,
    listRingkasan,
    totalRingkasan,
    fetchRingkasan,
    resetRingkasan
  } = useRingkasan();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await fetchRingkasan();
  };

  const handleFilterChange = async () => {
    const dateRange = getDateRangeFromPeriod(periode);
    await fetchRingkasan({
      komoditas: komoditas || '',
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
    });
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

  const handleDownloadPdf = () => {
    // Implement PDF download logic here
    alert('Download PDF clicked');
  };

  const handleCardButtonClick = (title) => {
    const routeMapping = {
      'Proses Pendataan': '/stdb/pendataan',
      'Proses Verifikasi': '/stdb/verifikasi',
      'Data Tidak Diterbitkan': '/stdb/tidak-terbit',
      'Proses Penerbitan': '/stdb/penerbitan',
      'Data STDB Terbit': '/stdb/data-terbit',
      'Data STDB Berakhir': '/stdb/data-berakhir',
    };

    const route = routeMapping[title];
    if (route) {
      router.push(route);
    } else {
      console.error('No route found for:', title);
      toast.error('Halaman tidak ditemukan');
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  const formatLuas = (luas) => {
    // Convert from m² to ha (1 ha = 10,000 m²)
    const luasHa = (luas || 0);
    return formatNumber(luasHa.toFixed(2));
  };

  const getRingkasanCards = () => {
    if (loading) {
      return Array(6).fill(null).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded mt-4"></div>
        </div>
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-500 mb-4">Error loading data: {error.message}</p>
          <Button variant="primary" onClick={handleFilterChange}>
            Try Again
          </Button>
        </div>
      );
    }

    // Map API data to card components based on actual response structure
    const cardData = [
      {
        key: 'proses_pendataan',
        label: 'Proses Pendataan',
        title: 'Proses Pendataan',
        pekebunCount: listRingkasan?.proses_pendataan?.pekebun || 0,
        kebunCount: listRingkasan?.proses_pendataan?.kebun || 0,
        haCount: formatLuas(listRingkasan?.proses_pendataan?.luas || 0),
      },
      {
        key: 'proses_verifikasi',
        label: 'Proses Verifikasi',
        title: 'Proses Verifikasi',
        pekebunCount: listRingkasan?.proses_verifikasi?.pekebun || 0,
        kebunCount: listRingkasan?.proses_verifikasi?.kebun || 0,
        haCount: formatLuas(listRingkasan?.proses_verifikasi?.luas || 0),
      },
      {
        key: 'data_tidak_terbit',
        label: 'Data Tidak Diterbitkan',
        title: 'Data Tidak Diterbitkan',
        pekebunCount: listRingkasan?.data_tidak_terbit?.pekebun || 0,
        kebunCount: listRingkasan?.data_tidak_terbit?.kebun || 0,
        haCount: formatLuas(listRingkasan?.data_tidak_terbit?.luas || 0),
      },
      {
        key: 'proses_penerbitan',
        label: 'Proses Penerbitan',
        title: 'Proses Penerbitan',
        pekebunCount: listRingkasan?.proses_penerbitan?.pekebun || 0,
        kebunCount: listRingkasan?.proses_penerbitan?.kebun || 0,
        haCount: formatLuas(listRingkasan?.proses_penerbitan?.luas || 0),
      },
      {
        key: 'data_stdb_terbit',
        label: 'Data STDB Terbit',
        title: 'Data STDB Terbit',
        pekebunCount: listRingkasan?.data_stdb_terbit?.pekebun || 0,
        kebunCount: listRingkasan?.data_stdb_terbit?.kebun || 0,
        haCount: formatLuas(listRingkasan?.data_stdb_terbit?.luas || 0),
      },
      {
        key: 'data_stdb_berakhir',
        label: 'Data STDB Berakhir',
        title: 'Data STDB Berakhir',
        pekebunCount: listRingkasan?.data_stdb_berakhir?.pekebun || 0,
        kebunCount: listRingkasan?.data_stdb_berakhir?.kebun || 0,
        haCount: formatLuas(listRingkasan?.data_stdb_berakhir?.luas || 0),
      },
    ];

    return cardData.map((card) => (
      <RingkasanCard
        key={card.key}
        labelText={card.label}
        title={card.title}
        pekebunCount={formatNumber(card.pekebunCount)}
        kebunCount={formatNumber(card.kebunCount)}
        haCount={card.haCount}
        buttonText={`Lihat ${card.title}`}
        onButtonClick={() => handleCardButtonClick(card.title)}
      />
    ));
  };

  return (
    <div className="p-4 md:p-8 bg-primary/5 min-h-screen w-full">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
        <h1 className="text-xl font-bold mb-4 lg:mb-0">DATA RINGKASAN SEPANJANG WAKTU</h1>
        <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              options={[]}
              value={komoditas}
              onChange={(e) => setKomoditas(e.target.value)}
              placeholder="Pilih Komoditas"
            />
            <Select
              options={periodeOptions}
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              placeholder="Pilih Periode"
            />
          </div>
          <Button
            variant="primary"
            size="medium"
            onClick={handleFilterChange}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Filter'}
          </Button>
          {!isDisbunakUser && (
            <Button
              icon={<DownloadIcon width={16} height={16} />}
              variant="primary"
              size="medium"
              onClick={handleDownloadPdf}
              disabled={loading}
            >
              Unduh Pdf
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getRingkasanCards()}
      </div>
    </div>
  );
};

export default RingkasanPage;
