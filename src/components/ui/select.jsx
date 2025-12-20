'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

import { cn } from '@/libs/utils';

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        // We need to check if the click is inside the portal content as well
        const portalContent = document.getElementById('select-portal-content');
        if (portalContent && portalContent.contains(event.target)) {
          return;
        }
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
    <div className="relative" ref={selectRef}>
      {children({
        isOpen,
        selectedValue,
        handleSelect,
        setIsOpen,
        triggerRef,
      })}
    </div>
  );
}

export function SelectTrigger({
  children,
  className,
  onClick,
  triggerRef,
  ...props
}) {
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onClick}
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

export function SelectContent({ children, isOpen, triggerRef }) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [placement, setPlacement] = useState('bottom');

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const dropdownHeight = 200; // Approximate max height

      const newPlacement = spaceBelow < dropdownHeight ? 'top' : 'bottom';
      setPlacement(newPlacement);

      setCoords({
        top:
          newPlacement === 'bottom'
            ? rect.bottom + window.scrollY + 4
            : rect.top + window.scrollY - 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  const content = (
    <div
      id="select-portal-content"
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        transform: placement === 'top' ? 'translateY(-100%)' : 'none',
      }}
      className="z-[9999] max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
    >
      {children}
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : null;
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
export function SimpleSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      {({ isOpen, selectedValue, handleSelect, setIsOpen, triggerRef }) => (
        <>
          <SelectTrigger
            className={className}
            onClick={() => setIsOpen(!isOpen)}
            triggerRef={triggerRef}
          >
            <span>{selectedValue || placeholder}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectTrigger>
          <SelectContent isOpen={isOpen} triggerRef={triggerRef}>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                onSelect={handleSelect}
                selectedValue={selectedValue}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </>
      )}
    </Select>
  );
}
