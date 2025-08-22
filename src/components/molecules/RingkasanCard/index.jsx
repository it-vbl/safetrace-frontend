import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import { DownloadIcon } from 'lucide-react';

const RingkasanCard = ({
  labelText,
  title,
  pekebunCount,
  kebunCount,
  haCount,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="bg-white p-4 shadow-sm flex flex-col justify-between w-full max-w-md border border-gray-300 rounded-[4px]">
      <div>
        {labelText && (
          <div className="bg-gray-300 text-gray-700 text-xs rounded px-2 py-1 inline-block mb-2">
            {labelText}
          </div>
        )}
        <div className=" grid grid-cols-2 gap-2 text-green-700 font-bold text-lg mt-2">
          <div className="text-[20px]">
            {pekebunCount} <span className="text-gray-700 font-normal text-[14px]">Pekebun</span>
          </div>
          <div className="text-[20px]">
            {kebunCount} <span className="text-gray-700 font-normal text-[14px]">Kebun</span>
          </div>
          <div className="text-[20px]">
            {haCount} <span className="text-gray-700 font-normal text-[14px]">ha</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button
          variant="tertiary"
          size="medium"
          isFullWidth
          onClick={onButtonClick}
          className="border-green-700 text-green-700 hover:bg-green-50"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

RingkasanCard.propTypes = {
  labelText: PropTypes.string,
  title: PropTypes.string.isRequired,
  pekebunCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  kebunCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  haCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
};

RingkasanCard.defaultProps = {
  labelText: '',
  onButtonClick: () => {},
};

export default RingkasanCard;
