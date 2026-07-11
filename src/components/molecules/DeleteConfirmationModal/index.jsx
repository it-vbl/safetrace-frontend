import React from 'react';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BaseModal from '@/components/molecules/Modal';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'HAPUS DATA',
  message,
  itemName,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batalkan',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onClose();
  };

  const displayMessage = message || (
    <>
      Apakah Anda ingin menghapus data <strong>{itemName}</strong>?
    </>
  );

  return (
    <BaseModal
      open={isOpen}
      setOpen={onClose}
      isShowLabel={false}
      isShowCloseIcon={false}
      className="max-w-md"
    >
      <Heading
        level={4}
        className="text-lg font-semibold text-neutral-800 sm:text-xl md:text-2xl"
      >
        {title}
      </Heading>
      <p className="my-4 text-neutral-700">{displayMessage}</p>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="danger"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button type="submit" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? 'Menghapus...' : confirmText}
        </Button>
      </div>
    </BaseModal>
  );
};

export default DeleteConfirmationModal;
