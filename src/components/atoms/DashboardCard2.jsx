import React from 'react';

import numberFormat from '@/libs/utils/numberFormat';

const DashboardCard2 = ({ title, data, tagBg }) => {
  return (
    <div className='flex flex-1 h-full flex-col items-start rounded-[2px] border border-neutral-300 p-4'>
      <h2 className='font-bold'>{title}</h2>
      {data.map((item, index) => (
        <div key={index} className='flex justify-between w-full'>
          <span>{item.label}</span>
          <span>{numberFormat(item.value)} Kebun</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard2;
