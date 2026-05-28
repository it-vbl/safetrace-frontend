import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import Select from '@/components/molecules/Select';
import { MONTH_OPTIONS } from '@/constants/months';

// Convert month name to month number (1-12)
const monthNameToNumber = (monthName) => {
  const monthOption = MONTH_OPTIONS.find(
    (option) =>
      option.label.toLowerCase() === String(monthName || '').toLowerCase()
  );
  return monthOption?.value || 1;
};

// Convert month number to month name
const monthNumberToName = (monthNumber) => {
  const monthOption = MONTH_OPTIONS.find(
    (option) => option.value === Number(monthNumber)
  );
  return monthOption?.label || 'Januari';
};

const formatKgInput = (v) => {
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return num.toLocaleString('id-ID');
};

const parseKgInput = (v) => {
  if (!v) return null;
  const num = Number(String(v ?? '').replace(/\D/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

const EditPupukModal = ({ open, onClose, yearData, onSave }) => {
  const initialValues = useMemo(() => {
    const s1 = yearData?.semester?.['Tahap 1'] ?? {
      npk: { waktu: '', jumlah: 0 },
      nitrogen: { waktu: '', jumlah: 0 },
      pospat: { waktu: '', jumlah: 0 },
      kalium: { waktu: '', jumlah: 0 },
      boron: { waktu: '', jumlah: 0 },
      magnesium: { waktu: '', jumlah: 0 },
    };
    const s2 = yearData?.semester?.['Tahap 2'] ?? {
      npk: { waktu: '', jumlah: 0 },
      nitrogen: { waktu: '', jumlah: 0 },
      pospat: { waktu: '', jumlah: 0 },
      kalium: { waktu: '', jumlah: 0 },
      boron: { waktu: '', jumlah: 0 },
      magnesium: { waktu: '', jumlah: 0 },
    };
    const s3 = yearData?.semester?.['Tahap 3'] ?? {
      npk: { waktu: '', jumlah: 0 },
      nitrogen: { waktu: '', jumlah: 0 },
      pospat: { waktu: '', jumlah: 0 },
      kalium: { waktu: '', jumlah: 0 },
      boron: { waktu: '', jumlah: 0 },
      magnesium: { waktu: '', jumlah: 0 },
    };

    return {
      // Convert month names to numbers for Select component
      s1_npk_waktu: monthNameToNumber(s1.npk.waktu),
      s1_npk_jumlah: formatKgInput(s1.npk.jumlah || 0),
      s1_nitrogen_waktu: monthNameToNumber(s1.nitrogen.waktu),
      s1_nitrogen_jumlah: formatKgInput(s1.nitrogen.jumlah || 0),
      s1_pospat_waktu: monthNameToNumber(s1.pospat.waktu),
      s1_pospat_jumlah: formatKgInput(s1.pospat.jumlah || 0),
      s1_kalium_waktu: monthNameToNumber(s1.kalium.waktu),
      s1_kalium_jumlah: formatKgInput(s1.kalium.jumlah || 0),
      s1_boron_waktu: monthNameToNumber(s1.boron.waktu),
      s1_boron_jumlah: formatKgInput(s1.boron.jumlah || 0),
      s1_magnesium_waktu: monthNameToNumber(s1.magnesium.waktu),
      s1_magnesium_jumlah: formatKgInput(s1.magnesium.jumlah || 0),
      s2_npk_waktu: monthNameToNumber(s2.npk.waktu),
      s2_npk_jumlah: formatKgInput(s2.npk.jumlah || 0),
      s2_nitrogen_waktu: monthNameToNumber(s2.nitrogen.waktu),
      s2_nitrogen_jumlah: formatKgInput(s2.nitrogen.jumlah || 0),
      s2_pospat_waktu: monthNameToNumber(s2.pospat.waktu),
      s2_pospat_jumlah: formatKgInput(s2.pospat.jumlah || 0),
      s2_kalium_waktu: monthNameToNumber(s2.kalium.waktu),
      s2_kalium_jumlah: formatKgInput(s2.kalium.jumlah || 0),
      s2_boron_waktu: monthNameToNumber(s2.boron.waktu),
      s2_boron_jumlah: formatKgInput(s2.boron.jumlah || 0),
      s2_magnesium_waktu: monthNameToNumber(s2.magnesium.waktu),
      s2_magnesium_jumlah: formatKgInput(s2.magnesium.jumlah || 0),
      s3_npk_waktu: monthNameToNumber(s3.npk.waktu),
      s3_npk_jumlah: formatKgInput(s3.npk.jumlah || 0),
      s3_nitrogen_waktu: monthNameToNumber(s3.nitrogen.waktu),
      s3_nitrogen_jumlah: formatKgInput(s3.nitrogen.jumlah || 0),
      s3_pospat_waktu: monthNameToNumber(s3.pospat.waktu),
      s3_pospat_jumlah: formatKgInput(s3.pospat.jumlah || 0),
      s3_kalium_waktu: monthNameToNumber(s3.kalium.waktu),
      s3_kalium_jumlah: formatKgInput(s3.kalium.jumlah || 0),
      s3_boron_waktu: monthNameToNumber(s3.boron.waktu),
      s3_boron_jumlah: formatKgInput(s3.boron.jumlah || 0),
      s3_magnesium_waktu: monthNameToNumber(s3.magnesium.waktu),
      s3_magnesium_jumlah: formatKgInput(s3.magnesium.jumlah || 0),
    };
  }, [yearData]);

  const validationSchema = Yup.object().shape({
    s1_npk_waktu: Yup.string().nullable(),
    s1_npk_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_nitrogen_waktu: Yup.string().nullable(),
    s1_nitrogen_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_pospat_waktu: Yup.string().nullable(),
    s1_pospat_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_kalium_waktu: Yup.string().nullable(),
    s1_kalium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_boron_waktu: Yup.string().nullable(),
    s1_boron_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s1_magnesium_waktu: Yup.string().nullable(),
    s1_magnesium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_npk_waktu: Yup.string().nullable(),
    s2_npk_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_nitrogen_waktu: Yup.string().nullable(),
    s2_nitrogen_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_pospat_waktu: Yup.string().nullable(),
    s2_pospat_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_kalium_waktu: Yup.string().nullable(),
    s2_kalium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_boron_waktu: Yup.string().nullable(),
    s2_boron_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s2_magnesium_waktu: Yup.string().nullable(),
    s2_magnesium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_npk_waktu: Yup.string().nullable(),
    s3_npk_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_nitrogen_waktu: Yup.string().nullable(),
    s3_nitrogen_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_pospat_waktu: Yup.string().nullable(),
    s3_pospat_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_kalium_waktu: Yup.string().nullable(),
    s3_kalium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_boron_waktu: Yup.string().nullable(),
    s3_boron_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); }),
    s3_magnesium_waktu: Yup.string().nullable(),
    s3_magnesium_jumlah: Yup.string().nullable().test('angka-valid', 'Harus angka >= 0', (val) => { if (!val) return true; const n = parseKgInput(val); return n === null || (Number.isFinite(n) && n >= 0); })
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Convert month numbers back to month names for onSave callback
      const updated = {
        'Tahap 1': {
          npk: {
            waktu: monthNumberToName(values.s1_npk_waktu) || '-',
            jumlah: parseKgInput(values.s1_npk_jumlah),
          },
          nitrogen: {
            waktu: monthNumberToName(values.s1_nitrogen_waktu) || '-',
            jumlah: parseKgInput(values.s1_nitrogen_jumlah),
          },
          pospat: {
            waktu: monthNumberToName(values.s1_pospat_waktu) || '-',
            jumlah: parseKgInput(values.s1_pospat_jumlah),
          },
          kalium: {
            waktu: monthNumberToName(values.s1_kalium_waktu) || '-',
            jumlah: parseKgInput(values.s1_kalium_jumlah),
          },
          boron: {
            waktu: monthNumberToName(values.s1_boron_waktu) || '-',
            jumlah: parseKgInput(values.s1_boron_jumlah),
          },
          magnesium: {
            waktu: monthNumberToName(values.s1_magnesium_waktu) || '-',
            jumlah: parseKgInput(values.s1_magnesium_jumlah),
          },
        },
        'Tahap 2': {
          npk: {
            waktu: monthNumberToName(values.s2_npk_waktu) || '-',
            jumlah: parseKgInput(values.s2_npk_jumlah),
          },
        'Tahap 3': {
          npk: {
            waktu: monthNumberToName(values.s3_npk_waktu) || '-',
            jumlah: parseKgInput(values.s3_npk_jumlah),
          },
          nitrogen: {
            waktu: monthNumberToName(values.s3_nitrogen_waktu) || '-',
            jumlah: parseKgInput(values.s3_nitrogen_jumlah),
          },
          pospat: {
            waktu: monthNumberToName(values.s3_pospat_waktu) || '-',
            jumlah: parseKgInput(values.s3_pospat_jumlah),
          },
          kalium: {
            waktu: monthNumberToName(values.s3_kalium_waktu) || '-',
            jumlah: parseKgInput(values.s3_kalium_jumlah),
          },
          boron: {
            waktu: monthNumberToName(values.s3_boron_waktu) || '-',
            jumlah: parseKgInput(values.s3_boron_jumlah),
          },
          magnesium: {
            waktu: monthNumberToName(values.s3_magnesium_waktu) || '-',
            jumlah: parseKgInput(values.s3_magnesium_jumlah),
          },
        },
          nitrogen: {
            waktu: monthNumberToName(values.s2_nitrogen_waktu) || '-',
            jumlah: parseKgInput(values.s2_nitrogen_jumlah),
          },
          pospat: {
            waktu: monthNumberToName(values.s2_pospat_waktu) || '-',
            jumlah: parseKgInput(values.s2_pospat_jumlah),
          },
          kalium: {
            waktu: monthNumberToName(values.s2_kalium_waktu) || '-',
            jumlah: parseKgInput(values.s2_kalium_jumlah),
          },
          boron: {
            waktu: monthNumberToName(values.s2_boron_waktu) || '-',
            jumlah: parseKgInput(values.s2_boron_jumlah),
          },
          magnesium: {
            waktu: monthNumberToName(values.s2_magnesium_waktu) || '-',
            jumlah: parseKgInput(values.s2_magnesium_jumlah),
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Tahap 1 */}
          <div className="flex flex-col gap-2">
            <div className="mb-2 text-sm font-semibold">Tahap 1</div>
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

          {/* Tahap 2 */}
          <div className="flex flex-col gap-2">
            <div className="mb-2 text-sm font-semibold">Tahap 2</div>
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
          {/* Tahap 3 */}
          <div className="flex flex-col gap-2">
            <div className="mb-2 text-sm font-semibold">Tahap 3</div>
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

EditPupukModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  yearData: PropTypes.shape({
    tahun: PropTypes.number.isRequired,
    semester: PropTypes.shape({
      'Tahap 1': PropTypes.shape({
        npk: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        nitrogen: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        pospat: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kalium: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        boron: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        magnesium: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
      'Tahap 2': PropTypes.shape({
        npk: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        nitrogen: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        pospat: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kalium: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        boron: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        magnesium: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
      'Tahap 3': PropTypes.shape({
        npk: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        nitrogen: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        pospat: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kalium: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        boron: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        magnesium: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
    }),
  }),
  onSave: PropTypes.func,
};

export default EditPupukModal;
