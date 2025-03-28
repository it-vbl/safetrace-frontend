import { fireEvent, render, screen } from "@testing-library/react";

import Cascader from "./";

import "@testing-library/jest-dom";

describe("Cascader", () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    children: "Test Cascader",
    isSelected: false,
    disabled: false,
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children text correctly", () => {
    render(<Cascader {...defaultProps} />);
    expect(screen.getByTestId("paragraph")).toHaveTextContent("Test Cascader");
  });

  it("should render Check icon when isSelected is true", () => {
    render(<Cascader {...defaultProps} isSelected={true} />);
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("should not render Check icon when isSelected is false", () => {
    render(<Cascader {...defaultProps} isSelected={false} />);
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  it("should trigger onClick when component is clicked and not disabled", () => {
    render(<Cascader {...defaultProps} />);
    fireEvent.click(screen.getByTestId("paragraph"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should not trigger onClick when component is disabled", () => {
    render(<Cascader {...defaultProps} disabled={true} />);
    fireEvent.click(screen.getByTestId("paragraph"));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("should apply correct CSS classes when disabled", () => {
    render(<Cascader {...defaultProps} disabled={true} />);
    expect(screen.getByTestId("cascader-container")).toHaveClass(
      "text-gray-300",
    );
  });

  it("should apply correct CSS classes when not disabled", () => {
    render(<Cascader {...defaultProps} />);
    expect(screen.getByTestId("cascader-container")).toHaveClass(
      "text-neutral10",
    );
    expect(screen.getByTestId("cascader-container")).toHaveClass(
      "hover:bg-blue1",
    );
  });

  it("should render icon when provided", () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    render(<Cascader {...defaultProps} icon={<TestIcon />} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("should render checkbox when checkbox prop is true", () => {
    render(<Cascader {...defaultProps} checkbox={true} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should apply correct CSS classes for child variant", () => {
    render(<Cascader {...defaultProps} variant="child" />);
    expect(screen.getByTestId("cascader-container")).toHaveClass("pl-[30px]");
  });

  it("should apply custom className when provided", () => {
    render(<Cascader {...defaultProps} className="custom-class" />);
    expect(screen.getByTestId("cascader-container")).toHaveClass(
      "custom-class",
    );
  });

  it("should match snapshot", () => {
    const { asFragment } = render(<Cascader {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
