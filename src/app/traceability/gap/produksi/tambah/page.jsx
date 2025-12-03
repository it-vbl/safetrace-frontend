'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useYearOptions from '@/hooks/useYearOptions';
import { createProduksi } from '@/services/produksi';

const MONTHS = [
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

const parseKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const formatKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};

const validationSchema = Yup.object({
  tahun: Yup.number()
    .typeError('Tahun wajib dipilih')
    .required('Tahun wajib dipilih'),
  bulan: Yup.object(
    MONTHS.reduce((acc, m) => {
      acc[m] = Yup.string()
        .required('Wajib diisi')
        .test('is-number', 'Harus angka', (val) => {
          const n = parseKgInput(val);
          return !Number.isNaN(n) && n >= 0;
        });
      return acc;
    }, {})
  ),
});

export default function TambahProduksiPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full justify-center py-10 text-sm text-gray-500">
          Memuat data...
        </div>
      }
    >
      <TambahProduksiContent />
    </Suspense>
  );
}

function TambahProduksiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kebunParam = searchParams.get('kebun');
  const [isLoading, setIsLoading] = useState(false);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PRODUKSI', href: '/traceability/gap/produksi' },
    { label: 'TAMBAH TAHUN PRODUKSI' },
  ];

  const yearOptions = useYearOptions();

  const initialMonths = useMemo(
    () =>
      MONTHS.reduce((acc, m) => {
        acc[m] = '';
        return acc;
      }, {}),
    []
  );

  const formik = useFormik({
    initialValues: {
      kebun: kebunParam ? Number(kebunParam) : '',
      tahun: '',
      bulan: initialMonths,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (!values.kebun || Number.isNaN(Number(values.kebun))) {
          toast.error(
            'Id Kebun tidak ditemukan. Coba dari halaman detail kebun.'
          );
          setIsLoading(false);
          return;
        }

        const monthKey = {
          Januari: 'januari',
          Februari: 'februari',
          Maret: 'maret',
          April: 'april',
          Mei: 'mei',
          Juni: 'juni',
          Juli: 'juli',
          Agustus: 'agustus',
          September: 'september',
          Oktober: 'oktober',
          November: 'november',
          Desember: 'desember',
        };

        const flatMonths = Object.fromEntries(
          MONTHS.map((m) => [monthKey[m], parseKgInput(values?.bulan?.[m])])
        );

        const payload = {
          kebun: Number(values.kebun),
          tahun: values.tahun,
          ...flatMonths,
        };
        await createProduksi(payload);
        toast.success('Data produksi berhasil disimpan');
        router.push('/traceability/gap/produksi');
      } catch (error) {
        toast.error('Gagal menyimpan data produksi');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCancel = () => {
    router.push('/traceability/gap/produksi');
  };

  return (
    <div className="flex w-full min-w-[320px] max-w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:px-0">
      <BreadcrumbDetail items={crumbs} />

      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="rounded-[4px] border border-gray-300 bg-white">
          <div className="border-b border-gray-200 p-4">
            <Heading level={3} className="text-sm text-gray-600 sm:text-base">
              HASIL PRODUKSI
            </Heading>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6">
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
                // selectClassName="!min-h-[30px] !h-[30px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-6">
              {MONTHS.map((m) => (
                <InputText
                  key={`bulan-${m}`}
                  label={m}
                  name={`bulan.${m}`}
                  placeholder="0"
                  value={formik.values.bulan[m]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errors={formik.errors}
                  touched={formik.touched}
                  type="string"
                  formatter={formatKgInput}
                  suffix="Kg"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2 sm:flex-row">
          <Button
            type="button"
            variant="danger"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Batalkan
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
