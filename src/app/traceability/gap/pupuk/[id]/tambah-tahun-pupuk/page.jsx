'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useYearOptions from '@/hooks/useYearOptions';

const MONTH_OPTIONS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const formatKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};

const parseKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const TambahTahunPupukPage = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const tahunOptions = useYearOptions();

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PUPUK', href: '/traceability/gap/pupuk' },
    { label: 'DETAIL PUPUK', href: `/traceability/gap/pupuk/${params.id}` },
    { label: 'TAMBAH TAHUN PUPUK' },
  ];

  const initialValues = {
    tahun: new Date().getFullYear().toString(),
    // Semester 1
    s1_npk_waktu: 'Maret',
    s1_npk_jumlah: '2',
    s1_nitrogen_waktu: 'Maret',
    s1_nitrogen_jumlah: '2',
    s1_pospat_waktu: 'Maret',
    s1_pospat_jumlah: '2',
    s1_kalium_waktu: 'Maret',
    s1_kalium_jumlah: '2',
    s1_boron_waktu: 'Maret',
    s1_boron_jumlah: '2',
    s1_magnesium_waktu: 'Maret',
    s1_magnesium_jumlah: '2',
    // Semester 2
    s2_npk_waktu: 'Maret',
    s2_npk_jumlah: '2',
    s2_nitrogen_waktu: 'Maret',
    s2_nitrogen_jumlah: '2',
    s2_pospat_waktu: 'Maret',
    s2_pospat_jumlah: '2',
    s2_kalium_waktu: 'Maret',
    s2_kalium_jumlah: '2',
    s2_boron_waktu: 'Maret',
    s2_boron_jumlah: '2',
    s2_magnesium_waktu: 'Maret',
    s2_magnesium_jumlah: '2',
  };

  const validationSchema = Yup.object().shape({
    tahun: Yup.string().required('Wajib diisi'),
    // Semester 1 validation
    s1_npk_waktu: Yup.string().required('Wajib diisi'),
    s1_npk_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_nitrogen_waktu: Yup.string().required('Wajib diisi'),
    s1_nitrogen_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_pospat_waktu: Yup.string().required('Wajib diisi'),
    s1_pospat_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_kalium_waktu: Yup.string().required('Wajib diisi'),
    s1_kalium_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_boron_waktu: Yup.string().required('Wajib diisi'),
    s1_boron_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s1_magnesium_waktu: Yup.string().required('Wajib diisi'),
    s1_magnesium_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    // Semester 2 validation
    s2_npk_waktu: Yup.string().required('Wajib diisi'),
    s2_npk_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_nitrogen_waktu: Yup.string().required('Wajib diisi'),
    s2_nitrogen_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_pospat_waktu: Yup.string().required('Wajib diisi'),
    s2_pospat_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_kalium_waktu: Yup.string().required('Wajib diisi'),
    s2_kalium_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_boron_waktu: Yup.string().required('Wajib diisi'),
    s2_boron_jumlah: Yup.string()
      .required('Wajib diisi')
      .test('angka-valid', 'Harus angka >= 0', (val) => {
        const n = parseKgInput(val);
        return Number.isFinite(n) && n >= 0;
      }),
    s2_magnesium_waktu: Yup.string().required('Wajib diisi'),
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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In real implementation, you would call the API here:
        // const pupukData = {
        //   tahun: parseInt(values.tahun),
        //   semester: {
        //     'Semester 1': {
        //       npk: { waktu: values.s1_npk_waktu, jumlah: parseKgInput(values.s1_npk_jumlah) },
        //       nitrogen: { waktu: values.s1_nitrogen_waktu, jumlah: parseKgInput(values.s1_nitrogen_jumlah) },
        //       pospat: { waktu: values.s1_pospat_waktu, jumlah: parseKgInput(values.s1_pospat_jumlah) },
        //       kalium: { waktu: values.s1_kalium_waktu, jumlah: parseKgInput(values.s1_kalium_jumlah) },
        //       boron: { waktu: values.s1_boron_waktu, jumlah: parseKgInput(values.s1_boron_jumlah) },
        //       magnesium: { waktu: values.s1_magnesium_waktu, jumlah: parseKgInput(values.s1_magnesium_jumlah) },
        //     },
        //     'Semester 2': {
        //       npk: { waktu: values.s2_npk_waktu, jumlah: parseKgInput(values.s2_npk_jumlah) },
        //       nitrogen: { waktu: values.s2_nitrogen_waktu, jumlah: parseKgInput(values.s2_nitrogen_jumlah) },
        //       pospat: { waktu: values.s2_pospat_waktu, jumlah: parseKgInput(values.s2_pospat_jumlah) },
        //       kalium: { waktu: values.s2_kalium_waktu, jumlah: parseKgInput(values.s2_kalium_jumlah) },
        //       boron: { waktu: values.s2_boron_waktu, jumlah: parseKgInput(values.s2_boron_jumlah) },
        //       magnesium: { waktu: values.s2_magnesium_waktu, jumlah: parseKgInput(values.s2_magnesium_jumlah) },
        //     },
        //   },
        // };
        // await PupukService.addTahunPupuk(params.id, pupukData);

        console.log('Form submitted with values:', values);
        router.push(`/traceability/gap/pupuk/${params.id}`);
      } catch (error) {
        console.error('Error adding tahun pupuk:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCancel = () => {
    router.push(`/traceability/gap/pupuk/${params.id}`);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <BreadcrumbDetail items={crumbs} />

      <section className="rounded border border-gray-300 bg-white p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 md:text-xl">
            LIMBAH BAHAN BERBAHAYA BERACUN
          </h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Tahun Input */}
          <div className="w-full max-w-xs">
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
            <div className="mb-4 text-sm font-semibold">Semester 1</div>
            <div className="space-y-4">
              {/* Row 1: NPK and Natrium */}
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                </div>
                <div>
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
              </div>

              {/* Row 2: Postat and Kalium */}
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                </div>
                <div>
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
              </div>

              {/* Row 3: Boron and Magnesium */}
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                </div>
                <div>
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
          </div>

          {/* Semester 2 */}
          <div>
            <div className="mb-4 text-sm font-semibold">Semester 2</div>
            <div className="space-y-4">
              {/* Row 1: NPK and Natrium */}
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                </div>
                <div>
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
              </div>

              {/* Row 2: Postat and Kalium */}
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                </div>
                <div>
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
              </div>

              {/* Row 3: Boron and Magnesium */}
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                </div>
                <div>
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

TambahTahunPupukPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default TambahTahunPupukPage;
