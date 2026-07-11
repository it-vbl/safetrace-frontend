import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';
import {
  formatDecimalInput,
  formatDecimalOnChange,
  parseDecimalInput,
} from '@/utils/decimalFormat';

import ErrorOutline from '../../atoms/Icons/ErrorOutline'; // Added import for ErrorOutline
import RemoveRedEye from '../../atoms/Icons/RemoveRedEye';
import RemoveRedEyeCross from '../../atoms/Icons/RemoveRedEyeCross';
import Label from '../../atoms/Label';
import Paragraph from '../../atoms/Typography/Paragraph';

const InputText = ({
  placeholder = '',
  value = '',
  onChange = (e) => {},
  label = '',
  helperText = '',
  isError = false,
  type = 'text',
  prefix = null,
  suffix = '',
  className = '',
  containerClassName = '',
  isRequired = false,
  disabled = false,
  formatter = null,
  minNumber = null,
  maxNumber = null,
  maxChar = null,
  errors,
  touched,
  onBlur = () => {},
  name,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const isPassword = type === 'password'; // Use strict equality

  const filledClassName = {
    field: inputValue !== '' ? 'border-neutral-400' : '', // Use inputValue instead of value
  };
  const disabledClassName = {
    field: disabled
      ? 'bg-neutral-200 border-neutral-400'
      : 'focus-within:border-primary hover:border-primary',
    input: disabled
      ? 'cursor-not-allowed bg-neutral-200 text-neutral-500 placeholder:text-neutral-500'
      : 'cursor-auto',
  };

  const errorClassName = {
    field: touched?.[name] && errors?.[name] ? '!border-tertiary' : '',
    helperText: touched?.[name] && errors?.[name] ? 'text-tertiary' : '',
  };
  const inputType = useMemo(() => {
    if (isPassword) {
      return isShowPassword ? 'text' : 'password';
    }
    if (type === 'decimal') {
      return 'text';
    }
    return type;
  }, [isPassword, isShowPassword, type]);

  const validateEmoji = (value) => {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
    return emojiRegex.test(value);
  };

  const validateNumberRange = (value, minNumber, maxNumber) =>
    maxNumber && (value < minNumber || value > maxNumber);

  const validateTwoSpaces = (value) => {
    const notAllowingTwoSpace = / {2}/;
    return notAllowingTwoSpace.test(value);
  };

  const handleOnChange = (e) => {
    if (disabled || e.target.value === ' ') return;

    const { value } = e.target;

    if (validateEmoji(value)) return;

    if (type === 'number') {
      let val = value;

      // Allow only numbers, one decimal point, and one negative sign
      val = val.replace(/(?!^)-|[^0-9.-]/g, '');

      // Allow only one decimal point
      const dotParts = val.split('.');
      if (dotParts.length > 2) {
        val = dotParts[0] + '.' + dotParts.slice(1).join('');
      }

      // Allow only one negative sign at the beginning
      const negativeParts = val.split('-');
      if (negativeParts.length > 2) {
        val = negativeParts[0] + '-' + negativeParts.slice(1).join('');
      }

      // Remove leading zeros (but allow "0." or "-0.")
      if (val !== '0' && val !== '-0' && val !== '0.' && val !== '-0.') {
        val = val.replace(/^0+(?=\d)/, '');
      }

      e.target.value = val;

      // Validate number range if the value is a valid number
      const numValue = parseFloat(val);
      if (val !== '' && val !== '-' && val !== '.' && !isNaN(numValue)) {
        if (validateNumberRange(numValue, minNumber, maxNumber)) return;
      }
    }

    if (type === 'string' && formatter) {
      e.target.value = formatter(value);

      const string = Number(value.replace(/\D/g, ''));
      if (validateNumberRange(string, minNumber, maxNumber)) return;
    }

    if (maxChar && value.length > maxChar) return;

    if (validateTwoSpaces(value)) return;

    if (type === 'latitude' || type === 'longitude') {
      let val = e.target.value;
      val = val.replace(/(?!^)-|[^0-9.-]/g, '');

      // Step 2: Allow only one decimal point
      const dotParts = val.split('.');
      if (dotParts.length > 2) {
        val = dotParts[0] + '.' + dotParts.slice(1).join('');
      }

      // Step 3: Allow only one negative sign
      const negativeParts = val.split('-');
      if (negativeParts.length > 2) {
        val = negativeParts[0] + '-' + negativeParts.slice(1).join('');
      }

      e.target.value = val;
    }

    if (type === 'decimal') {
      const formatted = formatDecimalOnChange(value);
      e.target.value = formatted;

      // Validate number range if the value is a valid number (but allow partial input like "1000,")
      const parsedValue = parseDecimalInput(formatted);
      // Only validate if we have a complete number (not ending with comma or just a comma)
      if (
        parsedValue !== '' &&
        parsedValue !== '-' &&
        parsedValue !== ',' &&
        !formatted.endsWith(',')
      ) {
        const numValue = parseFloat(parsedValue);
        if (!isNaN(numValue)) {
          if (validateNumberRange(numValue, minNumber, maxNumber)) return;
        }
      }
    }

    setInputValue(e.target.value);
    onChange(e);
  };

  const handleTogglePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleOnBlur = (e) => {
    // Format decimal on blur
    if (type === 'decimal' && e.target.value) {
      const parsed = parseDecimalInput(e.target.value);
      if (parsed !== '' && !isNaN(parseFloat(parsed))) {
        const formatted = formatDecimalInput(parsed);
        e.target.value = formatted;
        setInputValue(formatted);
        // Create a synthetic event with formatted value for onChange
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formatted,
          },
        };
        onChange(syntheticEvent);
      }
    }
    onBlur(e);
  };

  useEffect(() => {
    // Format decimal value when prop changes
    if (type === 'decimal' && value !== '') {
      // Check if value ends with comma (user is typing decimal part)
      const endsWithComma = value.endsWith(',');
      const hasComma = value.includes(',');

      // Use formatDecimalOnChange to preserve formatting including comma
      const formatted = formatDecimalOnChange(value);
      setInputValue(formatted);
    } else {
      setInputValue(value);
    }
  }, [value, type]);

  return (
    <div
      className={cn('flex w-full min-w-0 flex-col gap-1', containerClassName)}
    >
      {label && (
        <Label
          isRequired={isRequired}
          className="text-[12px] font-bold text-neutral-500"
          disabled={disabled}
        >
          {label}
        </Label>
      )}
      <div
        className={cn(
          'group relative flex h-[42px] w-full min-w-0 items-center gap-[10px] rounded-[4px] border border-neutral-300 bg-white',
          filledClassName.field,
          disabledClassName.field,
          errorClassName.field,
          disabled && 'focus-within:border-neutral-400'
        )}
      >
        {prefix && (
          <div className="shrink-0 pl-3 text-neutral-600">
            <Paragraph level={3}>{prefix}</Paragraph>
          </div>
        )}

        <input
          type={inputType}
          value={inputValue}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          placeholder={placeholder}
          className={cn(
            'h-full w-full rounded-[4px] px-3 text-[14px] placeholder:text-neutral-400 focus:outline-none',
            className,
            disabledClassName.input
          )}
          disabled={disabled}
          min={minNumber}
          max={maxNumber}
          name={name}
          {...props}
        />
        {(isError || isPassword || suffix) && (
          <div className="flex items-center gap-3 pr-3">
            {isError && <ErrorOutline />}
            {isPassword && (
              <button
                type="button"
                onClick={handleTogglePassword}
                className={cn(
                  'shrink-0 cursor-pointer',
                  disabled && 'cursor-not-allowed text-neutral-400'
                )}
                disabled={disabled}
                aria-label="Toggle password visibility"
              >
                {isShowPassword ? <RemoveRedEye /> : <RemoveRedEyeCross />}
              </button>
            )}
            {suffix && (
              <Paragraph
                level={2}
                className={cn(
                  'w-auto text-neutral-600',
                  disabled && 'text-neutral-400'
                )}
              >
                {suffix}
              </Paragraph>
            )}
          </div>
        )}
      </div>
      {helperText && (
        <Paragraph
          level={4}
          className={cn('mt-1 text-neutral-500', errorClassName.helperText)}
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

InputText.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.string,
  isError: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'decimal']),
  prefix: PropTypes.node,
  suffix: PropTypes.node || PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  formatter: PropTypes.func,
  minNumber: PropTypes.number,
  maxNumber: PropTypes.number,
  maxChar: PropTypes.number,
  errors: PropTypes.object,
  touched: PropTypes.object,
  onBlur: PropTypes.func,
  name: PropTypes.string.isRequired,
};

export default InputText;
