import RemoveRedEye from "@/components/atoms/Icons/RemoveRedEye";

import Action from ".";

export default {
  component: Action,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    label: "Lihat",
    icon: <RemoveRedEye />,
    onClick: () => console.log("Default Action clicked"),
  },
};
