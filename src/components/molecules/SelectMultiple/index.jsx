import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Cascader from '@/components/atoms/Cascader';
import Close from '@/components/atoms/Icons/Close';
import ErrorOutline from '@/components/atoms/Icons/ErrorOutline';
import ExpandMore from '@/components/atoms/Icons/ExpandMore';
import Plus from '@/components/atoms/Icons/Plus';
import Search from '@/components/atoms/Icons/Search';
import Label from '@/components/atoms/Label';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import InputText from '@/components/molecules/InputText';
import useTouchOutside from '@/hooks/useTouchOutside';
import { cn } from '@/utils/cn';
import theme from '@/utils/tailwindTheme';

const SelectMultiple = ({
  label = '',
  onChange = () => { },
  disabled = false,
  options = [],
  placeholder = '',
  isRequired = false,
  isError = false,
  helperText = null,
  block = true,
  value = [],
  name = '',
  containerClassName = '',
  chipClassName = '',
  selectAll = '',
  withCheckbox = false,
  selectClassName = '',
  errors = {},
  touched = {},
  onBlur = () => { },
  isCustomScrollBar = false,
  allowAddOption = {
    visible: false,
    placeholder: 'Tambah opsi baru',
    isLoading: false,
    onSubmitOption: () => { },
    addButtonText: 'Tambah',
    cancelButtonText: 'Batalkan',
    applyButtonText: 'Terapkan',
    validationSchema: null,
    maxLength: 255,
  },
  showSearchBar = false,
}) => {
  const [selectedValues, setSelectedValues] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isAddOption, setIsAddOption] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownMenuRefVal = useRef(null);
  const searchInputRef = useRef(null);
  const formAddOptionRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    placement: 'bottom',
  });
  const [isPositionReady, setIsPositionReady] = useState(false);
  const [isInsideModal, setIsInsideModal] = useState(false);
  const resizeObserverRef = useRef(null);

  const calculateDropdownPosition = useCallback(() => {
    if (!dropdownRef.current) return;

    const selectRect = dropdownRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const modalEl = document?.getElementById('modal');

    const actualDropdownHeight = dropdownMenuRefVal.current
      ? dropdownMenuRefVal.current.getBoundingClientRect().height
      : 200;

    const spaceBelow = windowHeight - selectRect.bottom;
    const spaceAbove = selectRect.top;

    const placement =
      spaceBelow < actualDropdownHeight && spaceAbove > actualDropdownHeight
        ? 'top'
        : 'bottom';

    setDropdownPosition({
      top:
        placement === 'top'
          ? selectRect.top - actualDropdownHeight
          : selectRect.bottom,
      left: selectRect.left,
      width: selectRect.width,
      placement,
    });
    setIsPositionReady(true);

    setIsInsideModal(!!modalEl);
  }, []);

  const dropdownMenuRef = useCallback((node) => {
    if (node !== null) {
      dropdownMenuRefVal.current = node;

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      const observer = new ResizeObserver(() => {
        calculateDropdownPosition();
      });
      observer.observe(node);
      resizeObserverRef.current = observer;

      calculateDropdownPosition();
    } else {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      dropdownMenuRefVal.current = null;
    }
  }, [calculateDropdownPosition]);

  const errorClassName = {
    field:
      (touched?.[name] && errors?.[name]) || isError ? '!border-tertiary' : '',
    helperText:
      (touched?.[name] && errors?.[name]) || isError ? 'text-tertiary' : '',
  };

  const hasValue = selectedValues.length > 0;

  const handleBlur = () => {
    onBlur({ target: { name } });
  };

  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  const getDropdownZIndex = useCallback(() => {
    const modalEl = document?.getElementById('modal');
    if (modalEl) {
      return 10000;
    } else {
      return 1000;
    }
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) return;

    let scrollTimer = null;

    const handleScroll = (e) => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      const dropdownElement = document.querySelector(
        '[data-testid="dropdown-menu"]'
      );
      const selectElement = dropdownRef.current;

      if (
        dropdownElement &&
        selectElement &&
        !dropdownElement.contains(e.target) &&
        !selectElement.contains(e.target)
      ) {
        setIsDropdownOpen(false);
        return;
      }

      scrollTimer = setTimeout(() => {
        calculateDropdownPosition();
      }, 10);
    };

    const handleResize = () => {
      calculateDropdownPosition();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    document.addEventListener('scroll', handleScroll, true);

    calculateDropdownPosition();

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('scroll', handleScroll, true);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [isDropdownOpen, calculateDropdownPosition]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
        setSearchTerm('');
        setIsAddOption(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  useTouchOutside(dropdownRef, () => {
    setSearchTerm('');
    if (!isAddOption) {
      setIsDropdownOpen(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      newOption: '',
    },
    validationSchema: allowAddOption.validationSchema
      ? Yup.object({
        newOption: allowAddOption.validationSchema,
      })
      : undefined,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      if (values.newOption.trim()) {
        allowAddOption.onSubmitOption(values.newOption.trim());
        resetForm();
        setIsAddOption(false);
        setIsDropdownOpen(false);
      }
    },
  });

  const handleSubmitNewOption = (e) => {
    e.preventDefault();
    e.stopPropagation();
    formik.handleSubmit();
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    formik.handleSubmit();
  };

  const handleAddOptionClick = (e) => {
    e.stopPropagation();
    setIsAddOption(true);
  };

  const handleCancelClick = () => {
    setIsAddOption(false);
  };

  const handleSelectFieldClick = useCallback(() => {
    if (!disabled) {
      const willOpen = !isDropdownOpen;
      if (willOpen && dropdownRef.current) {
        const selectRect = dropdownRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const modalEl = document?.getElementById('modal');
        const estimatedHeight =
          dropdownMenuRefVal.current
            ? dropdownMenuRefVal.current.getBoundingClientRect().height
            : 200;
        const spaceBelow = windowHeight - selectRect.bottom;
        const spaceAbove = selectRect.top;
        const placement =
          spaceBelow < estimatedHeight && spaceAbove > estimatedHeight
            ? 'top'
            : 'bottom';
        setDropdownPosition({
          top:
            placement === 'top'
              ? selectRect.top - estimatedHeight
              : selectRect.bottom,
          left: selectRect.left,
          width: selectRect.width,
          placement,
        });
        setIsInsideModal(!!modalEl);
        setIsPositionReady(true);
      } else {
        setIsPositionReady(false);
      }
      setIsDropdownOpen((prev) => !prev);
      if (isAddOption) {
        setIsAddOption(false);
      }
    }
  }, [disabled, isAddOption, isDropdownOpen]);

  const validOptions = useMemo(() => {
    return options?.filter(
      (option) => option.label && option.label.trim() !== ''
    ) || [];
  }, [options]);

  const filteredOptions = useMemo(() => {
    const filtered = validOptions.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectAll && filtered.length > 0) {
      return [{ label: selectAll, value: 'all' }, ...filtered];
    }
    return filtered;
  }, [validOptions, searchTerm, selectAll]);

  const selectedOptions = useMemo(() => {
    return validOptions.filter((option) =>
      selectedValues.includes(option.value)
    );
  }, [validOptions, selectedValues]);

  const handleOptionChange = useCallback(
    (optionValue) => {
      let updatedValues;

      if (optionValue === 'all') {
        if (selectedValues.length === validOptions.length) {
          updatedValues = [];
        } else {
          updatedValues = validOptions.map((item) => item.value);
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
      const optionsLength = validOptions.length;

      selectedValuesLength === optionsLength
        ? setIsSelectAll(true)
        : setIsSelectAll(false);
    }
  }, [selectedValues, validOptions, selectAll]);

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
          className=" text-[12px] font-bold text-neutral-500"
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
          onBlur={handleBlur}
          className={cn(
            'flex min-h-[40px] w-full cursor-pointer items-center gap-1 rounded-[6px] border bg-white px-3 py-2',
            {
              'cursor-not-allowed border-neutral-400 bg-neutral-200 text-neutral-500':
                disabled,
              'hover:border-primary focus:border-primary focus:outline-none':
                !disabled,
              'border-neutral-400':
                hasValue &&
                !disabled &&
                !(touched?.[name] && errors?.[name]) &&
                !isError,
              'border-neutral-300':
                !hasValue &&
                !disabled &&
                !(touched?.[name] && errors?.[name]) &&
                !isError,
            },
            errorClassName.field,
            selectClassName
          )}
        >
          <div className="hide-scrollbar flex flex-1 flex-row items-center gap-1 overflow-x-auto">
            {selectedValues.length > 0 ? (
              <div className="hide-scrollbar flex flex-row flex-nowrap gap-1 overflow-x-auto">
                {selectedOptions.map((option) => (
                  <div
                    key={option.value}
                    className="bg-neutral2 flex items-center gap-1 rounded-[4px] bg-neutral-100 px-2 py-1"
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
                        'cursor-pointer hover:bg-neutral-100': !disabled,
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
                  'text-neutral-400': !disabled,
                  'text-neutral-500': disabled,
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

        {isDropdownOpen &&
          createPortal(
            <div
              ref={dropdownMenuRef}
              data-testid="dropdown-menu"
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: getDropdownZIndex(),
                maxHeight: '300px',
                visibility: isPositionReady ? 'visible' : 'hidden',
              }}
              className={cn(
                'flex flex-col rounded-[6px] border bg-white p-2 shadow-lg',
                isCustomScrollBar && 'custom-scrollbar'
              )}
            >
              {showSearchBar && (
                <div ref={searchInputRef}>
                  <InputText
                    placeholder={`Cari ${label?.toLocaleLowerCase()}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="relative text-[12px] "
                    containerClassName="mb-2 h-[32px] "
                    suffix={<Search />}
                  />
                </div>
              )}

              <div className="flex h-full flex-1 flex-shrink flex-col overflow-y-auto">
                {filteredOptions?.length > 0 ? (
                  filteredOptions?.map((option) => (
                    <Cascader
                      data-testid={`option-${option.value}`}
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
                  <Paragraph
                    data-testid="no-options"
                    level={4}
                    className="py-2 text-center"
                  >
                    Tidak ada pilihan
                  </Paragraph>
                )}
              </div>

              {allowAddOption.visible && (
                <form
                  ref={formAddOptionRef}
                  onSubmit={handleSubmitNewOption}
                  className="mt-2  flex h-full w-full flex-1 "
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex w-full flex-col gap-2">
                    {isAddOption && (
                      <InputText
                        value={formik.values.newOption}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="newOption"
                        placeholder={allowAddOption.placeholder}
                        onClick={(e) => e.stopPropagation()}
                        className="!h-[32px] !text-[12px]"
                        containerClassName="mb-0"
                        isError={
                          formik.touched.newOption && formik.errors.newOption
                        }
                        helperText={
                          formik.touched.newOption && formik.errors.newOption
                        }
                        maxChar={allowAddOption.maxLength}
                      />
                    )}
                    <div className="flex items-center gap-2">
                      {!isAddOption && (
                        <Button
                          variant="primary"
                          className="flex w-full items-center gap-1.5 whitespace-nowrap"
                          icon={<Plus size={8} />}
                          size="small"
                          disabled={isAddOption}
                          onClick={handleAddOptionClick}
                        >
                          {allowAddOption.addButtonText}
                        </Button>
                      )}
                      {isAddOption && (
                        <div className="flex w-full flex-row gap-2">
                          <Button
                            onClick={handleCancelClick}
                            variant="secondary"
                            size="small"
                            isFullWidth
                          >
                            {allowAddOption.cancelButtonText}
                          </Button>
                          <Button
                            onClick={handleApplyClick}
                            variant="primary"
                            size="small"
                            isFullWidth
                            disabled={
                              allowAddOption.isLoading ||
                              !formik.values.newOption ||
                              !isAddOption ||
                              (formik.touched.newOption &&
                                formik.errors.newOption) ||
                              !formik.isValid
                            }
                          >
                            {allowAddOption.applyButtonText}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>,
            document.body
          )}
      </div>
      {helperText && (
        <Paragraph
          level={4}
          className={cn('relative z-0 text-neutral-500', errorClassName.helperText)}
        >
          {helperText}
        </Paragraph>
      )}
      {errors?.[name] && touched?.[name] && (
        <Paragraph level={4} className="text-error mt-1 text-tertiary">
          {errors?.[name]}
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
  errors: PropTypes.object,
  touched: PropTypes.object,
  onBlur: PropTypes.func,
  isCustomScrollBar: PropTypes.bool,
  allowAddOption: PropTypes.shape({
    visible: PropTypes.bool,
    placeholder: PropTypes.string,
    isLoading: PropTypes.bool,
    onSubmitOption: PropTypes.func,
    addButtonText: PropTypes.string,
    applyButtonText: PropTypes.string,
    validationSchema: PropTypes.object,
  }),
  showSearchBar: PropTypes.bool,
};

export default SelectMultiple;
