import * as Yup from "yup";

import Select from ".";

export default {
  component: Select,
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
    placeholder: "Select an option",
    options,
    containerClassName: "w-[350px]",
  },
};

export const Required = {
  args: {
    label: "Label",
    placeholder: "Select an option",
    options,
    isRequired: true,
    containerClassName: "w-[350px]",
  },
};

export const Disabled = {
  args: {
    label: "Disabled",
    placeholder: "Select an option",
    options,
    disabled: true,
    containerClassName: "w-[350px]",
  },
};

export const Error = {
  args: {
    label: "Error State",
    placeholder: "Select an option",
    options,
    isError: true,
    helperText: "Error is happening!",
    containerClassName: "w-[350px]",
  },
};

export const WithAddOption = {
  args: {
    label: "Add Custom Option",
    placeholder: "Select or add an option",
    options,
    containerClassName: "w-[350px]",
    allowAddOption: {
      visible: true,
      isLoading: false,
      placeholder: "Add new option",
      onSubmitOption: (newOption) => {
        console.log("New option submitted:", newOption);
      },
      addButtonText: "Add New",
      applyButtonText: "Apply",
      validationSchema: Yup.string().required("Option is required"),
    },
  },
};

export const WithAddOptionLoading = {
  args: {
    label: "Add Custom Option (Loading)",
    placeholder: "Select or add an option",
    options,
    containerClassName: "w-[350px]",
    allowAddOption: {
      visible: true,
      isLoading: true,
      placeholder: "Add new option",
      onSubmitOption: (newOption) => {
        console.log("New option submitted:", newOption);
      },
      addButtonText: "Add New",
      applyButtonText: "Apply",
    },
  },
};

export const WithAddOptionCustomLanguage = {
  args: {
    label: "Add Custom Option",
    placeholder: "Select or add an option",
    options,
    containerClassName: "w-[350px]",
    allowAddOption: {
      visible: true,
      placeholder: "Tambahkan opsi baru",
      isLoading: false,
      onSubmitOption: (newOption) => {
        console.log("New option submitted:", newOption);
      },
      addButtonText: "Tambah",
      applyButtonText: "Terapkan",
    },
  },
};
