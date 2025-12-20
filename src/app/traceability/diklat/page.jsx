'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useFormik } from 'formik';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BaseModal from '@/components/molecules/Modal';
import SearchBar from '@/components/molecules/SearchBar';
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

  const fetchDiklatData = async ({ page, page_size, search, kelompok }) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size,
        ...(search && { search }),
        ...(kelompok && { kelompok_tani: kelompok }),
      };

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
    fetchDiklatData({
      page: currentPage,
      page_size: pageSize,
      search,
      kelompok: selectedKelompok,
    });
  }, [currentPage, pageSize, search, selectedKelompok]);

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
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues: {
      sl: null,
      pnc: null,
      pestisida: null,
      k3: null,
      sop: null,
      pdg: null,
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedId) return;

      try {
        setSubmitting(true);
        const payload = {
          sl: values.sl,
          pnc: values.pnc,
          pestisida: values.pestisida,
          k3: values.k3,
          sop: values.sop,
          pdg: values.pdg,
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
          pnc: detail.pnc ?? detail.pc_rspo_ispo,
          pestisida: detail.pestisida,
          k3: detail.k3,
          sop: detail.sop,
          pdg: detail.pdg ?? detail.fgd,
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
        className={`text-xs font-medium ${
          isSuccess ? 'text-green-600' : 'text-red-600'
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
        field: 'kelompok',
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

  const StatCard = ({
    title,
    value,
    bgColor = 'bg-white',
    textColor = 'text-green8',
  }) => (
    <div className={`${bgColor} rounded-lg border p-4`}>
      <div className={`mb-1 text-sm font-medium ${textColor}`}>{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full min-w-[320px] max-w-full">
      <BaseModal
        open={isOpen}
        setOpen={handleCancel}
        isShowLabel={false}
        isShowCloseIcon={false}
        className="flex max-w-md flex-col"
      >
        <form onSubmit={handleSubmit}>
          <Heading
            level={4}
            className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl"
          >
            UBAH STATUS DIKLAT
          </Heading>
          <div className="my-4 flex gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <Select
                label="SL"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih SL"
                options={statusOption}
                value={values.sl}
                onChange={(e) => setFieldValue('sl', e.target.value)}
              />
              <Select
                label="Pestisida"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih pestisida"
                options={statusOption}
                value={values.pestisida}
                onChange={(e) => setFieldValue('pestisida', e.target.value)}
              />
              <Select
                label="SOP"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih SOP"
                options={statusOption}
                value={values.sop}
                onChange={(e) => setFieldValue('sop', e.target.value)}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <Select
                label="P&C (RSPO/ISPO)"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih P&C (RSPO/ISPO)"
                options={statusOption}
                value={values.pnc}
                onChange={(e) => setFieldValue('pnc', e.target.value)}
              />
              <Select
                label="K3"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih K3"
                options={statusOption}
                value={values.k3}
                onChange={(e) => setFieldValue('k3', e.target.value)}
              />
              <Select
                label="FGD"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih FGD"
                options={statusOption}
                value={values.pdg}
                onChange={(e) => setFieldValue('pdg', e.target.value)}
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
                  placeholder="Cari..."
                  className="w-full sm:w-auto lg:w-[200px]"
                />

                <Select
                  containerClassName="w-full sm:w-auto lg:w-[150px]"
                  placeholder="Kelompok"
                  options={kelompokOptions}
                  value={selectedKelompok}
                  onChange={handleKelompokChange}
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
            <StatCard title="SL" value={statistik.sl} />
            <StatCard title="P&C (RSPO/ISPO)" value={statistik.pcRspoIspo} />
            <StatCard title="Pestisida" value={statistik.pestisida} />
            <StatCard title="K3" value={statistik.k3} />
            <StatCard title="SOP" value={statistik.sop} />
            <StatCard title="FDG" value={statistik.fdg} />
          </div>
        </div>

        <div className="relative flex max-h-[60vh] min-h-[350px] w-full flex-col overflow-hidden">
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
