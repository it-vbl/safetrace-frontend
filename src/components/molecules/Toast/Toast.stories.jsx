import Toast from ".";

export default {
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    show: true,
    message: "Success!",
    toastId: "success",
    type: "success",
  },
};

export const ErrorState = {
  args: {
    show: true,
    message: "Error!",
    toastId: "error",
    type: "error",
  },
};

export const SuccessWithoutProgressBar = {
  args: {
    show: true,
    message: "Success!",
    toastId: "success",
    type: "success",
    hideProgressBar: true,
    showCloseButton: false,
  },
};

export const ErrorWithoutProgressBar = {
  args: {
    show: true,
    message: "Error!",
    toastId: "error",
    type: "error",
    hideProgressBar: true,
    showCloseButton: false,
  },
};

export const SuccessWithoutAutoClose = {
  args: {
    show: true,
    message: "Success!",
    toastId: "success",
    type: "success",
    autoClose: false,
  },
};

export const ErrorWithoutAutoClose = {
  args: {
    show: true,
    message: "Error!",
    toastId: "error",
    type: "error",
    autoClose: false,
  },
};
