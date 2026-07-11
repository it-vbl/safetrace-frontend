import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import useYearOptions from '@/hooks/useYearOptions';
import { deleteKomoditas } from '@/services/kebun';
import { PlusIcon } from '@radix-ui/react-icons';

import InputText from '../../../molecules/InputText';
import Select from '../../../molecules/Select';

const DataKomoditas = ({ komoditas, formik, data, passed = false }) => {
  const { idPekebun } = useParams();
  const searchParams = useSearchParams();
  const idKebun = searchParams.get('idKebun');
  const [activeKomoditasIndex, setActiveKomoditasIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const komoditasOptions = [];
  const asalBenihOptions = useSelector((state) => state.referensi.asalBenih);
  const jenisLahanOptions = useSelector((state) => state.referensi.jenisLahan);

  const [listKomoditas, setListKomoditas] = useState(data?.komoditas);

  const dataKomoditas = useMemo(() => {
    return listKomoditas?.length > 0
      ? listKomoditas?.map((data, index) => {
        return {
          label: index == 0 ? 'Komoditas Utama' : `Komoditas Lain (${index})`,
          id: data?.id,
          data: data,
        };
      })
      : [{ label: 'Komoditas Utama' }];
  }, [listKomoditas]);

  const isCreatingNewKomoditas = listKomoditas?.length > 0 ? listKomoditas.some((data) => !data.id) : true;

  const activeKomoditas = useMemo(() => {
    return dataKomoditas?.[activeKomoditasIndex];
  }, [activeKomoditasIndex, dataKomoditas]);

  const handleOnActiveTabChange = (customData = null) => {
    const data = customData || listKomoditas[activeKomoditasIndex];
    const tempValues = {
      nama: data?.nama ? parseInt(data?.nama) : null,
      tahun_tanam: data?.tahun_tanam,
      tahun_sebelum_peremajaan: data?.tahun_sebelum_peremajaan,
      asal_benih: data?.asal_benih,
      jenis_lahan: data?.jenis_lahan,
      jumlah_tegakan_pohon: data?.jumlah_tegakan_pohon,
      produksi_per_tahun: data?.produksi_per_tahun,
      luas_area_tanam: data?.luas_area_tanam,
      id: data?.id,
    };
    formik.setValues(tempValues);
  };

  useEffect(() => {
    handleOnActiveTabChange();
  }, [activeKomoditasIndex]);

  const yearOptions = useYearOptions();

  const activeClassName = 'font-bold text-primary bg-neutral-100 ';

  useEffect(() => {
    setListKomoditas(data?.komoditas);
  }, [data]);

  const handleAddKomoditas = () => {
    const tempListKomoditas = [...listKomoditas, { label: `Komoditas Lain (${dataKomoditas.length})` }];
    setListKomoditas(tempListKomoditas);
    setActiveKomoditasIndex(tempListKomoditas.length - 1);
  };

  const handleDeleteKomoditas = async () => {
    try {
      setIsSubmitting(true);
      const res = await deleteKomoditas({
        id: listKomoditas?.[activeKomoditasIndex]?.id,
        kebun_id: parseInt(idKebun),
      });
      if (res.status === 200) {
        const tempListKomoditas = [...listKomoditas]?.filter((data, index) => index !== activeKomoditasIndex);
        if (tempListKomoditas.length == 0) {
          tempListKomoditas.push({ label: 'Komoditas Utama' });
          formik.resetForm();
        }
        setListKomoditas(tempListKomoditas);
        handleOnActiveTabChange(tempListKomoditas?.length > 0 ? tempListKomoditas[0] : {});
        setActiveKomoditasIndex(0);
        toast.success('Data komoditas berhasil dihapus');
      }
    } catch (err) {
      console.error(err);
      toast.error('Data komoditas gagal dihapus');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-row items-start justify-start'>
        {dataKomoditas?.map((data, index) => (
          <div
            className={`cursor-pointer border-r border-t border-r-gray-300 border-t-gray-300 p-3 py-2 text-[14px] hover:bg-neutral-100 ${activeKomoditasIndex === index ? activeClassName : ''
              } ${index == 0 ? ' rounded-tl-[4px] border-x border-x-gray-300' : ''} ${index === komoditas?.length - 1 ? ' rounded-tr-[4px]' : ''
              }`}
            key={index}
            onClick={() => setActiveKomoditasIndex(index)}
            id={`tab-komoditas-${index}`}
          >
            {data.label}
          </div>
        ))}
        {data.pola_tanam === '2' ? (
          <Button
            isDisabled={isCreatingNewKomoditas}
            icon={<PlusIcon color='white' />}
            className='ml-2 h-[30px] self-center'
            onClick={handleAddKomoditas}
          >
            Komoditas
          </Button>
        ) : null}
      </div>
      <div className='border border-neutral-300 p-4'>
        <div className='flex flex-1 font-bold'>Informasi Komoditas</div>
        <div className='grid h-auto w-full grid-cols-3 gap-4'>
          <Select
            name='nama'
            label='Komoditas'
            value={formik?.values.nama || activeKomoditas?.data?.nama}
            onChange={formik?.handleChange}
            options={komoditasOptions}
            placeholder='Pilih Komoditas'
            selectClassName='!min-h-[30px] !h-[30px]'
            errors={formik.errors}
            touched={formik.touched}
            onBlur={formik.handleBlur}
          />
          <Select
            name='tahun_tanam'
            label='Tahun Tanam'
            value={formik?.values.tahun_tanam || activeKomoditas?.data?.tahun_tanam}
            onChange={formik?.handleChange}
            options={yearOptions} // Add options as needed
            placeholder='Pilih Tahun Tanam'
            selectClassName='!min-h-[30px] !h-[30px]'
            errors={formik.errors}
            touched={formik.touched}
            onBlur={formik.handleBlur}
          />
          <Select
            name='tahun_sebelum_peremajaan'
            label='Tahun Sebelum Peremajaan'
            value={formik?.values.tahun_sebelum_peremajaan || activeKomoditas?.data?.tahun_sebelum_peremajaan}
            onChange={formik?.handleChange}
            options={yearOptions} // Add options as needed
            placeholder='Pilih Tahun Sebelum Peremajaan'
            selectClassName='!min-h-[30px] !h-[30px]'
            errors={formik.errors}
            touched={formik.touched}
            onBlur={formik.handleBlur}
          />
          <Select
            name='asal_benih'
            label='Asal Benih'
            value={formik?.values.asal_benih || activeKomoditas?.data?.asal_benih_label}
            onChange={formik?.handleChange}
            options={asalBenihOptions}
            placeholder='Pilih Asal Benih'
            selectClassName='!min-h-[30px] !h-[30px]'
            errors={formik.errors}
            touched={formik.touched}
            onBlur={formik.handleBlur}
          />
          <Select
            name='jenis_lahan'
            label='Jenis Lahan'
            value={formik?.values.jenis_lahan || activeKomoditas?.data?.jenis_lahan}
            onChange={formik?.handleChange}
            options={jenisLahanOptions}
            placeholder='Pilih Jenis Lahan'
            selectClassName='!min-h-[30px] !h-[30px]'
            errors={formik.errors}
            touched={formik.touched}
            onBlur={formik.handleBlur}
          />
          <InputText
            name='jumlah_tegakan_pohon'
            label='Jumlah Tegakan Pohon'
            value={formik?.values.jumlah_tegakan_pohon || activeKomoditas?.data?.jumlah_tegakan_pohon}
            onChange={formik?.handleChange}
            placeholder='Jumlah Tegakan Pohon'
            errors={formik.errors}
            touched={formik.touched}
            onBlur={formik.handleBlur}
          />
          <InputText
            name='produksi_per_tahun'
            label='Produksi Satu Tahun'
            value={formik?.values.produksi_per_tahun || activeKomoditas?.data?.produksi_per_tahun}
            onChange={formik?.handleChange}
            placeholder='Produksi Satu Tahun'
            errors={formik.errors}
            touched={formik.touched}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className='mt-4 flex items-end justify-end gap-4 self-end'>
          {!(isCreatingNewKomoditas && activeKomoditasIndex == listKomoditas.length - 1) && (
            <Button variant='danger' isLoading={isSubmitting || formik.isSubmitting} onClick={handleDeleteKomoditas}>
              Hapus
            </Button>
          )}
          <Button isLoading={isSubmitting || formik.isSubmitting} onClick={formik.submitForm}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataKomoditas;
