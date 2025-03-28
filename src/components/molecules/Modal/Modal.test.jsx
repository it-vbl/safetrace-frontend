import { fireEvent,render, screen } from "@testing-library/react";

import Modal from ".";

const title = "Test Title";
const subtitle = "Test Subtitle";

describe("Modal Component", () => {
  const onClose = jest.fn();

  const setup = (props = {}) => {
    return render(
      <Modal
        visible={true}
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        {...props}
      >
        <p>Modal Content</p>
      </Modal>,
    );
  };

  test("renders modal when visible is true", () => {
    setup();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(subtitle)).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("does not render modal when visible is false", () => {
    render(
      <Modal visible={false} onClose={onClose} title={title}>
        <p>Modal Content</p>
      </Modal>,
    );
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  test("call onClose when close button is clicked", () => {
    setup();
    fireEvent.click(screen.getByTestId("button-close-modal"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("call onClose when clicking outside the modal", () => {
    setup();
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
    onClose.mockClear();
  });

  test("does not call onClose when clicking inside the modal", () => {
    setup();
    fireEvent.mouseDown(screen.getByText("Modal Content"));
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("Modal Component Snapshot", () => {
  const onClose = jest.fn();

  test("matches snapshot when visible", () => {
    const { asFragment } = render(
      <Modal visible={true} title={title} subtitle={subtitle} onClose={onClose}>
        <p>Modal Content</p>
      </Modal>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("matches snapshot when not visible", () => {
    const { asFragment } = render(
      <Modal
        visible={false}
        title={title}
        subtitle={subtitle}
        onClose={onClose}
      >
        <p>Modal Content</p>
      </Modal>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
