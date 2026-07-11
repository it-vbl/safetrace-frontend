'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';

import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import ProfilePopup from '@/components/molecules/ProfilePopup';
import { getCurrentUserRoles, hasAnyPermission, hasPermission } from '@/libs/permissions';
import { setSidebarOpen } from '@/store/slices/app';
import { ChevronDownIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [roles, setRoles] = useState([]);
  const [mounted, setMounted] = useState(false);

  const { sidebarOpen } = useSelector((state) => state.app);
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);

  const handleMenuClick = (menu) => {
    router.push(`${menu}`);
  };

  const getMenuClassName = (menu) => {
    const isActive = menu === '/' ? pathname === '/' : pathname.startsWith(menu);
    return isActive
      ? 'bg-primary text-white px-4 py-2 rounded-[4px] font-bold transition-all duration-300'
      : 'text-black hover:text-primary px-4 py-2 transition-all duration-300 rounded-lg hover:bg-neutral-50';
  };

  useEffect(() => {
    setName(Cookies.get('fullName'));
    const currentRoles = getCurrentUserRoles();
    setRoles(currentRoles);
    setMounted(true);
  }, []);

  const canSeeTraceability = mounted && hasAnyPermission(roles, [
    'petani.view',
    'kebun.view',
    'produksi.view',
    'pestisida.view',
    'pupuk.view',
    'limbah.view',
    'diklat.view',
    'pekerja.view',
    'laporan.view',
    'pengguna.view',
    'peta.view',
    'statistik.view',
    'sankey.view',
    'penjualan.view',
  ]);

  const canSeePeta = mounted && hasPermission(roles, 'peta.dashboard');

  return (
    <div className="relative z-50 flex h-[72px] w-full flex-row items-center justify-between border-b border-b-gray-200 bg-white px-4">
      {/* logo */}

      <div className="flex w-auto min-w-fit items-center md:flex-1">
        {pathname !== '/' && (
          <HamburgerMenuIcon
            onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
            className="mr-4 cursor-pointer"
            width={mounted && isMobileScreen ? 16 : 24}
            height={mounted && isMobileScreen ? 16 : 24}
          />
        )}
        <div className="cursor-pointer" onClick={() => handleMenuClick('/')}>
          <SipekebunLogo isNavbar={true} className="w-fit" />
        </div>
      </div>

      {/* Desktop center menu */}
      <div
        className="hidden flex-1 mx-2 flex-row items-center justify-center uppercase md:!flex"
        suppressHydrationWarning
      >
        {canSeeTraceability && (
          <>
            {canSeePeta && (
              <div
                className={`cursor-pointer text-[14px] tracking-[1px] ${getMenuClassName('/')}`}
                onClick={() => handleMenuClick('/')}
              >
                Peta
              </div>
            )}
            <div
              className={`cursor-pointer text-[14px] tracking-[1px] ${getMenuClassName(
                '/traceability'
              )}`}
              onClick={() => handleMenuClick('/traceability/petani')}
            >
              Petani
            </div>
          </>
        )}
      </div>

      {/* Mobile center menu */}
      <div
        className="flex flex-1 min-w-0 flex-row items-center justify-start px-4 mx-2 overflow-x-auto whitespace-nowrap text-[12px] font-bold uppercase md:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        suppressHydrationWarning
      >
        {canSeeTraceability && (
          <>
            {canSeePeta && (
              <div
                className={`cursor-pointer tracking-[1px] ${getMenuClassName('/')}`}
                onClick={() => handleMenuClick('/')}
              >
                Peta
              </div>
            )}
            <div
              className={`cursor-pointer tracking-[1px] ${getMenuClassName(
                '/traceability'
              )}`}
              onClick={() => handleMenuClick('/traceability/petani')}
            >
              Petani
            </div>
          </>
        )}
      </div>

      {/* Desktop menu items */}
      <div className="hidden flex-1 mx-2 flex-row items-center justify-end gap-4 uppercase md:!flex">
        <div
          id="user"
          className="flex cursor-pointer flex-row items-center gap-2 font-bold"
        >
          <ProfilePopup>
            <div
              className="flex flex-row items-center gap-2"
              suppressHydrationWarning
            >
              {mounted ? name : ''} <ChevronDownIcon />
            </div>
          </ProfilePopup>
        </div>
      </div>

      {/* Mobile: Only show user profile */}
      <div className="ml-auto flex w-auto flex-row items-center justify-end gap-2 md:hidden">
        <div
          id="user"
          className="flex cursor-pointer flex-row items-center gap-2 font-bold"
        >
          <ProfilePopup>
            <div className="flex flex-row items-center gap-2 text-right text-[12px] sm:text-[16px]">
              <ChevronDownIcon />
            </div>
          </ProfilePopup>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
