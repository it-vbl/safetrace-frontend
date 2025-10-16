'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import MemberSelector from '@/components/molecules/MemberSelector';
import RadioButton from '@/components/molecules/RadioButton';
import Select from '@/components/molecules/Select';
import { createBroadcast } from '@/services/broadcast';
import { getDeviceList } from '@/services/device';
import { getKontakList } from '@/services/kontak';

import Label from '../../../../components/atoms/Label';
import WhatsAppService from '../../../../services/whatsapp';
import { formatPhoneNumber } from '../../../../utils/whatsapp';

const PesanBaruPage = () => {
  const router = useRouter();

  const [noPengirim, setNoPengirim] = useState('');
  const [activeTile, setActiveTile] = useState('personal');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [deviceData, setDeviceData] = useState([]);

  const handleMembersChange = (newMembers) => {
    setSelectedMembers(newMembers);
  };

  const breadcrumbItems = [
    { label: 'BLAST PESAN', href: '/kabar-tani/blast-pesan' },
    { label: 'PESAN BARU' },
  ];

  const handleCancel = () => {
    router.back();
  };

  const sendWhatsAppMessage = async (deviceId, phoneNumber, message) => {
    try {
      const number = formatPhoneNumber(phoneNumber);
      const response = await WhatsAppService.sendPrivateMessage({
        deviceId,
        number,
        message,
      });
      return response;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  };

  const sendBulkWhatsAppMessage = async (deviceId, recipients, message) => {
    try {
      const results = [];
      for (const member of recipients) {
        const phone =
          member?.phone || member?.no_wa || member?.no_hp || member?.telepon;
        const name = member?.name || member?.nama || '';
        if (!phone) continue;
        const res = await sendWhatsAppMessage(deviceId, phone, message);
        results.push({ name, phone, status: res?.data?.status || 'sent', res });
      }
      return { data: { results } };
    } catch (error) {
      console.error('Error sending bulk WhatsApp message:', error);
      throw error;
    }
  };

  const schemaValidation = Yup.object().shape({
    no_pengirim: Yup.string().required('No pengirim harus diisi'),
    nama_pesan: Yup.string().required('Nama pesan harus diisi'),
    isi_pesan: Yup.string().required('Isi pesan harus diisi'),
  });

  const {
    handleSubmit,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    isSubmitting,
    setFieldValue,
  } = useFormik({
    initialValues: {
      no_pengirim: '',
      nama_pesan: '',
      isi_pesan: 'Lorem Ipsum Dolor Sit Amet', // Default message
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        if (!values.no_pengirim) {
          toast.error('Pilih device pengirim terlebih dahulu');
          setSubmitting(false);
          return;
        }

        if (selectedMembers.length === 0) {
          toast.error('Pilih penerima pesan terlebih dahulu');
          setSubmitting(false);
          return;
        }

        const selectedDevice = deviceData.find(
          (d) => d.id_device === values.no_pengirim
        );

        const jenisPenerima =
          activeTile === 'group'
            ? 'grup'
            : activeTile === 'csv'
            ? 'csv'
            : 'personal';

        const payload = {
          nama_pesan: values.nama_pesan,
          isi_pesan: values.isi_pesan,
          jenis_penerima: jenisPenerima,
          kontak_ids: selectedMembers.map((m) => m.id),
          id_device: values.no_pengirim,
          no_pengirim: selectedDevice?.no_wa,
        };

        const response = await createBroadcast(payload);
        if (
          response?.status === 200 ||
          response?.status === 201 ||
          response?.data?.status === 'success'
        ) {
          toast.success(
            'Berhasil membuat campaign dan menjadwalkan pengiriman'
          );
          router.push('/kabar-tani/blast-pesan');
        } else {
          toast.error(response?.data?.message || 'Gagal membuat campaign');
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Terjadi kesalahan sistem'
        );
        console.error('System error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const testDeviceConnection = async (deviceId) => {
    try {
      const response = await WhatsAppService.getWhacenterDeviceStatus(deviceId);
      const data = response?.data || response;
      const isOnline =
        typeof data?.status === 'string'
          ? ['online', 'connected', 'true'].includes(data.status.toLowerCase())
          : data?.status ?? data?.connected ?? false;
      toast[isOnline ? 'success' : 'info'](
        isOnline
          ? 'Device Whacenter online'
          : 'Device Whacenter belum terhubung'
      );
      return data;
    } catch (error) {
      console.error('Device connection error:', error);
      toast.error('Gagal cek status device');
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchDevices = async () => {
      try {
        const params = new URLSearchParams({ page: '1', page_size: '100' });
        const res = await getDeviceList(params);
        const data = res?.data?.data || res?.data || {};
        const results = data?.results || [];
        const mappedDevices = results.map((item) => ({
          id: item.id,
          id_device: item.id_device,
          nama: item.nama,
          no_wa: item.no_wa,
          terhubung: !!item.terhubung,
        }));
        const options = mappedDevices.map((d) => ({
          value: d.id_device,
          label: `${d.nama ?? '-'} - ${d.no_wa ?? '-'}`,
        }));
        if (mounted) {
          setDeviceData(mappedDevices);
          setDeviceOptions(options);
          if (options.length > 0) {
            setNoPengirim(options[0].value);
            setFieldValue('no_pengirim', options[0].value);
          }
        }
      } catch (err) {
        if (mounted) {
          setDeviceData([]);
          setDeviceOptions([]);
        }
      }
    };
    fetchDevices();
    return () => {
      mounted = false;
    };
  }, [setFieldValue]);

  useEffect(() => {
    let mounted = true;
    const fetchContacts = async () => {
      try {
        const response = await getKontakList({});
        const data = response?.data?.data;
        const list = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(response?.data?.results)
          ? response?.data?.results
          : Array.isArray(response?.data)
          ? response?.data
          : [];
        if (mounted) setAvailableMembers(list);
      } catch (err) {
        if (mounted) setAvailableMembers([]);
      }
    };
    fetchContacts();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative w-full bg-gray-50">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-6 p-2">
        {/* Breadcrumb */}
        <BreadcrumbDetail items={breadcrumbItems} />

        {/* Main Content Card */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden rounded-[4px] border border-gray-200 bg-white">
            {/* Header */}
            <Heading
              level={3}
              className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
            >
              DETAIL
            </Heading>

            <div className="mb-6 space-y-4 px-6">
              {/* Device Selector */}
              <div className="flex gap-6">
                <div className="flex w-full flex-col gap-1">
                  <Label className="text-[12px] font-bold text-gray-500">
                    Device Pengirim
                  </Label>
                  <Select
                    options={deviceOptions}
                    value={noPengirim}
                    onChange={(e) => {
                      setNoPengirim(e.target.value);
                      setFieldValue('no_pengirim', e.target.value);
                      testDeviceConnection(e.target.value);
                    }}
                    placeholder="Pilih Device"
                    className="w-full sm:w-48"
                  />
                  <span className="text-xs text-gray-400">
                    Pilih device WhatsApp yang akan digunakan untuk mengirim
                    pesan
                  </span>
                </div>

                <InputText
                  label={'Nama Campaign'}
                  name="nama_pesan"
                  placeholder="Masukan nama campaign"
                  value={values.nama_pesan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <RadioButton
                label="Penerima"
                direction="row"
                containerClassName="flex flex-row gap-2"
                value={activeTile}
                onChangeValue={(e) => setActiveTile(e)}
                options={[
                  { label: 'Kontak Individu', value: 'personal' },
                  { label: 'Kontak Grup', value: 'group' },
                  { label: 'Upload CSV', value: 'csv' },
                ]}
              />

              {/* Member Selector Component */}
              <MemberSelector
                selectedMembers={selectedMembers}
                availableMembers={availableMembers}
                onMembersChange={handleMembersChange}
                label="Penerima Pesan"
              />

              {selectedMembers.length > 0 && (
                <div className="text-sm text-blue-600">
                  Total penerima: {selectedMembers.length} kontak
                </div>
              )}
            </div>
          </div>

          {/* Message Section */}
          <div className="mt-6 overflow-hidden rounded-[4px] border border-gray-200 bg-white">
            <Heading
              level={3}
              className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
            >
              PESAN
            </Heading>

            <div className="mb-6 px-6">
              <div className="flex gap-6">
                {/* Message Input */}
                <div className="flex w-1/2 flex-col gap-1">
                  <Label className="text-[12px] font-bold text-gray-500">
                    Isi Pesan
                  </Label>
                  <textarea
                    name="isi_pesan"
                    placeholder="Tulis pesan Anda di sini..."
                    value={values.isi_pesan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={14}
                    className={`w-full rounded-[4px] border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.isi_pesan && touched.isi_pesan
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.isi_pesan && touched.isi_pesan && (
                    <span className="text-xs text-red-500">
                      {errors.isi_pesan}
                    </span>
                  )}
                </div>

                {/* Preview */}
                <div className="flex w-1/2 flex-col gap-1">
                  <Label className="text-[12px] font-bold text-gray-500">
                    Preview
                  </Label>
                  <div className="min-h-[298px] rounded-[4px] border border-gray-300 bg-yellow-50 p-4">
                    <div className="text-sm text-gray-700">
                      {values.isi_pesan ||
                        'Preview pesan akan muncul di sini...'}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs text-gray-500">
                        {values.isi_pesan
                          ? `${values.isi_pesan.length}/160`
                          : '0/160'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="my-6 flex justify-end gap-3">
            <Button
              type="button"
              onClick={handleCancel}
              variant="danger"
              disabled={isSubmitting}
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedMembers.length === 0}
              className={isSubmitting ? 'opacity-75' : ''}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Mengirim...
                </div>
              ) : (
                `Kirim Pesan (${selectedMembers.length})`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PesanBaruPage;
