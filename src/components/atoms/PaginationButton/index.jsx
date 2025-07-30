'use client';

import { Button } from '../../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../libs/utils';

export function PaginationButton({ direction, onClick, disabled = false, className }) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-9 w-9 border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      aria-label={direction === 'prev' ? 'Previous page' : 'Next page'}
    >
      <Icon className='h-4 w-4' />
    </Button>
  );
}
