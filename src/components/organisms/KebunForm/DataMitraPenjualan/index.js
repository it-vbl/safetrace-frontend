import InputText from '../../../molecules/InputText';

const DataMitraPenjualan = ({ formik }) => {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-1 font-bold'>Informasi Mitra Penjualan</div>
      <div className='grid h-auto w-full grid-cols-3'>
        <InputText
          name='mitra_penjualan'
          label='Mitra Penjualan'
          value={formik?.values?.mitra_penjualan}
          onChange={formik.handleChange}
          placeholder='Isi Mitra Penjualan'
          errors={formik.errors}
          touched={formik.touched}
          onBlur={formik.handleBlur}
        />
      </div>
    </div>
  );
};

export default DataMitraPenjualan;
