import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import Accordion from ".";

describe("Accordion", () => {
  test("Should be rendered", () => {
    const { getByTestId } = render(
      <Accordion
        items={[
          {
            title: "aaa",
            description: <p>This is a description</p>,
          },
        ]}
      />,
    );

    expect(getByTestId("accordion")).toBeInTheDocument();
  });
  test("Total accordion item should be showed correctly", () => {
    const { getAllByTestId } = render(
      <Accordion
        items={[
          {
            title: "aaa",
            description: <p>This is a description</p>,
          },
          {
            title: "bbb",
            description: <p>This is a description</p>,
          },
        ]}
      />,
    );

    expect(getAllByTestId("accordion-item").length).toBe(2);
  });
});
