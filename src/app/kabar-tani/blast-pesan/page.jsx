'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import Heading from '@/components/atoms/Typography/Heading';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';
import Button from '@/components/atoms/Button';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';

ModuleRegistry.registerModules([AllCommunityModule]);

const BlastPesanPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [kontakData, setKontakData] = useState([]);
  const [totalKontak, setTotalKontak] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchKontakData = async ({ page, page_size, search }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allData = [
        {
          id: 1,
          id_pesan: 'GK-0001',
          nama_pesan: 'Pemberitahuan Harga Harian',
          no_pengirim: 'Fajar Sukmara - 081234567890',
          grup_penerima: 'Anggota APKS',
          jumlah_penerima: 1200,
          waktu_pengiriman: '07:00 25-08-2025',
          status: 'Selesai',
        },
        ...Array(48)
          .fill(null)
          .map((_, index) => ({
            id: index + 3,
            id_pesan: `GK-${String(index + 3).padStart(4, '0')}`,
            nama_pesan: 'Pemberitahuan Harga Harian',
            no_pengirim: 'Fajar Sukmara - 081234567890',
            grup_penerima: 'Ketua Kelompok',
            jumlah_penerima: 1200,
            waktu_pengiriman: '07:00 25-08-2025',
            status: 'Selesai',
          })),
      ];

      const filteredData = allData.filter((item) =>
        item.nama_pesan.toLowerCase().includes(search.toLowerCase())
      );

      const startIndex = (page - 1) * page_size;
      const pagedData = filteredData.slice(startIndex, startIndex + page_size);

      setKontakData(pagedData);
      setTotalKontak(filteredData.length);
    } catch (error) {
      setKontakData([]);
      setTotalKontak(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKontakData({ page: currentPage, page_size: pageSize, search });
  }, [currentPage, pageSize, search]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setKontakData((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setTotalKontak((prev) => prev - 1);

      console.log('Data berhasil dihapus:', selectedItem);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);

      // Optionally show success message
      // toast.success('Data berhasil dihapus');
    } catch (error) {
      console.error('Error deleting data:', error);
      // Optionally show error message
      // toast.error('Gagal menghapus data');
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
          onClick={() => {
            router.push(
              `/kabar-tani/blast-pesan/${params.data.id}/detail-pesan`
            );
          }}
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
      flex: 1,
      minWidth: 100,
      sortable: false,
      filter: false,
    },
    {
      field: 'id_pesan',
      headerName: 'Id Pesan',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'nama_pesan',
      headerName: 'Nama Pesan',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'no_pengirim',
      headerName: 'No. Pengirim',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'grup_penerima',
      headerName: 'Grup Penerima',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'jumlah_penerima',
      headerName: 'Jumlah Penerima',
      flex: 1,
      minWidth: 150,
      headerClass: 'text-center',
    },
    {
      field: 'waktu_pengiriman',
      headerName: 'Waktu Pengiriman',
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
    },
  ];

  const autoSizeStrategy = {
    type: 'fitCellContents',
  };

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={`Apakah Anda ingin mengapus data pesan dengan nama "${selectedItem?.nama_pesan}"`}
        isLoading={isDeleting}
      />

      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Heading level={3} className="text-lg font-bold">
            BLAST PESAN
          </Heading>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              onClick={() => {
                router.push('/kabar-tani/blast-pesan/pesan-baru');
              }}
            >
              Pesan Baru
            </Button>
          </div>
        </div>

        {/* Table section */}
        <div className="relative w-full flex-1">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            columnDefs={colDefs}
            pagination={false}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={kontakData}
            domLayout="autoHeight"
            suppressCellFocus={true}
          />
        </div>

        {/* Pagination section */}
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalKontak}
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

export default BlastPesanPage;
