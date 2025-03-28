'use client';

import { useState } from 'react';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import { Button } from '@/components/ui/button';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const ActionsCellRenderer = () => {
  return <Button size={'sm'}>View</Button>;
};

interface ReimbursementData {
  reimbursementName: string;
  claimDate: string;
  total: number;
  approver: string;
  status: string;
  // action: any;
}

const ReimbursementClaimPage = () => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([
    {
      reimbursementName: 'Adam Davarel',
      claimDate: '20 August 2025',
      total: 64950,
      approver: 'M Abyan',
      status: 'waiting-approval',
    },
    {
      reimbursementName: 'Berly Setiawan',
      claimDate: '20 August 2025',
      total: 29600,
      approver: 'M Abyan',
      status: 'waiting-approval',
    },
    {
      reimbursementName: 'Ulfa Maria Irawan',
      claimDate: '20 August 2025',
      total: 29600,
      approver: 'M Abyan',
      status: 'waiting-approval',
    },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef<ReimbursementData>[] = [
    { field: 'reimbursementName' },
    { field: 'claimDate' },
    { field: 'approver' },
    { field: 'total' },
    { field: 'status' },
    // {
    //   field: 'action',
    //   headerName: 'Actions',
    //   cellRenderer: ActionsCellRenderer,
    // },
  ];

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='flex w-full flex-1 flex-col'>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
  // ...
};

export default ReimbursementClaimPage;
