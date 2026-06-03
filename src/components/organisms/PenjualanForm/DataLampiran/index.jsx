'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Upload from '@/components/molecules/Upload';
import {
  createPenjualanLampiran,
  updatePenjualanLampiran,
} from '@/services/penjualan';
import { formatApiErrorMessage } from '@/utils/errorFormatter';

/**
 * DataLampiran
 * @param {string}  mode        - 'create' (default) | 'update'
 * @param {number}  angkutanId  - angkutan ID used in the API call
 * @param {Array}   lampiranData - existing lampiran items for pre-fill
 */
const DataLampiran = ({
  lampiranData,
  angkutanId,
  mode = 'create',
  onNext,
  onPrevious,
  onCancel,
  isSubmitting,
}) => {
  // State for exactly 6 files
  const [lampiranFiles, setLampiranFiles] = useState(() => {
    const initialFiles = Array(6).fill(null).map((_, i) => ({ id: i, file: null }));
    if (lampiranData && lampiranData.length > 0) {
      lampiranData.forEach((item, i) => {
        if (i < 6) {
          initialFiles[i] = { id: i, file: item.file || item };
        }
      });
    }
    return initialFiles;
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveFile = (id) => {
    setLampiranFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, file: null } : item))
    );
  };

  const handleChangeFile = (id, fileData) => {
    setLampiranFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, file: fileData.value } : item))
    );
  };

  const handleSubmit = async () => {
    // Only send File objects as new uploads; skip existing string URLs
    const validFiles = lampiranFiles.filter((item) => item.file instanceof File);

    // Build multipart FormData
    const formData = new FormData();

    // Append each new file using its original slot index (file_1 … file_6)
    lampiranFiles.forEach((item, index) => {
      if (item.file instanceof File) {
        formData.append(`file_${index + 1}`, item.file, item.file.name);
      }
    });

    // If no files attached, skip the API call and proceed
    if (validFiles.length === 0) {
      await onNext([]);
      return;
    }

    // For create mode, include angkutan ID in the body
    if (mode === 'create' && angkutanId) {
      formData.append('angkutan', angkutanId);
    }

    setIsUploading(true);
    try {
      let response;

      if (mode === 'update') {
        if (!angkutanId) {
          toast.error('ID angkutan tidak ditemukan');
          return;
        }
        response = await updatePenjualanLampiran(angkutanId, formData);
      } else {
        response = await createPenjualanLampiran(formData);
      }

      if (
        response?.status === 200 ||
        response?.status === 201 ||
        response?.data?.status === 'success'
      ) {
        toast.success(response?.data?.message || 'Lampiran berhasil disimpan');
        await onNext(response?.data?.data || validFiles);
      } else {
        const errorMessage = formatApiErrorMessage(response?.data);
        toast.error(errorMessage || 'Gagal menyimpan lampiran');
      }
    } catch (error) {
      const errorData = error?.response?.data || error?.data;
      const errorMessage = formatApiErrorMessage(errorData);
      toast.error(errorMessage || 'Terjadi kesalahan saat menyimpan lampiran');
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isSubmitting || isUploading;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">LAMPIRAN</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {lampiranFiles.map((item, index) => (
            <div key={item.id} className="relative">
              <Upload
                label={`Lampiran ${index + 1}`}
                file={
                  item.file instanceof File
                    ? {
                        name: item.file.name,
                        size: (item.file.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: item.file,
                      }
                    : typeof item.file === 'string'
                      ? { name: `Lampiran ${index + 1}`, value: item.file }
                      : item.file
                }
                onChangeValue={(data) => handleChangeFile(item.id, data)}
                allowedFiles={['image/jpeg', 'image/png', 'application/pdf']}
                maxSize={10}
                keyField={`lampiran-${item.id}`}
              />
              {item.file && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile(item.id)}
                  className="absolute right-0 top-0 text-red-500 hover:text-red-700 font-bold"
                  style={{ marginTop: '-4px' }}
                  title="Hapus"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col-reverse sm:flex-row justify-between gap-4">
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={onCancel}
              disabled={isBusy}
            >
              Batalkan
            </Button>
            <Button
              type="button"
              className="bg-gray-600 hover:bg-gray-700"
              onClick={onPrevious}
              disabled={isBusy}
            >
              Sebelumnya
            </Button>
          </div>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            isLoading={isBusy}
          >
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataLampiran;
