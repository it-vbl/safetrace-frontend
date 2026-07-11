import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Upload from '.';

import '@testing-library/jest-dom';

describe('Upload Component', () => {
  const defaultProps = {
    onChangeValue: jest.fn(),
    label: 'Upload File',
    isRequired: false,
    maxSize: 10,
    allowedFiles: [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with default props', () => {
    render(<Upload {...defaultProps} />);
    expect(screen.getByTestId('upload')).toBeInTheDocument();
    expect(screen.getByTestId('upload-container')).toBeInTheDocument();
    expect(screen.getByTestId('upload-file-name')).toHaveTextContent('Format File: Excel,JPEG,PNG,JPG,PDF');
    expect(screen.getByTestId('upload-file-size')).toHaveTextContent('Maksimal ukuran 10MB');
  });

  it('should call onChangeValue when a valid file is selected', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    render(<Upload {...defaultProps} />);

    const uploadAction = screen.getByTestId('upload-action');
    const input = uploadAction.querySelector('input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(defaultProps.onChangeValue).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test.jpg',
          size: '0.0',
          uploadDate: expect.any(String),
          value: file,
        })
      );
    });
  });

  it('should display an error message when an invalid file type is selected', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    render(<Upload {...defaultProps} />);

    const uploadAction = screen.getByTestId('upload-action');
    const input = uploadAction.querySelector('input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('File gagal ditambahkan, format tidak sesuai')).toBeInTheDocument();
    });
  });

  it('should render the component with error state', () => {
    render(<Upload {...defaultProps} error />);
    expect(screen.getByTestId('upload-container')).toHaveClass('border-tertiary');
  });

  it('should render the component with a custom label', () => {
    const customLabel = 'Custom Upload Label';
    render(<Upload {...defaultProps} label={customLabel} />);
    expect(screen.getByText(customLabel)).toBeInTheDocument();
  });

  it('should render the component as required', () => {
    render(<Upload {...defaultProps} isRequired />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display "Lihat" button when a file is uploaded', async () => {
    const file = { name: 'test.jpg', size: 1, uploadDate: '1 January 2024' };
    render(<Upload {...defaultProps} file={file} />);
    expect(screen.getByTestId('lihat-button')).toBeInTheDocument();
  });

  it('should call handleOnSeeClick when "Lihat" button is clicked', async () => {
    global.URL.createObjectURL = jest.fn(() => 'blob:test');
    global.URL.revokeObjectURL = jest.fn();
    window.open = jest.fn();

    const file = {
      name: 'test.jpg',
      size: 1,
      uploadDate: '1 January 2024',
      value: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
    };
    render(<Upload {...defaultProps} file={file} />);

    fireEvent.click(screen.getByTestId('lihat-button'));

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  it('should update the file when a new one is selected', async () => {
    const initialFile = {
      name: 'initial.jpg',
      size: 1,
      uploadDate: '1 January 2024',
    };
    const { rerender } = render(<Upload {...defaultProps} file={initialFile} />);
    expect(screen.getByTestId('upload-file-name')).toHaveTextContent('initial.jpg');

    const newFile = { name: 'new.jpg', size: 2, uploadDate: '2 January 2024' };
    rerender(<Upload {...defaultProps} file={newFile} />);
    expect(screen.getByTestId('upload-file-name')).toHaveTextContent('new.jpg');
  });

  it('should render "Change File" option when a file is uploaded', async () => {
    const file = { name: 'test.jpg', size: 1, uploadDate: '1 January 2024' };
    render(<Upload {...defaultProps} file={file} />);
    expect(screen.getByText('Ubah File')).toBeInTheDocument();
  });

  it('should handle multiple allowed file types correctly', () => {
    const customAllowedFiles = ['image/jpeg', 'application/pdf'];
    render(<Upload {...defaultProps} allowedFiles={customAllowedFiles} />);
    expect(screen.getByTestId('upload-file-name')).toHaveTextContent('Format File: JPEG,PDF');
  });

  it('should display correct max file size', () => {
    const customMaxSize = 5;
    render(<Upload {...defaultProps} maxSize={customMaxSize} />);
    expect(screen.getByTestId('upload-file-size')).toHaveTextContent(`Maksimal ukuran ${customMaxSize}MB`);
  });

  it('should not call onChangeValue when an invalid file is selected', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    render(<Upload {...defaultProps} />);

    const uploadAction = screen.getByTestId('upload-action');
    const input = uploadAction.querySelector('input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(defaultProps.onChangeValue).not.toHaveBeenCalled();
    });
  });

  describe('Upload Component Snapshots', () => {
    it('matches snapshot with default props', () => {
      const { asFragment } = render(<Upload {...defaultProps} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with error state', () => {
      const { asFragment } = render(<Upload {...defaultProps} error />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot when required', () => {
      const { asFragment } = render(<Upload {...defaultProps} isRequired />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with a file uploaded', () => {
      const file = { name: 'test.jpg', size: 1, uploadDate: '1 January 2024' };
      const { asFragment } = render(<Upload {...defaultProps} file={file} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with custom allowed files', () => {
      const customAllowedFiles = ['image/jpeg', 'application/pdf'];
      const { asFragment } = render(<Upload {...defaultProps} allowedFiles={customAllowedFiles} />);
      expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with custom max size', () => {
      const { asFragment } = render(<Upload {...defaultProps} maxSize={5} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
