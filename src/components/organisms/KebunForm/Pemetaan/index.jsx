'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import DataPemetaan from '@/components/organisms/KebunForm/DataPemetaan';
import { updateKebunPeta } from '@/services/kebun';

const Pemetaan = ({ idKebun, kebunData, onNext, onPrevious, onCancel, isSubmitting }) => {
  // Convert existing coordinate data to the format expected by DataPemetaan
  const getInitialCoordinates = () => {
    if (kebunData?.geom?.coordinates?.[0]) {
      return kebunData.geom.coordinates[0].map(coord => ({
        lat: coord[1],
        lng: coord[0]
      }));
    }
    return [];
  };

  // Prepare data structure for DataPemetaan component
  const pemetaanData = {
    peta: kebunData?.geom ? {
      geom: kebunData.geom
    } : null
  };


  const validationSchema = Yup.object().shape({
    peta: Yup.array().min(1, 'Harap tambahkan koordinat untuk pemetaan'),
  });

  const formik = useFormik({
    initialValues: {
      peta: getInitialCoordinates(),
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    try {
      if (!idKebun) {
        toast.error('ID Kebun tidak ditemukan untuk pemetaan.');
        return;
      }

      if (!values.peta || values.peta.length === 0) {
        toast.error('Harap tambahkan koordinat untuk pemetaan.');
        return;
      }

      // Convert coordinates to GeoJSON format
      const polygonCoords = values.peta.map(coord => [coord.lng, coord.lat]);
      if (polygonCoords.length > 0) {
        polygonCoords.push(polygonCoords[0]); // Close the polygon
      }

      const petaData = {
        petani_id: kebunData?.petani_id || 1, // Use petani_id from kebun data
        geom: {
          type: "Polygon",
          coordinates: [polygonCoords]
        }
      };

      await updateKebunPeta(idKebun, petaData);
      toast.success('Data pemetaan berhasil disimpan');
      
      // Call onNext to proceed to next step
      await onNext(values);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Gagal menyimpan data pemetaan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">PEMETAAN</h3>
        <DataPemetaan
          data={pemetaanData}
          formik={formik}
          mode="create"
        />
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
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pemetaan;
