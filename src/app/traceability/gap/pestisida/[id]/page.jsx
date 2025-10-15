'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import YearCard from '@/components/molecules/YearCard';

const formatNumber = (num) =>
  typeof num === 'number'
    ? num.toLocaleString('id-ID')
    : (Number(num) || 0).toLocaleString('id-ID');

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

const formatLiterInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};

const parseLiterInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const EditPestisidaModal = ({ open, onClose, yearData, onSave }) => {
  const initialValues = useMemo(() => {
    const s1 = yearData?.semester?.['Semester 1'] ?? {
      sistemik: { waktu: '', jumlah: 0 },
      kontak: { waktu: '', jumlah: 0 },
    };
    const s2 = yearData?.semester?.['Semester 2'] ?? {
      sistemik: { waktu: '', jumlah: 0 },
      kontak: { waktu: '', jumlah: 0 },
    };

    return {
      s1_sistemik_waktu: s1.sistemik.waktu || '',
      s1_sistemik_jumlah: formatLiterInput(s1.sistemik.jumlah || 0),
      s1_kontak_waktu: s1.kontak.waktu || '',
      s1_kontak_jumlah: formatLiterInput(s1.kontak.jumlah || 0),
      s2_sistemik_waktu: s2.sistemik.waktu || '',
      s2_sistemik_jumlah: formatLiterInput(s2.sistemik.jumlah || 0),
      s2_kontak_waktu: s2.kontak.waktu || '',
      s2_kontak_jumlah: formatLiterInput(s2.kontak.jumlah || 0),
    };
  }, [yearData]);

  const validationSchema = Yup.object().shape({
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const updated = {
        'Semester 1': {
          sistemik: {
            waktu: values.s1_sistemik_waktu || '-',
            jumlah: parseLiterInput(values.s1_sistemik_jumlah),
          },
          kontak: {
            waktu: values.s1_kontak_waktu || '-',
            jumlah: parseLiterInput(values.s1_kontak_jumlah),
          },
        },
        'Semester 2': {
          sistemik: {
            waktu: values.s2_sistemik_waktu || '-',
            jumlah: parseLiterInput(values.s2_sistemik_jumlah),
          },
          kontak: {
            waktu: values.s2_kontak_waktu || '-',
            jumlah: parseLiterInput(values.s2_kontak_jumlah),
          },
        },
      };

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
      <div id="modal" className="pt-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Semester 1 */}
          <div>
            <div className="mb-2 text-sm font-semibold">Semester 1</div>
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
              isRequired={true}
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
              isRequired={true}
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
              isRequired={true}
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
              isRequired={true}
            />
          </div>

          {/* Semester 2 */}
          <div>
            <div className="mb-2 text-sm font-semibold">Semester 2</div>
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
              isRequired={true}
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
              isRequired={true}
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
              isRequired={true}
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
              isRequired={true}
            />
          </div>
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

EditPestisidaModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  yearData: PropTypes.shape({
    tahun: PropTypes.number.isRequired,
    semester: PropTypes.shape({
      'Semester 1': PropTypes.shape({
        sistemik: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kontak: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
      'Semester 2': PropTypes.shape({
        sistemik: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kontak: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
    }),
  }),
  onSave: PropTypes.func,
};

const mockPestisidaDetail = {
  kebun: {
    id_kebun: 'GR-001-002-002',
    petani: 'Akeng Rupinus',
    kelompok_tani: 'Bepekaek Besamo',
    luas_kebun_ha: 0.78,
    tahun_tanam: 2002,
    total_pestisida_liter: 3,
  },
  penggunaan_tahunan: [
    {
      tahun: 2025,
      semester: {
        'Semester 1': {
          sistemik: { waktu: 'Maret', jumlah: 2 },
          kontak: { waktu: '-', jumlah: 0 },
        },
        'Semester 2': {
          sistemik: { waktu: '-', jumlah: 0 },
          kontak: { waktu: '-', jumlah: 0 },
        },
      },
    },
    {
      tahun: 2024,
      semester: {
        'Semester 1': {
          sistemik: { waktu: 'Maret', jumlah: 2 },
          kontak: { waktu: '-', jumlah: 0 },
        },
        'Semester 2': {
          sistemik: { waktu: '-', jumlah: 0 },
          kontak: { waktu: '-', jumlah: 0 },
        },
      },
    },
  ],
};

const TraceabilityPestisidaDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [detail, setDetail] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editYearData, setEditYearData] = useState(null);

  const crumbs = [
    { label: 'HOME', href: '/' },
    { label: 'PESTISIDA', href: '/traceability/gap/pestisida' },
    { label: 'DETAIL PESTISIDA' },
  ];

  useEffect(() => {
    setDetail(mockPestisidaDetail);
  }, [id]);

  const umurTanamanText = useMemo(() => {
    if (!detail?.kebun?.tahun_tanam) return '-';
    const currentYear = new Date().getFullYear();
    return `${currentYear - detail.kebun.tahun_tanam} Tahun`;
  }, [detail]);

  const handleEditYear = (yearData) => {
    setEditYearData(yearData);
    setIsEditOpen(true);
  };

  const handleDeleteYear = (yearData) => {
    if (typeof window !== 'undefined') {
      window.alert(`Hapus data tahun ${yearData.tahun}`);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <BreadcrumbDetail items={crumbs} />
        <Button
          variant="primary"
          size="medium"
          onClick={() => router.push('/traceability/gap/pestisida/tambah')}
          className="whitespace-nowrap"
        >
          Tambah Tahun Pestisida
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
                label="Total Pestisida"
                value={`${formatNumber(
                  detail.kebun.total_pestisida_liter
                )} Liter`}
              />
            </div>
          </section>
        )}

        {/* Year Cards */}
        {detail?.penggunaan_tahunan?.map((yearData) => (
          <YearCard
            key={yearData.tahun}
            yearData={yearData}
            onEdit={handleEditYear}
            onDelete={handleDeleteYear}
            title="Penggunaan Pestisida"
            dataFields={[
              { key: 'sistemik', label: '(Sistemik)', unit: 'Liter' },
              { key: 'kontak', label: '(Kontak)', unit: 'Liter' },
            ]}
          />
        ))}

        {/* Edit Modal */}
        <EditPestisidaModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          yearData={editYearData}
          onSave={(updatedSemesters) => {
            setDetail((prev) => {
              if (!prev) return prev;
              const updated = prev.penggunaan_tahunan.map((y) =>
                y.tahun === editYearData?.tahun
                  ? { ...y, semester: { ...updatedSemesters } }
                  : y
              );
              return { ...prev, penggunaan_tahunan: updated };
            });
            setIsEditOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default TraceabilityPestisidaDetail;
