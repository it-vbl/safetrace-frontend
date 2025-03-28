import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";

import Label from ".";

describe("Label", () => {
  test("Pass onClick custom props", () => {
    const mockFn = jest.fn();
    const testId = "paragraph-test-id";
    render(<Label onClick={mockFn} data-testid={testId} />);

    const paragraph = screen.getByTestId(testId);

    fireEvent.click(paragraph);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("Pass required props", () => {
    const { container } = render(<Label isRequired={true} />);

    expect(container).toMatchSnapshot();
  });

  test("Pass children props", () => {
    const { container } = render(<Label>Testing</Label>);

    expect(container).toMatchSnapshot();
  });

  test("Pass className props", () => {
    const { container } = render(<Label className="bg-red-400" />);

    expect(container).toMatchSnapshot();
  });
});
