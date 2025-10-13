import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  ChevronRight,
  ContactIcon,
  Flag,
  FlagIcon,
  FlagOffIcon,
  FolderIcon,
  MapIcon,
  MedalIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  PieChart,
  Smartphone,
  User2Icon,
  UserCheck2Icon,
  UserCircle2Icon,
  UsersIcon,
} from 'lucide-react';
import { IoHomeOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import LogoLembaga from '@/components/atoms/LogoLembaga';
import size from '@/constants/size';
import { setSidebarCollapsed, setSidebarOpen } from '@/store/slices/app';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DashboardIcon,
} from '@radix-ui/react-icons';

const Sidebar = ({ isMobile = false, isSidebarOpen, width }) => {
  const storedValue = Cookies.get('storeProfile');
  const profile = storedValue ? JSON.parse(storedValue) : null;
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isSubMenuOpened, setIsSubMenuOpened] = useState(false);
  const { sidebarOpen, sidebarCollapsed } = useSelector((state) => state.app);
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
  const dispatch = useDispatch();

  const router = useRouter();
  const pathname = usePathname();

  const menuConfig = {
    traceability: [
      {
        label: 'Statistik',
        icon: PieChart,
        subMenu: [
          { label: 'Anggota', path: '/traceability/statistik/anggota' },
          {
            label: 'Traceability',
            path: '/traceability/statistik/traceability',
          },
        ],
      },
      {
        label: 'Petani',
        icon: UserCircle2Icon,
        path: '/traceability/petani',
      },
      {
        label: 'Kebun',
        icon: MapIcon,
        path: '/traceability/kebun',
      },
      {
        label: 'GAP',
        icon: Flag,
        subMenu: [
          { label: 'PRODUKSI', path: '/traceability/gap/produksi' },
          {
            label: 'PESTISIDA',
            path: '/traceability/gap/pestisida',
          },
          {
            label: 'PUPUK',
            path: '/traceability/gap/pupuk',
          },
          {
            label: 'LB3',
            path: '/traceability/gap/lb3',
          },
        ],
      },
      {
        label: 'Diklat',
        icon: MedalIcon,
        path: '/traceability/diklat',
      },
      {
        label: 'Pekerja',
        icon: UsersIcon,
        path: '/traceability/pekerja',
      },
    ],
    'kabar-tani': [
      {
        label: 'Kontak',
        icon: ContactIcon,
        path: '/kabar-tani/kontak',
      },
      {
        label: 'Grup',
        icon: FolderIcon,
        path: '/kabar-tani/grup',
      },
      {
        label: 'Blast Pesan',
        icon: MegaphoneIcon,
        path: '/kabar-tani/blast-pesan',
      },
      {
        label: 'Kirim Pesan',
        icon: MessageSquareIcon,
        path: '/kabar-tani/kirim-pesan',
      },
      {
        label: 'Device',
        icon: Smartphone,
        path: '/kabar-tani/device',
      },
    ],
    koperasi: [
      {
        label: 'Dummy Menu 1',
        icon: DashboardIcon,
        path: '/koperasi/dummy1',
      },
      {
        label: 'Dummy Menu 2',
        icon: IoHomeOutline,
        path: '/koperasi/dummy2',
      },
      {
        label: 'Dummy Menu 3',
        icon: IoHomeOutline,
        path: '/koperasi/dummy3',
      },
    ],
  };

  const currentMainMenu = useMemo(() => {
    if (pathname.startsWith('/traceability')) return 'traceability';
    if (pathname.startsWith('/kabar-tani')) return 'kabar-tani';
    if (pathname.startsWith('/koperasi')) return 'koperasi';
    return 'traceability';
  }, [pathname]);

  const menuItems = menuConfig[currentMainMenu] || [];

  const handleCollapse = () => {
    dispatch(setSidebarCollapsed(!sidebarCollapsed));
    if (!sidebarCollapsed) {
      setOpenSubMenu(null);
    }
  };

  const handleSubMenuToggle = (label) => {
    setOpenSubMenu((prev) =>
      prev === label && !sidebarCollapsed ? null : label
    );
    setIsSubMenuOpened(label === openSubMenu ? !isSubMenuOpened : true);
  };

  const handleMenuItemClick = (path) => {
    if (path) {
      router.push(path);
      setIsSubMenuOpened(false);
      if (isMobileScreen) {
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
          width:
            (isMobileScreen && !sidebarOpen) || !sidebarOpen
              ? 0
              : sidebarCollapsed
              ? `${size.SIDEBAR_WIDTH_COLLAPSED}px`
              : `${size.SIDEBAR_WIDTH}px`,
          transform:
            isMobileScreen && !sidebarOpen
              ? 'translateX(-100%)'
              : 'translateX(0)',
        }}
        className={`fixed left-0 top-0 z-50 h-full overflow-x-hidden bg-white transition-all duration-300 ${
          isMobileScreen ? 'shadow-lg' : 'relative'
        } ${
          (isMobileScreen && !sidebarOpen) || !sidebarOpen
            ? 'opacity-0'
            : 'opacity-100'
        }`}
      >
        <div
          className="bg-primary700 flex h-full flex-col border-r border-r-gray-200 px-4 pt-8 text-white"
          style={{
            width: sidebarCollapsed
              ? size.SIDEBAR_WIDTH_COLLAPSED
              : size.SIDEBAR_WIDTH,
          }}
          id="sidebar"
        >
          {/* Mobile: Show LogoLembaga and SipekebunLogo at the top */}
          {isMobileScreen && (
            <div className="mb-6 flex flex-col self-center">
              <LogoLembaga />
            </div>
          )}

          {menuItems
            .filter((item) => !item.mobileOnly || isMobileScreen)
            .map((item, index) => {
              const isActive =
                pathname === item?.path ||
                (item?.subMenu &&
                  item?.subMenu?.some((sub) =>
                    pathname?.includes(sub?.path)
                  )) ||
                pathname?.includes(
                  item?.label?.replaceAll(' ', '-')?.toLowerCase()
                );
              return (
                <div key={item.label || item.path || index}>
                  <div
                    className={`mb-2 flex cursor-pointer items-center p-2 ${
                      isActive ? 'bg-primary text-white' : 'text-gray-900'
                    } w-full rounded font-medium ${
                      sidebarCollapsed ? 'justify-center' : 'justify-normal'
                    } relative`}
                    onClick={() =>
                      item.subMenu
                        ? handleSubMenuToggle(item.label)
                        : handleMenuItemClick(item.path)
                    }
                  >
                    <item.icon alt={item.label} className="h-[20px] w-[20px]" />
                    {!sidebarCollapsed && (
                      <span className="ml-4 text-[14px] uppercase leading-[18px]">
                        {item.label}
                      </span>
                    )}
                    {!sidebarCollapsed &&
                      item.subMenu &&
                      (openSubMenu === item.label ? (
                        <ChevronUpIcon className="ml-auto" />
                      ) : (
                        <ChevronDownIcon className="ml-auto" />
                      ))}
                  </div>
                  {!sidebarCollapsed &&
                    item.subMenu &&
                    openSubMenu === item.label && (
                      <div className="pl-8">
                        {item?.subMenu?.map(
                          (subItem, subIndex) =>
                            subItem && (
                              <div
                                key={subItem.label || subItem.path || subIndex}
                                className={`mb-2 ml-1 flex cursor-pointer items-center p-2 ${
                                  pathname?.includes(subItem?.path)
                                    ? 'text-primary'
                                    : 'text-gray-400'
                                } hover:bg-primary500 rounded font-medium`}
                                onClick={() =>
                                  handleMenuItemClick(subItem?.path)
                                }
                              >
                                <span className="text-[14px] leading-[18px]">
                                  {subItem?.label}
                                </span>
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
                sidebarCollapsed &&
                (isSubMenuOpened
                  ? openSubMenu === item.label
                  : isSubMenuOpened) && (
                  <div
                    key={item.label}
                    className="absolute left-[89px] top-[13%] z-50 w-max rounded bg-[#222636] p-2 shadow-lg"
                  >
                    {menuItems
                      .filter(
                        (item) => item.subMenu && openSubMenu === item.label
                      )
                      .flatMap((item) => item.subMenu)
                      .map((subItem, subIndex) => (
                        <div
                          key={subItem.label || subItem.path || subIndex}
                          className={`mb-2 flex cursor-pointer items-center p-2 ${
                            pathname?.includes(subItem?.path)
                              ? 'text-white'
                              : 'text-gray-400'
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
              onClick={handleCollapse}
              className={`mb-10 mt-auto flex cursor-pointer items-center rounded-[4px] p-2 transition-all duration-200 hover:bg-gray-100 ${
                sidebarCollapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              {!sidebarCollapsed && (
                <span className="text-sm font-medium text-black">COLLAPSE</span>
              )}
              <ChevronRight
                size={20}
                color="black"
                className={`transition-transform duration-200 ${
                  sidebarCollapsed ? '' : 'rotate-180'
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
