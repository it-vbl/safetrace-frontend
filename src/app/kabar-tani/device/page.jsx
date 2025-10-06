'use client';
import { useCallback, useEffect, useMemo,useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useFormik } from 'formik';
import QRCode from 'qrcode';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';

ModuleRegistry.registerModules([AllCommunityModule]);

const DevicePage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deviceData, setDeviceData] = useState([]);
  const [totalDevice, setTotalDevice] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // QR Code Modal States
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const fetchDeviceData = async ({ page, page_size, search }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allData = [
        {
          id: 1,
          id_device: 'DV-0001',
          nama_device: 'Fajar Sukmara Device',
          no_handphone: '081234567890',
          status: 'Terhubung',
        },
        {
          id: 2,
          id_device: 'DV-0002',
          nama_device: 'Fajar Sukmara Device',
          no_handphone: '081234567890',
          status: 'Tidak Terhubung',
        },
        ...Array(48)
          .fill(null)
          .map((_, index) => ({
            id: index + 3,
            id_device: `DV-${String(index + 3).padStart(4, '0')}`,
            nama_device: 'Fajar Sukmara Device',
            no_handphone: '081234567890',
            status: 'Terhubung',
          })),
      ];
      const filteredData = allData.filter((item) =>
        item.nama_device.toLowerCase().includes(search.toLowerCase())
      );
      const startIndex = (page - 1) * page_size;
      const pagedData = filteredData.slice(startIndex, startIndex + page_size);
      setDeviceData(pagedData);
      setTotalDevice(filteredData.length);
    } catch (error) {
      setDeviceData([]);
      setTotalDevice(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData({ page: currentPage, page_size: pageSize, search });
  }, [currentPage, pageSize, search]);

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDeviceData((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setTotalDevice((prev) => prev - 1);
      console.log('Data berhasil dihapus:', selectedItem);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      toast.success('Data berhasil dihapus');
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

  // QR Code Functions
  const generateQRCode = async (deviceData) => {
    setIsGeneratingQR(true);
    try {
      // Create QR code data (you can customize this based on your needs)
      const qrData = {
        device_id: deviceData.id_device,
        nama_device: deviceData.nama_device,
        no_handphone: deviceData.no_handphone,
        timestamp: new Date().toISOString(),
        // Add any other data needed for device connection
        connection_url: `https://yourapp.com/connect/${deviceData.id_device}`,
      };

      const qrString = JSON.stringify(qrData);

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrCodeDataUrl(qrDataUrl);
      setSelectedItem(deviceData);
      setIsQRModalOpen(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Gagal generate QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleQRModalClose = () => {
    setIsQRModalOpen(false);
    setQrCodeDataUrl('');
    setSelectedItem(null);
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl || !selectedItem) return;

    const link = document.createElement('a');
    link.download = `QR_${selectedItem.id_device}_${selectedItem.nama_device}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('QR Code berhasil didownload');
  };

  const actionsCellRenderer = (params) => {
    return (
      <div className="flex h-full items-center gap-2">
        <button
          className="py-1 text-xs font-bold text-primaryDark1 underline"
          onClick={() => generateQRCode(params.data)}
          disabled={isGeneratingQR}
        >
          {isGeneratingQR ? 'LOADING...' : 'SCAN QR'}
        </button>
        <button
          className="py-1 text-xs font-bold text-green8 underline"
          onClick={() => {
            router.push(
              `/kabar-tani/blast-pesan/${params.data.id}/detail-pesan`
            );
          }}
        >
          RELOG
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
      flex: 1.5,
      minWidth: 150,
      sortable: false,
      filter: false,
    },
    {
      field: 'id_device',
      headerName: 'Id Device',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'nama_device',
      headerName: 'Nama Device',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'no_handphone',
      headerName: 'No. Handphone',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      cellRenderer: (params) => {
        const status = params.value;
        const statusClass =
          status === 'Terhubung'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';

        return (
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
          >
            {status}
          </div>
        );
      },
    },
  ];

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

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      {/* Add Device Modal */}
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
            TAMBAH DEVICE
          </Heading>
          <div className="my-4 flex flex-col gap-4">
            <InputText
              label={'Nama Device'}
              name="nama_device"
              placeholder="Masukan nama device"
              value={values.nama_device}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
            <InputText
              label={'No. Whatsapp'}
              name="no_handphone"
              placeholder="masukan no. whatsapp"
              value={values.no_handphone}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
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

      {/* QR Code Modal */}
      <BaseModal
        open={isQRModalOpen}
        setOpen={handleQRModalClose}
        isShowLabel={false}
        isShowCloseIcon={false}
        className="flex max-w-md flex-col"
      >
        <div className="text-center">
          <Heading
            level={4}
            className="mb-4 text-left text-lg font-bold text-gray-800 sm:text-xl md:text-2xl"
          >
            SCAN QR
          </Heading>

          <div className="mb-6 flex justify-center">
            {qrCodeDataUrl ? (
              <div className="rounded-lg border-2 border-gray-200 p-4">
                <img src={qrCodeDataUrl} alt="QR Code" className="h-64 w-64" />
              </div>
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Generating QR Code...
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="danger" onClick={handleQRModalClose}>
              Batalkan
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={`Apakah Anda ingin menghapus device "${selectedItem?.nama_device}"`}
        isLoading={isDeleting}
      />

      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-col gap-1">
            <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
              DEVICE
            </Heading>
            <Paragraph level={3}>
              Maksimal device atau perangkat yang bisa terhubung adalah 10
              device
            </Paragraph>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Tambah Device
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
            rowData={deviceData}
          />
        </div>

        {/* Pagination section */}
        <div className="flex justify-center sm:justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalDevice}
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

export default DevicePage;
