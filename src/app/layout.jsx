import { DM_Sans } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import ClientLayout from '@/components/providers/ClientLayout';
import { MobileScreenProvider } from '@/components/providers/MobileScreenProvider';
import { ReduxProvider } from '@/libs/redux/provider';

import '@/styles/globals.css';

const DMSans = DM_Sans({
  subsets: ['latin'],
});

export const metadata = {
  title: 'SIP - Dashboard',
};

// Prevent Next.js Full Route Cache from setting s-maxage=31536000 on HTML.
// Without this, stale HTML is served after deploy causing ChunkLoadError 404.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Layout({ children }) {
  return (
    <html lang="en" className={DMSans.className} suppressHydrationWarning>
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
      <body suppressHydrationWarning>
        <ReduxProvider>
          <MobileScreenProvider>
            <ClientLayout>{children}</ClientLayout>
            <ToastContainer />
          </MobileScreenProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
