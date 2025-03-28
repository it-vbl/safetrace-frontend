import { fireEvent,render, screen } from "@testing-library/react";

import RemoveRedEye from "../../atoms/Icons/RemoveRedEye";

import Action from "./";

import "@testing-library/jest-dom";

describe("Action Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe("Snapshots", () => {
    it("renders correctly with default props", () => {
      const { asFragment } = render(
        <Action
          icon={<RemoveRedEye />}
          label="Test Label"
          onClick={mockOnClick}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it("renders with custom className", () => {
      const { asFragment } = render(
        <Action
          icon={<RemoveRedEye />}
          label="Test Label"
          onClick={mockOnClick}
          className="custom-class"
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Functionality", () => {
    it("calls onClick when clicked", () => {
      render(
        <Action
          icon={<RemoveRedEye />}
          label="Click Test"
          onClick={mockOnClick}
        />,
      );
      const clickableDiv = screen.getByText("Click Test").closest("div");
      fireEvent.click(clickableDiv);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("renders with the provided label", () => {
      render(
        <Action
          icon={<RemoveRedEye />}
          label="Test Label"
          onClick={mockOnClick}
        />,
      );
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("renders with the icon", () => {
      render(
        <Action
          icon={<RemoveRedEye />}
          label="Test Label"
          onClick={mockOnClick}
        />,
      );
      const iconElement = document.querySelector("svg");
      expect(iconElement).toBeInTheDocument();
    });

    it("applies custom className when provided", () => {
      render(
        <Action
          icon={<RemoveRedEye />}
          label="Test Label"
          onClick={mockOnClick}
          className="custom-class"
          data-testid="action"
        />,
      );
      const actionElement = screen.getByTestId("action");
      expect(actionElement).toHaveClass("custom-class");
    });
  });
});
