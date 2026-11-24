'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import useReferences from '@/hooks/useReferences';
import useWilayah from '@/hooks/useWilayah';
import { updateKebun } from '@/services/kebun';
import { getListPetani } from '@/services/petani';

const ModalEditKebun = ({ isOpen, onClose, kebunData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [petaniOptions, setPetaniOptions] = useState([]);

  const {
    listProvinsi,
    listKota,
    listKecamatan,
    listDesa,
    fetchListProvinsi,
    fetchListKota,
    fetchListKecamatan,
    fetchListDesa,
  } = useWilayah();

  // Get references for dropdown options
  const {
    jenisLegalitas,
    kelompokTani,
    komoditas,
    polaTanam,
    jenisLahan,
    asalBenih,
    jenisPupuk,
    fetchJenisLegalitas,
    fetchKelompokTani,
    fetchKomoditas,
    fetchPolaTanam,
    fetchJenisLahan,
    fetchAsalBenih,
    fetchJenisPupuk,
  } = useReferences();

  // Month options for waktu_tanam
  const monthOptions = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  // Year options (last 20 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  // RSPO/ISPO options
  const statusOptions = [
    { value: 'sudah', label: 'Sudah' },
    { value: 'belum', label: 'Belum' },
  ];

  // Function to fetch petani options based on kelompok tani
  const fetchPetaniByKelompok = async (kelompokTaniValue) => {
    if (kelompokTaniValue) {
      try {
        const response = await getListPetani({
          kelompok_tani: kelompokTaniValue,
          page_size: 100,
        });
        if (response?.data?.data?.results) {
          const options = response.data.data.results.map((item) => ({
            label: item.nama || item.petani_id || '-',
            value: item.id?.toString() || item.nama || item.petani_id || '',
          }));
          setPetaniOptions(options);
        }
      } catch (error) {
        console.error('Error fetching petani list:', error);
        setPetaniOptions([]);
      }
    } else {
      setPetaniOptions([]);
    }
  };

  // Fetch jenis legalitas and kelompok tani options when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchJenisLegalitas();
      fetchKelompokTani();
      fetchKomoditas();
      fetchPolaTanam();
      fetchJenisLahan();
      fetchAsalBenih();
      fetchJenisPupuk();
      fetchListProvinsi();
      // Fetch petani if kebunData has kelompok_tani
      if (kebunData?.kelompok_tani) {
        fetchPetaniByKelompok(kebunData.kelompok_tani);
      }
      // Fetch dependent lists if kebunData has kecamatan
      if (kebunData?.kecamatan) {
        const kecStr = kebunData.kecamatan.toString();
        const provId = kecStr.substring(0, 2);
        const kabId = kecStr.substring(0, 4);
        fetchListKota(provId);
        fetchListKecamatan(kabId);
        fetchListDesa(kecStr);
      }
    }
  }, [
    isOpen,
    fetchJenisLegalitas,
    fetchKelompokTani,
    fetchKomoditas,
    fetchPolaTanam,
    fetchJenisLahan,
    fetchAsalBenih,
    fetchJenisPupuk,
    kebunData?.kelompok_tani,
    kebunData?.kecamatan,
    fetchListProvinsi,
    fetchListKota,
    fetchListKecamatan,
    fetchListDesa,
  ]);

  // Parse existing data for form initialization
  const parseExistingData = (data) => {
    if (!data) return {};

    // Parse waktu_tanam date
    let waktuTanamMonth = '';
    let waktuTanamYear = '';
    if (data.waktu_tanam) {
      const date = new Date(data.waktu_tanam);
      waktuTanamMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      waktuTanamYear = date.getFullYear().toString();
    }

    // Handle petani - prefer petani_id if available, otherwise use petani_id
    let petaniValue = '';
    if (data.petani_id) {
      petaniValue = data.petani_id.toString();
    } else if (data.petani_id) {
      petaniValue = data.petani_id;
    }

    return {
      id_kebun: data.id_kebun || '',
      petani_id: petaniValue,
      kelompok_tani: data.kelompok_tani || '',
      lokasi_kebun: data.lokasi_kebun || '',
      provinsi: data.kecamatan ? data.kecamatan.toString().substring(0, 2) : '',
      kabupaten: data.kecamatan ? data.kecamatan.toString().substring(0, 4) : '',
      kecamatan: data.kecamatan?.toString() || '',
      desa: data.desa?.toString() || '',
      luas_kebun: data.luas || '',
      luas_peta: data.luas_peta || '',
      waktu_tanam_month: waktuTanamMonth,
      waktu_tanam_year: waktuTanamYear,
      is_rspo: data.is_rspo ? 'sudah' : 'belum',
      is_ispo: data.is_ispo ? 'sudah' : 'belum',
      jenis_legalitas: data.jenis_legalitas || '',
      nomor_legalitas: data.nomor_legalitas || '',
      pemilik_legalitas: data.pemilik_legalitas || '',
      nomor_stdb: data.nomor_stdb || '',
      komoditas: data.komoditas?.toString() || '',
      total_prod_per_tahun: data.total_prod_per_tahun?.toString() || '',
      tahun_peremajaan: data.tahun_peremajaan?.toString() || '',
      jumlah_pokok: data.jumlah_pohon?.toString() || data.jumlah_pokok?.toString() || '',
      pola_tanam: data.pola_tanam?.toString() || '',
      jenis_lahan: data.jenis_lahan?.toString() || '',
      asal_benih: data.asal_benih?.toString() || '',
      jenis_pupuk: data.jenis_pupuk?.toString() || '',
      mitra_penjualan: data.mitra_penjualan || '',
    };
  };

  const validationSchema = Yup.object({
    id_kebun: Yup.string().required('Id Kebun wajib diisi'),
    petani_id: Yup.string().required('Nama Petani wajib diisi'),
    lokasi_kebun: Yup.string().required('Lokasi Kebun wajib diisi'),
    provinsi: Yup.string().required('Provinsi wajib dipilih'),
    kabupaten: Yup.string().required('Kabupaten wajib dipilih'),
    kecamatan: Yup.string().required('Kecamatan wajib dipilih'),
    desa: Yup.string().required('Desa/Kelurahan wajib dipilih'),
    luas_kebun: Yup.string().required('Luas Kebun wajib diisi'),
    luas_peta: Yup.string().required('Luas Peta wajib diisi'),
    waktu_tanam_month: Yup.string().required('Bulan tanam wajib dipilih'),
    waktu_tanam_year: Yup.string().required('Tahun tanam wajib dipilih'),
    is_rspo: Yup.string().required('Status RSPO wajib dipilih'),
    is_ispo: Yup.string().required('Status ISPO wajib dipilih'),
    jenis_legalitas: Yup.string().required('Jenis Legalitas wajib dipilih'),
    nomor_legalitas: Yup.string().required('Nomor Legalitas wajib diisi'),
    pemilik_legalitas: Yup.string().required('Pemilik Legalitas wajib diisi'),
    nomor_stdb: Yup.string().nullable(),
    komoditas: Yup.string().required('Komoditas wajib diisi'),
    total_prod_per_tahun: Yup.string().required('Total produksi wajib diisi'),
    tahun_peremajaan: Yup.string().required('Tahun peremajaan wajib diisi'),
    jumlah_pokok: Yup.string().required('Jumlah pohon wajib diisi'),
    pola_tanam: Yup.string().required('Pola tanam wajib diisi'),
    jenis_lahan: Yup.string().required('Jenis lahan wajib diisi'),
    asal_benih: Yup.string().required('Asal benih wajib diisi'),
    jenis_pupuk: Yup.string().required('Jenis pupuk wajib diisi'),
    mitra_penjualan: Yup.string().required('Mitra penjualan wajib diisi'),
  });

  const formik = useFormik({
    initialValues: parseExistingData(kebunData),
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        // Format waktu_tanam as YYYY-MM-DD
        const waktuTanam = `${values.waktu_tanam_year}-${values.waktu_tanam_month}-01`;

        // Prepare API payload
        const payload = {
          id_kebun: values.id_kebun,
          petani_id: values.petani_id,
          lokasi_kebun: values.lokasi_kebun,
          kecamatan: values.kecamatan,
          desa: values.desa,
          luas: values.luas_kebun,
          luas_peta: values.luas_peta,
          waktu_tanam: waktuTanam,
          is_rspo: values.is_rspo === 'sudah',
          is_ispo: values.is_ispo === 'sudah',
          jenis_legalitas: values.jenis_legalitas,
          nomor_legalitas: values.nomor_legalitas,
          pemilik_legalitas: values.pemilik_legalitas,
          nomor_stdb: values.nomor_stdb,
          komoditas: values.komoditas,
          total_prod_per_tahun: parseFloat(values.total_prod_per_tahun),
          tahun_peremajaan: parseInt(values.tahun_peremajaan),
          jumlah_pokok: parseInt(values.jumlah_pokok) || 0,
          pola_tanam: values.pola_tanam,
          jenis_lahan: values.jenis_lahan,
          asal_benih: values.asal_benih,
          jenis_pupuk: values.jenis_pupuk,
          mitra_penjualan: values.mitra_penjualan,
        };

        // Call API
        const response = await updateKebun(kebunData?.id, payload);

        if (response?.data?.status === 'success') {
          toast.success('Data kebun berhasil diperbarui');
          onSuccess?.();
          onClose();
        } else {
          throw new Error(
            response?.data?.message || 'Gagal memperbarui data kebun'
          );
        }
      } catch (error) {
        console.error('Error updating kebun:', error);
        toast.error(error.message || 'Gagal memperbarui data kebun');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && kebunData) {
      formik.setValues(parseExistingData(kebunData));
      // Fetch petani options if kelompok_tani is set
      if (kebunData.kelompok_tani) {
        fetchPetaniByKelompok(kebunData.kelompok_tani);
      }
      // Fetch desa list if kecamatan is set
      if (kebunData.kecamatan) {
        fetchListDesa(kebunData.kecamatan);
      }
    }
  }, [isOpen, kebunData]);

  // Fetch petani options when kelompok_tani changes (for programmatic changes)
  useEffect(() => {
    if (isOpen && formik.values.kelompok_tani) {
      fetchPetaniByKelompok(formik.values.kelompok_tani);
    }
  }, [isOpen, formik.values.kelompok_tani]);

  // Fix case mismatch for kelompok_tani with API options
  useEffect(() => {
    if (kelompokTani.length > 0 && formik.values.kelompok_tani) {
      const matched = kelompokTani.find(
        (opt) => typeof opt.value === 'string' && opt.value.toLowerCase() === formik.values.kelompok_tani.toLowerCase()
      );
      if (matched && matched.value !== formik.values.kelompok_tani) {
        formik.setFieldValue('kelompok_tani', matched.value);
      }
    }
  }, [kelompokTani, formik.values.kelompok_tani, formik.setFieldValue]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleProvinsiChange = (e) => {
    formik.handleChange(e);
    formik.setFieldValue('kabupaten', '');
    formik.setFieldValue('kecamatan', '');
    formik.setFieldValue('desa', '');
    if (e.target.value) {
      fetchListKota(e.target.value);
    }
  };

  const handleKotaChange = (e) => {
    formik.handleChange(e);
    formik.setFieldValue('kecamatan', '');
    formik.setFieldValue('desa', '');
    if (e.target.value) {
      fetchListKecamatan(e.target.value);
    }
  };

  const handleKecamatanChange = (e) => {
    formik.handleChange(e);
    formik.setFieldValue('desa', '');
    if (e.target.value) {
      fetchListDesa(e.target.value);
    }
  };

  return (
    <BaseModal
      open={isOpen}
      setOpen={handleClose}
      label="UBAH KEBUN"
      className="max-w-4xl"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Row 1: Id Kebun | Kelompok Tani */}
          <InputText
            label="Id Kebun"
            name="id_kebun"
            value={formik.values.id_kebun}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isError={formik.touched.id_kebun && formik.errors.id_kebun}
            errors={formik.errors}
            touched={formik.touched}
          />
          <Select
            label="Kelompok Tani"
            name="kelompok_tani"
            value={formik.values.kelompok_tani}
            onChange={(e) => {
              formik.handleChange(e);
              const newKelompokTani = e.target.value;
              // Reset petani when kelompok tani changes
              formik.setFieldValue('petani_id', '');
              // Fetch petani options for the new kelompok tani
              fetchPetaniByKelompok(newKelompokTani);
            }}
            onBlur={formik.handleBlur}
            options={kelompokTani}
            placeholder="Pilih Kelompok Tani"
            isError={
              formik.touched.kelompok_tani && formik.errors.kelompok_tani
            }
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 2: Nama Petani | Lokasi Kebun */}
          <Select
            label="Nama Petani"
            name="petani_id"
            value={formik.values.petani_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={petaniOptions}
            placeholder="Pilih Nama Petani"
            isError={formik.touched.petani_id && formik.errors.petani_id}
            errors={formik.errors}
            touched={formik.touched}
          />
          <InputText
            label="Lokasi Kebun"
            name="lokasi_kebun"
            value={formik.values.lokasi_kebun}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isError={
              formik.touched.lokasi_kebun && formik.errors.lokasi_kebun
            }
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 3: Provinsi | Kabupaten */}
          <Select
            label="Provinsi"
            name="provinsi"
            value={formik.values.provinsi}
            onChange={handleProvinsiChange}
            onBlur={formik.handleBlur}
            options={listProvinsi}
            placeholder="Pilih Provinsi"
            isError={formik.touched.provinsi && formik.errors.provinsi}
            errors={formik.errors}
            touched={formik.touched}
          />
          <Select
            label="Kabupaten"
            name="kabupaten"
            value={formik.values.kabupaten}
            onChange={handleKotaChange}
            onBlur={formik.handleBlur}
            options={listKota}
            placeholder="Pilih Kabupaten"
            isError={formik.touched.kabupaten && formik.errors.kabupaten}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 4: Kecamatan | Desa/Kelurahan */}
          <Select
            label="Kecamatan"
            name="kecamatan"
            value={formik.values.kecamatan}
            onChange={handleKecamatanChange}
            onBlur={formik.handleBlur}
            options={listKecamatan}
            placeholder="Pilih Kecamatan"
            isError={formik.touched.kecamatan && formik.errors.kecamatan}
            errors={formik.errors}
            touched={formik.touched}
          />
          <Select
            label="Desa/Kelurahan"
            name="desa"
            value={formik.values.desa}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={listDesa}
            placeholder="Pilih Desa/Kelurahan"
            isError={formik.touched.desa && formik.errors.desa}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 5: Luas Kebun (Ha) | Luas Peta (Ha) */}
          <InputText
            label="Luas Kebun (Ha)"
            name="luas_kebun"
            type="number"
            value={formik.values.luas_kebun}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="0.00"
            isError={formik.touched.luas_kebun && formik.errors.luas_kebun}
            errors={formik.errors}
            touched={formik.touched}
          />
          <InputText
            label="Luas Peta (Ha)"
            name="luas_peta"
            type="number"
            value={formik.values.luas_peta}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="0.00"
            isError={formik.touched.luas_peta && formik.errors.luas_peta}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 6: Waktu Tanam | Komoditas */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Waktu Tanam
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Select
                name="waktu_tanam_month"
                value={formik.values.waktu_tanam_month}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={monthOptions}
                placeholder="Bulan"
                isError={
                  formik.touched.waktu_tanam_month &&
                  formik.errors.waktu_tanam_month
                }
                errors={formik.errors}
                touched={formik.touched}
              />
              <Select
                name="waktu_tanam_year"
                value={formik.values.waktu_tanam_year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={yearOptions}
                placeholder="Tahun"
                isError={
                  formik.touched.waktu_tanam_year &&
                  formik.errors.waktu_tanam_year
                }
                errors={formik.errors}
                touched={formik.touched}
              />
            </div>
          </div>
          <Select
            label="Komoditas"
            name="komoditas"
            value={formik.values.komoditas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={komoditas}
            placeholder="Pilih Komoditas"
            isError={formik.touched.komoditas && formik.errors.komoditas}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 7: Total Produksi 1 Tahun (Kg) | Jumlah Pohon */}
          <InputText
            label="Total Produksi 1 Tahun (Kg)"
            name="total_prod_per_tahun"
            type="number"
            value={formik.values.total_prod_per_tahun}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="18000"
            isError={formik.touched.total_prod_per_tahun && formik.errors.total_prod_per_tahun}
            errors={formik.errors}
            touched={formik.touched}
          />
          <InputText
            label="Jumlah Pohon"
            name="jumlah_pokok"
            type="number"
            value={formik.values.jumlah_pokok}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="300"
            isError={formik.touched.jumlah_pokok && formik.errors.jumlah_pokok}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 8: Pola Tanam | Jenis Lahan */}
          <Select
            label="Pola Tanam"
            name="pola_tanam"
            value={formik.values.pola_tanam}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={polaTanam}
            placeholder="Pilih Pola Tanam"
            isError={formik.touched.pola_tanam && formik.errors.pola_tanam}
            errors={formik.errors}
            touched={formik.touched}
          />
          <Select
            label="Jenis Lahan"
            name="jenis_lahan"
            value={formik.values.jenis_lahan}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={jenisLahan}
            placeholder="Pilih Jenis Lahan"
            isError={formik.touched.jenis_lahan && formik.errors.jenis_lahan}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 9: Asal Benih | Jenis Pupuk */}
          <Select
            label="Asal Benih"
            name="asal_benih"
            value={formik.values.asal_benih}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={asalBenih}
            placeholder="Pilih Asal Benih"
            isError={formik.touched.asal_benih && formik.errors.asal_benih}
            errors={formik.errors}
            touched={formik.touched}
          />
          <Select
            label="Jenis Pupuk"
            name="jenis_pupuk"
            value={formik.values.jenis_pupuk}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={jenisPupuk}
            placeholder="Pilih Jenis Pupuk"
            isError={formik.touched.jenis_pupuk && formik.errors.jenis_pupuk}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 10: Jenis Legalitas | No. Legalitas */}
          <Select
            label="Jenis Legalitas"
            name="jenis_legalitas"
            value={formik.values.jenis_legalitas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={jenisLegalitas}
            placeholder="Pilih Jenis"
            isError={
              formik.touched.jenis_legalitas && formik.errors.jenis_legalitas
            }
            errors={formik.errors}
            touched={formik.touched}
          />
          <InputText
            label="No. Legalitas"
            name="nomor_legalitas"
            value={formik.values.nomor_legalitas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isError={
              formik.touched.nomor_legalitas && formik.errors.nomor_legalitas
            }
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 11: Pemilik Legalitas | STDB */}
          <InputText
            label="Pemilik Legalitas"
            name="pemilik_legalitas"
            value={formik.values.pemilik_legalitas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isError={
              formik.touched.pemilik_legalitas &&
              formik.errors.pemilik_legalitas
            }
            errors={formik.errors}
            touched={formik.touched}
          />
          <InputText
            label="STDB"
            name="nomor_stdb"
            value={formik.values.nomor_stdb}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isError={formik.touched.nomor_stdb && formik.errors.nomor_stdb}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 12: RSPO | ISPO */}
          <Select
            label="RSPO"
            name="is_rspo"
            value={formik.values.is_rspo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={statusOptions}
            placeholder="Pilih Status"
            isError={formik.touched.is_rspo && formik.errors.is_rspo}
            errors={formik.errors}
            touched={formik.touched}
          />
          <Select
            label="ISPO"
            name="is_ispo"
            value={formik.values.is_ispo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={statusOptions}
            placeholder="Pilih Status"
            isError={formik.touched.is_ispo && formik.errors.is_ispo}
            errors={formik.errors}
            touched={formik.touched}
          />

          {/* Row 13: Tahun Peremajaan | Mitra Penjualan */}
          <InputText
            label="Tahun Peremajaan"
            name="tahun_peremajaan"
            type="number"
            value={formik.values.tahun_peremajaan}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="2020"
            isError={formik.touched.tahun_peremajaan && formik.errors.tahun_peremajaan}
            errors={formik.errors}
            touched={formik.touched}
          />
          <InputText
            label="Mitra Penjualan"
            name="mitra_penjualan"
            value={formik.values.mitra_penjualan}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Masukan Mitra Penjualan"
            isError={formik.touched.mitra_penjualan && formik.errors.mitra_penjualan}
            errors={formik.errors}
            touched={formik.touched}
          />
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

export default ModalEditKebun;
