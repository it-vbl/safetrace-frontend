'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import MemberSelector from '@/components/molecules/MemberSelector';
import TextArea from '@/components/molecules/TextArea';
import { createGrupKontak } from '@/services/grup';
import { getKontakList } from '@/services/kontak';

const TambahGrupPage = () => {
  const router = useRouter();

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);

  // Pagination and Search state for contacts
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);

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
      group_description: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const payload = {
          nama: values.group_name,
          deskripsi: values.group_description,
          anggota: selectedMembers.map((m) => m.id),
        };

        const response = await createGrupKontak(payload);

        if (response.status === 200 || response.status === 201) {
          router.push('/kabar-tani/grup');
          toast.success('Berhasil menambahkan grup');
        } else {
          toast.error('Gagal menambahkan grup');
        }
      } catch (error) {
        console.error('Error creating group:', error);
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setSubmitting(false);
      }
    },
  });

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

              {/* Deskripsi Grup Section */}
              <TextArea
                label="Deskripsi Grup"
                name="group_description"
                placeholder="Masukkan deskripsi grup"
                value={values.group_description}
                onChange={handleChange}
                onBlur={handleBlur}
                isFullWidth={true}
                maxChar={null}
                hasError={
                  touched?.group_description && !!errors?.group_description
                }
                helperText={
                  touched?.group_description && errors?.group_description
                    ? errors.group_description
                    : ''
                }
              />

              {/* Member Selector Component */}
              <MemberSelector
                selectedMembers={selectedMembers}
                availableMembers={availableMembers}
                onMembersChange={handleMembersChange}
                label="Anggota"
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
