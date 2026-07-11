'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../../libs/utils';
import { Button } from '../../ui/button';

export function PaginationButton({ direction, onClick, disabled = false, className }) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-9 w-9 border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      aria-label={direction === 'prev' ? 'Previous page' : 'Next page'}
    >
      <Icon className='h-4 w-4' />
    </Button>
  );
}
