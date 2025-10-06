import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOutIcon } from 'lucide-react';
import { LockIcon } from 'lucide-react';
import { UserIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';

import LogoutIcon from '@/assets/icons/logout';
import ProfileIcon from '@/assets/icons/profile';
import ModalGantiKataSandi from '@/components/organisms/Modal/ModalGantiKataSandi';
import useTouchOutside from '@/hooks/useTouchOutside';
import { logout as logoutService } from '@/services/auth';
import { changePassword } from '@/services/user';
import { PersonIcon } from '@radix-ui/react-icons';

const ProfilePopup = ({ children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const popupRef = useRef(null);
  const triggerRef = useRef(null);

  // Close popup when clicking outside
  useTouchOutside(popupRef, () => setIsOpen(false));

  // Close popup on Escape key press
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

  // Handle click on trigger element
  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    // For now, using a dummy route
    router.push('/profile');
  };

  const handleGantiKataSandiClick = () => {
    setIsOpen(false);
    setIsPasswordModalOpen(true);
  };

  const handleLogoutClick = async () => {
    try {
      const refresh = Cookies.get('refreshToken');
      if (refresh) {
        await logoutService({ refresh });
      }
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      toast.success('Anda telah logout');
      router.replace('/login');
    } catch (err) {
      // Even if API fails, ensure local logout
      Cookies.remove('token');
      Cookies.remove('refreshToken');
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
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserIcon size={18} className="mr-2" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleGantiKataSandiClick}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LockIcon size={18} className="mr-2" />
                  <span>Ganti Kata Sandi</span>
                </button>
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
      <ModalGantiKataSandi
        open={isPasswordModalOpen}
        setOpen={setIsPasswordModalOpen}
        onSubmit={handlePasswordSubmit}
      />
    </>
  );
};

export default ProfilePopup;
