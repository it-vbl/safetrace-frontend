import Label from ".";

export default {
  component: Label,
  argTypes: {},
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    children: "Label",
  },
};

export const RequiredLabel = {
  args: {
    children: "Label",
    isRequired: true,
  },
};
