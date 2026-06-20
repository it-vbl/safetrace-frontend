'use client';

import { useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import ModalCreateUser from '@/components/organisms/Modal/ModalCreateUser';
import Pagination from '@/components/organisms/Pagination';
import useReferences from '@/hooks/useReferences';
import { useUserManagement } from '@/hooks/useUsers';
import { setSelectedUser } from '@/store/slices/selectedUser';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Users = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    users,
    loading,
    total,
    currentPage,
    currentPageSize,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    createUser,
    deleteUser,
    fetchUsers,
  } = useUserManagement();

  const { fetchUserRoles } = useReferences();

  const handleOnLihatClicked = (data) => {
    dispatch(setSelectedUser(data));
    router.push(`/settings/users/${data.id}/detail`);
  };
  const handleOnDeleteClicked = (data) => {
    setSelectedUserToDelete(data);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUserToDelete?.id) {
      toast.error('ID pengguna tidak ditemukan');
      return;
    }
    try {
      setIsDeleting(true);
      await deleteUser(selectedUserToDelete.id);
      setIsDeleteModalOpen(false);
      setSelectedUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Gagal menghapus pengguna');
    } finally {
      setIsDeleting(false);
    }
  };

  const ActionsCellRenderer = useCallback(
    (e) => {
      return (
        <div className="flex h-full w-full flex-row items-center justify-center gap-2">
          <div
            className="cursor-pointer text-[12px] font-bold uppercase text-primary underline"
            onClick={() => handleOnLihatClicked(e.data)}
          >
            Lihat
          </div>
          <div
            className="cursor-pointer text-[12px] font-bold uppercase text-red-500 underline"
            onClick={() => handleOnDeleteClicked(e.data)}
          >
            Hapus
          </div>
        </div>
      );
    },
    [users]
  );

  const colDefs = [
    {
      field: 'actions',
      headerName: '',
      cellRenderer: ActionsCellRenderer,
      width: 128,
      pinned: 'left',
    },
    { field: 'username', headerName: 'Username' },
    { field: 'email', headerName: 'Email' },
    { field: 'roles_label', headerName: 'Role' },
    {
      field: 'is_active',
      headerName: 'Status',
      cellRenderer: (params) => (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            params.value === true
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {params.value === true ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    { field: 'registered_via_label', headerName: 'Dibuat Oleh' },
    {
      field: 'updated_at',
      headerName: 'Terakhir Diubah',
      cellRenderer: (params) =>
        new Date(params.value).toLocaleDateString('id-ID'),
    },
  ];

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const handleSearchTextChange = useCallback(
    debounce((e) => {
      handleSearch(e.target.value);
    }, 300),
    [handleSearch]
  );

  const handleCreateUser = async (values) => {
    const userData = {
      name: values.nama,
      email: values.email,
      password: values.password,
      repassword: values.confirmPassword,
      is_active: values.status === '1',
      roles: values.roles.map((role) => parseInt(role, 10)),
      username: values.username,
      ketua_kelompok_tani: values.ketua_kelompok_tani,
      pabrik: values.pabrik ? parseInt(values.pabrik, 10) : null,
    };

    try {
      const res = await createUser(userData);
      const status = res?.status || res?.data?.status;
      if (status === 'success' || status === 200) {
        setShowModalCreateUser(false);
      } else {
        toast.error(res?.data?.message || 'Permintaan tidak valid.');
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      const apiErrors = error?.response?.data?.errors;
      if (apiMessage) toast.error(apiMessage);
      if (apiErrors && typeof apiErrors === 'object') {
        Object.entries(apiErrors).forEach(([field, msgs]) => {
          if (Array.isArray(msgs) && msgs.length > 0) {
            toast.error(`${field}: ${msgs[0]}`);
          }
        });
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  return (
    <div className="relative max-h-[calc(100vh-72px)] w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <Heading level={2}>Daftar Pengguna</Heading>
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-row items-center gap-2">
              <SearchBar
                onChange={handleSearchTextChange}
                placeholder="Cari pengguna..."
              />
              <Button onClick={() => setShowModalCreateUser(true)}>
                Tambah Pengguna
              </Button>
            </div>
          </div>
        </div>
        <div className="relative w-full flex-1">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            autoSizeStrategy={autoSizeStrategy}
            rowData={users}
            columnDefs={colDefs}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          pageSize={currentPageSize}
          totalItems={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showRowsPerPage={true}
          labels={{
            rowsPerPage: 'Baris Per Halaman',
            showing: 'Menampilkan',
            of: 'dari',
          }}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemName={`pengguna dengan username ${selectedUserToDelete?.username}`}
          isLoading={isDeleting}
        />
      </div>
      <ModalCreateUser
        onSubmit={handleCreateUser}
        open={showModalCreateUser}
        setOpen={setShowModalCreateUser}
      />
    </div>
  );
};

export default Users;
