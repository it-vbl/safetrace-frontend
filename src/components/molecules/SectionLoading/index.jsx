import React from 'react';

export default function SectionLoading({
  loading = false,
  className = '',
  fixed = false,
  ...props
}) {
  return (
    loading && (
      <div
        className={`${
          fixed ? 'fixed inset-0 z-[9999]' : 'absolute left-0 top-0 z-50 h-full w-full'
        } flex items-center justify-center bg-primary/10 bg-opacity-75 ${className}`}
        {...props}
      >
        <div className="h-6 w-6 animate-spin rounded-full border-b-4 border-primary"></div>
      </div>
    )
  );
}
