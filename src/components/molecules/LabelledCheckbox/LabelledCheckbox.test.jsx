import { fireEvent,render, screen } from "@testing-library/react";

import LabelledCheckbox from "./";

import "@testing-library/jest-dom";

describe("LabelledCheckboxSnapshots", () => {
  const mockOnChange = jest.fn();
  it("renders correctly with default props and matches snapshot", () => {
    const { asFragment } = render(
      <LabelledCheckbox
        label="Test Label"
        onChange={mockOnChange}
        value={false}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("checkbox should be checked when value is true and matches snapshot", () => {
    const { asFragment } = render(
      <LabelledCheckbox
        label="Checked Label"
        onChange={mockOnChange}
        value={true}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("checkbox should not be checked when value is false and matches snapshot", () => {
    const { asFragment } = render(
      <LabelledCheckbox
        label="Unchecked Label"
        onChange={mockOnChange}
        value={false}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders disabled checkbox and matches snapshot", () => {
    const { asFragment } = render(
      <LabelledCheckbox
        label="Disabled Test"
        onChange={mockOnChange}
        value={false}
        disabled
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("updates the checked state when value prop changes and matches snapshot", () => {
    const { rerender, asFragment } = render(
      <LabelledCheckbox
        label="Dynamic Value Test"
        onChange={mockOnChange}
        value={false}
      />,
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <LabelledCheckbox
        label="Dynamic Value Test"
        onChange={mockOnChange}
        value={true}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("LabelledCheckboxUnitTests", () => {
  const mockOnChange = jest.fn();

  it("calls onChange when checkbox state is changed", () => {
    render(
      <LabelledCheckbox
        label="Change Test"
        onChange={mockOnChange}
        value={false}
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("renders with checked value when true", () => {
    render(
      <LabelledCheckbox
        label="Checked Test"
        onChange={mockOnChange}
        value={true}
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("renders with unchecked value when false", () => {
    render(
      <LabelledCheckbox
        label="Unchecked Test"
        onChange={mockOnChange}
        value={false}
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders a disabled checkbox when disabled prop is true", () => {
    render(
      <LabelledCheckbox
        label="Disabled Test"
        onChange={mockOnChange}
        value={false}
        disabled
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });
});
