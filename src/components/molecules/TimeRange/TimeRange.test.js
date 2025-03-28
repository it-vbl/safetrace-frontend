import { fireEvent,render } from "@testing-library/react";

import TimeRange from ".";

describe("TimeRange Component", () => {
  const mockOnChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render with the given value prop", () => {
    const { getByPlaceholderText } = render(
      <TimeRange value="12:30" onChange={mockOnChange} />,
    );

    const input = getByPlaceholderText("00:00");
    expect(input).toHaveValue("12:30");
  });

  it("should call onChange prop when a time option is clicked", () => {
    const { getByText, getByPlaceholderText } = render(
      <TimeRange value="" onChange={mockOnChange} />,
    );

    const input = getByPlaceholderText("00:00");
    fireEvent.click(input);

    const timeOption = getByText("12:30");
    fireEvent.click(timeOption);

    expect(mockOnChange).toHaveBeenCalledWith("12:30");
  });

  it("should toggle the dropdown on input click", () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <TimeRange value="" onChange={mockOnChange} />,
    );

    const input = getByPlaceholderText("00:00");
    fireEvent.click(input);

    expect(getByText("00:30")).toBeInTheDocument();

    fireEvent.click(input);
    expect(queryByText("00:30")).not.toBeInTheDocument();
  });

  it("should handle conditional rendering of the dropdown", () => {
    const { getByPlaceholderText, getByTestId, asFragment } = render(
      <TimeRange value="" onChange={mockOnChange} />,
    );

    const input = getByPlaceholderText("00:00");
    expect(asFragment()).toMatchSnapshot();

    fireEvent.click(input);
    expect(getByTestId("dropdown")).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should close the dropdown when clicking outside if isCloseWhenClickOutside is true", () => {
    const { getByPlaceholderText, getByText, queryByText, container } = render(
      <TimeRange
        value=""
        onChange={mockOnChange}
        isCloseWhenClickOutside={true}
      />,
    );

    const input = getByPlaceholderText("00:00");
    fireEvent.click(input);

    expect(getByText("00:30")).toBeInTheDocument();

    fireEvent.mouseDown(container);
    expect(queryByText("00:30")).not.toBeInTheDocument();
  });

  it("should not close the dropdown when clicking outside if isCloseWhenClickOutside is false", () => {
    const { getByPlaceholderText, getByText, container } = render(
      <TimeRange
        value=""
        onChange={mockOnChange}
        isCloseWhenClickOutside={false}
      />,
    );

    const input = getByPlaceholderText("00:00");
    fireEvent.click(input);

    expect(getByText("00:30")).toBeInTheDocument();

    fireEvent.mouseDown(container);
    expect(getByText("00:30")).toBeInTheDocument();
  });
});
