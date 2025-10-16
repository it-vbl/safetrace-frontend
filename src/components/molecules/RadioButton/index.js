import PropTypes from 'prop-types';

import Label from '@/components/atoms/Label';
import Paragraph from '@/components/atoms/Typography/Paragraph';

import styles from './RadioButton.module.css';

const RadioButton = ({
  options = [],
  name = '',
  onChange = (e) => {},
  label = null,
  isRequired = false,
  helperText = null,
  isError = null,
  value = null | undefined,
  onChangeValue = (e) => {},
  size = 12,
  labelClassName = '',
  containerClassName = '',
  direction = 'column',
  gap = 'gap-2',
}) => {
  const handleOnChange = (e) => {
    onChange(e);
    onChangeValue(e.target.value);
  };

  // Determine flex direction classes
  const directionClasses =
    direction === 'row' ? `flex-row items-center ${gap}` : `flex-col ${gap}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-5">
        {label && (
          <Label
            isRequired={isRequired}
            className="text-[12px] font-bold text-gray-500"
          >
            {label}
          </Label>
        )}
        <div
          className={`${containerClassName} radio-button-group flex ${directionClasses} gap-8`}
        >
          {options.map((option) => (
            <label
              key={option.value}
              className={`radio-label flex items-center gap-2 ${
                direction === 'row' ? 'flex-shrink-0' : 'w-full'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleOnChange}
                style={{ width: size, height: size }}
                className={`${styles['radio-button']} cursor-pointer ${
                  isError ? '!border-error5' : 'border-gray-500'
                }`}
              />

              <Paragraph
                className={`cursor-pointer text-neutral9 ${labelClassName}`}
                level={3}
              >
                {option.label}
              </Paragraph>
            </label>
          ))}
        </div>
      </div>
      {helperText && (
        <Paragraph level={4} className="text-error5">
          {helperText}
        </Paragraph>
      )}
    </div>
  );
};

RadioButton.propTypes = {
  options: PropTypes.array,
  name: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  helperText: PropTypes.string,
  isError: PropTypes.bool,
  value: PropTypes.string,
  onChangeValue: PropTypes.func,
  size: PropTypes.number,
  labelClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  direction: PropTypes.oneOf(['row', 'column']),
  gap: PropTypes.string,
};

export default RadioButton;
