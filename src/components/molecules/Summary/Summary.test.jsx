import { render, screen } from "@testing-library/react";

import Summary from ".";

const mockData = [
  { label: "Label 1", value: "Value 1" },
  { label: "Label 2", value: "Value 2" },
  { label: "Label 3", value: "Value 3" },
];

describe("Summary Component", () => {
  test("renders all data items correctly", () => {
    render(<Summary data={mockData} />);

    mockData.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });

  test("applies custom lastTextColor to the last item", () => {
    const lastTextColor = "text-tertiary";
    render(<Summary data={mockData} lastTextColor={lastTextColor} />);

    const lastValue = screen.getAllByText(mockData[2].value)[0];
    expect(lastValue).toHaveClass(lastTextColor);
  });

  test("matches the snapshot", () => {
    const { asFragment } = render(<Summary data={mockData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
