'use client';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useWilayah from '@/hooks/useWilayah';

const DataPabrik = ({
  pabrikData,
  onNext,
  onPrevious,
  onCancel,
  isSubmitting,
}) => {
  const {
    listProvinsi,
    listKota,
    listKecamatan,
    fetchListProvinsi,
    fetchListKota,
    fetchListKecamatan,
  } = useWilayah();

  const validationSchema = Yup.object().shape({
    pabrik_penerima: Yup.string().required('Pabrik Penerima harus diisi'),
    provinsi: Yup.string().required('Provinsi harus diisi'),
    kabupaten: Yup.string().required('Kabupaten harus diisi'),
    kecamatan: Yup.string().required('Kecamatan harus diisi'),
    alamat: Yup.string().required('Alamat harus diisi'),
  });

  const formik = useFormik({
    initialValues: {
      pabrik_penerima: pabrikData?.pabrik_penerima || '',
      provinsi: pabrikData?.provinsi || '',
      kabupaten: pabrikData?.kabupaten || '',
      kecamatan: pabrikData?.kecamatan || '',
      alamat: pabrikData?.alamat || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onNext(values);
    },
  });

  // Fetch provinsi on mount
  useEffect(() => {
    fetchListProvinsi();
  }, []);

  // Fetch kabupaten when provinsi changes
  useEffect(() => {
    if (formik.values.provinsi) {
      fetchListKota(formik.values.provinsi);
      // Reset kabupaten and kecamatan when provinsi changes
      if (pabrikData?.provinsi !== formik.values.provinsi) {
        formik.setFieldValue('kabupaten', '');
        formik.setFieldValue('kecamatan', '');
      }
    }
  }, [formik.values.provinsi]);

  // Fetch kecamatan when kabupaten changes
  useEffect(() => {
    if (formik.values.kabupaten) {
      fetchListKecamatan(formik.values.kabupaten);
      // Reset kecamatan when kabupaten changes
      if (pabrikData?.kabupaten !== formik.values.kabupaten) {
        formik.setFieldValue('kecamatan', '');
      }
    }
  }, [formik.values.kabupaten]);

  // Update form values when pabrikData changes
  useEffect(() => {
    if (pabrikData) {
      formik.setValues({
        pabrik_penerima: pabrikData.pabrik_penerima || '',
        provinsi: pabrikData.provinsi || '',
        kabupaten: pabrikData.kabupaten || '',
        kecamatan: pabrikData.kecamatan || '',
        alamat: pabrikData.alamat || '',
      });

      // Fetch dependent data if values exist
      if (pabrikData.provinsi) {
        fetchListKota(pabrikData.provinsi);
      }
      if (pabrikData.kabupaten) {
        fetchListKecamatan(pabrikData.kabupaten);
      }
    }
  }, [pabrikData]);

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      await formik.submitForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">DETAIL PABRIK</h3>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 border-b border-dashed border-gray-300 py-4">
          <InputText
            label="Pabrik Penerima"
            name="pabrik_penerima"
            placeholder="Masukan Pabrik Penerima"
            value={formik.values.pabrik_penerima}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <Select
            label="Provinsi"
            name="provinsi"
            placeholder="Pilih Provinsi"
            options={listProvinsi || []}
            value={formik.values.provinsi}
            onChange={(e) => {
              formik.setFieldValue('kabupaten', '');
              formik.setFieldValue('kecamatan', '');
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
            showSearchBar={true}
          />
          <Select
            label="Kabupaten"
            name="kabupaten"
            placeholder="Pilih Kabupaten"
            options={listKota || []}
            value={formik.values.kabupaten}
            onChange={(e) => {
              formik.setFieldValue('kecamatan', '');
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
            disabled={!formik.values.provinsi}
            showSearchBar={true}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 border-b border-dashed border-gray-300 py-4">
          <Select
            label="Kecamatan"
            name="kecamatan"
            placeholder="Pilih Kecamatan"
            options={listKecamatan || []}
            value={formik.values.kecamatan}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
            disabled={!formik.values.kabupaten}
            showSearchBar={true}
          />
          <div className="sm:col-span-1 lg:col-span-2">
            <InputText
              label="Alamat"
              name="alamat"
              placeholder="Masukan Alamat"
              value={formik.values.alamat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              isRequired
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            Kembali
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataPabrik;

