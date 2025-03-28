import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useCallback } from 'react';

import Cascader from '@/components/atoms/Cascader';
import Close from '@/components/atoms/Icons/Close';
import ErrorOutline from '@/components/atoms/Icons/ErrorOutline';
import ExpandMore from '@/components/atoms/Icons/ExpandMore';
import Label from '@/components/atoms/Label';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import { cn } from '@/utils/cn';
import theme from '@/utils/tailwindTheme';

const SelectMultiple = ({
  label = '',
  onChange = () => {},
  disabled = false,
  options,
  placeholder = '',
  isRequired = false,
  isError = false,
  helperText,
  block = true,
  value = [],
  name,
  containerClassName,
  chipClassName = '',
  selectAll = '',
  withCheckbox = false,
}) => {
  const [selectedValues, setSelectedValues] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectFieldClick = useCallback(() => {
    if (!disabled) {
      setIsDropdownOpen((prev) => !prev);
    }
  }, [disabled]);

  // Filter out options without labels
  const validOptions = options?.filter((option) => option.label && option.label.trim() !== '');
  selectAll && validOptions.unshift({ label: selectAll, value: 'all' });

  const selectedOptions = validOptions.filter((option) => selectedValues.includes(option.value));

  const handleOptionChange = useCallback(
    (optionValue) => {
      setSelectedValues((prevValues) => {
        let updatedValues;

        if (optionValue === 'all') {
          if (prevValues.length === validOptions.length - 1) {
            // Remove all values
            updatedValues = [];
          } else {
            // Fill all values
            updatedValues = validOptions.filter((item) => item.value !== 'all').map((item) => item.value);
          }
        } else if (prevValues.includes(optionValue)) {
          // Remove selected value
          updatedValues = prevValues.filter((v) => v !== optionValue);
        } else {
          // Add selected value
          updatedValues = [...prevValues, optionValue];
        }

        onChange({ target: { name, value: updatedValues } });
        return updatedValues;
      });
    },
    [onChange, name, validOptions]
  );

  useEffect(() => {
    if (selectAll) {
      const selectedValuesLength = selectedValues.length;
      const optionsLength = validOptions?.filter?.((item) => item.value !== 'all').length;

      selectedValuesLength === optionsLength ? setIsSelectAll(true) : setIsSelectAll(false);
    }
  }, [selectedValues, options]);

  return (
    <div className={cn('relative flex flex-col gap-1', block && 'w-full', containerClassName)}>
      {label && (
        <Label isRequired={isRequired} className='text-neutral11 font-bold'>
          {label}
        </Label>
      )}
      <div className='relative' ref={dropdownRef}>
        <div
          aria-disabled={disabled}
          tabIndex={0}
          onClick={handleSelectFieldClick}
          className={cn('flex min-h-[52px] w-full cursor-pointer items-center gap-1 rounded-[6px] border px-3 py-2', {
            'border-neutral6 bg-neutral4 text-neutral7 cursor-not-allowed': disabled,
            'border-neutral8 hover:border-blue6': selectedValues.length > 0 && !disabled && !isError,
            'border-neutral5 hover:border-blue6': selectedValues.length === 0 && !disabled && !isError,
            'focus:border-blue6 focus:outline-none': !disabled && !isError,
            'border-error5': isError,
          })}
        >
          <div className='hidden-barscrolling flex max-h-[130px] w-full flex-wrap gap-1 overflow-y-auto'>
            {selectedValues.length > 0 ? (
              selectedOptions.map((option) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionChange(option.value);
                  }}
                  key={option.value}
                  className={`flex min-w-[100px] items-center justify-between gap-1.5 rounded-full border border-[#DEDEDE] px-3 py-1 ${chipClassName}`}
                >
                  <Paragraph level={4}>{option.label}</Paragraph>
                  <button className='bg-blue8 hover:text-blue9 flex size-4 items-center justify-center rounded-full'>
                    <Close size={14} color='white' />
                  </button>
                </div>
              ))
            ) : (
              <Paragraph
                className={cn('w-full', {
                  'text-neutral6': !disabled,
                  'text-neutral7': disabled,
                })}
                level={2}
              >
                {placeholder}
              </Paragraph>
            )}
          </div>
          <div className='flex flex-row items-center gap-2'>
            {isError && <ErrorOutline />}
            <ExpandMore
              className={cn({ 'rotate-180': isDropdownOpen })}
              color={disabled ? theme?.colors?.neutral7 : theme?.colors?.neutral8}
            />
          </div>
        </div>

        {isDropdownOpen && (
          <div className='absolute left-0 top-full z-10 mt-1 max-h-[200px] w-full overflow-y-auto rounded-[6px] bg-white p-2 shadow-sm'>
            {validOptions?.length > 0 ? (
              validOptions?.map((option) => (
                <Cascader
                  key={option.value}
                  onClick={() => handleOptionChange(option?.value)}
                  value={option.value}
                  isSelected={option.value === 'all' ? isSelectAll : selectedValues?.includes(option.value)}
                  checkbox={withCheckbox}
                >
                  {option.label}
                </Cascader>
              ))
            ) : (
              <Paragraph level={4}>Not available</Paragraph>
            )}
          </div>
        )}
      </div>
      {helperText && (
        <Paragraph
          level={4}
          className={cn('text-neutral7 relative z-0', {
            'text-error5': isError,
          })}
        >
          {helperText}
        </Paragraph>
      )}
    </div>
  );
};

SelectMultiple.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.any, PropTypes.arrayOf(PropTypes.any)]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  isError: PropTypes.bool,
  helperText: PropTypes.string,
  block: PropTypes.bool,
  name: PropTypes.string,
  containerClassName: PropTypes.string,
  chipClassName: PropTypes.string,
  selectAll: PropTypes.string,
  withCheckbox: PropTypes.bool,
};

export default SelectMultiple;
