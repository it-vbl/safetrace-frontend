'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import BaseModal from '@/components/molecules/Modal';
import DataPemetaan from '@/components/organisms/KebunForm/DataPemetaan';
import { updateKebunPeta, uploadShapefile } from '@/services/kebun';

const ModalEditPeta = ({ isOpen, onClose, kebunData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Parse existing data for form initialization
  const parseExistingData = (data) => {
    if (!data) return {};

    return {
      petani_id: data.petani_id || '',
      peta: data.peta || null,
      uploaded_file: null,
    };
  };

  const validationSchema = Yup.object({
    petani_id: Yup.string().required('Petani ID wajib diisi'),
    peta: Yup.array().when('uploaded_file', {
      is: (val) => !val,
      then: () => Yup.array().min(3, 'Minimal 3 titik koordinat diperlukan').required('Peta wajib diisi'),
      otherwise: () => Yup.array().nullable(),
    }),
  });

  const formik = useFormik({
    initialValues: parseExistingData(kebunData),
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        if (values.uploaded_file) {
          const formData = new FormData();
          formData.append('petani_id', values.petani_id || kebunData?.petani_id || 1);
          formData.append('shapefile_upload', values.uploaded_file);

          if (!kebunData?.id) {
            toast.error('Gagal mengunggah: ID Kebun tidak ditemukan');
            return;
          }

          const toastId = toast.loading('Mengunggah file pemetaan...');
          const response = await uploadShapefile(kebunData.id, formData);

          if (response?.data?.status === 'success' || response?.status === 200 || response?.status === 201) {
            toast.update(toastId, { render: 'Data peta berhasil diperbarui', type: 'success', isLoading: false, autoClose: 3000 });
            onSuccess?.();
            onClose();
          } else {
            throw new Error(response?.data?.message || 'Gagal mengunggah file pemetaan');
          }
        } else {
          // Convert coordinates to the expected format
          const coordinates = values.peta?.map((coord) => [coord.lng, coord.lat]);

          // Ensure the polygon is closed (first and last coordinates are the same)
          if (coordinates.length > 0) {
            const firstCoord = coordinates[0];
            const lastCoord = coordinates[coordinates.length - 1];
            if (
              firstCoord[0] !== lastCoord[0] ||
              firstCoord[1] !== lastCoord[1]
            ) {
              coordinates.push([...firstCoord]);
            }
          }

          // Prepare API payload
          const payload = {
            petani_id: parseInt(values.petani_id),
            geom: {
              type: 'Polygon',
              coordinates: [coordinates],
            },
          };

          // Call API
          const response = await updateKebunPeta(kebunData?.id, payload);

          if (response?.data?.status === 'success') {
            toast.success('Data peta berhasil diperbarui');
            onSuccess?.();
            onClose();
          } else {
            throw new Error(
              response?.data?.message || 'Gagal memperbarui data peta'
            );
          }
        }
      } catch (error) {
        console.error('Error updating peta:', error);
        toast.dismiss();
        toast.error(error.message || 'Gagal memperbarui data peta');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && kebunData) {
      formik.setValues(parseExistingData(kebunData));
    }
  }, [isOpen, kebunData]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <BaseModal
      open={isOpen}
      setOpen={handleClose}
      label="UBAH PETA"
      className="w-[95vw] sm:w-[90vw] lg:w-[75vw] max-w-none"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* DataPemetaan Component */}
        <DataPemetaan
          data={kebunData}
          formik={formik}
          mode="create"
          idKebun={kebunData?.id}
          petaniId={kebunData?.petani_id}
        />

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

export default ModalEditPeta;
