'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const TambahTahunPupukPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const tahunOptions = useYearOptions();

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PUPUK', href: '/traceability/gap/pupuk' },
    { label: 'DETAIL PUPUK', href: `/traceability/gap/pupuk/${id}` },
    { label: 'TAMBAH TAHUN PUPUK' },
  ];

  const initialValues = {
    tahun: new Date().getFullYear().toString(),
    // Semester 1 (using month numbers: 1-12, empty by default)
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
    // Semester 2
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
  };

  const validationSchema = Yup.object().shape({
    tahun: Yup.string().required('Wajib diisi'),
    // Semester 1 validation
    s1_npk_waktu: Yup.number().required('Wajib diisi'),
    s1_npk_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_nitrogen_waktu: Yup.number().required('Wajib diisi'),
    s1_nitrogen_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_pospat_waktu: Yup.number().required('Wajib diisi'),
    s1_pospat_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_kalium_waktu: Yup.number().required('Wajib diisi'),
    s1_kalium_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_boron_waktu: Yup.number().required('Wajib diisi'),
    s1_boron_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_magnesium_waktu: Yup.number().required('Wajib diisi'),
    s1_magnesium_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    // Semester 2 validation
    s2_npk_waktu: Yup.number().required('Wajib diisi'),
    s2_npk_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_nitrogen_waktu: Yup.number().required('Wajib diisi'),
    s2_nitrogen_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_pospat_waktu: Yup.number().required('Wajib diisi'),
    s2_pospat_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_kalium_waktu: Yup.number().required('Wajib diisi'),
    s2_kalium_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_boron_waktu: Yup.number().required('Wajib diisi'),
    s2_boron_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_magnesium_waktu: Yup.number().required('Wajib diisi'),
    s2_magnesium_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Map form values to API request format
        const payload = {
          kebun: parseInt(id),
          tahun: parseInt(values.tahun),
          // Semester 1 (values are already numbers 1-12)
          s1_npk_waktu_aplikasi: values.s1_npk_waktu,
          s1_npk_jumlah: parseKgInput(values.s1_npk_jumlah),
          s1_natrium_waktu_aplikasi: values.s1_nitrogen_waktu,
          s1_natrium_jumlah: parseKgInput(values.s1_nitrogen_jumlah),
          s1_postat_waktu_aplikasi: values.s1_pospat_waktu,
          s1_postat_jumlah: parseKgInput(values.s1_pospat_jumlah),
          s1_kalium_waktu_aplikasi: values.s1_kalium_waktu,
          s1_kalium_jumlah: parseKgInput(values.s1_kalium_jumlah),
          s1_boron_waktu_aplikasi: values.s1_boron_waktu,
          s1_boron_jumlah: parseKgInput(values.s1_boron_jumlah),
          s1_magnesium_waktu_aplikasi: values.s1_magnesium_waktu,
          s1_magnesium_jumlah: parseKgInput(values.s1_magnesium_jumlah),
          // Semester 2
          s2_npk_waktu_aplikasi: values.s2_npk_waktu,
          s2_npk_jumlah: parseKgInput(values.s2_npk_jumlah),
          s2_natrium_waktu_aplikasi: values.s2_nitrogen_waktu,
          s2_natrium_jumlah: parseKgInput(values.s2_nitrogen_jumlah),
          s2_postat_waktu_aplikasi: values.s2_pospat_waktu,
          s2_postat_jumlah: parseKgInput(values.s2_pospat_jumlah),
          s2_kalium_waktu_aplikasi: values.s2_kalium_waktu,
          s2_kalium_jumlah: parseKgInput(values.s2_kalium_jumlah),
          s2_boron_waktu_aplikasi: values.s2_boron_waktu,
          s2_boron_jumlah: parseKgInput(values.s2_boron_jumlah),
          s2_magnesium_waktu_aplikasi: values.s2_magnesium_waktu,
          s2_magnesium_jumlah: parseKgInput(values.s2_magnesium_jumlah),
        };

        const response = await createPupuk(payload);

        if (response?.status === 201) {
          toast.success(
            response?.data?.message || 'Berhasil menambahkan data pupuk'
          );
          // Reset form after successful submission
          formik.resetForm();
          // Navigate back to detail page
          router.push(`/traceability/gap/pupuk/${id}`);
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
    router.push(`/traceability/gap/pupuk/${id}`);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <BreadcrumbDetail items={crumbs} />

      <section className="rounded border border-gray-300 bg-white p-6">
        <div className="mb-4">
          <Heading
            level={4}
            className="text-sm font-semibold text-gray-800 md:text-base"
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

          {/* Semester 1 */}
          <div>
            <div className="space-y-4">
              {/* Row 1: NPK and Natrium */}
              <div className="flex flex-row gap-4 border-y border-dashed py-4 items-stretch">
                <div className="text-sm font-semibold min-w-[100px] h-full flex flex-1 items-center self-center">
                  <Heading level={6} className="text-sm font-semibold">
                    Semester 1
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
                  isRequired={true}
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
                  isRequired={true}
                />
                <Select
                  label="(Natrium) Waktu Aplikasi"
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
                  isRequired={true}
                />
                <InputText
                  label="(Natrium) Jumlah"
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
                  isRequired={true}
                />
              </div>

              {/* Row 2: Postat and Kalium */}
              <div className="flex flex-row gap-4 border-b border-dashed pb-4">
                <div className="min-w-[100px]" />
                <Select
                  label="(Postat) Waktu Aplikasi"
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
                  isRequired={true}
                />
                <InputText
                  label="(Postat) Jumlah"
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
                  isRequired={true}
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
                  isRequired={true}
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
                  isRequired={true}
                />
              </div>

              {/* Row 3: Boron and Magnesium */}
              <div className="flex flex-row gap-4 border-b border-dashed pb-4">
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
                  isRequired={true}
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
                  isRequired={true}
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
                  isRequired={true}
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
                  isRequired={true}
                />
              </div>
            </div>
          </div>

          {/* Semester 2 */}
          <div>
            <div className="space-y-4">
              {/* Row 1: NPK and Natrium */}
              <div className="flex flex-row gap-4 border-b border-dashed pb-4 items-stretch">
                <div className="text-sm font-semibold min-w-[100px] h-full flex flex-1 items-center self-center">
                  <Heading level={6} className="text-sm font-semibold">
                    Semester 2
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
                  isRequired={true}
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
                  isRequired={true}
                />
                <Select
                  label="(Natrium) Waktu Aplikasi"
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
                  isRequired={true}
                />
                <InputText
                  label="(Natrium) Jumlah"
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
                  isRequired={true}
                />
              </div>

              {/* Row 2: Postat and Kalium */}
              <div className="flex flex-row gap-4 border-b border-dashed pb-4">
                <div className="min-w-[100px]" />
                <Select
                  label="(Postat) Waktu Aplikasi"
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
                  isRequired={true}
                />
                <InputText
                  label="(Postat) Jumlah"
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
                  isRequired={true}
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
                  isRequired={true}
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
                  isRequired={true}
                />
              </div>

              {/* Row 3: Boron and Magnesium */}
              <div className="flex flex-row gap-4 border-b border-dashed pb-4">
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
                  isRequired={true}
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
                  isRequired={true}
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
                  isRequired={true}
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
                  isRequired={true}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="danger"
              onClick={handleCancel}
              disabled={loading}
            >
              Batalkan
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default TambahTahunPupukPage;
