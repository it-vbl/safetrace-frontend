'use client';
import { useRouter } from 'next/navigation';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import Heading from '@/components/atoms/Typography/Heading';

const DetailPesanPage = () => {
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'BLAST PESAN', href: '/kabar-tani/blast-pesan' },
    { label: 'DETAIL PESAN' },
  ];

  const messageData = {
    id: 'PN-0001',
    name: 'Pemberitahuan Harga Harian',
    group: 'Anggota APKS',
    recipients: 1200,
    sendTime: '07:00 25-08-2025',
    status: 'Selesai',
    totalSent: 1100,
    totalSuccess: 100,
    totalFailed: 0,
    sender: 'Fajar Sukmara - 082115191642',
  };

  const messageContent = {
    text: `Dengan hormat, bersama ini kami sampaikan informasi harga TBS kelapa sawit pada hari ini.

Tanggal: 25 Agustus 2025
Petani Swadaya : Rp 2.150/kg
Plasma / Mitra : Rp 2.320/kg

Harga tersebut berlaku mulai tanggal tersebut hingga adanya perubahan berikutnya.

Demikian informasi yang dapat kami sampaikan. Atas perhatian Bapak/Ibu, kami ucapkan terima kasih.`,
  };

  const recipients = Array.from({ length: 10 }, (_, index) => ({
    no: index + 1,
    name: 'Toto Suranto',
    phone: '089588739182',
    sendTime: '07:00 25-08-2025',
    status: 'Berhasil',
  }));

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
              <div className="text-gray-800">{messageData.id}</div>
              <div className="text-gray-800">{messageData.name}</div>
              <div className="text-gray-800">{messageData.group}</div>
              <div className="text-gray-800">{messageData.recipients}</div>
              <div className="text-gray-800">{messageData.sendTime}</div>
              <div className="text-gray-800">{messageData.status}</div>
            </div>

            {/* Summary Row */}
            <div className="mt-4 grid grid-cols-4 gap-4 border-t border-gray-200 pt-4 text-sm">
              <div>
                <span className="text-gray-600">Total Berhasil</span>
                <div className="font-medium text-gray-800">
                  {messageData.totalSent}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total Gagal</span>
                <div className="font-medium text-gray-800">
                  {messageData.totalSuccess}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total Berjalan</span>
                <div className="font-medium text-gray-800">
                  {messageData.totalFailed}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Pengirim</span>
                <div className="font-medium text-gray-800">
                  {messageData.sender}
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
                    {messageContent.text}
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
                    {messageContent.text}
                  </div>
                  <div className="mt-4 text-right text-xs text-gray-500">
                    07:00
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
                  {recipients.map((recipient) => (
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
                  Menampilkan 1 - 10 dari 500
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
