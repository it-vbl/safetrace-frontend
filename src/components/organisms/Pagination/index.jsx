'use client';

import { cn } from '@/libs/utils';

import { NavigationControls } from '../../molecules/NavigationControls';
import { PageInfo } from '../../molecules/PageInfo';
import { RowsPerPageSelector } from '../../molecules/RowsPerPageSelector';

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
    <div className={cn('flex flex-row items-center justify-between gap-3 sm:gap-4 py-2 px-2 sm:px-0', className)}>
      {/* Top section for mobile - rows selector and page info */}
      <div className='flex  sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto'>
        {showRowsPerPage && (
          <div className={cn('w-full sm:w-auto', isDisabled && 'pointer-events-none opacity-50')}>
            <RowsPerPageSelector
              value={pageSize}
              onValueChange={onPageSizeChange}
              options={pageSizeOptions}
              label={labels.rowsPerPage}
            />
          </div>
        )}
        <div className='w-full sm:w-auto text-center sm:text-left'>
          <PageInfo
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            showingText={labels.showing}
            ofText={labels.of}
            loading={loading}
          />
        </div>
      </div>

      {/* Bottom section for mobile - navigation controls */}
      <div className={cn('sm:w-auto flex justify-center sm:justify-end', isDisabled && 'pointer-events-none opacity-50')}>
        <NavigationControls 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
        />
      </div>
    </div>
  );
}
