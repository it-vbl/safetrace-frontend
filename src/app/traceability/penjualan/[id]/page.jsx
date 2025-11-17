'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import SectionLoading from '@/components/molecules/SectionLoading';
import {
  PenjualanDetailAngkutanCard,
  PenjualanDetailKelompokCard,
  PenjualanDetailPabrikCard,
} from '@/components/organisms/PenjualanDetail';
import { getDetailPenjualan } from '@/services/penjualan';

const mockDetailPenjualan = {
  angkutan: {
    tanggal_penjualan: '2025-10-25',
    driver: 'Welly',
    no_registrasi: '186591-P08-231025',
    no_polisi: 'KB9194AG',
    jumlah_tandan: 546,
    berat_timbangan: 12520,
    tarra: 4280,
    t_potongan_persen: 3,
    t_potongan_kg: 247,
    berat_bersih: 4280,
    harga_per_kilo: 3602,
    total_penjualan: 28790786,
  },
  kelompok_tani: [
    {
      id: 'kelompok-1',
      kelompok_penyetor: {
        id: 'kel-01',
        nama: 'Bepekaek Besamo',
      },
      anggota_petani: [
        { id: 'petani-1', nama: 'Akeng Rupinus' },
        { id: 'petani-2', nama: 'Fajar Sukmara' },
        { id: 'petani-3', nama: 'Dedy Junaidi' },
        { id: 'petani-4', nama: 'Risto Kristo' },
      ],
    },
    {
      id: 'kelompok-2',
      kelompok_penyetor: {
        id: 'kel-02',
        nama: 'Bepekaek Besamo',
      },
      anggota_petani: [
        { id: 'petani-5', nama: 'Akeng Rupinus' },
        { id: 'petani-6', nama: 'Fajar Sukmara' },
        { id: 'petani-7', nama: 'Dedy Junaidi' },
        { id: 'petani-8', nama: 'Risto Kristo' },
      ],
    },
  ],
  pabrik: {
    pabrik_penerima: 'PT Jaya Bersama Selalu',
    provinsi: 'Akeng Rupinus',
    kabupaten: 'Bepekaek Besamo',
    kecamatan: 'Dusun Gonis Rabu',
    alamat: '0.78',
  },
};

const PenjualanDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);

  const crumbs = useMemo(
    () => [
      { label: 'PENJUALAN', href: '/traceability/penjualan' },
      { label: 'DETAIL PENJUALAN' },
    ],
    []
  );

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await getDetailPenjualan(id);
        if (response?.status === 200) {
          setDetailData(response?.data?.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Failed to fetch penjualan detail:', error);
        toast.error('Gagal memuat detail penjualan, menampilkan data contoh.');
        setDetailData(mockDetailPenjualan);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleEditData = () => {
    if (!id) return;
    router.push(`/traceability/penjualan/tambah?idPenjualan=${id}`);
  };

  const handleTambahPenjualan = () => {
    router.push('/traceability/penjualan/tambah');
  };

  const dataToRender = detailData || mockDetailPenjualan;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BreadcrumbDetail items={crumbs} />
      </div>

      <div className="relative min-h-[320px]">
        <SectionLoading loading={loading} />

        {dataToRender ? (
          <div className="flex flex-col gap-6">
            <PenjualanDetailAngkutanCard
              data={dataToRender?.angkutan}
              onEdit={handleEditData}
            />
            <PenjualanDetailKelompokCard
              data={dataToRender?.kelompok_tani}
              onEdit={handleEditData}
            />
            <PenjualanDetailPabrikCard
              data={dataToRender?.pabrik}
              onEdit={handleEditData}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-gray-500">
            Data detail penjualan tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default PenjualanDetailPage;
