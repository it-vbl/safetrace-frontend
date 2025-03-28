import SearchBar from ".";

export default {
  component: SearchBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    value: "",
    placeholder: "Search",
  },
};

export const Filled = {
  args: {
    value: "Type Keyword",
    placeholder: "Search",
  },
};
