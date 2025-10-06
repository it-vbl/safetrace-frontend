import { useRef } from 'react';
import moment from 'moment';
import { BiCalendar } from 'react-icons/bi';
import { toast } from 'react-toastify';

const DatePicker = ({
  placeholder = '',
  label = '',
  value = '',
  name = '',
  onChange = () => {},
  onFocus = () => {},
  disabled = false,
  requiredField = false,
  customStylelabel = null,
  minDate = null,
  maxDate = null,
  disabledDates = [],
  errors = null,
  touched = null,
  onBlur = () => {},
  inputContainerClassName = '',
}) => {
  const dateInputRef = useRef(null);

  const handleOnClick = () => {
    dateInputRef.current.showPicker();
  };
  const _onChange = (event) => {
    const day = moment(event.target.value).date();
    const isDateDisabled = disabledDates?.find((item) => day === item);

    if (isDateDisabled) {
      toast.info('Please select date other than 29, 30 and 31');
    } else {
      onChange(event);
    }
  };

  return (
    <div className={`w-full ${label ? 'flex flex-col gap-1' : 'block'}`}>
      <div className="flex flex-row">
        <label
          htmlFor={name}
          className={`text-[12px] font-bold text-gray-500 ${customStylelabel}`}
        >
          {label}
        </label>
        {requiredField && <span className="text-sm text-red-500">*</span>}
      </div>

      <div
        className={`flex h-[42px] w-full items-center justify-between rounded-[4px] border border-neutral5 px-3 ${
          disabled
            ? 'cursor-not-allowed bg-neutral4 text-neutral8'
            : 'cursor-pointer bg-white'
        } ${inputContainerClassName}`}
        onClick={disabled ? () => {} : handleOnClick}
      >
        <p
          className={`text-[14px] ${
            !value ? 'text-neutral6' : disabled ? 'text-neutral8' : 'text-black'
          }`}
        >
          {value ? value : placeholder}
        </p>
        <input
          type="date"
          id={name}
          name={name}
          className="w-0  rounded-[4px] outline-none placeholder:text-neutral5"
          onChange={_onChange}
          ref={dateInputRef}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          value={moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD')}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <BiCalendar />
      </div>

      {errors && touched && errors[name] && touched[name] && (
        <div className="text-left text-sm text-red-500">{errors[name]}</div>
      )}
    </div>
  );
};

export default DatePicker;
