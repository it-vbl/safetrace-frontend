import Image from 'next/image';
import { useSelector } from 'react-redux';

import LogoSipekebun from '../../../../public/keling-kumang-logo.png';

export default function SipekebunLogo({ className }) {
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
  return (
    <div
      className={`flex flex-1 text-[12px] sm:text-[16px] items-center font-bold tracking-widest ${className}`}
    >
      <Image src={LogoSipekebun} width="auto" height={42} alt="logo" />
    </div>
  );
}
