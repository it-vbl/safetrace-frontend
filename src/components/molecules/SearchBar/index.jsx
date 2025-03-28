import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Paragraph from '@/components/atoms/Typography/Paragraph';
import useTouchOutside from '@/helpers/hooks/useTouchOutside';
import { cn } from '@/utils/cn';

import CloseIcon from '../../atoms/Icons/Close';
import SearchIcon from '../../atoms/Icons/Search';

const SearchBar = ({
  placeholder = '',
  value = '',
  onChange = () => {},
  onClear = () => {},
  onSearch = () => {},
  className = '',
  showSuffix = false,
  suffixComponent = () => {},
  searchReomendations = [],
  onClickRecomendation = () => {},
  showSearchRecomendation = false,
  handleCloseRecomendationOption = () => {},
  validationRegex = null,
  customClassNameIcon,
  disabled = false,
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const recomendationRef = useRef();

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleOnClear = () => {
    setSearchValue('');
    onClear();
  };

  const handleOnChange = (e) => {
    const inputValue = e.target.value;
    if (validationRegex?.test(inputValue) || inputValue === '') {
      setSearchValue(inputValue);
      onChange(e);
    }
  };

  useTouchOutside(recomendationRef, handleCloseRecomendationOption);

  return (
    <div
      className={cn('relative flex h-[44px] w-[300px] rounded-md border border-[#C7C8C9] py-2.5 pl-4', className, {
        'bg-neutral4 cursor-not-allowed': disabled,
      })}
    >
      <input
        data-testid='input-search'
        type='text'
        value={searchValue}
        onChange={handleOnChange}
        placeholder={placeholder}
        className='size-full focus:outline-none'
        disabled={disabled}
      />
      {searchValue ? (
        <div onClick={handleOnClear} className={cn('px-3', customClassNameIcon)}>
          <CloseIcon data-testid='icon-close' size={20} />
        </div>
      ) : (
        <div onClick={() => onSearch(searchValue)} className={cn('px-3', customClassNameIcon)}>
          <SearchIcon data-testid='icon-search' size={20} />
        </div>
      )}

      {showSuffix && (
        <>
          <div className='bg-neutral4 mr-3 h-full w-[2px]' />
          {suffixComponent()}
        </>
      )}

      {showSearchRecomendation && (
        <div
          ref={recomendationRef}
          className='absolute left-0 top-12 z-10 max-h-[200px] w-full overflow-y-auto rounded-md border-[#F2F2F2] bg-white p-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]'
        >
          {searchReomendations.length > 0 ? (
            <div>
              {searchReomendations.map((item, index) => (
                <Paragraph
                  level={3}
                  className='cursor-pointer px-3 py-2 text-left font-normal text-[#323437]'
                  key={index}
                  onClick={() => onClickRecomendation(item)}
                >
                  {item.value}
                </Paragraph>
              ))}
            </div>
          ) : (
            <Paragraph level={3} className='cursor-pointer px-3 py-2 text-center'>
              Data tidak ditemukan
            </Paragraph>
          )}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onSearch: PropTypes.func,
  className: PropTypes.string,
  customClassNameIcon: PropTypes.string,
  validationRegex: PropTypes.instanceOf(RegExp),
};

export default SearchBar;
