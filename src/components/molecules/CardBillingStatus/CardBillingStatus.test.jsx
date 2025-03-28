import { render, screen, fireEvent } from "@testing-library/react";

import CardBillingStatus from ".";
import "@testing-library/jest-dom";

const mockDetailBilling = {
  billkey: "12345",
  semester: "2024",
  billName: "Tuition Fee",
  studentClass: "Grade 12",
  createdDate: "2024-01-01",
  endDate: "2024-12-31",
  amount: "5000000",
  status: "belum bayar",
};

const mockOnClickLaunch = jest.fn();
const mockOnClickPay = jest.fn();

describe("CardBillingStatus Component", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(
      <CardBillingStatus
        detailBilling={mockDetailBilling}
        onClickLaunch={mockOnClickLaunch}
        onClickPay={mockOnClickPay}
        loadingButtonPay={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("calls onClickPay when Pay Now button is clicked", () => {
    render(
      <CardBillingStatus
        detailBilling={mockDetailBilling}
        onClickLaunch={mockOnClickLaunch}
        onClickPay={mockOnClickPay}
        loadingButtonPay={false}
      />,
    );

    const payButton = screen.getByTestId("btn-pay-card-billing-status");
    fireEvent.click(payButton);

    expect(mockOnClickPay).toHaveBeenCalledTimes(1);
    expect(mockOnClickPay).toHaveBeenCalledWith(mockDetailBilling);
  });

  it("calls onClickLaunch when Detail button is clicked", () => {
    render(
      <CardBillingStatus
        detailBilling={mockDetailBilling}
        onClickLaunch={mockOnClickLaunch}
        onClickPay={mockOnClickPay}
        loadingButtonPay={false}
      />,
    );

    const detailButton = screen.getByTestId("btn-detail-card-billing-status");
    fireEvent.click(detailButton);

    expect(mockOnClickLaunch).toHaveBeenCalledTimes(1);
    expect(mockOnClickLaunch).toHaveBeenCalledWith(mockDetailBilling);
  });

  it("disables Pay Now button when loadingButtonPay is true", () => {
    render(
      <CardBillingStatus
        detailBilling={mockDetailBilling}
        onClickLaunch={mockOnClickLaunch}
        onClickPay={mockOnClickPay}
        loadingButtonPay={true}
      />,
    );

    const payButton = screen.getByTestId("btn-pay-card-billing-status");
    expect(payButton).toBeDisabled();
  });
});
