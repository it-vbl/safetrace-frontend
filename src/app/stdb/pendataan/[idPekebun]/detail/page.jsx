'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { CheckCircle2 } from 'lucide-react';
import moment from 'moment';
import { BiBell } from 'react-icons/bi';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Portal from '@/components/atoms/Portal';
import Accordion from '@/components/molecules/Accordion';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import DataJenisPupuk from '@/components/organisms/DataView/DataJenisPupuk';
import DataKomoditas from '@/components/organisms/DataView/DataKomoditas';
import DataLahan from '@/components/organisms/DataView/DataLahan';
import DataMitraPenjualan from '@/components/organisms/DataView/DataMitraPenjualan';
import DataPemetaan from '@/components/organisms/DataView/DataPemetaan';
import DataPolaTanam from '@/components/organisms/DataView/DataPolaTanam';
import ModalCreateLembagaTani from '@/components/organisms/Modal/ModalCreateLembagaTani';
import useDetailKebun from '@/hooks/useDetailKebun';
import usePekebuns from '@/hooks/usePekebuns';
import { createLembagaTani } from '@/services/pekebun';
import { pengajuanVerifikasi } from '@/services/stdb';
import theme from '@/utils/tailwindTheme';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const DataKebun = ({ data }) => {
  const [activeTab, setActiveTab] = useState('Lahan');
  const activeClassName = 'font-bold text-primary bg-gray-100 border border-gray-300';

  const [detailKebun, setDetailKebun] = useState(null);

  const { fetchDetailKebun } = useDetailKebun();

  const getDetailKebun = async () => {
    const response = await fetchDetailKebun(data?.id);
    setDetailKebun(response);
  };

  useEffect(() => {
    getDetailKebun();
  }, []);

  const tabs = [
    {
      label: 'Lahan',
      value: 'Lahan',
      render: () => <DataLahan data={data} />,
    },
    {
      label: 'Pola Tanam',
      value: 'Pola Tanam',
      render: () => <DataPolaTanam data={data} />,
    },
    {
      label: 'Komoditas',
      value: 'Komoditas',
      render: () => <DataKomoditas komoditas={detailKebun?.komoditas} />,
    },
    {
      label: 'Jenis Pupuk',
      value: 'Jenis Pupuk',
      render: () => <DataJenisPupuk data={data} />,
    },
    {
      label: 'Mitra Penjualan',
      value: 'Mitra Penjualan',
      render: () => <DataMitraPenjualan data={data} />,
    },
    {
      label: 'Pemetaan',
      value: 'Pemetaan',
      render: () => <DataPemetaan data={data} />,
    },
  ];

  return (
    <div className='flex flex-row items-start gap-2'>
      <div className='flex h-auto flex-[2] flex-col rounded-[4px] border border-gray-300 p-2'>
        {tabs.map((tab, index) => (
          <div
            className={`w-full cursor-pointer rounded-[4px] p-3 text-[14px] hover:bg-slate-100 ${
              activeTab === tab.label ? activeClassName : ''
            }`}
            key={index}
            onClick={() => setActiveTab(tab.label)}
            id={`tab-${tab.label}`}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className='flex w-full flex-[8] items-start rounded-[4px] border border-gray-300 bg-gray-50 p-4'>
        {tabs.find((tab) => tab.label === activeTab)?.render()}
      </div>
    </div>
  );
};

const MapDashboard = () => {
  const { idPekebun } = useParams();
  const router = useRouter();

  const [openModalCreateLembagaTani, setOpenModalCreateLembagaTani] = useState(false);
  const [selectedKebunId, setSelectedKebunId] = useState([]);

  const {
    detailPekebun: {
      nama,
      updated_at,
      nik,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin_label,
      provinsi_label,
      kabupaten_label,
      kecamatan_label,
      desa_label,
      pendidikan_terakhir_label,
      no_ponsel,
      lembaga_tani,
      alamat_ktp,
    },
    listKebun,
    fetchDetailPekebun,
    fetchListKebun,
  } = usePekebuns();

  useEffect(() => {
    fetchDetailPekebun(idPekebun);
    const params = { pekebun_id: idPekebun, page_size: 100, status_stdb: 1 };
    fetchListKebun(new URLSearchParams(params).toString());
  }, []);

  const handeSubmitLembagaTani = async (values) => {
    try {
      const payload = {
        ...values,
        pekebun_id: idPekebun,
      };
      const res = await createLembagaTani(payload);
      if (res.status == 200) {
        toast.success('Data lembaga tani berhasil ditambahkan');
        setOpenModalCreateLembagaTani(false);
        fetchDetailPekebun(idPekebun);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const handleOnKebunCheckboxChange = (kebunId) => {
    if (selectedKebunId.includes(kebunId)) {
      setSelectedKebunId(selectedKebunId.filter((id) => id !== kebunId));
    } else {
      setSelectedKebunId([...selectedKebunId, kebunId]);
    }
  };

  const handlePengajuanVerifikasi = async () => {
    try {
      const payload = {
        pekebun_id: idPekebun,
        kebun_ids: selectedKebunId,
      };
      const res = await pengajuanVerifikasi(payload);
      if (res.status == 200) {
        toast.success('Pengajuan verifikasi berhasil dikirim');
        fetchDetailPekebun(idPekebun);
        router.push('/stdb/verifikasi');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const handleClickUbahDataPekebun = useCallback(() => {
    router.push(`/stdb/pendataan/${idPekebun}/edit-pekebun`);
  }, []);

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='flex w-full flex-row justify-between border border-gray-300 bg-secondary p-4 text-[12px] italic tracking-[8%]'>
        <div>ID PEKEBUN : {idPekebun}</div>
        <div>PENDATA : HADANI / HADANI@GMAIL.COM</div>
        <div>TERAKHIR DIUBAH : {moment(updated_at).format('DD-MM-YYYY hh:mm:ss')}</div>
      </div>
      <div className='mt-4 flex w-full flex-col gap-4 pb-8'>
        <Accordion defaultIsOpen={true} title='IDENTITAS PEKEBUN'>
          <>
            <div className='grid w-full grid-cols-5'>
              <BorderBottomColData label='Nama' value={nama} />
              <BorderBottomColData label='NIK' value={nik} />
              <BorderBottomColData label='Tempat Lahir' value={tempat_lahir} />
              <BorderBottomColData label='Tanggal Lahir' value={tanggal_lahir} />
              <BorderBottomColData label='Jenis Kelamin' value={jenis_kelamin_label} />
              <BorderBottomColData label='Provinsi' value={provinsi_label} />
              <BorderBottomColData label='Kabupaten/Kota' value={kabupaten_label} />
              <BorderBottomColData label='Kecamatan' value={kecamatan_label} />
              <BorderBottomColData label='Desa/Kelurahan' value={desa_label} />
              <BorderBottomColData className={'line-clamp-none'} label='Alamat Sesuai KTP' value={alamat_ktp} />
              <BorderBottomColData label='Pendidikan Terakhir' value={pendidikan_terakhir_label} />
              <BorderBottomColData label='Telepon' value={no_ponsel} />
            </div>
            <div className='mt-4 flex w-full justify-end'>
              <Button onClick={handleClickUbahDataPekebun} variant='secondary'>
                Ubah Data
              </Button>
            </div>
          </>
        </Accordion>
        <Accordion title='LEMBAGA TANI'>
          {lembaga_tani ? (
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
          ) : (
            <div className='mt-4 flex w-full justify-end'>
              <Button onClick={() => setOpenModalCreateLembagaTani(true)} variant='secondary'>
                Tambah Lembaga Tani
              </Button>
            </div>
          )}
        </Accordion>
        {listKebun.length > 0 &&
          listKebun.map((item, index) => (
            <Accordion
              prefixComponent={
                !item.is_draft ? (
                  <Checkbox
                    value={selectedKebunId.includes(item.id)}
                    onChange={() => handleOnKebunCheckboxChange(item.id)}
                  />
                ) : (
                  <></>
                )
              }
              prefixTitleComponent={
                item.is_draft ? (
                  <div className='ml-3 rounded-[4px] bg-blue-100 px-3 py-1 text-[12px] font-normal text-blue-800'>
                    Draft
                  </div>
                ) : (
                  <></>
                )
              }
              key={index}
              title={`KEBUN KE - ${index + 1}`}
            >
              <DataKebun data={item} />
              <div className='mt-4 flex w-full justify-between'>
                <Button variant='danger'>Hapus Data</Button>
                <Button
                  onClick={() => router.push(`/stdb/pendataan/${idPekebun}/edit-kebun?idKebun=${item.id}`)}
                  variant='secondary'
                >
                  Ubah Data
                </Button>
              </div>
            </Accordion>
          ))}
        <Portal>
          <div className='w-full border-t border-t-gray-300 bg-white px-8 py-4  '>
            {listKebun.length > 0 && selectedKebunId.length === 0 && (
              <div className='mb-4 flex w-full flex-row items-center justify-center gap-2 bg-blue-100 py-2 text-center text-[14px] text-blue-950'>
                <BiBell color={theme.colors.blue[900]} size={24} /> Pilihlah data kebun yang ingin dilampirkan dalam
                proses pengajuan STDB baru
              </div>
            )}
            <div className=' flex w-full justify-between'>
              <Button
                onClick={() => {
                  router.push(`/stdb/pendataan/${idPekebun}/tambah-kebun`);
                }}
                variant='primary'
              >
                Tambahkan Kebun
              </Button>
              <Button
                icon={<CheckCircle2 width={16} height={16} />}
                onClick={handlePengajuanVerifikasi}
                isDisabled={selectedKebunId.length === 0}
                variant='primary'
              >
                Daftarkan Verifikasi
              </Button>
            </div>
          </div>
        </Portal>
        <ModalCreateLembagaTani
          onSubmit={handeSubmitLembagaTani}
          open={openModalCreateLembagaTani}
          setOpen={setOpenModalCreateLembagaTani}
        />
      </div>
    </div>
  );
};

export default MapDashboard;
