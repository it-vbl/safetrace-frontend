import Image from 'next/image';

import assets from '@/config/assets';

export default function LogoLembaga({ size = 30, orientation = 'horizontal' }) {
  const directionClass = orientation === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={`flex ${directionClass} items-center justify-center gap-4`}>
      {assets.sidebar.institutionalLogos.map((logoSrc) => (
        <Image
          key={logoSrc}
          src={logoSrc}
          width={size}
          height={size}
          alt="logo"
        />
      ))}
    </div>
  );
}
