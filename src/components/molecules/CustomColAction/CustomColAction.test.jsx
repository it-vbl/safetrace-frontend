import { render, fireEvent, screen, cleanup } from "@testing-library/react";

import CustomColAction from ".";
import "@testing-library/jest-dom";
import Tridots from "../../atoms/Icons/Tridots";

describe("CustomColAction Component", () => {
  let portalRoot;
  const params = { data: { no: 1 } };
  const actions = [
    {
      icon: <Tridots />,
      label: "Action1",
      onClick: jest.fn(),
      disabled: false,
      className: "class1",
    },
    {
      icon: <Tridots />,
      label: "Action2",
      onClick: jest.fn(),
      disabled: true,
      className: "class2",
    },
  ];

  beforeAll(() => {
    portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "__next");
    document.body.appendChild(portalRoot);
  });

  afterAll(() => {
    document.body.removeChild(portalRoot);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(
      <CustomColAction params={params} actions={actions} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("opens the menu when Tridots icon is clicked", () => {
    render(<CustomColAction params={params} actions={actions} />);

    expect(screen.queryByTestId("table-action-1")).toBeNull();

    fireEvent.click(screen.getByTestId("tridots-icon"));

    expect(screen.getByTestId("table-action-1")).toBeInTheDocument();
  });

  test("closes the menu when clicking outside", () => {
    render(<CustomColAction params={params} actions={actions} />);

    fireEvent.click(screen.getByTestId("tridots-icon"));
    expect(screen.getByTestId("table-action-1")).toBeInTheDocument();

    fireEvent.mouseDown(document);
    expect(screen.queryByTestId("table-action-1")).toBeNull();
  });

  test("renders action items and triggers onClick when action item is clicked", () => {
    render(<CustomColAction params={params} actions={actions} />);

    fireEvent.click(screen.getByTestId("tridots-icon"));

    actions.forEach((action, index) => {
      const actionButton = screen.getByTestId(`action-${index}`);
      expect(actionButton).toBeInTheDocument();
      expect(actionButton).toHaveClass(action.className);

      if (!action.disabled) {
        fireEvent.click(actionButton);
        expect(action.onClick).toHaveBeenCalledWith(params.data);
      } else {
        expect(actionButton).toHaveClass("cursor-default");
      }
    });
  });

  test("menu toggles on Tridots icon click", () => {
    render(<CustomColAction params={params} actions={actions} />);

    const tridotsIcon = screen.getByTestId("tridots-icon");

    fireEvent.click(tridotsIcon);
    expect(screen.getByTestId("table-action-1")).toBeInTheDocument();

    fireEvent.click(tridotsIcon);
    expect(screen.queryByTestId("table-action-1")).toBeNull();
  });
});
