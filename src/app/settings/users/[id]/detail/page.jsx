'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import ColData from '@/components/atoms/ColData';
import Accordion from '@/components/molecules/Accordion';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import ModalUpdateUser from '@/components/organisms/Modal/ModalUpdateUser';
import { useUserManagement } from '@/hooks/useUsers';
import { setSelectedUser } from '@/store/slices/selectedUser';

const UserDetailPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
  const [showModalUpdateUser, setShowModalUpdateUser] = useState(false);
  const { updateUser } = useUserManagement();

  const handleUpdateUser = async (values) => {
    try {
      // Map form values to API expected format
      const userData = {
        id: values.id,
        name: values.nama,
        username: values.username,
        email: values.email,
        is_active: values.status == 'true' ? true : false,
        roles: values.roles,
      };

      const response = await updateUser(userData);

      // Update the selected user in Redux store with the updated data
      if (response && response.data) {
        dispatch(setSelectedUser(response.data));
      }

      setShowModalUpdateUser(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!selectedUser) {
      router.push('/settings/users');
    }
  }, [selectedUser]);

  const breadcrumbItems = [
    { label: 'PENGGUNA', href: '/settings/users' },
    { label: 'DETAIL PENGGUNA' },
  ];

  return (
    <div className="w-full space-y-6">
      <BreadcrumbDetail items={breadcrumbItems} />
      <Accordion
        title="Identitas Pengguna"
        defaultIsOpen={true}
        prefixTitleComponent={
          <button
            type="button"
            onClick={() => setShowModalUpdateUser(true)}
            className="ml-auto text-right text-sm font-medium text-blue-600 underline hover:text-blue-800"
          >
            Ubah Data
          </button>
        }
      >
        <>
          <div className="grid grid-cols-5 gap-4">
            <ColData label="Nama" value={selectedUser?.name || '-'} />
            <ColData label="Username" value={selectedUser?.username || '-'} />
            <ColData label="Email" value={selectedUser?.email || '-'} />
            <ColData label="Roles" value={selectedUser?.roles_label || '-'} />
            <ColData
              label="Dibuat Oleh"
              value={selectedUser?.registered_via_label || '-'}
            />
            <div className="col-span-5 my-2 border-b border-dashed border-gray-300" />
          </div>
          <div className="mt-2 flex flex-grow-0 flex-col items-start">
            <div className="text-[12px] font-bold text-gray-500">Status</div>
            <div
              className={`inline-block rounded px-3 py-1 text-xs font-semibold ${
                selectedUser?.status === true || selectedUser?.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {selectedUser?.status === true || selectedUser?.is_active
                ? 'Aktif'
                : 'Tidak Aktif'}
            </div>
          </div>
        </>
      </Accordion>
      <ModalUpdateUser
        onSubmit={handleUpdateUser}
        open={showModalUpdateUser}
        setOpen={setShowModalUpdateUser}
        userData={selectedUser}
      />
    </div>
  );
};

export default UserDetailPage;
