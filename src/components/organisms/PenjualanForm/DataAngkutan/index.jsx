'use client';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import DatePicker from '@/components/molecules/DatePicker';
import InputText from '@/components/molecules/InputText';
import { formatDecimalInput,parseDecimalInput } from '@/utils/decimalFormat';

const DataAngkutan = ({ angkutanData, onNext, onCancel, isSubmitting }) => {
  const validationSchema = Yup.object().shape({
    tanggal_penjualan: Yup.string().required('Tanggal Penjualan harus diisi'),
    driver: Yup.string().required('Driver harus diisi'),
    no_registrasi: Yup.string().required('No. Registrasi harus diisi'),
    no_polisi: Yup.string().required('No. Polisi harus diisi'),
    jumlah_tandan: Yup.string()
      .required('Jumlah Tandan harus diisi')
      .test('is-number', 'Jumlah Tandan harus berupa angka', (value) => {
        if (!value) return false;
        const parsed = parseDecimalInput(value);
        const num = parseFloat(parsed);
        return !isNaN(num) && num >= 0;
      }),
    berat_timbangan: Yup.string()
      .required('Berat Timbangan harus diisi')
      .test('is-number', 'Berat Timbangan harus berupa angka', (value) => {
        if (!value) return false;
        const parsed = parseDecimalInput(value);
        const num = parseFloat(parsed);
        return !isNaN(num) && num >= 0;
      }),
    tarra: Yup.string()
      .required('Tarra harus diisi')
      .test('is-number', 'Tarra harus berupa angka', (value) => {
        if (!value) return false;
        const parsed = parseDecimalInput(value);
        const num = parseFloat(parsed);
        return !isNaN(num) && num >= 0;
      }),
    t_potongan_persen: Yup.string()
      .required('T. Potongan (%) harus diisi')
      .test('is-number', 'T. Potongan (%) harus berupa angka', (value) => {
        if (!value) return false;
        const parsed = parseDecimalInput(value);
        const num = parseFloat(parsed);
        return !isNaN(num) && num >= 0 && num <= 100;
      }),
    t_potongan_kg: Yup.string()
      .required('T. Potongan (Kg) harus diisi')
      .test('is-number', 'T. Potongan (Kg) harus berupa angka', (value) => {
        if (!value) return false;
        const parsed = parseDecimalInput(value);
        const num = parseFloat(parsed);
        return !isNaN(num) && num >= 0;
      }),
    berat_bersih: Yup.string()
      .required('Berat Bersih harus diisi')
      .test('is-number', 'Berat Bersih harus berupa angka', (value) => {
        if (!value) return false;
        const parsed = parseDecimalInput(value);
        const num = parseFloat(parsed);
        return !isNaN(num) && num >= 0;
      }),
    harga_per_kilo: Yup.string()
      .required('Harga Per Kilo harus diisi')
      .test('is-number', 'Harga Per Kilo harus berupa angka', (value) => {
        if (!value) return false;
        const parsed = parseDecimalInput(value);
        const num = parseFloat(parsed);
        return !isNaN(num) && num >= 0;
      }),
    total_penjualan: Yup.string()
      .required('Total Penjualan harus diisi')
      .test('is-number', 'Total Penjualan harus berupa angka', (value) => {
        if (!value) return false;
        const parsed = parseDecimalInput(value);
        const num = parseFloat(parsed);
        return !isNaN(num) && num >= 0;
      }),
  });

  const formik = useFormik({
    initialValues: {
      tanggal_penjualan: angkutanData?.tanggal_penjualan
        ? moment(angkutanData.tanggal_penjualan, 'YYYY-MM-DD').format(
            'DD-MM-YYYY'
          )
        : '',
      driver: angkutanData?.driver || '',
      no_registrasi: angkutanData?.no_registrasi || '',
      no_polisi: angkutanData?.no_polisi || '',
      jumlah_tandan: angkutanData?.jumlah_tandan
        ? formatDecimalInput(angkutanData.jumlah_tandan.toString())
        : '',
      berat_timbangan: angkutanData?.berat_timbangan
        ? formatDecimalInput(angkutanData.berat_timbangan.toString())
        : '',
      tarra: angkutanData?.tarra
        ? formatDecimalInput(angkutanData.tarra.toString())
        : '',
      t_potongan_persen: angkutanData?.t_potongan_persen
        ? formatDecimalInput(angkutanData.t_potongan_persen.toString())
        : '',
      t_potongan_kg: angkutanData?.t_potongan_kg
        ? formatDecimalInput(angkutanData.t_potongan_kg.toString())
        : '',
      berat_bersih: angkutanData?.berat_bersih
        ? formatDecimalInput(angkutanData.berat_bersih.toString())
        : '',
      harga_per_kilo: angkutanData?.harga_per_kilo
        ? formatDecimalInput(angkutanData.harga_per_kilo.toString())
        : '',
      total_penjualan: angkutanData?.total_penjualan
        ? formatDecimalInput(angkutanData.total_penjualan.toString())
        : '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // Convert date back to YYYY-MM-DD format for API
      // Parse decimal values back to standard format for API
      const formattedValues = {
        ...values,
        tanggal_penjualan: values.tanggal_penjualan
          ? moment(values.tanggal_penjualan, 'DD-MM-YYYY').format('YYYY-MM-DD')
          : '',
        jumlah_tandan: values.jumlah_tandan
          ? parseDecimalInput(values.jumlah_tandan)
          : '',
        berat_timbangan: values.berat_timbangan
          ? parseDecimalInput(values.berat_timbangan)
          : '',
        tarra: values.tarra ? parseDecimalInput(values.tarra) : '',
        t_potongan_persen: values.t_potongan_persen
          ? parseDecimalInput(values.t_potongan_persen)
          : '',
        t_potongan_kg: values.t_potongan_kg
          ? parseDecimalInput(values.t_potongan_kg)
          : '',
        berat_bersih: values.berat_bersih
          ? parseDecimalInput(values.berat_bersih)
          : '',
        harga_per_kilo: values.harga_per_kilo
          ? parseDecimalInput(values.harga_per_kilo)
          : '',
        total_penjualan: values.total_penjualan
          ? parseDecimalInput(values.total_penjualan)
          : '',
      };
      await onNext(formattedValues);
    },
  });

  // Update form values when angkutanData changes
  useEffect(() => {
    if (angkutanData) {
      formik.setValues({
        tanggal_penjualan: angkutanData.tanggal_penjualan
          ? moment(angkutanData.tanggal_penjualan, 'YYYY-MM-DD').format(
              'DD-MM-YYYY'
            )
          : '',
        driver: angkutanData.driver || '',
        no_registrasi: angkutanData.no_registrasi || '',
        no_polisi: angkutanData.no_polisi || '',
        jumlah_tandan: angkutanData.jumlah_tandan
          ? formatDecimalInput(angkutanData.jumlah_tandan.toString())
          : '',
        berat_timbangan: angkutanData.berat_timbangan
          ? formatDecimalInput(angkutanData.berat_timbangan.toString())
          : '',
        tarra: angkutanData.tarra
          ? formatDecimalInput(angkutanData.tarra.toString())
          : '',
        t_potongan_persen: angkutanData.t_potongan_persen
          ? formatDecimalInput(angkutanData.t_potongan_persen.toString())
          : '',
        t_potongan_kg: angkutanData.t_potongan_kg
          ? formatDecimalInput(angkutanData.t_potongan_kg.toString())
          : '',
        berat_bersih: angkutanData.berat_bersih
          ? formatDecimalInput(angkutanData.berat_bersih.toString())
          : '',
        harga_per_kilo: angkutanData.harga_per_kilo
          ? formatDecimalInput(angkutanData.harga_per_kilo.toString())
          : '',
        total_penjualan: angkutanData.total_penjualan
          ? formatDecimalInput(angkutanData.total_penjualan.toString())
          : '',
      });
    }
  }, [angkutanData]);

  // Auto-calculate berat_bersih when berat_timbangan, tarra, or t_potongan_kg changes
  useEffect(() => {
    const beratTimbangan =
      parseFloat(parseDecimalInput(formik.values.berat_timbangan)) || 0;
    const tarra = parseFloat(parseDecimalInput(formik.values.tarra)) || 0;
    const tPotonganKg =
      parseFloat(parseDecimalInput(formik.values.t_potongan_kg)) || 0;
    const beratBersih = beratTimbangan - tarra - tPotonganKg;

    if (beratTimbangan > 0 && !formik.errors.berat_timbangan) {
      formik.setFieldValue(
        'berat_bersih',
        formatDecimalInput(beratBersih >= 0 ? beratBersih.toString() : '0')
      );
    }
  }, [
    formik.values.berat_timbangan,
    formik.values.tarra,
    formik.values.t_potongan_kg,
  ]);

  // Auto-calculate t_potongan_kg when berat_timbangan and t_potongan_persen change
  useEffect(() => {
    const beratTimbangan =
      parseFloat(parseDecimalInput(formik.values.berat_timbangan)) || 0;
    const tPotonganPersen =
      parseFloat(parseDecimalInput(formik.values.t_potongan_persen)) || 0;
    const tPotonganKg = (beratTimbangan * tPotonganPersen) / 100;

    if (
      beratTimbangan > 0 &&
      tPotonganPersen > 0 &&
      !formik.errors.berat_timbangan &&
      !formik.errors.t_potongan_persen
    ) {
      formik.setFieldValue(
        't_potongan_kg',
        formatDecimalInput(tPotonganKg.toFixed(2))
      );
    }
  }, [formik.values.berat_timbangan, formik.values.t_potongan_persen]);

  // Auto-calculate total_penjualan when berat_bersih and harga_per_kilo change
  useEffect(() => {
    const beratBersih =
      parseFloat(parseDecimalInput(formik.values.berat_bersih)) || 0;
    const hargaPerKilo =
      parseFloat(parseDecimalInput(formik.values.harga_per_kilo)) || 0;
    const totalPenjualan = beratBersih * hargaPerKilo;

    if (
      beratBersih > 0 &&
      hargaPerKilo > 0 &&
      !formik.errors.berat_bersih &&
      !formik.errors.harga_per_kilo
    ) {
      formik.setFieldValue(
        'total_penjualan',
        formatDecimalInput(Math.round(totalPenjualan).toString())
      );
    }
  }, [formik.values.berat_bersih, formik.values.harga_per_kilo]);

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const formattedDate = moment(dateValue, 'YYYY-MM-DD').format(
        'DD-MM-YYYY'
      );
      formik.setFieldValue('tanggal_penjualan', formattedDate);
    } else {
      formik.setFieldValue('tanggal_penjualan', '');
    }
  };

  // Handle decimal input changes - store formatted value
  const handleDecimalChange = (fieldName) => (e) => {
    formik.setFieldValue(fieldName, e.target.value);
  };

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      const formattedValues = {
        ...formik.values,
        tanggal_penjualan: formik.values.tanggal_penjualan
          ? moment(formik.values.tanggal_penjualan, 'DD-MM-YYYY').format(
              'YYYY-MM-DD'
            )
          : '',
        jumlah_tandan: formik.values.jumlah_tandan
          ? parseDecimalInput(formik.values.jumlah_tandan)
          : '',
        berat_timbangan: formik.values.berat_timbangan
          ? parseDecimalInput(formik.values.berat_timbangan)
          : '',
        tarra: formik.values.tarra
          ? parseDecimalInput(formik.values.tarra)
          : '',
        t_potongan_persen: formik.values.t_potongan_persen
          ? parseDecimalInput(formik.values.t_potongan_persen)
          : '',
        t_potongan_kg: formik.values.t_potongan_kg
          ? parseDecimalInput(formik.values.t_potongan_kg)
          : '',
        berat_bersih: formik.values.berat_bersih
          ? parseDecimalInput(formik.values.berat_bersih)
          : '',
        harga_per_kilo: formik.values.harga_per_kilo
          ? parseDecimalInput(formik.values.harga_per_kilo)
          : '',
        total_penjualan: formik.values.total_penjualan
          ? parseDecimalInput(formik.values.total_penjualan)
          : '',
      };
      await onNext(formattedValues);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">DETAIL ANGKUTAN</h3>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 border-b border-dashed border-gray-300 py-4">
          <DatePicker
            label="Tanggal Penjualan"
            name="tanggal_penjualan"
            placeholder="Pilih Tanggal Penjualan"
            value={formik.values.tanggal_penjualan}
            onChange={handleDateChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            requiredField
          />
          <InputText
            label="Driver"
            name="driver"
            placeholder="Masukan Driver"
            value={formik.values.driver}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="No. Registrasi"
            name="no_registrasi"
            placeholder="Masukan No. Registrasi"
            value={formik.values.no_registrasi}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 border-b border-dashed border-gray-300 py-4">
          <InputText
            label="No. Polisi"
            name="no_polisi"
            placeholder="Masukan No. Polisi"
            value={formik.values.no_polisi}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="Jumlah Tandan"
            name="jumlah_tandan"
            placeholder="Masukan Jumlah Tandan"
            type="decimal"
            value={formik.values.jumlah_tandan}
            onChange={handleDecimalChange('jumlah_tandan')}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="Berat Timbangan (Kg)"
            name="berat_timbangan"
            placeholder="Masukan Berat Timbangan"
            type="decimal"
            value={formik.values.berat_timbangan}
            onChange={handleDecimalChange('berat_timbangan')}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 border-b border-dashed border-gray-300 py-4">
          <InputText
            label="Tarra"
            name="tarra"
            placeholder="Masukan Tarra"
            type="decimal"
            value={formik.values.tarra}
            onChange={handleDecimalChange('tarra')}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="T. Potongan (%)"
            name="t_potongan_persen"
            placeholder="Masukan T. Potongan (%)"
            type="decimal"
            value={formik.values.t_potongan_persen}
            onChange={handleDecimalChange('t_potongan_persen')}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="T. Potongan (Kg)"
            name="t_potongan_kg"
            placeholder="Masukan T. Potongan (Kg)"
            type="decimal"
            value={formik.values.t_potongan_kg}
            onChange={handleDecimalChange('t_potongan_kg')}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4">
          <InputText
            label="Berat Bersih"
            name="berat_bersih"
            placeholder="Masukan Berat Bersih"
            type="decimal"
            value={formik.values.berat_bersih}
            onChange={handleDecimalChange('berat_bersih')}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="Harga Per Kilo (Rp)"
            name="harga_per_kilo"
            placeholder="Masukan Harga Per Kilo"
            type="decimal"
            value={formik.values.harga_per_kilo}
            onChange={handleDecimalChange('harga_per_kilo')}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
          <InputText
            label="Total Penjualan (Rp)"
            name="total_penjualan"
            placeholder="Masukan Total Penjualan"
            type="decimal"
            value={formik.values.total_penjualan}
            onChange={handleDecimalChange('total_penjualan')}
            onBlur={formik.handleBlur}
            errors={formik.errors}
            touched={formik.touched}
            isRequired
          />
        </div>

        <div className="mt-4 flex justify-between gap-2">
          <Button
            type="button"
            variant="danger"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Batalkan
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataAngkutan;
