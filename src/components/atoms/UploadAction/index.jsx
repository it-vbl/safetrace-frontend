import PropTypes from "prop-types";

const UploadAction = ({
  onChange = () => {},
  className = "",
  id = "",
  label = "Upload File",
  allowedFiles = [],
}) => {
  return (
    <div className="flex items-center" data-testid="upload-action">
      <input
        type="file"
        id={`upload-${id}`}
        className="hidden"
        onChange={onChange}
        accept={allowedFiles.join(",")}
      />
      <label
        htmlFor={`upload-${id}`}
        className={className}
        data-testid="upload-action-label"
      >
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
