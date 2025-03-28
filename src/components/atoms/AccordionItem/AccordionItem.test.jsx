import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";

import AccordionItem from ".";

describe("Accordion", () => {
  test("Should be rendered", () => {
    const { getByTestId } = render(
      <AccordionItem
        title="This is a title"
        description="<p>This is a description</p>"
      />,
    );

    expect(getByTestId("accordion-item")).toBeInTheDocument();
  });
  test("Minus icon should be rendered if accordion is open", () => {
    const { getByTestId } = render(
      <AccordionItem
        title="This is a title"
        description="<p>This is a description</p>"
      />,
    );

    fireEvent.click(getByTestId("accordion-item-icon"));
    expect(getByTestId("minus-icon")).toBeInTheDocument();
  });
  test("The title should be rendered correctly", () => {
    const { getByTestId } = render(
      <AccordionItem
        title="This is a title"
        description="<p>This is a description</p>"
      />,
    );

    expect(getByTestId("accordion-item-title")).toHaveTextContent(
      "This is a title",
    );
  });
  test("The description should be rendered", () => {
    const { getByTestId } = render(
      <AccordionItem
        title="This is a title"
        description="<p>This is a description</p>"
      />,
    );

    fireEvent.click(getByTestId("accordion-item-icon"));
    expect(getByTestId("accordion-item-description")).toBeInTheDocument();
  });
});

describe("AccordionItem snapshot", () => {
  test("Closed AccordionItem", () => {
    const { asFragment } = render(
      <AccordionItem
        title="This is a title"
        description="<p>This is a description</p>"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
  test("Opened AccordionItem", () => {
    const { asFragment, getByTestId } = render(
      <AccordionItem
        title="This is a title"
        description="<p>This is a description</p>"
      />,
    );

    fireEvent.click(getByTestId("accordion-item-icon"));
    expect(asFragment()).toMatchSnapshot();
  });
});
