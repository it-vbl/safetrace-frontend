'use client';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useWilayah from '@/hooks/useWilayah';
import { getListPabrik } from '@/services/penjualan';

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

  const [pabrikList, setPabrikList] = useState([]);
  const [pabrikOptions, setPabrikOptions] = useState([]);
  const [isLoadingPabrik, setIsLoadingPabrik] = useState(false);
  const [selectedPabrikId, setSelectedPabrikId] = useState(null);
  const [isCustomPabrik, setIsCustomPabrik] = useState(false);

  const validationSchema = Yup.object().shape({
    pabrik_penerima: Yup.string().required('Pabrik Penerima harus diisi'),
    provinsi: Yup.string().required('Provinsi harus diisi'),
    kabupaten: Yup.string().required('Kabupaten harus diisi'),
    kecamatan: Yup.string().required('Kecamatan harus diisi'),
    alamat: Yup.string().required('Alamat harus diisi'),
  });

  const formik = useFormik({
    initialValues: {
      pabrik_penerima: pabrikData?.pabrik_penerima || pabrikData?.nama || '',
      provinsi: pabrikData?.provinsi || '',
      kabupaten: pabrikData?.kabupaten || '',
      kecamatan: pabrikData?.kecamatan || '',
      alamat: pabrikData?.alamat || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Extract real pabrik ID (not custom temp ID)
      const realPabrikId =
        selectedPabrikId && !selectedPabrikId.toString().startsWith('custom_')
          ? Number(selectedPabrikId)
          : null;

      await onNext({
        ...values,
        pabrik_id: realPabrikId,
        isCustomPabrik:
          isCustomPabrik ||
          (selectedPabrikId &&
            selectedPabrikId.toString().startsWith('custom_')),
      });
    },
  });

  // Fetch pabrik list on mount
  useEffect(() => {
    const fetchPabrikList = async () => {
      setIsLoadingPabrik(true);
      try {
        const response = await getListPabrik();
        if (
          response?.status === 200 &&
          (response?.data?.status === 'success' || response?.data?.data)
        ) {
          const data =
            response?.data?.data?.results || response?.data?.results || [];
          setPabrikList(data);

          // Transform to options format
          const options = data.map((pabrik) => ({
            value: pabrik.id,
            label: pabrik.nama,
          }));
          setPabrikOptions(options);
        }
      } catch (error) {
        console.error('Error fetching pabrik list:', error);
      } finally {
        setIsLoadingPabrik(false);
      }
    };

    fetchPabrikList();
  }, []);

  // Handle pabrik selection
  const handlePabrikChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedPabrikId(selectedId);

    // Check if it's a custom pabrik (starts with "custom_")
    if (selectedId && selectedId.toString().startsWith('custom_')) {
      setIsCustomPabrik(true);
      // Don't clear the form, just keep the custom name
      return;
    }

    setIsCustomPabrik(false);

    if (selectedId) {
      // Find selected pabrik from list
      const selectedPabrik = pabrikList.find(
        (p) => p.id === Number(selectedId)
      );
      if (selectedPabrik) {
        // Set pabrik name first
        formik.setFieldValue('pabrik_penerima', selectedPabrik.nama);
        formik.setFieldValue('alamat', selectedPabrik.alamat || '');

        // Fetch and set provinsi, then kabupaten, then kecamatan in sequence
        if (selectedPabrik.provinsi) {
          const provinsiValue = String(selectedPabrik.provinsi);
          formik.setFieldValue('provinsi', provinsiValue);

          // Fetch kabupaten list for the selected provinsi
          await fetchListKota(selectedPabrik.provinsi);

          // After kabupaten list is loaded, set kabupaten value
          if (selectedPabrik.kabupaten) {
            const kabupatenValue = String(selectedPabrik.kabupaten);
            formik.setFieldValue('kabupaten', kabupatenValue);

            // Fetch kecamatan list for the selected kabupaten
            await fetchListKecamatan(selectedPabrik.kabupaten);

            // After kecamatan list is loaded, set kecamatan value
            if (selectedPabrik.kecamatan) {
              formik.setFieldValue(
                'kecamatan',
                String(selectedPabrik.kecamatan)
              );
            }
          }
        }
      }
    } else {
      // Clear form if no selection
      setIsCustomPabrik(false);
      formik.setFieldValue('pabrik_penerima', '');
      formik.setFieldValue('provinsi', '');
      formik.setFieldValue('kabupaten', '');
      formik.setFieldValue('kecamatan', '');
      formik.setFieldValue('alamat', '');
    }
  };

  // Handle custom pabrik creation via allowAddOption
  const handleAddCustomPabrik = (customName) => {
    setIsCustomPabrik(true);
    setSelectedPabrikId(null);
    formik.setFieldValue('pabrik_penerima', customName);

    // Add custom pabrik to options temporarily so Select can display it
    // Use a temporary ID that won't conflict with real IDs
    const tempId = `custom_${Date.now()}`;
    setPabrikOptions((prev) => [...prev, { value: tempId, label: customName }]);
    setSelectedPabrikId(tempId);
    // User needs to fill the rest of the fields manually
  };

  // Fetch provinsi on mount
  useEffect(() => {
    fetchListProvinsi();
  }, []);

  // Fetch kabupaten when provinsi changes
  useEffect(() => {
    if (formik.values.provinsi) {
      fetchListKota(formik.values.provinsi);
      // Only reset kabupaten and kecamatan if provinsi changed and it's not from selecting an existing pabrik
      // Check if we have a selected pabrik that matches this provinsi (to avoid resetting during auto-fill)
      const selectedPabrik =
        selectedPabrikId && !selectedPabrikId.toString().startsWith('custom_')
          ? pabrikList.find((p) => p.id === Number(selectedPabrikId))
          : null;

      if (
        pabrikData?.provinsi !== formik.values.provinsi &&
        !(
          selectedPabrik &&
          String(selectedPabrik.provinsi) === formik.values.provinsi
        )
      ) {
        formik.setFieldValue('kabupaten', '');
        formik.setFieldValue('kecamatan', '');
      }
    }
  }, [formik.values.provinsi, selectedPabrikId, pabrikList, pabrikData]);

  // Fetch kecamatan when kabupaten changes
  useEffect(() => {
    if (formik.values.kabupaten) {
      fetchListKecamatan(formik.values.kabupaten);
      // Only reset kecamatan if kabupaten changed and it's not from selecting an existing pabrik
      const selectedPabrik =
        selectedPabrikId && !selectedPabrikId.toString().startsWith('custom_')
          ? pabrikList.find((p) => p.id === Number(selectedPabrikId))
          : null;

      if (
        pabrikData?.kabupaten !== formik.values.kabupaten &&
        !(
          selectedPabrik &&
          String(selectedPabrik.kabupaten) === formik.values.kabupaten
        )
      ) {
        formik.setFieldValue('kecamatan', '');
      }
    }
  }, [formik.values.kabupaten, selectedPabrikId, pabrikList, pabrikData]);

  // Update form values when pabrikData changes
  useEffect(() => {
    if (pabrikData) {
      const pabrikName = pabrikData.pabrik_penerima || pabrikData.nama || '';
      const pabrikId = pabrikData.id || pabrikData.pabrik_id;

      formik.setValues({
        pabrik_penerima: pabrikName,
        provinsi: String(pabrikData.provinsi || ''),
        kabupaten: String(pabrikData.kabupaten || ''),
        kecamatan: String(pabrikData.kecamatan || ''),
        alamat: pabrikData.alamat || '',
      });

      // If pabrikData has an id, try to match it with pabrikList
      if (pabrikId && pabrikList.length > 0) {
        const matchedPabrik = pabrikList.find((p) => p.id === Number(pabrikId));
        if (matchedPabrik) {
          setSelectedPabrikId(Number(pabrikId));
          setIsCustomPabrik(false);
        } else {
          setSelectedPabrikId(null);
          setIsCustomPabrik(true);
        }
      }

      // Fetch dependent data if values exist
      if (pabrikData.provinsi) {
        fetchListKota(pabrikData.provinsi);
      }
      if (pabrikData.kabupaten) {
        fetchListKecamatan(pabrikData.kabupaten);
      }
    }
  }, [pabrikData, pabrikList]);

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      await formik.submitForm();
    }
  };

  // Check if an existing pabrik (not custom) is selected
  const isExistingPabrikSelected =
    selectedPabrikId &&
    !selectedPabrikId.toString().startsWith('custom_') &&
    !isCustomPabrik;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">DETAIL PABRIK</h3>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 border-b border-dashed border-neutral-300 py-4">
          <Select
            label="Pabrik Penerima"
            name="pabrik_penerima"
            placeholder="Pilih atau tambah Pabrik Penerima"
            options={pabrikOptions}
            value={selectedPabrikId ? String(selectedPabrikId) : ''}
            onChange={handlePabrikChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
            showSearchBar={true}
            allowAddOption={{
              visible: false,
              placeholder: 'Masukan nama pabrik baru',
              isLoading: isLoadingPabrik,
              onSubmitOption: handleAddCustomPabrik,
              addButtonText: 'Tambah Pabrik Baru',
              cancelButtonText: 'Batalkan',
              applyButtonText: 'Terapkan',
              validationSchema: Yup.string()
                .required('Nama pabrik harus diisi')
                .min(2, 'Nama pabrik minimal 2 karakter'),
              maxLength: 255,
            }}
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
            disabled={isExistingPabrikSelected}
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
            disabled={!formik.values.provinsi || isExistingPabrikSelected}
            showSearchBar={true}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 border-b border-dashed border-neutral-300 py-4">
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
            disabled={!formik.values.kabupaten || isExistingPabrikSelected}
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
              disabled={isExistingPabrikSelected}
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
