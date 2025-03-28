import Upload from ".";

export default {
  component: Upload,
  tags: ["autodocs"],
  parameter: {
    layout: "centered",
  },
};

export const Default = {
  args: {},
};

export const ErrorState = {
  name: "Error State",
  args: {
    error: true,
  },
};

export const ThereIsAValue = {
  name: "There is a value",
  args: {
    file: {
      name: "tes.jpg",
      size: 10,
      uploadDate: "2 October 2024",
    },
  },
};
