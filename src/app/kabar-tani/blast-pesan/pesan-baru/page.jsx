'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { useFormik } from 'formik';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import MemberSelector from '@/components/molecules/MemberSelector';
import Select from '@/components/molecules/Select';
import Heading from '@/components/atoms/Typography/Heading';
import RadioButton from '@/components/molecules/RadioButton';
import Label from '../../../../components/atoms/Label';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const dummySenderOption = [
  { value: '082211591642', label: 'Fajar Sukmara - 082211591642' },
  { value: '082242394222', label: 'Ahmad Sahroji - 082242394222' },
  { value: '082211035232', label: 'Fiky Prasetcio - 082211035232' },
  { value: '085604545453', label: 'Teguh Suhandi - 085604545453' },
];

const PesanBaruPage = () => {
  const router = useRouter();

  const [noPengirim, setNoPengirim] = useState('082211591642');
  const [activeTile, setActiveTile] = useState('personal');
  const [selectedMembers, setSelectedMembers] = useState([
    {
      id: 1,
      name: 'Adam',
      phone: '082211578729',
      gender: 'Laki - Laki',
    },
    {
      id: 2,
      name: 'Rudi',
      phone: '082211578729',
      gender: 'Laki - Laki',
    },
    {
      id: 3,
      name: 'Ridho',
      phone: '082211578729',
      gender: 'Laki - Laki',
    },
  ]);

  const [availableMembers] = useState([
    {
      id: '001-APKS-001-001',
      name: 'Agustinus Nery',
      phone: '082211591642',
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
      no_pengirim: '',
      nama_pesan: '',
      isi_pesan: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const messageData = {
          no_pengirim: values.no_pengirim,
          nama_pesan: values.nama_pesan,
          isi_pesan: values.isi_pesan,
          penerima_type: activeTile,
          members: selectedMembers,
          totalMembers: selectedMembers.length,
        };

        console.log('Sending message:', messageData);

        // Uncomment and modify this when you have the actual API
        // const res = await sendMessage(messageData);
        // if (res.status === 200) {
        //   router.push('/kabar-tani/blast-pesan');
        //   toast.success('Berhasil mengirim pesan');
        // }

        // For now, simulate success
        setTimeout(() => {
          router.push('/kabar-tani/blast-pesan');
          toast.success('Berhasil mengirim pesan');
          setSubmitting(false);
        }, 1000);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
        console.error(error);
        setSubmitting(false);
      }
    },
  });

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
              {/* Nama Grup Section */}
              <div className="flex gap-6">
                <div className="flex w-full flex-col gap-1">
                  <Label className=" text-[12px] font-bold text-gray-500">
                    No.Pengirim
                  </Label>
                  <Select
                    options={dummySenderOption}
                    value={noPengirim}
                    onChange={(e) => setNoPengirim(e.target.value)}
                    placeholder="No. Pengirim"
                    className="w-full sm:w-48"
                  />
                </div>

                <InputText
                  label={'Nama Pesan'}
                  name="nama_pesan"
                  placeholder="Masukan nama pesan"
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
                label="Anggota"
              />
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
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PesanBaruPage;
