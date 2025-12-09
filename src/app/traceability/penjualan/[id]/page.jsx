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
import {
  getDetailPenjualanAngkutan,
  getDetailPenjualanKelompokPenyetor,
  getDetailPenjualanPabrik,
} from '@/services/penjualan';

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
        // Fetch angkutan detail (id is angkutan ID)
        const angkutanResponse = await getDetailPenjualanAngkutan(id);
        if (
          angkutanResponse?.status === 200 &&
          (angkutanResponse?.data?.status === 'success' ||
            angkutanResponse?.data?.data)
        ) {
          const angkutanData =
            angkutanResponse?.data?.data || angkutanResponse?.data;

          let kelompokTaniData = [];
          let pabrikData = null;

          // Fetch kelompok penyetor using id_penjualan from angkutan
          if (angkutanData?.id_penjualan) {
            try {
              const kelompokPenyetorResponse =
                await getDetailPenjualanKelompokPenyetor(
                  angkutanData.id_penjualan
                );
              if (
                kelompokPenyetorResponse?.status === 200 &&
                (kelompokPenyetorResponse?.data?.status === 'success' ||
                  kelompokPenyetorResponse?.data?.data)
              ) {
                const kelompokPenyetorRaw =
                  kelompokPenyetorResponse?.data?.data ||
                  kelompokPenyetorResponse?.data;

                // Handle both array and single object responses
                const kelompokPenyetorArray = Array.isArray(kelompokPenyetorRaw)
                  ? kelompokPenyetorRaw
                  : [kelompokPenyetorRaw];

                // Transform to match card component structure
                kelompokTaniData = kelompokPenyetorArray.map((item) => ({
                  id: item.id,
                  kelompok_penyetor: {
                    nama: item.nama_kelompok,
                  },
                  anggota_petani: (item.anggota_petani || []).map((petani) => ({
                    id: petani.id,
                    nama: petani.nama,
                  })),
                }));
              }
            } catch (error) {
              console.error('Failed to fetch kelompok penyetor:', error);
            }
          }

          // Fetch pabrik detail using pabrik ID from angkutan
          // Always call the pabrik detail endpoint if pabrik ID exists
          if (angkutanData?.pabrik) {
            try {
              const pabrikResponse = await getDetailPenjualanPabrik(
                angkutanData.pabrik
              );
              if (
                pabrikResponse?.status === 200 &&
                (pabrikResponse?.data?.status === 'success' ||
                  pabrikResponse?.data?.data)
              ) {
                const pabrikRaw =
                  pabrikResponse?.data?.data || pabrikResponse?.data;
                pabrikData = {
                  nama: pabrikRaw.nama,
                  pabrik_penerima: pabrikRaw.nama,
                  provinsi_label: pabrikRaw.provinsi_label,
                  kabupaten_label: pabrikRaw.kabupaten_label,
                  kecamatan_label: pabrikRaw.kecamatan_label,
                  provinsi: pabrikRaw.provinsi,
                  kabupaten: pabrikRaw.kabupaten,
                  kecamatan: pabrikRaw.kecamatan,
                  alamat: pabrikRaw.alamat,
                };
              }
            } catch (error) {
              console.error('Failed to fetch pabrik:', error);
            }
          }

          // Set the transformed data
          setDetailData({
            angkutan: {
              tanggal_penjualan: angkutanData.tanggal_penjualan,
              driver: angkutanData.driver,
              no_registrasi: angkutanData.no_registrasi,
              no_polisi: angkutanData.no_polisi,
              jumlah_tandan: angkutanData.jumlah_tandan,
              berat_timbangan: angkutanData.berat_timbangan,
              tarra: angkutanData.tarra,
              t_potongan_persen: angkutanData.t_potongan_persen,
              t_potongan_kg: angkutanData.t_potongan_kg,
              berat_bersih: angkutanData.berat_bersih,
              harga_per_kilo: angkutanData.harga_per_kilo,
              total_penjualan: angkutanData.total_penjualan,
            },
            kelompok_tani: kelompokTaniData,
            pabrik: pabrikData,
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Failed to fetch penjualan detail:', error);
        toast.error('Gagal memuat detail penjualan');
        setDetailData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleEditData = () => {
    if (!id) return;
    // Redirect to edit page with angkutan ID
    router.push(`/traceability/penjualan/${id}/edit`);
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
