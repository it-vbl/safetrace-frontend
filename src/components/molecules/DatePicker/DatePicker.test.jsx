import React from "react";

import { fireEvent,render, screen } from "@testing-library/react";

import DatePicker from ".";

import "@testing-library/jest-dom";

describe("DatePicker Component", () => {
  test("renders without crashing", () => {
    render(<DatePicker />);
    expect(screen.getByText(/Label/i)).toBeInTheDocument();
    expect(screen.getByText(/DD\/MM\/YYYY/i)).toBeInTheDocument();
  });

  test("display the current selected date correctly", () => {
    const date = new Date(2024, 9, 15);
    render(<DatePicker value={date} />);

    const formattedDate = "15/10/2024";
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  test("open the calendar when clicked", () => {
    render(<DatePicker />);

    const input = screen.getByText(/DD\/MM\/YYYY/i);
    fireEvent.click(input);

    expect(screen.getByText(/Sun/i)).toBeInTheDocument();
  });

  test("select a date and close the calendar", () => {
    render(<DatePicker />);

    const input = screen.getByText(/DD\/MM\/YYYY/i);
    fireEvent.click(input);

    const dateToSelect = screen.getByText("1");
    fireEvent.click(dateToSelect);

    expect(input).toHaveTextContent(/01/);
    expect(screen.queryByText(/Sun/i)).not.toBeInTheDocument();
  });

  test("show helper text when provided", () => {
    const helperText = "This is a helper text";
    render(<DatePicker helperText={helperText} />);

    expect(screen.getByText(helperText)).toBeInTheDocument();
  });
});

describe("DatePicker snapshot", () => {
  test("matches the snapshot with default props", () => {
    const { asFragment } = render(<DatePicker />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches the snapshot when disabled", () => {
    const { asFragment } = render(<DatePicker disabled={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches the snapshot with error state", () => {
    const { asFragment } = render(<DatePicker isError={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches the snapshot with helper text", () => {
    const { asFragment } = render(<DatePicker helperText="Unit Testing" />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches the snapshot with custom label", () => {
    const { asFragment } = render(<DatePicker label="Unit Testing" />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches the snapshot when required", () => {
    const { asFragment } = render(<DatePicker required={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches the snapshot have a value", () => {
    const { asFragment } = render(<DatePicker value={new Date(2024, 8, 1)} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
