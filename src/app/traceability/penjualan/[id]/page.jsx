'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import AttachmentViewer from '@/components/molecules/AttachmentViewer';
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

const PenjualanDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

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
                // Support paginated and non-paginated responses
                const kelompokPenyetorRaw =
                  kelompokPenyetorResponse?.data?.data?.results ||
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
              ...angkutanData,
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

  const handleEditData = (tab = 'angkutan') => {
    if (!id) return;
    // Redirect to edit page with angkutan ID and tab parameter
    router.push(`/traceability/penjualan/${id}/edit?tab=${tab}`);
  };

  const dataToRender = detailData;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BreadcrumbDetail items={crumbs} />
      </div>

      <div className="relative min-h-[70vh]">
        <SectionLoading loading={loading} />

        {dataToRender ? (
          <div className="flex flex-col gap-6">
            <PenjualanDetailAngkutanCard
              data={dataToRender?.angkutan}
              onEdit={() => handleEditData('angkutan')}
            />
            <PenjualanDetailKelompokCard
              data={dataToRender?.kelompok_tani}
              onEdit={() => handleEditData('kelompok_tani')}
            />
            <PenjualanDetailPabrikCard
              data={dataToRender?.pabrik}
              onEdit={() => handleEditData('pabrik')}
            />

            <section className="rounded border border-gray-300 bg-white p-4 sm:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="mb-2 font-semibold sm:mb-4">LAMPIRAN</h3>
                <button
                  onClick={() => handleEditData('lampiran')}
                  className="self-start text-sm text-primary underline hover:text-blue-800 sm:self-auto"
                >
                  Ubah Data
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {dataToRender?.angkutan?.lampiran && dataToRender.angkutan.lampiran.length > 0 ? (
                  dataToRender.angkutan.lampiran.map((item, index) => (
                    <AttachmentViewer
                      key={item.id || index}
                      label={`Gambar ${index + 1}`}
                      fileUrl={item.file || item.file_url || item.url || item}
                      thumbUrl={item.thumb || item.file || item.file_url || item.url || item}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-sm text-gray-500">Belum ada lampiran.</div>
                )}
              </div>
            </section>
          </div>
        ) : !loading ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-gray-500">
            Data detail penjualan tidak ditemukan.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PenjualanDetailPage;
