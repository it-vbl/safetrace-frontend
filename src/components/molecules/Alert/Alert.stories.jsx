import Alert from "./index";

export default {
  component: Alert,
  argTypes: {
    visible: { control: "boolean" },
    onClose: { action: "closed" },
    className: { control: "text" },
    textClassName: { control: "text" },
  },
};

const Template = (args) => <Alert {...args} />;

export const Default = Template.bind({});
Default.args = {
  visible: true,
  children: "This is an alert message.",
};

export const Hidden = Template.bind({});
Hidden.args = {
  visible: false,
  children: "This alert is hidden.",
};

export const CustomClasses = Template.bind({});
CustomClasses.args = {
  visible: true,
  className: "bg-yellow-50 text-warning5",
  textClassName: "font-bold",
  children: "This is a custom styled alert.",
};

export const LongText = Template.bind({});
LongText.args = {
  visible: true,
  children:
    "This is a very long alert message that might wrap to multiple lines. It demonstrates how the component handles longer content.",
};

export const Success = Template.bind({});
Success.args = {
  visible: true,
  variant: "success",
  children: "This is a success alert message.",
};

export const Error = Template.bind({});
Error.args = {
  visible: true,
  variant: "error",
  children: "This is an error alert message.",
};
