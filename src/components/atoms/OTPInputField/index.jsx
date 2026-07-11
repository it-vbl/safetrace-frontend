'use client';

import { forwardRef, useEffect, useImperativeHandle,useRef } from 'react';

export const OTPInput = forwardRef(function OTPInput({ value, onChange, index, onKeyDown, autoFocus = false }, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    },
  }));

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    onChange(newValue);
  };

  const handleKeyDown = (e) => {
    onKeyDown(e, index);
  };

  return (
    <input
      ref={inputRef}
      type='text'
      inputMode='numeric'
      maxLength={1}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className='h-16 w-16 rounded-lg border-2 border-neutral-300 bg-white text-center text-xl font-semibold focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
    />
  );
});
