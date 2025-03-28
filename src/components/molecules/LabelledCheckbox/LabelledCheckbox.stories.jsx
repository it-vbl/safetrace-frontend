import LabelledCheckbox from ".";

export default {
  component: LabelledCheckbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    label: "Label",
    value: false,
    disabled: false,
  },
};
