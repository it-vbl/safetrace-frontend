'use client';

import Heading from '@/components/atoms/Typography/Heading';
import TraceabilitySummaryCard from '@/components/molecules/TraceabilitySummaryCard';

const TraceabilityDashboard = () => {
  const dataAnggota = {
    title: 'Jumlah Anggota',
    headers: ['Laki - Laki', 'Perempuan', 'Total'],
    data: [
      { jumlah: 1564, presentase: '83,91' },
      { jumlah: 300, presentase: '16,09' },
      { jumlah: 1864, presentase: '100' },
    ],
  };

  const dataDokumenAnggota = {
    title: 'Dokumen Anggota',
    headers: ['KTP', 'KK', 'Foto', 'SPPL'],
    data: [
      { jumlah: 1163, presentase: '62,37' },
      { jumlah: 1030, presentase: '55,28' },
      { jumlah: 510, presentase: '27,39' },
      { jumlah: 529, presentase: '28,40' },
    ],
  };

  const dataDokumenKebun = {
    title: 'Dokumen Kebun',
    headers: ['Lahan', 'STDB', 'SHM', 'SKT', 'TS', 'Peta'],
    data: [
      { jumlah: 1564, presentase: '83,91' },
      { jumlah: 300, presentase: '16,09' },
      { jumlah: 300, presentase: '16,09' },
      { jumlah: 1864, presentase: '100' },
      { jumlah: 1864, presentase: '100' },
      { jumlah: 1864, presentase: '100' },
    ],
  };

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Heading level={3} className="uppercase tracking-[2px]">
          DATA ANALITIK SEPANJANG WAKTU
        </Heading>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TraceabilitySummaryCard
          title={dataAnggota.title}
          headers={dataAnggota.headers}
          data={dataAnggota.data}
        />
        <TraceabilitySummaryCard
          title={dataDokumenAnggota.title}
          headers={dataDokumenAnggota.headers}
          data={dataDokumenAnggota.data}
        />
      </div>

      <div className="w-full">
        <TraceabilitySummaryCard
          title={dataDokumenKebun.title}
          headers={dataDokumenKebun.headers}
          data={dataDokumenKebun.data}
        />
      </div>
    </div>
  );
};

export default TraceabilityDashboard;
