'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useFormik } from 'formik';
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
import {
  createDevice as createDeviceService,
  deleteDevice as deleteDeviceService,
  getDeviceDetail,
  getDeviceList,
  updateDevice as updateDeviceService,
} from '@/services/device';
import WhatsAppService from '@/services/whatsapp';

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
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchDeviceData = async ({ page, page_size, search }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(page_size),
        ...(search ? { search } : {}),
      });

      const res = await getDeviceList(params);
      const data = res?.data?.data || res?.data;
      const results = data?.results || [];

      const mapped = results.map((item) => ({
        id: item.id,
        id_device: item.id_device,
        device_id: item.device_id,
        nama_device: item.nama,
        no_handphone: item.no_wa,
        status: item.terhubung ? 'Terhubung' : 'Tidak Terhubung',
      }));

      setDeviceData(mapped);
      setTotalDevice(data?.count ?? mapped.length);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error(error?.response?.data?.message || 'Gagal memuat data device');
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
      await deleteDeviceService(selectedItem.id);
      await fetchDeviceData({ page: currentPage, page_size: pageSize, search });
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

  const getDeviceId = (device) => {
    return device?.device_id || device?.id_device;
  };

  const generateQRCode = async (deviceData) => {
    setIsGeneratingQR(true);
    try {
      const whacenterId = getDeviceId(deviceData);
      if (!whacenterId) {
        toast.error('Device ID tidak ditemukan');
        return;
      }
      const qrUrl = WhatsAppService.getWhacenterQRCodeUrl(whacenterId);
      setQrCodeDataUrl(qrUrl);
      setSelectedItem(deviceData);
      setIsQRModalOpen(true);
    } catch (error) {
      console.error('Error opening QR code:', error);
      toast.error('Gagal membuka QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const checkDeviceStatusWhacenter = async (device) => {
    const deviceId = getDeviceId(device);
    if (!deviceId) return;
    try {
      const res = await WhatsAppService.getWhacenterDeviceStatus(deviceId);
      const data = res?.data || res;
      const statusVal =
        typeof data?.status === 'string'
          ? ['online', 'connected', 'true'].includes(data.status.toLowerCase())
          : data?.status ?? data?.connected ?? false;

      toast[statusVal ? 'success' : 'info'](
        statusVal ? 'Perangkat terhubung' : 'Perangkat belum terhubung'
      );

      try {
        const payload = {
          nama: device.nama_device,
          no_wa: device.no_handphone,
          id_device: device.id_device,
          device_id: device.device_id,
          terhubung: statusVal,
        };
        await updateDeviceService(device.id, payload);
      } catch (updateError) {
        console.error('Gagal update status di database:', updateError);
      }

      setDeviceData((prev) =>
        prev.map((d) =>
          d.id === device.id
            ? { ...d, status: statusVal ? 'Terhubung' : 'Tidak Terhubung' }
            : d
        )
      );
    } catch (error) {
      console.error('Gagal cek status perangkat:', error);
      toast.error('Gagal cek status perangkat');
    }
  };

  const relogDeviceWhacenter = async (device) => {
    const whacenterId = getDeviceId(device);
    if (!whacenterId) {
      toast.error('ID device tidak ditemukan');
      return;
    }
    try {
      setIsGeneratingQR(true);
      await WhatsAppService.relogWhacenterDevice(whacenterId);
      await new Promise((r) => setTimeout(r, 1500));
      const qrUrl = `${WhatsAppService.getWhacenterQRCodeUrl(
        whacenterId
      )}&_=${Date.now()}`;
      setQrCodeDataUrl(qrUrl);
      setSelectedItem(device);
      setIsQRModalOpen(true);
      toast.info('QR siap dipindai. Buka aplikasi WhatsApp untuk scan.');
    } catch (error) {
      console.error('Gagal relog perangkat:', error);
      toast.error('Gagal melakukan relog perangkat');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleQRModalClose = () => {
    setIsQRModalOpen(false);
    setQrCodeDataUrl('');
    setSelectedItem(null);
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
          className="py-1 text-xs font-bold text-primaryDark1 underline"
          onClick={() => checkDeviceStatusWhacenter(params.data)}
        >
          CEK STATUS
        </button>
        <button
          className="py-1 text-xs font-bold text-primaryDark1 underline"
          onClick={() => openDetailModal(params.data.id)}
        >
          EDIT
        </button>
        <button
          className="py-1 text-xs font-bold text-green8 underline"
          onClick={() => relogDeviceWhacenter(params.data)}
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
      minWidth: 180,
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

  const createSchemaValidation = Yup.object().shape({
    nama_device: Yup.string().required('Nama device harus diisi'),
    no_handphone: Yup.string().required('No handphone harus diisi'),
    device_id: Yup.string().required('Device ID harus diisi'),
  });

  const detailSchemaValidation = Yup.object().shape({
    nama_device: Yup.string().required('Nama device harus diisi'),
    no_handphone: Yup.string().required('No handphone harus diisi'),
    device_id: Yup.string().required('Device ID harus diisi'),
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
      device_id: '',
    },
    validationSchema: createSchemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const payload = {
          nama: values.nama_device,
          id_device: values.device_id,
          no_wa: values.no_handphone,
          terhubung: false,
        };

        const res = await createDeviceService(payload);
        if (res?.status && res.status >= 200 && res.status < 300) {
          toast.success('Berhasil menambahkan device');
          setIsOpen(false);
          resetForm();
          setCurrentPage(1);
          await fetchDeviceData({ page: 1, page_size: pageSize, search });
        }
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

  const openDetailModal = async (id) => {
    setIsLoadingDetail(true);
    setIsEditMode(false);
    try {
      const res = await getDeviceDetail(id);
      const data = res?.data?.data || res?.data || {};
      setDetailData(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error fetching device detail:', error);
      toast.error(
        error?.response?.data?.message || 'Gagal memuat detail device'
      );
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const {
    handleSubmit: handleDetailSubmit,
    values: detailValues,
    touched: detailTouched,
    errors: detailErrors,
    handleBlur: handleDetailBlur,
    handleChange: handleDetailChange,
    isSubmitting: isDetailSubmitting,
    resetForm: resetDetailForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      nama_device: detailData?.nama || '',
      no_handphone: detailData?.no_wa || '',
      id_device: detailData?.id_device || '',
      device_id: detailData?.device_id || '',
    },
    validationSchema: detailSchemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        setIsUpdating(true);
        const payload = {
          nama: values.nama_device,
          no_wa: values.no_handphone,
          id_device: detailData?.id_device,
          device_id: values.device_id,
          terhubung: detailData?.terhubung ?? false,
        };
        const res = await updateDeviceService(detailData?.id, payload);
        if (res?.status && res.status >= 200 && res.status < 300) {
          toast.success('Berhasil mengubah device');
          setIsEditMode(false);
          await fetchDeviceData({
            page: currentPage,
            page_size: pageSize,
            search,
          });
          const refreshed = await getDeviceDetail(detailData?.id);
          const refreshedData = refreshed?.data?.data || refreshed?.data || {};
          setDetailData(refreshedData);
          resetDetailForm({
            values: {
              nama_device: refreshedData?.nama || '',
              no_handphone: refreshedData?.no_wa || '',
              id_device: refreshedData?.id_device || '',
              device_id: refreshedData?.device_id || '',
            },
          });
        }
      } catch (error) {
        console.error('Error updating device:', error);
        toast.error(error?.response?.data?.message || 'Gagal mengubah data');
      } finally {
        setIsUpdating(false);
        setSubmitting(false);
      }
    },
  });

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setIsEditMode(false);
    setDetailData(null);
    resetDetailForm();
  };

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      {/* Detail/Edit Modal */}
      <BaseModal
        open={isDetailModalOpen}
        setOpen={handleDetailClose}
        isShowLabel={false}
        isShowCloseIcon={false}
        className="flex max-w-md flex-col"
      >
        <form onSubmit={handleDetailSubmit}>
          <Heading
            level={4}
            className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl"
          >
            {isEditMode ? 'UBAH DATA DEVICE' : 'DETAIL DEVICE'}
          </Heading>

          {isLoadingDetail ? (
            <div className="my-6 flex items-center justify-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="my-4 flex flex-col gap-4">
              <InputText
                label={'Nama Device'}
                name="nama_device"
                placeholder="Masukan nama device"
                value={detailValues.nama_device}
                onChange={handleDetailChange}
                onBlur={handleDetailBlur}
                errors={detailErrors}
                touched={detailTouched}
                disabled={!isEditMode}
              />
              <InputText
                label={'No. Whatsapp'}
                name="no_handphone"
                placeholder="masukan no. whatsapp"
                value={detailValues.no_handphone}
                onChange={handleDetailChange}
                onBlur={handleDetailBlur}
                errors={detailErrors}
                touched={detailTouched}
                disabled={!isEditMode}
              />
              <InputText
                label={'Device ID (API Key)'}
                name="device_id"
                placeholder="Masukkan device_id Whacenter"
                value={detailValues.device_id}
                onChange={handleDetailChange}
                onBlur={handleDetailBlur}
                errors={detailErrors}
                touched={detailTouched}
                disabled={!isEditMode}
              />
            </div>
          )}

          <div className="flex justify-between gap-3">
            <button
              type="button"
              className="py-1 text-xs font-bold text-primaryDark1 underline"
              onClick={() => setIsEditMode((prev) => !prev)}
            >
              UBAH DATA
            </button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="danger"
                onClick={handleDetailClose}
              >
                Tutup
              </Button>
              {isEditMode && (
                <Button
                  type="submit"
                  disabled={isDetailSubmitting || isUpdating}
                >
                  {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </BaseModal>

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
            <InputText
              label={'Device ID (API Key)'}
              name="device_id"
              placeholder="Masukkan device_id Whacenter"
              value={values.device_id}
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
        itemName={`Apakah Anda ingin menghapus device ${selectedItem?.nama_device}`}
        isLoading={isDeleting}
      />

      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-col gap-1">
            <Heading
              className=" flex flex-1 uppercase tracking-[2px]"
              level={3}
            >
              DEVICE
            </Heading>
            <Paragraph level={3}>
              Maksimal device atau perangkat yang bisa terhubung adalah 5 device
            </Paragraph>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
              isDisabled={totalDevice >= 5}
            >
              Tambah Device
            </Button>
          </div>
        </div>

        {/* Table section */}
        <div className="relative w-full flex-1 overflow-x-auto">
          <SectionLoading loading={loading} />
          <div className="min-w-[320px]">
            <AgGridReact
              loading={loading}
              columnDefs={colDefs}
              overlayLoadingTemplate="."
              autoSizeStrategy={autoSizeStrategy}
              domLayout="autoHeight"
              rowHeight={36}
              rowData={deviceData}
            />
          </div>
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
