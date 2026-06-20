'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { PlusIcon } from 'lucide-react';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import ModalConfirmation from '@/components/molecules/ModalConfirmation';
import SectionLoading from '@/components/molecules/SectionLoading';
import ModalTambahPetaOverlay from '@/components/organisms/Modal/ModalTambahPetaOverlay';
import { useMobileScreen } from '@/hooks/useMobileScreen';
import {
  createPetaOverlay,
  deletePetaOverlay,
  getPetaOverlayList,
  updatePetaOverlay,
} from '@/services/petaOverlay';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const PetaOverlayPage = () => {
  // Dynamically import ModalMapPreview to avoid Leaflet SSR issues
  const ModalMapPreview = useMemo(
    () =>
      dynamic(() => import('@/components/organisms/Modal/ModalMapPreview'), {
        ssr: false,
      }),
    []
  );

  const isMobile = useMobileScreen();
  const [showModalTambahPetaOverlay, setShowModalTambahPetaOverlay] =
    useState(false);
  const [showModalMapPreview, setShowModalMapPreview] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [showModalDeleteConfirmation, setShowModalDeleteConfirmation] =
    useState(false);
  const [layerToDelete, setLayerToDelete] = useState(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [layerToEdit, setLayerToEdit] = useState(null);

  const [uploadedStaticLayers, setUploadedStaticLayers] = useState([]);
  const [uploadedLoading, setUploadedLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setUploadedLoading(true);
    try {
      const res = await getPetaOverlayList();
      const data = res?.data?.data || res?.data || {};
      const results = data?.results || [];
      setUploadedStaticLayers(results);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Gagal mengambil daftar layer'
      );
      setUploadedStaticLayers([]);
    } finally {
      setUploadedLoading(false);
    }
  }, []);

  useMemo(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteLayer = useCallback((data) => {
    setLayerToDelete(data);
    setShowModalDeleteConfirmation(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!layerToDelete) return;

    try {
      await deletePetaOverlay(layerToDelete.id);
      toast.success('Layer berhasil dihapus');
      setShowModalDeleteConfirmation(false);
      setLayerToDelete(null);
      fetchList();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menghapus layer');
    }
  }, [layerToDelete, fetchList]);

  const handleFileDownload = useCallback((fileUrl) => {
    // Open the file URL in a new tab for download
    window.open(fileUrl, '_blank');
  }, []);

  const handleViewLayer = useCallback((data) => {
    setSelectedLayerId(data.id);
    setShowModalMapPreview(true);
  }, []);

  const handleEditLayer = useCallback((data) => {
    setLayerToEdit(data);
    setShowModalEdit(true);
  }, []);

  const ActionsCellRenderer = useCallback(
    (e) => {
      return (
        <div className="flex h-full w-full flex-row items-center justify-center gap-1 sm:gap-2">
          <div
            className="cursor-pointer text-[10px] font-bold uppercase text-blue-500 underline hover:text-blue-600 sm:text-[12px]"
            onClick={() => handleViewLayer(e.data)}
          >
            LIHAT
          </div>
          <div className="text-gray-400">|</div>
          <div
            className="cursor-pointer text-[10px] font-bold uppercase text-blue-500 underline hover:text-blue-600 sm:text-[12px]"
            onClick={() => handleEditLayer(e.data)}
          >
            EDIT
          </div>
          <div className="text-gray-400">|</div>
          <div
            className="cursor-pointer text-[10px] font-bold uppercase text-red-500 underline hover:text-red-600 sm:text-[12px]"
            onClick={() => handleDeleteLayer(e.data)}
          >
            HAPUS
          </div>
        </div>
      );
    },
    [handleDeleteLayer, handleViewLayer, handleEditLayer]
  );

  const FileCellRenderer = useCallback(
    (e) => {
      const fileName = e.value.split('/').pop(); // Extract filename from URL
      return (
        <div
          className="cursor-pointer text-gray-800 underline hover:text-blue-800"
          onClick={() => handleFileDownload(e.value)}
        >
          {fileName}
        </div>
      );
    },
    [handleFileDownload]
  );

  const colDefs = [
    {
      field: 'actions',
      headerName: '',
      cellRenderer: ActionsCellRenderer,
      width: 150,
      minWidth: 150,
      maxWidth: 165,
      flex: 1,
      pinned: 'left',
    },
    {
      field: 'id',
      headerName: 'Id Layer',
      width: 100,
      minWidth: 80,
    },
    {
      field: 'nama',
      headerName: 'Nama Layer Statis',
      flex: 1,
      minWidth: 164,
    },
    {
      field: 'geojson_file',
      headerName: 'File',
      cellRenderer: FileCellRenderer,
      flex: 1,
      minWidth: 164,
    },
    {
      field: 'created_at',
      headerName: 'Tanggal Upload',
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      },
      flex: 1,
      minWidth: 164,
    },
  ];

  const autoSizeStrategy = useMemo(() => {
    return {
      type: isMobile ? 'fitCellContents' : 'fitGridWidth',
    };
  }, [isMobile]);

  const handleAddPetaOverlay = () => {
    setShowModalTambahPetaOverlay(true);
  };

  const handleSubmitPetaOverlay = async (formData) => {
    try {
      const payload = {
        nama: formData.nama_layer,
        geojson_file: formData.file.value,
      };
      const res = await createPetaOverlay(payload);
      const status = res?.data?.status || res?.status;
      if (status === 'success' || status === 200 || status === 201) {
        toast.success(res?.data?.message || 'Layer berhasil dibuat');
        setShowModalTambahPetaOverlay(false);
        fetchList();
      } else {
        toast.error(res?.data?.message || 'Gagal membuat layer');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan layer');
      throw error;
    }
  };

  const handleSubmitEditPetaOverlay = async (formData) => {
    try {
      if (!layerToEdit?.id) return;
      const payload = {
        nama: formData.nama_layer,
      };
      if (formData.file?.value && !(typeof formData.file.value === 'string')) {
        payload.geojson_file = formData.file.value;
      }
      const res = await updatePetaOverlay(layerToEdit.id, payload);
      const status = res?.data?.status || res?.status;
      if (status === 'success' || status === 200) {
        toast.success(res?.data?.message || 'Layer berhasil diperbarui');
        setShowModalEdit(false);
        setLayerToEdit(null);
        fetchList();
      } else {
        toast.error(res?.data?.message || 'Gagal memperbarui layer');
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Gagal menyimpan perubahan layer'
      );
      throw error;
    }
  };

  return (
    <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-0">
          {/* Header Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <Heading
                className=" flex flex-1 uppercase tracking-[2px]"
                level={3}
              >
                LAYER PETA STATIS
              </Heading>
            </div>

            {/* Add Peta Overlay Button */}
            <div className="flex w-full flex-row items-center gap-2 md:w-auto md:justify-end">
              <Button
                onClick={handleAddPetaOverlay}
                className=" w-full whitespace-nowrap bg-primary text-xs sm:text-sm md:w-auto"
                icon={<PlusIcon size={18} />}
              >
                Peta Overlay
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative w-full flex-1">
            <SectionLoading loading={uploadedLoading} />
            <div className="ag-theme-alpine h-[400px] w-full">
              <AgGridReact
                loading={uploadedLoading}
                overlayLoadingTemplate="."
                autoSizeStrategy={autoSizeStrategy}
                rowData={uploadedStaticLayers}
                columnDefs={colDefs}
                defaultColDef={{
                  sortable: false,
                  filter: false,
                }}
                suppressRowClickSelection={true}
                animateRows={true}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalTambahPetaOverlay
        open={showModalTambahPetaOverlay}
        setOpen={setShowModalTambahPetaOverlay}
        onSubmit={handleSubmitPetaOverlay}
      />

      {layerToEdit && (
        <ModalTambahPetaOverlay
          open={showModalEdit}
          setOpen={setShowModalEdit}
          onSubmit={handleSubmitEditPetaOverlay}
          initialValues={{
            nama_layer: layerToEdit?.nama || '',
            file: layerToEdit?.geojson_file
              ? {
                  name:
                    layerToEdit.geojson_file.split('/').pop() ||
                    'File saat ini',
                  size: 0,
                  uploadDate: new Date().toISOString(),
                  value: layerToEdit.geojson_file,
                }
              : null,
          }}
          title="EDIT LAYER STATIS"
          requireFile={false}
          fileUrl={layerToEdit?.geojson_file || ''}
        />
      )}

      <ModalMapPreview
        open={showModalMapPreview}
        setOpen={setShowModalMapPreview}
        layerId={selectedLayerId}
      />

      <ModalConfirmation
        open={showModalDeleteConfirmation}
        setOpen={setShowModalDeleteConfirmation}
        title="HAPUS LAYER"
        message={`Apakah Anda yakin ingin menghapus layer "${layerToDelete?.nama}"?`}
        confirmText="Ya, Hapus"
        cancelText="Batalkan"
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  );
};

export default PetaOverlayPage;
