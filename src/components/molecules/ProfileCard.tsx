import React from 'react';
import Image from 'next/image';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

interface ProfileCardProps {
  name: string;
  imageUrl: string;
  viewProfileLink: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, imageUrl, viewProfileLink }) => {
  return (
    <div className='flex items-center justify-between border-t border-gray-200 p-4'>
      <div className='flex items-center space-x-3'>
        <Image src={imageUrl} alt={name} width={40} height={40} className='rounded-full' />
        <div className='flex flex-col'>
          <Text className='font-semibold'>{name}</Text>
          <a href={viewProfileLink} className='text-sm text-gray-500'>
            View profile
          </a>
        </div>
      </div>
      <Icon icon={Cog6ToothIcon} className='h-5 w-5 text-gray-500' />
    </div>
  );
};

export default ProfileCard;
