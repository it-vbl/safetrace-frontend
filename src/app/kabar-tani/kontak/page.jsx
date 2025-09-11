'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';

import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const KontakPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [kontakData, setKontakData] = useState([]);
  const [totalKontak, setTotalKontak] = useState(0);

  // Mock fetch function - replace with real data fetching logic
  const fetchKontakData = async ({ page, page_size, search }) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - repeated entries as in screenshot
      const allData = Array(50).fill({
        id_petani: '001-APKS-001-001',
        nama_petani: 'Agustinus Nery',
        no_handphone: '082211591642',
        jenis_kelamin: 'Laki - Laki',
      });

      // Filter by search (simple case-insensitive check on nama_petani)
      const filteredData = allData.filter((item) =>
        item.nama_petani.toLowerCase().includes(search.toLowerCase())
      );

      // Pagination
      const startIndex = (page - 1) * page_size;
      const pagedData = filteredData.slice(startIndex, startIndex + page_size);

      setKontakData(pagedData);
      setTotalKontak(filteredData.length);
    } catch (error) {
      // Handle error if needed
      setKontakData([]);
      setTotalKontak(0);
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

  const colDefs = [
    { field: 'id_petani', headerName: 'Id Petani', flex: 1, minWidth: 150 },
    { field: 'nama_petani', headerName: 'Nama Petani', flex: 1, minWidth: 150 },
    {
      field: 'no_handphone',
      headerName: 'No. Handphone',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'jenis_kelamin',
      headerName: 'Jenis Kelamin',
      flex: 1,
      minWidth: 150,
    },
  ];

  const autoSizeStrategy = {
    type: 'fitCellContents',
  };

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
            Kontak
          </Heading>
          <div className="w-full sm:w-auto">
            <SearchBar
              onChange={handleSearchTextChange}
              placeholder="Cari kontak"
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="relative w-full flex-1">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={kontakData}
            columnDefs={colDefs}
            domLayout="autoHeight"
            pagination={false}
            suppressCellFocus={true}
          />
        </div>

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

export default KontakPage;
