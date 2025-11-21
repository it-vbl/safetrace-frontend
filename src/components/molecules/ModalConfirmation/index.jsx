import { useState } from 'react';

import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';

const ModalConfirmation = ({
  open,
  setOpen,
  title = 'KONFIRMASI',
  message,
  confirmText = 'Ya, Konfirmasi',
  cancelText = 'Batalkan',
  onConfirm,
  isLoading = false,
  variant = 'danger',
}) => {
  const handleOnClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = async () => {
    try {
      setLoading(true);
      if (onConfirm) {
        await onConfirm();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onclose={handleOnClose}
      className="!w-[400px]"
      label={title}
    >
      <div className="gap-6 py-2">
        <span className="text-[14px] font-normal normal-case">{message}</span>
      </div>
      <div className="mt-4 flex flex-row justify-end gap-2">
        <Button
          isLoading={loading}
          onClick={() => setOpen(false)}
          className="bg-red-500"
          variant={variant}
        >
          {cancelText}
        </Button>
        <Button isLoading={loading || isLoading} onClick={handleOnSubmit}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalConfirmation;
