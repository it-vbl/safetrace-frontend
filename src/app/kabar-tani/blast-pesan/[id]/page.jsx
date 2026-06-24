'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import Heading from '@/components/atoms/Typography/Heading';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';
import {
  getBroadcastDetail,
  getBroadcastKontakList,
} from '@/services/broadcast';

ModuleRegistry.registerModules([AllCommunityModule]);

const DetailPesanPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [summaryCounts, setSummaryCounts] = useState({
    success: 0,
    failed: 0,
    pending: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const breadcrumbItems = [
    { label: 'BLAST PESAN', href: '/kabar-tani/blast-pesan' },
    { label: 'DETAIL PESAN' },
  ];

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getBroadcastDetail(id);
        const data = res?.data?.data || res?.data || {};
        const createdAt = data?.created_at || data?.waktu_pengiriman;
        const waktuPengiriman = createdAt
          ? new Date(createdAt).toLocaleString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
          : '-';
        const jumlahPenerima =
          data?.jumlah_penerima ??
          data?.total_penerima ??
          (Array.isArray(data?.kontak_ids)
            ? data.kontak_ids.length
            : data?.recipient_count ?? 0);
        const deviceData = data?.device_data || {};
        const pengirimNama =
          data?.no_pengirim_nama || data?.device_nama || deviceData?.nama;
        const pengirimNo =
          data?.no_pengirim ||
          data?.device_no ||
          data?.no_wa_pengirim ||
          deviceData?.no_wa;

        const jenisPenerimaLabel =
          data?.jenis_penerima_label ||
          (data?.jenis_penerima === 'grup' ? 'Kontak Grup' : 'Kontak Individu');

        const statusLabel = (() => {
          if (data?.terkirim === true) return 'Terkirim';
          if (data?.gagal === true) return 'Gagal';
          return data?.status || 'Menunggu';
        })();

        const mappedDetail = {
          id_pesan:
            data?.id_pesan || `BC-${String(data?.id || 0).padStart(4, '0')}`,
          nama_pesan: data?.nama_pesan || data?.nama || '-',
          grup_penerima:
            data?.grup_penerima || data?.grup_nama || jenisPenerimaLabel,
          jumlah_penerima: jumlahPenerima,
          waktu_pengiriman: waktuPengiriman,
          status: statusLabel,
          sender:
            pengirimNama && pengirimNo
              ? `${pengirimNama} - ${pengirimNo}`
              : data?.no_pengirim || '-',
          isi_pesan: data?.isi_pesan || data?.pesan || '',
        };
        setDetail(mappedDetail);

        const recRes = await getBroadcastKontakList(id);
        const recData = recRes?.data?.data || recRes?.data || {};
        const list = recData?.results || recData || [];
        const mappedRecipients = (list || []).map((r, idx) => {
          const rawTime =
            r?.waktu_pengiriman ||
            r?.created_at ||
            r?.sent_at ||
            r?.updated_at ||
            r?.time;
          const sendTime = rawTime
            ? new Date(rawTime).toLocaleString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
            : '-';

          let status =
            r?.status ||
            r?.status_label ||
            r?.status_kirim ||
            r?.keterangan ||
            '';

          if (!status) {
            if (r?.gagal === true || r?.wa_valid === false) {
              status = 'Gagal';
            } else if (r?.terkirim === true) {
              status = 'Terkirim';
            } else if (data?.terkirim === true && r?.wa_valid === true) {
              status = 'Terkirim';
            } else {
              status = 'Menunggu';
            }
          }

          return {
            no: idx + 1,
            name: r?.nama ?? r?.name ?? '-',
            phone: r?.no_wa ?? r?.phone ?? '-',
            sendTime,
            status,
          };
        });
        setRecipients(mappedRecipients);

        const normalize = (s) => String(s || '').toLowerCase();
        const success = mappedRecipients.filter((r) => {
          const st = normalize(r.status);
          return (
            st.includes('terkirim') ||
            st.includes('success') ||
            st.includes('sent') ||
            st.includes('berhasil')
          );
        }).length;
        const failed = mappedRecipients.filter((r) => {
          const st = normalize(r.status);
          return (
            st.includes('gagal') ||
            st.includes('failed') ||
            st.includes('error') ||
            st.includes('cancel')
          );
        }).length;
        const pending = Math.max(
          (mappedRecipients || []).length - success - failed,
          0
        );
        setSummaryCounts({ success, failed, pending });
      } catch (e) {
        console.error('Error fetching broadcast detail:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitGridWidth',
    };
  }, []);

  const paginatedRecipients = recipients.slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize
  );

  return (
    <div className="relative w-full bg-gray-50">
      <SectionLoading loading={loading} fixed />
      <div className="mx-auto flex h-full w-full min-w-[320px] max-w-7xl flex-col gap-6 p-2">
        {/* Breadcrumb */}
        <BreadcrumbDetail items={breadcrumbItems} />

        {/* LOG Section */}
        <div className="rounded-[4px] border border-gray-200 bg-white">
          <Heading
            level={3}
            className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
          >
            LOG
          </Heading>

          <div className="mb-6 px-6 space-y-6">
            {/* Top Details Grid */}
            <div className="grid grid-cols-1 gap-x-3 gap-y-4 break-words text-sm text-gray-700 sm:grid-cols-2 sm:gap-x-4 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-6">
              <BorderBottomColData
                label="Id Pesan"
                value={detail?.id_pesan || '-'}
              />
              <BorderBottomColData
                label="Nama Pesan"
                value={detail?.nama_pesan || '-'}
              />
              <BorderBottomColData
                label="Grup Penerima"
                value={detail?.grup_penerima || '-'}
              />
              <BorderBottomColData
                label="Jumlah Penerima"
                value={String(detail?.jumlah_penerima ?? 0)}
              />
              <BorderBottomColData
                label="Waktu Pengiriman"
                value={detail?.waktu_pengiriman || '-'}
              />
              <BorderBottomColData
                label="Status"
                value={detail?.status || '-'}
              />
            </div>

            {/* Bottom Summary Grid */}
            <div className="grid grid-cols-12 gap-x-3 gap-y-4 break-words text-sm text-gray-700 sm:gap-x-4 md:gap-x-6">
              <div className="col-span-12 sm:col-span-4 md:col-span-2">
                <BorderBottomColData
                  label="Total Berhasil"
                  value={String(summaryCounts.success)}
                />
              </div>
              <div className="col-span-12 sm:col-span-4 md:col-span-2">
                <BorderBottomColData
                  label="Total Gagal"
                  value={String(summaryCounts.failed)}
                />
              </div>
              <div className="col-span-12 sm:col-span-4 md:col-span-2">
                <BorderBottomColData
                  label="Total Berjalan"
                  value={String(summaryCounts.pending)}
                />
              </div>
              <div className="col-span-12 sm:col-span-12 md:col-span-6">
                <BorderBottomColData
                  className="line-clamp-none"
                  label="Pengirim"
                  value={detail?.sender || '-'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PESAN Section */}
        <div className="rounded-[4px] border border-gray-200 bg-white">
          <Heading
            level={3}
            className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
          >
            PESAN
          </Heading>

          <div className="mb-6 px-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left Side: Message Content Card */}
              <div className="min-h-[298px] w-full lg:w-1/2 rounded-[4px] border border-gray-200 bg-white p-6 text-sm text-gray-800 whitespace-pre-line break-words leading-relaxed">
                {detail?.isi_pesan || '-'}
              </div>

              {/* Right Side: WhatsApp-style Preview Card */}
              <div className="min-h-[298px] w-full lg:w-1/2 rounded-[4px] border border-gray-200 bg-[#faf1dc] p-6 flex flex-col">
                <span className="block text-sm font-bold text-gray-800 mb-4">
                  Preview
                </span>
                <div className="relative max-w-[90%] sm:max-w-[80%] rounded-[8px] bg-white p-4 shadow-sm w-fit self-start">
                  <p className="whitespace-pre-line break-words text-sm text-gray-800 leading-relaxed">
                    {detail?.isi_pesan || 'Preview pesan akan muncul di sini...'}
                  </p>
                  <div className="text-[10px] text-gray-400 text-right mt-2 font-medium">
                    {detail?.waktu_pengiriman?.split(', ')?.[1] || '07.00'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PENERIMA Section */}
        <div className=" rounded-[4px] border border-gray-200 bg-white">
          <Heading
            level={3}
            className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
          >
            PENERIMA
          </Heading>

          <div className="mb-6 px-6">
            <div className="ag-theme-quartz relative w-full">
              <AgGridReact
                overlayLoadingTemplate="."
                autoSizeStrategy={autoSizeStrategy}
                defaultColDef={{
                  resizable: true,
                  minWidth: 100,
                  wrapText: true,
                  autoHeight: true,
                }}
                domLayout="autoHeight"
                rowData={paginatedRecipients}
                columnDefs={[
                  {
                    field: 'no',
                    headerName: 'No.',
                    minWidth: 70,
                    maxWidth: 90,
                  },
                  {
                    field: 'name',
                    headerName: 'Penerima',
                    minWidth: 150,
                    flex: 2,
                  },
                  {
                    field: 'phone',
                    headerName: 'No. Handphone',
                    minWidth: 150,
                    flex: 2,
                  },
                  {
                    field: 'sendTime',
                    headerName: 'Waktu Pengiriman',
                    minWidth: 180,
                    flex: 2,
                  },
                  {
                    field: 'status',
                    headerName: 'Status',
                    minWidth: 120,
                    flex: 1,
                  },
                ]}
              />
            </div>
            {/* Pagination */}
            <div className="mt-4 flex justify-center sm:justify-end">
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={recipients.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showRowsPerPage={true}
                labels={{
                  rowsPerPage: 'Baris Per Halaman',
                  showing: 'Menampilkan',
                  of: 'dari',
                }}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPesanPage;
