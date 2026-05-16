'use client';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Upload from '@/components/molecules/Upload';

const DataLampiran = ({ lampiranData, onNext, onPrevious, onCancel, isSubmitting }) => {
  // State for dynamic list of files
  const [lampiranFiles, setLampiranFiles] = useState(
    lampiranData && lampiranData.length > 0
      ? lampiranData.map((item, i) => ({ id: item.id || i, file: item.file || item }))
      : [{ id: Date.now(), file: null }]
  );

  const handleAddFile = () => {
    setLampiranFiles([...lampiranFiles, { id: Date.now(), file: null }]);
  };

  const handleRemoveFile = (id) => {
    if (lampiranFiles.length > 1) {
      setLampiranFiles(lampiranFiles.filter((item) => item.id !== id));
    } else {
      setLampiranFiles([{ id: Date.now(), file: null }]);
    }
  };

  const handleChangeFile = (id, fileData) => {
    setLampiranFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, file: fileData.value } : item))
    );
  };

  const handleSubmit = async () => {
    // Filter out empty files
    const validFiles = lampiranFiles.filter((item) => item.file !== null);
    
    // In a real scenario, you would upload these files via API here
    // For now, we'll just pass them to the next step or save them
    // const formData = new FormData();
    // validFiles.forEach((item, index) => formData.append(`lampiran[${index}]`, item.file));
    
    await onNext(validFiles);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">LAMPIRAN</h3>
          <Button type="button" onClick={handleAddFile} size="small">
            + Tambah Lampiran
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {lampiranFiles.map((item, index) => (
            <div key={item.id} className="relative">
              <Upload
                label={`Gambar ${index + 1}`}
                file={
                  item.file instanceof File
                    ? {
                        name: item.file.name,
                        size: (item.file.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: item.file,
                      }
                    : typeof item.file === 'string'
                    ? { name: `Gambar ${index + 1}`, value: item.file }
                    : item.file
                }
                onChangeValue={(data) => handleChangeFile(item.id, data)}
                allowedFiles={['image/jpeg', 'image/png', 'application/pdf']}
                maxSize={10}
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(item.id)}
                className="absolute right-0 top-0 text-red-500 hover:text-red-700 font-bold"
                style={{ marginTop: '-4px' }}
                title="Hapus"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col-reverse sm:flex-row justify-between gap-4">
          <div className="flex flex-col-reverse sm:flex-row gap-2">
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

export default DataLampiran;
