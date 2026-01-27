'use client';

import { useEffect,useState } from 'react';

import Heading from '@/components/atoms/Typography/Heading';
import SectionLoading from '@/components/molecules/SectionLoading';
import TraceabilitySummaryCard from '@/components/molecules/TraceabilitySummaryCard';
import { getStatistikDokumenKebun } from '@/services/kebun';
import {
  getStatistikDokumenPetani,
  getStatistikGender,
} from '@/services/petani';

const TraceabilityDashboard = () => {
  const [dataPetaniGender, setDataPetaniGender] = useState(null);
  const [dataPetaniDokumen, setDataPetaniDokumen] = useState(null);
  const [dataKebunDokumen, setDataKebunDokumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [genderRes, petaniDokumenRes, kebunDokumenRes] = await Promise.all([
        getStatistikGender(),
        getStatistikDokumenPetani(),
        getStatistikDokumenKebun(),
      ]);

      setDataPetaniGender(genderRes?.data?.data);
      setDataPetaniDokumen(petaniDokumenRes?.data?.data);
      setDataKebunDokumen(kebunDokumenRes?.data?.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Gagal memuat data statistik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dataAnggota = {
    title: 'Jumlah Anggota',
    headers: ['Laki - Laki', 'Perempuan', 'Total'],
    data: loading
      ? []
      : [
          {
            jumlah: dataPetaniGender?.laki_laki?.jumlah || 0,
            presentase: dataPetaniGender?.laki_laki?.persentase || 0,
          },
          {
            jumlah: dataPetaniGender?.perempuan?.jumlah || 0,
            presentase: dataPetaniGender?.perempuan?.persentase || 0,
          },
          {
            jumlah: dataPetaniGender?.total?.jumlah || 0,
            presentase: dataPetaniGender?.total?.persentase || 0,
          },
        ],
  };

  const dataDokumenAnggota = {
    title: 'Dokumen Anggota',
    headers: ['KTP', 'KK', 'Foto', 'SPPL'],
    data: loading
      ? []
      : [
          {
            jumlah: dataPetaniDokumen?.ktp?.jumlah || 0,
            presentase: dataPetaniDokumen?.ktp?.persentase || 0,
          },
          {
            jumlah: dataPetaniDokumen?.kk?.jumlah || 0,
            presentase: dataPetaniDokumen?.kk?.persentase || 0,
          },
          {
            jumlah: dataPetaniDokumen?.foto?.jumlah || 0,
            presentase: dataPetaniDokumen?.foto?.persentase || 0,
          },
          {
            jumlah: dataPetaniDokumen?.sppl?.jumlah || 0,
            presentase: dataPetaniDokumen?.sppl?.persentase || 0,
          },
        ],
  };

  const dataDokumenKebun = {
    title: 'Dokumen Kebun',
    headers: ['Lahan', 'STDB', 'SHM', 'SKT', 'TS', 'Peta'],
    data: loading
      ? []
      : [
          {
            jumlah: dataKebunDokumen?.lahan?.jumlah || 0,
            presentase: dataKebunDokumen?.lahan?.persentase || 0,
          },
          {
            jumlah: dataKebunDokumen?.stdb?.jumlah || 0,
            presentase: dataKebunDokumen?.stdb?.persentase || 0,
          },
          {
            jumlah: dataKebunDokumen?.shm?.jumlah || 0,
            presentase: dataKebunDokumen?.shm?.persentase || 0,
          },
          {
            jumlah: dataKebunDokumen?.skt?.jumlah || 0,
            presentase: dataKebunDokumen?.skt?.persentase || 0,
          },
          {
            jumlah: dataKebunDokumen?.ts?.jumlah || 0,
            presentase: dataKebunDokumen?.ts?.persentase || 0,
          },
          {
            jumlah: dataKebunDokumen?.peta?.jumlah || 0,
            presentase: dataKebunDokumen?.peta?.persentase || 0,
          },
        ],
  };

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchData}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Heading level={3} className="uppercase tracking-[2px]">
          DATA ANALITIK SEPANJANG WAKTU
        </Heading>
      </div>

      {loading ? (
        <SectionLoading className="bg-transparent" loading />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default TraceabilityDashboard;
