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
    if (
      file.name.includes('.shp') ||
      file.name.includes('.zip') ||
      file.name.toLowerCase().endsWith('.kml')
    ) {
      return '';
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
      '.zip',
      'application/zip',
      'application/x-zip-compressed',
    ];

    const selectedFileType = validTypes.filter((item) =>
      allowedFiles?.some((subString) => item?.includes(subString))
    );
    const _maxSize = maxSize * 1024 * 1024; // MB
    const isCSVFile =
      file.name.toLowerCase().endsWith('.csv') ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/plain';

    const isCSVAllowed = allowedFiles?.some(
      (allowed) =>
        allowed.includes('csv') ||
        allowed.includes('text/csv') ||
        allowed.includes('application/vnd.ms-excel')
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
    // Jika ada URL, buka URL tersebut
    if (url) {
      window.open(url, '_blank');
      return;
    }

    // Dapatkan file object yang sebenarnya
    let actualFile = valueFile;

    // Jika valueFile adalah object dengan property 'value', ambil file dari sana
    if (valueFile && typeof valueFile === 'object' && valueFile.value) {
      actualFile = valueFile.value;
    }

    // Jika tidak ada file, return
    if (!actualFile || !(actualFile instanceof Blob)) {
      console.error('No valid file to preview');
      return;
    }

    const type = actualFile.type;

    // Handle PDF files
    if (type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(actualFile);
      window.open(fileUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
      return;
    }

    // Handle image files
    if (type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(actualFile);
      window.open(fileUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
      return;
    }

    // Handle Excel files - trigger download
    if (
      [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ].includes(type)
    ) {
      const fileUrl = URL.createObjectURL(actualFile);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = actualFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
      return;
    }

    // Default: try to open in new window
    const fileUrl = URL.createObjectURL(actualFile);
    window.open(fileUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
  };

  const formatting = useMemo(() => {
    const excelFiles = allowedFiles?.filter(
      (file) => file.includes('excel') || file.includes('spreadsheetml')
    );
    const otherFiles = allowedFiles?.filter(
      (file) => !file.includes('excel') && !file.includes('spreadsheetml')
    );

    if (excelFiles.length > 0) {
      const format = [
        'Excel',
        ...otherFiles.map((file) => file.split('/')?.[1]?.toUpperCase()),
      ];

      return format.join(', ');
    } else {
      const format = [
        ...otherFiles.map((file) => file.split('/')?.[1]?.toUpperCase()),
      ];

      return format.join(', ');
    }
  }, [allowedFiles]);

  // Helper untuk mendapatkan nama file
  const getFileName = () => {
    if (!valueFile) return null;
    // Jika valueFile adalah object dengan property 'name'
    if (valueFile.name) return valueFile.name;
    return null;
  };

  // Helper untuk mendapatkan size file
  const getFileSize = () => {
    if (!valueFile) return 0;
    // Jika valueFile adalah Blob/File
    if (valueFile instanceof Blob) return valueFile.size;
    // Jika valueFile adalah object dengan property 'size'
    if (valueFile.size) return valueFile.size;
    // Jika valueFile memiliki property 'value' yang merupakan Blob
    if (valueFile.value instanceof Blob) return valueFile.value.size;
    return 0;
  };

  // Helper untuk mendapatkan upload date
  const getUploadDate = () => {
    if (!valueFile) return new Date();
    // Jika valueFile memiliki uploadDate
    if (valueFile.uploadDate) return valueFile.uploadDate;
    return file?.uploadDate || new Date();
  };

  return (
    <div className="flex flex-col gap-1" data-testid="upload">
      {label && <Label isRequired={isRequired}>{label}</Label>}
      <div
        className={`flex items-center justify-between rounded-md border-2 px-3 py-3 md:px-6 md:py-[21px] ${
          error ? 'border-error5' : 'border-gray-400'
        } gap-x-2 border-dashed ${disabled ? 'bg-gray-200' : ''}`}
        data-testid="upload-container"
      >
        <div className="flex flex-col overflow-hidden">
          {valueFile && <Document />}
          <div className="flex min-w-0 flex-col gap-y-[2px]">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-2">
              <Paragraph
                level={3}
                data-testid="upload-file-name"
                className="max-w-[150px] truncate leading-4 sm:max-w-none"
              >
                {valueFile ? getFileName() : `Format File: ${formatting}`}
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
              className="text-[10px] leading-[10px] opacity-40 sm:text-xs"
              data-testid="upload-file-size"
            >
              {valueFile
                ? `Ukuran ${(getFileSize() / 1048576).toFixed(
                    1
                  )} MB • Diunggah ${moment(getUploadDate()).format(
                    'DD/MM/YYYY'
                  )}`
                : `Maksimal ukuran ${maxSize}MB`}
            </Paragraph>
          </div>
        </div>
        <div className="flex-shrink-0">
          {valueFile ? (
            <Button
              className="!bg-blue5 !px-2 !py-1 text-xs hover:!bg-opacity-50 sm:text-sm"
              size="extraSmall"
              type="button"
              onClick={handleOnSeeClick}
              data-testid="lihat-button"
            >
              Lihat
            </Button>
          ) : (
            <UploadAction
              disabled={disabled}
              onChange={handleOnFileChange}
              className={`h-auto cursor-pointer rounded-md border border-primary px-2 py-1 text-[10px] font-bold leading-[14px] text-primary sm:px-4 sm:py-[7px] sm:text-[12px] ${
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
