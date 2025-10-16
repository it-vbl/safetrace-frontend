import React, { useState } from 'react';
import PropTypes from 'prop-types';

const formatNumber = (num) =>
  typeof num === 'number'
    ? num.toLocaleString('id-ID')
    : (Number(num) || 0).toLocaleString('id-ID');

const YearCard = ({
  yearData,
  onEdit,
  onDelete,
  title = 'Penggunaan Pupuk',
  dataFields = [
    { key: 'sistemik', label: '(Sistemik)', unit: 'Kg' },
    { key: 'kontak', label: '(Kontak)', unit: 'Kg' },
  ],
  className = '',
}) => {
  const [activeSemester, setActiveSemester] = useState('Semester 1');

  const usage = yearData.semester?.[activeSemester] ?? {
    sistemik: { waktu: '-', jumlah: 0 },
    kontak: { waktu: '-', jumlah: 0 },
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(yearData);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(yearData);
    }
  };

  return (
    <section
      key={`tahun-${yearData.tahun}`}
      className={`rounded border border-gray-300 bg-white p-6 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">TAHUN {yearData.tahun}</h3>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-sm font-medium text-red-600 underline hover:text-red-700"
            onClick={handleDelete}
          >
            Hapus
          </button>
          <button
            type="button"
            className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
            onClick={handleEdit}
          >
            Ubah Data
          </button>
        </div>
      </div>

      <div className="flex gap-x-4 gap-y-3 text-sm text-gray-700">
        {/* Semester Switch */}
        <div className="flex flex-row items-start">
          <div className="rounded border border-gray-300 bg-white p-2">
            <div className="space-y-2">
              {['Semester 1', 'Semester 2'].map((semester) => {
                const isActive = semester === activeSemester;
                return (
                  <button
                    key={`${yearData.tahun}-${semester}`}
                    type="button"
                    onClick={() => setActiveSemester(semester)}
                    className={`${
                      isActive
                        ? 'border-blue-300 bg-blue-50 !font-bold text-primary'
                        : 'border-gray-300 bg-gray-50 text-gray-700'
                    } w-full rounded border px-4 py-2 text-left font-medium`}
                  >
                    {semester}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Usage Panel */}
        <div className="flex flex-1">
          <div className="rounded border border-gray-300 bg-white p-4">
            <div className="mb-3 font-semibold">{title}</div>
            <div className="grid grid-cols-4 gap-x-6 gap-y-3">
              {dataFields.map((field) => (
                <React.Fragment key={field.key}>
                  <div>
                    <div className="text-gray-500">
                      {field.label} Waktu Aplikasi
                    </div>
                    <div className="font-medium">
                      {usage[field.key]?.waktu ?? '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">{field.label} Jumlah</div>
                    <div className="font-medium">
                      {formatNumber(usage[field.key]?.jumlah)} {field.unit}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

YearCard.propTypes = {
  yearData: PropTypes.shape({
    tahun: PropTypes.number.isRequired,
    semester: PropTypes.shape({
      'Semester 1': PropTypes.shape({
        sistemik: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kontak: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
      'Semester 2': PropTypes.shape({
        sistemik: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
        kontak: PropTypes.shape({
          waktu: PropTypes.string,
          jumlah: PropTypes.number,
        }),
      }),
    }),
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  title: PropTypes.string,
  dataFields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      unit: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
};

export default YearCard;

