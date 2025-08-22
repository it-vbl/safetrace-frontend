import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { IoHome, IoHomeOutline, IoSettings } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';

import LogoLembaga from '@/components/atoms/LogoLembaga';
import SipekebunLogo from '@/components/atoms/SipekebunLogo';
import { Date } from '@/assets/icons/index';
import size from '@/constants/size';
import { ChevronDownIcon, ChevronUpIcon, DashboardIcon } from '@radix-ui/react-icons';
import { setSidebarOpen } from '@/store/slices/app';
import { useMobileScreen } from '@/hooks/useMobileScreen';

const Sidebar = ({ isMobile = false, isSidebarOpen, width }) => {
  const storedValue = Cookies.get('storeProfile');
  const profile = storedValue ? JSON.parse(storedValue) : null;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isSubMenuOpened, setIsSubMenuOpened] = useState(false);
  const { sidebarOpen } = useSelector((state) => state.app);
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
  const dispatch = useDispatch();

  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      label: 'Mapview',
      icon: DashboardIcon,
      path: '/mapview',
      mobileOnly: true,
    },
    {
      label: 'Analisis',
      icon: DashboardIcon,
      path: '/dashboard',
    },
    {
      label: 'Database',
      icon: IoHomeOutline,
      path: '/database',
      subMenu: [
        {
          label: 'Ringkasan',
          path: '/stdb/ringkasan',
        },
        {
          label: 'Pendataan',
          path: '/stdb/pendataan',
        },
        {
          label: 'Verifikasi',
          path: '/stdb/verifikasi',
        },
        {
          label: 'Tidak Terbit',
          path: '/stdb/tidak-terbit',
        },
        {
          label: 'Penerbitan',
          path: '/stdb/penerbitan',
        },
        {
          label: 'Data Terbit',
          path: '/stdb/data-terbit',
        },
        {
          label: 'Data Berakhir',
          path: '/stdb/data-berakhir',
        },
      ],
    },
    {
      label: 'Pengaturan',
      icon: IoSettings, // Make sure to import or define this icon
      path: '/settings',
      subMenu: [
        {
          label: 'Pengguna',
          //   icon: IoPersonCircleOutline, // Make sure to import or define this icon
          path: '/settings/users',
        },
        {
          label: 'Hak Akses',
          //   icon: IoKeyOutline, // Make sure to import or define this icon
          path: '/settings/hak-akses',
        },
        {
          label: 'Peta Overlay',
          //   icon: IoMapOutline, // Make sure to import or define this icon
          path: '/settings/peta-overlay',
        },
      ],
    },
  ];

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenSubMenu(null);
    }
  };

  const handleSubMenuToggle = (label) => {
    setOpenSubMenu((prev) => (prev === label && !isCollapsed ? null : label));
    setIsSubMenuOpened(label === openSubMenu ? !isSubMenuOpened : true);
  };

  const handleMenuItemClick = (path) => {
    if (path) {
      router.push(path);
      setIsSubMenuOpened(false);
      if(isMobileScreen) {
        dispatch(setSidebarOpen(false));
      }
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileScreen && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      
      <div
        style={{ 
          width: (isMobileScreen && !sidebarOpen) || !sidebarOpen ? 0 : `${size.SIDEBAR_WIDTH}px`,
          transform: isMobileScreen && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)'
        }}
        className={`fixed left-0 top-0 h-full overflow-x-hidden transition-all duration-300 bg-white z-50 ${
          isMobileScreen ? 'shadow-lg' : 'relative'
        } ${(isMobileScreen && !sidebarOpen) || !sidebarOpen ? 'opacity-0' : 'opacity-100'}`}
      >
        <div
          className='bg-primary700 flex h-full flex-col border-r border-r-gray-200 px-4 pt-8 text-white'
          style={{
            width: isCollapsed ? size.SIDEBAR_WIDTH_COLLAPSED : size.SIDEBAR_WIDTH,
          }}
          id='sidebar'
        >
        
        {/* Mobile: Show LogoLembaga and SipekebunLogo at the top */}
        {isMobileScreen && (
          <div className="mb-6 flex flex-col self-center">
            <LogoLembaga />
          </div>
        )}

        {menuItems
          .filter(item => !item.mobileOnly || isMobileScreen)
          .map((item, index) => {
            const isActive =
              pathname === item?.path ||
              (item?.subMenu && item?.subMenu?.some((sub) => pathname?.includes(sub?.path))) ||
              pathname?.includes(item?.label?.replaceAll(' ', '-')?.toLowerCase());
            return (
              <div key={index}>
                <div
                  className={`mb-2 flex cursor-pointer items-center p-2 ${
                    isActive ? 'bg-primary text-white' : 'text-gray-900'
                  } w-full rounded font-medium ${isCollapsed ? 'justify-center' : 'justify-normal'} relative`}
                  onClick={() => (item.subMenu ? handleSubMenuToggle(item.label) : handleMenuItemClick(item.path))}
                >
                  <item.icon alt={item.label} className='h-[20px] w-[20px]' />
                  {!isCollapsed && <span className='ml-4 text-[14px] uppercase leading-[18px]'>{item.label}</span>}
                  {!isCollapsed &&
                    item.subMenu &&
                    (openSubMenu === item.label ? (
                      <ChevronUpIcon className='ml-auto' />
                    ) : (
                      <ChevronDownIcon className='ml-auto' />
                    ))}
                </div>
                {!isCollapsed && item.subMenu && openSubMenu === item.label && (
                  <div className='pl-8'>
                    {item?.subMenu?.map(
                      (subItem, subIndex) =>
                        subItem && (
                          <div
                            key={subIndex}
                            className={`mb-2 ml-1 flex cursor-pointer items-center p-2 ${
                              pathname?.includes(subItem?.path) ? 'text-primary' : 'text-gray-400'
                            } hover:bg-primary500 rounded font-medium`}
                            onClick={() => handleMenuItemClick(subItem?.path)}
                          >
                            <span className='text-[14px] leading-[18px]'>{subItem?.label}</span>
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        {menuItems
          .filter((item) => item.subMenu)
          .map((item) => {
            return (
              isCollapsed &&
              (isSubMenuOpened ? openSubMenu === item.label : isSubMenuOpened) && (
                <div className='absolute left-[89px] top-[13%] z-50 w-max rounded bg-[#222636] p-2 shadow-lg'>
                  {menuItems
                    .filter((item) => item.subMenu && openSubMenu === item.label)
                    .flatMap((item) => item.subMenu)
                    .map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className={`mb-2 flex cursor-pointer items-center p-2 ${
                          pathname?.includes(subItem?.path) ? 'text-white' : 'text-gray-400'
                        } rounded hover:bg-[#151A2D]`}
                        onClick={() => handleMenuItemClick(subItem?.path)}
                      >
                        <span>{subItem.label}</span>
                      </div>
                    ))}
                </div>
              )
            );
          })}
        {!isMobileScreen && (
          <div
            className={`mt-auto flex cursor-pointer items-center p-2 ${
              isCollapsed ? 'hover:bg-[#151A2D]' : 'hover:bg-[#151A2D]'
            } rounded ${isCollapsed ? 'justify-center' : 'justify-normal'}`}
            onClick={handleCollapse}
          >
            <Date className={`${isCollapsed ? 'rotate-180' : ''}`} />
            {!isCollapsed && <span className='ml-4 text-[14px] leading-[18px]'>{'test'}</span>}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Sidebar;
