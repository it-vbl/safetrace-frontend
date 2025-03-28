import { fireEvent,render, screen } from "@testing-library/react";

import Breadcrumb from ".";

import "@testing-library/jest-dom";

const crumbs = [
  { name: "Home", url: "/" },
  { name: "Category", url: "/category" },
  { name: "Item", url: "/item" },
  { name: "Detail", url: "" },
];

describe("Breadcrumb Component", () => {
  test("renders breadcrumb correctly", () => {
    render(<Breadcrumb crumbs={crumbs} />);

    const breadcrumbItems = screen.getAllByTestId("breadcrumb-item");
    expect(breadcrumbItems.length).toBe(crumbs.length);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Item")).toBeInTheDocument();
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  test("last breadcrumb item should not be clickable", () => {
    render(<Breadcrumb crumbs={crumbs} />);

    const lastBreadcrumbItem = screen.getByText("Detail");
    expect(lastBreadcrumbItem.closest("a")).toBeNull();
  });

  test("other breadcrumb items should be clickable", () => {
    render(<Breadcrumb crumbs={crumbs} />);

    const firstBreadcrumbItem = screen.getByText("Home");
    const secondBreadcrumbItem = screen.getByText("Category");
    const thirdBreadcrumbItem = screen.getByText("Item");

    expect(firstBreadcrumbItem.closest("a")).toHaveAttribute("href", "/");
    expect(secondBreadcrumbItem.closest("a")).toHaveAttribute(
      "href",
      "/category",
    );
    expect(thirdBreadcrumbItem.closest("a")).toHaveAttribute("href", "/item");
  });

  test("redirection happens when clicking breadcrumb items (verify href only)", () => {
    render(<Breadcrumb crumbs={crumbs} />);

    const homeLink = screen.getByText("Home").closest("a");
    fireEvent.click(homeLink);

    expect(homeLink).toHaveAttribute("href", "/");
  });
});

describe("Breadcrumb snapshot", () => {
  test("All props and code is stable", () => {
    const { asFragment } = render(<Breadcrumb crumbs={crumbs} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
