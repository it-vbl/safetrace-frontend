import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Label from '@/components/atoms/Label';
import { cn } from '@/utils/cn';

const InputMessage = ({
    name,
    value = '',
    onChange = () => { },
    onBlur = () => { },
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
    time = '',
}) => {
    const handleChange = (e) => {
        onChange?.(e);
    };

    const currentTime = useMemo(() => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}.${String(
            now.getMinutes()
        ).padStart(2, '0')}`;
    }, []);

    const displayTime = time || currentTime;

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
                            'min-h-[298px] w-full rounded-[4px] border bg-white p-4 text-sm focus:outline-none focus:ring-2 flex-1',
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
                {showInput ? (
                    <Label className="text-[12px] font-bold text-transparent select-none">
                        {previewLabel}
                    </Label>
                ) : (
                    <Label className="hidden">{previewLabel}</Label>
                )}
                <div className="rounded-[4px] border border-gray-300 bg-[#faf1dc] p-6 flex flex-col flex-1 min-h-[298px]">
                    <span className="block text-sm font-bold text-gray-800 mb-4">
                        {previewLabel}
                    </span>
                    <div className="relative max-w-[90%] sm:max-w-[80%] rounded-[8px] bg-white p-4 shadow-sm w-fit self-start mb-auto">
                        <p className="whitespace-pre-line break-words text-sm text-gray-800 leading-relaxed">
                            {value || 'Preview pesan akan muncul di sini...'}
                        </p>
                        <div className="text-[10px] text-gray-400 text-right mt-2 font-medium">
                            {displayTime}
                        </div>
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
    time: PropTypes.string,
};

export default InputMessage;
