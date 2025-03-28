import StatusLabel from ".";

export default {
  component: StatusLabel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    status: "success",
    text: "Sudah Dibayar",
  },
};

export const Pending = {
  args: {
    status: "pending",
    text: "Belum Lunas",
  },
};

export const Failed = {
  args: {
    status: "failed",
    text: "Belum Dibayar",
  },
};
