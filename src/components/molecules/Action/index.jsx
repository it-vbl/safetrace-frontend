import PropTypes from 'prop-types';
import { cloneElement } from 'react';

import { cn } from '@/utils/cn';

import Label from '../../atoms/Label';

const Action = ({ icon: Icon, label = '', onClick, className, disabled, ...props }) => {
  const disabledClassName = {
    field: disabled ? 'bg-neutral4 text-neutral7 hover:!bg-neutral4 hover:!text-neutral7 cursor-default' : '',
    label: disabled ? 'text-neutral-7 hover:!text-neutral7' : 'group-hover:text-blue7',
  };

  return (
    <div
      onClick={() => {
        !disabled && onClick();
      }}
      className={cn(
        'hover- text-blue10 hover:bg-blue1 hover:text-blue7 group flex cursor-pointer items-center space-x-2 rounded-md px-4 py-2',
        className,
        disabledClassName.field
      )}
      {...props}
    >
      {Icon && cloneElement(Icon, { color: 'currentColor', size: 16 })}
      <Label className={cn('text-blue10 font-medium', disabledClassName.label)}>{label}</Label>
    </div>
  );
};

Action.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Action;
