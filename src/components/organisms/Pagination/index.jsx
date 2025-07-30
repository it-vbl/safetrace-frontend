'use client';

import { RowsPerPageSelector } from '../../molecules/RowsPerPageSelector';
import { PageInfo } from '../../molecules/PageInfo';
import { NavigationControls } from '../../molecules/NavigationControls';
import { cn } from '@/libs/utils';

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showRowsPerPage = true,
  loading = false,
  disabled = false,
  labels = {},
  className,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const isDisabled = disabled || loading;

  return (
    <div className={cn('flex items-center justify-between gap-4 py-2', className)}>
      <div className='flex items-center gap-6'>
        {showRowsPerPage && (
          <div className={cn(isDisabled && 'pointer-events-none opacity-50')}>
            <RowsPerPageSelector
              value={pageSize}
              onValueChange={onPageSizeChange}
              options={pageSizeOptions}
              label={labels.rowsPerPage}
            />
          </div>
        )}
        <PageInfo
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          showingText={labels.showing}
          ofText={labels.of}
          loading={loading}
        />
      </div>

      <div className={cn(isDisabled && 'pointer-events-none opacity-50')}>
        <NavigationControls currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
