'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useFormik } from 'formik';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import RadioButton from '@/components/molecules/RadioButton';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Upload from '@/components/molecules/Upload';
import Pagination from '@/components/organisms/Pagination';
import useReferences from '@/hooks/useReferences';
import {
  createKontak,
  createKontakFromApi,
  createKontakFromCsv,
  deleteKontak,
  getKontakList,
  getPetaniWaList,
  updateKontak,
} from '@/services/kontak';

ModuleRegistry.registerModules([AllCommunityModule]);

const KontakPage = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [kontakData, setKontakData] = useState([]);
  const [totalKontak, setTotalKontak] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedKontakToEdit, setSelectedKontakToEdit] = useState(null);
  const [createMethod, setCreateMethod] = useState('1');
  const [contactFile, setContactFile] = useState(null);
  const [showModalConfirmDeleteKontak, setShowModalConfirmDeleteKontak] =
    useState(false);
  const [selectedKontakToDelete, setSelectedKontakToDelete] = useState(null);
  const [petaniWaList, setPetaniWaList] = useState([]);
  const [loadingPetaniWa, setLoadingPetaniWa] = useState(false);
  const [isErrorHistoryOpen, setIsErrorHistoryOpen] = useState(false);
  const [csvUploadSummary, setCsvUploadSummary] = useState(null);
  const [errorRows, setErrorRows] = useState([]);
  const [errorPage, setErrorPage] = useState(1);
  const [errorPageSize, setErrorPageSize] = useState(10);
  const { sumberKontak, fetchSumberKontak } = useReferences();
  const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchSumberKontak();
  }, [fetchSumberKontak]);

  const fetchPetaniWaList = async () => {
    setLoadingPetaniWa(true);
    try {
      const response = await getPetaniWaList();
      if (response.data.status === 'success') {
        const petaniOptions = response.data.data.results.map((petani) => ({
          value: petani.id,
          label: `${petani.nama} - ${petani.no_wa}`,
          data: petani,
        }));
        setPetaniWaList(petaniOptions);
      }
    } catch (error) {
      console.error('Error fetching petani WA list:', error);
      toast.error('Gagal mengambil data petani');
    } finally {
      setLoadingPetaniWa(false);
    }
  };

  useEffect(() => {
    if (createMethod === '3' && isOpen) {
      fetchPetaniWaList();
    }
  }, [createMethod, isOpen]);

  const fetchKontakData = async ({ page, page_size, search }) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size,
        ...(search && { search }),
      };

      const response = await getKontakList(params);

      if (response.data.status === 'success') {
        const { results, count } = response.data.data;
        setKontakData(results);
        setTotalKontak(count);
      } else {
        setKontakData([]);
        setTotalKontak(0);
        toast.error('Gagal mengambil data kontak');
      }
    } catch (error) {
      setKontakData([]);
      setTotalKontak(0);
      toast.error(
        error?.response?.data?.message ||
          'Terjadi kesalahan saat mengambil data'
      );
      console.error('Error fetching kontak data:', error);
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

  const handleEditClicked = (data) => {
    setSelectedKontakToEdit(data);
    setIsEditOpen(true);
  };

  const handleDeleteClicked = (data) => {
    setSelectedKontakToDelete(data);
    setShowModalConfirmDeleteKontak(true);
  };

  const handleDeleteCancel = () => {
    setShowModalConfirmDeleteKontak(false);
    setSelectedKontakToDelete(null);
  };

  const ActionsCellRenderer = useCallback((e) => {
    return (
      <div className="flex h-full w-full flex-row items-center justify-center gap-1 sm:gap-2">
        <div
          className="cursor-pointer text-[10px] font-bold uppercase text-blue-500 underline hover:text-blue-600 sm:text-[12px]"
          onClick={() => handleEditClicked(e.data)}
        >
          EDIT
        </div>
        <div
          className="cursor-pointer text-[10px] font-bold uppercase text-red-500 underline hover:text-red-600 sm:text-[12px]"
          onClick={() => handleDeleteClicked(e.data)}
        >
          HAPUS
        </div>
      </div>
    );
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const handleDeleteKontak = async () => {
    if (!selectedKontakToDelete?.id) {
      toast.error('ID kontak tidak ditemukan');
      return;
    }

    try {
      const res = await deleteKontak(selectedKontakToDelete.id);
      if (
        res?.data?.status === 'success' ||
        res?.status === 200 ||
        res?.status === 204
      ) {
        toast.success('Data kontak berhasil dihapus');
        setShowModalConfirmDeleteKontak(false);
        fetchKontakData({
          page: currentPage,
          page_size: pageSize,
          search,
        });
      } else {
        toast.error(res?.data?.message || 'Data petani gagal dihapus');
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Data petani gagal dihapus'
      );
    }
  };

  const colDefs = useMemo(() => {
    const base = [
      {
        field: 'actions',
        headerName: '',
        cellRenderer: ActionsCellRenderer,
        width: isMobileScreen ? 80 : 120,
        minWidth: isMobileScreen ? 70 : 100,
        maxWidth: 150,
        suppressSizeToFit: false,
        pinned: 'left',
      },
      {
        field: 'nama',
        headerName: 'Nama',
        flex: 2,
        minWidth: isMobileScreen ? 120 : 150,
      },
      {
        field: 'no_wa',
        headerName: 'No. WhatsApp',
        flex: 2,
        minWidth: isMobileScreen ? 120 : 150,
      },
    ];

    if (!isMobileScreen) {
      base.push(
        { field: 'id', headerName: 'ID Kontak', flex: 1, minWidth: 100 },
        {
          field: 'jns_kelamin',
          headerName: 'Jenis Kelamin',
          flex: 1,
          minWidth: 120,
          cellRenderer: (params) => {
            return params.value === '1' ? 'Laki-laki' : 'Perempuan';
          },
        },
        {
          field: 'sumber',
          headerName: 'Sumber',
          flex: 1,
          minWidth: 120,
          cellRenderer: (params) => {
            return params.value === '1' ? 'Manual' : 'CSV';
          },
        },
        {
          field: 'wa_valid',
          headerName: 'Status WA',
          flex: 1,
          minWidth: 100,
          cellRenderer: (params) => {
            return params.value ? 'Valid' : 'Tidak Valid';
          },
        }
      );
    }

    return base;
  }, [isMobileScreen, ActionsCellRenderer]);

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const schemaValidation = Yup.object().shape({
    nama: Yup.string().when(['createMethod', 'isEdit'], {
      is: (createMethod, isEdit) => createMethod === '1' || isEdit,
      then: (schema) => schema.required('Nama harus diisi'),
      otherwise: (schema) => schema,
    }),
    no_wa: Yup.string().when(['createMethod', 'isEdit'], {
      is: (createMethod, isEdit) => createMethod === '1' || isEdit,
      then: (schema) =>
        schema
          .required('No WhatsApp harus diisi')
          .matches(
            /^(\+62|0)[8][0-9]{8,11}$/,
            'Nomor WhatsApp tidak valid. Harus dimulai dengan +62 atau 0 dan diikuti oleh 8 dan 8-11 digit lainnya.'
          ),
      otherwise: (schema) => schema,
    }),
    jns_kelamin: Yup.string().when(['createMethod', 'isEdit'], {
      is: (createMethod, isEdit) => createMethod === '1' || isEdit,
      then: (schema) => schema.required('Pilih jenis kelamin'),
      otherwise: (schema) => schema,
    }),
    sumber: Yup.string().required('Pilih sumber'),
    selected_petani: Yup.string().when('createMethod', {
      is: '3',
      then: (schema) => schema.required('Pilih petani'),
      otherwise: (schema) => schema,
    }),
  });

  const jenisKelamin = [
    { value: '1', label: 'Laki-Laki' },
    { value: '2', label: 'Perempuan' },
  ];

  const {
    handleSubmit,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    isSubmitting,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      nama: '',
      no_wa: '',
      jns_kelamin: '',
      sumber: sumberKontak?.[0]?.value || '1',
      selected_petani: '',
      createMethod: '1',
      isEdit: false,
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        if (values.isEdit) {
          const payload = {
            nama: values.nama,
            no_wa: values.no_wa,
            jns_kelamin: values.jns_kelamin,
            sumber: values.sumber,
            wa_valid: true,
          };

          const response = await updateKontak(selectedKontakToEdit.id, payload);

          if (response.data.status === 'success') {
            setIsEditOpen(false);
            resetForm();
            setSelectedKontakToEdit(null);
            toast.success(
              response.data.message || 'Berhasil mengupdate kontak'
            );
            fetchKontakData({ page: currentPage, page_size: pageSize, search });
          } else {
            toast.error('Gagal mengupdate kontak');
          }
        } else if (createMethod === '1') {
          const payload = {
            nama: values.nama,
            no_wa: values.no_wa,
            jns_kelamin: values.jns_kelamin,
            sumber: values.sumber,
            wa_valid: true,
          };

          const response = await createKontak(payload);

          if (response.data.status === 'success') {
            setIsOpen(false);
            resetForm();
            toast.success(
              response.data.message || 'Berhasil menambahkan kontak'
            );
            fetchKontakData({ page: currentPage, page_size: pageSize, search });
          } else {
            toast.error('Gagal menambahkan kontak');
          }
        } else if (createMethod === '2') {
          if (!contactFile) {
            toast.error('Pilih file CSV terlebih dahulu');
            return;
          }

          const formData = new FormData();
          formData.append('file', contactFile);

          const response = await createKontakFromCsv(formData);

          if (response.data.status === 'success') {
            setIsOpen(false);
            resetForm();
            setContactFile(null);
            const payload = response?.data ?? {};
            setCsvUploadSummary(payload);
            const invalidRows = Array.isArray(payload?.data?.invalid_rows)
              ? payload.data.invalid_rows
              : [];
            const normalized = invalidRows.map((row) => ({
              row: row.row,
              nama: row?.data?.nama ?? '',
              nomor_wa: row?.data?.['nomor wa'] ?? row?.data?.no_wa ?? '',
              jenis_kelamin:
                row?.data?.['jenis kelamin'] ?? row?.data?.jns_kelamin ?? '',
              errors: Array.isArray(row.errors) ? row.errors.join(', ') : '',
            }));
            setErrorRows(normalized);
            setErrorPage(1);
            toast.success(
              response.data.message || 'Berhasil mengupload kontak dari CSV'
            );
            if (normalized.length > 0) {
              setIsErrorHistoryOpen(true);
            }
            fetchKontakData({ page: currentPage, page_size: pageSize, search });
          } else {
            toast.error('Gagal mengupload kontak dari CSV');
          }
        } else if (createMethod === '3') {
          if (!values.selected_petani) {
            toast.error('Pilih petani terlebih dahulu');
            return;
          }

          const selectedPetaniData = petaniWaList.find(
            (petani) => petani.value === values.selected_petani
          )?.data;

          const payload = {
            petani_id: values.selected_petani,
            nama: selectedPetaniData?.nama,
            no_wa: selectedPetaniData?.no_wa,
            jns_kelamin: selectedPetaniData?.jns_kelamin,
            sumber: values.sumber,
          };

          const response = await createKontakFromApi(payload);

          if (response.data.status === 'success') {
            setIsOpen(false);
            resetForm();
            toast.success(
              response.data.message || 'Berhasil menambahkan kontak dari API'
            );
            fetchKontakData({ page: currentPage, page_size: pageSize, search });
          } else {
            toast.error('Gagal menambahkan kontak dari API');
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCreateMethodChange = (value) => {
    setCreateMethod(value);
    setFieldValue('createMethod', value);
    resetForm({
      values: {
        ...values,
        createMethod: value,
        nama: '',
        no_wa: '',
        jns_kelamin: '',
        selected_petani: '',
      },
    });
    setContactFile(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resetForm();
    setContactFile(null);
  };

  const handleEditCancel = () => {
    setIsEditOpen(false);
    resetForm();
    setSelectedKontakToEdit(null);
  };

  const handleEditOpen = () => {
    if (selectedKontakToEdit) {
      resetForm({
        values: {
          nama: selectedKontakToEdit.nama || '',
          no_wa: selectedKontakToEdit.no_wa || '',
          jns_kelamin: selectedKontakToEdit.jns_kelamin || '',
          sumber: selectedKontakToEdit.sumber || '1',
          selected_petani: '',
          createMethod: '1',
          isEdit: true,
        },
      });
    }
  };

  useEffect(() => {
    if (isEditOpen && selectedKontakToEdit) {
      handleEditOpen();
    }
  }, [isEditOpen, selectedKontakToEdit]);

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      minWidth: 100,
      wrapText: true,
      autoHeight: true,
    }),
    []
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
            TAMBAH KONTAK
          </Heading>

          <RadioButton
            labelClassName="text-[16px] my-4"
            containerClassName="gap-2"
            value={createMethod}
            direction="row"
            onChangeValue={handleCreateMethodChange}
            options={sumberKontak || []}
          />

          {createMethod === '1' ? (
            <div className="my-2 flex flex-col gap-4">
              <InputText
                label={'Nama'}
                name="nama"
                placeholder="Masukkan nama"
                value={values.nama}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <InputText
                label={'No. WhatsApp'}
                name="no_wa"
                placeholder="Masukkan nomor WhatsApp"
                value={values.no_wa}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <Select
                label="Jenis Kelamin"
                name="jns_kelamin"
                placeholder="Pilih Jenis Kelamin"
                options={jenisKelamin}
                value={values.jns_kelamin}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </div>
          ) : createMethod === '2' ? (
            <div className="my-2 flex flex-col gap-4">
              <button
                type="button"
                className="py-1 text-left text-xs font-bold text-green8 underline"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/template-upload-sample.csv';
                  link.download = 'template_kontak.csv';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                UNDUH TEMPLATE CSV
              </button>

              <Upload
                label=""
                file={
                  contactFile
                    ? {
                        name: contactFile.name,
                        size: (contactFile.size / 1048576).toFixed(1),
                        uploadDate: new Date().toLocaleDateString('en-US'),
                        value: contactFile,
                      }
                    : null
                }
                onChangeValue={(data) => setContactFile(data.value)}
                allowedFiles={['.csv', 'text/csv', 'application/vnd.ms-excel']}
                maxSize={10}
                isRequired
                keyField="csv"
                name="csv"
              />
            </div>
          ) : createMethod === '3' ? (
            <div className="my-2 flex flex-col gap-4">
              <Select
                label="Pilih Petani"
                name="selected_petani"
                placeholder={
                  loadingPetaniWa
                    ? 'Memuat data petani...'
                    : 'Pilih petani dari API'
                }
                options={petaniWaList}
                value={values.selected_petani}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                disabled={loadingPetaniWa}
              />
              {loadingPetaniWa && (
                <div className="text-sm text-gray-500">
                  Sedang memuat data petani...
                </div>
              )}
            </div>
          ) : null}

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

      <BaseModal
        open={isEditOpen}
        setOpen={handleEditCancel}
        isShowLabel={false}
        isShowCloseIcon={false}
        className="flex max-w-md flex-col"
      >
        <form onSubmit={handleSubmit}>
          <Heading
            level={4}
            className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl"
          >
            EDIT KONTAK
          </Heading>

          <div className="my-2 flex flex-col gap-4">
            <InputText
              label={'Nama'}
              name="nama"
              placeholder="Masukkan nama"
              value={values.nama}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
            <InputText
              label={'No. WhatsApp'}
              name="no_wa"
              placeholder="Masukkan nomor WhatsApp"
              value={values.no_wa}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
            <Select
              label="Jenis Kelamin"
              name="jns_kelamin"
              placeholder="Pilih Jenis Kelamin"
              options={jenisKelamin}
              value={values.jns_kelamin}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="danger" onClick={handleEditCancel}>
              Batalkan
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mengupdate...' : 'Update'}
            </Button>
          </div>
        </form>
      </BaseModal>

      {/* Error History Modal */}
      <BaseModal
        open={isErrorHistoryOpen}
        setOpen={setIsErrorHistoryOpen}
        isShowLabel={false}
        isShowCloseIcon={false}
        className="flex max-w-3xl flex-col"
      >
        <div className="flex items-center justify-between">
          <Heading
            level={4}
            className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl"
          >
            RIWAYAT ERROR UPLOAD CSV
          </Heading>
          <div className="text-xs text-gray-600">
            {csvUploadSummary?.message || 'Upload selesai'}
            {csvUploadSummary?.data && (
              <div className="mt-1">
                Berhasil: {csvUploadSummary?.data?.valid_count ?? 0}, Tidak
                valid: {csvUploadSummary?.data?.invalid_count ?? 0}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3">
          {errorRows.length === 0 ? (
            <div className="rounded border bg-white p-4 text-sm text-gray-600">
              Tidak ada error pada upload terakhir.
            </div>
          ) : (
            <div className="ag-theme-quartz relative w-full">
              <AgGridReact
                overlayLoadingTemplate="."
                autoSizeStrategy={autoSizeStrategy}
                domLayout="autoHeight"
                rowHeight={40}
                rowData={errorRows.slice(
                  (errorPage - 1) * errorPageSize,
                  (errorPage - 1) * errorPageSize + errorPageSize
                )}
                columnDefs={[
                  { field: 'row', headerName: 'Baris', minWidth: 80, flex: 1 },
                  { field: 'nama', headerName: 'Nama', minWidth: 150, flex: 2 },
                  {
                    field: 'nomor_wa',
                    headerName: 'Nomor WA',
                    minWidth: 160,
                    flex: 2,
                  },
                  {
                    field: 'jenis_kelamin',
                    headerName: 'Jenis Kelamin',
                    minWidth: 140,
                    flex: 2,
                  },
                  {
                    field: 'errors',
                    headerName: 'Error',
                    minWidth: 220,
                    flex: 3,
                  },
                ]}
              />
              <div className="mt-3 flex justify-end">
                <Pagination
                  currentPage={errorPage}
                  pageSize={errorPageSize}
                  totalItems={errorRows.length}
                  onPageChange={(page) => setErrorPage(page)}
                  onPageSizeChange={(size) => {
                    setErrorPageSize(size);
                    setErrorPage(1);
                  }}
                  labels={{
                    rowsPerPage: 'Baris per halaman',
                    showing: 'Menampilkan',
                    of: 'dari',
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsErrorHistoryOpen(false)}
          >
            Tutup
          </Button>
        </div>
      </BaseModal>

      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Heading className=" flex flex-1 uppercase tracking-[2px]" level={3}>
            KONTAK
          </Heading>
          <div className="flex w-full gap-2 sm:w-auto">
            <SearchBar
              onChange={handleSearchTextChange}
              placeholder="Cari kontak"
              className="w-full sm:w-[300px]"
            />
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Kontak Baru
            </Button>
          </div>
        </div>

        <div className="relative w-full flex-1 overflow-x-auto">
          <SectionLoading loading={loading} />
          <div className="min-w-[320px]">
            {mounted && (
              <AgGridReact
                loading={loading}
                overlayLoadingTemplate="."
                autoSizeStrategy={autoSizeStrategy}
                defaultColDef={defaultColDef}
                domLayout="autoHeight"
                rowHeight={isMobileScreen ? 36 : 40}
                rowData={kontakData}
                columnDefs={colDefs}
              />
            )}
          </div>
        </div>

        <div className="flex justify-center sm:justify-end">
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

      <DeleteConfirmationModal
        isOpen={showModalConfirmDeleteKontak}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteKontak}
        itemName={`kontak dengan nama ${selectedKontakToDelete?.nama}`}
        isLoading={loading}
      />
    </div>
  );
};

export default KontakPage;
