import Image from 'next/image';

import LogoSipekebun from '../../../../public/logo_sipekebun.png';
import { useSelector } from 'react-redux';

export default function SipekebunLogo({ className }) {
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
  return (
    <div className={`flex flex-1 text-[12px] sm:text-[16px] items-center font-bold tracking-widest ${className}`}>
      <Image src={LogoSipekebun} width={isMobileScreen ? 28 : 40} height={isMobileScreen ? 28 : 40} alt='logo' />
      SI<span className='text-primary'>PEKEBUN 2.0</span>
    </div>
  );
}
