import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import CalenderToday from '@/components/atoms/Icons/CalenderToday';
import ErrorOutline from '@/components/atoms/Icons/ErrorOutline';
import Label from '@/components/atoms/Label';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import useTouchOutside from '@/helpers/hooks/useTouchOutside';
import { cn } from '@/utils/cn';

import Select from '../Select';

const DatePicker = ({
  disabled = false,
  helperText = '',
  isError = false,
  label = 'Label',
  required = false,
  value = null,
  onChange = () => {},
  maxDate = null, // format YYYY-MM-DD
  minDate = null, // format YYYY-MM-DD
  containerClassName = '',
  id = null,
  format = 'DD/MM/YYYY',
  disabledYear = null,
  differenceYear = 0,
  isUpdateDepend = false,
  position = null,
  dropdownPosition = null,
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDMY, setSelectedDMY] = useState('');
  const [tempSelectedYear, setTempSelectedYear] = useState(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [calendarPosition, setCalendarPosition] = useState('');
  const [maxDateDMY, setMaxDateDMY] = useState(null);
  const [minDateDMY, setMinDateDMY] = useState(null);

  const datePickerRef = useRef(null);
  const isInitialized = useRef(false);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startYear = 2000;
  const endYear = new Date().getFullYear() + 4 - differenceYear;

  useEffect(() => {
    initializeMonthsAndYears();
  }, [maxDateDMY, selectedYear, disabledYear]);

  useEffect(() => {
    if ((isUpdateDepend && value) || !isInitialized.current) {
      initializeDateFromValue(value);
      isInitialized.current = true;
    }
  }, [value, maxDate, minDate]);

  useEffect(() => {
    displayDates();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (showCalendar) {
      checkCalendarPosition();
    }
  }, [showCalendar]);

  useEffect(() => {
    if (disabledYear?.length > 0 && !value) {
      const currentMonth = moment().month() + 1;
      const currentYear = moment().year();
      const isCurrentYearDisabled = disabledYear?.find((item) => item === currentYear);

      const selected = isCurrentYearDisabled ? years?.filter((item) => !item?.disabled)?.at(0)?.value : currentYear;

      setSelectedMonth(currentMonth);
      setSelectedYear(tempSelectedYear || selected);
    }
  }, [disabledYear, years]);

  const checkCalendarPosition = () => {
    if (datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const calendarHeight = 300; // Approximate height of the calendar
      setCalendarPosition(spaceBelow < calendarHeight ? 'top' : 'bottom');
    }
  };

  const initializeMonthsAndYears = () => {
    const monthNames = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'long' }));

    setMonths(
      monthNames.map((month, index) => {
        const disabled =
          (maxDateDMY && index + 1 > moment(maxDateDMY).month() + 1 && selectedYear >= moment(maxDateDMY).year()) ||
          (minDateDMY && index + 1 < moment(minDateDMY).month() + 1 && selectedYear <= moment(minDateDMY).year());

        return {
          label: month,
          value: index + 1,
          disabled,
        };
      })
    );

    const yearRange = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);

    setYears(
      yearRange.map((year) => {
        const disabled =
          (maxDateDMY && year > moment(maxDateDMY).year()) ||
          (minDateDMY && year < moment(minDateDMY).year()) ||
          disabledYear?.includes(year)
            ? true
            : false;

        return { label: year.toString(), value: year, disabled };
      })
    );
  };

  const initializeDateFromValue = (date) => {
    if (maxDate) {
      const momentDate = moment(maxDate);
      const day = momentDate.date();
      const month = momentDate.month() + 1;
      const year = momentDate.year();
      setSelectedDate(day);
      setSelectedMonth(month);
      setSelectedYear(year);

      setMaxDateDMY(formatDate(day, month, year));
    }

    if (minDate) {
      const momentMinDate = moment(minDate);
      setMinDateDMY(formatDate(momentMinDate.date(), momentMinDate.month() + 1, momentMinDate.year()));
    }

    let inzMoment = moment();
    selectedYear && inzMoment.year(selectedYear);
    const momentDate = date ? moment(date, 'YYYY-MM-DD') : inzMoment;
    const day = momentDate.date();
    const month = momentDate.month() + 1;
    const year = momentDate.year();
    setSelectedDate(day);
    setSelectedMonth(month);

    setSelectedYear(year);
    date ? setSelectedDMY(formatDate(day, month, year)) : setSelectedDMY('');
  };

  const formatDate = (day, month, year) => {
    return moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
  };

  const displayDates = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    // Ensure firstDayOfMonth is within valid range (0-6)
    const validFirstDay = firstDayOfMonth >= 0 && firstDayOfMonth <= 6 ? firstDayOfMonth : 0;

    const dateArray = Array(validFirstDay)
      .fill('')
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    setDates(dateArray);
  };

  useTouchOutside(datePickerRef, () => setShowCalendar(false));

  const handleSelectDate = (day) => {
    const formattedDate = formatDate(day, selectedMonth, selectedYear);

    setSelectedDate(day);
    setSelectedDMY(formattedDate);
    setShowCalendar(false);
    onChange(formattedDate);
  };

  const handleShowHideCalendar = () => {
    if (!disabled) {
      setShowCalendar(!showCalendar);
    }
  };

  const handleMonthChange = (e) => {
    let value = e?.target?.value;
    let date = value == selectedMonth ? null : 1;

    setSelectedDate(date);
    setSelectedDMY('');
    onChange('');
    setSelectedMonth(value);
  };

  const handleYearChange = (e) => {
    let value = e?.target?.value;
    let date = value == selectedYear ? null : 1;

    setSelectedDate(date);
    setSelectedDMY('');
    onChange('');
    setSelectedYear(value);
    setTempSelectedYear(value);
  };

  const isDisabledDate = (date) => {
    const currentDate = moment(formatDate(date, selectedMonth, selectedYear));

    if (minDateDMY && currentDate.isBefore(minDateDMY)) {
      return true;
    }

    if (maxDateDMY && currentDate.isAfter(maxDateDMY)) {
      return true;
    }

    return false;
  };

  const renderCalendar = () => {
    return (
      <div
        className={cn(
          'absolute z-50 w-[268px] rounded-md bg-white p-2 shadow-md',
          !id
            ? {
                'top-full mt-1': (position || calendarPosition) === 'bottom',
                'bottom-full mb-1': (position || calendarPosition) === 'top',
              }
            : {
                'bottom-[31%]': (position || calendarPosition) === 'top',
              }
        )}
      >
        <div className='flex gap-x-1'>
          <Select
            options={months}
            value={selectedMonth}
            placeholder='Month'
            onChange={handleMonthChange}
            block={false}
            containerClassName='w-[180px]'
            isCustomScrollBar={true}
            position={dropdownPosition}
          />

          <Select
            options={years}
            value={selectedYear}
            placeholder='Year'
            onChange={handleYearChange}
            block={false}
            containerClassName='w-[140px]'
            isCustomScrollBar={true}
            position={dropdownPosition}
          />
        </div>
        <div className='mt-2 grid grid-cols-7'>
          {renderDayLabels()}
          {renderDateCells()}
        </div>
      </div>
    );
  };

  const renderDayLabels = () =>
    days.map((day, index) => (
      <Paragraph
        key={day}
        level={4}
        className={cn('mb-1 px-1 py-2 font-normal leading-[18px]', {
          'text-error5': [0, 6].includes(index),
          'text-neutral10': ![0, 6].includes(index),
        })}
      >
        {day}
      </Paragraph>
    ));

  const renderDateCells = () =>
    dates.map((date, index) => {
      const isDisabled = isDisabledDate(date);

      return (
        <div
          key={index}
          onClick={isDisabled ? () => {} : () => date && typeof date === 'number' && handleSelectDate(date)}
          data-testid='date-cells-picker'
        >
          {date && (
            <Paragraph
              level={3}
              className={cn('w-7 rounded-lg px-1 py-2 text-center font-bold leading-5', {
                'text-error5': (index + 1) % 7 === 0 || (index + 1) % 7 === 1,
                'text-neutral10': (index + 1) % 7 !== 0 && (index + 1) % 7 !== 1,
                'bg-blue6 text-white': selectedDate === date,
                'text-gray-200': isDisabled,
                'hover:bg-blue6 cursor-pointer hover:text-white': !isDisabled,
              })}
            >
              {date}
            </Paragraph>
          )}
        </div>
      );
    });

  return (
    <div className={cn('w-full min-w-[200px]', !id && 'relative', containerClassName)} id={id}>
      {label && (
        <Label isRequired={required} className='mb-1'>
          {label}
        </Label>
      )}
      <div ref={datePickerRef}>
        <div
          className={cn('flex h-[52px] items-center justify-between rounded-md border px-3 py-[15px]', {
            'cursor-pointer': !disabled,
            'hover:border-error5': !disabled && isError,
            'hover:border-blue6': !disabled && !isError,
            'border-error5': isError,
            'border-neutral6 bg-neutral4 text-neutral7 cursor-not-allowed': disabled,
            'border-neutral8': selectedDMY && !disabled && !isError,
            'border-neutral5': !selectedDMY && !disabled && !isError,
          })}
          onClick={handleShowHideCalendar}
          data-testid={props?.['data-testid']}
        >
          <Paragraph
            level={2}
            className={cn({
              'text-neutral7': disabled,
              'text-neutral9': selectedDMY && !disabled,
              'text-neutral5': !selectedDMY && !disabled,
            })}
          >
            {(selectedDMY && moment(selectedDMY, 'YYYY-MM-DD').format(format)) || format}
          </Paragraph>
          <div className='flex items-center gap-x-2'>
            {isError && <ErrorOutline />}
            <CalenderToday color={disabled ? '#8C8C8C' : '#454545'} />
          </div>
        </div>
        {showCalendar && calendarPosition && renderCalendar()}
      </div>
      {helperText && (
        <Paragraph level={4} className={cn('mt-1 font-normal text-[#6E6F72]', isError && 'text-error5')}>
          {helperText}
        </Paragraph>
      )}
    </div>
  );
};

DatePicker.propTypes = {
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  isError: PropTypes.bool,
  label: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onChange: PropTypes.func,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  id: PropTypes.string,
  containerClassName: PropTypes.string,
  format: PropTypes.string,
  isUpdateDepend: PropTypes.string,
  position: PropTypes.string,
  dropdownPosition: PropTypes.string,
};

export default DatePicker;
