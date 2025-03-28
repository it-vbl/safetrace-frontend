import RadioButton from ".";

export default {
  component: RadioButton,
  tags: ["autodocs"],
  parameters: {},
};

export const Default = {
  args: {
    isRequired: true,
    label: "Ini adalah label",
    options: [
      {
        label: "Option 1",
        value: "option_1",
      },
      {
        label: "Option 2",
        value: "option_2",
      },
    ],
  },
};

export const ThereIsNoLabel = {
  args: {
    options: [
      {
        label: "Option 1",
        value: "option_1",
      },
      {
        label: "Option 2",
        value: "option_2",
      },
    ],
  },
};

export const ErrorState = {
  args: {
    options: [
      {
        label: "Option 1",
        value: "option_1",
      },
      {
        label: "Option 2",
        value: "option_2",
      },
    ],
    isError: true,
    helperText: "Radio button wajib dipilih",
  },
};
