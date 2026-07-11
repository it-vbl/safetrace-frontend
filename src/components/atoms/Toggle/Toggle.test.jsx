import { fireEvent,render } from "@testing-library/react";

import Toggle from ".";

import "@testing-library/dom";

describe("Toggle", () => {
  test("Toggel should be rendered ", () => {
    const { getByTestId } = render(<Toggle />);

    expect(getByTestId("toggle")).toBeInTheDocument();
    expect(getByTestId("toggle")).not.toBeChecked();
  });
  test("OnChange function should be called", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Toggle onChange={onChange} />);

    fireEvent.click(getByTestId("toggle"));

    expect(onChange).toBeCalledTimes(1);
  });
  test("OnChange function should be not called", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Toggle onChange={onChange} disabled />);

    fireEvent.click(getByTestId("toggle"));

    expect(onChange).toBeCalledTimes(0);
  });
  test("Text content should be matching", () => {
    const { getByTestId } = render(<Toggle value />);

    expect(getByTestId("toggle-wrapper")).toHaveTextContent("Aktif");
    expect(getByTestId("toggle-wrapper")).not.toHaveTextContent("Nonaktif");
  });
  test("ClassName should be match for label", () => {
    const { getByTestId } = render(<Toggle disabled />);

    expect(getByTestId("label")).toHaveClass("cursor-not-allowed");
  });
  test("ClassName should be match for toggle background", () => {
    const { getByTestId } = render(<Toggle disabled />);

    expect(getByTestId("toggle-background")).toHaveClass(
      "bg-neutral-100 after:border-neutral-100",
    );
  });
  test("ClassName should be match in value true and disabled false", () => {
    const { getByTestId } = render(<Toggle value={true} disabled={false} />);

    expect(getByTestId("toggle-background")).toHaveClass("bg-primary");
  });
});

describe("Toggle snapshot", () => {
  test("To render the toggle if the value is true", () => {
    const { asFragment } = render(<Toggle value={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
  test("To render the toggle if the value is false", () => {
    const { asFragment } = render(<Toggle value={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
  test("To render the toggle if the value is false and disabled", () => {
    const { asFragment } = render(<Toggle value={false} disabled={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
