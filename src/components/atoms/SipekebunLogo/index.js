import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import assets from '@/config/assets';

export default function SipekebunLogo({ className, isNavbar = false }) {
  const [mounted, setMounted] = useState(false);
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = isNavbar
    ? mounted && isMobileScreen
      ? assets.navbar.logoMobile
      : assets.navbar.logo
    : assets.navbar.logoCompact;

  return (
    <div
      className={`flex flex-1 items-center text-[12px] font-bold tracking-widest sm:text-[16px] ${className}`}
    >
      <Image
        src={logoSrc}
        width={200}
        height={isNavbar ? (mounted && isMobileScreen ? 32 : 16) : 42}
        alt="logo"
        style={{ width: 'auto', height: isNavbar ? (mounted && isMobileScreen ? 32 : 16) : 42 }}
      />
    </div>
  );
}
