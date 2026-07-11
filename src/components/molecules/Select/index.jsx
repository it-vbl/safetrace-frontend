import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import * as Yup from 'yup';

import Button from '@/components/atoms/Button';
import Cascader from '@/components/atoms/Cascader';
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
import { CrossCircledIcon } from '@radix-ui/react-icons';

const Select = ({
  label = '',
  onChange = (e) => { },
  disabled = false,
  options = [],
  placeholder = '',
  isRequired = false,
  isError = false,
  helperText = null,
  block = true,
  value = null,
  name = '',
  containerClassName = '',
  selectClassName = '',
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
  isCustomScrollBar = false,
  position = null,
  showSearchBar = false,
  errors = {},
  touched = {},
  onBlur = () => { },
  onSearchChange = () => { },
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [isAddOption, setIsAddOption] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    placement: 'bottom',
  });
  const [isInsideModal, setIsInsideModal] = useState(false);
  const searchInputRef = useRef(null);
  const formAddOptionRef = useRef(null);
  const dropdownMenuRefVal = useRef(null);
  const resizeObserverRef = useRef(null);

  const getDropdownZIndex = useCallback(() => {
    const modalEl = document?.getElementById('modal');
    if (modalEl) {
      return 10000;
    } else {
      return 1000;
    }
  }, []);

  const calculateDropdownPosition = useCallback(() => {
    if (!dropdownRef.current) return;

    const selectRect = dropdownRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const modalEl = document?.getElementById('modal');

    const actualDropdownHeight = dropdownMenuRefVal.current
      ? dropdownMenuRefVal.current.getBoundingClientRect().height
      : 300;

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
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    if (showSearchBar) {
      onSearchChange(searchTerm);
    }
  }, [searchTerm, showSearchBar, onSearchChange]);

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

  const handleSelectFieldClick = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen);
      if (isAddOption) {
        setIsAddOption(false);
      }
    }
  };

  const handleOptionChange = (optionValue) => {
    setSelectedValue(optionValue);
    onChange({ target: { name, value: optionValue } });
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const validOptions = useMemo(() => {
    return options?.filter(
      (option) => option.label && option.label.trim() != ''
    );
  }, [options]);

  const selectedOption = useMemo(() => {
    return validOptions.find((option) => {
      if (typeof selectedValue === 'string' && typeof option.value === 'string') {
        return selectedValue.toLowerCase() === option.value.toLowerCase();
      }
      return selectedValue == option.value;
    });
  }, [validOptions, selectedValue]);

  const filteredOptions = validOptions.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleBlur = () => {
    onBlur({ target: { name } });
  };

  const handleCancelClick = () => {
    setIsAddOption(false);
  };

  const errorClassName = {
    field:
      (touched?.[name] && errors?.[name]) || isError ? '!border-tertiary' : '',
    helperText:
      (touched?.[name] && errors?.[name]) || isError ? 'text-tertiary' : '',
  };

  const hasValue = (val) => val !== null && val !== undefined && val !== '';

  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        !isInsideModal && 'relative',
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
      <div ref={dropdownRef}>
        <div
          aria-disabled={disabled}
          tabIndex={0}
          data-testid="select-field"
          onClick={handleSelectFieldClick}
          onBlur={handleBlur}
          className={cn(
            ' flex min-h-[40px] w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-[6px] border bg-white px-3 py-2',
            {
              'cursor-not-allowed border-neutral-400 bg-neutral-200 text-neutral-500':
                disabled,
              'hover:border-primary focus:border-primary focus:outline-none':
                !disabled,
              'border-neutral-400':
                hasValue(selectedValue) &&
                !disabled &&
                !(touched?.[name] && errors?.[name]) &&
                !isError,
              'border-neutral-300':
                !hasValue(selectedValue) &&
                !disabled &&
                !(touched?.[name] && errors?.[name]) &&
                !isError,
            },
            errorClassName.field,
            `${selectClassName}`
          )}
        >
          <Paragraph
            data-testid="selected-value"
            className={cn('w-full overflow-hidden text-[14px]', {
              '': hasValue(selectedValue) && !disabled,
              'text-neutral-400': !hasValue(selectedValue) && !disabled,
              'text-neutral-500': disabled,
            })}
            level={2}
          >
            {hasValue(selectedValue) ? selectedOption?.label : placeholder}
          </Paragraph>
          {hasValue(selectedValue) && (
            <CrossCircledIcon
              onClick={(e) => {
                if (!disabled) {
                  handleOptionChange('');
                  e.stopPropagation();
                }
              }}
              size={20}
              width={20}
              height={20}
              className={cn(
                'mr-2 scale-100 text-tertiary transition-all duration-300',
                {
                  'cursor-pointer hover:rotate-180 hover:scale-[1.1]':
                    !disabled,
                  'cursor-not-allowed opacity-50': disabled,
                }
              )}
            />
          )}
          <div className="flex flex-row items-center gap-2">
            <ExpandMore
              size={16}
              data-testid="expand-icon"
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
                      onClick={() => handleOptionChange(option.value)}
                      value={option.value}
                      isSelected={selectedValue === option?.value}
                      disabled={option?.disabled}
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
          data-testid="helper-text"
          level={4}
          className={cn(
            'relative z-0 text-neutral-500',
            errorClassName.helperText
          )}
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

Select.propTypes = {
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
  containerClassName: PropTypes.string,
  allowAddOption: PropTypes.shape({
    visible: PropTypes.bool,
    placeholder: PropTypes.string,
    isLoading: PropTypes.bool,
    onSubmitOption: PropTypes.func,
    addButtonText: PropTypes.string,
    applyButtonText: PropTypes.string,
    validationSchema: PropTypes.object,
  }),
  name: PropTypes.string,
  selectClassName: PropTypes.string,
  isCustomScrollBar: PropTypes.bool,
  position: PropTypes.string,
};

export default Select;
