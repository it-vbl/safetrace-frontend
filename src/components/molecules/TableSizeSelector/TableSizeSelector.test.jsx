import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import TableSizeSelector from ".";

import "@testing-library/jest-dom";

describe("TableSizeSelector", () => {
  const defaultProps = {
    options: [10, 20, 30],
    onSelectOption: jest.fn(),
  };

  it("should render correctly", () => {
    render(<TableSizeSelector {...defaultProps} />);
    expect(screen.getByTestId("table-size-selector")).toBeInTheDocument();
    expect(screen.getByText("Tampil")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should trigger onSelectOption when an option is selected", () => {
    render(<TableSizeSelector {...defaultProps} />);
    fireEvent.click(screen.getByTestId("selected-table-size-selector"));
    fireEvent.click(screen.getByText("20"));
    expect(defaultProps.onSelectOption).toHaveBeenCalledWith(20);
  });

  it("should show dropdown when field is clicked", () => {
    render(<TableSizeSelector {...defaultProps} />);
    fireEvent.click(screen.getByTestId("selected-table-size-selector"));
    expect(screen.getByText("20")).toBeVisible();
    expect(screen.getByText("30")).toBeVisible();
  });

  it("should close dropdown when clicking outside", () => {
    render(
      <div>
        <TableSizeSelector {...defaultProps} />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    fireEvent.click(screen.getByTestId("selected-table-size-selector"));
    expect(screen.getByText("20")).toBeVisible();
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("20")).not.toBeInTheDocument();
  });

  it("should update selected option when a new option is chosen", () => {
    render(<TableSizeSelector {...defaultProps} />);
    fireEvent.click(screen.getByTestId("selected-table-size-selector"));
    fireEvent.click(screen.getByText("30"));
    expect(
      screen.getByTestId("selected-table-size-selector"),
    ).toHaveTextContent("30");
  });
});

describe("TableSizeSelector Snapshots", () => {
  it("should match snapshot when dropdown position is on bottom", () => {
    const { asFragment } = render(
      <TableSizeSelector options={[10, 20, 30]} onSelectOption={() => {}} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should match snapshot when dropdown position is on top", () => {
    const { asFragment } = render(
      <TableSizeSelector
        options={[10, 20, 30]}
        onSelectOption={() => {}}
        dropdownPosition="top"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
