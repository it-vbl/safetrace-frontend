'use client';

import { useCallback, useEffect, useMemo,useState } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useFormik } from 'formik';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';
import RadioButton from '@/components/molecules/RadioButton';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Select from '@/components/molecules/Select';
import Upload from '@/components/molecules/Upload';
import Pagination from '@/components/organisms/Pagination';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const KontakPage = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [kontakData, setKontakData] = useState([]);
  const [totalKontak, setTotalKontak] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [createMethod, setCreateMethod] = useState('manually');
  const [contactFile, setContactFile] = useState(null);

  const fetchKontakData = async ({ page, page_size, search }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allData = Array(50).fill({
        id_kontak: '001-APKS-001-001',
        name: 'Agustinus Nery',
        no_handphone: '082211591642',
        jenis_kelamin: 'Laki - Laki',
        sumber: 'Data Petani',
      });

      const filteredData = allData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );

      const startIndex = (page - 1) * page_size;
      const pagedData = filteredData.slice(startIndex, startIndex + page_size);

      setKontakData(pagedData);
      setTotalKontak(filteredData.length);
    } catch (error) {
      setKontakData([]);
      setTotalKontak(0);
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

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const colDefs = [
    { field: 'id_kontak', headerName: 'Id Kontak', flex: 1, minWidth: 150 },
    { field: 'name', headerName: 'Nama', flex: 1, minWidth: 150 },
    {
      field: 'no_handphone',
      headerName: 'No. Handphone',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'jenis_kelamin',
      headerName: 'Jenis Kelamin',
      flex: 1,
      minWidth: 150,
    },
    { field: 'sumber', headerName: 'Sumber', flex: 1, minWidth: 150 },
  ];

  const autoSizeStrategy = useMemo(() => {
    return {
      type: 'fitCellContents',
    };
  }, []);

  const schemaValidation = Yup.object().shape({
    nama: Yup.string().required('Nama harus diisi'),
    no_handphone: Yup.string().required('No handphone harus diisi'),
    jenis_kelamin: Yup.string().required('Pilih jenis kelamin'),
  });

  const jenisKelamin = [
    { value: 'man', label: 'Laki-Laki' },
    { value: 'woman', label: 'Perempuan' },
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
  } = useFormik({
    initialValues: {
      nama: '',
      no_handphone: '',
    },
    validationSchema: schemaValidation,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsOpen(false);
        resetForm();
        toast.success('Berhasil menambahkan kontak');
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
            onChangeValue={(e) => setCreateMethod(e)}
            options={[
              { label: 'Manual', value: 'manually' },
              { label: 'CSV', value: 'csv' },
            ]}
          />

          {createMethod === 'manually' ? (
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
                label={'No. Handphone'}
                name="no_handphone"
                placeholder="Masukkan nomor handphone"
                value={values.no_handphone}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
              <Select
                label="Jenis Kelamin"
                name="jenis_kelamin"
                placeholder="Pilih Jenis Kelamin"
                options={jenisKelamin}
                value={values.jenis_kelamin}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
              />
            </div>
          ) : (
            <div className="my-2 flex flex-col gap-4">
              <button
                className="py-1 text-left text-xs font-bold text-green8 underline"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/Template Kontak.csv';
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
                allowedFiles={['application/vnd.ms-excel', 'text/csv']}
                maxSize={10}
                isRequired
                keyField="csv"
                name="csv"
              />
            </div>
          )}

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Heading level={2} className="text-lg sm:text-xl md:text-2xl">
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

        <div className="relative w-full flex-1">
          <SectionLoading loading={loading} />
          <AgGridReact
            loading={loading}
            overlayLoadingTemplate="."
            autoSizeStrategy={autoSizeStrategy}
            rowData={kontakData}
            columnDefs={colDefs}
          />
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
    </div>
  );
};

export default KontakPage;
