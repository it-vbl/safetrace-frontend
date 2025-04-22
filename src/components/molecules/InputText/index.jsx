import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

import ErrorOutline from '../../atoms/Icons/ErrorOutline'; // Added import for ErrorOutline
import RemoveRedEye from '../../atoms/Icons/RemoveRedEye';
import RemoveRedEyeCross from '../../atoms/Icons/RemoveRedEyeCross';
import Label from '../../atoms/Label';
import Paragraph from '../../atoms/Typography/Paragraph';

const InputText = ({
  placeholder = '',
  value = '',
  label = '',
  helperText = '',
  isError = false,
  type = 'text',
  prefix = null,
  suffix = null,
  className = '',
  containerClassName = '',
  isRequired = false,
  disabled = false,
  formatter = null,
  minNumber = null,
  maxNumber = null,
  maxChar = null,
  onChange = (e) => {},
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const isPassword = type === 'password'; // Use strict equality

  const filledClassName = {
    field: inputValue !== '' ? 'border-neutral6' : '', // Use inputValue instead of value
  };
  const disabledClassName = {
    field: disabled ? 'bg-neutral4 border-neutral6' : 'focus-within:border-blue6 hover:border-blue6',
    input: disabled ? 'cursor-not-allowed bg-neutral4 text-neutral7 placeholder:text-neutral7' : 'cursor-auto',
  };

  const errorClassName = {
    field: isError ? '!border-error5' : '',
    helperText: isError ? 'text-error5' : '',
  };
  const inputType = useMemo(() => {
    if (isPassword) {
      return isShowPassword ? 'text' : 'password';
    }
    return type;
  }, [isPassword, isShowPassword, type]);

  const validateEmoji = (value) => {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
    return emojiRegex.test(value);
  };

  const validateNumberRange = (value, minNumber, maxNumber) => maxNumber && (value < minNumber || value > maxNumber);

  const validateTwoSpaces = (value) => {
    const notAllowingTwoSpace = / {2}/;
    return notAllowingTwoSpace.test(value);
  };

  const handleOnChange = (e) => {
    if (disabled || e.target.value === ' ') return;

    const { value } = e.target;

    if (validateEmoji(value)) return;

    if (type === 'number') {
      e.target.value = value.replace(/^0+(?=\d)/, '');
      if (validateNumberRange(value, minNumber, maxNumber)) return;
    }

    if (type === 'string' && formatter) {
      e.target.value = formatter(value);

      const string = Number(value.replace(/\D/g, ''));
      if (validateNumberRange(string, minNumber, maxNumber)) return;
    }

    if (maxChar && value.length > maxChar) return;

    if (validateTwoSpaces(value)) return;

    setInputValue(e.target.value);
    onChange(e);
  };

  const handleTogglePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={cn('flex w-full flex-col gap-1', containerClassName)}>
      {label && (
        <Label isRequired={isRequired} disabled={disabled}>
          {label}
        </Label>
      )}
      <div
        className={cn(
          'group relative flex h-[40px] w-full items-center gap-[10px] rounded-md border border-neutral5 bg-white',
          filledClassName.field,
          disabledClassName.field,
          errorClassName.field,
          disabled && 'focus-within:border-neutral6'
        )}
      >
        {prefix && (
          <div className='shrink-0 pl-3 text-neutral8'>
            <Paragraph level={2}>{prefix}</Paragraph>
          </div>
        )}

        <input
          type={inputType}
          value={inputValue}
          onChange={handleOnChange}
          placeholder={placeholder}
          className={cn(
            'h-full w-full rounded-md px-3 text-base placeholder:text-neutral6 focus:outline-none',
            className,
            disabledClassName.input
          )}
          disabled={disabled}
          min={minNumber}
          max={maxNumber}
          {...props}
        />
        {(isError || isPassword || suffix) && (
          <div className='flex items-center gap-3 pr-3'>
            {isError && <ErrorOutline />}
            {isPassword && (
              <button
                type='button'
                onClick={handleTogglePassword}
                className={cn('shrink-0 cursor-pointer', disabled && 'cursor-not-allowed text-neutral6')}
                disabled={disabled}
                aria-label='Toggle password visibility'
              >
                {isShowPassword ? <RemoveRedEye /> : <RemoveRedEyeCross />}
              </button>
            )}
            {suffix && (
              <Paragraph level={2} className={cn('shrink-0 text-neutral8', disabled && 'text-neutral6')}>
                {suffix}
              </Paragraph>
            )}
          </div>
        )}
      </div>
      {helperText && (
        <Paragraph level={4} className={cn('mt-1 text-neutral7', errorClassName.helperText)}>
          {helperText}
        </Paragraph>
      )}
    </div>
  );
};

InputText.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.string,
  isError: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number']),
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  formatter: PropTypes.func,
  minNumber: PropTypes.number,
  maxNumber: PropTypes.number,
  maxChar: PropTypes.number,
};

export default InputText;
