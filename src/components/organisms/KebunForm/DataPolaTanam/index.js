import Button from '@/components/atoms/Button';
import Select from '@/components/molecules/Select';
import useReferences from '@/hooks/useReferences';

const DataPolaTanam = ({ data, formik, passed }) => {
  const { polaTanam } = useReferences();

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Pola Tanam</div>
      <div className='grid h-auto w-full grid-cols-3'>
        <Select
          name='pola_tanam'
          label='Pola Tanam'
          value={formik.values.pola_tanam}
          onChange={formik.handleChange}
          options={polaTanam}
          placeholder='Pilih Pola Tanam'
          errors={formik.errors}
          touched={formik.touched}
          onBlur={formik.handleBlur}
          selectClassName='!min-h-[30px] h-[30px]'
        />
      </div>
      {passed && (
        <div className='mt-4 flex items-end justify-end self-end'>
          <Button isDisabled={!formik.dirty} onClick={formik.submitForm}>
            Simpan
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataPolaTanam;
