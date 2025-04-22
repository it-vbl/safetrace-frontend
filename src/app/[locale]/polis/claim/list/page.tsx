'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';

import Heading from '@/components/atoms/Typography/Heading';
import { Button } from '@/components/ui/button';
import { getClaimList } from '@/services/polis';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const ReimbursementClaimPage = () => {
  const router = useRouter();
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
    {
      id: '1',
      nama_pemilik: 'Adam Davarel',
      jenis_mobil: '20 August 2025',
      no_plat: 'BG 1234 AB',
      status: 'Lolos Analisa Sistem',
    },
  ]);

  const ActionsCellRenderer = useCallback(
    (e: any) => {
      return (
        <Button size={'sm'} onClick={() => router.push('/id/polis/claims/' + e.data.claim_id)}>
          Lihat
        </Button>
      );
    },
    [rowData]
  );
  // Column Definitions: Defines the columns to be displayed.
  const colDefs: any = [
    { field: 'id', headerName: 'ID Polis' },
    { field: 'claim_id', headerName: 'ID Claim' },
    { field: 'date_claim', headerName: 'Tanggal Klaim' },
    { field: 'jenis_mobil', headerName: 'Jenis Mobil' },
    { field: 'no_plat', headerName: 'Plat Nomor' },
    { field: 'owner_name', headerName: 'Nama Pemilik' },
    { field: 'status', headerName: 'Status' },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
      pinned: 'right',
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
            claim_id: claim.id,
            status: claim.status,
            owner_name: polis.nama_pemilik,
            date_claim: moment(claim.created_at, 'YYYY-04-20 hh:mm:ss').format('DD MMM YYYY'),
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

  const autoSizeStrategy = useMemo<any>(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  return (
    <div className='flex h-full w-full flex-col px-[200px] py-8'>
      <Heading level={2} className='mb-8'>
        List Klaim
      </Heading>
      <div className='flex w-full flex-1 flex-col'>
        <AgGridReact autoSizeStrategy={autoSizeStrategy} rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
};

export default ReimbursementClaimPage;
