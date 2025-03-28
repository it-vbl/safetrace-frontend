import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import pageLimit from '@/constants/pageLimit';
import { cn } from '@/utils/cn';

import Cascader from '../../atoms/Cascader';
import ChevronDown from '../../atoms/Icons/ChevronDown';
import Paragraph from '../../atoms/Typography/Paragraph';

const TableSizeSelector = ({
  options = pageLimit,
  onSelectOption = () => {},
  dropdownPosition = 'bottom',
  value = 10,
}) => {
  const [selectedOption, setSelectedOption] = useState(options?.at(0));
  const [showList, setShowList] = useState(false);
  const modalRef = useRef(null);
  const containerRef = useRef(null);

  const dropdownClassName = {
    bottom: 'top-[52px]',
    top: 'top-0 -translate-y-full -top-2',
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && containerRef.current && !containerRef.current.contains(event.target)) {
      setShowList(false);
    }
  };

  useEffect(() => {
    if (showList) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showList]);

  useEffect(() => {
    if (value) setSelectedOption(value);
  }, [value]);

  return (
    <div
      data-testid='table-size-selector'
      ref={containerRef}
      className='border-secondary2 relative z-0 flex items-center rounded-lg border bg-white'
    >
      <Paragraph level={3} className='text-neutral10 px-3'>
        Tampil
      </Paragraph>
      <div
        data-testid='selected-table-size-selector'
        className='border-secondary2 flex h-full cursor-pointer items-center gap-x-2 border-x px-3 py-[13px]'
        onClick={() => setShowList(!showList)}
      >
        <Paragraph level={3} className='text-neutral10'>
          {selectedOption}
        </Paragraph>

        <div className={showList ? 'rotate-180' : 'rotate-0'}>
          <ChevronDown />
        </div>
      </div>
      <Paragraph level={3} className='text-neutral10 px-3'>
        Data
      </Paragraph>

      {/* Options */}
      {showList && (
        <div
          ref={modalRef}
          className={cn(
            'border-secondary2 absolute left-[51%] z-10 w-[65px] -translate-x-1/2 rounded-lg border bg-white text-center',
            dropdownClassName[dropdownPosition]
          )}
        >
          {options.map((item) => (
            <Cascader
              key={item}
              onClick={() => {
                setSelectedOption(item);
                setShowList(false);
                onSelectOption(item);
              }}
            >
              {item}
            </Cascader>
          ))}
        </div>
      )}
    </div>
  );
};

TableSizeSelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.number),
  onSelectOption: PropTypes.func,
  value: PropTypes.number,
};

export default TableSizeSelector;
