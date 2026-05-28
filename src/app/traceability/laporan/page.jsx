'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import DeleteConfirmationModal from '@/components/molecules/DeleteConfirmationModal';
import SearchBar from '@/components/molecules/SearchBar';
import SectionLoading from '@/components/molecules/SectionLoading';
import Pagination from '@/components/organisms/Pagination';
import { getCurrentUserRoles, isViewOnlyRole } from '@/libs/permissions';

ModuleRegistry.registerModules([AllCommunityModule]);

const LaporanPage = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [showModalConfirmDeleteKontak, setShowModalConfirmDeleteKontak] =
        useState(false);
    const [selectedKontakToDelete, setSelectedKontakToDelete] = useState(null);
    const isMobileScreen = useSelector((state) => state.app.isMobileScreen);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Determine if the current user is view-only (Disbunak Kalbar / Disbunak Sekadau)
    const isViewOnly = isViewOnlyRole(getCurrentUserRoles());

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearchTextChange = useCallback(
        debounce((value) => {
            setSearch(value);
            setCurrentPage(1);
        }, 300),
        []
    );

    const handleDownloadClicked = (data) => {
        console.log(data);
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
        console.log("TODO: DELETE LAPORAN");

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
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={0}
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
                itemName={`kontak dengan nama ${selectedKontakToDelete?.nama}`}
                isLoading={loading}
            />
        </div>
    );
};

export default LaporanPage;
