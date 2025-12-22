'use client';

import { useEffect, useMemo } from 'react';
import { DM_Sans } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import Navbar from '@/components/organisms/Navbar';
import Sidebar from '@/components/organisms/Sidebar';
import { MobileScreenProvider } from '@/components/providers/MobileScreenProvider';
import size from '@/constants/size';
import { ReduxProvider } from '@/libs/redux/provider';

import '@/styles/globals.css';
import '@/styles/globals.css';

const DMSans = DM_Sans({
  subsets: ['latin'],
});

// Inner component that can access Redux state
function LayoutContent({ children, hideNavbar, hideSidebar, noPadding }) {
  const { sidebarCollapsed, isMobileScreen, sidebarOpen } = useSelector(
    (state) => state.app
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div
        className={`flex  w-[100dvw] min-w-full max-w-full flex-1 overflow-x-clip ${
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
          className="flex w-full max-w-full flex-1 flex-col bg-slate-600 transition-all duration-300"
        >
          <div
            className={`flex max-w-full flex-1 overflow-y-auto bg-[#F7F9FD] ${
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

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
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
  const noPaddingRoutes = [...noSidebarRoutes, , '/stdb/ringkasan'];

  const publicRoutes = [
    '/login',
    '/forgot-password',
    '/forgot-password/verify-otp',
    '/forgot-password/reset-password',
    '/register',
  ];

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

  return (
    <html lang="en" className={DMSans.className}>
      <title>CUKK</title>
      <head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css"
        />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"
        />
      </head>
      <body>
        <ReduxProvider>
          <MobileScreenProvider>
            <LayoutContent
              hideNavbar={hideNavbar}
              hideSidebar={hideSidebar}
              noPadding={noPadding}
            >
              {children}
            </LayoutContent>
            <ToastContainer />
          </MobileScreenProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
