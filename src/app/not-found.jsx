import Link from 'next/link';

import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';

export default function NotFound() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Heading level={2} className="mb-1 text-lg font-bold">
        Halaman Tidak Ditemukan
      </Heading>
      <Paragraph level={3} className="mb-4 text-center text-sm text-gray-500">
        Maaf, halaman yang Anda cari tidak dapat ditemukan.
      </Paragraph>
      <Link
        href="/"
        className="rounded bg-primary px-4 py-2 text-white hover:bg-primaryDark4"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
