import React from 'react';

import Sidebar from '../organisms/Sidebar';

const DashboardTemplate = ({ children }) => {
  return (
    <div className='flex'>
      <Sidebar />
      <main className='max-h-screen flex-1 p-4'>{children}</main>
    </div>
  );
};

export default DashboardTemplate;
