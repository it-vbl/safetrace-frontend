'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import SearchBar from '@/components/molecules/SearchBar';
import StatCard from '@/components/molecules/StatCard';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';

import useReferences from '../../../hooks/useReferences';
import {
  downloadListDiklat,
  getDetailDiklat,
  getListDiklat,
  getStatistikDiklat,
  updateDiklat,
} from '../../../services/petani';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const statusOption = [
  { label: 'Sudah', value: true },
  { label: 'Belum', value: false },
];

const DiklatPage = () => {
  const { kelompokTani, fetchKelompokTani } = useReferences();

  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [diklatData, setDiklatData] = useState([]);
  const [totalDiklat, setTotalDiklat] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [cardFilters, setCardFilters] = useState({
    sl: false,
    pnc: false,
    pestida: false,
    k3: false,
    sop: false,
    pdg: false,
  });

  const handleToggleCardFilter = (key) => {
    setCardFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1);
  };

  const [statistik, setStatistik] = useState({
    sl: 0,
    pcRspoIspo: 0,
    pestisida: 0,
    k3: 0,
    sop: 0,
    fdg: 0,
  });

  useEffect(() => {
    fetchKelompokTani();
  }, [fetchKelompokTani]);

  // Auto-apply kelompok tani filter based on logged-in user
  const [isKetuaKelompokTani, setIsKetuaKelompokTani] = useState(false);
  const [isKelompokFilterInitialized, setIsKelompokFilterInitialized] =
    useState(false);

  useEffect(() => {
    const ketuaKelompokTani = Cookies.get('ketua_kelompok_tani');
    if (ketuaKelompokTani && kelompokTani && kelompokTani.length > 0) {
      const kelompokOption = kelompokTani.find(
        (kelompok) => kelompok.label === ketuaKelompokTani
      );
      if (kelompokOption) {
        setSelectedKelompok(kelompokOption.value);
        setIsKetuaKelompokTani(true);
        setTimeout(() => setIsKelompokFilterInitialized(true), 100);
      } else {
        setIsKelompokFilterInitialized(true);
      }
    } else {
      setIsKelompokFilterInitialized(true);
    }
  }, [kelompokTani]);

  const kelompokOptions = useMemo(() => {
    return (
      kelompokTani?.map((item) => ({
        label: item.label,
        value: item.value,
      })) || []
    );
  }, [kelompokTani]);

  const fetchStatistik = async () => {
    try {
      const response = await getStatistikDiklat();
      if (response?.data?.data) {
        const data = response.data.data;
        setStatistik({
          sl: data.sl?.sudah || 0,
          pcRspoIspo: data.pnc?.sudah || data.pc_rspo_ispo?.sudah || 0,
          pestisida: data.pestisida?.sudah || 0,
          k3: data.k3?.sudah || 0,
          sop: data.sop?.sudah || 0,
          fdg: data.pdg?.sudah || data.fdg?.sudah || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch statistics', error);
    }
  };

  const fetchDiklatData = async ({ page, page_size, search, kelompok, cardFilters }) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size,
        ...(search && { search }),
        ...(kelompok && { kelompok_tani: kelompok }),
      };
      if (cardFilters) {
        Object.keys(cardFilters).forEach((key) => {
          if (cardFilters[key]) {
            params[key] = true;
          }
        });
      }

      const response = await getListDiklat(params);
      if (response?.status === 200) {
        const data = response?.data?.data;
        setDiklatData(data?.results || []);
        setTotalDiklat(Number(data?.count || 0));
      } else {
        setDiklatData([]);
        setTotalDiklat(0);
      }
    } catch (error) {
      toast.error('Gagal memuat data diklat');
      setDiklatData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistik();
  }, []);

  useEffect(() => {
    if (isKelompokFilterInitialized) {
      fetchDiklatData({
        page: currentPage,
        page_size: pageSize,
        search,
        kelompok: selectedKelompok,
        cardFilters,
      });
    }
  }, [
    isKelompokFilterInitialized,
    currentPage,
    pageSize,
    search,
    selectedKelompok,
    cardFilters,
  ]);

  const handleSearchTextChange = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleKelompokChange = (e) => {
    setSelectedKelompok(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleExportExcel = async () => {
    try {
      const params = {
        ...(search && { search }),
        ...(selectedKelompok && { kelompok_tani: selectedKelompok }),
      };

      const response = await downloadListDiklat(params);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/csv' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `data-diklat-${moment().format('YYYY-MM-DD-HH-mm')}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      toast.error('Gagal mengunduh data');
    }
  };

  const {
    handleSubmit,
    values,
    setValues,
    setFieldValue,
    handleChange,
    handleBlur,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues: {
      sl: null,
      sl_trainer: '',
      pnc: null,
      pnc_trainer: '',
      pestisida: null,
      pestisida_trainer: '',
      k3: null,
      k3_trainer: '',
      sop: null,
      sop_trainer: '',
      pdg: null,
      pdg_trainer: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedId) return;

      try {
        setSubmitting(true);
        const payload = {
          sl: values.sl,
          sl_trainer: values.sl_trainer || null,
          pnc: values.pnc,
          pnc_trainer: values.pnc_trainer || null,
          pestisida: values.pestisida,
          pestisida_trainer: values.pestisida_trainer || null,
          k3: values.k3,
          k3_trainer: values.k3_trainer || null,
          sop: values.sop,
          sop_trainer: values.sop_trainer || null,
          pdg: values.pdg,
          pdg_trainer: values.pdg_trainer || null,
        };

        const response = await updateDiklat(selectedId, payload);

        if (
          response?.status === 200 ||
          response?.status === 204 ||
          response?.data?.status === 'success'
        ) {
          toast.success('Berhasil mengubah data diklat');

          setDiklatData((prev) =>
            prev.map((item) =>
              item.id === selectedId ? { ...item, ...payload } : item
            )
          );

          setIsOpen(false);
          resetForm();
          setSelectedId(null);
          fetchDiklatData({
            page: currentPage,
            page_size: pageSize,
            search,
            kelompok: selectedKelompok,
          });
          fetchStatistik();
        } else {
          toast.error(response?.data?.message || 'Gagal mengubah data');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleUbahClicked = async (data) => {
    setSelectedId(data.id);
    setIsOpen(true);

    try {
      const res = await getDetailDiklat(data.id);
      if (res?.data?.data) {
        const detail = res.data.data;
        setValues({
          sl: detail.sl,
          sl_trainer: detail.sl_trainer || '',
          pnc: detail.pnc ?? detail.pc_rspo_ispo,
          pnc_trainer: detail.pnc_trainer || detail.pc_rspo_ispo_trainer || '',
          pestisida: detail.pestisida,
          pestisida_trainer: detail.pestisida_trainer || '',
          k3: detail.k3,
          k3_trainer: detail.k3_trainer || '',
          sop: detail.sop,
          sop_trainer: detail.sop_trainer || '',
          pdg: detail.pdg ?? detail.fgd,
          pdg_trainer: detail.pdg_trainer || detail.fgd_trainer || '',
        });
      }
    } catch (error) {
      toast.error('Gagal memuat detail data');
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    resetForm();
    setSelectedId(null);
  };

  const ActionsCellRenderer = useCallback((e) => {
    return (
      <div className="flex h-full w-full flex-row items-center justify-center gap-1 sm:gap-2">
        <div
          className="cursor-pointer text-[10px] font-bold uppercase text-blue-600 underline hover:text-blue-800 sm:text-[12px]"
          onClick={() => handleUbahClicked(e.data)}
        >
          UBAH
        </div>
      </div>
    );
  }, []);

  const StatusCellRenderer = useCallback((params) => {
    const status = params.value;
    let isSuccess = false;
    let label = '-';

    if (typeof status === 'boolean') {
      isSuccess = status;
      label = status ? 'Sudah' : 'Belum';
    } else if (typeof status === 'string') {
      isSuccess = status.toLowerCase() === 'sudah';
      label = status;
    }

    return (
      <span
        className={`text-xs font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'
          }`}
      >
        {label}
      </span>
    );
  }, []);

  const colDefs = useMemo(
    () => [
      {
        field: 'actions',
        headerName: '',
        cellRenderer: ActionsCellRenderer,
        width: 80,
        minWidth: 70,
        maxWidth: 100,
        suppressSizeToFit: false,
        pinned: 'left',
      },
      {
        field: 'id_petani',
        headerName: 'Id Petani',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'nama_petani',
        headerName: 'Nama Petani',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'jenis_kelamin',
        headerName: 'Jenis Kelamin',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'nama_kelompok',
        headerName: 'Kelompok',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'sl',
        headerName: 'SL',
        flex: 0.6,
        minWidth: 80,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: 'pnc',
        headerName: 'P&C (RSPO/ISPO)',
        flex: 1,
        minWidth: 130,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: 'pestisida',
        headerName: 'Pestisida',
        flex: 0.8,
        minWidth: 100,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: 'k3',
        headerName: 'K3',
        flex: 0.6,
        minWidth: 80,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: 'sop',
        headerName: 'SOP',
        flex: 0.6,
        minWidth: 80,
        cellRenderer: StatusCellRenderer,
      },
      {
        field: 'pdg',
        headerName: 'PDG',
        flex: 0.6,
        minWidth: 80,
        cellRenderer: StatusCellRenderer,
      },
    ],
    [ActionsCellRenderer, StatusCellRenderer]
  );

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      minWidth: 100,
      wrapText: true,
      autoHeight: true,
    }),
    []
  );

  // const StatCard = ({
  //   title,
  //   value,
  //   isActive,
  //   onClick,
  // }) => (
  //   <div
  //     onClick={onClick}
  //     className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ease-out
  //       ${onClick ? 'cursor-pointer' : ''}
  //       ${isActive
  //         ? 'border-green8 bg-[#F0FDF4] shadow-[0_4px_12px_rgba(0,0,0,0.05)] -translate-y-[2px]'
  //         : 'border-gray-200 bg-white hover:border-green8/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-[1px]'
  //       }
  //     `}
  //   >
  //     {/* Subtle Top Border Indicator when active */}
  //     <div
  //       className={`absolute left-0 top-0 h-1 w-full transition-all duration-300 ${isActive ? 'bg-green8 opacity-100' : 'bg-transparent opacity-0'
  //         }`}
  //     />

  //     <div className="relative z-10 flex flex-col gap-1">
  //       <div
  //         className={`text-xs font-medium tracking-wide transition-colors duration-300 sm:text-sm ${isActive ? 'text-green8' : 'text-gray-500 group-hover:text-gray-700'
  //           }`}
  //       >
  //         {title}
  //       </div>
  //       <div
  //         className={`text-xl font-bold transition-colors duration-300 sm:text-2xl ${isActive ? 'text-gray-900' : 'text-gray-800'
  //           }`}
  //       >
  //         {value}
  //       </div>
  //     </div>

  //     {/* Indicator Dot */}
  //     <div
  //       className={`absolute -right-2 -top-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all duration-500 ${isActive ? 'scale-100 bg-green8/10 opacity-100' : 'scale-50 opacity-0'
  //         }`}
  //     >
  //       <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green8" />
  //     </div>
  //   </div>
  // );

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full min-w-[320px] max-w-full">
      <BaseModal
        open={isOpen}
        setOpen={handleCancel}
        isShowLabel={false}
        isShowCloseIcon={false}
        className="flex max-w-2xl flex-col"
      >
        <form onSubmit={handleSubmit}>
          <Heading
            level={4}
            className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl"
          >
            UBAH STATUS DIKLAT
          </Heading>
          <div className="my-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* SL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 border-gray-100">
              <Select
                label="SL"
                containerClassName="w-full"
                placeholder="Pilih SL"
                options={statusOption}
                value={values.sl}
                onChange={(e) => setFieldValue('sl', e.target.value)}
              />
              <InputText
                label="SL Trainer"
                name="sl_trainer"
                placeholder="Masukkan nama trainer"
                value={values.sl_trainer}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* P&C */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 border-gray-100">
              <Select
                label="P&C (RSPO/ISPO)"
                containerClassName="w-full"
                placeholder="Pilih P&C"
                options={statusOption}
                value={values.pnc}
                onChange={(e) => setFieldValue('pnc', e.target.value)}
              />
              <InputText
                label="P&C Trainer"
                name="pnc_trainer"
                placeholder="Masukkan nama trainer"
                value={values.pnc_trainer}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* K3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 border-gray-100">
              <Select
                label="K3"
                containerClassName="w-full"
                placeholder="Pilih K3"
                options={statusOption}
                value={values.k3}
                onChange={(e) => setFieldValue('k3', e.target.value)}
              />
              <InputText
                label="K3 Trainer"
                name="k3_trainer"
                placeholder="Masukkan nama trainer"
                value={values.k3_trainer}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* SOP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 border-gray-100">
              <Select
                label="SOP"
                containerClassName="w-full"
                placeholder="Pilih SOP"
                options={statusOption}
                value={values.sop}
                onChange={(e) => setFieldValue('sop', e.target.value)}
              />
              <InputText
                label="SOP Trainer"
                name="sop_trainer"
                placeholder="Masukkan nama trainer"
                value={values.sop_trainer}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* FGD/PDG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 border-gray-100">
              <Select
                label="FGD"
                containerClassName="w-full"
                placeholder="Pilih FGD"
                options={statusOption}
                value={values.pdg}
                onChange={(e) => setFieldValue('pdg', e.target.value)}
              />
              <InputText
                label="FGD Trainer"
                name="pdg_trainer"
                placeholder="Masukkan nama trainer"
                value={values.pdg_trainer}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* Pestisida */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 border-gray-100">
              <Select
                label="Pestisida"
                containerClassName="w-full"
                placeholder="Pilih Pestisida"
                options={statusOption}
                value={values.pestisida}
                onChange={(e) => setFieldValue('pestisida', e.target.value)}
              />
              <InputText
                label="Pestisida Trainer"
                name="pestisida_trainer"
                placeholder="Masukkan nama trainer"
                value={values.pestisida_trainer}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="danger" onClick={handleCancel}>
              Batalkan
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </BaseModal>

      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          {/* === HEADER === */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <Heading
              className=" flex flex-1 uppercase tracking-[2px]"
              level={3}
            >
              DIKLAT
            </Heading>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* === SEARCH FILTER === */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
                <SearchBar
                  onChange={(e) => handleSearchTextChange(e.target.value)}
                  placeholder="Cari Petani"
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[150px]"
                  placeholder="Kelompok"
                  options={kelompokOptions}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
                  disabled={isKetuaKelompokTani}
                />
              </div>

              {/* === ACTION BUTTON === */}
              <div className="flex flex-row flex-wrap items-center justify-end gap-2">
                <Button
                  className="!px-2 sm:!px-3"
                  icon={<DownloadCloudIcon size={18} />}
                  title="Export Excel"
                  onClick={handleExportExcel}
                />
              </div>
            </div>
          </div>

          {/* === STATISTICS CARDS === */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard title="SL" value={statistik.sl} isActive={cardFilters.sl} onClick={() => handleToggleCardFilter('sl')} />
            <StatCard title="P&C (RSPO/ISPO)" value={statistik.pcRspoIspo} isActive={cardFilters.pnc} onClick={() => handleToggleCardFilter('pnc')} />
            <StatCard title="Pestisida" value={statistik.pestisida} isActive={cardFilters.pestida} onClick={() => handleToggleCardFilter('pestida')} />
            <StatCard title="K3" value={statistik.k3} isActive={cardFilters.k3} onClick={() => handleToggleCardFilter('k3')} />
            <StatCard title="SOP" value={statistik.sop} isActive={cardFilters.sop} onClick={() => handleToggleCardFilter('sop')} />
            <StatCard title="FDG" value={statistik.fdg} isActive={cardFilters.pdg} onClick={() => handleToggleCardFilter('pdg')} />
          </div>
        </div>

        <div className="relative flex min-h-[350px] w-full flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <SectionLoading loading={loading} />
            <AgGridReact
              loading={loading}
              overlayLoadingTemplate="."
              autoSizeStrategy={autoSizeStrategy}
              defaultColDef={defaultColDef}
              domLayout="normal"
              rowData={diklatData}
              columnDefs={colDefs}
            />
          </div>
          <div className="sticky bottom-0 mt-2 flex w-full justify-center sm:justify-end">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalDiklat}
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
    </div>
  );
};

export default DiklatPage;
