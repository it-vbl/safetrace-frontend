import InputText from ".";

export default {
  component: InputText,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    label: "Label",
    value: "",
    placeholder: "Placeholder",
    containerClassName: "w-[350px]",
  },
};

export const Password = {
  args: {
    label: "Password",
    value: "",
    placeholder: "Enter your password",
    type: "password",
    containerClassName: "w-[350px]",
  },
};

export const WithHelperText = {
  args: {
    label: "Address",
    value: "",
    placeholder: "Enter your address",
    helperText: "Only letters and numbers are allowed",
    containerClassName: "w-[350px]",
  },
};

export const WithError = {
  args: {
    label: "Email",
    value: "",
    placeholder: "Enter your email",
    isError: true,
    helperText: "Please enter a valid email address",
    containerClassName: "w-[350px]",
  },
};

export const Disabled = {
  args: {
    label: "Disabled Input",
    value: "",
    placeholder: "This input is disabled",
    disabled: true,
    containerClassName: "w-[350px]",
  },
};

export const WithSuffix = {
  args: {
    label: "Distance to School",
    value: "",
    placeholder: "Enter distance",
    suffix: "KM",
    containerClassName: "w-[350px]",
  },
};
