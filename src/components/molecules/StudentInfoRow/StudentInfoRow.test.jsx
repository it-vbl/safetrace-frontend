import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import StudentDetailCard from ".";

jest.mock("../../atoms/RowData", () => {
  const MockRowData = ({ label, value }) => (
    <div data-testid="row-data">
      <span>{label}: </span>
      <span>{value}</span>
    </div>
  );
  MockRowData.displayName = "RowData";
  return MockRowData;
});

describe("StudentDetailCard", () => {
  const dataLeft = [
    { label: "Nama", value: "John Doe" },
    { label: "Kelas", value: "10A" },
  ];

  const dataRight = [
    { label: "Umur", value: "16" },
    { label: "Alamat", value: "Jakarta" },
  ];

  test("should render data from dataLeft and dataRight", () => {
    render(<StudentDetailCard dataLeft={dataLeft} dataRight={dataRight} />);

    dataLeft.forEach((item) => {
      expect(screen.getByText(`${item.label}:`)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });

    dataRight.forEach((item) => {
      expect(screen.getByText(`${item.label}:`)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });

  test("matches the snapshot", () => {
    const { asFragment } = render(
      <StudentDetailCard dataLeft={dataLeft} dataRight={dataRight} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
