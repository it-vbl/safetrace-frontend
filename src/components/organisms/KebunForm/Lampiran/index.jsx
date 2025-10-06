'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/atoms/Button';
import Upload from '@/components/molecules/Upload';

const Lampiran = ({ idKebun, onNext, onPrevious, onCancel, isSubmitting }) => {
  const [petaFile, setPetaFile] = useState(null);
  const [legalitasFile, setLegalitasFile] = useState(null);
  const [stdbFile, setStdbFile] = useState(null);

  const validationSchema = Yup.object().shape({
    // File validation will be handled separately
  });

  const formik = useFormik({
    initialValues: {
      petaFile: null,
      legalitasFile: null,
      stdbFile: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      await onNext({
        ...values,
        petaFile,
        legalitasFile,
        stdbFile,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">LAMPIRAN KEBUN</h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-3 gap-6 py-4">
            <Upload
              label="Peta"
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
              onChangeValue={(data) => setPetaFile(data.value)}
              allowedFiles={['application/pdf']}
              maxSize={10}
              isRequired
              keyField="peta"
              name="file_peta"
            />
            <Upload
              label="Legalitas"
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
              onChangeValue={(data) => setLegalitasFile(data.value)}
              allowedFiles={['application/pdf']}
              maxSize={10}
              isRequired
              keyField="legalitas"
              name="file_legalitas"
            />
            <Upload
              label="STDB"
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
              onChangeValue={(data) => setStdbFile(data.value)}
              allowedFiles={['application/pdf']}
              maxSize={10}
              isRequired
              keyField="stdb"
              name="file_stdb"
            />
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
            onClick={() => formik.handleSubmit()}
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

