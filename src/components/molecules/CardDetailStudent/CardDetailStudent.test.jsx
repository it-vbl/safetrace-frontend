import { render, screen, fireEvent } from "@testing-library/react";

import CardDetailStudent from ".";
import "@testing-library/jest-dom";

const mockDetailStudent = {
  nis: "123456",
  name: "John Doe",
  address: "123 Main St",
  imgProfile: "https://example.com/profile.jpg",
  status: "Active",
};

const mockOnClickEdit = jest.fn();
const mockOnClickDetail = jest.fn();

describe("CardDetailStudent Component", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(
      <CardDetailStudent
        detailStudent={mockDetailStudent}
        onClickEdit={mockOnClickEdit}
        onClickDetail={mockOnClickDetail}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("calls onClickEdit when Edit button is clicked", () => {
    render(
      <CardDetailStudent
        detailStudent={mockDetailStudent}
        onClickEdit={mockOnClickEdit}
        onClickDetail={mockOnClickDetail}
      />,
    );

    const editButton = screen.getByTestId("btn-edit-card-detail-student");
    fireEvent.click(editButton);
    expect(mockOnClickEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onClickDetail when Detail button is clicked", () => {
    render(
      <CardDetailStudent
        detailStudent={mockDetailStudent}
        onClickEdit={mockOnClickEdit}
        onClickDetail={mockOnClickDetail}
      />,
    );

    const detailButton = screen.getByTestId("btn-detail-card-detail-student");
    fireEvent.click(detailButton);
    expect(mockOnClickDetail).toHaveBeenCalledTimes(1);
  });
});
