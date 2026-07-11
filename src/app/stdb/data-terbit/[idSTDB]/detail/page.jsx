'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Printer } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Accordion from '@/components/molecules/Accordion';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import DataJenisPupuk from '@/components/organisms/DataView/DataJenisPupuk';
import DataKomoditas from '@/components/organisms/DataView/DataKomoditas';
import DataLahan from '@/components/organisms/DataView/DataLahan';
import DataMitraPenjualan from '@/components/organisms/DataView/DataMitraPenjualan';
import DataPemetaan from '@/components/organisms/DataView/DataPemetaan';
import DataPolaTanam from '@/components/organisms/DataView/DataPolaTanam';
import ModalCetakSTDB from '@/components/organisms/Modal/ModalCetakSTDB';
import ModalPencatatanSTDBBerakhir from '@/components/organisms/Modal/ModalPencatatanSTDBBerakhir';
import DataKebun from '@/components/organisms/STDB/DataKebun';
import KebunDetail from '@/components/organisms/STDB/KebunDetail';
import useDetailKebun from '@/hooks/useDetailKebun';
import usePekebuns from '@/hooks/usePekebuns';
import useSTDB from '@/hooks/useSTDB';
import { prosesCetakSTDB, prosesDataBerakhirSTDB } from '@/services/stdb';
import { CrossCircledIcon } from '@radix-ui/react-icons';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const VerificationPekebunContent = () => {
  const { idSTDB } = useParams();
  const queryParams = useSearchParams();
  const idPekebun = queryParams.get('pekebunId');
  const router = useRouter();

  const { listKebunSTDB, fetchListKebunSTDB } = useSTDB();

  const [showModalSTDBBerakhir, setShowModalSTDBBerakhir] = useState(false);
  const [showModalCetakSTDB, setShowModalCetakSTDB] = useState(false);

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

  const handleCetakSTDB = async (values) => {
    try {
      const payload = { ...values, stdb_id: parseInt(idSTDB) };
      const res = await prosesCetakSTDB(payload);
      const url = res.data.data.file_pdf;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stdb-${idSTDB}.pdf`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mencetak STDB');
    }
  };

  const handleDataBerakhir = async (values) => {
    try {
      const payload = { ...values, stdb_id: parseInt(idSTDB) };
      const res = await prosesDataBerakhirSTDB(payload);
      router.replace(`/stdb/data-berakhir`);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memproses data berakhir');
    }
  };

  useEffect(() => {
    fetchDetailPekebun(idPekebun);
    fetchListKebunSTDB(idSTDB);
  }, []);

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
          </>
        </Accordion>
        {listKebunSTDB.length > 0 &&
          listKebunSTDB.map((item, index) => (
            <KebunDetail key={index} idPekebun={idPekebun} index={index} item={item} />
          ))}
        <div className='flex w-full justify-between'>
          <Button
            variant='danger'
            icon={<CrossCircledIcon width={16} height={16} />}
            onClick={() => setShowModalSTDBBerakhir(true)}
          >
            STDB Berakhir
          </Button>
          <Button icon={<Printer width={16} height={16} />} onClick={() => setShowModalCetakSTDB(true)}>
            Cetak STDB
          </Button>
        </div>
        <ModalPencatatanSTDBBerakhir
          open={showModalSTDBBerakhir}
          setOpen={setShowModalSTDBBerakhir}
          onSubmit={handleDataBerakhir}
          namaPekebun={nama}
          jumlahKebun={listKebunSTDB.length}
        />
        <ModalCetakSTDB
          onSubmit={handleCetakSTDB}
          open={showModalCetakSTDB}
          setOpen={setShowModalCetakSTDB}
          namaPekebun={nama}
          jumlahKebun={listKebunSTDB.length}
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
