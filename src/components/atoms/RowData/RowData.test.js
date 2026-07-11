import { render } from "@testing-library/react";

import RowData from ".";

import "@testing-library/jest-dom";

describe("RowData", () => {
  test("Pass label props", () => {
    const { container } = render(<RowData label="Testing" />);

    expect(container).toMatchSnapshot();
  });

  test("Pass value props", () => {
    const { container } = render(<RowData value="Testing" />);

    expect(container).toMatchSnapshot();
  });

  test("Pass className props", () => {
    const { container } = render(<RowData className="bg-tertiary" />);

    expect(container).toMatchSnapshot();
  });

  test("Pass all props", () => {
    const { container } = render(
      <RowData value="Testing" label="Testing" className="bg-tertiary" />,
    );

    expect(container).toMatchSnapshot();
  });
});
