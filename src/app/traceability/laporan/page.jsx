'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';
import { getCurrentUserRoles, isViewOnlyRole } from '@/libs/permissions';
import { downloadLaporan,getLaporanList,deleteLaporan } from '@/services/laporan';

ModuleRegistry.registerModules([AllCommunityModule]);

const LaporanPage = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [laporanData, setLaporanData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [showModalConfirmDeleteKontak, setShowModalConfirmDeleteKontak] =
        useState(false);
    const [selectedKontakToDelete, setSelectedKontakToDelete] = useState(null);
    const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Determine if the current user is view-only (Disbunak Kalbar / Disbunak Sekadau)
    const isViewOnly = mounted ? isViewOnlyRole(getCurrentUserRoles()) : false;

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchLaporanData = async ({ page, page_size, search }) => {
        setLoading(true);
        try {
            const params = {
                page,
                page_size,
                ...(search && { search }),
            };
            const response = await getLaporanList(params);
            if (response?.status === 200) {
                const data = response?.data;
                const results = data?.results || [];
                const mappedData = results.map((item) => ({
                    id: item.id,
                    nama_laporan: item.judul || '-',
                    jenis_laporan: 'Statistik Bulanan',
                    keperluan: item.kebutuhan || '-',
                    tanggal_dibuat: item.created_at ? moment(item.created_at).format('DD-MM-YYYY HH:mm') : '-',
                    dibuat_oleh: '-',
                    bulan: item.bulan,
                    tahun: item.tahun,
                    judul: item.judul,
                    kebutuhan: item.kebutuhan,
                }));
                setLaporanData(mappedData);
                setTotalItems(data?.count || 0);
            } else {
                setLaporanData([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error fetching laporan data:', error);
            toast.error('Gagal memuat data laporan');
            setLaporanData([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLaporanData({
            page: currentPage,
            page_size: pageSize,
            search,
        });
    }, [currentPage, pageSize, search]);

    const handleSearchTextChange = useCallback(
        debounce((value) => {
            setSearch(value);
            setCurrentPage(1);
        }, 300),
        []
    );

    const handleDownloadClicked = async (data) => {
        if (!data?.id) {
            toast.error('ID laporan tidak valid');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                bulan: data.bulan,
                tahun: data.tahun,
                judul: data.judul,
                kebutuhan: data.kebutuhan,
            };
            const response = await downloadLaporan(data.id, payload);
            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `${data.judul || 'laporan'}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('Laporan berhasil diunduh');
        } catch (error) {
            console.error('Error downloading report:', error);
            toast.error('Gagal mengunduh laporan');
        } finally {
            setLoading(false);
        }
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
                    onClick={() => handleDownloadClicked(e.data)}
                >
                    UNDUH
                </div>
                {!isViewOnly && (
                    <div
                        className="cursor-pointer text-[10px] font-bold uppercase text-red-500 underline hover:text-red-600 sm:text-[12px]"
                        onClick={() => handleDeleteClicked(e.data)}
                    >
                        HAPUS
                    </div>
                )}
            </div>
        );
    }, [isViewOnly]);

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);

    const handlePageSizeChange = useCallback((newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    }, []);

    const handleDeleteLaporan = async () => {
        if (!selectedKontakToDelete?.id) return;
        setLoading(true);
        try {
            const payload = {
                bulan: selectedKontakToDelete.bulan,
                tahun: selectedKontakToDelete.tahun,
                judul: selectedKontakToDelete.judul,
                kebutuhan: selectedKontakToDelete.kebutuhan,
            };
            const response = await deleteLaporan(selectedKontakToDelete.id, payload);
            if (response?.status === 200 || response?.status === 204) {
                toast.success('Laporan berhasil dihapus');
                handleDeleteCancel();
                fetchLaporanData({
                    page: currentPage,
                    page_size: pageSize,
                    search,
                });
            } else {
                toast.error('Gagal menghapus laporan');
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            toast.error('Gagal menghapus laporan');
        } finally {
            setLoading(false);
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
                field: 'nama_laporan',
                headerName: 'Nama Laporan',
                flex: 2,
                minWidth: isMobileScreen ? 120 : 150,
            },
            {
                field: 'jenis_laporan',
                headerName: 'Jenis Laporan',
                flex: 2,
                minWidth: isMobileScreen ? 120 : 150,
            },
            {
                field: 'keperluan',
                headerName: 'Keperluan',
                flex: 2,
                minWidth: isMobileScreen ? 120 : 150,
            },
            {
                field: 'tanggal_dibuat',
                headerName: 'Tanggal Dibuat',
                flex: 2,
                minWidth: isMobileScreen ? 120 : 150,
            },
            {
                field: 'dibuat_oleh',
                headerName: 'Dibuat Oleh',
                flex: 2,
                minWidth: isMobileScreen ? 120 : 150,
            },
        ];

        return base;
    }, [isMobileScreen, ActionsCellRenderer]);

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

    return (
        <div className="relative !min-h-[calc(100%-72px)] w-full max-w-full">
            <div className="flex h-full flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <Heading className=" flex flex-1 uppercase tracking-[2px]" level={3}>
                        LAPORAN
                    </Heading>
                    <div className="flex w-full gap-2 sm:w-auto">
                        <SearchBar
                            value={search}
                            onChange={(e) => handleSearchTextChange(e.target.value)}
                            onClear={() => {
                                setSearch('');
                                setCurrentPage(1);
                            }}
                            placeholder="Cari Laporan"
                            className="w-full sm:w-[300px]"
                        />
                        {!isViewOnly && (
                            <Button
                                onClick={() => router.push('/traceability/laporan/tambah')}
                            >
                                Tambah laporan
                            </Button>
                        )}
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
                                columnDefs={colDefs}
                                rowData={laporanData}
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={totalItems}
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
                onConfirm={handleDeleteLaporan}
                itemName={`laporan dengan judul ${selectedKontakToDelete?.nama_laporan || ''}`}
                isLoading={loading}
            />
        </div>
    );
};

export default LaporanPage;
