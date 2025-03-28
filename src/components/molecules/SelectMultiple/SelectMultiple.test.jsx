import { render, fireEvent, screen } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";
import SelectMultiple from "./";

const defaultProps = {
  label: "Test Label",
  placeholder: "Select options",
  options: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
  ],
  value: [],
  onChange: jest.fn(),
};

describe("SelectMultiple Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      render(<SelectMultiple {...defaultProps} />);
      expect(screen.getByText("Test Label")).toBeInTheDocument();
      expect(screen.getByText("Select options")).toBeInTheDocument();
    });

    it("renders options when clicked", () => {
      render(<SelectMultiple {...defaultProps} />);
      fireEvent.click(screen.getByText("Select options"));
      defaultProps.options.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it("displays selected options on select field", () => {
      render(
        <SelectMultiple {...defaultProps} value={["option-1", "option-2"]} />,
      );
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("displays helper text when provided", () => {
      const helperText = "This is a helper text";
      render(<SelectMultiple {...defaultProps} helperText={helperText} />);
      expect(screen.getByText(helperText)).toBeInTheDocument();
    });

    it("displays error state correctly", () => {
      render(
        <SelectMultiple {...defaultProps} isError helperText="Error message" />,
      );
      expect(screen.getByText("Error message")).toHaveClass("text-error5");
    });

    it("disables the select when disabled prop is true", () => {
      render(<SelectMultiple {...defaultProps} disabled />);
      const selectContainer = screen
        .getByText("Select options")
        .closest("div[aria-disabled='true']");
      expect(selectContainer).toHaveClass("cursor-not-allowed");
    });
  });

  describe("Interactions", () => {
    it("triggers onChange when user selects an option", () => {
      render(<SelectMultiple {...defaultProps} />);
      fireEvent.click(screen.getByText("Select options"));
      fireEvent.click(screen.getByText("Option 1"));
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { name: undefined, value: ["option-1"] },
      });
    });

    it("handles deselection of options", () => {
      render(
        <SelectMultiple {...defaultProps} value={["option-1", "option-2"]} />,
      );
      fireEvent.click(screen.getAllByRole("button")[0]); // Click the close button of the first option
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { name: undefined, value: ["option-2"] },
      });
    });
  });
});

describe("SelectMultiple Snapshots", () => {
  it("matches snapshot for default state", () => {
    const { asFragment } = render(<SelectMultiple {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for selected state", () => {
    const { asFragment } = render(
      <SelectMultiple {...defaultProps} value={["option-1", "option-2"]} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for error state", () => {
    const { asFragment } = render(
      <SelectMultiple {...defaultProps} isError helperText="Error message" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for disabled state", () => {
    const { asFragment } = render(
      <SelectMultiple {...defaultProps} disabled />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for no options state", () => {
    const { asFragment } = render(
      <SelectMultiple {...defaultProps} options={[]} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for helper text state", () => {
    const { asFragment } = render(
      <SelectMultiple {...defaultProps} helperText="Helper text" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
