import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import StudentDetail from ".";

describe("StudentDetail", () => {
  test("Should be rendered", () => {
    const data = [
      {
        label: "data 1",
        value: "data 1",
      },
    ];
    const { getByTestId } = render(
      <StudentDetail data={data} className="p-0" />,
    );

    expect(getByTestId("student-detail")).toBeInTheDocument();
  });
});

describe("StudentDetail snapshot", () => {
  test("All props and code is stable", () => {
    const data = [
      {
        label: "data 1",
        value: "data 1",
      },
      {
        label: "data 2",
        value: "data 2",
      },
    ];
    const { asFragment } = render(
      <StudentDetail data={data} className="p-0" />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
