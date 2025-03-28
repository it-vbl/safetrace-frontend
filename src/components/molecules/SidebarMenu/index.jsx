import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

import ChevronDown from '@/components/atoms/Icons/ChevronDown';
import { cn } from '@/utils/cn';

import Paragraph from '../../atoms/Typography/Paragraph';

const SidebarMenu = ({
  icon,
  label,
  active = false,
  className = '',
  url,
  submenu = [],
  expandedSubMenu,
  setExpandedSubMenu,
}) => {
  const { pathname } = useRouter();

  const handleOnSubMenuClick = () => setExpandedSubMenu((prevState) => (prevState === label ? null : label));

  return (
    <>
      {submenu.length > 0 ? (
        <div>
          <div
            className={cn('flex cursor-pointer items-center justify-between rounded-full p-[10px]', {
              'bg-blue1 !text-blue10': active,
              'hover:bg-blue0 hover:text-blue8': !active,
            })}
            data-testid={`sidebar-menu-${label?.toLowerCase()?.split(' ')?.join('-')}`}
            onClick={handleOnSubMenuClick}
          >
            <div className='flex items-center gap-x-[10px]'>
              {icon &&
                React.cloneElement(icon, {
                  color: 'currentColor',
                  size: 16,
                })}
              <Paragraph level={3} className='font-semibold'>
                {label}
              </Paragraph>
            </div>

            <div
              className={cn('rotate-0', {
                'rotate-180': expandedSubMenu === label,
              })}
            >
              <ChevronDown />
            </div>
          </div>

          <div
            className={cn('overflow-hidden transition-all duration-300', {
              'max-h-0': expandedSubMenu !== label,
              'max-h-96': expandedSubMenu === label,
            })}
          >
            {submenu?.map((item) => (
              <Link href={item?.url} key={item?.label}>
                <Paragraph
                  level={3}
                  className={cn('text-neutral10 py-[10px] pl-9 font-normal', {
                    'text-blue10 font-bold': new RegExp(`^${item.url}(?:/|$)`).test(pathname),
                    'hover:text-blue8': pathname != item.url,
                  })}
                  data-testid={`sidebar-menu-${item?.label?.toLowerCase()?.split(' ')?.join('-')}`}
                >
                  {item?.label}
                </Paragraph>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Link
          className={cn(
            'flex w-full cursor-pointer flex-row items-center justify-start gap-[10px] rounded-full p-[10px]',
            {
              'bg-blue1 text-blue10': active,
              'hover:!bg-blue0 hover:text-blue8': !active,
            },
            className
          )}
          data-testid={`sidebar-menu-${label?.toLowerCase()?.split(' ')?.join('-')}`}
          href={url}
        >
          {icon &&
            React.cloneElement(icon, {
              color: 'currentColor',
              size: 16,
            })}
          <Paragraph
            level={3}
            className={cn('hover:text-blue8 font-semibold', {
              'text-blue10': active,
            })}
          >
            {label}
          </Paragraph>
        </Link>
      )}
    </>
  );
};

SidebarMenu.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
  url: PropTypes.string,
  submenu: PropTypes.string,
  expandedSubMenu: PropTypes.string,
  setExpandedSubMenu: PropTypes.func,
};

export default SidebarMenu;
