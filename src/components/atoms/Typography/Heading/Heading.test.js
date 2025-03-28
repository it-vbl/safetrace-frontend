import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import Heading from ".";

describe("Heading", () => {
  test("Passing Cildren", () => {
    const { container } = render(<Heading>Testing</Heading>);

    expect(container).toMatchSnapshot();
  });

  test("Passing className", () => {
    const { container } = render(<Heading className="bg-red-400" />);

    expect(container).toMatchSnapshot();
  });

  test("Level 1", () => {
    const { container } = render(<Heading level={1} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 2", () => {
    const { container } = render(<Heading level={2} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 3", () => {
    const { container } = render(<Heading level={3} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 4", () => {
    const { container } = render(<Heading level={4} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 5", () => {
    const { container } = render(<Heading level={5} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 6", () => {
    const { container } = render(<Heading level={6} />);

    expect(container).toMatchSnapshot();
  });
});
