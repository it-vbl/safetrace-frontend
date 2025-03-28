import DatePicker from ".";

export default {
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    label: "Date",
    value: null,
    onChange: (date) => console.log("Selected date:", date),
    containerClassName: "w-[350px]",
  },
};

export const WithValue = {
  args: {
    ...Default.args,
    value: "2024-01-01",
  },
};

export const Required = {
  args: {
    ...Default.args,
    required: true,
  },
};

export const Disabled = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const WithError = {
  args: {
    ...Default.args,
    isError: true,
    helperText: "Please select a valid date",
  },
};

export const WithHelperText = {
  args: {
    ...Default.args,
    helperText: "Select your preferred date",
  },
};

export const WithMinDate = {
  args: {
    ...Default.args,
    minDate: "2024-01-01",
  },
};

export const WithMaxDate = {
  args: {
    ...Default.args,
    maxDate: "2024-12-31",
  },
};

export const WithMinAndMaxDate = {
  args: {
    ...Default.args,
    minDate: "2023-01-01",
    maxDate: "2024-12-31",
  },
};

export const CustomLabel = {
  args: {
    ...Default.args,
    label: "Custom Label",
  },
};

export const NoLabel = {
  args: {
    ...Default.args,
    label: "",
  },
};
