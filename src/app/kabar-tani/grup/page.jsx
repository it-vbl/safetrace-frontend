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
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';
import { deleteGrupKontak, getGrupKontakList } from '@/services/grup';

ModuleRegistry.registerModules([AllCommunityModule]);

const GrupPage = () => {
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
        search: search || undefined,
      };

      const response = await getGrupKontakList(params);

      if (response.data && response.data.data) {
        const mappedData = response.data.data.results.map((item) => ({
          id: item.id,
          id_group: `GK-${String(item.id).padStart(4, '0')}`,
          nama_grup: item.nama,
          jumlah_penerima: item.total_anggota,
          terakhir_diubah: new Date(item.updated_at).toLocaleString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
          deskripsi: item.deskripsi,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        setKontakData(mappedData);
        setTotalKontak(response.data.data.count || 0);
      } else {
        setKontakData([]);
        setTotalKontak(0);
      }
    } catch (error) {
      console.error('Error fetching grup kontak data:', error);
      setKontakData([]);
      setTotalKontak(0);
      toast.error('Gagal memuat data grup kontak');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKontakData({ page: currentPage, page_size: pageSize, search });
  }, [currentPage, pageSize, search]);

  const handleSearchTextChange = useCallback(
    debounce((e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }, 300),
    []
  );

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
      const response = await deleteGrupKontak(selectedItem.id);

      if (response.status === 200 || response.status === 204) {
        setKontakData((prev) =>
          prev.filter((item) => item.id !== selectedItem.id)
        );
        setTotalKontak((prev) => prev - 1);
        toast.success('Data berhasil dihapus');

        setIsDeleteModalOpen(false);
        setSelectedItem(null);

        fetchKontakData({ page: currentPage, page_size: pageSize, search });
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

  const actionsCellRenderer = (params) => {
    return (
      <div className="flex h-full items-center gap-2">
        <button
          className="py-1 text-xs font-bold text-primaryDark1 underline"
          onClick={() => {
            router.push(`/kabar-tani/grup/${params.data.id}`);
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
      flex: 0.9,
      minWidth: 100,
      sortable: false,
      filter: false,
    },
    {
      field: 'id_group',
      headerName: 'Id Grup',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'nama_grup',
      headerName: 'Nama Grup',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'jumlah_penerima',
      headerName: 'Jumlah Penerima',
      flex: 1.5,
      minWidth: 150,
      headerClass: 'text-center',
    },
    {
      field: 'terakhir_diubah',
      headerName: 'Terakhir Diubah',
      flex: 1.5,
      minWidth: 150,
    },
  ];

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={`grup dengan nama ${selectedItem?.nama_grup}`}
        isLoading={isDeleting}
      />

      <div className="flex h-full flex-col gap-4">
        {/* Header section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
            GRUP KONTAK
          </Heading>
          <div className="flex w-full gap-2 sm:w-auto">
            <SearchBar
              onChange={handleSearchTextChange}
              placeholder="Cari grup"
              className="w-full sm:w-[300px]"
            />
            <Button
              onClick={() => {
                router.push('/kabar-tani/grup/tambah');
              }}
            >
              Grup Baru
            </Button>
          </div>
        </div>

        {/* Table section */}
        <div className="relative w-full flex-1">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={kontakData}
            columnDefs={colDefs}
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

export default GrupPage;
