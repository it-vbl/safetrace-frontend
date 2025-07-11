import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useReferences from '@/hooks/useReferences';
import useWilayah from '@/hooks/useWilayah';

const DataLahan = ({ formik }) => {
  const { eksPlasma, statusLahan } = useReferences();
  const { listKecamatan, listDesa } = useWilayah();

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Lahan</div>
      <div className='grid h-auto w-full grid-cols-3 gap-4'>
        <Select
          name='eks_plasma'
          label='Eks Plasma'
          value={formik.values.eks_plasma}
          options={eksPlasma}
          onChange={formik.handleChange}
          selectClassName='!min-h-[30px] h-[30px]'
          placeholder='Pilih Eks Plasma'
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
        />
        <Select
          name='status_lahan'
          label='Status Lahan'
          value={formik.values.status_lahan}
          options={statusLahan}
          onChange={formik.handleChange}
          selectClassName='!min-h-[30px] h-[30px]'
          placeholder='Pilih Status Lahan'
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
        />
        <InputText
          name='luas_lahan'
          label='Luas Lahan(m2)'
          value={formik.values.luas_lahan}
          onChange={formik.handleChange}
          placeholder='Isi Luas Lahan'
          errors={formik.errors}
          onBlur={formik.handleBlur}
          touched={formik.touched}
        />
        <InputText
          name='no_dokumen'
          label='No Dokumen'
          value={formik.values.no_dokumen}
          onChange={formik.handleChange}
          placeholder='Isi No Dokumen'
          errors={formik.errors}
          onBlur={formik.handleBlur}
          touched={formik.touched}
        />
        <Select
          name='kecamatan'
          label='Kecamatan'
          value={formik.values.kecamatan}
          options={listKecamatan}
          onChange={formik.handleChange}
          selectClassName='!min-h-[30px] h-[30px]'
          placeholder='Pilih Kecamatan'
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
        />
        <Select
          name='desa'
          label='Kelurahan'
          value={formik.values.desa}
          options={listDesa}
          onChange={formik.handleChange}
          selectClassName='!min-h-[30px] h-[30px]'
          placeholder='Pilih Kelurahan'
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
        />
      </div>
    </div>
  );
};

export default DataLahan;
