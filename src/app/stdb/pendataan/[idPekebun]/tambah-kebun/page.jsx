'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import moment from 'moment';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Accordion from '@/components/molecules/Accordion';
import DataJenisPupuk from '@/components/organisms/KebunForm/DataJenisPupuk';
import DataKomoditas from '@/components/organisms/KebunForm/DataKomoditas';
import DataLahan from '@/components/organisms/KebunForm/DataLahan';
import DataMitraPenjualan from '@/components/organisms/KebunForm/DataMitraPenjualan';
import DataPemetaan from '@/components/organisms/KebunForm/DataPemetaan';
import DataPolaTanam from '@/components/organisms/KebunForm/DataPolaTanam';
import useFormJenisPupuk from '@/hooks/createKebun/useFormJenisPupuk';
import useFormKomoditas from '@/hooks/createKebun/useFormKomoditas';
import useFormLahan from '@/hooks/createKebun/useFormLahan';
import useFormMitraPenjualan from '@/hooks/createKebun/useFormMitraPenjualan';
import useFormPemetaan from '@/hooks/createKebun/useFormPemetaan';
import useFormPolaTanam from '@/hooks/createKebun/useFormPolaTanam';
import useDetailKebun from '@/hooks/useDetailKebun';
import usePekebuns from '@/hooks/usePekebuns';
import useReferences from '@/hooks/useReferences';
import useWilayah from '@/hooks/useWilayah';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const DataKebun = ({
  data,
  formik,
  initialActiveTab,
  activeTab = 2,
  onTabChange = () => {},
  komoditasFilled = false,
}) => {
  const activeClassName = 'font-bold text-primary bg-gray-100 border border-gray-300';
  const passedClassName = 'text-primary';

  const [detailKebun, setDetailKebun] = useState(null);

  const tabs = useMemo(
    () => [
      {
        label: 'Lahan',
        value: 0,
        clickable: initialActiveTab >= 0,
        passed: initialActiveTab > 0,
        render: () => <DataLahan formik={formik?.formikLahan} data={data} passed={initialActiveTab > 0} />,
      },
      {
        label: 'Pola Tanam',
        value: 1,
        clickable: initialActiveTab >= 1,
        passed: initialActiveTab > 1,
        render: () => <DataPolaTanam formik={formik?.formikPolaTanam} data={data} passed={initialActiveTab > 1} />,
      },
      {
        label: 'Komoditas',
        value: 2,
        clickable: initialActiveTab >= 2,
        passed: initialActiveTab > 2,
        render: () => (
          <DataKomoditas
            formik={formik.formikKomoditas}
            data={data}
            komoditas={detailKebun?.komoditas}
            passed={initialActiveTab > 2}
          />
        ),
      },
      {
        label: 'Jenis Pupuk',
        value: 3,
        clickable: initialActiveTab >= 3,
        passed: initialActiveTab > 3,
        render: () => <DataJenisPupuk formik={formik?.formikJenisPupuk} data={data} passed={initialActiveTab > 3} />,
      },
      {
        label: 'Mitra Penjualan',
        value: 4,
        clickable: initialActiveTab >= 4,
        passed: initialActiveTab > 4,
        render: () => (
          <DataMitraPenjualan formik={formik?.formikMitraPenjualan} data={data} passed={initialActiveTab > 4} />
        ),
      },
      {
        label: 'Pemetaan',
        value: 5,
        clickable: initialActiveTab >= 5,
        passed: initialActiveTab > 5,
        render: () => <DataPemetaan formik={formik?.formikPemetaan} data={data} passed={initialActiveTab > 5} />,
      },
    ],
    [formik, initialActiveTab]
  );

  return (
    <div className='flex flex-row items-start gap-2'>
      <div className='flex h-auto flex-[2] flex-col rounded-[4px] border border-gray-300 p-2'>
        {tabs.map((tab, index) => (
          <div
            className={`flex w-full cursor-pointer flex-row items-center gap-2 rounded-[4px] p-3 text-[14px] hover:bg-slate-100 ${
              activeTab === tab.value
                ? activeClassName
                : initialActiveTab > tab.value || (komoditasFilled && tab.value === 2)
                ? passedClassName
                : !tab.clickable
                ? '!cursor-not-allowed'
                : ''
            }`}
            onClick={() => tab.clickable && onTabChange(tab.value)}
            key={index}
            id={`tab-${tab.label}`}
          >
            {activeTab > tab.value || tab.passed ? <IoCheckmarkCircle className='text-[16px]' /> : null}
            {tab.label}
          </div>
        ))}
      </div>
      <div className='flex w-full flex-[8] items-start rounded-[4px] border border-gray-300 bg-gray-50 p-4'>
        {tabs.find((tab) => tab.value === activeTab)?.render()}
      </div>
    </div>
  );
};

