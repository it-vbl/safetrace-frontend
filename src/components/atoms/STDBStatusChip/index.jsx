const StatusChip = ({ value, label }) => {
  const statusClasses = {
    1: 'bg-blue-100 text-blue-700', // Pendataan
    2: 'bg-yellow-100 text-yellow-700', // Verifikasi
    3: 'bg-red-100 text-red-700', // Tidak Terbit
    4: 'bg-purple-100 text-purple-700', // Penerbitan
    5: 'bg-green-100 text-green-700', // Data Terbit
    6: 'bg-green-200 text-gray-700', // Data Terbit
    7: 'bg-black-200 text-black-700', // Data Berakhir
  };

  return <span className={`rounded-[4px] px-3 py-1 text-sm font-medium ${statusClasses[value]}`}>{label}</span>;
};

export default StatusChip;
