'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
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
import { createBroadcast, updateBroadcast } from '@/services/broadcast';
import { getDeviceList } from '@/services/device';
import { getGrupKontakDetail, getGrupKontakList } from '@/services/grup';
import { getKontakList, updateKontak } from '@/services/kontak';
import WhatsAppService from '@/services/whatsapp';
import { formatPhoneNumber } from '@/utils/whatsapp';

const PesanBaruPage = () => {
  const router = useRouter();

  const [noPengirim, setNoPengirim] = useState('');
  const [activeTile, setActiveTile] = useState('personal');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  // Pagination and Search state for contacts
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchGroups = async () => {
      try {
        const params = { page: 1, limit: 100 };
        const response = await getGrupKontakList(params);
        const dataReference =
          response?.data?.data?.results ||
          response?.data?.data ||
          response?.data ||
          [];
        const groups = Array.isArray(dataReference) ? dataReference : [];

        const options = groups
          .map((g) => ({
            id: g.id,
            name: g.nama_grup || g.nama || g.name || 'Unnamed Group',
            phone: '-',
            gender: '-',
          }))
          .filter((o) => o.id);

        if (mounted) {
          setGroupOptions(options);
        }
      } catch (error) {
        console.error('Error fetching internal groups:', error);
        if (mounted) setGroupOptions([]);
      }
    };

    fetchGroups();

    return () => {
      mounted = false;
    };
  }, []);

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
        if (!phone) {
          results.push({ name, phone, status: 'failed', error: new Error('Nomor telepon kosong') });
          toast.error(`Gagal mengirim ke ${name || 'kontak'}: Nomor telepon kosong`);
          continue;
        }

        const contactId = member?.id ?? member?.kontak_id ?? member?.id_kontak;
        const orig = availableMembers.find((c) => String(c.id) === String(contactId));
        if (orig?.wa_valid === false) {
          results.push({ name, phone, status: 'failed', error: new Error('Nomor WhatsApp tidak valid') });
          toast.error(`Gagal mengirim ke ${name || 'kontak'}: Nomor WhatsApp tidak valid`);
          continue;
        }

        try {
          const res = await sendWhatsAppMessage(deviceId, phone, message);
          const isSent = res?.data?.status === true || String(res?.data?.status).toLowerCase() === 'success' || String(res?.data?.status).toLowerCase() === 'sent';
          results.push({ name, phone, status: isSent ? 'sent' : 'failed', res });
          if (isSent) {
            toast.success(`Pesan terkirim ke ${phone}`);
          } else {
            const waMsg = res?.data?.message || 'Gagal mengirim pesan WhatsApp';
            toast.error(`Gagal mengirim ke ${phone}: ${waMsg}`);

            const isInvalidNumber =
              String(waMsg).toLowerCase().includes('not valid') ||
              String(waMsg).toLowerCase().includes('tidak valid') ||
              String(waMsg).toLowerCase().includes('invalid');
            if (isInvalidNumber && contactId) {
              try {
                const payload = {
                  nama: orig?.nama || member?.nama || member?.name || '',
                  no_wa: phone,
                  jns_kelamin: orig?.jns_kelamin || member?.jns_kelamin || member?.gender || '1',
                  sumber: orig?.sumber || member?.sumber || '1',
                  wa_valid: false,
                };
                await updateKontak(contactId, payload);
              } catch (updateErr) {
                console.error('Failed to update contact wa_valid status:', updateErr);
              }
            }
          }
        } catch (error) {
          console.error(`✗ Gagal kirim ke ${phone}:`, error);
          results.push({ name, phone, status: 'failed', error });
          const errMsg = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
          toast.error(`Gagal mengirim ke ${phone}: ${errMsg}`);

          const isInvalidNumber =
            String(errMsg).toLowerCase().includes('not valid') ||
            String(errMsg).toLowerCase().includes('tidak valid') ||
            String(errMsg).toLowerCase().includes('invalid');
          if (isInvalidNumber && contactId) {
            try {
              const payload = {
                nama: orig?.nama || member?.nama || member?.name || '',
                no_wa: phone,
                jns_kelamin: orig?.jns_kelamin || member?.jns_kelamin || member?.gender || '1',
                sumber: orig?.sumber || member?.sumber || '1',
                wa_valid: false,
              };
              await updateKontak(contactId, payload);
            } catch (updateErr) {
              console.error('Failed to update contact wa_valid status:', updateErr);
            }
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
      isi_pesan: 'Lorem Ipsum Dolor Sit Amet',
      nama_grup: [],
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

        // Cek status perangkat Whacenter sebelum melakukan createBroadcast
        try {
          const deviceStatusRes = await WhatsAppService.getWhacenterDeviceStatus(values.no_pengirim);
          const deviceStatus = deviceStatusRes?.data || deviceStatusRes;
          const isOnline =
            typeof deviceStatus?.status === 'string'
              ? ['online', 'connected', 'true'].includes(deviceStatus.status.toLowerCase())
              : deviceStatus?.status ?? deviceStatus?.connected ?? false;

          if (!isOnline) {
            toast.error(deviceStatus?.message || 'device not connected or not found');
            setSubmitting(false);
            return;
          }
        } catch (err) {
          console.error('Failed to verify device status:', err);
          toast.error('Gagal memverifikasi status device Whacenter');
          setSubmitting(false);
          return;
        }

        if (activeTile === 'group') {
          if (selectedGroups.length === 0) {
            toast.error('Pilih minimal satu grup WhatsApp');
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

        const payload = {
          nama_pesan: values.nama_pesan,
          pesan: values.isi_pesan,
          jenis_penerima: jenisPenerima,
          device: selectedDevice?.id,
          kontak: recipientIds,
          terkirim: false, // Set false initially
          ...(jenisPenerima === '2' && {
            grup: selectedGroups
              .map((g) => {
                return g.id;
              })
              .filter((g) => typeof g === 'number' || typeof g === 'string'),
          }),
        };

        const response = await createBroadcast(payload);
        const broadcastId = response?.data?.data?.id || response?.data?.id;

        if (
          response?.status === 200 ||
          response?.status === 201 ||
          response?.data?.status === 'success'
        ) {
          if (jenisPenerima === '2') {
            try {
              let successCount = 0;
              let failureCount = 0;
              let totalMembers = 0;

              const allMembers = [];
              for (const group of selectedGroups) {
                try {
                  const groupDetail = await getGrupKontakDetail(group.id, {
                    limit: 1000,
                    page_size: 1000,
                  });

                  const responseData =
                    groupDetail?.data?.data || groupDetail?.data || {};
                  const members = responseData?.anggota || [];

                  allMembers.push(...members);
                } catch (err) {
                  console.error(
                    `Gagal mengambil anggota grup ${group.name}:`,
                    err
                  );
                }
              }

              const uniqueMembers = allMembers.reduce((acc, member) => {
                const phone = member?.no_wa;
                if (phone && !acc.find((m) => m.no_wa === phone)) {
                  acc.push(member);
                }
                return acc;
              }, []);

              totalMembers = uniqueMembers.length;

              if (totalMembers === 0) {
                toast.error('Tidak ada anggota dalam grup yang dipilih');
                router.push('/kabar-tani/blast-pesan');
                setSubmitting(false);
                return;
              }

              toast.info(
                `Sedang mengirim pesan ke ${totalMembers} anggota grup...`
              );

              const results = [];
              for (let i = 0; i < uniqueMembers.length; i++) {
                const member = uniqueMembers[i];
                const phone = member?.no_wa;

                if (!phone) {
                  results.push({ success: false, skipped: true });
                  continue;
                }

                if (member?.wa_valid === false) {
                  results.push({ success: false, phone });
                  toast.error(`Gagal mengirim ke ${member?.nama || member?.name || 'kontak'}: Nomor WhatsApp tidak valid`);
                  continue;
                }

                try {
                  const res = await sendWhatsAppMessage(
                    values.no_pengirim,
                    phone,
                    values.isi_pesan
                  );
                  const isSent = res?.data?.status === true || String(res?.data?.status).toLowerCase() === 'success' || String(res?.data?.status).toLowerCase() === 'sent';
                  results.push({ success: isSent, phone, res });
                  if (isSent) {
                    toast.success(`Pesan terkirim ke ${phone}`);
                  } else {
                    const waMsg = res?.data?.message || 'Gagal mengirim pesan WhatsApp';
                    toast.error(`Gagal mengirim ke ${phone}: ${waMsg}`);

                    const isInvalidNumber =
                      String(waMsg).toLowerCase().includes('not valid') ||
                      String(waMsg).toLowerCase().includes('tidak valid') ||
                      String(waMsg).toLowerCase().includes('invalid');
                    if (isInvalidNumber) {
                      try {
                        const contactId = member?.id ?? member?.kontak_id ?? member?.id_kontak;
                        if (contactId) {
                          const payload = {
                            nama: member?.nama || member?.name || '',
                            no_wa: phone,
                            jns_kelamin: member?.jns_kelamin || member?.gender || '1',
                            sumber: member?.sumber || '1',
                            wa_valid: false,
                          };
                          await updateKontak(contactId, payload);
                        }
                      } catch (updateErr) {
                        console.error('Failed to update contact wa_valid status:', updateErr);
                      }
                    }
                  }
                } catch (err) {
                  console.error(`✗ Gagal kirim ke ${phone}:`, err);
                  results.push({ success: false, phone, error: err });
                  const errMsg = err?.response?.data?.message || err?.message || 'Terjadi kesalahan';
                  toast.error(`Gagal mengirim ke ${phone}: ${errMsg}`);

                  const isInvalidNumber =
                    String(errMsg).toLowerCase().includes('not valid') ||
                    String(errMsg).toLowerCase().includes('tidak valid') ||
                    String(errMsg).toLowerCase().includes('invalid');
                  if (isInvalidNumber) {
                    try {
                      const contactId = member?.id ?? member?.kontak_id ?? member?.id_kontak;
                      if (contactId) {
                        const payload = {
                          nama: member?.nama || member?.name || '',
                          no_wa: phone,
                          jns_kelamin: member?.jns_kelamin || member?.gender || '1',
                          sumber: member?.sumber || '1',
                          wa_valid: false,
                        };
                        await updateKontak(contactId, payload);
                      }
                    } catch (updateErr) {
                      console.error('Failed to update contact wa_valid status:', updateErr);
                    }
                  }
                }
                // Tambahkan delay 1 detik antar pesan untuk mencegah rate limiting
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }

              successCount = results.filter((r) => r.success).length;
              failureCount = results.filter(
                (r) => !r.success && !r.skipped
              ).length;

              if (successCount > 0) {
                toast.success(
                  `Pesan WhatsApp terkirim ke ${successCount} dari ${totalMembers} anggota grup${failureCount ? `, gagal ${failureCount}` : ''
                  }`
                );
              } else {
                const firstFailed = results.find((r) => !r.success && !r.skipped);
                const errMsg = firstFailed?.res?.data?.message || firstFailed?.error?.response?.data?.message || firstFailed?.error?.message || 'Gagal mengirim pesan WhatsApp ke semua anggota grup';
                toast.error(errMsg);
              }

              if (broadcastId) {
                await updateBroadcast(broadcastId, {
                  ...payload,
                  terkirim: true,
                  gagal: successCount === 0 && totalMembers > 0,
                });
              }
            } catch (waError) {
              console.error('Gagal kirim WhatsApp ke anggota grup:', waError);
              toast.error(
                'Terjadi kesalahan saat mengirim pesan ke anggota grup'
              );
            }
            router.push('/kabar-tani/blast-pesan');
            setSubmitting(false);
            return;
          }

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
                `Pesan WhatsApp terkirim ke ${successCount} kontak${failureCount ? `, gagal ${failureCount}` : ''
                }`
              );
            } else {
              const firstFailed = waResults.find((r) => r.status === 'failed');
              const errMsg = firstFailed?.res?.data?.message || firstFailed?.error?.response?.data?.message || firstFailed?.error?.message || 'Gagal mengirim pesan WhatsApp ke semua penerima';
              toast.error(errMsg);
            }

            if (broadcastId) {
              await updateBroadcast(broadcastId, {
                ...payload,
                terkirim: true,
                gagal: successCount === 0 && selectedMembers.length > 0,
              });
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
      setLoadingContacts(true);
      try {
        const params = {
          page: currentPage,
          page_size: pageSize,
          ...(search && { search }),
        };
        const response = await getKontakList(params);
        const data = response?.data?.data;
        const list = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(response?.data?.results)
            ? response?.data?.results
            : Array.isArray(response?.data)
              ? response?.data
              : [];
        const count = typeof data?.count === 'number'
          ? data.count
          : typeof response?.data?.count === 'number'
            ? response.data.count
            : list.length;

        if (mounted) {
          setAvailableMembers(list);
          setTotalItems(count);
        }
      } catch (err) {
        if (mounted) {
          setAvailableMembers([]);
          setTotalItems(0);
        }
      } finally {
        if (mounted) {
          setLoadingContacts(false);
        }
      }
    };
    fetchContacts();
    return () => {
      mounted = false;
    };
  }, [currentPage, pageSize, search]);

  const handleSearchTextChange = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
        setCurrentPage(1);
      }, 300),
    []
  );

  useEffect(() => {
    setSelectedMembers([]);
    setSelectedGroups([]);
    setSearch('');
    setCurrentPage(1);
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
                  key="personal"
                  selectedMembers={selectedMembers}
                  availableMembers={availableMembers}
                  onMembersChange={handleMembersChange}
                  label="Penerima Pesan"
                  serverSide={true}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  onSearchChange={handleSearchTextChange}
                  loading={loadingContacts}
                />
              ) : (
                <div className="flex w-full flex-col gap-1">
                  <MemberSelector
                    key="group"
                    selectedMembers={selectedGroups}
                    availableMembers={groupOptions}
                    onMembersChange={setSelectedGroups}
                    label="Grup Kontak"
                    searchPlaceholder="Cari grup..."
                    type="group"
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
                  ? selectedGroups.length === 0
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
                `Kirim Pesan (${selectedGroups.length})`
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
