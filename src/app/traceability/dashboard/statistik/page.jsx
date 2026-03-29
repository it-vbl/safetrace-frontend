'use client';

import { useEffect,useState } from 'react';

import Heading from '@/components/atoms/Typography/Heading';
import SectionLoading from '@/components/molecules/SectionLoading';
import TraceabilitySummaryCard from '@/components/molecules/TraceabilitySummaryCard';
import numberFormat from '@/libs/utils/numberFormat';
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
            jumlah: dataKebunDokumen?.lahan?.jumlah?.plot || 0,
            presentase: dataKebunDokumen?.lahan?.persentase?.plot || 0,
            jumlahLabel: `${numberFormat(dataKebunDokumen?.lahan?.jumlah?.plot || 0)} Plot / ${numberFormat(dataKebunDokumen?.lahan?.jumlah?.ha || 0)} Ha`,
            presentaseLabel: `${dataKebunDokumen?.lahan?.persentase?.plot || 0}% / ${dataKebunDokumen?.lahan?.persentase?.ha || 0}%`,
          },
          {
            jumlah: dataKebunDokumen?.stdb?.jumlah?.plot || 0,
            presentase: dataKebunDokumen?.stdb?.persentase?.plot || 0,
            jumlahLabel: `${numberFormat(dataKebunDokumen?.stdb?.jumlah?.plot || 0)} Plot / ${numberFormat(dataKebunDokumen?.stdb?.jumlah?.ha || 0)} Ha`,
            presentaseLabel: `${dataKebunDokumen?.stdb?.persentase?.plot || 0}% / ${dataKebunDokumen?.stdb?.persentase?.ha || 0}%`,
          },
          {
            jumlah: dataKebunDokumen?.shm?.jumlah?.plot || 0,
            presentase: dataKebunDokumen?.shm?.persentase?.plot || 0,
            jumlahLabel: `${numberFormat(dataKebunDokumen?.shm?.jumlah?.plot || 0)} Plot / ${numberFormat(dataKebunDokumen?.shm?.jumlah?.ha || 0)} Ha`,
            presentaseLabel: `${dataKebunDokumen?.shm?.persentase?.plot || 0}% / ${dataKebunDokumen?.shm?.persentase?.ha || 0}%`,
          },
          {
            jumlah: dataKebunDokumen?.skt?.jumlah?.plot || 0,
            presentase: dataKebunDokumen?.skt?.persentase?.plot || 0,
            jumlahLabel: `${numberFormat(dataKebunDokumen?.skt?.jumlah?.plot || 0)} Plot / ${numberFormat(dataKebunDokumen?.skt?.jumlah?.ha || 0)} Ha`,
            presentaseLabel: `${dataKebunDokumen?.skt?.persentase?.plot || 0}% / ${dataKebunDokumen?.skt?.persentase?.ha || 0}%`,
          },
          {
            jumlah: dataKebunDokumen?.ts?.jumlah?.plot || 0,
            presentase: dataKebunDokumen?.ts?.persentase?.plot || 0,
            jumlahLabel: `${numberFormat(dataKebunDokumen?.ts?.jumlah?.plot || 0)} Plot / ${numberFormat(dataKebunDokumen?.ts?.jumlah?.ha || 0)} Ha`,
            presentaseLabel: `${dataKebunDokumen?.ts?.persentase?.plot || 0}% / ${dataKebunDokumen?.ts?.persentase?.ha || 0}%`,
          },
          {
            jumlah: dataKebunDokumen?.peta?.jumlah?.plot || 0,
            presentase: dataKebunDokumen?.peta?.persentase?.plot || 0,
            jumlahLabel: `${numberFormat(dataKebunDokumen?.peta?.jumlah?.plot || 0)} Plot / ${numberFormat(dataKebunDokumen?.peta?.jumlah?.ha || 0)} Ha`,
            presentaseLabel: `${dataKebunDokumen?.peta?.persentase?.plot || 0}% / ${dataKebunDokumen?.peta?.persentase?.ha || 0}%`,
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
