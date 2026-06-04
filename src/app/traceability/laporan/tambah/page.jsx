'use client';

import { Suspense, useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/atoms/Button';
import Accordion from '@/components/molecules/Accordion';
import BreadcrumbDetail from '@/components/molecules/BreadcrumbDetail';
import InputText from '@/components/molecules/InputText';
import Select from '@/components/molecules/Select';

const JENIS_LAPORAN_OPTIONS = [
    { value: 'statistik_bulanan', label: 'Statistik Bulanan' },
    { value: 'laporan_petani', label: 'Laporan Petani' },
    { value: 'stdb', label: 'STDB' },
];

const BULAN_OPTIONS = [
    { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' }, { value: '04', label: 'April' },
    { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
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
        const bulanLabel = BULAN_OPTIONS.find(o => o.value === extra.bulan)?.label ?? '';
        if (bulanLabel && extra.tahun) return `${jenisLabel} Bulan ${bulanLabel}`;
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
        <Suspense fallback={<div className="flex w-full justify-center py-10 text-sm text-gray-500">Memuat data...</div>}>
            <TambahLaporanContent />
        </Suspense>
    );
}

function TambahLaporanContent() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [jenisLaporan, setJenisLaporan] = useState('');
    const [bulan, setBulan] = useState('');
    const [tahun, setTahun] = useState('');
    const [petani, setPetani] = useState('');
    const [statusStdb, setStatusStdb] = useState('');
    const [namaLaporan, setNamaLaporan] = useState('');
    const [kebutuhan, setKebutuhan] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        setNamaLaporan(buildNamaLaporan(jenisLaporan, { bulan, tahun, petani, statusStdb }));
    }, [jenisLaporan, bulan, tahun, petani, statusStdb]);

    const handleJenisChange = (val) => {
        setJenisLaporan(val);
        setBulan(''); setTahun(''); setPetani(''); setStatusStdb('');
        setNamaLaporan('');
    };

    const validate = () => {
        const e = {};
        if (!jenisLaporan) e.jenisLaporan = 'Jenis laporan wajib dipilih';
        if (jenisLaporan === 'statistik_bulanan') {
            if (!bulan) e.bulan = 'Bulan wajib dipilih';
            if (!tahun) e.tahun = 'Tahun wajib dipilih';
        }
        if (jenisLaporan === 'laporan_petani' && !petani) e.petani = 'Petani wajib dipilih';
        if (jenisLaporan === 'stdb' && !statusStdb) e.statusStdb = 'Status STDB wajib dipilih';
        if (!kebutuhan) e.kebutuhan = 'Kebutuhan wajib diisi';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = { jenisLaporan: true, bulan: true, tahun: true, petani: true, statusStdb: true, kebutuhan: true };
        setTouched(allTouched);
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        try {
            router.push('/traceability/laporan');
        } finally {
            setIsLoading(false);
        }
    };

    const crumbs = [
        { label: 'LAPORAN', href: '/traceability/laporan' },
        { label: 'TAMBAH LAPORAN' },
    ];

    const renderSecondaryField = () => {
        if (!jenisLaporan) return null;

        if (jenisLaporan === 'statistik_bulanan') {
            return (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Bulan Laporan <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Select
                                name="bulanLaporan"
                                placeholder="September"
                                options={BULAN_OPTIONS}
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
                        <p className="text-xs text-red-500">{errors.bulan}</p>
                    )}
                </div>
            );
        }

        if (jenisLaporan === 'laporan_petani') {
            return (
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

    const secondaryField = renderSecondaryField();
    const hasSecondary = jenisLaporan && secondaryField !== null;
    const gridClass = hasSecondary
        ? 'grid grid-cols-1 md:grid-cols-3 gap-6'
        : jenisLaporan
            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
            : 'grid grid-cols-1 md:grid-cols-3 gap-6';

    return (
        <div className="flex w-full flex-col gap-6">
            <BreadcrumbDetail items={crumbs} />
            <form onSubmit={handleSubmit} className="space-y-6">
                <Accordion defaultIsOpen title="IDENTITAS">
                    <>
                        <div className={`${gridClass} border-b border-dashed border-gray-300 py-4`}>
                            <Select
                                label="Jenis Laporan"
                                name="jenisLaporan"
                                placeholder="Pilih Jenis Laporan"
                                options={JENIS_LAPORAN_OPTIONS}
                                value={jenisLaporan}
                                onChange={(e) => handleJenisChange(e.target.value)}
                                errors={touched.jenisLaporan ? { jenisLaporan: errors.jenisLaporan } : {}}
                                touched={touched.jenisLaporan ? { jenisLaporan: true } : {}}
                                isRequired
                            />

                            {secondaryField}

                            {jenisLaporan && (
                                <InputText
                                    label="Nama Laporan"
                                    name="namaLaporan"
                                    placeholder="Terisi otomatis"
                                    value={namaLaporan}
                                    disabled
                                />
                            )}
                        </div>

                        {jenisLaporan && (
                            <div className="grid grid-cols-1 gap-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Kebutuhan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="kebutuhan"
                                        placeholder="Diminta Disbunak"
                                        value={kebutuhan}
                                        onChange={(e) => { setKebutuhan(e.target.value); setTouched(t => ({ ...t, kebutuhan: true })); }}
                                        rows={3}
                                        className={`w-full rounded-md border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${touched.kebutuhan && errors.kebutuhan ? 'border-red-400' : 'border-gray-300'
                                            }`}
                                    />
                                    {touched.kebutuhan && errors.kebutuhan && (
                                        <p className="text-xs text-red-500">{errors.kebutuhan}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                </Accordion>

                <div className="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-4">
                    <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700"
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