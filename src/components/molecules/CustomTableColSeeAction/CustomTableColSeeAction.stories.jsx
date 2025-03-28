import CustomTableColSeeAction from "./";

export default {
  title: "Components/CustomTableColSeeAction",
  component: CustomTableColSeeAction,
  argTypes: {
    onClick: { action: "clicked" },
  },
};

const Template = (args) => <CustomTableColSeeAction {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const CustomOnClick = Template.bind({});
CustomOnClick.args = {
  onClick: () => console.log("Custom click action"),
};
