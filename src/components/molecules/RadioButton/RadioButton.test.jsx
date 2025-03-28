import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";
import RadioButton from "./";

describe("RadioButton Component", () => {
  const defaultProps = {
    options: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
    ],
    name: "test-radio",
    onChange: jest.fn(),
    onChangeValue: jest.fn(),
  };

  it("should render radio buttons with provided options", () => {
    render(<RadioButton {...defaultProps} />);
    defaultProps.options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  it("should call onChange and onChangeValue when a radio button is selected", () => {
    render(<RadioButton {...defaultProps} />);
    const radioButton = screen.getByLabelText("Option 1");
    fireEvent.click(radioButton);
    expect(defaultProps.onChange).toHaveBeenCalled();
    expect(defaultProps.onChangeValue).toHaveBeenCalledWith("option1");
  });

  it("should render with a label when provided", () => {
    const label = "Test Label";
    render(<RadioButton {...defaultProps} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("should indicate when it is required", () => {
    render(<RadioButton {...defaultProps} label="Test Label" isRequired />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should display helper text when provided", () => {
    const helperText = "This is helper text";
    render(<RadioButton {...defaultProps} helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it("should apply error styles when isError is true", () => {
    render(<RadioButton {...defaultProps} isError />);
    const radioButtons = screen.getAllByRole("radio");
    radioButtons.forEach((radio) => {
      expect(radio).toHaveClass("!border-error5");
    });
  });

  it("should set the checked state based on the value prop", () => {
    render(<RadioButton {...defaultProps} value="option2" />);
    expect(screen.getByLabelText("Option 2")).toBeChecked();
    expect(screen.getByLabelText("Option 1")).not.toBeChecked();
  });

  it("should handle empty options gracefully", () => {
    render(<RadioButton {...defaultProps} options={[]} />);
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  // Snapshot tests
  it("should match snapshot with default props", () => {
    const { asFragment } = render(<RadioButton {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should match snapshot with label and required", () => {
    const { asFragment } = render(
      <RadioButton {...defaultProps} label="Test Label" isRequired />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should match snapshot with error state", () => {
    const { asFragment } = render(
      <RadioButton {...defaultProps} isError helperText="Error message" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should match snapshot with selected value", () => {
    const { asFragment } = render(
      <RadioButton {...defaultProps} value="option2" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
