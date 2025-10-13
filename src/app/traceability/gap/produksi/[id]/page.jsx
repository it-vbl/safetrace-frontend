'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';

const formatNumber = (num) =>
  typeof num === 'number'
    ? num.toLocaleString('id-ID')
    : (Number(num) || 0).toLocaleString('id-ID');

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

const mockProduksiDetail = {
  kebun: {
    id_kebun: 'GR-001-002-002',
    petani: 'Akeng Rupinus',
    kelompok_tani: 'Bepekaek Besamo',
    luas_kebun_ha: 0.78,
    tahun_tanam: 2002,
    total_produksi_kg: 13000,
    prod_per_ha_th_ton: 10,
  },
  produksi_tahunan: [
    {
      tahun: 2025,
      bulan: {
        Januari: 1000,
        Februari: 1000,
        Maret: 1000,
        April: 1000,
        Mei: 1000,
        Juni: 1000,
        Juli: 1000,
        Agustus: 1000,
        September: 1000,
        Oktober: 0,
        November: 0,
        Desember: 0,
      },
    },
    {
      tahun: 2024,
      bulan: {
        Januari: 1000,
        Februari: 1000,
        Maret: 1000,
        April: 1000,
        Mei: 1000,
        Juni: 1000,
        Juli: 1000,
        Agustus: 1000,
        September: 1000,
        Oktober: 1000,
        November: 1000,
        Desember: 1000,
      },
    },
  ],
};

const TraceabilityProduksiDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [detail, setDetail] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editYearData, setEditYearData] = useState(null);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PRODUKSI', href: '/traceability/gap/produksi' },
    { label: 'DETAIL PRODUKSI' },
  ];

  useEffect(() => {
    setDetail(mockProduksiDetail);
  }, [id]);

  const umurTanamanText = useMemo(() => {
    if (!detail?.kebun?.tahun_tanam) return '-';
    const currentYear = new Date().getFullYear();
    return `${currentYear - detail.kebun.tahun_tanam} Tahun`;
  }, [detail]);

  const renderYearCard = (yearData) => {
    const monthEntries = MONTHS.map((m) => ({
      name: m,
      valueKg: yearData?.bulan?.[m] ?? 0,
    }));

    const firstRow = monthEntries.slice(0, 6);
    const secondRow = monthEntries.slice(6);

    return (
      <section
        key={`tahun-${yearData.tahun}`}
        className="rounded border border-gray-300 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">TAHUN {yearData.tahun}</h3>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-sm font-medium text-red-600 underline hover:text-red-700"
              onClick={() =>
                typeof window !== 'undefined' &&
                window.alert(`Hapus data tahun ${yearData.tahun}`)
              }
            >
              Hapus
            </button>
            <button
              type="button"
              className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
              onClick={() => {
                setEditYearData(yearData);
                setIsEditOpen(true);
              }}
            >
              Ubah Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-x-6 gap-y-3 text-sm text-gray-700">
          {firstRow.map((m) => (
            <div key={`${yearData.tahun}-${m.name}`} className="">
              <div className="text-gray-500">{m.name}</div>
              <div className="font-medium">{formatNumber(m.valueKg)} Kg</div>
            </div>
          ))}

          <div className="col-span-6 border-b border-dashed border-gray-300" />

          {secondRow.map((m) => (
            <div key={`${yearData.tahun}-${m.name}`} className="">
              <div className="text-gray-500">{m.name}</div>
              <div className="font-medium">{formatNumber(m.valueKg)} Kg</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <BreadcrumbDetail items={crumbs} />
        <Button
          variant="primary"
          size="medium"
          onClick={() => router.push('/traceability/gap/produksi/tambah')}
          className="whitespace-nowrap"
        >
          Tambah Tahun Produksi
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* DETAIL KEBUN Card */}
        {detail?.kebun && (
          <section className="rounded border border-gray-300 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">DETAIL KEBUN</h3>
            </div>

            <div className="grid grid-cols-6 gap-x-6 gap-y-4 text-sm text-gray-700">
              <BorderBottomColData
                label="Id Kebun"
                value={detail.kebun.id_kebun ?? '-'}
              />
              <BorderBottomColData
                label="Petani"
                value={detail.kebun.petani ?? '-'}
              />
              <BorderBottomColData
                label="Kelompok Tani"
                value={detail.kebun.kelompok_tani ?? '-'}
              />
              <BorderBottomColData
                label="Luas Kebun (Ha)"
                value={detail.kebun.luas_kebun_ha ?? '-'}
              />
              <BorderBottomColData
                label="Tahun Tanam"
                value={detail.kebun.tahun_tanam ?? '-'}
              />

              <BorderBottomColData
                label="Umur Tanaman"
                value={umurTanamanText}
              />
              <BorderBottomColData
                label="Total Produksi"
                value={`${formatNumber(detail.kebun.total_produksi_kg)} Kg`}
              />
              <BorderBottomColData
                label="Prod/Ha/Th"
                value={`${formatNumber(detail.kebun.prod_per_ha_th_ton)} Ton`}
              />
            </div>
          </section>
        )}

        {/* Yearly Production Cards */}
        {detail?.produksi_tahunan?.map((y) => renderYearCard(y))}

        {/* Edit Modal */}
        <EditProduksiModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          yearData={editYearData}
          onSave={(updatedMonths) => {
            setDetail((prev) => {
              if (!prev) return prev;
              const updated = prev.produksi_tahunan.map((y) =>
                y.tahun === editYearData?.tahun
                  ? { ...y, bulan: { ...updatedMonths } }
                  : y
              );
              return { ...prev, produksi_tahunan: updated };
            });
            setIsEditOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default TraceabilityProduksiDetail;

const formatKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};

const parseKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const EditProduksiModal = ({ open, onClose, yearData, onSave }) => {
  const initialValues = useMemo(() => {
    const months = MONTHS.reduce((acc, m) => {
      acc[m] = formatKgInput(yearData?.bulan?.[m] ?? 0);
      return acc;
    }, {});
    return months;
  }, [yearData]);

  const validationSchema = useMemo(() => {
    const shape = MONTHS.reduce((acc, m) => {
      acc[m] = Yup.string()
        .required('Wajib diisi')
        .test('angka-valid', 'Harus angka >= 0', (val) => {
          const n = parseKgInput(val);
          return Number.isFinite(n) && n >= 0;
        });
      return acc;
    }, {});
    return Yup.object().shape(shape);
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const updated = MONTHS.reduce((acc, m) => {
        acc[m] = parseKgInput(values[m]);
        return acc;
      }, {});
      onSave?.(updated);
    },
  });

  const handleCancel = () => onClose?.();

  return (
    <BaseModal
      open={open}
      setOpen={onClose}
      label={`UBAH DATA ${yearData?.tahun ?? ''}`}
      isShowCloseIcon={false}
      className="!max-w-[768px] transition-all duration-200"
    >
      <div className="pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MONTHS.map((m) => (
            <InputText
              key={`input-${m}`}
              label={m}
              name={m}
              placeholder="0"
              value={formik.values[m]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errors={formik.errors}
              touched={formik.touched}
              suffix="Kg"
              type="string"
              formatter={formatKgInput}
              isRequired={true}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="danger" onClick={handleCancel}>
            Batalkan
          </Button>
          <Button
            type="button"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
