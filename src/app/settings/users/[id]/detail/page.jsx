'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import ColData from '@/components/atoms/ColData';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import ModalUpdateUser from '@/components/organisms/Modal/ModalUpdateUser';
import { useUserManagement } from '@/hooks/useUsers';
import { setSelectedUser } from '@/store/slices/selectedUser';

const UserDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
  const [showModalUpdateUser, setShowModalUpdateUser] = useState(false);
  const { updateUser } = useUserManagement();
  const [detailUser, setDetailUser] = useState(selectedUser || null);

  const handleUpdateUser = async (values) => {
    const userData = {
      id: values.id,
      name: values.nama,
      username: values.username,
      email: values.email,
      is_active: values.status === 'true',
      roles: (values.roles || []).map((r) => parseInt(r, 10)),
      ketua_kelompok_tani: values.ketua_kelompok_tani,
    };

    try {
      const response = await updateUser(userData);
      const status = response?.data?.status || response?.status;
      if (status === 'success' || status === 200) {
        const updated = response?.data?.data || response?.data;
        if (updated) {
          setDetailUser(updated);
          dispatch(setSelectedUser(updated));
        }
        setShowModalUpdateUser(false);
      } else {
        toast.error(response?.data?.message || 'Gagal ubah data pengguna');
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
    const fetchDetail = async () => {
      try {
        if (!id) return;
        const { getUserDetail } = await import('@/services/user');
        const res = await getUserDetail(id);
        const data = res?.data?.data || res?.data;
        if (data) {
          setDetailUser(data);
          dispatch(setSelectedUser(data));
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Gagal mendapatkan detail pengguna'
        );
        router.push('/settings/users');
      }
    };
    fetchDetail();
  }, [id, dispatch, router]);

  const breadcrumbItems = [
    { label: 'PENGGUNA', href: '/settings/users' },
    { label: 'DETAIL PENGGUNA' },
  ];

  return (
    <div className="w-full space-y-6">
      <BreadcrumbDetail items={breadcrumbItems} />
      <section className="w-full border border-gray-300 bg-white">
        <div className="flex w-full flex-row items-center p-4">
          <div className="flex flex-1 items-center text-[14px] font-bold uppercase tracking-[1px]">
            Identitas Pengguna
          </div>
          <button
            type="button"
            onClick={() => setShowModalUpdateUser(true)}
            className="ml-auto text-right text-sm font-medium text-blue-600 underline hover:text-blue-800"
          >
            Ubah Data
          </button>
        </div>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <ColData label="Nama" value={detailUser?.name || '-'} />
            <ColData label="Username" value={detailUser?.username || '-'} />
            <ColData label="Email" value={detailUser?.email || '-'} />
            <ColData label="Roles" value={detailUser?.roles_label || '-'} />
            {detailUser?.ketua_kelompok_tani && (
              <ColData
                label="Ketua Kelompok Tani"
                value={detailUser?.ketua_kelompok_tani || '-'}
              />
            )}
            <ColData
              label="Dibuat Oleh"
              value={detailUser?.registered_via_label || '-'}
            />
            <div className="col-span-1 my-2 border-b border-dashed border-gray-300 sm:col-span-2 lg:col-span-3 xl:col-span-5" />
          </div>
          <div className="mt-2 flex flex-grow-0 flex-col items-start">
            <div className="text-[12px] font-bold text-gray-500">Status</div>
            <div
              className={`inline-block rounded px-3 py-1 text-xs font-semibold ${
                detailUser?.status === true || detailUser?.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {detailUser?.status === true || detailUser?.is_active
                ? 'Aktif'
                : 'Tidak Aktif'}
            </div>
          </div>
        </div>
      </section>
      <ModalUpdateUser
        onSubmit={handleUpdateUser}
        open={showModalUpdateUser}
        setOpen={setShowModalUpdateUser}
        userData={detailUser}
      />
    </div>
  );
};

export default UserDetailPage;
