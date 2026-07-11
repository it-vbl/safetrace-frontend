import RemoveRedEye from "../Icons/RemoveRedEye";

import Cascader from ".";

export default {
  component: Cascader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => <Cascader className="w-[350px]" {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Default Cascader",
};

export const Selected = Template.bind({});
Selected.args = {
  children: "Selected Cascader",
  isSelected: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: "Disabled Cascader",
  disabled: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: "Cascader with Icon",
  icon: <RemoveRedEye />,
};

export const WithCheckbox = Template.bind({});
WithCheckbox.args = {
  children: "Cascader with Checkbox",
  checkbox: true,
};

export const ChildVariant = Template.bind({});
ChildVariant.args = {
  children: "Child Cascader",
  variant: "child",
};

export const CustomClassName = Template.bind({});
CustomClassName.args = {
  children: "Custom Class Cascader",
  className: "bg-bgColor text-primary",
};

export const CustomTextClassName = Template.bind({});
CustomTextClassName.args = {
  children: "Custom Text Class Cascader",
  textClassName: "font-bold italic",
};

export const WithOnClick = Template.bind({});
WithOnClick.args = {
  children: "Clickable Cascader",
  onClick: () => alert("Cascader clicked!"),
};

export const SelectedWithCheckbox = Template.bind({});
SelectedWithCheckbox.args = {
  children: "Selected Cascader with Checkbox",
  isSelected: true,
  checkbox: true,
};

export const DisabledWithIcon = Template.bind({});
DisabledWithIcon.args = {
  children: "Disabled Cascader with Icon",
  disabled: true,
  icon: <RemoveRedEye />,
};

export const ChildVariantWithIcon = Template.bind({});
ChildVariantWithIcon.args = {
  children: "Child Cascader with Icon",
  variant: "child",
  icon: <RemoveRedEye />,
};

export const AllFeaturesCombined = Template.bind({});
AllFeaturesCombined.args = {
  children: "All Features Cascader",
  isSelected: true,
  icon: <RemoveRedEye />,
  checkbox: true,
  variant: "child",
  className: "bg-bgColor",
  textClassName: "text-primary font-semibold",
  onClick: () => alert("Combined Cascader clicked!"),
};
