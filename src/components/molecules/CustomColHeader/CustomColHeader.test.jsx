import { Provider, useDispatch } from "react-redux";

import { store } from "@/store";
import { setSelectedSort } from "@/store/data/actions";
import { fireEvent, render, screen } from "@testing-library/react";

import CustomColHeader from ".";

import "@testing-library/jest-dom";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("CustomColHeader Component", () => {
  const mockDispatch = jest.fn();
  const mockOnSortChanged = jest.fn();
  const mockColumn = {
    colId: "testCol",
    colDef: {
      headerName: "Test Header",
      sortable: true,
      headerClassName: "test-header-class",
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(
      <Provider store={store}>
        <CustomColHeader
          column={mockColumn}
          onSortChanged={mockOnSortChanged}
        />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders with default sort icon and header text", () => {
    render(
      <Provider store={store}>
        <CustomColHeader
          column={mockColumn}
          onSortChanged={mockOnSortChanged}
        />
      </Provider>,
    );

    expect(screen.getByTestId("header-container")).toBeInTheDocument();
    expect(screen.getByTestId("header-text")).toHaveTextContent("Test Header");
    expect(screen.getByTestId("sort-icon-default")).toBeInTheDocument();
  });

  test("changes sort icon and triggers onSortChanged on click", () => {
    render(
      <Provider store={store}>
        <CustomColHeader column={mockColumn} enableSorting={true} />
      </Provider>,
    );

    const headerContainer = screen.getByTestId("header-container");
    fireEvent.click(headerContainer);

    expect(mockDispatch).toHaveBeenCalledWith(
      setSelectedSort({
        data: {
          field: "testCol",
          direction: "asc",
        },
      }),
    );
  });

  test("adds and removes event listener on mount and unmount", () => {
    const { unmount } = render(
      <Provider store={store}>
        <CustomColHeader
          column={mockColumn}
          onSortChanged={mockOnSortChanged}
        />
      </Provider>,
    );

    expect(mockColumn.addEventListener).toHaveBeenCalledWith(
      "sortChanged",
      expect.any(Function),
    );

    unmount();

    expect(mockColumn.removeEventListener).toHaveBeenCalledWith(
      "sortChanged",
      expect.any(Function),
    );
  });
});
