'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputMessage from '@/components/molecules/InputMessage';
import SectionLoading from '@/components/molecules/SectionLoading';
import { getPesanDetail } from '@/services/pesan';

const DetailKirimPesanPage = () => {
  const breadcrumbItems = [
    { label: 'KIRIM PESAN', href: '/kabar-tani/kirim-pesan' },
    { label: 'DETAIL PESAN' },
  ];

  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getPesanDetail(id);
      const data = res?.data?.data || res?.data;
      setDetail(data);
    } catch (error) {
      console.error('Error fetching detail pesan:', error);
      toast.error(
        error?.response?.data?.message || 'Gagal memuat detail pesan'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  return (
    <div className="relative w-full bg-gray-50">
      <SectionLoading loading={loading} fixed />
      <div className="mx-auto flex w-full min-w-[320px] max-w-7xl flex-col gap-6 p-2">
        {/* Breadcrumb */}
        <BreadcrumbDetail items={breadcrumbItems} />

        {/* Main Content Card */}
        <div className="rounded-[4px] border border-gray-200 bg-white">
          {/* Header */}
          <Heading
            level={3}
            className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
          >
            PESAN
          </Heading>

          <div className="mb-6 space-y-4 px-6">
            <InputMessage
              value={detail?.pesan || ''}
              editable={false}
              showCharCount={false}
              charCountMax={160}
            />
            <div className="mt-2 flex flex-col justify-between gap-1 text-xs text-gray-500 sm:flex-row sm:gap-2">
              <span>
                Pengirim: {detail?.device_data?.nama || '-'}
                {detail?.device_data?.no_wa
                  ? ` - ${detail?.device_data?.no_wa}`
                  : ''}
              </span>
              <span>
                {detail?.created_at
                  ? new Date(detail.created_at).toLocaleString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKirimPesanPage;
