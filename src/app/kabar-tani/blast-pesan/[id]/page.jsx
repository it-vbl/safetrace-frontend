'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputMessage from '@/components/molecules/InputMessage';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';
import {
  getBroadcastDetail,
  getBroadcastKontakList,
} from '@/services/broadcast';

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

          let status = r?.status || r?.status_label || r?.status_kirim || r?.keterangan || '';
          if (!status) {
            if (r?.gagal === true) status = 'Gagal';
            else if (r?.terkirim === true) status = 'Terkirim';
            else status = 'Menunggu';
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

  const paginatedRecipients = recipients.slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize
  );

  return (
    <div className="relative w-full bg-gray-50">
      <SectionLoading loading={loading} />
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-6 p-2">
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

          <div className="mb-6 px-6">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-4 border-b border-gray-200 pb-2 text-sm font-medium text-gray-600">
              <div>Id Pesan</div>
              <div>Nama Pesan</div>
              <div>Grup Penerima</div>
              <div>Jumlah Penerima</div>
              <div>Waktu Pengiriman</div>
              <div>Status</div>
            </div>

            {/* Data Row */}
            <div className="grid grid-cols-6 gap-4 py-3 text-sm">
              <div className="text-gray-800">{detail?.id_pesan || '-'}</div>
              <div className="text-gray-800">{detail?.nama_pesan || '-'}</div>
              <div className="text-gray-800">
                {detail?.grup_penerima || '-'}
              </div>
              <div className="text-gray-800">
                {detail?.jumlah_penerima ?? 0}
              </div>
              <div className="text-gray-800">
                {detail?.waktu_pengiriman || '-'}
              </div>
              <div className="text-gray-800">{detail?.status || '-'}</div>
            </div>

            {/* Summary Row */}
            <div className="mt-4 grid grid-cols-4 gap-4 border-t border-gray-200 pt-4 text-sm">
              <div>
                <span className="text-gray-600">Total Berhasil</span>
                <div className="font-medium text-gray-800">
                  {summaryCounts.success}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total Gagal</span>
                <div className="font-medium text-gray-800">
                  {summaryCounts.failed}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total Berjalan</span>
                <div className="font-medium text-gray-800">
                  {summaryCounts.pending}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Pengirim</span>
                <div className="font-medium text-gray-800">
                  {detail?.sender || '-'}
                </div>
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
            <InputMessage
              value={detail?.isi_pesan || ''}
              showInput={false}
              editable={false}
              showCharCount={false}
              previewContainerClassName="w-full"
            />
            <div className="mt-2 flex justify-end">
              <span className="text-xs text-gray-500">{detail?.waktu_pengiriman || ''}</span>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Penerima
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      No. Handphone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Waktu Pengiriman
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(paginatedRecipients || []).map((recipient) => (
                    <tr
                      key={recipient.no}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {recipient.no}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {recipient.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {recipient.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {recipient.sendTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {recipient.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
