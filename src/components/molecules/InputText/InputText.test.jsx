import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import InputText from "./";

import "@testing-library/jest-dom";

describe("InputText Component", () => {
  const defaultProps = {
    placeholder: "Enter text",
    onChange: jest.fn(),
    "data-testid": "input-text",
  };

  beforeEach(() => {
    defaultProps.onChange.mockClear();
  });

  it("renders correctly", () => {
    render(<InputText {...defaultProps} />);
    expect(screen.getByTestId("input-text")).toBeInTheDocument();
  });

  it("does not trigger onChange when disabled", () => {
    render(<InputText {...defaultProps} disabled />);
    const input = screen.getByTestId("input-text");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it("triggers onChange when typed", () => {
    render(<InputText {...defaultProps} />);
    const input = screen.getByTestId("input-text");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("prevents emoji input", () => {
    render(<InputText {...defaultProps} />);
    const input = screen.getByTestId("input-text");
    fireEvent.change(input, { target: { value: "😊" } });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it("enforces max character limit", () => {
    render(<InputText {...defaultProps} maxChar={5} />);
    const input = screen.getByTestId("input-text");
    fireEvent.change(input, { target: { value: "Exceeding" } });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it("enforces min and max number limits", () => {
    render(
      <InputText
        {...defaultProps}
        type="number"
        minNumber={1}
        maxNumber={10}
      />,
    );
    const input = screen.getByTestId("input-text");
    fireEvent.change(input, { target: { value: "11" } });
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "5" } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("applies custom formatter function", () => {
    const formatter = jest.fn((value) => value.toUpperCase());
    render(<InputText {...defaultProps} type="string" formatter={formatter} />);
    const input = screen.getByTestId("input-text");
    fireEvent.change(input, { target: { value: "test" } });
    expect(formatter).toHaveBeenCalledWith("test");
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it("displays label when provided", () => {
    render(<InputText {...defaultProps} label="Username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("displays helper text when provided", () => {
    render(<InputText {...defaultProps} helperText="Enter your username" />);
    expect(screen.getByText("Enter your username")).toBeInTheDocument();
  });

  it("displays error state correctly", () => {
    render(<InputText {...defaultProps} isError helperText="Error message" />);
    const helperText = screen.getByText("Error message");
    expect(helperText).toHaveClass("text-tertiary");
  });

  it("handles password type correctly", () => {
    render(<InputText {...defaultProps} type="password" />);
    const input = screen.getByTestId("input-text");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility", () => {
    render(<InputText {...defaultProps} type="password" />);
    const toggleButton = screen.getByRole("button", {
      name: /toggle password visibility/i,
    });
    fireEvent.click(toggleButton);
    const input = screen.getByTestId("input-text");
    expect(input).toHaveAttribute("type", "text");
  });

  it("displays suffix when provided", () => {
    render(<InputText {...defaultProps} suffix="USD" />);
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("applies disabled styles when disabled", () => {
    render(<InputText {...defaultProps} disabled />);
    const input = screen.getByTestId("input-text");
    expect(input).toHaveClass("cursor-not-allowed");
    expect(input).toHaveClass("bg-neutral-200");
  });
});

describe("InputText Snapshots", () => {
  const defaultProps = {
    placeholder: "Enter text",
    onChange: jest.fn(),
  };

  it("matches snapshot with error state", () => {
    const { asFragment } = render(<InputText {...defaultProps} isError />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with required field", () => {
    const { asFragment } = render(<InputText {...defaultProps} isRequired />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with suffix", () => {
    const { asFragment } = render(<InputText {...defaultProps} suffix="USD" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when disabled", () => {
    const { asFragment } = render(<InputText {...defaultProps} disabled />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with helper text", () => {
    const { asFragment } = render(
      <InputText {...defaultProps} helperText="Helper text" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
