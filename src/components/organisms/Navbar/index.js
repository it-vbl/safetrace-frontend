'use client';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Image from 'next/image';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import LogoLembaga from '@/components/atoms/LogoLembaga';
import { useRouter, usePathname } from 'next/navigation';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = (menu) => {
    router.push(`${menu}`);
  };

  const getMenuClassName = (menu) => {
    return pathname === menu ? 'text-primary font-bold' : 'text-black';
  };

  return (
    <div className='flex h-[72px] w-full flex-row items-center border-b border-b-gray-200 bg-white px-4'>
      {/* logo */}
      <SipekebunLogo />
      <LogoLembaga />
      <div className='ml-auto flex flex-1 flex-row items-center justify-end gap-4 uppercase'>
        <div
          className={`cursor-pointer tracking-[1px] ${getMenuClassName('/mapview')}`}
          onClick={() => handleMenuClick('/mapview')}
        >
          Map
        </div>
        <div
          className={`cursor-pointer tracking-[1px] ${getMenuClassName('/dashboard')}`}
          onClick={() => handleMenuClick('/dashboard')}
        >
          Dashboard
        </div>
        <div className='flex flex-row items-center gap-2 font-bold'>
          Fajar Sukmara <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
