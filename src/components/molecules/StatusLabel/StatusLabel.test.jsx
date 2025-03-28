import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import StatusLabel from "./";

describe("StatusLabel component", () => {
  test("renders correctly with status success", () => {
    const { container } = render(
      <StatusLabel status="success" text="Operation successful" />,
    );

    expect(screen.getByText("Operation successful")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-green1");
    expect(screen.getByText("Operation successful")).toHaveClass("text-green8");
  });

  test("renders correctly with status pending", () => {
    const { container } = render(
      <StatusLabel status="pending" text="Operation pending" />,
    );

    expect(screen.getByText("Operation pending")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-warning1");
    expect(screen.getByText("Operation pending")).toHaveClass("text-warning8");
  });

  test("renders correctly with status failed", () => {
    const { container } = render(
      <StatusLabel status="failed" text="Operation failed" />,
    );

    expect(screen.getByText("Operation failed")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-error1");
    expect(screen.getByText("Operation failed")).toHaveClass("text-error7");
  });
});

describe("StatusLabel Snapshot", () => {
  test("matches snapshot with success status", () => {
    const { asFragment } = render(
      <StatusLabel status="success" text="Unit testing" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches snapshot with success failed", () => {
    const { asFragment } = render(
      <StatusLabel status="success" text="Unit testing" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches snapshot with success pending", () => {
    const { asFragment } = render(
      <StatusLabel status="success" text="Unit testing" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
