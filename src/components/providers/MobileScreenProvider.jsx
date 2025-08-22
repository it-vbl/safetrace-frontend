'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsMobileScreen } from '@/store/slices/app';

export const MobileScreenProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkMobile = () => {
      dispatch(setIsMobileScreen(window.innerWidth < 768));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  return children;
};
