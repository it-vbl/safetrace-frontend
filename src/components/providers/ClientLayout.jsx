'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

import Navbar from '@/components/organisms/Navbar';
import Sidebar from '@/components/organisms/Sidebar';
import size from '@/constants/size';
import { initChunkErrorHandler } from '@/utils/chunkErrorHandler';

const noNavbarRoutes = [
  '/login',
  '/forgot-password',
  '/forgot-password/verify-otp',
  '/forgot-password/reset-password',
];
const noSidebarRoutes = [
  '/',
  '/login',
  '/forgot-password',
  '/forgot-password/verify-otp',
  '/forgot-password/reset-password',
  '/register',
];
const noPaddingRoutes = [...noSidebarRoutes];

const publicRoutes = [
  '/login',
  '/forgot-password',
  '/forgot-password/verify-otp',
  '/forgot-password/reset-password',
  '/register',
];

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { sidebarCollapsed, isMobileScreen, sidebarOpen } = useSelector(
    (state) => state.app
  );

  const hideNavbar = useMemo(
    () => noNavbarRoutes.some((route) => pathname === route),
    [pathname]
  );
  const hideSidebar = useMemo(
    () => noSidebarRoutes.some((route) => pathname === route),
    [pathname]
  );
  const noPadding = useMemo(
    () => noPaddingRoutes.some((route) => pathname === route),
    [pathname]
  );

  // Simple client-side auth guard
  useEffect(() => {
    const isPublic = publicRoutes.some((route) => pathname === route);
    const token = Cookies.get('token');
    if (!isPublic && !token) {
      router.replace('/login');
    }
  }, [pathname, router]);

  // Handle ChunkLoadError dynamically to recover from new deployments
  useEffect(() => {
    return initChunkErrorHandler();
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div
        className={`flex w-[100dvw] min-w-full max-w-full flex-1 overflow-x-clip ${
          hideNavbar ? 'h-full' : 'h-[calc(100vh-72px)]'
        } flex-row `}
      >
        {!hideSidebar ? <Sidebar /> : null}
        <div
          style={{
            width:
              hideSidebar || !sidebarOpen
                ? '100%'
                : `calc(100% - ${size.SIDEBAR_WIDTH}px)`,
          }}
          className="flex w-full max-w-full flex-1 flex-col bg-neutral-600 transition-all duration-300"
        >
          <div
            className={`flex max-w-full flex-1 overflow-y-auto bg-layoutBg ${
              noPadding ? 'p-0' : 'p-4 md:p-8'
            }`}
          >
            {children}
          </div>
          <div id="action-button" />
        </div>
      </div>
    </>
  );
}
