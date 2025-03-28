import { render, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import Checkbox from "./";

describe("Checkbox Unit Tests", () => {
  const mockOnChange = jest.fn();

  it("checkbox should not be checked when value is false", async () => {
    const { findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} />,
    );

    const checkbox = await findByRole("checkbox");

    expect(checkbox).not.toBeChecked();
  });

  it("checkbox should be checked when value is true", async () => {
    const { findByRole } = render(
      <Checkbox value={true} onChange={mockOnChange} />,
    );

    const checkbox = await findByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  it("calls onChange when checkbox state is changed", async () => {
    const { findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} />,
    );

    const checkbox = await findByRole("checkbox");

    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalled();
    expect(checkbox).toBeChecked();
  });

  it("renders disabled checkbox", async () => {
    const { findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} disabled />,
    );

    const checkbox = await findByRole("checkbox");

    expect(checkbox).toBeDisabled();
  });

  it("updates the checked state when value prop changes", async () => {
    const { rerender, findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} />,
    );

    const checkbox = await findByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox value={true} onChange={mockOnChange} />);
    expect(checkbox).toBeChecked();
  });
});

describe("CheckboxSnapshot", () => {
  const mockOnChange = jest.fn();

  it("renders correctly with default props and matches snapshot", async () => {
    const { asFragment, findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} />,
    );

    await findByRole("checkbox");

    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when checkbox is checked", async () => {
    const { asFragment, findByRole } = render(
      <Checkbox value={true} onChange={mockOnChange} />,
    );

    await findByRole("checkbox");

    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when checkbox is not checked", async () => {
    const { asFragment, findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} />,
    );

    await findByRole("checkbox");

    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when checkbox is clicked and state changes", async () => {
    const { asFragment, findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} />,
    );

    const checkbox = await findByRole("checkbox");
    fireEvent.click(checkbox);

    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when checkbox is disabled", async () => {
    const { asFragment, findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} disabled />,
    );

    await findByRole("checkbox");

    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when value prop changes", async () => {
    const { rerender, asFragment, findByRole } = render(
      <Checkbox value={false} onChange={mockOnChange} />,
    );

    await findByRole("checkbox");

    rerender(<Checkbox value={true} onChange={mockOnChange} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
