import React from 'react';
import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';
import theme from '@/utils/tailwindTheme';

import LoadingSpinner from '../LoadingSpinner';
import { BiLoader, BiLoaderCircle } from 'react-icons/bi';

const sizeClassName = {
  extraSmall: 'h-[28px] py-2 px-4 text-xs',
  small: 'h-[32px] py-2 px-4 text-xs',
  medium: 'h-[38px] py-2 px-6 text-sm',
  large: 'h-[52px] py-3 px-8 text-base',
};

const variantClassName = {
  primary: 'bg-primary hover:bg-primaryLight7 text-white disabled:bg-grey-200',
  secondary: 'border border-primary hover:bg-secondaryLight2 text-primary disabled:bg-gray-200',
  tertiary:
    'border-neutral6 border bg-neutral1 hover:bg-secondary2 disabled:bg-gray-200 text-neutral8 disabled:bg-neutral3',
  danger: 'border border-error6 hover:bg-error7 disabled:bg-gray-200 text-error6 disabled:bg-neutral3',
};

const iconColor = {
  primary: theme.colors.white,
  secondary: theme.colors.white,
  tertiary: theme.colors.neutral8,
};

const Button = ({
  children,
  size = 'medium',
  variant = 'primary',
  isDisabled = false,
  isLoading = false,
  textClassName = '',
  className = '',
  style = {},
  icon = React.ReactNode | null | undefined,
  isFullWidth = false,
  onClick = () => {},
  ...props
}) => {
  const baseClassName = `rounded-[4px] leading-[16px] flex whitespace-nowrap justify-center items-center gap-1 ${
    isFullWidth ? 'w-full' : ''
  }`;
  const buttonClassName = cn(
    baseClassName,
    sizeClassName[size],
    variantClassName[variant],
    (isLoading || isDisabled) && 'cursor-not-allowed !bg-gray-200',
    className
  );

  return (
    <button className={buttonClassName} disabled={isLoading || isDisabled} style={style} onClick={onClick} {...props}>
      {icon
        ? React.cloneElement(icon, {
            color: iconColor[variant],
          })
        : null}
      {children && (
        <div className={cn('flex items-center text-center', textClassName)}>
          {!isLoading ? children : <BiLoaderCircle size={24} className='animate-spin' />}
        </div>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(['extraSmall', 'small', 'medium', 'large']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'danger']),
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  textClassName: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  isFullWidth: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
