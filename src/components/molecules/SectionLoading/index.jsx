import React from 'react';

export default function SectionLoading({
  loading = false,
  className = '',
  ...props
}) {
  return (
    loading && (
      <div
        className={`absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-primary/10 bg-opacity-75 ${className}`}
        {...props}
      >
        <div className="h-6 w-6 animate-spin rounded-full border-b-4 border-primary"></div>
      </div>
    )
  );
}
