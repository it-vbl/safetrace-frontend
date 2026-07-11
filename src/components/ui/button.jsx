'use client';

import { cn } from '@/libs/utils';

const buttonVariants = {
  variant: {
    default: 'bg-neutral-900 text-white hover:bg-neutral-800',
    outline: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50',
    ghost: 'text-neutral-700 hover:bg-neutral-100',
    destructive: 'bg-tertiary text-white hover:bg-tertiary/90',
  },
  size: {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  },
};

export function Button({
  children,
  variant = 'default',
  size = 'default',
  className,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
