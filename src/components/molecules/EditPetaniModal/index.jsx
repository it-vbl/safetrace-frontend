'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import DatePicker from '@/components/molecules/DatePicker';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import TextArea from '@/components/molecules/TextArea';

const validationSchema = Yup.object({
  id: Yup.string().required('Id Petani is required'),
  nama: Yup.string().required('Nama Petani is required'),
  jenis_kelamin: Yup.string().required('Jenis Kelamin is required'),
  kelompok_tani: Yup.string().required('Kelompok Tani is required'),
  alamat: Yup.string().required('Alamat is required'),
  no_ktp: Yup.string().required('No. KTP is required'),
  tempat_lahir: Yup.string().required('Tempat Lahir is required'),
  tanggal_lahir: Yup.string().required('Tanggal Lahir is required'),
  no_kk: Yup.string().required('No. KK is required'),
  status_pernikahan: Yup.string().required('Status Pernikahan is required'),
  no_nib: Yup.string().required('No. NIB is required'),
  tanggal_terbit_sppl: Yup.string().required('Tanggal Terbit SPPL is required'),
  tanggal_bergabung: Yup.string().required('Tanggal Bergabung is required'),
  no_whatsapp: Yup.string().required('No. Whatsapp is required'),
  keanggotaan: Yup.string().required('Status Keanggotaan is required'),
});

const EditPetaniModal = ({
  open,
  setOpen,
  initialValues,
  onSave,
  jenisKelamin = [],
  statusPerkawinan = [],
  kelompokTani = [],
}) => {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      setOpen(false);
    },
    enableReinitialize: true,
  });

  const statusKeanggotaanOptions = [
    { value: 'true', label: 'Aktif' },
    { value: 'false', label: 'Tidak Aktif' },
  ];

  return (
    <BaseModal
      open={open}
      setOpen={setOpen}
      label="UBAH IDENTITAS PETANI"
      isShowCloseIcon={true}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700"
      >
        <InputText
          label="Id Petani"
          name="id"
          value={formik.values.id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.id && formik.errors.id}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="Nama Petani"
          name="nama"
          value={formik.values.nama}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.nama && formik.errors.nama}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <Select
          label="Jenis Kelamin"
          name="jenis_kelamin"
          value={formik.values.jenis_kelamin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={jenisKelamin}
          isError={formik.touched.jenis_kelamin && formik.errors.jenis_kelamin}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <Select
          label="Kelompok Tani"
          name="kelompok_tani"
          value={formik.values.kelompok_tani}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={kelompokTani}
          isError={formik.touched.kelompok_tani && formik.errors.kelompok_tani}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <div className="col-span-2">
          <TextArea
            label="Alamat"
            name="alamat"
            value={formik.values.alamat}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            hasError={formik.touched.alamat && formik.errors.alamat}
            helperText={
              formik.touched.alamat && formik.errors.alamat
                ? formik.errors.alamat
                : ''
            }
            isRequired
            maxChar={500}
            isFullWidth={true}
          />
        </div>
        <InputText
          label="No. KTP"
          name="no_ktp"
          value={formik.values.no_ktp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.no_ktp && formik.errors.no_ktp}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="Tempat Lahir"
          name="tempat_lahir"
          value={formik.values.tempat_lahir}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.tempat_lahir && formik.errors.tempat_lahir}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <DatePicker
          label="Tanggal Lahir"
          name="tanggal_lahir"
          value={formik.values.tanggal_lahir}
          onChange={(e) =>
            formik.setFieldValue('tanggal_lahir', e.target.value)
          }
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="No. KK"
          name="no_kk"
          value={formik.values.no_kk}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.no_kk && formik.errors.no_kk}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <Select
          label="Status Pernikahan"
          name="status_pernikahan"
          value={formik.values.status_pernikahan}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={statusPerkawinan}
          isError={
            formik.touched.status_pernikahan && formik.errors.status_pernikahan
          }
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <InputText
          label="No. NIB"
          name="no_nib"
          value={formik.values.no_nib}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.no_nib && formik.errors.no_nib}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <DatePicker
          label="Tanggal Terbit SPPL"
          name="tanggal_terbit_sppl"
          value={formik.values.tanggal_terbit_sppl}
          onChange={(e) =>
            formik.setFieldValue('tanggal_terbit_sppl', e.target.value)
          }
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <DatePicker
          label="Tanggal Bergabung"
          name="tanggal_bergabung"
          value={formik.values.tanggal_bergabung}
          onChange={(e) =>
            formik.setFieldValue('tanggal_bergabung', e.target.value)
          }
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />
        <DatePicker
          label="Tanggal Keluar"
          name="tanggal_keluar"
          value={formik.values.tanggal_keluar}
          onChange={(e) =>
            formik.setFieldValue('tanggal_keluar', e.target.value)
          }
          onBlur={formik.handleBlur}
          errors={formik.errors}
          touched={formik.touched}
        />
        <InputText
          label="No. Whatsapp"
          name="no_whatsapp"
          value={formik.values.no_whatsapp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isError={formik.touched.no_whatsapp && formik.errors.no_whatsapp}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />

        <Select
          label="Status Keanggotaan"
          name="keanggotaan"
          value={formik.values.keanggotaan}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={statusKeanggotaanOptions}
          isError={formik.touched.keanggotaan && formik.errors.keanggotaan}
          errors={formik.errors}
          touched={formik.touched}
          isRequired
        />

        <div className="col-span-2 mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700"
          >
            Batalkan
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditPetaniModal;
