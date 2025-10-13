import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@/components/atoms/Button';
import InputText from '@/components/molecules/InputText';
import BaseModal from '@/components/molecules/Modal';

const EditWasteDataModal = ({
  isOpen,
  onClose,
  onSave,
  tahun,
  wasteData = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen && wasteData.length > 0) {
      const initialData = {};
      wasteData.forEach((waste) => {
        // Extract numeric value from "X Kg" format
        const numericValue = waste.quantity.replace(' Kg', '');
        initialData[waste.type] = numericValue;
      });
      setFormData(initialData);
    }
  }, [isOpen, wasteData]);

  const handleInputChange = (wasteType, value) => {
    setFormData((prev) => ({
      ...prev,
      [wasteType]: value,
    }));
  };

  const handleSave = () => {
    const formattedData = wasteData.map((waste) => ({
      type: waste.type,
      quantity: `${formData[waste.type] || '0'} Kg`,
    }));
    onSave(tahun, formattedData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <BaseModal
      open={isOpen}
      setOpen={onClose}
      label={`UBAH DATA ${tahun}`}
      className="max-w-[600px] max-w-lg"
      isShowCloseIcon={false}
    >
      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          {wasteData.map((waste, index) => (
            <InputText
              key={`waste-${waste.type}-${index}`}
              label={waste.type}
              type="number"
              value={formData[waste.type] || ''}
              onChange={(e) => handleInputChange(waste.type, e.target.value)}
              placeholder="0"
              suffix="Kg"
              minNumber={0}
              name={`waste-${waste.type}`}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="danger"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Batalkan
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

EditWasteDataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  tahun: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  wasteData: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      quantity: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
};

export default EditWasteDataModal;
