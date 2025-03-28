import SelectMultiple from ".";

export default {
  component: SelectMultiple,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

const options = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
  { label: "Option 4", value: "option-4" },
];

export const Default = {
  args: {
    label: "Label",
    placeholder: "Select multiple options",
    options,
    value: [],
    containerClassName: "w-[350px]",
  },
};

export const WithSelectedValues = {
  args: {
    label: "Label",
    placeholder: "Select multiple options",
    options,
    value: ["option-1", "option-3"],
    containerClassName: "w-[350px]",
  },
};

export const Required = {
  args: {
    label: "Label",
    placeholder: "Select multiple options",
    options,
    value: [],
    isRequired: true,
    containerClassName: "w-[350px]",
  },
};

export const Disabled = {
  args: {
    label: "Disabled",
    placeholder: "Select multiple options",
    options,
    value: [],
    disabled: true,
    containerClassName: "w-[350px]",
  },
};

export const Error = {
  args: {
    label: "Error",
    placeholder: "Select multiple options",
    options,
    value: [],
    isError: true,
    helperText: "Error message",
    containerClassName: "w-[350px]",
  },
};

export const WithHelperText = {
  args: {
    label: "With Helper Text",
    placeholder: "Select multiple options",
    options,
    value: [],
    helperText: "This is a helper text",
    containerClassName: "w-[350px]",
  },
};
