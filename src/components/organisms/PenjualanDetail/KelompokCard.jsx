import Link from 'next/link';

import SectionCard from '@/components/molecules/SectionCard';

import { getAnggotaNames, getKelompokName, getPetaniLink } from './helpers';

const KelompokItem = ({ kelompok }) => {
  const kelompokName = getKelompokName(
    kelompok?.kelompok_penyetor || kelompok?.kelompok
  );
  const anggotaList = kelompok?.anggota_petani || kelompok?.anggota || [];

  // Build link to root page with query parameters to open Data Kebun Modal with filter
  const kelompokData = kelompok?.kelompok_penyetor || kelompok?.kelompok;
  const kelompokNameForUrl =
    typeof kelompokData === 'string'
      ? kelompokData
      : kelompokData?.nama || kelompokName;

  // Create URL with query parameters
  const kelompokHref = kelompokNameForUrl
    ? `/?openModal=dataKebun&kelompokName=${encodeURIComponent(
        kelompokNameForUrl
      )}`
    : null;

  const renderAnggotaValue = () => {
    if (!Array.isArray(anggotaList) || anggotaList.length === 0) {
      return '-';
    }

    const validAnggota = anggotaList.filter(Boolean);
    if (validAnggota.length === 0) {
      return '-';
    }

    return (
      <div className="flex flex-wrap items-center gap-x-2">
        {validAnggota.map((anggota, index) => {
          const petaniName =
            typeof anggota === 'string'
              ? anggota
              : anggota.nama ||
                anggota.nama_petani ||
                anggota.label ||
                anggota.id_petani ||
                '-';

          const petaniHref = getPetaniLink(anggota);

          return (
            <span
              key={anggota.id || index}
              className="inline-flex items-center"
            >
              {petaniHref ? (
                <Link
                  href={petaniHref}
                  className="inline-flex items-center gap-1 text-primary underline hover:text-primary"
                >
                  {petaniName}
                  <span aria-hidden className="text-xs">
                    ↗
                  </span>
                </Link>
              ) : (
                petaniName
              )}
              {index < validAnggota.length - 1 && (
                <span className="ml-2 text-neutral-500">,</span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-lg border-b border-dashed border-neutral-300 py-4">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] col-span-2 font-bold text-neutral-500">
            Kelompok Penyetor
          </span>
          <div className="text-sm text-neutral-900">
            {kelompokHref ? (
              <Link
                href={kelompokHref}
                className="inline-flex items-center gap-1 text-primary underline hover:text-primary"
              >
                {kelompokName}
                <span aria-hidden className="text-xs">
                  ↗
                </span>
              </Link>
            ) : (
              kelompokName
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] col-span-2 font-bold text-neutral-500">
            Anggota Petani Penyetor
          </span>
          <div className="text-sm text-neutral-900">{renderAnggotaValue()}</div>
        </div>
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
          <div className="rounded border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
            Data kelompok tani belum tersedia.
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default KelompokCard;
