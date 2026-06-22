'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';
import { deleteBroadcast, getBroadcastList } from '@/services/broadcast';

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
      const params = {
        page,
        page_size,
        ...(search && { search }),
      };

      const response = await getBroadcastList(params);

      if (response?.data?.status === 'success') {
        const { results, count } = response.data.data;

        const mappedData = (results || []).map((item) => {
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

          const jumlahPenerima =
            item?.jumlah_penerima ??
            item?.total_penerima ??
            (Array.isArray(item?.kontak_ids)
              ? item.kontak_ids.length
              : item?.recipient_count ?? 0);

          const pengirimNama = item?.device_data?.nama;
          const pengirimNo = item?.device_data?.no_wa;

          const statusLabel = item?.terkirim
            ? 'Terkirim'
            : item?.gagal === true
              ? 'Gagal'
              : 'Dalam Antrian';

          return {
            id: item?.id,
            id_pesan:
              item?.id_pesan || `BC-${String(item?.id || 0).padStart(4, '0')}`,
            nama_pesan: item?.nama_pesan || item?.nama || '-',
            no_pengirim:
              pengirimNama && pengirimNo
                ? `${pengirimNama} - ${pengirimNo}`
                : item?.no_pengirim || '-',
            grup_penerima: item?.jenis_penerima_label,
            jumlah_penerima: jumlahPenerima,
            waktu_pengiriman: waktuPengiriman,
            status: statusLabel,
          };
        });

        setKontakData(mappedData);
        setTotalKontak(count || mappedData.length || 0);
      } else {
        setKontakData([]);
        setTotalKontak(0);
        toast.error('Gagal mengambil data broadcast');
      }
    } catch (error) {
      setKontakData([]);
      setTotalKontak(0);
      toast.error(
        error?.response?.data?.message ||
        'Terjadi kesalahan saat mengambil data'
      );
      console.error('Error fetching broadcast list:', error);
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

  const handleSearchTextChange = useCallback(
    debounce((e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleDeleteClick = (rowData) => {
    setSelectedItem(rowData);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      const response = await deleteBroadcast(selectedItem.id);
      if (
        response?.status === 200 ||
        response?.status === 204 ||
        response?.data?.status === 'success'
      ) {
        toast.success('Data berhasil dihapus');
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        fetchKontakData({ page: currentPage, page_size: pageSize, search });
      } else {
        toast.error(response?.data?.message || 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Gagal menghapus data');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const ActionsCellRenderer = (params) => {
    return (
      <div className="flex h-full items-center gap-2">
        <button
          className="py-1 text-xs font-bold text-primaryDark1 underline"
          onClick={() => {
            router.push(`/kabar-tani/blast-pesan/${params.data.id}`);
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

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      minWidth: 100,
      wrapText: true,
      autoHeight: true,
    }),
    []
  );

  const colDefs = [
    {
      field: 'actions',
      headerName: '',
      cellRenderer: ActionsCellRenderer,
      width: 120,
      minWidth: 100,
      maxWidth: 150,
      suppressSizeToFit: false,
      pinned: 'left',
    },
    {
      field: 'id_pesan',
      headerName: 'Id Pesan',
      width: 100,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      field: 'nama_pesan',
      headerName: 'Nama Pesan',
      flex: 2,
      minWidth: 150,
    },
    {
      field: 'no_pengirim',
      headerName: 'No. Pengirim',
      flex: 4,
      minWidth: 350,
    },
    {
      field: 'grup_penerima',
      headerName: 'Jenis Penerima',
      width: 150,
      minWidth: 130,
      maxWidth: 180,
    },
    {
      field: 'jumlah_penerima',
      headerName: 'Jumlah Penerima',
      width: 160,
      minWidth: 140,
      maxWidth: 180,
      headerClass: 'text-center',
    },
    {
      field: 'waktu_pengiriman',
      headerName: 'Waktu Pengiriman',
      width: 160,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      minWidth: 100,
      maxWidth: 140,
    },
  ];

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitGridWidth',
    };
  }, []);

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={`dengan nama ${selectedItem?.nama_pesan}`}
        isLoading={isDeleting}
      />

      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Heading className=" flex flex-1 uppercase tracking-[2px]" level={3}>
            BLAST PESAN
          </Heading>
          <div className="flex w-full gap-2 sm:w-auto">
            {/* <SearchBar
              onChange={handleSearchTextChange}
              placeholder="Cari campaign"
              className="w-full sm:w-[300px]"
            /> */}
            <Button
              onClick={() => {
                router.push('/kabar-tani/blast-pesan/tambah');
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
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            rowData={kontakData}
          />
        </div>

        {/* Pagination section */}
        <div className="flex justify-center sm:justify-end">
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
