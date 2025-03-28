import { render } from "@testing-library/react";

import Toast from ".";

import "@testing-library/jest-dom";

describe("Toast component", () => {
  test("Toast should be rendered", () => {
    const setToastMock = jest.fn();
    const { queryByText } = render(
      <Toast
        show={true}
        toastId="toast-1"
        message="Toast Success!"
        type="success"
        setToast={setToastMock}
      />,
    );

    expect(queryByText("Toast Success!")).toBeInTheDocument();
    expect(setToastMock).toHaveBeenCalledTimes(1);
  });

  test("Toast shouldn't be rendered", () => {
    const setToastMock = jest.fn();
    const { queryByText } = render(
      <Toast
        show={false}
        toastId="toast-2"
        message="Toast Error!"
        type="error"
        setToast={setToastMock}
      />,
    );

    expect(queryByText("Toast Error!")).not.toBeInTheDocument();
    expect(setToastMock).not.toHaveBeenCalled();
  });
});

describe("Toast snapshot", () => {
  test("Render success toast", () => {
    const setToastMock = jest.fn();
    const { asFragment } = render(
      <Toast
        show={true}
        toastId="toast-1"
        message="Toast Success!"
        type="success"
        setToast={setToastMock}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
  test("Render error toast", () => {
    const setToastMock = jest.fn();
    const { asFragment } = render(
      <Toast
        show={true}
        toastId="toast-2"
        message="Toast Error!"
        type="error"
        setToast={setToastMock}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
