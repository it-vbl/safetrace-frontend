import { Close } from '@/assets/icons';
import Button from '@/components/atoms/Button';

const DEFAULT_SET_OPEN = () => {};

const BaseModal = ({
  open = false,
  setOpen = DEFAULT_SET_OPEN,
  label = '-',
  children,
  handleOnNoClick = () => {},
  handleOnYesClick = () => {},
  className = '',
  labelClassName = '',
  isReject = false,
  isLoading = false,
  showBottomButton = true,
  leftButtonLabel = 'NO',
  rightButtonLabel = 'YES',
  closeOnOuterWrapper = true,
  onclose = () => {},
  isShowCloseIcon = true,
  isShowLabel = true,
}) => {
  const isClickable = closeOnOuterWrapper && setOpen !== DEFAULT_SET_OPEN;

  const handleOnWrapperClick = (e) => {
    if (e.target === e.currentTarget && isClickable) {
      setOpen(false);
    }
  };
  const handleCloseModal = () => {
    if (setOpen !== DEFAULT_SET_OPEN) {
      setOpen(false);
    }
    onclose();
  };

  if (!open) {
    return;
  }

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-neutral-800 bg-opacity-50 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={handleOnWrapperClick}
    >
      <div
        className={`max-h-[90vh] w-full max-w-[552px] overflow-auto rounded-lg border border-[#D3D2D2] bg-white p-6 cursor-default ${className}`}
      >
        <div className="flex items-center justify-between bg-[#FFFEFE]">
          {isShowLabel && (
            <p className="text-[14px] font-bold leading-6 tracking-[1px] text-neutral-900">
              {label}
            </p>
          )}

          {isShowCloseIcon && (
            <div className="cursor-pointer" onClick={handleCloseModal}>
              <Close />
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
