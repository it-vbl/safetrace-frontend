'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/libs/utils';

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={selectRef}>
      {children({ isOpen, selectedValue, handleSelect, setIsOpen })}
    </div>
  );
}

export function SelectTrigger({ children, className, ...props }) {
  return (
    <button
      type='button'
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
        'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children, isOpen }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const { height } = contentRef.current.getBoundingClientRect();
      contentRef.current.style.top = `-${height + 10}px`;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className='absolute left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg'
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, onSelect, selectedValue }) {
  const isSelected = selectedValue === value;

  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center px-3 py-2 text-sm',
        'hover:bg-gray-100 focus:bg-gray-100',
        isSelected && 'bg-gray-100 font-medium'
      )}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}

// Wrapper component to make it work like shadcn Select
export function SimpleSelect({ value, onValueChange, options, placeholder, className }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      {({ isOpen, selectedValue, handleSelect, setIsOpen }) => (
        <>
          <SelectTrigger className={className} onClick={() => setIsOpen(!isOpen)}>
            <span>{selectedValue || placeholder}</span>
            <ChevronDown className='h-4 w-4 opacity-50' />
          </SelectTrigger>
          <SelectContent isOpen={isOpen}>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} onSelect={handleSelect} selectedValue={selectedValue}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </>
      )}
    </Select>
  );
}
