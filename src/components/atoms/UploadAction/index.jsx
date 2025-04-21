import PropTypes from 'prop-types';

const UploadAction = ({
  onChange = () => {},
  className = '',
  id = '',
  label = 'Upload File',
  allowedFiles = [],
  disabled = false,
  name = '',
  keyField = '',
}) => {
  return (
    <div className='flex items-center' data-testid='upload-action'>
      {!disabled && (
        <input
          name={name}
          disabled={disabled}
          type='file'
          id={`upload-${id}`}
          className='hidden'
          onChange={onChange}
          accept={allowedFiles.join(',')}
          key={keyField}
        />
      )}
      <label htmlFor={`upload-${id}`} className={className} data-testid='upload-action-label'>
        {label}
      </label>
    </div>
  );
};

UploadAction.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  allowedFiles: PropTypes.arrayOf(PropTypes.string),
};

export default UploadAction;
