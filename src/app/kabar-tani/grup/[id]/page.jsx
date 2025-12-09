'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import MemberSelector from '@/components/molecules/MemberSelector';
import Modal from '@/components/molecules/Modal';
import TextArea from '@/components/molecules/TextArea';
import Pagination from '@/components/organisms/Pagination';
import { getGrupKontakDetail, updateGrupKontak } from '@/services/grup';
import { getKontakList } from '@/services/kontak';

ModuleRegistry.registerModules([AllCommunityModule]);

const GrupDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [groupDesc, setGroupDesc] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMembersEdit, setSelectedMembersEdit] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [membersPage, setMembersPage] = useState(1);
  const [membersPageSize, setMembersPageSize] = useState(10);

  const autoSizeStrategy = useMemo(() => {
    return { type: 'fitCellContents' };
  }, []);

  const colDefs = [
    {
      field: 'nama',
      headerName: 'Nama',
      flex: 2,
      minWidth: 220,
      headerClass: 'text-xs text-gray-600',
      cellClass: 'text-sm text-gray-800',
      suppressSizeToFit: true,
    },
    {
      field: 'nomor_wa',
      headerName: 'Nomor WA',
      flex: 2,
      minWidth: 180,
      headerClass: 'text-xs text-gray-600',
      cellClass: 'text-sm text-gray-800',
      suppressSizeToFit: true,
    },
  ];

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: false,
      filter: false,
    }),
    []
  );

  const breadcrumbItems = [
    { label: 'GRUP KONTAK', href: '/kabar-tani/grup' },
    { label: 'DETAIL GRUP' },
  ];

  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await getGrupKontakDetail(id);
        const payload = response?.data?.data ?? response?.data ?? {};
        const anggota = Array.isArray(payload?.anggota) ? payload.anggota : [];
        const nama = payload?.nama ?? '';
        const deskripsi = payload?.deskripsi ?? '';
        if (mounted) {
          setGroupName(nama);
          setMembers(anggota);
          setGroupDesc(deskripsi);
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleOpenEdit = () => {
    setIsEditOpen(true);
    setSelectedMembersEdit(members || []);
  };

  useEffect(() => {
    let mounted = true;
    const fetchContacts = async () => {
      if (!isEditOpen) return;
      try {
        setLoadingMembers(true);
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
      } finally {
        if (mounted) setLoadingMembers(false);
      }
    };
    fetchContacts();
    return () => {
      mounted = false;
    };
  }, [isEditOpen]);

  const schemaValidation = Yup.object().shape({
    group_name: Yup.string().required('Nama grup harus diisi'),
    group_desc: Yup.string().optional(),
  });

  const {
    handleSubmit,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    isSubmitting,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      group_name: groupName || '',
      group_desc: groupDesc || '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (formValues, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const payload = {
          nama: formValues.group_name,
          deskripsi: formValues.group_desc || '',
          anggota: (selectedMembersEdit || []).map((m) => m.id),
        };

        const response = await updateGrupKontak(id, payload);
        if (response.status === 200 || response.status === 201) {
          setGroupName(payload.nama);
          setGroupDesc(payload.deskripsi);
          setMembers((selectedMembersEdit || []).map((m) => ({ ...m })));
          setIsEditOpen(false);
          toast.success('Berhasil mengubah grup');
        } else {
          toast.error('Gagal mengubah grup');
        }
      } catch (error) {
        console.error('Error updating group:', error);
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
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="overflow-hidden rounded-[4px] border border-gray-200 bg-white">
            {/* Header */}
            <div className="mt-6 px-6">
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <Heading
                  level={3}
                  className="text-lg font-semibold text-gray-800"
                >
                  DETAIL
                </Heading>
                <button
                  type="button"
                  onClick={() => {
                    setValues({
                      group_name: groupName || '',
                      group_desc: groupDesc || '',
                    });
                    handleOpenEdit();
                  }}
                  className="text-sm text-blue-600 underline"
                >
                  Ubah Grup
                </button>
              </div>
            </div>

            <div className="mb-6 space-y-4 px-6">
              {/* Nama Grup Section (Disabled) */}
              <InputText
                label={'Nama Grup'}
                name="group_name"
                placeholder="Masukan nama grup"
                value={groupName}
                disabled
                readOnly
                errors={{}}
                touched={{}}
              />

              <TextArea
                label="Deskripsi Grup"
                name="group_description"
                placeholder="Masukkan deskripsi grup"
                value={groupDesc}
                disabled
                isFullWidth={true}
              />

              {/* Members Table (AgGridReact) */}
              <div className="space-y-2">
                <div className="rounded-[4px] border p-3">
                  {loading && (
                    <span className="text-sm text-gray-500">
                      Memuat data...
                    </span>
                  )}
                  {!loading && error && (
                    <span className="text-sm text-red-500">
                      Gagal memuat data
                    </span>
                  )}
                  {!loading && !error && members.length === 0 && (
                    <span className="text-sm text-gray-500">
                      Belum ada anggota
                    </span>
                  )}
                  {!loading && !error && members.length > 0 && (
                    <div className="ag-theme-quartz relative w-full overflow-x-auto">
                      <div className="min-w-[320px]">
                        <AgGridReact
                          loading={loading}
                          overlayLoadingTemplate="."
                          autoSizeStrategy={autoSizeStrategy}
                          domLayout="autoHeight"
                          rowHeight={36}
                          defaultColDef={defaultColDef}
                          rowData={members
                            .slice(
                              (membersPage - 1) * membersPageSize,
                              (membersPage - 1) * membersPageSize +
                                membersPageSize
                            )
                            .map((m) => ({
                              id: m.id,
                              nama: m.name ?? m.nama ?? '-',
                              nomor_wa: m.phone ?? m.no_wa ?? '-',
                            }))}
                          columnDefs={colDefs}
                        />
                        <div className="mt-3 flex justify-end">
                          <Pagination
                            currentPage={membersPage}
                            pageSize={membersPageSize}
                            totalItems={members.length}
                            onPageChange={(page) => setMembersPage(page)}
                            onPageSizeChange={(size) => {
                              setMembersPageSize(size);
                              setMembersPage(1);
                            }}
                            labels={{
                              rowsPerPage: 'Baris per halaman',
                              showing: 'Menampilkan',
                              of: 'dari',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Edit Modal */}
        <Modal
          open={isEditOpen}
          onclose={() => setIsEditOpen(false)}
          label="EDIT GRUP"
        >
          <div className="flex flex-col gap-4 pt-4">
            <InputText
              label={'Nama Grup'}
              name="group_name"
              placeholder="Masukan nama grup"
              value={values.group_name}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
              isRequired={true}
            />
            <InputText
              label={'Deskripsi'}
              name="group_desc"
              placeholder="Masukan deskripsi grup (opsional)"
              value={values.group_desc}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
            <div>
              <label className="block text-[12px] font-bold text-gray-500">
                Anggota
              </label>
              <div className="mt-2">
                {loadingMembers ? (
                  <span className="text-sm text-gray-500">
                    Memuat anggota...
                  </span>
                ) : (
                  <MemberSelector
                    selectedMembers={selectedMembersEdit}
                    availableMembers={availableMembers}
                    onMembersChange={setSelectedMembersEdit}
                    label=""
                    loading={loadingMembers}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-row justify-end gap-2">
            <Button
              isLoading={isSubmitting}
              onClick={() => setIsEditOpen(false)}
              className="bg-red-500"
            >
              Batalkan
            </Button>
            <Button isLoading={isSubmitting} onClick={handleSubmit}>
              Simpan
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GrupDetailPage;
