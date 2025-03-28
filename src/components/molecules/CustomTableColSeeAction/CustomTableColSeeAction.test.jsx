import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import "@testing-library/jest-dom";
import CustomTableColSeeAction from ".";

describe("CustomTableColSeeAction", () => {
  it("should render the component correctly", () => {
    render(<CustomTableColSeeAction />);
    expect(screen.getByText("Lihat")).toBeInTheDocument();
  });

  it("should call onClick function when clicked", () => {
    const mockOnClick = jest.fn();
    render(<CustomTableColSeeAction onClick={mockOnClick} />);

    const clickableDiv = screen.getByText("Lihat").closest("div");
    fireEvent.click(clickableDiv);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should have the correct icon", () => {
    render(<CustomTableColSeeAction />);
    const icon = screen.getByTestId("remove-red-eye-icon");
    expect(icon).toBeInTheDocument();
  });

  it("should have the correct text color", () => {
    render(<CustomTableColSeeAction />);
    const text = screen.getByText("Lihat");
    expect(text).toHaveClass("text-blue9");
  });

  it("should have a cursor pointer style", () => {
    render(<CustomTableColSeeAction />);
    const clickableDiv = screen.getByText("Lihat").closest("div");
    expect(clickableDiv).toHaveClass("cursor-pointer");
  });

  it("should be centered within its container", () => {
    render(<CustomTableColSeeAction />);
    const container = screen.getByText("Lihat").closest("div").parentElement;
    expect(container).toHaveClass("flex items-center justify-center");
  });

  it("should not call onClick when not provided", () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    render(<CustomTableColSeeAction />);

    const clickableDiv = screen.getByText("Lihat").closest("div");
    fireEvent.click(clickableDiv);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("should match snapshot", () => {
    const { asFragment } = render(<CustomTableColSeeAction />);
    expect(asFragment()).toMatchSnapshot();
  });
});
