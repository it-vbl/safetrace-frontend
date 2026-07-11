'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import { MONTH_OPTIONS } from '@/constants/months';
import useYearOptions from '@/hooks/useYearOptions';
import { createPupuk } from '@/services/pupuk';

const formatKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};

const parseKgInput = (v) => {
  if (!v) return null;
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const TambahTahunPupukContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const kebunParam = searchParams.get('kebun');
  const [loading, setLoading] = useState(false);
  const tahunOptions = useYearOptions();

  const crumbs = kebunParam
    ? [
      { label: 'HOME', href: '/' },
      { label: 'PUPUK', href: '/traceability/gap/pupuk' },
      { label: 'DETAIL PUPUK', href: `/traceability/gap/pupuk/${kebunParam}` },
      { label: 'TAMBAH TAHUN PUPUK' },
    ]
    : [
      { label: 'HOME', href: '/' },
      { label: 'PUPUK', href: '/traceability/gap/pupuk' },
      { label: 'TAMBAH TAHUN PUPUK' },
    ];

  const initialValues = {
    tahun: new Date().getFullYear().toString(),
    // Tahap 1 (using month numbers: 1-12, empty by default)
    s1_npk_waktu: '',
    s1_npk_jumlah: '',
    s1_nitrogen_waktu: '',
    s1_nitrogen_jumlah: '',
    s1_pospat_waktu: '',
    s1_pospat_jumlah: '',
    s1_kalium_waktu: '',
    s1_kalium_jumlah: '',
    s1_boron_waktu: '',
    s1_boron_jumlah: '',
    s1_magnesium_waktu: '',
    s1_magnesium_jumlah: '',
    // Tahap 2
    s2_npk_waktu: '',
    s2_npk_jumlah: '',
    s2_nitrogen_waktu: '',
    s2_nitrogen_jumlah: '',
    s2_pospat_waktu: '',
    s2_pospat_jumlah: '',
    s2_kalium_waktu: '',
    s2_kalium_jumlah: '',
    s2_boron_waktu: '',
    s2_boron_jumlah: '',
    s2_magnesium_waktu: '',
    s2_magnesium_jumlah: '',
    // Tahap 3
    s3_npk_waktu: '',
    s3_npk_jumlah: '',
    s3_nitrogen_waktu: '',
    s3_nitrogen_jumlah: '',
    s3_pospat_waktu: '',
    s3_pospat_jumlah: '',
    s3_kalium_waktu: '',
    s3_kalium_jumlah: '',
    s3_boron_waktu: '',
    s3_boron_jumlah: '',
    s3_magnesium_waktu: '',
    s3_magnesium_jumlah: '',
  };

  const validationSchema = Yup.object().shape({
    tahun: Yup.string().required('Wajib diisi'),
    // Tahap 1 validation
    s1_npk_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s1_npk_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_nitrogen_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s1_nitrogen_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_pospat_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s1_pospat_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_kalium_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s1_kalium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_boron_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s1_boron_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_magnesium_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s1_magnesium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    // Tahap 2 validation
    s2_npk_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s2_npk_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_nitrogen_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s2_nitrogen_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_pospat_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s2_pospat_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_kalium_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s2_kalium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_boron_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s2_boron_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_magnesium_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s2_magnesium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    // Tahap 3 validation
    s3_npk_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s3_npk_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_nitrogen_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s3_nitrogen_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_pospat_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s3_pospat_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_kalium_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s3_kalium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_boron_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s3_boron_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_magnesium_waktu: Yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === '' || originalValue === 0 ? null : value)).min(1).max(12),
    s3_magnesium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const kebunId = kebunParam ? parseInt(kebunParam) : null;
        if (!kebunId || Number.isNaN(kebunId)) {
          toast.error(
            'Id Kebun tidak ditemukan. Coba dari halaman detail kebun.'
          );
          setLoading(false);
          return;
        }

        // Map form values to API request format
        const payload = {
          kebun: kebunId,
          tahun: parseInt(values.tahun),
          // Tahap 1 (values are already numbers 1-12)
          s1_npk_waktu_aplikasi: values.s1_npk_waktu ? Number(values.s1_npk_waktu) : null,
          s1_npk_jumlah: parseKgInput(values.s1_npk_jumlah),
          s1_natrium_waktu_aplikasi: values.s1_nitrogen_waktu ? Number(values.s1_nitrogen_waktu) : null,
          s1_natrium_jumlah: parseKgInput(values.s1_nitrogen_jumlah),
          s1_postat_waktu_aplikasi: values.s1_pospat_waktu ? Number(values.s1_pospat_waktu) : null,
          s1_postat_jumlah: parseKgInput(values.s1_pospat_jumlah),
          s1_kalium_waktu_aplikasi: values.s1_kalium_waktu ? Number(values.s1_kalium_waktu) : null,
          s1_kalium_jumlah: parseKgInput(values.s1_kalium_jumlah),
          s1_boron_waktu_aplikasi: values.s1_boron_waktu ? Number(values.s1_boron_waktu) : null,
          s1_boron_jumlah: parseKgInput(values.s1_boron_jumlah),
          s1_magnesium_waktu_aplikasi: values.s1_magnesium_waktu ? Number(values.s1_magnesium_waktu) : null,
          s1_magnesium_jumlah: parseKgInput(values.s1_magnesium_jumlah),
          // Tahap 2
          s2_npk_waktu_aplikasi: values.s2_npk_waktu ? Number(values.s2_npk_waktu) : null,
          s2_npk_jumlah: parseKgInput(values.s2_npk_jumlah),
          s2_natrium_waktu_aplikasi: values.s2_nitrogen_waktu ? Number(values.s2_nitrogen_waktu) : null,
          s2_natrium_jumlah: parseKgInput(values.s2_nitrogen_jumlah),
          s2_postat_waktu_aplikasi: values.s2_pospat_waktu ? Number(values.s2_pospat_waktu) : null,
          s2_postat_jumlah: parseKgInput(values.s2_pospat_jumlah),
          s2_kalium_waktu_aplikasi: values.s2_kalium_waktu ? Number(values.s2_kalium_waktu) : null,
          s2_kalium_jumlah: parseKgInput(values.s2_kalium_jumlah),
          s2_boron_waktu_aplikasi: values.s2_boron_waktu ? Number(values.s2_boron_waktu) : null,
          s2_boron_jumlah: parseKgInput(values.s2_boron_jumlah),
          s2_magnesium_waktu_aplikasi: values.s2_magnesium_waktu ? Number(values.s2_magnesium_waktu) : null,
          s2_magnesium_jumlah: parseKgInput(values.s2_magnesium_jumlah),
          // Tahap 3
          s3_npk_waktu_aplikasi: values.s3_npk_waktu ? Number(values.s3_npk_waktu) : null,
          s3_npk_jumlah: parseKgInput(values.s3_npk_jumlah),
          s3_natrium_waktu_aplikasi: values.s3_nitrogen_waktu ? Number(values.s3_nitrogen_waktu) : null,
          s3_natrium_jumlah: parseKgInput(values.s3_nitrogen_jumlah),
          s3_postat_waktu_aplikasi: values.s3_pospat_waktu ? Number(values.s3_pospat_waktu) : null,
          s3_postat_jumlah: parseKgInput(values.s3_pospat_jumlah),
          s3_kalium_waktu_aplikasi: values.s3_kalium_waktu ? Number(values.s3_kalium_waktu) : null,
          s3_kalium_jumlah: parseKgInput(values.s3_kalium_jumlah),
          s3_boron_waktu_aplikasi: values.s3_boron_waktu ? Number(values.s3_boron_waktu) : null,
          s3_boron_jumlah: parseKgInput(values.s3_boron_jumlah),
          s3_magnesium_waktu_aplikasi: values.s3_magnesium_waktu ? Number(values.s3_magnesium_waktu) : null,
          s3_magnesium_jumlah: parseKgInput(values.s3_magnesium_jumlah),
        };

        const response = await createPupuk(payload);

        if (response?.status === 201) {
          toast.success(
            response?.data?.message || 'Berhasil menambahkan data pupuk'
          );
          // Reset form after successful submission
          formik.resetForm();
          // Navigate back to detail page
          if (kebunParam) {
            router.push(`/traceability/gap/pupuk/${kebunParam}`);
          } else {
            router.push('/traceability/gap/pupuk');
          }
        } else {
          toast.error('Gagal menambahkan data pupuk');
        }
      } catch (error) {
        console.error('Error adding tahun pupuk:', error);
        toast.error(
          error?.response?.data?.message || 'Gagal menambahkan data pupuk'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCancel = () => {
    if (kebunParam) {
      router.push(`/traceability/gap/pupuk/${kebunParam}`);
    } else {
      router.push('/traceability/gap/pupuk');
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <BreadcrumbDetail items={crumbs} />

      <section className="rounded border border-neutral-300 bg-white p-6">
        <div className="mb-4">
          <Heading
            level={4}
            className="text-sm font-semibold text-neutral-800 md:text-base"
          >
            PEMUPUKAN
          </Heading>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Tahun Input */}
          <div className="w-full">
            <Select
              label="Tahun"
              placeholder="Pilih Tahun"
              options={tahunOptions}
              value={formik.values.tahun}
              onChange={(e) => formik.setFieldValue('tahun', e.target.value)}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              name="tahun"
              isRequired
            />
          </div>

          {/* Tahap 1 */}
          <div>
            <div className="space-y-4">
              {/* Row 1: NPK and Nitrogen */}
              <div className="flex flex-col lg:flex-row gap-4 border-y border-dashed py-4 items-stretch">
                <div className="text-sm font-semibold min-w-[100px] h-full flex flex-1 items-center self-center">
                  <Heading level={6} className="text-sm font-semibold">
                    Tahap 1
                  </Heading>
                </div>

                <Select
                  label="(NPK) Waktu Aplikasi"
                  name="s1_npk_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s1_npk_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s1_npk_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(NPK) Jumlah"
                  name="s1_npk_jumlah"
                  placeholder="0"
                  value={formik.values.s1_npk_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Nitrogen) Waktu Aplikasi"
                  name="s1_nitrogen_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s1_nitrogen_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s1_nitrogen_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Nitrogen) Jumlah"
                  name="s1_nitrogen_jumlah"
                  placeholder="0"
                  value={formik.values.s1_nitrogen_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>

              {/* Row 2: Postpat and Kalium */}
              <div className="flex flex-col lg:flex-row gap-4 border-b border-dashed pb-4">
                <div className="min-w-[100px]" />
                <Select
                  label="(Postpat) Waktu Aplikasi"
                  name="s1_pospat_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s1_pospat_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s1_pospat_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Postpat) Jumlah"
                  name="s1_pospat_jumlah"
                  placeholder="0"
                  value={formik.values.s1_pospat_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Kalium) Waktu Aplikasi"
                  name="s1_kalium_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s1_kalium_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s1_kalium_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Kalium) Jumlah"
                  name="s1_kalium_jumlah"
                  placeholder="0"
                  value={formik.values.s1_kalium_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>

              {/* Row 3: Boron and Magnesium */}
              <div className="flex flex-col lg:flex-row gap-4 border-b border-dashed pb-4">
                <div className="min-w-[100px]" />
                <Select
                  label="(Boron) Waktu Aplikasi"
                  name="s1_boron_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s1_boron_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s1_boron_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Boron) Jumlah"
                  name="s1_boron_jumlah"
                  placeholder="0"
                  value={formik.values.s1_boron_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Magnesium) Waktu Aplikasi"
                  name="s1_magnesium_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s1_magnesium_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s1_magnesium_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Magnesium) Jumlah"
                  name="s1_magnesium_jumlah"
                  placeholder="0"
                  value={formik.values.s1_magnesium_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>
            </div>
          </div>

          {/* Tahap 2 */}
          <div>
            <div className="space-y-4">
              {/* Row 1: NPK and Nitrogen */}
              <div className="flex flex-col lg:flex-row gap-4 border-b border-dashed pb-4 items-stretch">
                <div className="text-sm font-semibold min-w-[100px] h-full flex flex-1 items-center self-center">
                  <Heading level={6} className="text-sm font-semibold">
                    Tahap 2
                  </Heading>
                </div>

                <Select
                  label="(NPK) Waktu Aplikasi"
                  name="s2_npk_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s2_npk_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s2_npk_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(NPK) Jumlah"
                  name="s2_npk_jumlah"
                  placeholder="0"
                  value={formik.values.s2_npk_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Nitrogen) Waktu Aplikasi"
                  name="s2_nitrogen_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s2_nitrogen_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s2_nitrogen_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Nitrogen) Jumlah"
                  name="s2_nitrogen_jumlah"
                  placeholder="0"
                  value={formik.values.s2_nitrogen_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>

              {/* Row 2: Postpat and Kalium */}
              <div className="flex flex-col lg:flex-row gap-4 border-b border-dashed pb-4">
                <div className="min-w-[100px]" />
                <Select
                  label="(Postpat) Waktu Aplikasi"
                  name="s2_pospat_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s2_pospat_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s2_pospat_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Postpat) Jumlah"
                  name="s2_pospat_jumlah"
                  placeholder="0"
                  value={formik.values.s2_pospat_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Kalium) Waktu Aplikasi"
                  name="s2_kalium_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s2_kalium_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s2_kalium_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Kalium) Jumlah"
                  name="s2_kalium_jumlah"
                  placeholder="0"
                  value={formik.values.s2_kalium_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>

              {/* Row 3: Boron and Magnesium */}
              <div className="flex flex-col lg:flex-row gap-4 border-b border-dashed pb-4">
                <div className="min-w-[100px]" />
                <Select
                  label="(Boron) Waktu Aplikasi"
                  name="s2_boron_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s2_boron_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s2_boron_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Boron) Jumlah"
                  name="s2_boron_jumlah"
                  placeholder="0"
                  value={formik.values.s2_boron_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Magnesium) Waktu Aplikasi"
                  name="s2_magnesium_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s2_magnesium_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s2_magnesium_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Magnesium) Jumlah"
                  name="s2_magnesium_jumlah"
                  placeholder="0"
                  value={formik.values.s2_magnesium_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>
            </div>
          </div>

          {/* Tahap 3 */}
          <div>
            <div className="space-y-4">
              {/* Row 1: NPK and Nitrogen */}
              <div className="flex flex-col lg:flex-row gap-4 border-b border-dashed pb-4 items-stretch">
                <div className="text-sm font-semibold min-w-[100px] h-full flex flex-1 items-center self-center">
                  <Heading level={6} className="text-sm font-semibold">
                    Tahap 3
                  </Heading>
                </div>

                <Select
                  label="(NPK) Waktu Aplikasi"
                  name="s3_npk_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s3_npk_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s3_npk_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(NPK) Jumlah"
                  name="s3_npk_jumlah"
                  placeholder="0"
                  value={formik.values.s3_npk_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Nitrogen) Waktu Aplikasi"
                  name="s3_nitrogen_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s3_nitrogen_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s3_nitrogen_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Nitrogen) Jumlah"
                  name="s3_nitrogen_jumlah"
                  placeholder="0"
                  value={formik.values.s3_nitrogen_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>

              {/* Row 2: Postpat and Kalium */}
              <div className="flex flex-col lg:flex-row gap-4 border-b border-dashed pb-4">
                <div className="min-w-[100px]" />
                <Select
                  label="(Postpat) Waktu Aplikasi"
                  name="s3_pospat_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s3_pospat_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s3_pospat_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Postpat) Jumlah"
                  name="s3_pospat_jumlah"
                  placeholder="0"
                  value={formik.values.s3_pospat_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Kalium) Waktu Aplikasi"
                  name="s3_kalium_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s3_kalium_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s3_kalium_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Kalium) Jumlah"
                  name="s3_kalium_jumlah"
                  placeholder="0"
                  value={formik.values.s3_kalium_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>

              {/* Row 3: Boron and Magnesium */}
              <div className="flex flex-col lg:flex-row gap-4 border-b border-dashed pb-4">
                <div className="min-w-[100px]" />
                <Select
                  label="(Boron) Waktu Aplikasi"
                  name="s3_boron_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s3_boron_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s3_boron_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Boron) Jumlah"
                  name="s3_boron_jumlah"
                  placeholder="0"
                  value={formik.values.s3_boron_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
                <Select
                  label="(Magnesium) Waktu Aplikasi"
                  name="s3_magnesium_waktu"
                  placeholder="Pilih bulan"
                  options={MONTH_OPTIONS}
                  value={formik.values.s3_magnesium_waktu}
                  onChange={(e) =>
                    formik.setFieldValue('s3_magnesium_waktu', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                />
                <InputText
                  label="(Magnesium) Jumlah"
                  name="s3_magnesium_jumlah"
                  placeholder="0"
                  value={formik.values.s3_magnesium_jumlah}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  suffix="Kg"
                  type="string"
                  formatter={formatKgInput}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3 pt-4 sm:flex-row">
            <Button
              type="button"
              variant="danger"
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Batalkan
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

const TambahTahunPupukPage = () => {
  return (
    <Suspense fallback={
      <div className="flex w-full justify-center py-10 text-sm text-neutral-500">
        Memuat data...
      </div>
    }>
      <TambahTahunPupukContent />
    </Suspense>
  )
}

export default TambahTahunPupukPage;
