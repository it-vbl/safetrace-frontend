import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

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
  selectClassName = '',
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
  const validOptions = options?.filter(
    (option) => option.label && option.label.trim() !== ''
  );
  selectAll && validOptions.unshift({ label: selectAll, value: 'all' });

  const selectedOptions = validOptions.filter((option) =>
    selectedValues.includes(option.value)
  );

  const handleOptionChange = useCallback(
    (optionValue) => {
      let updatedValues;

      if (optionValue === 'all') {
        if (selectedValues.length === validOptions.length - 1) {
          updatedValues = [];
        } else {
          updatedValues = validOptions
            .filter((item) => item.value !== 'all')
            .map((item) => item.value);
        }
      } else if (selectedValues.includes(optionValue)) {
        updatedValues = selectedValues.filter((v) => v !== optionValue);
      } else {
        updatedValues = [...selectedValues, optionValue];
      }

      setSelectedValues(updatedValues);
      onChange({ target: { name, value: updatedValues } });
    },
    [onChange, name, validOptions, selectedValues]
  );

  useEffect(() => {
    if (selectAll) {
      const selectedValuesLength = selectedValues.length;
      const optionsLength = validOptions?.filter?.(
        (item) => item.value !== 'all'
      ).length;

      selectedValuesLength === optionsLength
        ? setIsSelectAll(true)
        : setIsSelectAll(false);
    }
  }, [selectedValues, options]);

  return (
    <div
      className={cn(
        ' relative flex flex-col gap-1',
        block && 'w-full',
        containerClassName
      )}
    >
      {label && (
        <Label
          data-testid="label-container"
          className=" text-[12px] font-bold text-gray-500"
          isRequired={isRequired}
        >
          {label}
        </Label>
      )}
      <div className="relative " ref={dropdownRef}>
        <div
          aria-disabled={disabled}
          tabIndex={0}
          onClick={handleSelectFieldClick}
          className={cn(
            'flex h-[40px] w-full cursor-pointer items-center gap-1 rounded-[6px] border px-3 py-2',
            {
              'cursor-not-allowed border-neutral6 bg-neutral4 text-neutral7':
                disabled,
              'border-neutral8 hover:border-blue6':
                selectedValues.length > 0 && !disabled && !isError,
              'border-neutral5 hover:border-blue6':
                selectedValues.length === 0 && !disabled && !isError,
              'focus:border-blue6 focus:outline-none': !disabled && !isError,
              'border-error5': isError,
            },
            selectClassName
          )}
        >
          <div className="hide-scrollbar flex flex-1 flex-row items-center gap-1 overflow-x-auto">
            {selectedValues.length > 0 ? (
              <div className="hide-scrollbar flex flex-row flex-nowrap gap-1 overflow-x-auto">
                {selectedOptions.map((option) => (
                  <div
                    key={option.value}
                    className="bg-neutral2 flex items-center gap-1 rounded-[4px] bg-gray-100 px-2 py-1"
                  >
                    <Paragraph
                      level={4}
                      className="max-w-[100px] truncate text-xs"
                    >
                      {option.label}
                    </Paragraph>
                    <div
                      onClick={(e) => {
                        if (!disabled) {
                          e.stopPropagation();
                          handleOptionChange(option.value);
                        }
                      }}
                      className={cn('rounded p-0.5', {
                        'cursor-pointer hover:bg-neutral3': !disabled,
                        'cursor-not-allowed opacity-50': disabled,
                      })}
                    >
                      <Close size={12} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Paragraph
                className={cn('w-full truncate', {
                  'text-neutral6': !disabled,
                  'text-neutral7': disabled,
                })}
                level={2}
              >
                {placeholder}
              </Paragraph>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            {isError && <ErrorOutline />}
            <ExpandMore
              className={cn({ 'rotate-180': isDropdownOpen })}
              color={
                disabled ? theme?.colors?.neutral7 : theme?.colors?.neutral8
              }
            />
          </div>
        </div>

        {isDropdownOpen && (
          <div className="absolute left-0 top-full z-10 mt-1 max-h-[200px] w-full overflow-y-auto rounded-[6px] bg-white p-2 shadow-sm">
            {validOptions?.length > 0 ? (
              validOptions?.map((option) => (
                <Cascader
                  key={option.value}
                  onClick={() => handleOptionChange(option?.value)}
                  value={option.value}
                  isSelected={
                    option.value === 'all'
                      ? isSelectAll
                      : selectedValues?.includes(option.value)
                  }
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
          className={cn('relative z-0 text-neutral7', {
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
