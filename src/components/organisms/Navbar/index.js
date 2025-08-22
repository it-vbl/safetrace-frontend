'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';

import LogoLembaga from '@/components/atoms/LogoLembaga';
import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import ProfilePopup from '@/components/molecules/ProfilePopup';
import { setSidebarOpen } from '@/store/slices/app';
import { ChevronDownIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [name, setName] = useState('');

  const { sidebarOpen } = useSelector((state) => state.app);
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);

  const handleMenuClick = (menu) => {
    router.push(`${menu}`);
  };

  const getMenuClassName = (menu) => {
    return pathname === menu ? 'text-primary font-bold' : 'text-black';
  };

  useEffect(() => {
    setName(Cookies.get('fullName'));
  }, []);

  return (
    <div className='flex h-[72px] w-full flex-row items-center justify-between border-b border-b-gray-200 bg-white px-4'>
      {/* logo */}
      
      {/* Desktop: Show both logos */}
      <div className='flex flex-1 items-center'>
        <HamburgerMenuIcon
          onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
          className='mr-4 cursor-pointer'
          width={isMobileScreen ? 16 : 24}
          height={isMobileScreen ? 16 : 24}
        />
        <SipekebunLogo />
      </div>
      <div className="hidden md:!flex">
        <LogoLembaga />
      </div>

      {/* Desktop menu items */}
      <div className='ml-auto hidden md:!flex  flex-1 flex-row items-center justify-end gap-4 uppercase'>
        <div
          className={`cursor-pointer tracking-[1px] ${getMenuClassName('/mapview')}`}
          onClick={() => handleMenuClick('/')}
        >
          Map
        </div>
        <div
          className={`cursor-pointer tracking-[1px] ${getMenuClassName('/dashboard')}`}
          onClick={() => handleMenuClick('/dashboard')}
        >
          Dashboard
        </div>
        <div id='user' className='flex cursor-pointer flex-row items-center gap-2 font-bold'>
          <ProfilePopup>
            <div className='flex flex-row items-center gap-2'>
              {name} <ChevronDownIcon />
            </div>
          </ProfilePopup>
        </div>
      </div>

      {/* Mobile: Only show user profile */}
      <div className='ml-auto flex md:hidden flex-1 flex-row items-center justify-end gap-4'>
        <div id='user' className='flex cursor-pointer flex-row items-center gap-2 font-bold'>
          <ProfilePopup>
            <div className='flex text-[12px] sm:text-[16px] flex-row items-center text-right gap-2'>
              {name} <ChevronDownIcon />
            </div>
          </ProfilePopup>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
