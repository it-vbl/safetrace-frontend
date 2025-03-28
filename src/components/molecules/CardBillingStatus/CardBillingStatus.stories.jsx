import CardBillingStatus from ".";

export default {
  component: CardBillingStatus,
  tags: ["autodocs"],
  parameters: {},
};

export const Cicil = {
  args: {
    detailBilling: {
      billkey: "123123121",
      semester: "2024/1",
      billName: "Pertengahan Semester",
      studentClass: "VII",
      createdDate: "17/10/2024",
      endDate: "20/10/2024",
      amount: "Rp. 800.000",
      status: "cicil",
    },
    onClickLaunch: () => {},
    onClickPay: () => {},
  },
};

export const BelumBayar = {
  args: {
    detailBilling: {
      billkey: "123123121",
      semester: "2024/1",
      billName: "Pertengahan Semester",
      studentClass: "VII",
      createdDate: "17/10/2024",
      endDate: "20/10/2024",
      amount: "Rp. 800.000",
      status: "belum dibayar",
    },
    onClickLaunch: () => {},
    onClickPay: () => {},
  },
};

export const Lunas = {
  args: {
    detailBilling: {
      billkey: "123123121",
      semester: "2024/1",
      billName: "Pertengahan Semester",
      studentClass: "VII",
      createdDate: "17/10/2024",
      endDate: "20/10/2024",
      amount: "Rp. 800.000",
      status: "lunas",
    },
    onClickLaunch: () => {},
    onClickPay: () => {},
  },
};
