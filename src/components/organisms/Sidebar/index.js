'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  ChartLineIcon,
  ChevronRight,
  ContactIcon,
  Flag,
  FolderIcon,
  MapIcon,
  MedalIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  PieChart,
  Smartphone,
  TrendingUp,
  UserCircle2Icon,
  UsersIcon} from 'lucide-react';
import { IoHomeOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import LogoLembaga from '@/components/atoms/LogoLembaga';
import size from '@/constants/size';
import { getCurrentUserRoles, hasPermission } from '@/libs/permissions';
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

  const [mounted, setMounted] = useState(false);
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobileClient = mounted && isMobileScreen;

  const [tooltipLabel, setTooltipLabel] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const showTooltip = (label, targetEl) => {
    setTooltipLabel(label);
    setTooltipVisible(true);
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const x = Math.round(rect.right + 4);
      const y = Math.round(rect.top + rect.height * -1.5);
      setTooltipPos({ x, y });
    }
  };
  const hideTooltip = () => {
    setTooltipVisible(false);
    setTooltipLabel(null);
  };
  const startTouchTooltip = (label, targetEl) => {
    if (!isMobileScreen) return;
    if (pressTimer) clearTimeout(pressTimer);
    showTooltip(label, targetEl);
    const t = setTimeout(() => {
      hideTooltip();
    }, 1200);
    setPressTimer(t);
  };
  const endTouchTooltip = () => {
    if (pressTimer) clearTimeout(pressTimer);
    setPressTimer(null);
    hideTooltip();
  };

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentRoles = getCurrentUserRoles();
    setRoles(currentRoles);
  }, []);

  const canAccess = (permissionKey) => {
    if (!permissionKey) return true;
    return hasPermission(roles, permissionKey);
  };

  const menuConfig = {
    traceability: [
      {
        label: 'Dashboard',
        icon: PieChart,
        permission: null,
        subMenu: [
          {
            label: 'Statistik',
            path: '/traceability/dashboard/statistik',
            permission: 'statistik.view',
          },
          {
            label: 'Sankey',
            path: '/traceability/dashboard/sankey',
            permission: 'sankey.view',
          },
        ],
      },
      {
        label: 'Petani',
        icon: UserCircle2Icon,
        path: '/traceability/petani',
        permission: 'petani.view',
      },
      {
        label: 'Kebun',
        icon: MapIcon,
        path: '/traceability/kebun',
        permission: 'kebun.view',
      },
      {
        label: 'Penjualan',
        icon: TrendingUp,
        path: '/traceability/penjualan',
        permission: 'penjualan.view',
      },
      {
        label: 'GAP',
        icon: Flag,
        permission: null,
        subMenu: [
          {
            label: 'PRODUKSI',
            path: '/traceability/gap/produksi',
            permission: 'produksi.view',
          },
          {
            label: 'PESTISIDA',
            path: '/traceability/gap/pestisida',
            permission: 'pestisida.view',
          },
          {
            label: 'PUPUK',
            path: '/traceability/gap/pupuk',
            permission: 'pupuk.view',
          },
          {
            label: 'LB3',
            path: '/traceability/gap/lb3',
            permission: 'limbah.view',
          },
        ],
      },
      {
        label: 'Diklat',
        icon: MedalIcon,
        path: '/traceability/diklat',
        permission: 'diklat.view',
      },
      {
        label: 'Pekerja',
        icon: UsersIcon,
        path: '/traceability/pekerja',
        permission: 'pekerja.view',
      },
      {
        label: 'Laporan',
        icon: ChartLineIcon,
        path: '/traceability/laporan',
        permission: 'laporan.view',
      },
    ],
    'kabar-tani': [
      {
        label: 'Kontak',
        icon: ContactIcon,
        path: '/kabar-tani/kontak',
        permission: 'kontak.view',
      },
      {
        label: 'Grup',
        icon: FolderIcon,
        path: '/kabar-tani/grup',
        permission: 'grup.view',
      },
      {
        label: 'Blast Pesan',
        icon: MegaphoneIcon,
        path: '/kabar-tani/blast-pesan',
        permission: 'blastpesan.view',
      },
      {
        label: 'Kirim Pesan',
        icon: MessageSquareIcon,
        path: '/kabar-tani/kirim-pesan',
        permission: 'kirimpesan.view',
      },
      {
        label: 'Device',
        icon: Smartphone,
        path: '/kabar-tani/device',
        permission: 'device.view',
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

  const rawMenuItems = menuConfig[currentMainMenu] || [];

  const menuItems = useMemo(() => {
    // Filter main items by permission
    const filtered = rawMenuItems
      .map((item) => {
        // Handle items with submenus: filter submenus too
        if (item.subMenu && Array.isArray(item.subMenu)) {
          const filteredSub = item.subMenu.filter((sub) =>
            canAccess(sub.permission)
          );
          if (!filteredSub.length) {
            return null;
          }
          return { ...item, subMenu: filteredSub };
        }

        // Simple item: check its permission (if any)
        return canAccess(item.permission) ? item : null;
      })
      .filter(Boolean);

    return filtered;
  }, [rawMenuItems, roles]);

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
      {isMobileClient && sidebarOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 top-[72px] z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <div
        style={{
          width:
            (isMobileClient && !sidebarOpen) || !sidebarOpen
              ? 0
              : sidebarCollapsed
                ? `${size.SIDEBAR_WIDTH_COLLAPSED}px`
                : `${size.SIDEBAR_WIDTH}px`,
          transform:
            isMobileClient && !sidebarOpen
              ? 'translateX(-100%)'
              : 'translateX(0)',
        }}
        className={`z-50 flex h-full flex-shrink-0 bg-white transition-all duration-300 ${isMobileClient ? 'shadow-lg' : 'relative'
          } ${(isMobileClient && !sidebarOpen) || !sidebarOpen
            ? 'pointer-events-none overflow-hidden opacity-0'
            : 'overflow-visible opacity-100'
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
          {/* Mobile: Show LogoLembaga at the top */}
          {isMobileClient && (
            <div className="mb-6 flex flex-col self-center">
              <LogoLembaga
                orientation={sidebarCollapsed ? 'vertical' : 'horizontal'}
                size={28}
              />
            </div>
          )}

          {menuItems
            .filter((item) => !item.mobileOnly || isMobileClient)
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
                    className={`mb-2 flex cursor-pointer items-center p-2 ${isActive ? 'bg-primary text-white' : 'text-gray-900'
                      } w-full rounded font-medium ${sidebarCollapsed ? 'justify-center' : 'justify-normal'
                      } relative`}
                    title={item.label}
                    aria-label={item.label}
                    onMouseEnter={(e) =>
                      (isMobileClient || sidebarCollapsed) &&
                      showTooltip(item.label, e.currentTarget)
                    }
                    onMouseLeave={hideTooltip}
                    onTouchStart={(e) =>
                      startTouchTooltip(item.label, e.currentTarget)
                    }
                    onTouchEnd={endTouchTooltip}
                    onTouchCancel={endTouchTooltip}
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
                    {(isMobileClient || sidebarCollapsed) &&
                      tooltipVisible &&
                      tooltipLabel === item.label && (
                        <div
                          className="pointer-events-none fixed z-[600] whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white"
                          style={{
                            left: tooltipPos.x,
                            top: tooltipPos.y,
                            transform: 'translateY(-50%)',
                          }}
                        >
                          {item.label}
                        </div>
                      )}
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
                                className={`relative mb-2 ml-1 flex cursor-pointer items-center p-2 ${pathname?.includes(subItem?.path)
                                  ? 'text-primary'
                                  : 'text-gray-400'
                                  } hover:bg-primary500 rounded font-medium`}
                                title={subItem.label}
                                aria-label={subItem.label}
                                onMouseEnter={(e) =>
                                  (isMobileClient || sidebarCollapsed) &&
                                  showTooltip(subItem.label, e.currentTarget)
                                }
                                onMouseLeave={hideTooltip}
                                onTouchStart={(e) =>
                                  startTouchTooltip(
                                    subItem.label,
                                    e.currentTarget
                                  )
                                }
                                onTouchEnd={endTouchTooltip}
                                onTouchCancel={endTouchTooltip}
                                onClick={() =>
                                  handleMenuItemClick(subItem?.path)
                                }
                              >
                                <span className="text-[14px] leading-[18px]">
                                  {subItem?.label}
                                </span>
                                {(isMobileClient || sidebarCollapsed) &&
                                  tooltipVisible &&
                                  tooltipLabel === subItem.label && (
                                    <div
                                      className="pointer-events-none fixed z-[600] whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white"
                                      style={{
                                        left: tooltipPos.x,
                                        top: tooltipPos.y,
                                        transform: 'translateY(-50%)',
                                      }}
                                    >
                                      {subItem.label}
                                    </div>
                                  )}
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
                          className={`mb-2 flex cursor-pointer items-center p-2 ${pathname?.includes(subItem?.path)
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
          {!isMobileClient && (
            <div
              onClick={handleCollapse}
              className={`mb-10 mt-auto flex cursor-pointer items-center rounded-[4px] p-2 transition-all duration-200 hover:bg-gray-100 ${sidebarCollapsed ? 'justify-center' : 'justify-between'
                }`}
            >
              {!sidebarCollapsed && (
                <span className="text-sm font-medium text-black">COLLAPSE</span>
              )}
              <ChevronRight
                size={20}
                color="black"
                className={`transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'
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
