import { Close } from '@/assets/icons';
import Button from '@/components/atoms/Button';

const BaseModal = ({
  open = false,
  setOpen = () => {},
  label = '-',
  children,
  handleOnNoClick = () => {},
  handleOnYesClick = () => {},
  className = '',
  isReject = false,
  isLoading = false,
  showBottomButton = true,
  leftButtonLabel = 'NO',
  rightButtonLabel = 'YES',
  closeOnOuterWrapper = true,
  onclose = () => {},
}) => {
  const handleOnWrapperClick = (e) => {
    if (e.target === e.currentTarget && closeOnOuterWrapper) {
      setOpen(false);
    }
  };
  const handleCloseModal = () => {
    setOpen(false);
    onclose();
  };

  if (!open) {
    return;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50'
      onClick={handleOnWrapperClick}
    >
      <div
        className={`max-h-[90vh] w-full max-w-[552px] overflow-auto rounded-lg border border-[#D3D2D2] bg-white p-6 ${className}`}
      >
        <div className='flex items-center justify-between bg-[#FFFEFE]'>
          <p className='text-[14px] font-bold font-bold leading-6 tracking-[1px] text-neutral10'>{label}</p>
          <div className='cursor-pointer' onClick={handleCloseModal}>
            <Close />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
