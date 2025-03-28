import React from 'react';
import { IconType } from 'react-icons';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

interface NavItemProps {
  icon: IconType;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center space-x-2 rounded-md p-2 hover:bg-gray-100 ${active ? 'bg-gray-200' : ''}`}
    >
      <Icon icon={icon} className='h-5 w-5' />
      <Text>{label}</Text>
    </button>
  );
};

export default NavItem;
