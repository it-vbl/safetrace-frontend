import Checkbox from ".";

export default {
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Checked = {
  args: {
    value: true,
    disabled: false,
  },
};
export const Unchecked = {
  args: {
    value: false,
    disabled: false,
  },
};
export const Disabled = {
  args: {
    value: false,
    disabled: true,
  },
};
