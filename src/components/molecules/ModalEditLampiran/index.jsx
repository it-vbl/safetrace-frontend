'use client';

import { useEffect,useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import BaseModal from '@/components/molecules/Modal';
import Upload from '@/components/molecules/Upload';
import { createKebunLampiran, updateKebunLampiran } from '@/services/kebun';

const ModalEditLampiran = ({
  isOpen,
  onClose,
  kebunData,
  lampiranData,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [legalitasFile, setLegalitasFile] = useState(null);
  const [stdbFile, setStdbFile] = useState(null);
  const [rspoFile, setRspoFile] = useState(null);
  const [ispoFile, setIspoFile] = useState(null);
  const [petaFile, setPetaFile] = useState(null);

  // Check if lampiranData exists by checking its ID
  const hasExistingFiles = !!(lampiranData && lampiranData.id);

  const validationSchema = Yup.object({
    file_legalitas: Yup.mixed().nullable(),
    file_stdb: Yup.mixed().nullable(),
    file_rspo: Yup.mixed().nullable(),
    file_ispo: Yup.mixed().nullable(),
    file_peta: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      file_legalitas: null,
      file_stdb: null,
      file_rspo: null,
      file_ispo: null,
      file_peta: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // Prepare FormData
        const formData = new FormData();

        if (hasExistingFiles) {
          // Update existing lampiran
          if (legalitasFile) formData.append('file_legalitas', legalitasFile);
          if (stdbFile) formData.append('file_stdb', stdbFile);
          if (rspoFile) formData.append('file_rspo', rspoFile);
          if (ispoFile) formData.append('file_ispo', ispoFile);
          if (petaFile) formData.append('file_gambar_peta', petaFile);

          // Call update API
          const response = await updateKebunLampiran(kebunData?.id, formData);

          if (response?.data?.status === 'success') {
            toast.success('Lampiran kebun berhasil diperbarui');
            onSuccess?.();
            onClose();
          } else {
            throw new Error(
              response?.data?.message || 'Gagal memperbarui lampiran kebun'
            );
          }
        } else {
          // Create new lampiran
          formData.append('kebun_id', kebunData?.id);

          if (legalitasFile) formData.append('file_legalitas', legalitasFile);
          if (stdbFile) formData.append('file_stdb', stdbFile);
          if (rspoFile) formData.append('file_rspo', rspoFile);
          if (ispoFile) formData.append('file_ispo', ispoFile);
          if (petaFile) formData.append('file_gambar_peta', petaFile);

          // Call create API
          const response = await createKebunLampiran(formData);

          if (response?.data?.status === 'success') {
            toast.success('Lampiran kebun berhasil dibuat');
            onSuccess?.();
            onClose();
          } else {
            throw new Error(
              response?.data?.message || 'Gagal membuat lampiran kebun'
            );
          }
        }
      } catch (error) {
        console.error('Error updating lampiran:', error);
        toast.error(error.message || 'Gagal memperbarui lampiran kebun');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleClose = () => {
    setLegalitasFile(null);
    setStdbFile(null);
    setRspoFile(null);
    setIspoFile(null);
    setPetaFile(null);
    formik.resetForm();
    onClose();
  };

  return (
    <BaseModal
      open={isOpen}
      setOpen={handleClose}
      label="UBAH LAMPIRAN KEBUN"
      className="max-w-4xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">LAMPIRAN KEBUN</h3>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div>
              <Upload
                label="File Peta"
                file={
                  petaFile
                    ? {
                        name: petaFile.name,
                        size: (petaFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: petaFile,
                      }
                    : null
                }
                onChangeValue={(data) => {
                  setPetaFile(data.value);
                  formik.setFieldValue('file_peta', data.value);
                  formik.setFieldTouched('file_peta', true);
                  // Clear error when file is uploaded
                  if (data.value && formik.errors.file_peta) {
                    formik.setFieldError('file_peta', '');
                  }
                }}
                allowedFiles={['image/jpeg', 'image/png', '.kml', 'application/vnd.google-earth.kml+xml']}
                maxSize={10}
                keyField="peta"
                name="file_peta"
                error={
                  formik.touched.file_peta &&
                  formik.errors.file_peta &&
                  !petaFile
                }
              />
              {formik.touched.file_peta &&
                formik.errors.file_peta &&
                !petaFile && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.file_peta}
                  </p>
                )}
            </div>
            <div>
              <Upload
                label="File Legalitas"
                file={
                  legalitasFile
                    ? {
                        name: legalitasFile.name,
                        size: (legalitasFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: legalitasFile,
                      }
                    : null
                }
                onChangeValue={(data) => {
                  setLegalitasFile(data.value);
                  formik.setFieldValue('file_legalitas', data.value);
                  formik.setFieldTouched('file_legalitas', true);
                  // Clear error when file is uploaded
                  if (data.value && formik.errors.file_legalitas) {
                    formik.setFieldError('file_legalitas', '');
                  }
                }}
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
                maxSize={10}
                keyField="legalitas"
                name="file_legalitas"
                error={
                  formik.touched.file_legalitas &&
                  formik.errors.file_legalitas &&
                  !legalitasFile
                }
              />
              {formik.touched.file_legalitas &&
                formik.errors.file_legalitas &&
                !legalitasFile && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.file_legalitas}
                  </p>
                )}
            </div>
            <div>
              <Upload
                label="File STDB"
                file={
                  stdbFile
                    ? {
                        name: stdbFile.name,
                        size: (stdbFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: stdbFile,
                      }
                    : null
                }
                onChangeValue={(data) => {
                  setStdbFile(data.value);
                  formik.setFieldValue('file_stdb', data.value);
                  formik.setFieldTouched('file_stdb', true);
                  // Clear error when file is uploaded
                  if (data.value && formik.errors.file_stdb) {
                    formik.setFieldError('file_stdb', '');
                  }
                }}
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
                maxSize={10}
                keyField="stdb"
                name="file_stdb"
                error={
                  formik.touched.file_stdb &&
                  formik.errors.file_stdb &&
                  !stdbFile
                }
              />
              {formik.touched.file_stdb &&
                formik.errors.file_stdb &&
                !stdbFile && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.file_stdb}
                  </p>
                )}
            </div>
            <div>
              <Upload
                label="File RSPO"
                file={
                  rspoFile
                    ? {
                        name: rspoFile.name,
                        size: (rspoFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: rspoFile,
                      }
                    : null
                }
                onChangeValue={(data) => {
                  setRspoFile(data.value);
                  formik.setFieldValue('file_rspo', data.value);
                  formik.setFieldTouched('file_rspo', true);
                  // Clear error when file is uploaded
                  if (data.value && formik.errors.file_rspo) {
                    formik.setFieldError('file_rspo', '');
                  }
                }}
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
                maxSize={10}
                keyField="rspo"
                name="file_rspo"
                error={
                  formik.touched.file_rspo &&
                  formik.errors.file_rspo &&
                  !rspoFile
                }
              />
              {formik.touched.file_rspo &&
                formik.errors.file_rspo &&
                !rspoFile && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.file_rspo}
                  </p>
                )}
            </div>
            <div>
              <Upload
                label="File ISPO"
                file={
                  ispoFile
                    ? {
                        name: ispoFile.name,
                        size: (ispoFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: ispoFile,
                      }
                    : null
                }
                onChangeValue={(data) => {
                  setIspoFile(data.value);
                  formik.setFieldValue('file_ispo', data.value);
                  formik.setFieldTouched('file_ispo', true);
                  // Clear error when file is uploaded
                  if (data.value && formik.errors.file_ispo) {
                    formik.setFieldError('file_ispo', '');
                  }
                }}
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png', 'image/webp']}
                maxSize={10}
                keyField="ispo"
                name="file_ispo"
                error={
                  formik.touched.file_ispo &&
                  formik.errors.file_ispo &&
                  !ispoFile
                }
              />
              {formik.touched.file_ispo &&
                formik.errors.file_ispo &&
                !ispoFile && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.file_ispo}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="danger"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batalkan
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Simpan
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default ModalEditLampiran;
