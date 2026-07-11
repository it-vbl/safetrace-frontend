const StatusChip = ({ value, label }) => {
  const statusClasses = {
    1: 'bg-bgColor text-primary', // Pendataan
    2: 'bg-yellow-100 text-yellow-700', // Verifikasi
    3: 'bg-error1 text-tertiary', // Tidak Terbit
    4: 'bg-bgColor text-purple-700', // Penerbitan
    5: 'bg-bgColor text-primary', // Data Terbit
    6: 'bg-bgColor text-neutral-700', // Data Terbit
    7: 'bg-black-200 text-black-700', // Data Berakhir
  };

  return <span className={`rounded-[4px] px-3 py-1 text-sm font-medium ${statusClasses[value]}`}>{label}</span>;
};

export default StatusChip;
