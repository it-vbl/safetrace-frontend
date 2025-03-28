import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Close from '@/components/atoms/Icons/Close';
import Heading from '@/components/atoms/Typography/Heading';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import useTouchOutside from '@/hooks/useTouchOutside';
import { cn } from '@/utils/cn';

const Modal = ({
  children,
  visible = false,
  onClose,
  title,
  subtitle,
  overlayClassName,
  containerClassName,
  bodyClassName,
  renderFooter = () => {},
  isCloseWhenClickOutside = true,
  titleProps = {},
  customRightHeader,
  isBottomSheet,
  dataTestId = '',
}) => {
  const modalRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);

      // Use requestAnimationFrame to ensure the transition happens
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  useTouchOutside(modalRef, () => isCloseWhenClickOutside && onClose());

  if (!isRendered) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-3 transition-opacity duration-300 ease-in-out md:px-0',
        isVisible ? 'opacity-100' : 'opacity-0',
        isBottomSheet && '!items-end p-0',
        overlayClassName
      )}
      data-testid={dataTestId}
    >
      <div
        className={cn(
          'w-auto max-w-[90vw] rounded-lg border border-neutral5 bg-white text-base shadow-md transition-all duration-300 ease-in-out md:min-w-[522px]',
          isVisible
            ? isBottomSheet
              ? 'translate-y-0 scale-100 opacity-100'
              : 'scale-100 opacity-100'
            : isBottomSheet
            ? 'translate-y-full opacity-0'
            : 'scale-95 opacity-0',
          isBottomSheet && '!min-w-full !rounded-b-none !rounded-t-lg md:!rounded-lg',
          containerClassName
        )}
        id='modal'
        ref={modalRef}
        role='dialog'
      >
        <div className='flex items-center justify-between gap-x-4 border-b border-neutral5 p-4 md:px-6'>
          <div className='break-all'>
            {title && (
              <Heading level={4} {...titleProps}>
                {title}
              </Heading>
            )}
            {subtitle && <Paragraph level={3}>{subtitle}</Paragraph>}
          </div>

          {customRightHeader || (
            <button
              className='cursor-pointer'
              onClick={onClose}
              aria-label='Close modal'
              data-testid='button-close-modal'
            >
              <Close size={24} />
            </button>
          )}
        </div>

        <div className={cn('max-h-[calc(100dvh-128px)] overflow-auto break-all p-4 md:p-6', bodyClassName)}>
          {children}
        </div>
        {renderFooter()}
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  overlayClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  renderFooter: PropTypes.node,
  isClosingWhenClickOutside: PropTypes.bool,
};

export default Modal;
