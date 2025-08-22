import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setIsMobileScreen } from '@/store/slices/app';

export const useMobileScreen = () => {
  const dispatch = useDispatch();
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);

  useEffect(() => {
    const checkMobile = () => {
      dispatch(setIsMobileScreen(window.innerWidth < 768));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  return isMobileScreen;
};
