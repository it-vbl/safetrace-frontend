'use client';

import { useEffect, useMemo, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import usePekebuns from '@/hooks/usePekebuns';
import Button from '@/components/atoms/Button';
import moment from 'moment';
import useDetailKebun from '@/hooks/useDetailKebun';
import Accordion from '@/components/molecules/Accordion';
import { createLembagaTani } from '@/services/pekebun';
import { toast } from 'react-toastify';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import DataPolaTanam from '@/components/organisms/DataView/DataPolaTanam';
import DataLahan from '@/components/organisms/DataView/DataLahan';
import DataJenisPupuk from '@/components/organisms/DataView/DataJenisPupuk';
import DataMitraPenjualan from '@/components/organisms/DataView/DataMitraPenjualan';
import DataPemetaan from '@/components/organisms/DataView/DataPemetaan';
import DataKomoditas from '@/components/organisms/DataView/DataKomoditas';
import Checkbox from '@/components/atoms/Checkbox';
import {
  batalkanVerifikasiKebun,
  prosesVerifikasiKebun,
  rekomendasiTerbit,
  tidakTerbitVerifikasiKebun,
  ubahVerifikasiKebunKePendataan,
} from '@/services/stdb';
import ModalKonfirmasiTolakVerifikasiSTDB from '@/components/organisms/Modal/ModalKonfirmasiTolakVerifikasiSTDB';
import ModalKonfirmasiUbahSTDBKePendataan from '@/components/organisms/Modal/ModalKonfirmasiUbahSTDBKePendataan';
import ModalKonfirmasiRekomendasiTerbitSTDB from '@/components/organisms/Modal/ModalKonfirmasiRekomendasiTerbitSTDB';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';
import { IoCaretBackCircle } from 'react-icons/io5';
import useSTDB from '@/hooks/useSTDB';
import { CrossCircledIcon } from '@radix-ui/react-icons';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const DataKebun = ({ detailKebun, mode = 'pendataan', onVerificationValueChange = () => {}, verifyCheckList }: any) => {
  const [activeTab, setActiveTab] = useState('Lahan');
  const activeClassName = 'font-bold text-primary bg-gray-100 border border-gray-300';

  const isVerificated = detailKebun?.status_stdb === '3';

  const tabs = useMemo(
    () => [
      {
        label: 'Lahan',
        value: 'lahan',

        render: () => (
          <DataLahan
            onVerifyChange={(e) => {
              onVerificationValueChange({ ...verifyCheckList, lahan: e.target.checked });
            }}
            verified={verifyCheckList?.lahan}
            mode={mode}
            data={detailKebun}
          />
        ),
      },
      {
        label: 'Pola Tanam',
        value: 'pola_tanam',
        render: () => (
          <DataPolaTanam
            verified={verifyCheckList?.pola_tanam}
            onVerifyChange={(e) => onVerificationValueChange({ ...verifyCheckList, pola_tanam: e.target.checked })}
            mode={mode}
            data={detailKebun}
          />
        ),
      },
      {
        label: 'Komoditas',
        value: 'komoditas',
        render: () => (
          <DataKomoditas
            mode={mode}
            komoditas={detailKebun?.komoditas}
            data={detailKebun}
            verified={verifyCheckList?.komoditas}
            onVerifyChange={(e) => onVerificationValueChange({ ...verifyCheckList, komoditas: e.target.checked })}
          />
        ),
      },
      {
        label: 'Jenis Pupuk',
        value: 'jenis_pupuk',
        render: () => (
          <DataJenisPupuk
            mode={mode}
            data={detailKebun}
            verified={verifyCheckList?.jenis_pupuk}
            onVerifyChange={(e) => onVerificationValueChange({ ...verifyCheckList, jenis_pupuk: e.target.checked })}
          />
        ),
      },
      {
        label: 'Mitra Penjualan',
        value: 'mitra_penjualan',
        render: () => (
          <DataMitraPenjualan
            mode={mode}
            data={detailKebun}
            verified={verifyCheckList?.mitra_penjualan}
            onVerifyChange={(e) => onVerificationValueChange({ ...verifyCheckList, mitra_penjualan: e.target.checked })}
          />
        ),
      },
      {
        label: 'Pemetaan',
        value: 'peta',
        render: () => (
          <DataPemetaan
            mode={mode}
            data={detailKebun}
            verified={verifyCheckList?.peta}
            onVerifyChange={(e) => onVerificationValueChange({ ...verifyCheckList, peta: e.target.checked })}
          />
        ),
      },
    ],
    [detailKebun, verifyCheckList]
  );

  return (
    <div className='flex flex-row items-start gap-2'>
      <div className='flex h-auto flex-[2] flex-col rounded-[4px] border border-gray-300 p-2'>
        {tabs.map((tab, index) => (
          <div
            className={`flex w-full cursor-pointer flex-row justify-between rounded-[4px] p-3 text-[14px] hover:bg-slate-100 ${
              activeTab === tab.label ? activeClassName : ''
            }`}
            key={index}
            onClick={() => setActiveTab(tab.label)}
            id={`tab-${tab.label}`}
          >
            <div>{tab.label}</div>
            <Checkbox
              onChange={(e) => {
                !isVerificated
                  ? onVerificationValueChange({ ...verifyCheckList, [tab.value]: e.target.checked })
                  : null;
              }}
              disabled={isVerificated}
              value={verifyCheckList?.[tab.value]}
              size={14}
            />
          </div>
        ))}
      </div>
      <div className='flex w-full flex-[8] items-start rounded-[4px] border border-gray-300 bg-gray-50 p-4'>
        {tabs.find((tab) => tab.label === activeTab)?.render()}
      </div>
    </div>
  );
};

const KebunDetail = ({ index, item }) => {
  const { idSTDB } = useParams();
  const queryParams = useSearchParams();
  const idPekebun = queryParams.get('pekebunId');
  const router = useRouter();

  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [verifiedList, setVerifiedList] = useState([]);
  const [detailKebun, setDetailKebun] = useState(item);
  const [statusVerifikasiKebun, setStatusVerifikasiKebun] = useState({
    lahan: false,
    pola_tanam: false,
    komoditas: false,
    jenis_pupuk: false,
    mitra_penjualan: false,
    peta: false,
  });

  const isVerificated = detailKebun?.status_stdb === '3';

  const { fetchDetailKebun } = useDetailKebun();
  const { fetchStatusVerifikasiKebun } = useSTDB();

  const getDetailKebun = async () => {
    const response = await fetchDetailKebun(item?.id);
    const tempData = {
      ...response,
      peta: {
        ...response?.peta,
        geom: {
          ...response?.peta?.geom,
          coordinates: response?.peta?.geom?.coordinates?.[0]?.map((coord) => [coord[1], coord[0]]),
        },
        titik_koordinat: {
          ...response?.peta?.titik_koordinat,
          coordinates: [
            response?.peta?.titik_koordinat?.coordinates[1],
            response?.peta?.titik_koordinat?.coordinates[0],
          ],
        },
      },
    };
    setDetailKebun(tempData);
  };

  const handleFetchStatusVerifikasiKebun = async () => {
    try {
      const data = await fetchStatusVerifikasiKebun(idPekebun, item?.id);
      if (data) {
        setStatusVerifikasiKebun({
          lahan: data?.lahan || false,
          pola_tanam: data?.pola_tanam || false,
          komoditas: data?.komoditas || false,
          jenis_pupuk: data?.jenis_pupuk || false,
          mitra_penjualan: data?.mitra_penjualan || false,
          peta: data?.peta || false,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getDetailKebun();
    handleFetchStatusVerifikasiKebun();
  }, []);

  const handleOnVerificationChange = (listVerified: any) => {
    if (!isVerificated) {
      setStatusVerifikasiKebun(listVerified);
      const isComplete = Object.values(listVerified).every((value) => value === true);
      setIsVerificationComplete(isComplete);
    }
  };

  const handleVerifyKebun = async () => {
    try {
      const payload = {
        stdb_id: idSTDB,
        kebun_id: item?.id,
        ...statusVerifikasiKebun,
      };
      const res = await prosesVerifikasiKebun(payload);
      if (res.status == 200) {
        getDetailKebun();
        toast.success('Kebun berhasil di verifikasi');
      }
    } catch (err) {
      toast.error('Kebun gagal di verifikasi');
    }
  };

  const handleCancelVerification = async () => {
    try {
      const payload = {
        stdb_id: idPekebun,
        kebun_id: item?.id,
      };
      const res = await batalkanVerifikasiKebun(payload);
      if (res.status == 200) {
        getDetailKebun();
        toast.success('Pembatalan verifikasi kebun berhasil');
        setStatusVerifikasiKebun({
          lahan: false,
          pola_tanam: false,
          komoditas: false,
          jenis_pupuk: false,
          mitra_penjualan: false,
          peta: false,
        });
      }
    } catch (err) {
      toast.error('Pembatalan verifikasi kebun gagal');
    }
  };

  return (
    <Accordion
      key={index}
      title={`KEBUN KE - ${index + 1}`}
      prefixTitleComponent={
        isVerificated ? (
          <div className='ml-3 rounded-[4px] bg-green-100 px-3 py-1 text-[12px] font-normal text-green-800'>
            Terverifikasi
          </div>
        ) : (
          <></>
        )
      }
    >
      <DataKebun
        verifyCheckList={statusVerifikasiKebun}
        onVerificationValueChange={handleOnVerificationChange}
        mode='verifikasi'
        detailKebun={detailKebun}
      />
      <div className='mt-4 flex w-full justify-between'>
        {isVerificated ? (
          <Button onClick={handleCancelVerification} variant='danger'>
            Batalkan Verifikasi
          </Button>
        ) : (
          <div />
        )}

        <Button
          isDisabled={isVerificated ? true : !isVerificationComplete}
          onClick={handleVerifyKebun}
          variant='secondary'
        >
          Verifikasi Data Kebun
        </Button>
      </div>
    </Accordion>
  );
};

const VerificationPekebun = () => {
  const { idSTDB } = useParams();
  const queryParams = useSearchParams();
  const idPekebun = queryParams.get('pekebunId');
  const router = useRouter();
  const [showModalTolakVerifikasiSTDB, setShowModalTolakVerifikasiSTDB] = useState(false);
  const [showModalUbahKePendataan, setShowModalUbahKePendataan] = useState(false);
  const [showModalRekomendasiTerbit, setShowModalRekomendasiTerbit] = useState(false);

  const [openModalCreateLembagaTani, setOpenModalCreateLembagaTani] = useState(false);

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
    detailPekebun,
    listKebun,
    fetchDetailPekebun,
    fetchListKebun,
  } = usePekebuns();

  useEffect(() => {
    fetchDetailPekebun(idPekebun);
    const params = new URLSearchParams({
      pekebun_id: idPekebun,
      page_size: 100,
    });
    params.append('status_stdb', '2');
    params.append('status_stdb', '3');
    fetchListKebun(params);
  }, []);

  const handleTolakVerifikasiSTDB = async (values: any) => {
    try {
      const payload = {
        ...values,
        stdb_id: idSTDB,
      };
      const res = await tidakTerbitVerifikasiKebun(payload);
      if (res.status == 200) {
        toast.success('Penolakan STDB berhasil');
        setOpenModalCreateLembagaTani(false);
        router.push('/stdb/tidak-terbit');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Penolakan STDB gagal');
      console.log(error);
    }
  };

  const handleUbahSTDBKePendataan = async (values: any) => {
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
      console.log(error);
    }
  };

  const handleRekomendasiTerbit = async (values: any) => {
    try {
      const payload = {
        stdb_id: idSTDB?.toString(),
      };
      const res = await rekomendasiTerbit(payload);
      if (res.status == 200) {
        toast.success('STDB berhasil direkomendasikan terbit');
        setShowModalRekomendasiTerbit(false);
        router.push('/stdb/terbit');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'STDG gagal direkomendasikan terbit');
      console.log(error);
    }
  };

  const handleVerifikasi = async () => {
    try {
      const payload = {
        pekebun_id: idPekebun,
        kebun_ids: [],
      };
      const res = await pengajuanVerifkasi(payload);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className='relative max-h-[calc(100vh-72px)] w-full'>
      <div className='flex w-full flex-row justify-between border border-gray-300 bg-secondary p-4 text-[12px] italic tracking-[8%]'>
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
        {listKebun.length > 0 &&
          listKebun.map((item: any, index: number) => (
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
          jumlahKebun={listKebun?.length}
        />
        <ModalKonfirmasiUbahSTDBKePendataan
          onSubmit={handleUbahSTDBKePendataan}
          open={showModalUbahKePendataan}
          setOpen={setShowModalUbahKePendataan}
          namaPekebun={nama}
          jumlahKebun={listKebun?.length}
        />
        <ModalKonfirmasiRekomendasiTerbitSTDB
          onSubmit={handleRekomendasiTerbit}
          open={showModalRekomendasiTerbit}
          setOpen={setShowModalRekomendasiTerbit}
          namaPekebun={nama}
          jumlahKebun={listKebun?.length}
        />
      </div>
    </div>
  );
};

export default VerificationPekebun;
