import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import PaymentMethod from ".";

jest.mock("../../../helpers/utils/convertMoney", () => {
  return jest.fn((amount) => `Rp ${amount.toLocaleString("id-ID")}`);
});

describe("PaymentMethod Component", () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  const options = [
    {
      id: 1,
      paymentMethod: "VA",
      bankName: "Bank A",
      methodLogo: "/logo-a.png",
      adminFee: 5000,
      isPercentage: false,
    },
    {
      id: 2,
      paymentMethod: "CC",
      bankName: "Bank B",
      methodLogo: "/logo-b.png",
      adminFee: 0,
      isPercentage: true,
      adminFeePercentage: 2,
    },
  ];

  const data = {
    billings: [{ amount: 100000 }, { amount: 50000 }],
  };

  test("should render the PaymentMethod component", () => {
    render(
      <PaymentMethod
        visible={true}
        data={data}
        options={options}
        value={1}
        isLoading={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByTestId("payment-title")).toBeInTheDocument();
  });

  test("should not render the PaymentMethod component when visible is false", () => {
    render(
      <PaymentMethod
        visible={false}
        data={data}
        options={options}
        value={1}
        isLoading={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />,
    );

    expect(screen.queryByTestId("payment-title")).not.toBeInTheDocument();
    expect(screen.queryByTestId("total-amount")).not.toBeInTheDocument();
    expect(screen.queryByTestId("admin-fee")).not.toBeInTheDocument();
  });

  test("should change the selected method when a radio button is clicked", () => {
    render(
      <PaymentMethod
        visible={true}
        data={data}
        options={options}
        value={1}
        isLoading={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />,
    );

    const radioButton = screen.getByLabelText("Bank B");
    fireEvent.click(radioButton);

    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  test("should hide image on error", () => {
    render(
      <PaymentMethod
        visible={true}
        data={data}
        options={options}
        value={1}
        isLoading={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />,
    );

    const image = screen.getByAltText("Bank A Logo");

    fireEvent.error(image);

    expect(image).toHaveStyle("display: none");
  });

  test("should hide all images on error", () => {
    render(
      <PaymentMethod
        visible={true}
        data={data}
        options={options}
        value={1}
        isLoading={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />,
    );

    const images = screen.getAllByRole("img");

    images.forEach((image) => {
      fireEvent.error(image);
      expect(image).toHaveStyle("display: none");
    });
  });

  test("should match snapshot", () => {
    const { getByTestId } = render(
      <PaymentMethod
        visible={true}
        data={data}
        options={options}
        value={1}
        isLoading={false}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />,
    );
    const component = getByTestId("modal-payment-method");
    expect(component).toMatchSnapshot();
  });
});
