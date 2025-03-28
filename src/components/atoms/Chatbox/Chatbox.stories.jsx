import Chatbox from ".";

export default {
  component: Chatbox,
  tags: ["autodocs"],
  parameter: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    total: 2,
    color: "#000",
  },
};

export const ThereIsNoMessage = {
  args: {
    total: 0,
    color: "#000",
  },
};
