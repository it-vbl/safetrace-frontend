import { fireEvent, render, screen } from "@testing-library/react";

import Paragraph from ".";

import "@testing-library/jest-dom";

describe("Heading", () => {
  test("Passing onClick custom props", () => {
    const mockFn = jest.fn();
    render(<Paragraph onClick={mockFn} data-testid="paragraph-testid" />);

    const paragraph = screen.getByTestId("paragraph-testid");

    fireEvent.click(paragraph);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("Passing Cildren", () => {
    const { container } = render(<Paragraph>Testing</Paragraph>);

    expect(container).toMatchSnapshot();
  });

  test("Passing className", () => {
    const { container } = render(<Paragraph className="bg-red-400" />);

    expect(container).toMatchSnapshot();
  });

  test("Level 1", () => {
    const { container } = render(<Paragraph level={1} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 2", () => {
    const { container } = render(<Paragraph level={2} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 3", () => {
    const { container } = render(<Paragraph level={3} />);

    expect(container).toMatchSnapshot();
  });

  test("Level 4", () => {
    const { container } = render(<Paragraph level={4} />);

    expect(container).toMatchSnapshot();
  });
});
