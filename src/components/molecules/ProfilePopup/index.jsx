import React, { useEffect, useMemo,useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOutIcon, Users2Icon } from 'lucide-react';
import { LockIcon } from 'lucide-react';
import { UserIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';

import ModalConfirmation from '@/components/molecules/ModalConfirmation';
import ModalGantiKataSandi from '@/components/organisms/Modal/ModalGantiKataSandi';
import useTouchOutside from '@/hooks/useTouchOutside';
import { getCurrentUserRoles, hasPermission } from '@/libs/permissions';
import { logout as logoutService } from '@/services/auth';
import { changePassword } from '@/services/user';
import { StackIcon } from '@radix-ui/react-icons';

const ProfilePopup = ({ children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const popupRef = useRef(null);
  const triggerRef = useRef(null);
  const [fullName, setFullName] = useState('');
  const [roles, setRoles] = useState([]);

  useTouchOutside(popupRef, () => setIsOpen(false));
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const currentRoles = getCurrentUserRoles();
    setRoles(currentRoles);
  }, []);

  const canSeeUsers = useMemo(
    () => hasPermission(roles, 'pengguna.view'),
    [roles]
  );

  const canSeePetaOverlay = useMemo(
    () => hasPermission(roles, 'peta.view'),
    [roles]
  );

  const canSeeProfile = useMemo(
    () => hasPermission(roles, 'profil.view'),
    [roles]
  );

  const canChangePassword = useMemo(
    () => hasPermission(roles, 'password.update'),
    [roles]
  );

  // Handle click on trigger element
  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    // For now, using a dummy route
    router.push('/settings/profile');
  };

  const handlePetaOverlayClick = () => {
    setIsOpen(false);
    // For now, using a dummy route
    router.push('/settings/peta-overlay');
  };

  const handleUsersClick = () => {
    setIsOpen(false);
    // For now, using a dummy route
    router.push('/settings/users');
  };

  const handleGantiKataSandiClick = () => {
    setIsOpen(false);
    setIsPasswordModalOpen(true);
  };

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      const refresh = Cookies.get('refreshToken');
      if (refresh) {
        await logoutService({ refresh });
      }
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('pabrik');
      Cookies.remove('pabrik_id');
      toast.success('Anda telah logout');
      setIsLogoutConfirmOpen(false);
      router.replace('/login');
    } catch (err) {
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('pabrik');
      Cookies.remove('pabrik_id');
      setIsLogoutConfirmOpen(false);
      router.replace('/login');
    }
  };

  const handlePasswordSubmit = async (values) => {
    try {
      await changePassword(values);
      setIsPasswordModalOpen(false);
      toast.success('Kata sandi berhasil diubah');
    } catch (error) {
      throw error?.response;
    }
  };

  // Calculate position for the popup
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      setPopupPosition({
        top: triggerRect.bottom,
        right: window.innerWidth - triggerRect.right,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const name = Cookies.get('fullName');
    if (name) setFullName(name);
  }, []);

  return (
    <>
      <div className="relative" ref={triggerRef} onClick={handleTriggerClick}>
        {children}
        {isOpen &&
          createPortal(
            <div
              className="fixed z-[1000] w-48 rounded-md border border-gray-200 bg-white shadow-lg"
              ref={popupRef}
              style={{
                top: `${popupPosition.top + 8}px`,
                right: `${popupPosition.right}px`,
              }}
            >
              <div className="block border-b border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 md:hidden">
                {fullName || 'Pengguna'}
              </div>
              <div className="py-1">
                {canSeeUsers && (
                  <button
                    onClick={handleUsersClick}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Users2Icon size={18} className="mr-2" />
                    <span>Pengguna</span>
                  </button>
                )}
                {canSeePetaOverlay && (
                  <button
                    onClick={handlePetaOverlayClick}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <StackIcon size={18} className="mr-2" />
                    <span>Peta Overlay</span>
                  </button>
                )}
                {canSeeProfile && (
                  <button
                    onClick={handleProfileClick}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserIcon size={18} className="mr-2" />
                    <span>Profile</span>
                  </button>
                )}
                {canChangePassword && (
                  <button
                    onClick={handleGantiKataSandiClick}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LockIcon size={18} className="mr-2" />
                    <span>Ganti Kata Sandi</span>
                  </button>
                )}
                <button
                  onClick={handleLogoutClick}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOutIcon size={18} className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>,
            document.body
          )}
      </div>
      {isPasswordModalOpen && typeof window !== 'undefined' &&
        createPortal(
          <ModalGantiKataSandi
            open={isPasswordModalOpen}
            setOpen={setIsPasswordModalOpen}
            onSubmit={handlePasswordSubmit}
          />,
          document.body
        )}
      {isLogoutConfirmOpen && typeof window !== 'undefined' &&
        createPortal(
          <ModalConfirmation
            open={isLogoutConfirmOpen}
            setOpen={setIsLogoutConfirmOpen}
            title="KELUAR"
            message="Apakah kamu yakin ingin keluar dari aplikasi?"
            confirmText="Ya, Keluar"
            cancelText="Batalkan"
            onConfirm={handleConfirmLogout}
          />,
          document.body
        )}
    </>
  );
};

export default ProfilePopup;
