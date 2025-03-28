import Modal from ".";

export default {
  component: Modal,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#F5F5F5" },
        { name: "dark", value: "#333333" },
      ],
    },
  },
};

const Template = (args) => <Modal {...args} />;

export const Default = Template.bind({});
Default.args = {
  visible: true,
  title: "Default Modal",
  subtitle: "This is a default modal",
  children: <p>Modal content goes here</p>,
  onCloseModal: () => console.log("Modal closed"),
};

export const WithoutSubtitle = Template.bind({});
WithoutSubtitle.args = {
  ...Default.args,
  title: "Modal Without Subtitle",
  subtitle: undefined,
};

export const LongContent = Template.bind({});
LongContent.args = {
  ...Default.args,
  title: "Modal with Long Content",
  children: (
    <div>
      <p>This modal has long content to demonstrate scrolling behavior.</p>
      {Array(20)
        .fill()
        .map((_, index) => (
          <p key={index}>Long content line {index + 1}</p>
        ))}
    </div>
  ),
};

export const CustomFooter = Template.bind({});
CustomFooter.args = {
  ...Default.args,
  title: "Modal with Custom Footer",
  children: <p>This modal has a custom footer</p>,
  footer: (
    <div className="flex justify-end space-x-2">
      <button className="rounded bg-gray-200 px-4 py-2">Cancel</button>
      <button className="rounded bg-blue-500 px-4 py-2 text-white">Save</button>
    </div>
  ),
};
