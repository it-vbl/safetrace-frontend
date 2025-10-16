'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';

ModuleRegistry.registerModules([AllCommunityModule]);

const KirimPesanPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(500);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const initialRows = [
      {
        id: 1,
        id_pesan: 'PN-0001',
        no_pengirim: 'Fajar Sukmara - 082211591642',
        no_penerima: '082211591642',
        waktu_pengiriman: '07:00 25-08-2025',
        status: 'Selesai',
      },
      {
        id: 2,
        id_pesan: 'PN-0001',
        no_pengirim: 'Fajar Sukmara - 082211591642',
        no_penerima: '082211591642',
        waktu_pengiriman: '07:00 25-08-2025',
        status: 'Selesai',
      },
    ];
    setRows(initialRows);
  }, []);

  const handlePageChange = useCallback(
    (newPage) => setCurrentPage(newPage),
    []
  );
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const handleDeleteClick = (rowData) => {
    setSelectedItem(rowData);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    try {
      setRows((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setTotalItems((prev) => Math.max(0, prev - 1));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting data:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const actionsCellRenderer = (params) => {
    return (
      <div className="flex h-full items-center gap-2">
        <button
          className="py-1 text-xs font-bold text-primaryDark1 underline"
          onClick={() =>
            router.push(`/kabar-tani/kirim-pesan/${params.data.id}`)
          }
        >
          LIHAT
        </button>
        <button
          className="py-1 text-xs font-bold text-error5 underline"
          onClick={() => handleDeleteClick(params.data)}
        >
          HAPUS
        </button>
      </div>
    );
  };

  const colDefs = [
    {
      headerName: '',
      cellRenderer: actionsCellRenderer,
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      filter: false,
    },
    { field: 'id_pesan', headerName: 'Id Pesan', flex: 1, minWidth: 120 },
    {
      field: 'no_pengirim',
      headerName: 'No. Pengirim',
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'no_penerima',
      headerName: 'No. Penerima',
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: 'waktu_pengiriman',
      headerName: 'Waktu Pengiriman',
      flex: 1.5,
      minWidth: 180,
    },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120 },
  ];

  const autoSizeStrategy = useMemo(() => ({ type: 'fitCellContents' }), []);

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      {/* Modal Konfirmasi Hapus */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={`pesan dengan ID ${selectedItem?.id_pesan}`}
        isLoading={isDeleting}
      />

      <div className="flex h-full flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
            KIRIM PESAN
          </Heading>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              onClick={() => router.push('/kabar-tani/kirim-pesan/tambah')}
            >
              Pesan Baru
            </Button>
          </div>
        </div>

        {/* Tabel */}
        <div className="relative w-full flex-1">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={rows}
            columnDefs={colDefs}
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showRowsPerPage={true}
            labels={{
              rowsPerPage: 'Baris Per Halaman',
              showing: 'Menampilkan',
              of: 'dari',
            }}
            className="text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default KirimPesanPage;
