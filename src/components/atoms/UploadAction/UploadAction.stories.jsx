import UploadAction from ".";

export default {
  component: UploadAction,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    onChange: () => console.log("File changed"),
    className: "cursor-pointer text-blue-500 underline",
    id: "default-upload",
    label: "Upload File",
    allowedFiles: ["image/jpeg", "image/png", "application/pdf"],
  },
};

export const CustomLabel = {
  args: {
    ...Default.args,
    label: "Choose a file",
    id: "custom-label-upload",
  },
};

export const RestrictedFileTypes = {
  args: {
    ...Default.args,
    label: "Upload Image",
    id: "image-upload",
    allowedFiles: ["image/jpeg", "image/png"],
  },
};

export const CustomStyling = {
  args: {
    ...Default.args,
    className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
    id: "styled-upload",
  },
};
