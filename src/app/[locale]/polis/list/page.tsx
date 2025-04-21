'use client';

import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import Heading from '@/components/atoms/Typography/Heading';
import { getClaimList } from '@/services/polis';
import { useRouter } from 'next/navigation';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const ReimbursementClaimPage = () => {
  const router = useRouter();
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
    {
      nama_pemilik: 'Adam Davarel',
      jenis_mobil: '20 August 2025',
      no_plat: 'BG 1234 AB',
      status: 'Lolos Analisa Sistem',
    },
  ]);

  const ActionsCellRenderer = useCallback(
    (e: any) => {
      return (
        <Button size={'sm'} onClick={() => router.push('/id/polis/claims/' + e.data.id)}>
          Lihat
        </Button>
      );
    },
    [rowData]
  );
  // Column Definitions: Defines the columns to be displayed.
  const colDefs = [
    { field: 'id', headerName: 'ID Polis' },
    { field: 'nama_pemilik', headerName: 'Nama Pemilik' },
    { field: 'jenis_mobil', headerName: 'Jenis Mobil' },
    { field: 'no_plat', headerName: 'Plat Nomor' },
    { field: 'status', headerName: 'Status' },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
    },
  ];

  const retreiveClaimList = async () => {
    try {
      const res = await getClaimList();
      if (res.status == 200) {
        const tempDatas = [];
        for (const data of res.data.data) {
          const { claim, polis } = data;
          tempDatas.push({
            ...polis,
            status: claim.status,
          });
        }
        setRowData(tempDatas);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    retreiveClaimList();
  }, []);

  return (
    <div className='flex h-full w-full flex-col px-[200px] py-8'>
      <Heading level={2} className='mb-8'>
        List Klaim
      </Heading>
      <div className='flex w-full flex-1 flex-col'>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
  // ...
};

export default ReimbursementClaimPage;
