import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Modal from '@/components/molecules/Modal';
import Upload from '@/components/molecules/Upload';

const ModalTambahPetaOverlay = ({
  open,
  setOpen,
  onSubmit,
  isLoading = false,
  initialValues = { nama_layer: '', file: null },
  title = 'TAMBAH LAYER STATIS',
  requireFile = true,
  fileUrl = '',
}) => {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    touched,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      nama_layer: Yup.string().required('Nama Layer Statis harus diisi'),
      file: requireFile
        ? Yup.mixed().required('File .geojson harus diupload')
        : Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        resetForm(); // Clear form state
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleOnClose = () => {
    resetForm(); // Clear form state when closing
    setOpen(false);
  };

  const handleFileChange = (fileData) => {
    setFieldValue('file', fileData);
  };

  return (
    <Modal
      className="!w-[500px]"
      open={open}
      onclose={handleOnClose}
      label={title}
    >
      <div className="flex flex-col gap-4 pt-4">
        <InputText
          label="Nama Layer Statis"
          name="nama_layer"
          placeholder="Masukkan nama layer statis"
          value={values.nama_layer}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
          isRequired={true}
        />

        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-bold text-gray-500">
            File .geojson <span className="text-red-500">*</span>
          </label>
          <Upload
            label=""
            onChangeValue={handleFileChange}
            allowedFiles={['.geojson', 'application/geo+json']}
            maxSize={50}
            isRequired={requireFile}
            name="file"
            keyField="peta-overlay-file"
            file={values.file}
            url={fileUrl}
          />
          {errors.file && touched.file && requireFile && (
            <p className="mt-1 text-sm text-red-500">{errors.file}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-row justify-end gap-2">
        <Button onClick={handleOnClose} variant="danger">
          Batalkan
        </Button>
        <Button onClick={handleSubmit} isLoading={isSubmitting || isLoading}>
          Simpan
        </Button>
      </div>
    </Modal>
  );
};

export default ModalTambahPetaOverlay;
