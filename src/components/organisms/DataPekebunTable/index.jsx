'use client';

import { AgGridReact } from 'ag-grid-react';
import { X } from 'lucide-react';

import Close from '@/components/atoms/Icons/Close';
import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';

const DataPekebunTable = ({
  showTable,
  onClose,
  searchText,
  onSearchTextChange,
  filterKelompok,
  onFilterKelompokChange,
  filterRSPO,
  onFilterRSPOChange,
  filterISPO,
  onFilterISPOChange,
  filterLegalitas,
  onFilterLegalitasChange,
  filterPetaniId,
  petaniName,
  onRemoveFilterPetani,
  kelompokOptions,
  rspoOptions,
  ispoOptions,
  legalitasOptions,
  loading,
  rowData,
  columnDefs,
  autoSizeStrategy,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  disableKelompokFilter = false,
}) => {
  return (
    <div
      className={`border-gray absolute left-5 top-5 z-[1000] h-[calc(100%-40px)] max-h-[calc(100%-40px)] w-[calc(100%-40px)] overflow-y-hidden rounded-xl border bg-white p-4 duration-500 ease-in-out ${
        showTable ? 'translate-y-0' : 'top-[200px] translate-y-full'
      } xs:left-2 xs:top-2 xs:h-[calc(100%-16px)] xs:w-[calc(100%-16px)] xs:p-3`}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between">
            <Heading level={2}>Data Kebun</Heading>
            <div className="flex flex-row items-center gap-8">
              <div className="flex flex-row items-center gap-2">
                <SearchBar
                  placeholder="Cari..."
                  value={searchText}
                  onChange={onSearchTextChange}
                />
                <Select
                  value={filterKelompok}
                  onChange={onFilterKelompokChange}
                  containerClassName="w-[150px]"
                  placeholder="Kelompok"
                  options={kelompokOptions}
                  disabled={disableKelompokFilter}
                />
                <Select
                  value={filterRSPO}
                  onChange={onFilterRSPOChange}
                  containerClassName="w-[120px]"
                  placeholder="RSPO"
                  options={rspoOptions}
                />
                <Select
                  value={filterISPO}
                  onChange={onFilterISPOChange}
                  containerClassName="w-[120px]"
                  placeholder="ISPO"
                  options={ispoOptions}
                />
                <Select
                  value={filterLegalitas}
                  onChange={onFilterLegalitasChange}
                  containerClassName="w-[150px]"
                  placeholder="Legalitas"
                  options={legalitasOptions}
                />
              </div>
              <Close onClick={onClose} />
            </div>
          </div>
          {/* Filter Petani Badge */}
          {filterPetaniId && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter petani:</span>
              <div className="inline-flex items-center gap-2 rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm text-blue-800 shadow-sm">
                <span className="font-medium">
                  Petani: {petaniName || `ID: ${filterPetaniId}`}
                </span>
                <button
                  onClick={onRemoveFilterPetani}
                  className="ml-1 rounded-full p-0.5 text-blue-600 transition-colors duration-200 hover:bg-blue-100 hover:text-blue-800"
                  title="Hapus filter petani"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex-1">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            autoSizeStrategy={autoSizeStrategy}
            rowData={rowData}
            columnDefs={columnDefs}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          showRowsPerPage={true}
          labels={{
            rowsPerPage: 'Baris Per Halaman',
            showing: 'Menampilkan',
            of: 'dari',
          }}
        />
      </div>
    </div>
  );
};

export default DataPekebunTable;
