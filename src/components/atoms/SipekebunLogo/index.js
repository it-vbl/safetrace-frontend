import Image from 'next/image';
import { useSelector } from 'react-redux';

import LogoSipekebun from '../../../../public/keling-kumang-logo.png';

export default function SipekebunLogo({ className }) {
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
  return (
    <div
      className={`flex flex-1 items-center text-[12px] font-bold tracking-widest sm:text-[16px] ${className}`}
    >
      <Image src={LogoSipekebun} width="auto" height={42} alt="logo" />
    </div>
  );
}
