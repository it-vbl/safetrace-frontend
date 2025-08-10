'use client';


import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import Pagination from '@/components/organisms/Pagination';
import { useUserManagement } from '@/hooks/useUsers';
import ModalCreateUser from '@/components/organisms/Modal/ModalCreateUser';
import { useEffect } from 'react';
import useReferences from '@/hooks/useReferences';

import { useDispatch } from 'react-redux';
import { setSelectedUser } from '@/store/slices/selectedUser';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Users = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);

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

  const {
    fetchUserRoles
  } = useReferences()

  const handleOnLihatClicked = (data) => {
    dispatch(setSelectedUser(data));
    router.push(`/settings/users/${data.id}/detail`);
  };
  const handleOnDeleteClicked = async (data) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna ${data.username}?`)) {
      try {
        await deleteUser(data.id);
        toast.success('Pengguna berhasil dihapus');
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Gagal menghapus pengguna');
      }
    }
  };

  const ActionsCellRenderer = useCallback(
    (e) => {
      return (
        <div className='flex h-full w-full flex-row items-center justify-center gap-2'>
          <div 
            className='uppercase underline text-primary font-bold text-[12px] cursor-pointer' 
            onClick={() => handleOnLihatClicked(e.data)}
          >
            Lihat
          </div>
          <div 
            className='uppercase underline text-red-500 font-bold text-[12px] cursor-pointer' 
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
    },
    { field: 'username', headerName: 'Username' },
    { field: 'email', headerName: 'Email' },
    { field: 'roles_label', headerName: 'Role' },
    { 
      field: 'is_active', 
      headerName: 'Status',
      cellRenderer: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          params.value === true 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {params.value === true ? 'Aktif' : 'Nonaktif'}
        </span>
      )
    },
    { field: 'registered_via_label', headerName: 'Dibuat Oleh' },
    { 
      field: 'updated_at', 
      headerName: 'Terakhir Diubah',
      cellRenderer: (params) => new Date(params.value).toLocaleDateString('id-ID')
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
      try {
      // Map form values to API expected format
      const userData = {
        name: values.nama,
        email: values.email,
        is_active: values.status === '1', // Convert to boolean
        roles: values.roles.map(role => parseInt(role)), // Convert string roles to integers
        username: values.username,
        password: values.password,
        repassword: values.confirmPassword,
      };

      await createUser(userData);
      setShowModalCreateUser(false);
    } catch (error) {
      console.error('Failed to create user:', error);
      // Error handling is already done in the createUser hook
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  return (
    <div className='relative max-h-[calc(100vh-72px)] w-full'>
      <div className='flex h-full flex-col gap-4'>
        <div className='flex flex-row items-center justify-between'>
          <Heading level={2}>Daftar Pengguna</Heading>
          <div className='flex flex-row items-center gap-8'>
            <div className='flex flex-row items-center gap-2'>
              <SearchBar 
                onChange={handleSearchTextChange} 
                placeholder='Cari pengguna...' 
              />
              <Button onClick={() => setShowModalCreateUser(true)}>
                Tambah Pengguna
              </Button>
            </div>
          </div>
        </div>
        <div className='w-full flex-1'>
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
