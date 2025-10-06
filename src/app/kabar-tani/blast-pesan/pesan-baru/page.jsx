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
import MemberSelector from '@/components/molecules/MemberSelector';
import RadioButton from '@/components/molecules/RadioButton';
import Select from '@/components/molecules/Select';

import Label from '../../../../components/atoms/Label';
import WhatsAppService from '../../../../services/whatsapp';

const dummySenderOption = [
  { value: 'device_1', label: 'Fajar Sukmara - 082211591642' },
  { value: 'device_2', label: 'Ahmad Sahroji - 082242394222' },
  { value: 'device_3', label: 'Fiky Prasetcio - 082211035232' },
  { value: 'device_4', label: 'Teguh Suhandi - 085604545453' },
];

const PesanBaruPage = () => {
  const router = useRouter();

  const [noPengirim, setNoPengirim] = useState('device_1');
  const [activeTile, setActiveTile] = useState('personal');
  const [selectedMembers, setSelectedMembers] = useState([
    {
      id: 1,
      name: 'Adam',
      phone: '0895423764628', // Target phone number
      gender: 'Laki - Laki',
    },
  ]);

  const [availableMembers] = useState([
    {
      id: '001-APKS-001-001',
      name: 'Target User',
      phone: '0895423764628',
      gender: 'Laki - Laki',
    },
    {
      id: '001-APKS-001-002',
      name: 'Maria Sari',
      phone: '082211591643',
      gender: 'Perempuan',
    },
    {
      id: '001-APKS-001-003',
      name: 'Budi Santoso',
      phone: '082211591644',
      gender: 'Laki - Laki',
    },
    {
      id: '001-APKS-001-004',
      name: 'Siti Aminah',
      phone: '082211591645',
      gender: 'Perempuan',
    },
    {
      id: '001-APKS-001-005',
      name: 'Andi Wijaya',
      phone: '082211591646',
      gender: 'Laki - Laki',
    },
  ]);

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

  // Function to send individual message via WhatsCenter
  const sendWhatsAppMessage = async (deviceId, phoneNumber, message) => {
    try {
      const messageData = {
        phone: phoneNumber,
        message: message,
        type: 'text', // or 'media' if sending media
      };

      const response = await WhatsAppService.sendMessage(deviceId, messageData);
      return response;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  };

  // Function to send bulk message via WhatsCenter
  const sendBulkWhatsAppMessage = async (deviceId, recipients, message) => {
    try {
      const bulkMessageData = {
        recipients: recipients.map((member) => ({
          phone: member.phone,
          name: member.name,
        })),
        message: message,
        type: 'text',
      };

      const response = await WhatsAppService.sendBulkMessage(
        deviceId,
        bulkMessageData
      );
      return response;
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
  } = useFormik({
    initialValues: {
      no_pengirim: 'device_1',
      nama_pesan: '',
      isi_pesan: 'Lorem Ipsum Dolor Sit Amet', // Default message
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        // Validate device and members
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

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Send messages based on selection type
        if (activeTile === 'personal' && selectedMembers.length === 1) {
          // Send single message
          try {
            await sendWhatsAppMessage(
              values.no_pengirim,
              selectedMembers[0].phone,
              values.isi_pesan
            );
            successCount++;
            toast.success(
              'Pesan berhasil dikirim ke ' + selectedMembers[0].name
            );
          } catch (error) {
            errorCount++;
            errors.push(
              `Gagal kirim ke ${selectedMembers[0].name}: ${error.message}`
            );
          }
        } else {
          // Send bulk message or multiple individual messages
          if (selectedMembers.length <= 5) {
            // Send individual messages for small groups
            for (const member of selectedMembers) {
              try {
                await sendWhatsAppMessage(
                  values.no_pengirim,
                  member.phone,
                  values.isi_pesan
                );
                successCount++;
                console.log(`Message sent to ${member.name} (${member.phone})`);
              } catch (error) {
                errorCount++;
                errors.push(`Gagal kirim ke ${member.name}: ${error.message}`);
                console.error(`Failed to send to ${member.name}:`, error);
              }

              // Add delay between messages to avoid rate limiting
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } else {
            // Use bulk message for larger groups
            try {
              await sendBulkWhatsAppMessage(
                values.no_pengirim,
                selectedMembers,
                values.isi_pesan
              );
              successCount = selectedMembers.length;
              toast.success(
                `Bulk message berhasil dikirim ke ${selectedMembers.length} penerima`
              );
            } catch (error) {
              errorCount = selectedMembers.length;
              errors.push(`Gagal mengirim bulk message: ${error.message}`);
            }
          }
        }

        // Show results
        if (successCount > 0 && errorCount === 0) {
          toast.success(`Berhasil mengirim ${successCount} pesan`);
          setTimeout(() => {
            router.push('/kabar-tani/blast-pesan');
          }, 1500);
        } else if (successCount > 0 && errorCount > 0) {
          toast.warn(`Berhasil: ${successCount}, Gagal: ${errorCount}`);
          console.log('Errors:', errors);
        } else {
          toast.error('Semua pesan gagal dikirim');
          console.log('All errors:', errors);
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

  // Function to test connection to specific device
  const testDeviceConnection = async (deviceId) => {
    try {
      const response = await WhatsAppService.getDeviceStatus(deviceId);
      console.log('Device status:', response.data);
      return response.data;
    } catch (error) {
      console.error('Device connection error:', error);
      return null;
    }
  };

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
                    options={dummySenderOption}
                    value={noPengirim}
                    onChange={(e) => {
                      setNoPengirim(e.target.value);
                      // Test device connection when selected
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
