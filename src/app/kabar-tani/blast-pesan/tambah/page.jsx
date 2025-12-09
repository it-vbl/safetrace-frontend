'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputMessage from '@/components/molecules/InputMessage';
import InputText from '@/components/molecules/InputText';
import MemberSelector from '@/components/molecules/MemberSelector';
import RadioButton from '@/components/molecules/RadioButton';
import Select from '@/components/molecules/Select';
import { createBroadcast } from '@/services/broadcast';
import { getDeviceList } from '@/services/device';
import { getKontakList } from '@/services/kontak';
import WhatsAppService from '@/services/whatsapp';
import { formatPhoneNumber } from '@/utils/whatsapp';

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

  // Removed: group expansion and per-member sending. Whacenter group send is used directly.

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
      isi_pesan: 'Lorem Ipsum Dolor Sit Amet',
      nama_grup: '',
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

        // Validasi penerima sesuai skema
        if (activeTile === 'group') {
          if (!values.nama_grup || !values.nama_grup.trim()) {
            toast.error('Nama grup WhatsApp tidak boleh kosong');
            setSubmitting(false);
            return;
          }
        } else {
          if (selectedMembers.length === 0) {
            toast.error('Pilih penerima pesan terlebih dahulu');
            setSubmitting(false);
            return;
          }
        }

        const selectedDevice = deviceData.find(
          (d) => d.id_device === values.no_pengirim
        );

        const jenisPenerima =
          activeTile === 'group' ? '2' : activeTile === 'csv' ? '3' : '1';

        let recipientIds = selectedMembers
          .map((m) => m.id ?? m.kontak_id ?? m.id_kontak ?? m.value)
          .filter((v) => v !== undefined && v !== null)
          .map((id) =>
            typeof id === 'string' && /^\d+$/.test(id) ? parseInt(id, 10) : id
          );

        if (jenisPenerima === '1' && recipientIds.length === 0) {
          toast.error(
            'Kontak tidak boleh kosong ketika jenis penerima adalah individu.'
          );
          setSubmitting(false);
          return;
        }

        // Skema grup: Kirim pesan ke grup berdasarkan nama (Whacenter) saja
        if (jenisPenerima === '2') {
          // Kirim ke grup via Whacenter
          try {
            const waSend = await WhatsAppService.sendGroupMessage(
              values.no_pengirim,
              values.nama_grup.trim(),
              values.isi_pesan
            );
            const waStatus = waSend?.data?.status ?? waSend?.status;
            const ok =
              waStatus === true ||
              String(waStatus || '').toLowerCase() === 'success';
            toast[ok ? 'success' : 'info'](
              ok
                ? `Pesan WhatsApp terkirim ke grup "${values.nama_grup.trim()}"`
                : `Status pengiriman ke grup belum pasti`
            );
          } catch (waError) {
            console.error('Gagal kirim WhatsApp ke grup:', waError);
            toast.error(
              'Terjadi kesalahan saat mengirim pesan ke grup WhatsApp'
            );
          }
          router.push('/kabar-tani/blast-pesan');
          setSubmitting(false);
          return; // Selesai untuk skema grup (Whacenter only)
        }

        // Skema individu (tetap seperti sebelumnya)
        const payload = {
          nama_pesan: values.nama_pesan,
          pesan: values.isi_pesan,
          jenis_penerima: jenisPenerima,
          device: selectedDevice?.id,
          kontak: recipientIds,
        };

        const response = await createBroadcast(payload);
        if (
          response?.status === 200 ||
          response?.status === 201 ||
          response?.data?.status === 'success'
        ) {
          toast.success(
            'Berhasil membuat campaign. Mengirim pesan WhatsApp ke penerima...'
          );

          try {
            const deviceIdForWhatsApp = values.no_pengirim;
            const waSend = await sendBulkWhatsAppMessage(
              deviceIdForWhatsApp,
              selectedMembers,
              values.isi_pesan
            );
            const waResults = waSend?.data?.results || [];
            const successCount = waResults.filter((r) => {
              const status = String(r?.status || '').toLowerCase();
              return (
                status === 'sent' || status === 'success' || r?.status === true
              );
            }).length;
            const failureCount = waResults.length - successCount;

            if (successCount > 0) {
              toast.success(
                jenisPenerima === '2'
                  ? `Pesan WhatsApp terkirim ke ${successCount} kontak dalam grup${
                      failureCount ? `, gagal ${failureCount}` : ''
                    }`
                  : `Pesan WhatsApp terkirim ke ${successCount} kontak${
                      failureCount ? `, gagal ${failureCount}` : ''
                    }`
              );
            } else {
              toast.error(
                jenisPenerima === '2'
                  ? 'Gagal mengirim pesan WhatsApp ke grup'
                  : 'Gagal mengirim pesan WhatsApp ke semua penerima'
              );
            }
          } catch (waError) {
            console.error('Gagal kirim WhatsApp:', waError);
            toast.error('Terjadi kesalahan saat mengirim pesan WhatsApp');
          }

          router.push('/kabar-tani/blast-pesan');
        } else {
          const message = response?.data?.message || 'Gagal membuat campaign';
          const errors = response?.data?.errors || {};
          const kontakError = errors?.kontak?.[0];
          const grupError = errors?.grup?.[0] || errors?.grup?.[0];
          const errorText = grupError || kontakError;
          toast.error(errorText ? `${message} - ${errorText}` : message);
        }
      } catch (error) {
        const message =
          error?.response?.data?.message || 'Terjadi kesalahan sistem';
        const errors = error?.response?.data?.errors || {};
        const kontakError = errors?.kontak?.[0];
        const grupError = errors?.grup?.[0] || errors?.grup?.[0];
        const errorText = grupError || kontakError;
        toast.error(errorText ? `${message} - ${errorText}` : message);
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

  // Remove grup fetching; Whacenter is the only endpoint for group messaging

  useEffect(() => {
    // Reset selected recipients when switching mode
    setSelectedMembers([]);
  }, [activeTile]);

  return (
    <div className="relative w-full bg-gray-50">
      <div className="mx-auto flex h-full w-full min-w-[320px] max-w-7xl flex-col gap-6 p-2">
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
              <div className="flex flex-col gap-4 md:flex-row md:gap-6">
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
                  label={'Nama Pesan'}
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
                containerClassName="flex flex-row flex-wrap gap-2"
                value={activeTile}
                onChangeValue={(e) => setActiveTile(e)}
                options={[
                  { label: 'Kontak Individu', value: 'personal' },
                  { label: 'Kontak Grup', value: 'group' },
                ]}
              />

              {activeTile === 'personal' ? (
                <MemberSelector
                  selectedMembers={selectedMembers}
                  availableMembers={availableMembers}
                  onMembersChange={handleMembersChange}
                  label="Penerima Pesan"
                />
              ) : (
                <div className="flex w-full flex-col gap-1">
                  <Label className="text-[12px] font-bold text-gray-500">
                    Grup Kontak
                  </Label>
                  <InputText
                    name="nama_grup"
                    placeholder="Masukkan nama grup yang sesuai"
                    value={values.nama_grup}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              )}

              {activeTile === 'personal' && selectedMembers.length > 0 && (
                <div className="text-sm text-blue-600">
                  Total penerima: {selectedMembers.length} kontak
                </div>
              )}
            </div>
          </div>

          {/* Message Section */}
          <div className="mt-6 rounded-[4px] border border-gray-200 bg-white">
            <Heading
              level={3}
              className="mb-4 mt-6 px-6 text-lg font-semibold text-gray-800"
            >
              PESAN
            </Heading>

            <div className="mb-6 px-6">
              <InputMessage
                name="isi_pesan"
                value={values.isi_pesan}
                onChange={handleChange}
                onBlur={handleBlur}
                showCharCount
                charCountMax={160}
                error={!!(errors.isi_pesan && touched.isi_pesan)}
                errorText={errors.isi_pesan}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="my-6 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
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
              disabled={
                isSubmitting ||
                (activeTile === 'group'
                  ? !values.nama_grup || !values.nama_grup.trim()
                  : selectedMembers.length === 0)
              }
              className={isSubmitting ? 'opacity-75' : ''}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Mengirim...
                </div>
              ) : activeTile === 'group' ? (
                `Kirim Pesan (Grup)`
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
