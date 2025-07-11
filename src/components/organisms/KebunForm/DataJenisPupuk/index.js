import useReferences from '@/hooks/useReferences';
import Select from '@/components/molecules/Select';

const DataJenisPupuk = ({ formik }) => {
  const { jenisPupuk } = useReferences();

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Jenis Pupuk</div>
      <div className='grid h-auto w-full grid-cols-3'>
        <Select
          label='Jenis Pupuk'
          name='jenis_pupuk'
          options={jenisPupuk}
          value={formik.values.jenis_pupuk}
          onChange={formik.handleChange}
          placeholder='Pilih Jenis Pupuk'
          errors={formik.errors}
          touched={formik.touched}
          onBlur={formik.handleBlur}
        />
      </div>
    </div>
  );
};

export default DataJenisPupuk;
