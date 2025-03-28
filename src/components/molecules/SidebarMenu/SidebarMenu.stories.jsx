import Home from "../../atoms/Icons/Home";

import SidebarMenu from ".";

export default {
  component: SidebarMenu,
  tags: ["autodocs"],
  parameters: {},
};

export const Default = {
  args: {
    label: "Home",
    icon: <Home />,
  },
};

export const Hovered = {
  args: {
    label: "Home",
    icon: <Home />,
  },
  render: (args) => <SidebarMenu className="SidebarMenu bg-blue1" {...args} />,
};

export const Active = {
  args: {
    label: "Home",
    icon: <Home />,
    active: true,
  },
};
