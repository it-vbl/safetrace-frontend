import Link from 'next/link';

import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import SectionCard from '@/components/molecules/SectionCard';

import { getAnggotaNames, getKelompokLink, getKelompokName } from './helpers';

const KelompokItem = ({ kelompok }) => {
  const kelompokName = getKelompokName(
    kelompok?.kelompok_penyetor || kelompok?.kelompok
  );
  const anggotaNames = getAnggotaNames(
    kelompok?.anggota_petani || kelompok?.anggota
  );
  const kelompokHref = getKelompokLink(
    kelompok?.kelompok_penyetor || kelompok?.kelompok
  );

  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 p-4">
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <BorderBottomColData
          label="Kelompok Penyetor"
          value={
            kelompokHref ? (
              <Link
                href={kelompokHref}
                className="inline-flex items-center gap-1 text-blue-700 underline hover:text-blue-900"
              >
                {kelompokName}
                <span aria-hidden className="text-xs">
                  ↗
                </span>
              </Link>
            ) : (
              kelompokName
            )
          }
        />
        <BorderBottomColData
          label="Anggota Petani Penyetor"
          value={anggotaNames}
        />
      </div>
    </div>
  );
};

const KelompokCard = ({ data = [], onEdit }) => {
  const hasKelompok = Array.isArray(data) && data.length > 0;

  return (
    <SectionCard title="DETAIL KELOMPOK TANI" onAction={onEdit}>
      <div className="flex flex-col gap-4">
        {hasKelompok ? (
          data.map((item, index) => (
            <KelompokItem key={`${item?.id || index}`} kelompok={item} />
          ))
        ) : (
          <div className="rounded border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            Data kelompok tani belum tersedia.
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default KelompokCard;

