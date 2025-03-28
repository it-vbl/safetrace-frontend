import { render } from "@testing-library/react";

import ColData from ".";

import "@testing-library/jest-dom";

describe("ColData", () => {
  test("Render with passing label", () => {
    const { container } = render(<ColData label="Testing" />);

    expect(container).toMatchSnapshot();
  });

  test("Render with passing value", () => {
    const { container } = render(<ColData value="Testing" />);

    expect(container).toMatchSnapshot();
  });

  test("Render with passing className", () => {
    const { container } = render(<ColData className="bg-red-300" />);

    expect(container).toMatchSnapshot();
  });

  test("Render with passing all props", () => {
    const { container } = render(
      <ColData label="Testing" value="Testing" className="bg-red-300" />,
    );

    expect(container).toMatchSnapshot();
  });
});
