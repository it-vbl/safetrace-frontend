'use client';

import { useMemo } from 'react';
import { DM_Sans } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

import Navbar from '@/components/organisms/Navbar';
import Sidebar from '@/components/organisms/Sidebar';
import { ReduxProvider } from '@/libs/redux/provider';

import '@/styles/globals.css';
import '@/styles/globals.css';

const DMSans = DM_Sans({
  subsets: ['latin'],
});

export default function Layout({ children }) {
  const pathname = usePathname();
  const noNavbarRoutes = [
    '/login',
    '/forgot-password',
    '/forgot-password/verify-otp',
    '/forgot-password/reset-password',
  ];
  const noSidebarRoutes = [
    '/login',
    '/forgot-password',
    '/forgot-password/verify-otp',
    '/forgot-password/reset-password',
    '/register',
    '/mapview',
  ];
  const noPaddingRoutes = [...noSidebarRoutes];

  const hideNavbar = useMemo(() => noNavbarRoutes.some((route) => pathname === route), [pathname]);
  const hideSidebar = useMemo(() => noSidebarRoutes.some((route) => pathname === route), [pathname]);
  const noPadding = useMemo(() => noPaddingRoutes.some((route) => pathname === route), [pathname]);

  return (
    <html lang='en' className={DMSans.className}>
      <title>SIPEKEBUN</title>
      <head>
        <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css' />
        <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css' />
      </head>
      <body>
        <ReduxProvider>
          {!hideNavbar && <Navbar />}
          <div className={`flex ${hideNavbar ? 'h-full' : 'h-[calc(100vh-72px)]'} flex-row`}>
            {!hideSidebar ? (
              <div className='h-full'>
                <Sidebar />
              </div>
            ) : null}
            <div className='flex flex-1 flex-col'>
              <div className={`flex flex-1 overflow-y-auto ${noPadding ? 'p-0' : 'p-8'}`}>{children}</div>
              <div id='action-button' />
            </div>
          </div>
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
