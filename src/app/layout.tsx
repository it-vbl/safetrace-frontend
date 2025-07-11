'use client';

import { DM_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import { ReduxProvider } from '@/libs/redux/provider';
import Sidebar from '@/components/organisms/Sidebar';
import { useMemo } from 'react';
import { ToastContainer } from 'react-toastify';

const DMSans = DM_Sans({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noNavbarRoutes = ['/login', '/register'];
  const noSidebarRoutes = ['/login', '/register', '/mapview'];
  const noPaddingRoutes = [...noSidebarRoutes];

  const hideNavbar = useMemo(() => noNavbarRoutes.some((route) => pathname === route), [pathname]);
  const hideSidebar = useMemo(() => noSidebarRoutes.some((route) => pathname === route), [pathname]);
  const noPadding = useMemo(() => noPaddingRoutes.some((route) => pathname === route), [pathname]);

  return (
    <html lang='en' className={DMSans.className}>
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
            <div className={`flex h-full flex-1 overflow-y-auto ${noPadding ? '' : 'p-8'}`}>{children}</div>
          </div>
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
