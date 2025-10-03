'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useFormik } from 'formik';
import debounce from 'lodash/debounce';
import { DownloadCloudIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BaseModal from '@/components/molecules/Modal';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Pagination from '@/components/organisms/Pagination';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const kelompokOptions = [
  { label: 'Bepekaek Besamo', value: 'bepekaek_besamo' },
  { label: 'Kelompok A', value: 'kelompok_a' },
  { label: 'Kelompok B', value: 'kelompok_b' },
];

const statusOption = [
  { label: 'Sudah', value: 'sudah' },
  { label: 'Belum', value: 'belum' },
];

const DiklatPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [diklatData, setDiklatData] = useState([]);
  const [totalDiklat, setTotalDiklat] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [statistik, setStatistik] = useState({
    sl: 130,
    pcRspoIspo: 120,
    pestisida: 74,
    k3: 122,
    sop: 0,
    fdg: 43,
  });

  // Fetch diklat data function
  const fetchDiklatData = async ({ page, page_size, search, kelompok }) => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockData = Array.from({ length: page_size }, (_, i) => {
        const id = `001-APKS-001-001`;
        const jenisKelamin = Math.random() > 0.5 ? 'Laki - Laki' : 'Perempuan';
        const getRandomStatus = () => (Math.random() > 0.3 ? 'Sudah' : 'Belum');

        return {
          id_petani: id,
          nama_petani: 'Agustinus Nery',
          jenis_kelamin: jenisKelamin,
          kelompok: 'Bepekaek Besamo',
          sl: getRandomStatus(),
          pc_rspo_ispo: getRandomStatus(),
          pestisida: getRandomStatus(),
          k3: getRandomStatus(),
          sop: getRandomStatus(),
          pdg: getRandomStatus(),
        };
      });

      setDiklatData(mockData);
      setTotalDiklat(500);
    } catch (error) {
      toast.error('Gagal memuat data diklat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiklatData({
      page: currentPage,
      page_size: pageSize,
      search,
      kelompok: selectedKelompok,
    });
  }, [currentPage, pageSize, search, selectedKelompok]);

  const handleSearchTextChange = useCallback(
    debounce((e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleKelompokChange = (e) => {
    setSelectedKelompok(e.target.value);
    setCurrentPage(1);
  };

  const handleChangeStatus = (e) => {
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

  const handleUbahClicked = (data) => {
    // Navigate to edit page or show modal
    setIsOpen(true);
    console.log('Ubah clicked for:', data);
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
    const isSuccess = status === 'Sudah';

    return (
      <span
        className={`text-xs font-medium ${
          isSuccess ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {status}
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
        field: 'pc_rspo_ispo',
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

  const schemaValidation = Yup.object().shape({
    nama_device: Yup.string().required('Nama device harus diisi'),
    no_handphone: Yup.string().required('No handphone harus diisi'),
  });

  const {
    handleSubmit,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues: {
      nama_device: '',
      no_handphone: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const deviceData = {
          nama_device: values.nama_device,
          no_handphone: values.no_handphone,
        };
        console.log('Saving device:', deviceData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add new device to the list
        const newDevice = {
          id: Date.now(),
          id_device: `DV-${String(deviceData.length + 1).padStart(4, '0')}`,
          nama_device: deviceData.nama_device,
          no_handphone: deviceData.no_handphone,
          status: 'Tidak Terhubung',
        };

        setDeviceData((prev) => [newDevice, ...prev]);
        setTotalDevice((prev) => prev + 1);

        setIsOpen(false);
        resetForm();
        toast.success('Berhasil menambahkan device');
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    setIsOpen(false);
    resetForm();
  };

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
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
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
                value={selectedStatus}
                onChange={handleKelompokChange}
              />
              <Select
                label="Pestisida"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih pestisida"
                options={statusOption}
                value={selectedStatus}
                onChange={handleKelompokChange}
              />
              <Select
                label="SOP"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih SOP"
                options={statusOption}
                value={selectedStatus}
                onChange={handleKelompokChange}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <Select
                label="P&C (RSPO/ISPO)"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih P&C (RSPO/ISPO)"
                options={statusOption}
                value={selectedStatus}
                onChange={handleKelompokChange}
              />
              <Select
                label="K3"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih K3"
                options={statusOption}
                value={selectedStatus}
                onChange={handleKelompokChange}
              />
              <Select
                label="FGD"
                containerClassName="w-full sm:w-auto lg:w-full"
                placeholder="Pilih FGD"
                options={statusOption}
                value={selectedStatus}
                onChange={handleKelompokChange}
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
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              DIKLAT
            </Heading>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              {/* === SEARCH FILTER === */}
              <div className="grid w-full grid-cols-1 items-center gap-2 sm:w-auto sm:grid-cols-2 lg:flex lg:flex-row">
                <SearchBar
                  onChange={handleSearchTextChange}
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
              <div className="flex flex-row items-center justify-end gap-2">
                <Button
                  className="!px-2 sm:!px-3"
                  icon={<DownloadCloudIcon size={18} />}
                  title="Export Excel"
                  onClick={() => toast.info('Export Excel clicked')}
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

        <div className="relative w-full flex-1">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={diklatData}
            columnDefs={colDefs}
          />
        </div>

        <div className="flex justify-center sm:justify-end">
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
  );
};

export default DiklatPage;
