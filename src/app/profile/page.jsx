'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import BorderBottomColData from '@/components/molecules/BorderBottomColData'; // Importing the new component
import ModalUbahDataPengguna from '@/components/organisms/Modal/ModalUbahDataPengguna'; // Importing the new modal
import { getUserDetail, updateUserProfile } from '@/services/user';

const ProfilePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id = Cookies.get('userId');
    if (!id) return;
    (async () => {
      try {
        const res = await getUserDetail(id);
        if (res.status === 200) {
          setUser(res.data?.data);
        }
      } catch (error) {
        console.error('Error fetching user detail:', error);
      }
    })();
  }, []);

  const handleUpdateUser = async (values) => {
    try {
      const payload = {
        email: values.email,
        name: values.name,
        username: values.username,
      };
      const res = await updateUserProfile(payload);
      if (res.status === 200) {
        toast.success('Data pengguna berhasil diperbarui');
        const id = Cookies.get('userId');
        if (id) {
          const detailRes = await getUserDetail(id);
          if (detailRes.status === 200) {
            setUser(detailRes.data?.data);
          }
        }
        setModalOpen(false);
      }
    } catch (error) {
      // Re-throw to let modal handle displaying API errors and toasts
      throw error;
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold">PROFIL</h1>
      <div className="mt-4 flex w-full flex-col gap-4 pb-8">
        <div className="flex w-full items-start rounded-[4px] border border-gray-300 bg-gray-50 p-4">
          <div className="w-full">
            <h2 className="text-lg font-semibold">IDENTITAS</h2>
            <div className="grid w-full grid-cols-4">
              <BorderBottomColData label="Nama" value={user?.name || '-'} />
              <BorderBottomColData
                label="Username"
                value={user?.username || '-'}
              />
              <BorderBottomColData label="Email" value={user?.email || '-'} />
              <BorderBottomColData
                label="Roles"
                value={
                  user?.roles_label && user?.roles_label.trim() !== ''
                    ? user.roles_label
                    : Array.isArray(user?.roles) && user.roles.length
                    ? user.roles.join(', ')
                    : '-'
                }
              />
            </div>
            <div className="mt-4 flex w-full justify-end">
              <Button onClick={() => setModalOpen(true)} variant="secondary">
                Ubah Data
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ModalUbahDataPengguna
        open={modalOpen}
        setOpen={setModalOpen}
        onSubmit={handleUpdateUser}
        initialValues={{
          name: user?.name || '',
          username: user?.username || '',
          email: user?.email || '',
        }}
      />
    </div>
  );
};

export default ProfilePage;
