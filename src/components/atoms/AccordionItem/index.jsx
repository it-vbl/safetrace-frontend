/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Minus from '../../atoms/Icons/Minus';
import Plus from '../../atoms/Icons/Plus';
import Paragraph from '../../atoms/Typography/Paragraph';
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const AccordionItem = ({ title = '', description = <></>, className = '' }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOnClick = () => setIsOpened(!isOpened);

  return (
    <div className={`flex flex-col gap-6 border-b px-2 py-4 ${className}`} data-testid='accordion-item'>
      <div className='flex cursor-pointer items-center justify-between' onClick={handleOnClick}>
        <Paragraph level={3} className='font-medium leading-[18px] text-[#414347]' data-testid='accordion-item-title'>
          {title}
        </Paragraph>
        <div className='cursor-pointer ' onClick={handleOnClick} data-testid='accordion-item-icon'>
          {isOpened ? <ChevronDownIcon width={16} /> : <ChevronUpIcon width={16} />}
        </div>
      </div>
      {isOpened && <div data-testid='accordion-item-description'>{description}</div>}
    </div>
  );
};

AccordionItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.node]),
};

export default AccordionItem;
