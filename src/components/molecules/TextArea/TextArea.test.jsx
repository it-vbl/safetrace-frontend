import { render, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import TextArea from ".";

describe("TextArea Unit Tests", () => {
  const mockOnChange = jest.fn();

  it("renders with default props", () => {
    const { getByPlaceholderText } = render(
      <TextArea placeholder="Enter text here" onChange={mockOnChange} />,
    );

    const textarea = getByPlaceholderText("Enter text here");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("");
  });

  it("displays the correct value when provided", () => {
    const { getByDisplayValue } = render(
      <TextArea value="Initial text" onChange={mockOnChange} />,
    );

    const textarea = getByDisplayValue("Initial text");
    expect(textarea).toBeInTheDocument();
  });

  it("calls onChange when text is entered", () => {
    const { getByPlaceholderText } = render(
      <TextArea placeholder="Enter text here" onChange={mockOnChange} />,
    );

    const textarea = getByPlaceholderText("Enter text here");
    fireEvent.change(textarea, { target: { value: "New text" } });

    expect(mockOnChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("New text");
  });

  it("does not update value when emoji is entered", () => {
    const { getByPlaceholderText } = render(
      <TextArea placeholder="Enter text here" onChange={mockOnChange} />,
    );

    const textarea = getByPlaceholderText("Enter text here");
    fireEvent.change(textarea, { target: { value: "😊" } });

    expect(textarea).toHaveValue("");
  });

  it("disables input when disabled prop is true", () => {
    const { getByPlaceholderText } = render(
      <TextArea
        placeholder="Disabled input"
        onChange={mockOnChange}
        disabled
      />,
    );

    const textarea = getByPlaceholderText("Disabled input");
    expect(textarea).toBeDisabled();
  });

  it("does not exceed maxChar limit when typing", () => {
    const mockOnChange = jest.fn((value) => value);
    const { getByPlaceholderText } = render(
      <TextArea
        placeholder="Enter text here"
        maxChar={10}
        onChange={mockOnChange}
      />,
    );

    const textarea = getByPlaceholderText("Enter text here");

    fireEvent.change(textarea, {
      target: { value: "This is more than 10 chars" },
    });

    expect(textarea.value).toBe("This is mo");
    expect(textarea.value.length).toBeLessThanOrEqual(10);
  });

  it("renders error state when hasError is true", () => {
    const { getByPlaceholderText, container } = render(
      <TextArea
        placeholder="Enter text here"
        hasError
        onChange={mockOnChange}
      />,
    );

    const textarea = getByPlaceholderText("Enter text here");
    const errorIcon = container.querySelector("svg");

    expect(textarea).toHaveClass("!border-error5");
    expect(errorIcon).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    const helperText = "This is helper text";
    const { getByText } = render(
      <TextArea helperText={helperText} onChange={mockOnChange} />,
    );

    const helper = getByText(helperText);
    expect(helper).toBeInTheDocument();
  });

  it("updates the checked state when checkbox is toggled", () => {
    const { getByRole } = render(
      <TextArea
        label="Sample TextArea"
        isChecked={false}
        isCheckable={true}
        onChange={mockOnChange}
      />,
    );

    const checkbox = getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });
});

describe("TextArea Snapshot Tests", () => {
  const mockOnChange = jest.fn();

  it("matches snapshot with default props", () => {
    const { asFragment } = render(
      <TextArea placeholder="Enter text here" onChange={mockOnChange} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with error state", () => {
    const { asFragment } = render(
      <TextArea hasError onChange={mockOnChange} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with disabled state", () => {
    const { asFragment } = render(
      <TextArea disabled onChange={mockOnChange} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with checked state for checkbox", () => {
    const { asFragment, getByRole } = render(
      <TextArea isChecked={true} isCheckable={true} onChange={mockOnChange} />,
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeChecked();
    expect(asFragment()).toMatchSnapshot();
  });
});
