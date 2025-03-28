import { fireEvent,render } from "@testing-library/react";

import SearchBar from ".";

describe("SearchBar", () => {
  const mockOnChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with placeholder", () => {
    const { getByPlaceholderText } = render(
      <SearchBar placeholder="Search here..." />,
    );
    const input = getByPlaceholderText("Search here...");
    expect(input).toBeInTheDocument();
  });

  it("displays the value prop correctly", () => {
    const { getByDisplayValue } = render(<SearchBar value="Test Value" />);
    const input = getByDisplayValue("Test Value");
    expect(input).toBeInTheDocument();
  });

  it("triggers onChange when user types", () => {
    const { getByTestId } = render(
      <SearchBar onChange={mockOnChange} validationRegex={/^[a-zA-Z ]+$/} />,
    );
    const input = getByTestId("input-search");

    fireEvent.change(input, { target: { value: "New Search" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("triggers onClear when close icon is clicked", () => {
    const { getByTestId, queryByTestId } = render(
      <SearchBar value="Test" onClear={mockOnChange} />,
    );

    const closeIcon = getByTestId("icon-close");
    expect(closeIcon).toBeInTheDocument();

    fireEvent.click(closeIcon);
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    expect(queryByTestId("input-search").value).toBe("");
  });

  it("triggers onSearch when search icon is clicked", () => {
    const { getByTestId } = render(<SearchBar onSearch={mockOnChange} />);

    const searchIcon = getByTestId("icon-search");
    fireEvent.click(searchIcon);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("displays the correct icon based on input value", () => {
    const { queryByTestId, rerender } = render(
      <SearchBar value="" onSearch={mockOnChange} />,
    );

    expect(queryByTestId("icon-search")).toBeInTheDocument();
    expect(queryByTestId("icon-close")).toBeNull();

    rerender(<SearchBar value="Test" onClear={mockOnChange} />);
    expect(queryByTestId("icon-close")).toBeInTheDocument();
    expect(queryByTestId("icon-search")).toBeNull();
  });
});
