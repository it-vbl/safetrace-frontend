import React from 'react';
import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

import Checkbox from '../Checkbox';
import Check from '../Icons/Check';
import Paragraph from '../Typography/Paragraph';

const Cascader = ({
  children,
  isSelected = false,
  className,
  textClassName,
  disabled = false,
  onClick = () => {},
  icon,
  checkbox = false,
  variant = 'parent',
  ...props
}) => {
  const selectedClassName = isSelected ? `text-primary` : '';
  return (
    <div
      className={cn(
        'flex w-full flex-row items-center gap-[10px] px-3 py-2',
        {
          'text-neutral-300': disabled,
          'text-neutral-900 hover:bg-primary/10': !disabled,
          'pl-[30px]': variant === 'child',
        },
        className
      )}
      onClick={disabled || checkbox ? () => {} : onClick}
      data-testid='cascader-container'
      {...props}
    >
      {icon && <div className='mr-2'>{React.cloneElement(icon, { size: 16, color: 'currentColor' })}</div>}
      {checkbox && (
        <Checkbox value={isSelected} onChange={disabled ? () => {} : onClick} disabled={disabled} className='mr-2' />
      )}
      <Paragraph className={cn('w-full', selectedClassName, textClassName)} level={3} data-testid='paragraph'>
        {children}
      </Paragraph>
      {isSelected && !checkbox && (
        <div>
          <Check data-testid='check-icon' />
        </div>
      )}
    </div>
  );
};

Cascader.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  checkbox: PropTypes.bool,
  variant: PropTypes.oneOf(['parent', 'child']),
};

export default Cascader;
