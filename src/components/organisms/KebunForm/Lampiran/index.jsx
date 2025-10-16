'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Upload from '@/components/molecules/Upload';
import { createKebunLampiran } from '@/services/kebun';

const Lampiran = ({ idKebun, onNext, onPrevious, onCancel, isSubmitting }) => {
  const [petaFile, setPetaFile] = useState(null);
  const [legalitasFile, setLegalitasFile] = useState(null);
  const [stdbFile, setStdbFile] = useState(null);
  const [rspoFile, setRspoFile] = useState(null);
  const [ispoFile, setIspoFile] = useState(null);

  const validationSchema = Yup.object().shape({
    file_legalitas: Yup.mixed().required('File Legalitas harus diupload'),
    file_stdb: Yup.mixed().required('File STDB harus diupload'),
    file_rspo: Yup.mixed().required('File RSPO harus diupload'),
    file_ispo: Yup.mixed().required('File ISPO harus diupload'),
  });

  const formik = useFormik({
    initialValues: {
      file_legalitas: null,
      file_stdb: null,
      file_rspo: null,
      file_ispo: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Prepare form data for API
        const formData = new FormData();
        formData.append('kebun_id', idKebun);
        
        if (legalitasFile) formData.append('file_legalitas', legalitasFile);
        if (stdbFile) formData.append('file_stdb', stdbFile);
        if (rspoFile) formData.append('file_rspo', rspoFile);
        if (ispoFile) formData.append('file_ispo', ispoFile);

        // Call API to create lampiran
        const response = await createKebunLampiran(formData);
        
        if (response?.data?.status === 'success') {
          toast.success('Lampiran berhasil diupload');
          await onNext({
            ...values,
            petaFile,
            legalitasFile,
            stdbFile,
            rspoFile,
            ispoFile,
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error uploading lampiran:', error);
        toast.error('Gagal mengupload lampiran');
      }
    },
  });

  const handleSubmit = async () => {
    // Mark all fields as touched to show validation errors
    formik.setFieldTouched('file_legalitas', true);
    formik.setFieldTouched('file_stdb', true);
    formik.setFieldTouched('file_rspo', true);
    formik.setFieldTouched('file_ispo', true);
    
    // Trigger validation for all fields
    const errors = await formik.validateForm();
    
    // Check if all files are uploaded
    const missingFiles = [];
    if (!legalitasFile) missingFiles.push('File Legalitas');
    if (!stdbFile) missingFiles.push('File STDB');
    if (!rspoFile) missingFiles.push('File RSPO');
    if (!ispoFile) missingFiles.push('File ISPO');
    
    if (missingFiles.length > 0) {
      toast.error(`File yang harus diupload: ${missingFiles.join(', ')}`);
      return;
    }

    // If all files are present, proceed with form submission
    await formik.handleSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">LAMPIRAN KEBUN</h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-6 py-4">
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
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png']}
                maxSize={10}
                isRequired
                keyField="legalitas"
                name="file_legalitas"
                error={formik.touched.file_legalitas && formik.errors.file_legalitas && !legalitasFile}
              />
              {formik.touched.file_legalitas && formik.errors.file_legalitas && !legalitasFile && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.file_legalitas}</p>
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
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png']}
                maxSize={10}
                isRequired
                keyField="stdb"
                name="file_stdb"
                error={formik.touched.file_stdb && formik.errors.file_stdb && !stdbFile}
              />
              {formik.touched.file_stdb && formik.errors.file_stdb && !stdbFile && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.file_stdb}</p>
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
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png']}
                maxSize={10}
                isRequired
                keyField="rspo"
                name="file_rspo"
                error={formik.touched.file_rspo && formik.errors.file_rspo && !rspoFile}
              />
              {formik.touched.file_rspo && formik.errors.file_rspo && !rspoFile && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.file_rspo}</p>
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
                allowedFiles={['application/pdf', 'image/jpeg', 'image/png']}
                maxSize={10}
                isRequired
                keyField="ispo"
                name="file_ispo"
                error={formik.touched.file_ispo && formik.errors.file_ispo && !ispoFile}
              />
              {formik.touched.file_ispo && formik.errors.file_ispo && !ispoFile && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.file_ispo}</p>
              )}
            </div>
          </div>
        </form>
        
        <div className="mt-4 flex justify-between gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Batalkan
            </Button>
            <Button
              type="button"
              className="bg-gray-600 hover:bg-gray-700"
              onClick={onPrevious}
              disabled={isSubmitting}
            >
              Sebelumnya
            </Button>
          </div>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lampiran;

