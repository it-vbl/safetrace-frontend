import React from 'react';
import { IconType } from 'react-icons';

interface IconProps {
  icon: IconType;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, className }) => {
  return <IconComponent className={className} />;
};

export default Icon;
