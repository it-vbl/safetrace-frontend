'use client';

import { useEffect, useMemo,useState } from 'react';
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

  const getExistingFile = (url, label) => {
    if (!url) return null;
    return {
      name: url.split('/').pop() || label,
      size: 0,
      uploadDate: new Date().toISOString(),
      value: url,
    };
  };

  const petaFileData = useMemo(
    () =>
      petaFile
        ? {
            name: petaFile.name,
            size: petaFile.size,
            uploadDate: new Date().toISOString(),
            value: petaFile,
          }
        : getExistingFile(lampiranData?.file_gambar_peta, 'File Peta saat ini'),
    [petaFile, lampiranData?.file_gambar_peta]
  );

  const legalitasFileData = useMemo(
    () =>
      legalitasFile
        ? {
            name: legalitasFile.name,
            size: legalitasFile.size,
            uploadDate: new Date().toISOString(),
            value: legalitasFile,
          }
        : getExistingFile(lampiranData?.file_legalitas, 'File Legalitas saat ini'),
    [legalitasFile, lampiranData?.file_legalitas]
  );

  const stdbFileData = useMemo(
    () =>
      stdbFile
        ? {
            name: stdbFile.name,
            size: stdbFile.size,
            uploadDate: new Date().toISOString(),
            value: stdbFile,
          }
        : getExistingFile(lampiranData?.file_stdb, 'File STDB saat ini'),
    [stdbFile, lampiranData?.file_stdb]
  );

  const rspoFileData = useMemo(
    () =>
      rspoFile
        ? {
            name: rspoFile.name,
            size: rspoFile.size,
            uploadDate: new Date().toISOString(),
            value: rspoFile,
          }
        : getExistingFile(lampiranData?.file_rspo, 'File RSPO saat ini'),
    [rspoFile, lampiranData?.file_rspo]
  );

  const ispoFileData = useMemo(
    () =>
      ispoFile
        ? {
            name: ispoFile.name,
            size: ispoFile.size,
            uploadDate: new Date().toISOString(),
            value: ispoFile,
          }
        : getExistingFile(lampiranData?.file_ispo, 'File ISPO saat ini'),
    [ispoFile, lampiranData?.file_ispo]
  );

  return (
    <BaseModal
      open={isOpen}
      setOpen={handleClose}
      label="UBAH LAMPIRAN KEBUN"
      className="w-[95vw] sm:w-[90vw] lg:max-w-4xl max-w-none"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">LAMPIRAN KEBUN</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
            <div>
              <Upload
                label="File Peta"
                file={petaFileData}
                url={lampiranData?.file_gambar_peta}
                onChangeValue={(data) => {
                  setPetaFile(data.value);
                  formik.setFieldValue('file_peta', data.value);
                  formik.setFieldTouched('file_peta', true);
                  // Clear error when file is uploaded
                  if (data.value && formik.errors.file_peta) {
                    formik.setFieldError('file_peta', '');
                  }
                }}
                allowedFiles={['.zip', '.geojson', '.kml']}
                maxSize={10}
                keyField="peta"
                name="file_peta"
                error={
                  formik.touched.file_peta &&
                  formik.errors.file_peta &&
                  !petaFile
                }
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload .zip / .geojson / .kml file yang sudah disiapkan.
              </p>
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
                file={legalitasFileData}
                url={lampiranData?.file_legalitas}
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
                file={stdbFileData}
                url={lampiranData?.file_stdb}
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
                file={rspoFileData}
                url={lampiranData?.file_rspo}
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
                file={ispoFileData}
                url={lampiranData?.file_ispo}
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
