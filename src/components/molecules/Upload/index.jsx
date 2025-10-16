import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import Button from '@/components/atoms/Button';
import Document from '@/components/atoms/Icons/Document';
import Label from '@/components/atoms/Label';
import Paragraph from '@/components/atoms/Typography/Paragraph';
import UploadAction from '@/components/atoms/UploadAction';

import Toast from '../Toast';

const Upload = ({
  error = false,
  file = null,
  onChangeValue = (e) => {},
  label = '',
  isRequired = false,
  allowedFiles = ['image/jpeg', 'image/png', 'image/jpg'],
  maxSize = 10,
  url = null,
  isToastShowed = true,
  disabled = false,
  name: nameField = '',
  keyField = '',
}) => {
  const [errorState, setErrorState] = useState('');
  const [valueFile, setValueFile] = useState(file);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const validateFile = (file) => {
    if (file.name.includes('.shp')) {
      return;
    }
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
      'application/geo+json',
      'application/x-esri-shapefile',
      'text/csv',
      'application/vnd.ms-excel',
      'text/plain',
      '.shp',
      '.geojson',
      '.csv',
    ];

    const selectedFileType = validTypes.filter((item) =>
      allowedFiles?.some((subString) => item?.includes(subString))
    );
    const _maxSize = maxSize * 1024 * 1024; // MB
    const isCSVFile = file.name.toLowerCase().endsWith('.csv') || 
                      file.type === 'text/csv' || 
                      file.type === 'application/vnd.ms-excel' ||
                      file.type === 'text/plain';
    
    const isCSVAllowed = allowedFiles?.some(allowed => 
      allowed.includes('csv') || allowed.includes('text/csv') || allowed.includes('application/vnd.ms-excel')
    );

    if (isCSVAllowed && isCSVFile) {
      if (file.size > _maxSize) {
        return `Batas maksimal file yang dapat diunggah yaitu ${maxSize}mb`;
      }
      return '';
    }

    if (!selectedFileType?.includes(file?.type)) {
      return 'File gagal ditambahkan, format tidak sesuai';
    }

    if (file.size > _maxSize) {
      return `Batas maksimal file yang dapat diunggah yaitu ${maxSize}mb`;
    }

    return '';
  };
  const handleOnFileChange = (e) => {
    const value = e.target.files?.[0];
    const name = value?.name;
    const size = value?.size ?? 0; 
    const today = new Date(Date.now());
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const uploadDate = `${month}/${day}/${year}`;

    const errorMessage = validateFile(value);

    if (errorMessage) {
      setErrorState(errorMessage);
      return;
    }

    setValueFile(value);
    setErrorState('');
    onChangeValue({ name, size, uploadDate, value });
    setShowSuccessToast(true);
  };

  useEffect(() => {
    // Update state lokal jika prop file berubah dari parent
    if (file && file !== valueFile) {
      setValueFile(file);
    }
    // Reset ke null jika tidak ada file
    if (!file && valueFile) {
      setValueFile(null);
    }
  }, [file, valueFile]);

  const handleOnSeeClick = () => {
    if (url) {
      window.open(url, '_blank');
      return;
    }

    // Gunakan valueFile (state lokal) daripada file prop
    const type = valueFile.type;
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileData = e.target?.result;
      if (
        [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ].includes(type)
      ) {
        const link = document.createElement('a');
        link.href = fileData;
        link.download = valueFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const fileUrl = URL.createObjectURL(valueFile);
        window.open(fileUrl, '_blank');
        URL.revokeObjectURL(fileUrl);
      }
    };
    reader.readAsDataURL(valueFile);
  };

  const formatting = useMemo(() => {
    const excelFiles = allowedFiles?.filter(
      (file) => file.includes('excel') || file.includes('spreadsheetml')
    );
    const otherFiles = allowedFiles?.filter(
      (file) => !file.includes('excel') && !file.includes('spreadsheetml')
    );

    if (excelFiles.length > 1) {
      const format = [
        'Excel',
        ...otherFiles.map((file) => file.split('/')?.[1]?.toUpperCase()),
      ];

      return format;
    } else {
      const format = [
        ...otherFiles.map((file) => file.split('/')?.[1]?.toUpperCase()),
      ];

      return format;
    }
  }, []);

  return (
    <div className="flex flex-col gap-1" data-testid="upload">
      {label && <Label isRequired={isRequired}>{label}</Label>}
      <div
        className={`flex items-center justify-between rounded-md border-2 px-6 py-[21px] ${
          error ? 'border-error5' : 'border-[#b7b7b7]'
        } gap-x-2 border-dashed ${disabled ? 'bg-gray-200' : ''}`}
        data-testid="upload-container"
      >
        <div className="flex flex-col">
          {valueFile && <Document />}
          <div className="flex flex-col gap-y-[2px]">
            <div className="flex gap-x-2 break-all">
              <Paragraph
                level={3}
                data-testid="upload-file-name"
                className="leading-4"
              >
                {valueFile ? valueFile.name : `Format File: ${formatting}`}
              </Paragraph>
              {valueFile && (
                <UploadAction
                  onChange={handleOnFileChange}
                  className="text-secondary10 min-w-max cursor-pointer text-[12px] leading-[14px] underline"
                  id={`upload-file-${keyField}`}
                  label="Ubah File"
                  allowedFiles={allowedFiles}
                  name={nameField}
                  keyField={keyField}
                />
              )}
            </div>
            <Paragraph
              level={4}
              className="leading-[10px] opacity-40"
              data-testid="upload-file-size"
            >
              {valueFile
                ? `Ukuran ${((valueFile.size || 0) / 1048576).toFixed(
                    1
                  )} MB • Diunggah ${moment(
                    file?.uploadDate || new Date()
                  ).format('DD/MM/YYYY')}`
                : `Maksimal ukuran ${maxSize}MB`}
            </Paragraph>
          </div>
        </div>
        {valueFile ? (
          <Button
            className="!bg-blue5 hover:!bg-opacity-50"
            size="extraSmall"
            onClick={handleOnSeeClick}
            data-testid="lihat-button"
          >
            Lihat
          </Button>
        ) : (
          <UploadAction
            disabled={disabled}
            onChange={handleOnFileChange}
            className={`h-auto cursor-pointer rounded-md border border-primary px-4 py-[7px] text-[12px] font-bold leading-[14px] text-primary ${
              !disabled
                ? 'hover:bg-primaryLight1'
                : '!border-gray-400 text-gray-400'
            } md:h-7`}
            id={`upload-file-${keyField}`}
            label="Unggah File"
            allowedFiles={allowedFiles}
            name={nameField}
            keyField={keyField}
          />
        )}
      </div>
      {errorState && <p className="mt-2 text-sm text-red-500">{errorState}</p>}

      {isToastShowed && (
        <Toast
          show={showSuccessToast}
          toastId={`upload-file-component-${label?.trim('')}`}
          message="Gambar Berhasil Ditambahkan!"
          type="success"
          setToast={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
};

Upload.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.object,
  onChangeValue: PropTypes.func,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  maxSize: PropTypes.number,
  url: PropTypes.string,
  isToastShowed: PropTypes.bool,
};

export default Upload;
