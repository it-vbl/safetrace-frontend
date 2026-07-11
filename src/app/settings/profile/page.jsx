'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import ModalUbahDataPengguna from '@/components/organisms/Modal/ModalUbahDataPengguna';
import { getUserProfile, updateUserProfile } from '@/services/user';

const ProfilePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getUserProfile();
        const status = res?.data?.status || res?.status;
        if (status === 'success' || status === 200) {
          setUser(res?.data?.data || res?.data);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Gagal mengambil profil pengguna'
        );
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
      const status = res?.data?.status || res?.status;
      if (status === 'success' || status === 200) {
        toast.success(res?.data?.message || 'Berhasil ubah data profil');
        const updated = res?.data?.data || res?.data;
        if (updated) setUser(updated);
        setModalOpen(false);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-2xl font-bold">PROFIL</h1>
      <div className="mt-4 flex w-full flex-col gap-4 pb-8">
        <div className="flex w-full items-start rounded-[4px] border border-neutral-300 bg-white p-4">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">IDENTITAS</h2>
              <button
                type="button"
                className="text-right text-sm font-medium text-primary underline hover:text-primary"
                onClick={() => setModalOpen(true)}
              >
                Ubah Data
              </button>
            </div>

            <div className="grid w-full grid-cols-4">
              <BorderBottomColData
                isBordered={false}
                label="Nama"
                value={user?.name || '-'}
              />
              <BorderBottomColData
                isBordered={false}
                label="Username"
                value={user?.username || '-'}
              />
              <BorderBottomColData
                isBordered={false}
                label="Email"
                value={user?.email || '-'}
              />
              <BorderBottomColData
                isBordered={false}
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
