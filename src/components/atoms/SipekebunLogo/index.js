import Image from 'next/image';
import LogoSipekebun from '../../../../public/logo_sipekebun.png';

export default function SipekebunLogo({ className }) {
  return (
    <div className={`flex flex-1 items-center font-bold tracking-widest ${className}`}>
      <Image src={LogoSipekebun} width={40} height={40} alt='logo' />
      SI<span className='text-primary'>PEKEBUN 2.0</span>
    </div>
  );
}
