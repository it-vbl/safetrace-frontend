import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./Checkbox.module.css";

const Checkbox = ({ value = false, onChange, disabled = false, size = 18 }) => {
  const [isChecked, setIsChecked] = useState(value);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  const handleOnChange = (e) => {
    setIsChecked(e.target.checked);
    onChange(e);
  };

  return (
    <div className="flex items-center">
      <div
        className={`container ${
          disabled
            ? "cursor-not-allowed border-gray-300 bg-gray-200"
            : "cursor-pointer"
        } flex items-center`}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleOnChange}
          disabled={disabled}
          style={{
            width: size,
            height: size,
          }}
          data-testd="checkbox"
        />
        <span className="checkmark" />
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.number,
};

export default Checkbox;
