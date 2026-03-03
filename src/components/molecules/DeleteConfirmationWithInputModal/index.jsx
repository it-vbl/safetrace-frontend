import React, { useState, useEffect } from 'react';

import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Typography/Heading';
import BaseModal from '@/components/molecules/Modal';
import InputText from '@/components/molecules/InputText';

const DeleteConfirmationWithInputModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'HAPUS DATA',
  message,
  itemName,
  expectedInput,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batalkan',
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const formattedExpectedInput =
    typeof expectedInput === 'string'
      ? expectedInput.replace(/\s+/g, ' ')
      : expectedInput;

  // Reset input value when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (inputValue === formattedExpectedInput) {
      onConfirm();
    }
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
      <form onSubmit={handleConfirm}>
        <Heading
          level={4}
          className="text-lg font-semibold text-gray-800 sm:text-xl md:text-2xl"
        >
          {title}
        </Heading>
        <p className="my-4 text-gray-700">{displayMessage}</p>

        <div className="mb-4">
          <InputText
            label={`Ketik "${formattedExpectedInput}" untuk konfirmasi`}
            name="confirm_delete"
            placeholder={formattedExpectedInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.replace(/\s+/g, ' '))}
            disabled={isLoading}
            isRequired
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="danger"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            isDisabled={
              isLoading || !inputValue || inputValue !== formattedExpectedInput
            }
          >
            {isLoading ? 'Menghapus...' : confirmText}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default DeleteConfirmationWithInputModal;
