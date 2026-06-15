'use client';

import { AgGridReact } from 'ag-grid-react';

import Close from '@/components/atoms/Icons/Close';
import Heading from '@/components/atoms/Typography/Heading';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';

const DataAlertDeforestasi = ({
  showTable,
  onClose,
  searchText,
  onSearchTextChange,
  filterAlertType,
  onFilterAlertTypeChange,
  filterKabupaten,
  onFilterKabupatenChange,
  filterKecamatan,
  onFilterKecamatanChange,
  alertTypeOptions,
  kabupatenOptions,
  kecamatanOptions,
  loading,
  rowData,
  columnDefs,
  autoSizeStrategy,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div
      className={`border-gray absolute left-5 top-5 z-[1000] h-[calc(100%-40px)] max-h-[calc(100%-40px)] w-[calc(100%-40px)] rounded-xl border bg-white p-4 duration-500 ease-in-out ${showTable ? 'translate-y-0' : 'top-[200px] translate-y-full'
        } xs:left-2 xs:top-2 xs:h-[calc(100%-16px)] xs:w-[calc(100%-16px)] xs:p-3`}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
          <div className="order-1">
            <Heading level={2}>Data Alert Deforestasi</Heading>
          </div>

          <div className="order-2 sm:order-3">
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
                value={filterAlertType}
                onChange={onFilterAlertTypeChange}
                containerClassName="w-[calc(50%-4px)] sm:w-[120px] md:w-[130px] lg:w-[150px]"
                placeholder="Alert Type"
                options={alertTypeOptions}
              />
              <Select
                value={filterKabupaten}
                onChange={onFilterKabupatenChange}
                containerClassName="w-[calc(50%-4px)] sm:w-[120px] md:w-[130px] lg:w-[150px]"
                placeholder="Kabupaten"
                options={kabupatenOptions}
              />
              <Select
                value={filterKecamatan}
                onChange={onFilterKecamatanChange}
                containerClassName="w-[calc(50%-4px)] sm:w-[120px] md:w-[130px] lg:w-[150px]"
                placeholder="Kecamatan"
                options={kecamatanOptions}
              />
            </div>
          </div>

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

export default DataAlertDeforestasi;