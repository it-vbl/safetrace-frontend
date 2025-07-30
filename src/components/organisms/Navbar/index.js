'use client';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Image from 'next/image';
import { ChevronDownIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import LogoLembaga from '@/components/atoms/LogoLembaga';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '@/store/slices/app';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { sidebarOpen } = useSelector((state) => state.app);

  const handleMenuClick = (menu) => {
    router.push(`${menu}`);
  };

  const getMenuClassName = (menu) => {
    return pathname === menu ? 'text-primary font-bold' : 'text-black';
  };

  return (
    <div className='flex h-[72px] w-full flex-row items-center border-b border-b-gray-200 bg-white px-4'>
      {/* logo */}
      <HamburgerMenuIcon
        onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
        className='mr-4 cursor-pointer '
        width={24}
        height={24}
      />
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
