import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";
import { fireEvent,render, screen } from "@testing-library/react";

import StudentBillingDetail from ".";

import "@testing-library/jest-dom";

const mockData = {
  fullName: "Axel Pramudian",
  nis: "1637483939",
  schoolClass: "X IPA 1",
  schoolYearName: "2023/2024",
};

const mockBillings = [
  {
    billingStudentId: 1,
    detailBillingName: "SPP September",
    billingType: "SPP",
    amount: 500000,
    paymentStatus: "Belum Dibayar",
  },
  {
    billingStudentId: 2,
    detailBillingName: "SPP Oktober",
    billingType: "SPP",
    amount: 500000,
    paymentStatus: "Belum Dibayar",
  },
];

const mockStore = configureStore({
  reducer: {
    data: (state = { selectedSort: "" }) => state,
  },
});

describe("StudentBillingDetail Component", () => {
  test("renders component with default props", () => {
    render(
      <Provider store={mockStore}>
        <StudentBillingDetail
          data={mockData}
          billings={mockBillings}
          isLoading={false}
          isExpanded={false}
          onExpand={jest.fn()}
          setIsExpanded={jest.fn()}
          onSubmit={jest.fn()}
        />
      </Provider>,
    );

    expect(screen.getByText(/Axel Pramudian/i)).toBeInTheDocument();
    expect(screen.getByText(/1637483939/i)).toBeInTheDocument();
    expect(screen.getByText(/X IPA 1/i)).toBeInTheDocument();
    expect(screen.getByText(/2023\/2024/i)).toBeInTheDocument();
  });

  test("handles expand functionality", async () => {
    const onExpandMock = jest.fn();
    const setIsExpandedMock = jest.fn();

    render(
      <Provider store={mockStore}>
        <StudentBillingDetail
          data={mockData}
          billings={mockBillings}
          isLoading={false}
          isExpanded={false}
          onExpand={onExpandMock}
          setIsExpanded={setIsExpandedMock}
          onSubmit={jest.fn()}
        />
      </Provider>,
    );

    const expandButton = screen.getByRole("button", {
      name: /lihat selengkapnya/i,
    });

    fireEvent.click(expandButton);

    expect(onExpandMock).toHaveBeenCalledTimes(1);
    expect(setIsExpandedMock).toHaveBeenCalledTimes(0);
  });

  test("disables 'Bayar Tagihan' button when no rows are selected", () => {
    render(
      <Provider store={mockStore}>
        <StudentBillingDetail
          data={mockData}
          billings={mockBillings}
          isLoading={false}
          isExpanded={true}
          onExpand={jest.fn()}
          setIsExpanded={jest.fn()}
          onSubmit={jest.fn()}
        />
      </Provider>,
    );

    const bayarButton = screen.getByRole("button", { name: /bayar tagihan/i });
    expect(bayarButton).toBeDisabled();
  });

  test("enables 'Bayar Tagihan' button when rows are selected", () => {
    render(
      <Provider store={mockStore}>
        <StudentBillingDetail
          data={mockData}
          billings={mockBillings}
          isLoading={false}
          isExpanded={true}
          onExpand={jest.fn()}
          setIsExpanded={jest.fn()}
          onSubmit={jest.fn()}
        />
      </Provider>,
    );

    const checkbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(checkbox);

    const bayarButton = screen.getByRole("button", { name: /bayar tagihan/i });
    expect(bayarButton).not.toBeDisabled();
  });

  test("handles row selection and total payment calculation", () => {
    render(
      <Provider store={mockStore}>
        <StudentBillingDetail
          data={mockData}
          billings={mockBillings}
          isLoading={false}
          isExpanded={true}
          onExpand={jest.fn()}
          setIsExpanded={jest.fn()}
          onSubmit={jest.fn()}
        />
      </Provider>,
    );

    const checkbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(checkbox);

    const totalPayment = screen.getByDisplayValue(/rp 500.000/i);
    expect(totalPayment).toBeInTheDocument();
  });

  test("renders donation section if donations are provided", () => {
    const mockDonations = [{ billingId: 1, billingName: "Donasi Buku" }];

    render(
      <Provider store={mockStore}>
        <StudentBillingDetail
          data={mockData}
          billings={mockBillings}
          isLoading={false}
          isExpanded={true}
          donations={mockDonations}
          handlePayDonation={jest.fn()}
        />
      </Provider>,
    );

    expect(screen.getByText(/donasi buku/i)).toBeInTheDocument();
  });

  test("handles payment submission", () => {
    const onSubmitMock = jest.fn();

    render(
      <Provider store={mockStore}>
        <StudentBillingDetail
          data={mockData}
          billings={mockBillings}
          isLoading={false}
          isExpanded={true}
          onExpand={jest.fn()}
          setIsExpanded={jest.fn()}
          onSubmit={onSubmitMock}
        />
      </Provider>,
    );

    const checkbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(checkbox);

    const bayarButton = screen.getByRole("button", { name: /bayar tagihan/i });
    fireEvent.click(bayarButton);

    expect(onSubmitMock).toHaveBeenCalledWith({
      ...mockData,
      billings: [mockBillings[0]],
    });
  });
});

describe("StudentBillingDetail Component - Snapshot Test", () => {
  test("matches snapshot with default props", () => {
    const { asFragment } = render(
      <Provider store={mockStore}>
        <StudentBillingDetail
          data={mockData}
          billings={mockBillings}
          isLoading={false}
          isExpanded={false}
          onExpand={jest.fn()}
          setIsExpanded={jest.fn()}
          onSubmit={jest.fn()}
        />
      </Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
