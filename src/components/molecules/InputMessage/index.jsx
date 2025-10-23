import PropTypes from 'prop-types';

import Label from '@/components/atoms/Label';
import { cn } from '@/utils/cn';

const InputMessage = ({
  name,
  value = '',
  onChange = () => {},
  onBlur = () => {},
  inputLabel = 'Isi Pesan',
  previewLabel = 'Preview',
  placeholder = 'Tulis pesan Anda di sini...',
  rows = 14,
  showInput = true,
  editable = true,
  showCharCount = true,
  charCountMax = 160,
  containerClassName = '',
  inputContainerClassName = '',
  previewContainerClassName = '',
  inputClassName = '',
  error = false,
  errorText = '',
}) => {
  const handleChange = (e) => {
    onChange?.(e);
  };

  return (
    <div className={cn('flex flex-col gap-6 lg:flex-row', containerClassName)}>
      {showInput && (
        <div
          className={cn(
            'flex w-full flex-col gap-1 lg:w-1/2',
            inputContainerClassName
          )}
        >
          <Label className="text-[12px] font-bold text-gray-500">
            {inputLabel}
          </Label>
          <textarea
            name={name}
            rows={rows}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={!editable}
            placeholder={placeholder}
            className={cn(
              'min-h-[298px] w-full rounded-[4px] border bg-white p-4 text-sm focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500',
              inputClassName
            )}
          />
          {error && errorText && (
            <span className="text-xs text-red-500">{errorText}</span>
          )}
        </div>
      )}

      <div
        className={cn(
          'flex w-full flex-col gap-1',
          showInput ? 'lg:w-1/2' : '',
          previewContainerClassName
        )}
      >
        <Label className="text-[12px] font-bold text-gray-500">
          {previewLabel}
        </Label>
        <div className="rounded-[4px] border border-gray-300 bg-yellow-50 p-4">
          <div className="text-sm text-gray-700">
            <p className="whitespace-pre-line break-words leading-relaxed">
              {value || 'Preview pesan akan muncul di sini...'}
            </p>
          </div>
          {showCharCount && (
            <div className="mt-4 flex justify-end">
              <span className="text-xs text-gray-500">
                {value?.length ?? 0}/{charCountMax}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

InputMessage.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  inputLabel: PropTypes.string,
  previewLabel: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  showInput: PropTypes.bool,
  editable: PropTypes.bool,
  showCharCount: PropTypes.bool,
  charCountMax: PropTypes.number,
  containerClassName: PropTypes.string,
  inputContainerClassName: PropTypes.string,
  previewContainerClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  error: PropTypes.bool,
  errorText: PropTypes.string,
};

export default InputMessage;
