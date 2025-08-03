import React, { useEffect,useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { createPortal } from 'react-dom';

import LogoutIcon from '@/assets/icons/logout';
import ProfileIcon from '@/assets/icons/profile';
import useTouchOutside from '@/hooks/useTouchOutside';

const ProfilePopup = ({ children }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
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
  
  const handleLogoutClick = () => {
    try{
      Cookies.remove('token');
      router.replace('/login')
    } catch(err) {
      console.log(err);
    }
  };
  
  // Calculate position for the popup
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
  
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      setPopupPosition({
        top: triggerRect.bottom,
        right: window.innerWidth - triggerRect.right
      });
    }
  }, [isOpen]);
  
  return (
    <div className="relative" ref={triggerRef} onClick={handleTriggerClick}>
      {children}
      {isOpen && createPortal(
        <div 
          className="fixed z-[1000] w-48 rounded-md bg-white shadow-lg z-50 border border-gray-200"
          ref={popupRef}
          style={{
            top: `${popupPosition.top + 8}px`,
            right: `${popupPosition.right}px`
          }}
        >
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ProfileIcon size={18} className="mr-2" />
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogoutClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogoutIcon size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProfilePopup;
