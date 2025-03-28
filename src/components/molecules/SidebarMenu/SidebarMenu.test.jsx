import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

import "@testing-library/jest-dom";

import SidebarMenu from ".";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  useRouter.mockReturnValue({
    pathname: "/",
  });
});

describe("SidebarMenu", () => {
  const defaultProps = {
    icon: <span>🏠</span>,
    label: "Home",
    active: false,
    className: "",
    url: "/home",
  };

  it("should render correctly with default props", () => {
    render(<SidebarMenu {...defaultProps} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("🏠")).toBeInTheDocument();
  });

  it("should apply active class when active prop is true", () => {
    render(<SidebarMenu {...defaultProps} active={true} />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("bg-blue1");
    expect(link).toHaveClass("text-blue10");
  });

  it("should not apply active class when active prop is false", () => {
    render(<SidebarMenu {...defaultProps} active={false} />);
    const link = screen.getByRole("link");
    expect(link).not.toHaveClass("bg-blue1");
    expect(link).not.toHaveClass("!text-blue10");
  });

  it("should apply custom className when provided", () => {
    render(<SidebarMenu {...defaultProps} className="custom-class" />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
  });

  it("should render icon with correct size and color", () => {
    render(<SidebarMenu {...defaultProps} />);
    const icon = screen.getByText("🏠");
    expect(icon).toHaveAttribute("color", "currentColor");
    expect(icon).toHaveAttribute("size", "16");
  });

  it("should render label with correct text and styles", () => {
    render(<SidebarMenu {...defaultProps} />);
    const label = screen.getByText("Home");
    expect(label).toHaveClass("text-sm");
    expect(label).toHaveClass("font-semibold");
  });

  it("should have correct href attribute", () => {
    render(<SidebarMenu {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
  });

  it("should have correct data-testid attribute", () => {
    render(<SidebarMenu {...defaultProps} />);
    expect(screen.getByTestId("sidebar-menu-home")).toBeInTheDocument();
  });

  it("should apply hover styles on mouse enter", () => {
    render(<SidebarMenu {...defaultProps} active={true} />);
    const link = screen.getByRole("link");
    fireEvent.mouseEnter(link);
    expect(link).toHaveClass("bg-blue1");
  });

  it("should maintain hover styles on mouse leave when not active", () => {
    render(<SidebarMenu {...defaultProps} active={false} />);
    const link = screen.getByRole("link");
    fireEvent.mouseEnter(link);
    fireEvent.mouseLeave(link);
    expect(link).toHaveClass("hover:!bg-blue0");
  });

  // Snapshot test
  it("should match snapshot", () => {
    const { asFragment } = render(<SidebarMenu {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
