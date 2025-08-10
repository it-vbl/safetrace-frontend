'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import Accordion from '@/components/molecules/Accordion';
import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import ModalUpdateUser from '@/components/organisms/Modal/ModalUpdateUser';
import { useUserManagement } from '@/hooks/useUsers';
import { setSelectedUser } from '@/store/slices/selectedUser';
import { useEffect } from 'react';

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
        is_active: values.status == "true" ? true: false, 
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
      router.push('/settings/users')
    }
  },[selectedUser])

  const breadcrumbItems = [
    { label: 'PENGGUNA', href: '/settings/users' },
    { label: 'DETAIL PENGGUNA' },
  ];

  return (
    <div className="w-full">
      <BreadcrumbDetail items={breadcrumbItems} />
        <Accordion title="Identitas Pengguna" defaultIsOpen={true}>
          <>
        <div className="grid grid-cols-5 gap-4 mb-4">
          <BorderBottomColData label="Nama" value={selectedUser?.name || '-'} />
          <BorderBottomColData label="Username" value={selectedUser?.username || '-'} />
          <BorderBottomColData label="Email" value={selectedUser?.email || '-'} />
          <BorderBottomColData label="Roles" value={selectedUser?.roles_label || '-'} />
          <BorderBottomColData label="Dibuat Oleh" value={selectedUser?.registered_via_label || '-'} />
        </div>
        <div className="mt-4 flex flex-col flex-grow-0 items-start">
          <div className="text-[12px] text-gray-500 font-bold">Status</div>
          <div className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
            selectedUser?.status === true || selectedUser?.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {selectedUser?.status === true || selectedUser?.is_active ? 'Aktif' : 'Tidak Aktif'}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowModalUpdateUser(true)} variant="secondary">
            Ubah Data
          </Button>
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
