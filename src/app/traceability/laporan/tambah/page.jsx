'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import Accordion from '@/components/molecules/Accordion';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';
import useReferences from '@/hooks/useReferences';
import { createLaporan } from '@/services/laporan';

const JENIS_LAPORAN_OPTIONS = [
    { value: 'statistik_bulanan', label: 'Statistik Bulanan' },
    { value: 'laporan_petani', label: 'Laporan Petani' },
    { value: 'stdb', label: 'STDB' },
];


const TAHUN_OPTIONS = Array.from({ length: 10 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
});

const PETANI_OPTIONS = [
    { value: '1', label: 'Agustinus Nery' },
    { value: '2', label: 'Budi Santoso' },
    { value: '3', label: 'Citra Dewi' },
];

const STATUS_STDB_OPTIONS = [
    { value: 'belum_terbit', label: 'Belum Terbit' },
    { value: 'sudah_terbit', label: 'Sudah Terbit' },
    { value: 'proses', label: 'Dalam Proses' },
];

function buildNamaLaporan(jenisLaporan, extra) {
    const jenisLabel = JENIS_LAPORAN_OPTIONS.find(o => o.value === jenisLaporan)?.label ?? '';

    if (jenisLaporan === 'statistik_bulanan') {
        const bulanLabel = (extra.pilihanBulan || []).find(o => o.value === extra.bulan)?.label ?? '';
        if (bulanLabel && extra.tahun) return `Laporan Statistik ${bulanLabel} ${extra.tahun}`;
    }
    if (jenisLaporan === 'laporan_petani') {
        const petaniLabel = PETANI_OPTIONS.find(o => o.value === extra.petani)?.label ?? '';
        if (petaniLabel) return `Laporan Petani - ${petaniLabel}`;
    }
    if (jenisLaporan === 'stdb') {
        const stdbLabel = STATUS_STDB_OPTIONS.find(o => o.value === extra.statusStdb)?.label ?? '';
        if (stdbLabel) return `File STDB ${stdbLabel}`;
    }
    return '';
}

export default function TambahLaporanPage() {
    return (
        <Suspense fallback={<div className="flex w-full justify-center py-10 text-sm text-neutral-500">Memuat data...</div>}>
            <TambahLaporanContent forcedType="bulanan" />
        </Suspense>
    );
}

