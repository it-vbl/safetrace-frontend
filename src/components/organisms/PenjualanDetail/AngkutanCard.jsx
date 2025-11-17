import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import SectionCard from '@/components/molecules/SectionCard';

import {
  formatCurrencyID,
  formatDateID,
  formatNumberID,
} from './helpers';

const AngkutanCard = ({ data, onEdit }) => {
  const rows = [
    {
      label: 'Tanggal Penjualan',
      value: formatDateID(data?.tanggal_penjualan),
    },
    { label: 'Driver', value: data?.driver || '-' },
    { label: 'No. Registrasi', value: data?.no_registrasi || '-' },
    { label: 'No. Polisi', value: data?.no_polisi || '-' },
    {
      label: 'Jumlah Tandan',
      value: formatNumberID(data?.jumlah_tandan),
    },
    {
      label: 'Berat Timbangan (Kg)',
      value: formatNumberID(data?.berat_timbangan),
    },
    { label: 'Tarra', value: formatNumberID(data?.tarra) },
    {
      label: 'T. Potongan (%)',
      value: formatNumberID(data?.t_potongan_persen),
    },
    {
      label: 'T. Potongan (Kg)',
      value: formatNumberID(data?.t_potongan_kg),
    },
    { label: 'Berat Bersih', value: formatNumberID(data?.berat_bersih) },
    {
      label: 'Harga Per Kilo (Rp)',
      value: formatCurrencyID(data?.harga_per_kilo),
    },
    {
      label: 'Total Penjualan (Rp)',
      value: formatCurrencyID(data?.total_penjualan),
    },
  ];

  return (
    <SectionCard title="DETAIL ANGKUTAN" onAction={onEdit}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((item) => (
          <BorderBottomColData
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </SectionCard>
  );
};

export default AngkutanCard;

