import Toggle from ".";

export default {
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    value: false,
    disabled: false,
  },
};

export const Checked = {
  args: {
    value: true,
    disabled: false,
  },
};

export const Disabled = {
  args: {
    value: false,
    disabled: true,
  },
};

export const DisabledChecked = {
  args: {
    value: true,
    disabled: true,
  },
};
