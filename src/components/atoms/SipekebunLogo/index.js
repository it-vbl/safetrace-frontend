import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import LogoSipekebun from '../../../../public/keling-kumang-logo.png';
import SistemInformasiPetani from '../../../../public/sistem-informasi-petani.png'
import SistemInformasiPetaniMobile from '../../../../public/sistem-informasi-petani-mobile.png'

export default function SipekebunLogo({ className, isNavbar = false }) {
  const [mounted, setMounted] = useState(false);
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`flex flex-1 items-center text-[12px] font-bold tracking-widest sm:text-[16px] ${className}`}
    >
      <Image 
        src={isNavbar ? (mounted && isMobileScreen ? SistemInformasiPetaniMobile : SistemInformasiPetani) : LogoSipekebun} 
        width="auto" 
        height={isNavbar ? (mounted && isMobileScreen ? 32 : 16) : 42} 
        alt="logo" 
      />
    </div>
  );
}