function TambahLaporanContent({ forcedType }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = forcedType || searchParams.get('type') || 'bulanan';
    const initialJenis = typeParam === 'stdb' ? 'stdb' : typeParam === 'petani' ? 'laporan_petani' : typeParam === 'bulanan' ? 'statistik_bulanan' : '';

    const [isLoading, setIsLoading] = useState(false);
    const [jenisLaporan, setJenisLaporan] = useState(initialJenis);
    const [bulan, setBulan] = useState('');
    const [tahun, setTahun] = useState('');
    const [petani, setPetani] = useState('');
    const [kelompokTaniSelected, setKelompokTaniSelected] = useState('');
    const [statusStdb, setStatusStdb] = useState('');
    const [namaLaporan, setNamaLaporan] = useState('');
    const [kebutuhan, setKebutuhan] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { kelompokTani, fetchKelompokTani, pilihanBulan, fetchPilihanBulan } = useReferences();

    useEffect(() => {
        if (kelompokTani.length === 0) fetchKelompokTani();
    }, [kelompokTani.length, fetchKelompokTani]);

    useEffect(() => {
        if (pilihanBulan.length === 0) fetchPilihanBulan();
    }, [pilihanBulan.length, fetchPilihanBulan]);

    useEffect(() => {
        setNamaLaporan(buildNamaLaporan(jenisLaporan, { bulan, tahun, petani, statusStdb, pilihanBulan }));
    }, [jenisLaporan, bulan, tahun, petani, statusStdb, pilihanBulan]);

    const handleJenisChange = (val) => {
        setJenisLaporan(val);
        setBulan(''); setTahun(''); setPetani(''); setStatusStdb(''); setKelompokTaniSelected('');
        setNamaLaporan('');
    };

    const validate = () => {
        const e = {};
        if (!jenisLaporan) e.jenisLaporan = 'Jenis laporan wajib dipilih';
        if (jenisLaporan === 'statistik_bulanan') {
            if (!bulan) e.bulan = 'Bulan wajib dipilih';
            if (!tahun) e.tahun = 'Tahun wajib dipilih';
        }
        if (jenisLaporan === 'laporan_petani') {
            if (!petani) e.petani = 'Petani wajib dipilih';
            if (!kelompokTaniSelected) e.kelompokTani = 'Kelompok Tani wajib dipilih';
        }
        if (jenisLaporan === 'stdb' && !statusStdb) e.statusStdb = 'Status STDB wajib dipilih';
        if (!kebutuhan) e.kebutuhan = 'Kebutuhan wajib diisi';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = { jenisLaporan: true, bulan: true, tahun: true, petani: true, kelompokTani: true, statusStdb: true, kebutuhan: true };
        setTouched(allTouched);
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        try {
            const payload = {
                bulan: bulan ? parseInt(bulan, 10) : new Date().getMonth() + 1,
                tahun: tahun ? parseInt(tahun, 10) : new Date().getFullYear(),
                judul: namaLaporan,
                kebutuhan: kebutuhan,
            };
            const response = await createLaporan(payload);
            if (response?.status === 201 || response?.status === 200) {
                toast.success('Laporan berhasil disimpan');
                router.push('/traceability/laporan');
            } else {
                toast.error(response?.data?.message || 'Gagal menyimpan laporan');
            }
        } catch (error) {
            console.error('Error creating report:', error);
            toast.error(error?.response?.data?.message || 'Gagal menyimpan laporan');
        } finally {
            setIsLoading(false);
        }
    };

    const crumbs = [
        { label: 'LAPORAN', href: '/traceability/laporan' },
        { label: 'TAMBAH LAPORAN' },
    ];

    const renderSecondaryFields = () => {
        if (!jenisLaporan) return null;

        if (jenisLaporan === 'statistik_bulanan') {
            return (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-neutral-700">
                        Bulan Laporan <span className="text-tertiary">*</span>
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Select
                                name="bulanLaporan"
                                placeholder="September"
                                options={pilihanBulan}
                                value={bulan}
                                onChange={(e) => { setBulan(e.target.value); setTouched(t => ({ ...t, bulan: true })); }}
                                errors={touched.bulan && errors.bulan ? { bulanLaporan: errors.bulan } : {}}
                                touched={touched.bulan ? { bulanLaporan: true } : {}}
                            />
                        </div>
                        <div className="w-28">
                            <Select
                                name="tahunLaporan"
                                placeholder="2020"
                                options={TAHUN_OPTIONS}
                                value={tahun}
                                onChange={(e) => { setTahun(e.target.value); setTouched(t => ({ ...t, tahun: true })); }}
                                errors={touched.tahun && errors.tahun ? { tahunLaporan: errors.tahun } : {}}
                                touched={touched.tahun ? { tahunLaporan: true } : {}}
                            />
                        </div>
                    </div>
                    {touched.bulan && errors.bulan && (
                        <p className="text-xs text-tertiary">{errors.bulan}</p>
                    )}
                </div>
            );
        }

        if (jenisLaporan === 'laporan_petani') {
            return (
                <>
                    <Select
                        label="Kelompok Tani"
                        name="kelompokTani"
                        placeholder="Pilih Kelompok Tani"
                        options={kelompokTani || []}
                        value={kelompokTaniSelected}
                        onChange={(e) => { setKelompokTaniSelected(e.target.value); setTouched(t => ({ ...t, kelompokTani: true })); }}
                        errors={touched.kelompokTani ? { kelompokTani: errors.kelompokTani } : {}}
                        touched={touched.kelompokTani ? { kelompokTani: true } : {}}
                        isRequired
                    />
                    <Select
                        label="Petani"
                        name="petani"
                        placeholder="Agustinus Nery"
                        options={PETANI_OPTIONS}
                        value={petani}
                        onChange={(e) => { setPetani(e.target.value); setTouched(t => ({ ...t, petani: true })); }}
                        errors={touched.petani ? { petani: errors.petani } : {}}
                        touched={touched.petani ? { petani: true } : {}}
                        isRequired
                    />
                </>
            );
        }

        if (jenisLaporan === 'stdb') {
            return (
                <Select
                    label="Status STDB"
                    name="statusStdb"
                    placeholder="Belum Terbit"
                    options={STATUS_STDB_OPTIONS}
                    value={statusStdb}
                    onChange={(e) => { setStatusStdb(e.target.value); setTouched(t => ({ ...t, statusStdb: true })); }}
                    errors={touched.statusStdb ? { statusStdb: errors.statusStdb } : {}}
                    touched={touched.statusStdb ? { statusStdb: true } : {}}
                    isRequired
                />
            );
        }

        return null;
    };

    const secondaryFields = renderSecondaryFields();
    const gridClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';

    return (
        <div className="flex w-full flex-col gap-6">
            {typeParam === 'stdb' ? (
                <Heading className="uppercase tracking-[2px]" level={3}>
                    LAPORAN STDB
                </Heading>
            ) : (
                <BreadcrumbDetail items={crumbs} />
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <Accordion defaultIsOpen title="IDENTITAS">
                    <>
                        <div className={`${gridClass} border-b border-dashed border-neutral-300 py-4`}>
                            {jenisLaporan !== 'laporan_petani' && (
                                <>
                                    {secondaryFields}
                                    <InputText
                                        label="Nama Laporan"
                                        name="namaLaporan"
                                        placeholder="Terisi otomatis"
                                        value={namaLaporan}
                                        disabled
                                    />
                                </>
                            )}

                            {jenisLaporan === 'laporan_petani' && (
                                <>
                                    {secondaryFields}
                                    <InputText
                                        label="Nama Laporan"
                                        name="namaLaporan"
                                        placeholder="Terisi otomatis"
                                        value={namaLaporan}
                                        disabled
                                    />
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 py-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-neutral-700">
                                    Kebutuhan <span className="text-tertiary">*</span>
                                </label>
                                <textarea
                                    name="kebutuhan"
                                    placeholder="Diminta Disbunak"
                                    value={kebutuhan}
                                    onChange={(e) => { setKebutuhan(e.target.value); setTouched(t => ({ ...t, kebutuhan: true })); }}
                                    rows={3}
                                    className={`w-full rounded-md border px-3 py-2 text-sm text-neutral-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ${touched.kebutuhan && errors.kebutuhan ? 'border-tertiary' : 'border-neutral-300'
                                        }`}
                                />
                                {touched.kebutuhan && errors.kebutuhan && (
                                    <p className="text-xs text-tertiary">{errors.kebutuhan}</p>
                                )}
                            </div>
                        </div>
                    </>
                </Accordion>

                <div className="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-4">
                    <Button
                        type="button"
                        className="bg-tertiary hover:bg-tertiary/90"
                        onClick={() => router.push('/traceability/laporan')}
                        disabled={isLoading}
                    >
                        Batalkan
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Simpan
                    </Button>
                </div>
            </form>
        </div>
    );
}