import BorderBottomColData from '@/components/molecules/BorderBottomColData';
import SectionCard from '@/components/molecules/SectionCard';

const PabrikCard = ({ data, onEdit }) => {
  const rows = [
    {
      label: 'Pabrik Penerima',
      value: data?.pabrik_penerima || data?.nama || '-',
    },
    { label: 'Provinsi', value: data?.provinsi_label || data?.provinsi || '-' },
    {
      label: 'Kabupaten',
      value: data?.kabupaten_label || data?.kabupaten || '-',
    },
    {
      label: 'Kecamatan',
      value: data?.kecamatan_label || data?.kecamatan || '-',
    },
    { label: 'Alamat', value: data?.alamat || '-' },
  ];

  return (
    <SectionCard title="DETAIL PABRIK" onAction={onEdit}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((item) => (
          <BorderBottomColData
            key={item.label}
            label={item.label}
            value={item.value}
            className={item.label === 'Alamat' ? 'line-clamp-none' : ''}
          />
        ))}
      </div>
    </SectionCard>
  );
};

export default PabrikCard;

