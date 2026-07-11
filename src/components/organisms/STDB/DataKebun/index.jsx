'use client';

import { useMemo, useState } from 'react';

import DataJenisPupuk from '@/components/organisms/DataView/DataJenisPupuk';
import DataKomoditas from '@/components/organisms/DataView/DataKomoditas';
import DataLahan from '@/components/organisms/DataView/DataLahan';
import DataMitraPenjualan from '@/components/organisms/DataView/DataMitraPenjualan';
import DataPemetaan from '@/components/organisms/DataView/DataPemetaan';
import DataPolaTanam from '@/components/organisms/DataView/DataPolaTanam';

const DataKebun = ({ detailKebun, mode = 'pendataan', onVerificationValueChange = () => { }, verifyCheckList }) => {
  const [activeTab, setActiveTab] = useState('Lahan');
  const activeClassName = 'font-bold text-primary bg-neutral-100 border border-neutral-300';

  const tabs = useMemo(
    () => [
      {
        label: 'Lahan',
        value: 'lahan',
        render: () => <DataLahan verified={verifyCheckList?.lahan} mode={mode} data={detailKebun} />,
      },
      {
        label: 'Pola Tanam',
        value: 'pola_tanam',
        render: () => <DataPolaTanam verified={verifyCheckList?.pola_tanam} mode={mode} data={detailKebun} />,
      },
      {
        label: 'Komoditas',
        value: 'komoditas',
        render: () => <DataKomoditas mode={mode} komoditas={detailKebun?.komoditas} data={detailKebun} />,
      },
      {
        label: 'Jenis Pupuk',
        value: 'jenis_pupuk',
        render: () => <DataJenisPupuk mode={mode} data={detailKebun} />,
      },
      {
        label: 'Mitra Penjualan',
        value: 'mitra_penjualan',
        render: () => <DataMitraPenjualan mode={mode} data={detailKebun} />,
      },
      {
        label: 'Pemetaan',
        value: 'peta',
        render: () => <DataPemetaan mode={mode} data={detailKebun} />,
      },
    ],
    [detailKebun, verifyCheckList]
  );

  return (
    <div className='flex flex-row items-start gap-2'>
      <div className='flex h-auto flex-[2] flex-col rounded-[4px] border border-neutral-300 p-2'>
        {tabs.map((tab, index) => (
          <div
            className={`flex w-full cursor-pointer flex-row justify-between rounded-[4px] p-3 text-[14px] hover:bg-neutral-100 ${activeTab === tab.label ? activeClassName : ''
              }`}
            key={index}
            onClick={() => setActiveTab(tab.label)}
            id={`tab-${tab.label}`}
          >
            <div>{tab.label}</div>
          </div>
        ))}
      </div>
      <div className='flex w-full flex-[8] items-start rounded-[4px] border border-neutral-300 bg-neutral-50 p-4'>
        {tabs.find((tab) => tab.label === activeTab)?.render()}
      </div>
    </div>
  );
};

export default DataKebun;
