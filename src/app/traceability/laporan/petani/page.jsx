'use client';

import { Suspense } from 'react';
import { TambahLaporanContent } from '../tambah/page';

export default function LaporanPetaniPage() {
    return (
        <Suspense fallback={<div className="flex w-full justify-center py-10 text-sm text-gray-500">Memuat data...</div>}>
            <TambahLaporanContent forcedType="petani" />
        </Suspense>
    );
}
