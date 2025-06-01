import { DM_Sans } from 'next/font/google';
import '@/styles/globals.css';

const DMSans = DM_Sans({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={DMSans.className}>
      <body>{children}</body>
    </html>
  );
}
