import { cn } from '@/libs/utils';

export function PaginationText({ children, className, variant = 'default' }) {
  return (
    <span
      className={cn(
        'text-sm',
        variant === 'muted' && 'text-muted-foreground',
        variant === 'default' && 'text-gray-700',
        variant === 'loading' && 'animate-pulse text-gray-400',
        className
      )}
    >
      {children}
    </span>
  );
}
