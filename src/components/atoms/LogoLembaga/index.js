import Image from 'next/image';

import Logo1 from '@/assets/images/logo1.png';
import Logo2 from '@/assets/images/logo2.png';
import Logo3 from '@/assets/images/logo3.png';

export default function LogoLembaga({ size = 30, orientation = 'horizontal' }) {
  const directionClass = orientation === 'vertical' ? 'flex-col' : 'flex-row';
  return (
    <div className={`flex ${directionClass} items-center justify-center gap-4`}>
      <Image src={Logo1.src} width={size} height={size} alt='logo' />
      <Image src={Logo2.src} width={size} height={size} alt='logo' />
      <Image src={Logo3.src} width={size} height={size} alt='logo' />
    </div>
  );
}
