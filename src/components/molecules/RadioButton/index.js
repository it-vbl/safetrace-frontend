import PropTypes from "prop-types";

import Label from "@/components/atoms/Label";
import Paragraph from "@/components/atoms/Typography/Paragraph";

import styles from "./RadioButton.module.css";

const RadioButton = ({
  options = [],
  name = "",
  onChange = () => {},
  label,
  isRequired,
  helperText,
  isError,
  value,
  onChangeValue = () => {},
}) => {
  const handleOnChange = (e) => {
    onChange(e);
    onChangeValue(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-5">
        {label && <Label isRequired={isRequired}>{label}</Label>}
        <div className="radio-button-group flex items-center justify-between">
          {options.map((option) => (
            <label
              key={option.value}
              className="radio-label flex w-full items-center gap-2"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleOnChange}
                className={`${styles["radio-button"]} cursor-pointer ${isError ? "!border-error5" : "border-gray-500"}`}
              />
              <Paragraph className="cursor-pointer text-neutral9" level={2}>
                {option.label}
              </Paragraph>
            </label>
          ))}
        </div>
      </div>
      {helperText && (
        <Paragraph level={4} className="text-error5">
          {helperText}
        </Paragraph>
      )}
    </div>
  );
};

RadioButton.propTypes = {
  options: PropTypes.array,
  name: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  helperText: PropTypes.string,
  isError: PropTypes.bool,
  value: PropTypes.string,
  onChangeValue: PropTypes.func,
};

export default RadioButton;
