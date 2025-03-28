import React from 'react';

import Close from '@/components/atoms/Icons/Close';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import { cn } from '@/utils/cn';

const Alert = ({ children, visible, onClose = () => {}, className, textClassName, variant = 'error', ...props }) => {
  return (
    <div
      className={cn(
        'w-full items-center gap-3 rounded p-1',
        'flex transition-all duration-300 ease-in-out',
        {
          'bg-error1 text-error5': variant === 'error',
          'bg-green1 text-green8': variant === 'success',
        },
        className,
        visible ? 'max-h-[60px] opacity-100' : 'my-0 max-h-0 overflow-hidden p-0 opacity-0'
      )}
      {...props}
    >
      <Close size={24} color='currentColor' className='cursor-pointer' onClick={onClose} data-testid='close-button' />
      <Paragraph level={4} className={cn(textClassName)}>
        {children}
      </Paragraph>
    </div>
  );
};

export default Alert;
