import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Avatar from '@/components/atoms/Avatar';
import Cascader from '@/components/atoms/Cascader';
import ExitToApp from '@/components/atoms/Icons/ExitToApp';
import ExpandMore from '@/components/atoms/Icons/ExpandMore';
import Lock from '@/components/atoms/Icons/Lock';
import PersonPinindex from '@/components/atoms/Icons/PersonPinindex';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import useTouchOutside from '@/helpers/hooks/useTouchOutside';
import { setUpdatePasswordModalVisibility, setUpdateProfileModalVisibility } from '@/store/data/actions';
import { userLogout } from '@/store/user/actions';
import theme from '@/utils/tailwindTheme';

const NavbarProfile = ({ avatarUrl, studentName, schoolType }) => {
  const dispatch = useDispatch();
  const dropdown = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownMenu = [
    {
      icon: <PersonPinindex />,
      label: 'Ubah Foto Profil',
      onClick: () => {
        setIsDropdownOpen(false);
        dispatch(setUpdateProfileModalVisibility(true));
      },
    },
    {
      icon: <Lock />,
      label: 'Ubah Password',
      onClick: () => {
        setIsDropdownOpen(false);
        dispatch(setUpdatePasswordModalVisibility(true));
      },
    },
    {
      icon: <ExitToApp />,
      label: 'Log Out',
      onClick: () => dispatch(userLogout()),
    },
  ];

  const handleOnChevronClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useTouchOutside(dropdown, () => setIsDropdownOpen(false));

  return (
    <div className='relative'>
      <div
        className='bg-neutral3 flex h-12 cursor-pointer items-center gap-2 rounded-full px-3 py-2'
        onClick={handleOnChevronClick}
      >
        <Avatar url={avatarUrl} />
        <div className='flex flex-col'>
          <Paragraph level={2} className='text-blue6 font-bold'>
            Hi, {studentName}
          </Paragraph>
          <Paragraph level={4}>{schoolType}</Paragraph>
        </div>
        <ExpandMore color={theme.colors.blue10} size={16} className='bg-blue0 rounded-full' />
      </div>
      {isDropdownOpen && (
        <div className='absolute right-0 z-[999] mt-2 w-full rounded-md bg-white shadow-sm' ref={dropdown}>
          <div className='py-2'>
            {dropdownMenu.map((item) => (
              <Cascader
                className='cursor-pointer px-5 py-2'
                textClassName='flex items-center gap-2'
                onClick={item.onClick}
                key={item.label}
              >
                {item.icon}
                {item.label}
              </Cascader>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarProfile;
