'use client';

import React, { useState } from 'react';
import NavItem from '../molecules/NavItem';
import ProfileCard from '../molecules/ProfileCard';
import {
  HomeIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const [isGroupOpen, setIsGroupOpen] = useState(false);

  const toggleGroup = () => {
    setIsGroupOpen(!isGroupOpen);
  };

  return (
    <aside className='sticky bottom-0 border-r '>
      <div className='flex h-screen w-64 flex-col border-gray-200 bg-white p-4'>
        <div className='mb-8'>
          <span className='text-2xl font-bold'>Logo</span>
        </div>
        <nav className='flex flex-1 flex-col space-y-1 text-gray-800'>
          <NavItem icon={HomeIcon} label='Home' href='/' active />
          <NavItem icon={BellIcon} label='Notifications' href='/notifications' />

          {/* Group Menu */}
          <div>
            <button
              onClick={toggleGroup}
              className='flex w-full items-center justify-between rounded-md px-2 py-2 hover:bg-gray-100'
            >
              <span className='flex items-center space-x-2'>
                <ChatBubbleLeftRightIcon className='h-5 w-5' />
                <span>Group</span>
              </span>
              {isGroupOpen ? <ChevronUpIcon className='h-4 w-4' /> : <ChevronDownIcon className='h-4 w-4' />}
            </button>
            {isGroupOpen && (
              <div className='ml-4 space-y-1'>
                <NavItem icon={ChatBubbleLeftRightIcon} label='Group Item 1' href='/group/item1' />
                <NavItem icon={ChatBubbleLeftRightIcon} label='Group Item 2' href='/group/item2' />
                {/* Add more group items as needed */}
              </div>
            )}
          </div>

          <NavItem icon={MagnifyingGlassIcon} label='Search' href='/search' />
          <NavItem icon={HeartIcon} label='Favorites' href='/favorites' />
          <NavItem icon={BookmarkIcon} label='Bookmarks' href='/bookmarks' />
        </nav>
        <ProfileCard
          name='Amanda'
          imageUrl='https://highlandindonesia.com/wp-content/uploads/Amerta-INdah-Otsuka-logo.webp'
          viewProfileLink='/profile/amanda'
        />
      </div>
    </aside>
  );
};

export default Sidebar;
