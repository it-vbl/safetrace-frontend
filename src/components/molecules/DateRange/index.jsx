'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarIcon } from 'lucide-react';

import Button from '@/components/atoms/Button';

const DateRange = ({
  value = { startDate: '', endDate: '' },
  onChange = () => {},
  placeholder = 'Pilih Rentang Tanggal',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(value.startDate || '');
  const [tempEnd, setTempEnd] = useState(value.endDate || '');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Update temp values when value prop changes
  useEffect(() => {
    setTempStart(value.startDate || '');
    setTempEnd(value.endDate || '');
  }, [value.startDate, value.endDate]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    return `${date.getDate().toString().padStart(2, '0')} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const getDisplayValue = () => {
    if (value.startDate && value.endDate) {
      return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
    }
    return placeholder;
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTerapkan = () => {
    if (tempStart && tempEnd && tempStart <= tempEnd) {
      onChange({ startDate: tempStart, endDate: tempEnd });
      setIsOpen(false);
    }
  };

  const handleBatalkan = () => {
    setTempStart(value.startDate || '');
    setTempEnd(value.endDate || '');
    setIsOpen(false);
  };

  const handleTempStartChange = (e) => {
    const newStart = e.target.value;
    // Only allow start date if it's not after end date
    if (!tempEnd || newStart <= tempEnd) {
      setTempStart(newStart);
    }
  };

  const handleTempEndChange = (e) => {
    const newEnd = e.target.value;
    // Only allow end date if it's not before start date
    if (!tempStart || newEnd >= tempStart) {
      setTempEnd(newEnd);
    }
  };

  return (
    <div
      className={`relative w-full rounded-[4px] bg-white ${className}`}
      ref={dropdownRef}
    >
      {/* Main input field */}
      <div
        ref={inputRef}
        onClick={handleInputClick}
        className="flex items-center rounded-[4px] justify-between w-full px-3 py-[9px] border border-gray-300 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span
          className={`text-sm ${
            value.startDate && value.endDate ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          {getDisplayValue()}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-400" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="p-4 space-y-4">
            {/* Tanggal Mulai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={tempStart}
                onChange={handleTempStartChange}
                max={tempEnd}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tanggal Selesai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={tempEnd}
                onChange={handleTempEndChange}
                min={tempStart}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleBatalkan}
                variant="tertiary"
                size="small"
                className="flex-1"
              >
                Batalkan
              </Button>
              <Button
                onClick={handleTerapkan}
                isDisabled={!tempStart || !tempEnd || tempStart > tempEnd}
                variant="primary"
                size="small"
                className="flex-1"
              >
                Terapkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRange;
