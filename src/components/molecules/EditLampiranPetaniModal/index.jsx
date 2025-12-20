'use client';

import { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import BaseModal from '@/components/molecules/Modal';
import Upload from '@/components/molecules/Upload';

const validationSchema = Yup.object({
  file_ktp: Yup.mixed().nullable(),
  file_kk: Yup.mixed().nullable(),
  file_nib: Yup.mixed().nullable(),
});

const EditLampiranPetaniModal = ({
  open,
  setOpen,
  initialValues = {},
  onSave,
  loading = false,
}) => {
  const [ktpFile, setKtpFile] = useState(null);
  const [kkFile, setKkFile] = useState(null);
  const [nibFile, setNibFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      file_ktp: null,
      file_kk: null,
      file_nib: null,
      ...initialValues,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      if (ktpFile) {
        formData.append('file_ktp', ktpFile);
      }
      if (kkFile) {
        formData.append('file_kk', kkFile);
      }
      if (nibFile) {
        formData.append('file_nib', nibFile);
      }

      onSave(formData);
    },
    enableReinitialize: true,
  });

  const getExistingFile = (url, label) => {
    if (!url) return null;
    return {
      name: url.split('/').pop() || label,
      size: 0,
      uploadDate: new Date().toISOString(),
      value: url,
    };
  };

  const ktpFileData = useMemo(
    () =>
      ktpFile
        ? {
            name: ktpFile.name,
            size: ktpFile.size,
            uploadDate: new Date().toISOString(),
            value: ktpFile,
          }
        : getExistingFile(initialValues.file_ktp, 'File KTP saat ini'),
    [ktpFile, initialValues.file_ktp]
  );

  const kkFileData = useMemo(
    () =>
      kkFile
        ? {
            name: kkFile.name,
            size: kkFile.size,
            uploadDate: new Date().toISOString(),
            value: kkFile,
          }
        : getExistingFile(initialValues.file_kk, 'File KK saat ini'),
    [kkFile, initialValues.file_kk]
  );

  const nibFileData = useMemo(
    () =>
      nibFile
        ? {
            name: nibFile.name,
            size: nibFile.size,
            uploadDate: new Date().toISOString(),
            value: nibFile,
          }
        : getExistingFile(initialValues.file_nib, 'File NIB saat ini'),
    [nibFile, initialValues.file_nib]
  );

  return (
    <BaseModal
      open={open}
      setOpen={setOpen}
      label="UBAH LAMPIRAN IDENTITAS"
      isShowCloseIcon={true}
      className="max-w-4xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-6 py-4">
          <Upload
            label="KTP"
            file={ktpFileData}
            onChangeValue={(data) => {
              setKtpFile(data.value);
            }}
            allowedFiles={['application/pdf']}
            maxSize={10}
            isRequired={false}
            keyField="ktp"
            name="file_ktp"
            url={initialValues.file_ktp}
          />

          <Upload
            label="Kartu Keluarga (KK)"
            file={kkFileData}
            onChangeValue={(data) => {
              setKkFile(data.value);
            }}
            allowedFiles={['application/pdf']}
            maxSize={10}
            isRequired={false}
            keyField="kk"
            name="file_kk"
            url={initialValues.file_kk}
          />

          <Upload
            label="NIB"
            file={nibFileData}
            onChangeValue={(data) => {
              setNibFile(data.value);
            }}
            allowedFiles={['application/pdf']}
            maxSize={10}
            isRequired={false}
            keyField="nib"
            name="file_nib"
            url={initialValues.file_nib}
          />
        </div>

        <div className="flex flex-col justify-end gap-3 border-t border-gray-200 pt-6 sm:flex-row">
          <Button
            variant="danger"
            onClick={() => setOpen(false)}
            isDisabled={loading}
            className="order-2 sm:order-1"
          >
            Batalkan
          </Button>
          <Button
            type="submit"
            variant="primary"
            isDisabled={loading || formik.isSubmitting}
            isLoading={loading}
            className="order-1 sm:order-2"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditLampiranPetaniModal;