const TambahKebun = () => {
  const { idPekebun } = useParams();
  const searchParams = useSearchParams();
  const idKebun = searchParams.get('idKebun');
  const router = useRouter();

  const [activeForm, setActiveForm] = useState(0);
  const [initialActiveForm, setInitialActiveForm] = useState(0);
  const [komoditasFilled, setKomoditasFilled] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [detailKebun, setDetailKebun] = useState(null);

  const { fetchDetailKebun } = useDetailKebun();

  const getDetailKebun = async (id = null) => {
    const response = await fetchDetailKebun(id || idKebun);
    setDetailKebun(response);
  };

  useEffect(() => {
    getDetailKebun();
  }, []);

  const {
    detailPekebun: { updated_at },
    detailPekebun,
    fetchDetailPekebun,
    fetchListKebun,
  } = usePekebuns();

  const formikLahan = useFormLahan({
    pekebunId: idPekebun,
    kebunId: idKebun,
    data: detailPekebun?.lahan,
    submitCallback: () => {
      setIsSubmitting(true);
    },
    successCallback: async (idKebun) => {
      router.replace(`/stdb/pendataan/${idPekebun}/tambah-kebun?idKebun=${idKebun}`);
      setIsSubmitting(false);
      getDetailKebun(idKebun);
    },
    failedCallback: () => {
      setIsSubmitting(false);
    },
  });

  const formikPolaTanam = useFormPolaTanam({
    pekebunId: idPekebun,
    kebunId: idKebun,
    data: detailPekebun?.lahan,
    submitCallback: () => {
      setIsSubmitting(true);
    },
    successCallback: async (idKebun) => {
      setIsSubmitting(false);
      getDetailKebun(idKebun);
    },
    failedCallback: () => {
      setIsSubmitting(false);
    },
  });

  const formikJenisPupuk = useFormJenisPupuk({
    pekebunId: idPekebun,
    kebunId: idKebun,
    data: detailPekebun?.lahan,
    submitCallback: () => {
      setIsSubmitting(true);
    },
    successCallback: async (idKebun) => {
      setIsSubmitting(false);
      getDetailKebun(idKebun);
    },
    failedCallback: () => {
      setIsSubmitting(false);
    },
  });

  const formikMitraPenjualan = useFormMitraPenjualan({
    pekebunId: idPekebun,
    kebunId: idKebun,
    data: detailPekebun?.lahan,
    submitCallback: () => {
      setIsSubmitting(true);
    },
    successCallback: async (idKebun) => {
      setIsSubmitting(false);
      getDetailKebun(idKebun);
    },
    failedCallback: () => {
      setIsSubmitting(false);
    },
  });

  const formikKomoditas = useFormKomoditas({
    pekebunId: idPekebun,
    kebunId: idKebun,
    data: detailPekebun?.komoditas,
    submitCallback: () => {
      setIsSubmitting(true);
    },
    successCallback: async (idKebun) => {
      setIsSubmitting(false);
      setKomoditasFilled(true);
    },
    failedCallback: () => {
      setIsSubmitting(false);
    },
  });

  const formikPemetaan = useFormPemetaan({
    pekebunId: idPekebun,
    kebunId: idKebun,
    data: detailPekebun?.komoditas,
    submitCallback: () => {
      setIsSubmitting(true);
    },
    successCallback: async (idKebun) => {
      setIsSubmitting(false);
      router.push(`/stdb/pendataan/${idPekebun}/detail`);
    },
    failedCallback: () => {
      setIsSubmitting(false);
    },
  });

  /*************  ✨ Windsurf Command 🌟  *************/
  const {
    fetchPendidikanTerakhir,
    fetchStatusLahan,
    fetchPolaTanam,
    fetchJenisPupuk,
    fetchEksPlasma,
    fetchAsalBenih,
    fetchJenisLahan,
  } = useReferences();

  const { fetchListKecamatan, fetchListDesa } = useWilayah();

  useEffect(() => {
    fetchDetailPekebun(idPekebun);
    const params = { user_id: idPekebun };
    fetchListKebun(new URLSearchParams(params).toString());

    fetchPendidikanTerakhir();
    fetchStatusLahan();
    fetchPolaTanam();
    fetchJenisPupuk();
    fetchEksPlasma();
    fetchAsalBenih();
    fetchJenisLahan();
    fetchListKecamatan(6105);
  }, []);
  /*******  2a457821-e8e2-428b-bd28-c504d421b6cc  *******/

  const activeFormik = useMemo(() => {
    const map = [formikLahan, formikPolaTanam, formikKomoditas, formikJenisPupuk, formikMitraPenjualan, formikPemetaan];
    return map?.[activeForm];
  }, [activeForm]);

  const handleDataInititalization = () => {
    formikLahan.setValues({
      eks_plasma: detailKebun?.lahan?.eks_plasma || '',
      status_lahan: detailKebun?.lahan?.status_lahan || '',
      luas_lahan: detailKebun?.lahan?.luas_lahan || '',
      no_dokumen: detailKebun?.lahan?.no_dokumen || '',
      kecamatan: detailKebun?.lahan?.kecamatan || '',
      desa: detailKebun?.lahan?.desa || '',
    });
    formikPolaTanam.setValues({
      pola_tanam: detailKebun?.pola_tanam || '',
    });
    formikJenisPupuk.setValues({
      jenis_pupuk: detailKebun?.jenis_pupuk || '',
    });
    formikMitraPenjualan.setValues({
      mitra_penjualan: detailKebun?.mitra_penjualan || '',
    });
  };

  //useEffect Section

  useEffect(() => {
    if (formikLahan.values.kecamatan) {
      fetchListDesa(formikLahan.values.kecamatan);
    }
  }, [formikLahan.values.kecamatan]);

  useEffect(() => {
    handleDataInititalization();
    if (detailKebun?.mitra_penjualan) {
      setActiveForm(5);
      setInitialActiveForm(5);
    } else if (detailKebun?.jenis_pupuk) {
      setActiveForm(4);
      setInitialActiveForm(4);
    } else if (detailKebun?.komoditas && detailKebun?.komoditas.length > 0) {
      if (activeForm !== 2) {
        setActiveForm(3);
        setInitialActiveForm(3);
      }
    } else if (detailKebun?.pola_tanam) {
      setActiveForm(2);
      setInitialActiveForm(2);
    } else if (detailKebun?.lahan) {
      setActiveForm(1);
      setInitialActiveForm(1);
    }
  }, [detailKebun]);

  return (
    <div className='relative max-h-[calc(100vh-72px)] w-full'>
      <div className='flex w-full flex-row justify-between border border-gray-300 bg-secondary p-4 text-[12px] italic tracking-[8%]'>
        <div>ID PEKEBUN : {idPekebun}</div>
        <div>PENDATA : HADANI / HADANI@GMAIL.COM</div>
        <div>TERAKHIR DIUBAH : {moment(updated_at).format('DD-MM-YYYY hh:mm:ss')}</div>
      </div>
      <div className='mt-4 flex w-full flex-col gap-4 pb-8'>
        <Accordion defaultIsOpen={true} key={1} title={`KEBUN KE - ${1}`}>
          <>
            <DataKebun
              activeTab={activeForm}
              initialActiveTab={initialActiveForm}
              onTabChange={(v) => setActiveForm(v)}
              formik={{
                formikLahan,
                formikPolaTanam,
                formikKomoditas,
                formikJenisPupuk,
                formikMitraPenjualan,
                formikPemetaan,
              }}
              data={detailKebun}
              komoditasFilled={komoditasFilled}
            />
            <div className='mt-4 flex w-full justify-between'>
              <Button isLoading={isSubmitting} variant='danger'>
                Batalkan
              </Button>
              <Button
                isLoading={isSubmitting}
                type='button'
                onClick={() => {
                  if (activeForm == 2) {
                    if (detailKebun?.komoditas?.length > 0 || komoditasFilled) {
                      setActiveForm(3);
                    } else {
                      toast.error('Tambahkan minimal 1 komoditas untuk melanjutkan');
                    }
                  } else {
                    activeFormik?.handleSubmit();
                  }
                }}
                variant='secondary'
              >
                Selanjutnya
              </Button>
            </div>
          </>
        </Accordion>
      </div>
    </div>
  );
};

export default TambahKebun;
