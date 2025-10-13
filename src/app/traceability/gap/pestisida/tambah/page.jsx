'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
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
].map((m) => ({ label: m, value: m }));

const parseLiterInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const formatLiterInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};

const validationSchema = Yup.object({
  tahun: Yup.number()
    .typeError('Tahun wajib dipilih')
    .required('Tahun wajib dipilih'),
  s1_sistemik_waktu: Yup.string().required('Wajib diisi'),
  s1_sistemik_jumlah: Yup.string()
    .required('Wajib diisi')
    .test('angka-valid', 'Harus angka >= 0', (val) => {
      const n = parseLiterInput(val);
      return Number.isFinite(n) && n >= 0;
    }),
  s1_kontak_waktu: Yup.string().required('Wajib diisi'),
  s1_kontak_jumlah: Yup.string()
    .required('Wajib diisi')
    .test('angka-valid', 'Harus angka >= 0', (val) => {
      const n = parseLiterInput(val);
      return Number.isFinite(n) && n >= 0;
    }),
  s2_sistemik_waktu: Yup.string().required('Wajib diisi'),
  s2_sistemik_jumlah: Yup.string()
    .required('Wajib diisi')
    .test('angka-valid', 'Harus angka >= 0', (val) => {
      const n = parseLiterInput(val);
      return Number.isFinite(n) && n >= 0;
    }),
  s2_kontak_waktu: Yup.string().required('Wajib diisi'),
  s2_kontak_jumlah: Yup.string()
    .required('Wajib diisi')
    .test('angka-valid', 'Harus angka >= 0', (val) => {
      const n = parseLiterInput(val);
      return Number.isFinite(n) && n >= 0;
    }),
});

export default function TambahPestisidaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PESTISIDA', href: '/traceability/gap/pestisida' },
    { label: 'TAMBAH TAHUN PESTISIDA' },
  ];

  const yearOptions = useYearOptions();

  const formik = useFormik({
    initialValues: {
      tahun: '',
      s1_sistemik_waktu: '',
      s1_sistemik_jumlah: '',
      s1_kontak_waktu: '',
      s1_kontak_jumlah: '',
      s2_sistemik_waktu: '',
      s2_sistemik_jumlah: '',
      s2_kontak_waktu: '',
      s2_kontak_jumlah: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = {
          tahun: values.tahun,
          semester: {
            'Semester 1': {
              sistemik: {
                waktu: values.s1_sistemik_waktu,
                jumlah: parseLiterInput(values.s1_sistemik_jumlah),
              },
              kontak: {
                waktu: values.s1_kontak_waktu,
                jumlah: parseLiterInput(values.s1_kontak_jumlah),
              },
            },
            'Semester 2': {
              sistemik: {
                waktu: values.s2_sistemik_waktu,
                jumlah: parseLiterInput(values.s2_sistemik_jumlah),
              },
              kontak: {
                waktu: values.s2_kontak_waktu,
                jumlah: parseLiterInput(values.s2_kontak_jumlah),
              },
            },
          },
        };

        console.log('Payload:', payload);
        toast.success('Data pestisida berhasil disimpan');
        router.push('/traceability/gap/pestisida');
      } catch (error) {
        toast.error('Gagal menyimpan data pestisida');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCancel = () => {
    router.push('/traceability/gap/pestisida');
  };

  return (
    <div className="flex w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:px-0">
      <BreadcrumbDetail items={crumbs} />

      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="rounded-[4px] border border-gray-300 bg-white">
          <div className="border-b border-gray-200 p-4">
            <Heading level={3} className="text-sm text-gray-600 sm:text-base">
              PENGGUNAAN PESTISIDA
            </Heading>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              <Select
                label="Tahun"
                name="tahun"
                placeholder="Pilih Tahun"
                options={yearOptions}
                value={formik.values.tahun}
                onChange={(e) => formik.setFieldValue('tahun', e.target.value)}
                onBlur={formik.handleBlur}
                errors={formik.errors}
                touched={formik.touched}
                isRequired
                selectClassName="!min-h-[30px] !h-[30px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {/* Semester 1 */}
              <div className="rounded border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-sm font-semibold">Semester 1</div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-2">
                  <Select
                    label="(Sistemik) Waktu Aplikasi"
                    name="s1_sistemik_waktu"
                    placeholder="Pilih bulan"
                    options={MONTH_OPTIONS}
                    value={formik.values.s1_sistemik_waktu}
                    onChange={(e) =>
                      formik.setFieldValue('s1_sistemik_waktu', e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    isRequired
                  />
                  <InputText
                    label="(Sistemik) Jumlah"
                    name="s1_sistemik_jumlah"
                    placeholder="0"
                    value={formik.values.s1_sistemik_jumlah}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    suffix="Liter"
                    type="string"
                    formatter={formatLiterInput}
                    isRequired
                  />
                  <Select
                    label="(Kontak) Waktu Aplikasi"
                    name="s1_kontak_waktu"
                    placeholder="Pilih bulan"
                    options={MONTH_OPTIONS}
                    value={formik.values.s1_kontak_waktu}
                    onChange={(e) =>
                      formik.setFieldValue('s1_kontak_waktu', e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    isRequired
                  />
                  <InputText
                    label="(Kontak) Jumlah"
                    name="s1_kontak_jumlah"
                    placeholder="0"
                    value={formik.values.s1_kontak_jumlah}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    suffix="Liter"
                    type="string"
                    formatter={formatLiterInput}
                    isRequired
                  />
                </div>
              </div>

              {/* Semester 2 */}
              <div className="rounded border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 text-sm font-semibold">Semester 2</div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-2">
                  <Select
                    label="(Sistemik) Waktu Aplikasi"
                    name="s2_sistemik_waktu"
                    placeholder="Pilih bulan"
                    options={MONTH_OPTIONS}
                    value={formik.values.s2_sistemik_waktu}
                    onChange={(e) =>
                      formik.setFieldValue('s2_sistemik_waktu', e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    isRequired
                  />
                  <InputText
                    label="(Sistemik) Jumlah"
                    name="s2_sistemik_jumlah"
                    placeholder="0"
                    value={formik.values.s2_sistemik_jumlah}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    suffix="Liter"
                    type="string"
                    formatter={formatLiterInput}
                    isRequired
                  />
                  <Select
                    label="(Kontak) Waktu Aplikasi"
                    name="s2_kontak_waktu"
                    placeholder="Pilih bulan"
                    options={MONTH_OPTIONS}
                    value={formik.values.s2_kontak_waktu}
                    onChange={(e) =>
                      formik.setFieldValue('s2_kontak_waktu', e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    isRequired
                  />
                  <InputText
                    label="(Kontak) Jumlah"
                    name="s2_kontak_jumlah"
                    placeholder="0"
                    value={formik.values.s2_kontak_jumlah}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    suffix="Liter"
                    type="string"
                    formatter={formatLiterInput}
                    isRequired
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="danger"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Batalkan
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
