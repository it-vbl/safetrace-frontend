import { cleanup, fireEvent,render, screen } from "@testing-library/react";

import Pagination from "./";

import "@testing-library/jest-dom";

afterEach(() => {
  cleanup();
});

describe("Pagination", () => {
  const mockOnPageChange = jest.fn();
  const mockOnSelectShowData = jest.fn();

  const defaultProps = {
    totalPages: 5,
    onPageChange: mockOnPageChange,
    onTableSizeChange: mockOnSelectShowData,
    options: [10, 15, 30],
  };

  test("renders the Pagination component", () => {
    render(<Pagination {...defaultProps} />);

    const componentWrapperPagination = screen.getByTestId(
      "pagination-of-table",
    );
    const componentWrapperShowData = screen.getByTestId("table-size-selector");
    const chevronsLeft = screen.getByTestId("chevrons-left");
    const chevronsRight = screen.getByTestId("chevrons-right");

    expect(componentWrapperPagination).toBeInTheDocument();
    expect(componentWrapperShowData).toBeInTheDocument();
    expect(chevronsLeft).toBeInTheDocument();
    expect(chevronsRight).toBeInTheDocument();
  });

  test("call function onPageChange when click paginate number", () => {
    render(<Pagination {...defaultProps} />);

    const pageButton = screen.getByText("2");
    fireEvent.click(pageButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test("navigate to first and last page", () => {
    render(<Pagination {...defaultProps} currentPage={2} />);

    const chevronsLeft = screen.getByTestId("chevrons-left");
    fireEvent.click(chevronsLeft);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    const chevronsRight = screen.getByTestId("chevrons-right");
    fireEvent.click(chevronsRight);

    expect(mockOnPageChange).toHaveBeenCalledWith(defaultProps.totalPages);
  });

  test("select data to show in table", () => {
    render(<Pagination {...defaultProps} />);

    const selectedComponent = screen.getByTestId(
      "selected-table-size-selector",
    );
    fireEvent.click(selectedComponent);

    const option = screen.getByText("15");
    fireEvent.click(option);

    expect(mockOnSelectShowData).toHaveBeenCalledWith(15);
  });
});

describe("Pagination snapshot", () => {
  const mockOnPageChange = jest.fn();
  const mockOnSelectShowData = jest.fn();

  const defaultProps = {
    totalPages: 5,
    onPageChange: mockOnPageChange,
    onTableSizeChange: mockOnSelectShowData,
    options: [10, 15, 30],
  };

  test("all props and code is stable", () => {
    const { asFragment } = render(<Pagination {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
