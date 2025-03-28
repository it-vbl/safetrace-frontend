import { render, screen, fireEvent } from "@testing-library/react";

import Select from ".";

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
];

describe("Select Component", () => {
  it("renders correctly", () => {
    render(
      <Select
        options={options}
        label="Test Label"
        placeholder="Select an option"
      />,
    );
    expect(screen.getByTestId("label-container")).toHaveTextContent(
      "Test Label",
    );
    expect(screen.getByTestId("selected-value")).toHaveTextContent(
      "Select an option",
    );
  });

  it("opens dropdown on field click", () => {
    render(<Select options={options} />);
    fireEvent.click(screen.getByTestId("select-field"));
    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  it("does not open dropdown when disabled", () => {
    render(<Select options={options} disabled />);
    fireEvent.click(screen.getByTestId("select-field"));
    expect(screen.queryByTestId("dropdown-menu")).toBeNull();
  });

  it("triggers onChange when an option is selected", () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);
    fireEvent.click(screen.getByTestId("select-field"));
    fireEvent.click(screen.getByTestId("option-1"));
    expect(handleChange).toHaveBeenCalledWith({
      target: { name: undefined, value: "1" },
    });
  });

  it("renders all options", () => {
    render(<Select options={options} />);
    fireEvent.click(screen.getByTestId("select-field"));
    expect(screen.getByTestId("option-1")).toBeInTheDocument();
    expect(screen.getByTestId("option-2")).toBeInTheDocument();
  });

  it("renders helper text when present", () => {
    render(<Select helperText="This is a helper text" />);
    expect(screen.getByTestId("helper-text")).toHaveTextContent(
      "This is a helper text",
    );
  });

  it("renders snapshot for different states", () => {
    const { asFragment } = render(<Select options={options} />);
    expect(asFragment()).toMatchSnapshot();

    render(<Select options={options} disabled />);
    expect(asFragment()).toMatchSnapshot();

    render(<Select options={options} isError />);
    expect(asFragment()).toMatchSnapshot();

    render(<Select options={[]} />);
    expect(asFragment()).toMatchSnapshot();

    render(<Select options={options} value="1" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
