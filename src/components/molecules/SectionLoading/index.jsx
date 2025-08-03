import React from 'react';

export default function SectionLoading({ loading = false, className = '', ...props }) {
  return (
    loading && (
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-100 bg-opacity-90 ${className}`}
        {...props}
      >
        <div className='h-6 w-6 animate-spin rounded-full border-b-4 border-primary'></div>
      </div>
    )
  );
}
