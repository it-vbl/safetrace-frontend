'use client';

import { useState } from 'react';
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

  return (
    <BaseModal
      open={open}
      setOpen={setOpen}
      label="UBAH LAMPIRAN IDENTITAS"
      isShowCloseIcon={true}
      className="max-w-4xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
          <Upload
            label="KTP"
            file={
              ktpFile
                ? {
                    name: ktpFile.name,
                    size: ktpFile.size, // Gunakan size asli (number)
                    uploadDate: new Date().toISOString(),
                    value: ktpFile,
                  }
                : initialValues.file_ktp
                ? {
                    name:
                      initialValues.file_ktp.split('/').pop() ||
                      'File KTP saat ini',
                    size: 0, // Default 0 untuk file existing
                    uploadDate: new Date().toISOString(),
                    value: initialValues.file_ktp,
                  }
                : null
            }
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
            file={
              kkFile
                ? {
                    name: kkFile.name,
                    size: kkFile.size, // Gunakan size asli (number)
                    uploadDate: new Date().toISOString(),
                    value: kkFile,
                  }
                : initialValues.file_kk
                ? {
                    name:
                      initialValues.file_kk.split('/').pop() ||
                      'File KK saat ini',
                    size: 0, // Default 0 untuk file existing
                    uploadDate: new Date().toISOString(),
                    value: initialValues.file_kk,
                  }
                : null
            }
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
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Upload
            label="NIB"
            file={
              nibFile
                ? {
                    name: nibFile.name,
                    size: nibFile.size, // Gunakan size asli (number)
                    uploadDate: new Date().toISOString(),
                    value: nibFile,
                  }
                : initialValues.file_nib
                ? {
                    name:
                      initialValues.file_nib.split('/').pop() ||
                      'File NIB saat ini',
                    size: 0, // Default 0 untuk file existing
                    uploadDate: new Date().toISOString(),
                    value: initialValues.file_nib,
                  }
                : null
            }
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

          {/* Empty space to maintain grid layout */}
          <div></div>
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
