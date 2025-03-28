import TextArea from ".";

export default {
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    label: "Caption",
    placeholder: "Placeholder",
    value: "",
    isChecked: false,
    maxChar: 200,
    helperText: "",
    hasError: false,
    disabled: false,
    isRequired: false,
  },
};

export const Filled = {
  args: {
    label: "Caption",
    placeholder: "Placeholder",
    value: "This is a filled text area.",
    isChecked: false,
    maxChar: 200,
    helperText: "",
    hasError: false,
    disabled: false,
    isRequired: false,
  },
};

export const Error = {
  args: {
    label: "Caption",
    placeholder: "Placeholder",
    value: "This is a text area with error.",
    isChecked: false,
    maxChar: 200,
    helperText: "There is an error",
    hasError: true,
    disabled: false,
    isRequired: false,
  },
};

export const Disabled = {
  args: {
    label: "Caption",
    placeholder: "Placeholder",
    value: "This is a disabled text area.",
    isChecked: false,
    maxChar: 200,
    helperText: "",
    hasError: false,
    disabled: true,
    isRequired: false,
  },
};

export const Mandatory = {
  args: {
    label: "Caption",
    placeholder: "Placeholder",
    value: "",
    isChecked: false,
    maxChar: 200,
    helperText: "",
    hasError: false,
    disabled: false,
    isRequired: true,
  },
};

export const WithHelperText = {
  args: {
    label: "Caption",
    placeholder: "Placeholder",
    value: "",
    isChecked: false,
    maxChar: 200,
    helperText: "Helper Text",
    hasError: false,
    disabled: false,
    isRequired: false,
  },
};

export const WithCheckbox = {
  args: {
    label: "Caption",
    placeholder: "Placeholder",
    value: "",
    isChecked: true,
    maxChar: 200,
    helperText: "",
    hasError: false,
    disabled: false,
    isRequired: false,
    isCheckable: true,
  },
};
