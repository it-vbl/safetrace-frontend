import { fireEvent, render, screen } from "@testing-library/react";

import Alert from ".";

import "@testing-library/dom";

describe("Alert", () => {
  test("Calls onclose function when close icon is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <Alert visible={true} onClose={onCloseMock}>
        Close Alert
      </Alert>,
    );
    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  describe("Alert snapshot", () => {
    test("Matches snapshot with default props", () => {
      const { asFragment } = render(
        <Alert visible={true}>Snapshot default alert</Alert>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    test("Matches snapshot with success variant and custom classes", () => {
      const { asFragment } = render(
        <Alert
          visible={true}
          variant="success"
          className="custom-class"
          textClassName="custom-text"
        >
          Snapshot success alert
        </Alert>,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    test("Matches snapshot with error variant and custom classes", () => {
      const { asFragment } = render(
        <Alert
          visible={false}
          variant="error"
          className="custom-class"
          textClassName="custom-text"
        >
          Snapshot error alert
        </Alert>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
