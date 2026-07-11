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
      className={`border-gray absolute left-5 top-5 z-[1000] h-[calc(100%-40px)] max-h-[calc(100%-40px)] w-[calc(100%-40px)] overflow-y-hidden rounded-xl border bg-white p-4 duration-500 ease-in-out ${showTable ? 'translate-y-0' : 'top-[200px] translate-y-full'
        } xs:left-2 xs:top-2 xs:h-[calc(100%-16px)] xs:w-[calc(100%-16px)] xs:p-3`}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
            <div className="order-1">
              <Heading level={2}>Data Kebun</Heading>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3">
              <Close onClick={onClose} className="cursor-pointer" />
            </div>
            <div className="order-3 flex w-full flex-row items-center gap-2 sm:order-2 sm:w-auto sm:gap-4">
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <SearchBar
                  placeholder="Cari..."
                  value={searchText}
                  onChange={onSearchTextChange}
                  className="w-full sm:w-[180px] md:w-[200px] lg:w-[250px]"
                />
                <Select
                  value={filterKelompok}
                  onChange={onFilterKelompokChange}
                  containerClassName="w-[calc(50%-4px)] sm:w-[120px] md:w-[130px] lg:w-[150px]"
                  placeholder="Kelompok"
                  options={kelompokOptions}
                  disabled={disableKelompokFilter}
                />
                <Select
                  value={filterRSPO}
                  onChange={onFilterRSPOChange}
                  containerClassName="w-[calc(50%-4px)] sm:w-[100px] md:w-[110px] lg:w-[120px]"
                  placeholder="RSPO"
                  options={rspoOptions}
                />
                <Select
                  value={filterISPO}
                  onChange={onFilterISPOChange}
                  containerClassName="w-[calc(50%-4px)] sm:w-[100px] md:w-[110px] lg:w-[120px]"
                  placeholder="ISPO"
                  options={ispoOptions}
                />
                <Select
                  value={filterLegalitas}
                  onChange={onFilterLegalitasChange}
                  containerClassName="w-[calc(50%-4px)] sm:w-[120px] md:w-[130px] lg:w-[150px]"
                  placeholder="Legalitas"
                  options={legalitasOptions}
                />
              </div>
            </div>

          </div>
          {filterPetaniId && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">Filter petani:</span>
              <div className="inline-flex items-center gap-2 rounded-md border border-primary bg-bgColor px-3 py-1.5 text-sm text-primary shadow-sm">
                <span className="font-medium">
                  Petani: {petaniName || `ID: ${filterPetaniId}`}
                </span>
                <button
                  onClick={onRemoveFilterPetani}
                  className="ml-1 rounded-full p-0.5 text-primary transition-colors duration-200 hover:bg-bgColor hover:text-primary"
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