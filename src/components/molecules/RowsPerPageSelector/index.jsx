'use client';

import { PaginationText } from '../../atoms/PaginationText';
import { SimpleSelect } from '../../ui/select';

export function RowsPerPageSelector({
  value,
  onValueChange,
  options = [5, 10, 20, 50, 100],
  label = 'Baris Per Halaman',
}) {
  const selectOptions = options.map((option) => ({
    value: option.toString(),
    label: option.toString(),
  }));

  return (
    <div className='flex items-center gap-2'>
      <PaginationText variant='muted'>{label}</PaginationText>
      <SimpleSelect
        value={value.toString()}
        onValueChange={(val) => onValueChange(Number(val))}
        options={selectOptions}
        className='h-8 w-16 text-sm'
      />
    </div>
  );
}
