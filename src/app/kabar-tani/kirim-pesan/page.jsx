'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';
import { deletePesan, getPesanList } from '@/services/pesan';

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

  const fetchPesanData = async ({ page, page_size }) => {
    setLoading(true);
    try {
      const params = { page, page_size };
      const res = await getPesanList(params);
      const data = res?.data?.data || res?.data;
      const results = data?.results || [];

      const mapped = (results || []).map((item) => {
        const createdAt = item?.created_at || item?.waktu_pengiriman;
        const waktuPengiriman = createdAt
          ? new Date(createdAt).toLocaleString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : '-';

        const pengirimNama = item?.device_data?.nama;
        const pengirimNo = item?.device_data?.no_wa;

        const statusLabel =
          item?.terkirim === true
            ? 'Terkirim'
            : item?.gagal === true
            ? 'Gagal'
            : 'Dalam Antrian';

        return {
          id: item?.id,
          id_pesan:
            item?.id_pesan ||
            `KP-${String(item?.id || 0)
              .toString()
              .padStart(4, '0')}`,
          no_pengirim:
            `${pengirimNama || '-'}` + (pengirimNo ? ` - ${pengirimNo}` : ''),
          no_penerima: item?.kontak_data?.no_wa || '-',
          waktu_pengiriman: waktuPengiriman,
          status: statusLabel,
        };
      });

      setRows(mapped);
      setTotalItems(data?.count ?? mapped.length);
    } catch (error) {
      console.error('Error fetching pesan list:', error);
      toast.error(error?.response?.data?.message || 'Gagal memuat data pesan');
      setRows([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanData({ page: currentPage, page_size: pageSize });
  }, [currentPage, pageSize]);

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
      const res = await deletePesan(selectedItem.id);
      const success = res?.data?.status === 'success' || res?.status === 200;

      if (success) {
        toast.success(res?.data?.message || 'Berhasil menghapus pesan');
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        await fetchPesanData({ page: currentPage, page_size: pageSize });
      } else {
        throw new Error(res?.data?.message || 'Gagal menghapus pesan');
      }
    } catch (error) {
      console.error('Error deleting pesan:', error);
      toast.error(error?.response?.data?.message || 'Gagal menghapus pesan');
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
