'use client';

import { PaginationButton } from '../../atoms/PaginationButton';

export function NavigationControls({ currentPage, totalPages, onPageChange, className }) {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <PaginationButton direction='prev' onClick={() => onPageChange(currentPage - 1)} disabled={!canGoPrev} />
      <PaginationButton direction='next' onClick={() => onPageChange(currentPage + 1)} disabled={!canGoNext} />
    </div>
  );
}
