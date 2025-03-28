import { render } from "@testing-library/react";

import Display from ".";

import "@testing-library/jest-dom";

describe("Display", () => {
  test("Passing Cildren", () => {
    const { container } = render(<Display>Testing</Display>);

    expect(container).toMatchSnapshot();
  });

  test("Passing className", () => {
    const { container } = render(<Display className="bg-red-400" />);

    expect(container).toMatchSnapshot();
  });

  test("Level 1", () => {
    const { container } = render(<Display level={1} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 2", () => {
    const { container } = render(<Display level={2} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 3", () => {
    const { container } = render(<Display level={3} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 4", () => {
    const { container } = render(<Display level={4} />);

    expect(container).toMatchSnapshot();
  });
});
