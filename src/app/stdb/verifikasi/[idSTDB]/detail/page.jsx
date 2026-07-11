'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import moment from 'moment';
import { IoCaretBackCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Accordion from '@/components/molecules/Accordion';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import DataJenisPupuk from '@/components/organisms/DataView/DataJenisPupuk';
import DataKomoditas from '@/components/organisms/DataView/DataKomoditas';
import DataLahan from '@/components/organisms/DataView/DataLahan';
import DataMitraPenjualan from '@/components/organisms/DataView/DataMitraPenjualan';
import DataPemetaan from '@/components/organisms/DataView/DataPemetaan';
import DataPolaTanam from '@/components/organisms/DataView/DataPolaTanam';
import ModalKonfirmasiRekomendasiTerbitSTDB from '@/components/organisms/Modal/ModalKonfirmasiRekomendasiTerbitSTDB';
import ModalKonfirmasiTolakVerifikasiSTDB from '@/components/organisms/Modal/ModalKonfirmasiTolakVerifikasiSTDB';
import ModalKonfirmasiUbahSTDBKePendataan from '@/components/organisms/Modal/ModalKonfirmasiUbahSTDBKePendataan';
import DataKebun from '@/components/organisms/STDB/DataKebun';
import KebunDetail from '@/components/organisms/STDB/KebunDetail';
import useDetailKebun from '@/hooks/useDetailKebun';
import usePekebuns from '@/hooks/usePekebuns';
import useSTDB from '@/hooks/useSTDB';
import {
  batalkanVerifikasiKebun,
  prosesVerifikasiKebun,
  rekomendasiTerbit,
  tidakTerbitVerifikasiKebun,
  ubahVerifikasiKebunKePendataan,
} from '@/services/stdb';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';
import { CrossCircledIcon } from '@radix-ui/react-icons';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const VerificationPekebunContent = () => {
  const { idSTDB } = useParams();
  const queryParams = useSearchParams();
  const idPekebun = queryParams.get('pekebunId');
  const router = useRouter();
  const [showModalTolakVerifikasiSTDB, setShowModalTolakVerifikasiSTDB] = useState(false);
  const [showModalUbahKePendataan, setShowModalUbahKePendataan] = useState(false);
  const [showModalRekomendasiTerbit, setShowModalRekomendasiTerbit] = useState(false);

  const { listKebunSTDB, fetchListKebunSTDB } = useSTDB();

  const {
    detailPekebun: {
      nama,
      updated_at,
      nik,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      provinsi_label,
      kabupaten_label,
      kecamatan_label,
      desa_label,
      pendidikan_terakhir_label,
      no_ponsel,
      lembaga_tani,
    },
    fetchDetailPekebun,
  } = usePekebuns();

  useEffect(() => {
    fetchDetailPekebun(idPekebun);
    fetchListKebunSTDB(idSTDB);
  }, []);

  const handleTolakVerifikasiSTDB = async (values) => {
    try {
      const payload = {
        ...values,
        stdb_id: idSTDB,
      };
      const res = await tidakTerbitVerifikasiKebun(payload);
      if (res.status == 200) {
        toast.success('Penolakan STDB berhasil');
        router.push('/stdb/tidak-terbit');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Penolakan STDB gagal');
      console.error(error);
    }
  };

  const handleUbahSTDBKePendataan = async (values) => {
    try {
      const payload = {
        stdb_id: idSTDB,
      };
      const res = await ubahVerifikasiKebunKePendataan(payload);
      if (res.status == 200) {
        toast.success('STDB berhasil diubah ke pendataan');
        setShowModalUbahKePendataan(false);
        router.push('/stdb/pendataan');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'STDB gagal diubah ke pendataan');
      console.error(error);
    }
  };

  const handleRekomendasiTerbit = async (values) => {
    try {
      const payload = {
        stdb_id: idSTDB?.toString(),
      };
      const res = await rekomendasiTerbit(payload);
      if (res.status == 200) {
        toast.success('STDB berhasil direkomendasikan terbit');
        setShowModalRekomendasiTerbit(false);
        router.push('/stdb/penerbitan');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'STDG gagal direkomendasikan terbit');
      console.error(error);
    }
  };

  return (
    <div className='relative max-h-[calc(100vh-72px)] w-full'>
      <div className='flex w-full flex-row justify-between border border-neutral-300 bg-secondary p-4 text-[12px] italic tracking-[8%]'>
        <div>ID PEKEBUN : {idPekebun}</div>
        <div>PENDATA : HADANI / HADANI@GMAIL.COM</div>
        <div>TERAKHIR DIUBAH : {moment(updated_at).format('DD-MM-YYYY hh:mm:ss')}</div>
      </div>
      <div className='mt-4 flex w-full flex-col gap-4 pb-8'>
        <Accordion title='IDENTITAS PEKEBUN'>
          <>
            <div className='grid w-full grid-cols-5'>
              <BorderBottomColData label='Nama' value={nama} />
              <BorderBottomColData label='NIK' value={nik} />
              <BorderBottomColData label='Tempat Lahir' value={tempat_lahir} />
              <BorderBottomColData label='Tanggal Lahir' value={tanggal_lahir} />
              <BorderBottomColData label='Jenis Kelamin' value={jenis_kelamin} />
              <BorderBottomColData label='Provinsi' value={provinsi_label} />
              <BorderBottomColData label='Kabupaten/Kota' value={kabupaten_label} />
              <BorderBottomColData label='Kecamatan' value={kecamatan_label} />
              <BorderBottomColData label='Desa/Kelurahan' value={desa_label} />
              <BorderBottomColData className={'line-clamp-none'} label='Alamat Sesuai KTP' value={'-'} />
              <BorderBottomColData label='Pendidikan Terakhir' value={pendidikan_terakhir_label} />
              <BorderBottomColData label='Telepon' value={no_ponsel} />
            </div>
            <div className='mt-4 flex w-full justify-end'>
              <Button variant='secondary'>Ubah Data</Button>
            </div>
          </>
        </Accordion>
        <Accordion title='LEMBAGA TANI'>
          <>
            <div className='grid w-full grid-cols-4'>
              <BorderBottomColData label='Nama Lembaga Tani' value={lembaga_tani?.nama} />
              <BorderBottomColData label='Komoditas' value={lembaga_tani?.komoditas_label} />
              <BorderBottomColData label='Nomor Dalam Simluhtan' value={lembaga_tani?.no_simluhtan} />
              <BorderBottomColData
                className={'line-clamp-none'}
                label='Alamat Sesuai KTP'
                value={lembaga_tani?.alamat}
              />
            </div>
            <div className='mt-4 flex w-full justify-between'>
              <Button variant='danger'>Hapus Data</Button>
              <Button variant='secondary'>Ubah Data</Button>
            </div>
          </>
        </Accordion>
        {listKebunSTDB.length > 0 &&
          listKebunSTDB.map((item, index) => (
            <KebunDetail key={index} idPekebun={idPekebun} index={index} item={item} />
          ))}
        <div>
          <div className=' flex w-full justify-between'>
            <Button icon={<CrossCircledIcon />} onClick={() => setShowModalTolakVerifikasiSTDB(true)} variant='danger'>
              Tidak Terbit
            </Button>
            <div className='flex flex-row gap-4'>
              <Button
                onClick={() => setShowModalUbahKePendataan(true)}
                icon={<IoCaretBackCircle width={20} height={20} />}
                variant='primary'
              >
                Ubah Ke Pendataan
              </Button>
              <Button
                onClick={() => setShowModalRekomendasiTerbit(true)}
                icon={<DocumentCheckIcon width={16} height={16} />}
                variant='primary'
              >
                Rekomendasi Terbit
              </Button>
            </div>
          </div>
        </div>
        <ModalKonfirmasiTolakVerifikasiSTDB
          onSubmit={handleTolakVerifikasiSTDB}
          open={showModalTolakVerifikasiSTDB}
          setOpen={setShowModalTolakVerifikasiSTDB}
          namaPekebun={nama}
          jumlahKebun={listKebunSTDB?.length}
        />
        <ModalKonfirmasiUbahSTDBKePendataan
          onSubmit={handleUbahSTDBKePendataan}
          open={showModalUbahKePendataan}
          setOpen={setShowModalUbahKePendataan}
          namaPekebun={nama}
          jumlahKebun={listKebunSTDB?.length}
        />
        <ModalKonfirmasiRekomendasiTerbitSTDB
          onSubmit={handleRekomendasiTerbit}
          open={showModalRekomendasiTerbit}
          setOpen={setShowModalRekomendasiTerbit}
          namaPekebun={nama}
          jumlahKebun={listKebunSTDB?.length}
        />
      </div>
    </div>
  );
};

const VerificationPekebun = () => {
  return (
    <Suspense fallback={
      <div className="flex w-full justify-center py-10 text-sm text-neutral-500">
        Memuat data...
      </div>
    }>
      <VerificationPekebunContent />
    </Suspense>
  )
}

export default VerificationPekebun;
