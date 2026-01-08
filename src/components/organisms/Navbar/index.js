'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import Cookies from 'js-cookie';
import { ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

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
  const [mounted, setMounted] = useState(false);
  const [isTraceabilityDropdownOpen, setIsTraceabilityDropdownOpen] =
    useState(false);
  const [
    isTraceabilityDropdownOpenMobile,
    setIsTraceabilityDropdownOpenMobile,
  ] = useState(false);
  const traceabilityDropdownRef = useRef(null);
  const traceabilityDropdownRefMobile = useRef(null);

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
    setMounted(true);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        traceabilityDropdownRef.current &&
        !traceabilityDropdownRef.current.contains(event.target)
      ) {
        setIsTraceabilityDropdownOpen(false);
      }
      if (
        traceabilityDropdownRefMobile.current &&
        !traceabilityDropdownRefMobile.current.contains(event.target)
      ) {
        setIsTraceabilityDropdownOpenMobile(false);
      }
    }

    if (isTraceabilityDropdownOpen || isTraceabilityDropdownOpenMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTraceabilityDropdownOpen, isTraceabilityDropdownOpenMobile]);

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
        <div
          className={`cursor-pointer tracking-[1px] ${getMenuClassName(
            '/kabar-tani/'
          )} `}
          onClick={() => handleMenuClick('/kabar-tani/kontak')}
        >
          Kabar Tani
        </div>
        <div
          className="relative overflow-y-visible"
          ref={traceabilityDropdownRef}
        >
          <div
            className={`cursor-pointer flex flex-row items-center gap-2 tracking-[1px] ${getMenuClassName(
              '/traceability'
            )} ${pathname == '/' ? 'text-primary font-bold' : 'text-black'}`}
            onClick={() =>
              setIsTraceabilityDropdownOpen(!isTraceabilityDropdownOpen)
            }
          >
            <span>Traceability</span>
            <ChevronDown size={16} />
          </div>
          {isTraceabilityDropdownOpen && (
            <div className="absolute left-0 top-full left-[50%] -translate-x-[50%] z-[999] mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-50">
              <div
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                  pathname === '/' ? 'text-primary font-bold' : 'text-black'
                }`}
                onClick={() => {
                  handleMenuClick('/');
                  setIsTraceabilityDropdownOpen(false);
                }}
              >
                MapView
              </div>
              <div
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                  pathname.startsWith('/traceability')
                    ? 'text-primary font-bold'
                    : 'text-black'
                }`}
                onClick={() => {
                  handleMenuClick('/traceability/petani');
                  setIsTraceabilityDropdownOpen(false);
                }}
              >
                Traceability
              </div>
            </div>
          )}
        </div>
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
        <div
          className={`cursor-pointer tracking-[1px] ${getMenuClassName(
            '/kabar-tani/'
          )}`}
          onClick={() => handleMenuClick('/kabar-tani/kontak')}
        >
          Kabar Tani
        </div>
        <div className="relative" ref={traceabilityDropdownRefMobile}>
          <div
            className={`cursor-pointer tracking-[1px] flex flex-row items-center gap-1 ${getMenuClassName(
              '/traceability'
            )} ${pathname == '/' ? 'text-primary font-bold' : 'text-black'}`}
            onClick={() =>
              setIsTraceabilityDropdownOpenMobile(
                !isTraceabilityDropdownOpenMobile
              )
            }
          >
            <span>Traceability</span>
            <ChevronDown size={12} />
          </div>
          {isTraceabilityDropdownOpenMobile && (
            <div className="absolute left-0 top-full mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg z-[9999]">
              <div
                className={`cursor-pointer px-3 py-2 text-xs hover:bg-gray-100 ${
                  pathname === '/' ? 'text-primary font-bold' : 'text-black'
                }`}
                onClick={() => {
                  handleMenuClick('/');
                  setIsTraceabilityDropdownOpenMobile(false);
                }}
              >
                MapView
              </div>
              <div
                className={`cursor-pointer px-3 py-2 text-xs hover:bg-gray-100 ${
                  pathname.startsWith('/traceability')
                    ? 'text-primary font-bold'
                    : 'text-black'
                }`}
                onClick={() => {
                  handleMenuClick('/traceability/petani');
                  setIsTraceabilityDropdownOpenMobile(false);
                }}
              >
                Traceability
              </div>
            </div>
          )}
        </div>
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
