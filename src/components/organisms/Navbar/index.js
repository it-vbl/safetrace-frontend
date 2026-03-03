'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Cookies from 'js-cookie';
import { ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import ProfilePopup from '@/components/molecules/ProfilePopup';
import { getCurrentUserRoles, hasAnyPermission } from '@/libs/permissions';
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
    return pathname.startsWith(menu) ? 'text-primary font-bold' : 'text-black';
  };

  useEffect(() => {
    setName(Cookies.get('fullName'));
    const currentRoles = getCurrentUserRoles();
    setRoles(currentRoles);
    setMounted(true);
  }, []);

  const canSeeKabarTani = hasAnyPermission(roles, [
    'kontak.view',
    'grup.view',
    'blastpesan.view',
    'kirimpesan.view',
    'device.view',
  ]);

  const canSeeTraceability = hasAnyPermission(roles, [
    'petani.view',
    'kebun.view',
    'produksi.view',
    'pestisida.view',
    'pupuk.view',
    'limbah.view',
    'diklat.view',
    'pekerja.view',
    'pengguna.view',
    'peta.view',
    'statistik.view',
    'sankey.view',
    'penjualan.view',
  ]);

  return (
    <div className="flex h-[72px] w-full flex-row items-center justify-between border-b border-b-gray-200 bg-white px-4">
      {/* logo */}

      <div className="flex w-auto items-center md:flex-1">
        {pathname !== '/' && (
          <HamburgerMenuIcon
            onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
            className="mr-4 cursor-pointer"
            width={mounted && isMobileScreen ? 16 : 24}
            height={mounted && isMobileScreen ? 16 : 24}
          />
        )}
        <div>
          <SipekebunLogo />
        </div>
      </div>
      <div className="ml-auto hidden flex-1  flex-row items-center justify-center gap-4 uppercase md:!flex">
        {canSeeKabarTani && (
          <div
            className={`cursor-pointer tracking-[1px] ${getMenuClassName(
              '/kabar-tani/'
            )} `}
            onClick={() => handleMenuClick('/kabar-tani/kontak')}
          >
            Kabar Tani
          </div>
        )}
        {canSeeTraceability && (
          <>
            <div
              className={`cursor-pointer tracking-[1px] ${
                pathname === '/' ? 'font-bold text-primary' : 'text-black'
              }`}
              onClick={() => handleMenuClick('/')}
            >
              MapView
            </div>
            <div
              className={`cursor-pointer tracking-[1px] ${getMenuClassName(
                '/traceability'
              )}`}
              onClick={() => handleMenuClick('/traceability/petani')}
            >
              Traceability
            </div>
          </>
        )}
        {/* <div
          className={`cursor-pointer tracking-[1px] ${getMenuClassName(
            '/koperasi'
          )}`}
          onClick={() => handleMenuClick('/koperasi')}
        >
          Koperasi
        </div> */}
      </div>

      {/* Mobile center menu */}
      <div
        className="ml-auto flex flex-1 flex-row items-center justify-center gap-2 overflow-x-auto whitespace-nowrap text-[12px] uppercase md:hidden"
        suppressHydrationWarning
      >
        {canSeeKabarTani && (
          <div
            className={`cursor-pointer tracking-[1px] ${getMenuClassName(
              '/kabar-tani/'
            )}`}
            onClick={() => handleMenuClick('/kabar-tani/kontak')}
          >
            Kabar Tani
          </div>
        )}
        {canSeeTraceability && (
          <>
            <div
              className={`cursor-pointer tracking-[1px] ${
                pathname === '/' ? 'font-bold text-primary' : 'text-black'
              }`}
              onClick={() => handleMenuClick('/')}
            >
              MapView
            </div>
            <div
              className={`cursor-pointer tracking-[1px] ${getMenuClassName(
                '/traceability'
              )}`}
              onClick={() => handleMenuClick('/traceability/petani')}
            >
              Traceability
            </div>
          </>
        )}
        <div
          className={`cursor-pointer tracking-[1px] ${getMenuClassName(
            '/koperasi'
          )}`}
          onClick={() => handleMenuClick('/koperasi')}
        >
          Koperasi
        </div>
      </div>

      {/* Desktop menu items */}
      <div className="ml-auto hidden flex-1  flex-row items-center justify-end gap-4 uppercase md:!flex">
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
