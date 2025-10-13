'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import SectionLoading from '@/components/molecules/SectionLoading';
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
        const pengirimNama = data?.no_pengirim_nama || data?.device_nama;
        const pengirimNo =
          data?.no_pengirim || data?.device_no || data?.no_wa_pengirim;

        const mappedDetail = {
          id_pesan:
            data?.id_pesan || `BC-${String(data?.id || 0).padStart(4, '0')}`,
          nama_pesan: data?.nama_pesan || data?.nama || '-',
          grup_penerima:
            data?.grup_penerima ||
            (data?.jenis_penerima === 'grup'
              ? data?.grup_nama
              : 'Kontak Individu'),
          jumlah_penerima: jumlahPenerima,
          waktu_pengiriman: waktuPengiriman,
          status: data?.status || '-',
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
        const mappedRecipients = (list || []).map((r, idx) => ({
          no: idx + 1,
          name: r?.nama ?? r?.name ?? '-',
          phone: r?.no_wa ?? r?.phone ?? '-',
          sendTime: r?.waktu_pengiriman
            ? new Date(r.waktu_pengiriman).toLocaleString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '-',
          status: r?.status ?? '-',
        }));
        setRecipients(mappedRecipients);
      } catch (e) {
        console.error('Error fetching broadcast detail:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <div className="relative w-full bg-gray-50">
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
                <div className="font-medium text-gray-800">-</div>
              </div>
              <div>
                <span className="text-gray-600">Total Gagal</span>
                <div className="font-medium text-gray-800">-</div>
              </div>
              <div>
                <span className="text-gray-600">Total Berjalan</span>
                <div className="font-medium text-gray-800">-</div>
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
            <div className="flex gap-6">
              {/* Message Content */}
              <div className="flex-1">
                <div className="rounded border border-gray-200 p-4">
                  <div className="whitespace-pre-line text-sm text-gray-700">
                    {detail?.isi_pesan || ''}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="w-80">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Preview
                </div>
                <div className="rounded border border-yellow-200 bg-yellow-50 p-4">
                  <div className="whitespace-pre-line text-xs text-gray-700">
                    {detail?.isi_pesan || ''}
                  </div>
                  <div className="mt-4 text-right text-xs text-gray-500">
                    {detail?.waktu_pengiriman || ''}
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
                  {(recipients || []).map((recipient) => (
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
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Baris Per Halaman</span>
                <select className="rounded border border-gray-200 px-2 py-1 text-sm">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Menampilkan 1 - {Math.min(10, (recipients || []).length)} dari{' '}
                  {(recipients || []).length}
                </span>
                <div className="flex items-center gap-1">
                  <button className="rounded border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50">
                    &lt;
                  </button>
                  <button className="rounded border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50">
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPesanPage;
