import "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import { color } from "storybook/internal/theming";

import Chatbox from ".";

describe("Chatbox", () => {
  test("Renders bell icon without notification when total is 0", () => {
    render(<Chatbox total={0} />);
    expect(screen.getByTestId("chatbox")).toBeInTheDocument();

    const notificationElement = screen.queryByText("0");
    expect(notificationElement).not.toBeInTheDocument();
  });

  test("Renders notification badge when total is greater than 0", () => {
    const totalNotification = 5;
    render(<Chatbox total={totalNotification} />);

    expect(screen.getByText(totalNotification)).toBeInTheDocument();
  });

  test("Applies default color if none is provided", () => {
    render(<Chatbox color={color} />);

    const bellIcon = screen.getByTestId("bell-icon");
    expect(bellIcon).toHaveStyle(`color: ${color}`);
  });

  describe("Chatbox snapshot", () => {
    test("Matches snapshot with default props", () => {
      const { asFragment } = render(<Chatbox />);
      expect(asFragment()).toMatchSnapshot();
    });

    test("Matches snapshot with total > 0", () => {
      const { asFragment } = render(<Chatbox total={5} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
