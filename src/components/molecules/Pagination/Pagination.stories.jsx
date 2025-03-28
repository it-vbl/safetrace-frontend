import Pagination from ".";

export default {
  component: Pagination,
  tags: ["autodocs"],
  parameters: {},
};

export const Default = {
  args: {
    totalPages: 10,
    onPageChange: () => {},
    onSelectOption: () => {},
    options: [10, 15, 30],
  },
};
