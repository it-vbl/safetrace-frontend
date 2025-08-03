import { useEffect, useMemo, useRef, useState } from 'react';
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
  onChange = (e) => {},
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
    placeholder: 'Add new option',
    isLoading: false,
    onSubmitOption: () => {},
    addButtonText: 'Tambah',
    applyButtonText: 'Terapkan',
    validationSchema: null,
    maxLength: 255,
  },
  isCustomScrollBar = false,
  position = null,
  showSearchBar = false,
  errors = {},
  touched = {},
  onBlur = () => {},
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [isAddOption, setIsAddOption] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [isInsideModal, setIsInsideModal] = useState(false);
  const searchInputRef = useRef(null);
  const formAddOptionRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

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

  useEffect(() => {
    if (isDropdownOpen) {
      const modalEl = document?.getElementById('modal');
      const selectRect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const modalHeight = modalEl?.clientHeight;
      const spaceBelow = (modalEl ? modalHeight : windowHeight) - selectRect.bottom;
      const dropdownHeight = document?.querySelector('[data-testid="dropdown-menu"]')?.clientHeight;
      const dropdownPosition = spaceBelow < dropdownHeight ? 'top' : 'bottom';

      setDropdownPosition(dropdownPosition);
      setIsInsideModal(modalEl);
    }
  }, [isDropdownOpen]);

  const handleOptionChange = (optionValue) => {
    setSelectedValue(optionValue);
    onChange({ target: { name, value: optionValue } });
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const validOptions = useMemo(() => {
    return options?.filter((option) => option.label && option.label.trim() != '');
  }, [options]);

  const selectedOption = useMemo(() => {
    return validOptions.find((option) => selectedValue == option.value);
  }, [validOptions, selectedValue]);

  const filteredOptions = validOptions.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()));

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

  return (
    <div className={cn('flex flex-col gap-1', !isInsideModal && 'relative', block && 'w-full', containerClassName)}>
      {label && (
        <Label data-testid='label-container' className=' text-[12px] font-bold text-gray-500' isRequired={isRequired}>
          {label}
        </Label>
      )}
      <div ref={dropdownRef}>
        <div
          aria-disabled={disabled}
          tabIndex={0}
          data-testid='select-field'
          onClick={handleSelectFieldClick}
          onBlur={handleBlur}
          className={cn(
            ' flex min-h-[40px] w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-[6px] border bg-white px-3 py-2',
            {
              'cursor-not-allowed border-neutral6 bg-neutral4 text-neutral7': disabled,
              'hover:border-blue6 focus:border-blue6 focus:outline-none': !disabled,
              'border-neutral6': selectedValue && !disabled && !isError,
              'border-neutral5': !selectedValue && !disabled && !isError,
              '!border-error5': isError,
            },
            `${selectClassName}`
          )}
        >
          <Paragraph
            data-testid='selected-value'
            className={cn('w-full overflow-hidden text-[14px]', {
              '': selectedValue && !disabled,
              'text-neutral6': !selectedValue && !disabled,
              'text-neutral7': disabled,
            })}
            level={2}
          >
            {selectedValue && selectedValue !== '' ? selectedOption?.label : placeholder}
          </Paragraph>
          {selectedValue && (
            <CrossCircledIcon
              onClick={() => handleOptionChange('')}
              size={20}
              width={20}
              height={20}
              className='mr-2 scale-100 text-red-500 transition-all duration-300 hover:rotate-180 hover:scale-[1.1]'
            />
          )}
          <div className='flex flex-row items-center gap-2'>
            {isError && <ErrorOutline data-testid='error-icon' />}
            <ExpandMore
              size={16}
              data-testid='expand-icon'
              className={cn({ 'rotate-180': isDropdownOpen })}
              color={disabled ? theme?.colors?.neutral7 : theme?.colors?.neutral8}
            />
          </div>
        </div>

        {isDropdownOpen &&
          createPortal(
            <div
              data-testid='dropdown-menu'
              style={{
                position: 'absolute',
                top:
                  dropdownPosition === 'top'
                    ? dropdownRef.current.getBoundingClientRect().top -
                      (document?.querySelector('[data-testid="dropdown-menu"]')?.clientHeight || 200)
                    : dropdownRef.current.getBoundingClientRect().bottom,
                left: dropdownRef.current.getBoundingClientRect().left,
                width: dropdownRef.current.offsetWidth,
                zIndex: 99999,
              }}
              className={cn('rounded-[6px] bg-white p-2 shadow-sm', isCustomScrollBar && 'custom-scrollbar')}
            >
              {showSearchBar && (
                <div ref={searchInputRef}>
                  <InputText
                    placeholder={`Cari ${label?.toLocaleLowerCase()}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='relative'
                    containerClassName='mb-2'
                    suffix={<Search />}
                  />
                </div>
              )}

              <div className='max-h-[200px] overflow-y-auto'>
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
                  <Paragraph data-testid='no-options' level={4} className='py-2 text-center'>
                    Tidak ada pilihan
                  </Paragraph>
                )}
              </div>

              {allowAddOption.visible && (
                <form
                  ref={formAddOptionRef}
                  onSubmit={handleSubmitNewOption}
                  className='my-2'
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='flex flex-col gap-2'>
                    {isAddOption && (
                      <InputText
                        value={formik.values.newOption}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='newOption'
                        placeholder={allowAddOption.placeholder}
                        onClick={(e) => e.stopPropagation()}
                        containerClassName='mb-0 flex-1 px-2 mb-3'
                        isError={formik.touched.newOption && formik.errors.newOption}
                        helperText={formik.touched.newOption && formik.errors.newOption}
                        maxChar={allowAddOption.maxLength}
                      />
                    )}
                    <div className='flex items-center gap-2 px-2'>
                      <Button
                        variant='tertiary'
                        className='flex w-[135px] items-center gap-1.5 whitespace-nowrap'
                        icon={<Plus size={8} />}
                        size='small'
                        disabled={isAddOption}
                        onClick={handleAddOptionClick}
                      >
                        {allowAddOption.addButtonText}
                      </Button>
                      <Button
                        onClick={handleApplyClick}
                        variant='primary'
                        size='small'
                        isFullWidth
                        disabled={
                          allowAddOption.isLoading ||
                          !formik.values.newOption ||
                          !isAddOption ||
                          (formik.touched.newOption && formik.errors.newOption) ||
                          !formik.isValid
                        }
                      >
                        {allowAddOption.applyButtonText}
                      </Button>
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
          data-testid='helper-text'
          level={4}
          className={cn('relative z-0 text-neutral7', {
            'text-error5': isError,
          })}
        >
          {helperText}
        </Paragraph>
      )}
      {errors?.[name] && touched?.[name] && (
        <Paragraph level={4} className='text-error mt-1 text-red-500'>
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
