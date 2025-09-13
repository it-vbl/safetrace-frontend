'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { useFormik } from 'formik';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import MemberSelector from '@/components/molecules/MemberSelector';
import Heading from '@/components/atoms/Typography/Heading';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const TambahGrupPage = () => {
  const router = useRouter();

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
    { label: 'GRUP KONTAK', href: '/kabar-tani/grup' },
    { label: 'TAMBAH GRUP' },
  ];

  const handleCancel = () => {
    router.back();
  };

  const schemaValidation = Yup.object().shape({
    group_name: Yup.string().required('Nama grup harus diisi'),
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
      group_name: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const groupData = {
          group_name: values.group_name,
          members: selectedMembers,
          totalMembers: selectedMembers.length,
        };

        console.log('Saving group:', groupData);

        // Uncomment and modify this when you have the actual API
        // const res = await createGroup(groupData);
        // if (res.status === 200) {
        //   router.push('/kabar-tani/grup');
        //   toast.success('Berhasil menambahkan grup');
        // }

        // For now, simulate success
        setTimeout(() => {
          router.push('/kabar-tani/grup');
          toast.success('Berhasil menambahkan grup');
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
              <InputText
                label={'Nama Grup'}
                name="group_name"
                placeholder="Masukan nama grup"
                value={values.group_name}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
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
              {isSubmitting ? 'Menyimpan...' : 'Simpan Grup'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahGrupPage;
