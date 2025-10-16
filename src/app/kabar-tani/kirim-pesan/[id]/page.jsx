'use client';
import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputMessage from '@/components/molecules/InputMessage';

const DetailKirimPesanPage = () => {
  const breadcrumbItems = [
    { label: 'KIRIM PESAN', href: '/kabar-tani/kirim-pesan' },
    { label: 'DETAIL PESAN' },
  ];

  const messageText = `Dengan hormat, bersama ini kami sampaikan informasi harga TBS kelapa sawit pada hari ini.

Tanggal: 25 Agustus 2025
Petani Swadaya : Rp 2.150/kg
Plasma / Mitra : Rp 2.320/kg

Harga tersebut berlaku mulai tanggal tersebut hingga adanya pembaruan berikutnya.

Demikian informasi yang dapat kami sampaikan. Atas perhatian Bapak/Ibu, kami ucapkan terima kasih.`;

  return (
    <div className="relative w-full bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-2">
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
              value={messageText}
              editable={false}
              showCharCount={false}
              charCountMax={160}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKirimPesanPage;
