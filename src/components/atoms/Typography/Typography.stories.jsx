import Display from "./Display";
import Heading from "./Heading";
import Paragraph from "./Paragraph";

export default {
  Title: "Typography",
  components: { Heading, Display },
  tags: ["autodocs"],
};

export const Heading1 = {
  render: (args) => <Heading {...args} />,
  args: {
    children: "Heading 1",
  },
};

export const Heading2 = {
  render: (args) => <Heading {...args} />,
  args: {
    children: "Heading 2",
    level: 2,
  },
};

export const Heading3 = {
  render: (args) => <Heading {...args} />,
  args: {
    children: "Heading 3",
    level: 3,
  },
};

export const Heading4 = {
  render: (args) => <Heading {...args} />,
  args: {
    children: "Heading 4",
    level: 4,
  },
};

export const Heading5 = {
  render: (args) => <Heading {...args} />,
  args: {
    children: "Heading 5",
    level: 5,
  },
};

export const Heading6 = {
  render: (args) => <Heading {...args} />,
  args: {
    children: "Heading 6",
    level: 6,
  },
};

export const Display1 = {
  render: (args) => <Display {...args} />,
  args: {
    children: "Display 1",
  },
};
export const Display2 = {
  render: (args) => <Display {...args} />,
  args: {
    children: "Display 2",
    level: 2,
  },
};
export const Display3 = {
  render: (args) => <Display {...args} />,
  args: {
    children: "Display 3",
    level: 3,
  },
};
export const Display4 = {
  render: (args) => <Display {...args} />,
  args: {
    children: "Display 4",
    level: 4,
  },
};
export const Paragraph1 = {
  render: (args) => <Paragraph {...args} />,
  args: {
    children: "Paragraph 1",
  },
};
export const Paragraph2 = {
  render: (args) => <Paragraph {...args} />,
  args: {
    children: "Paragraph 2",
    level: 2,
  },
};
export const Paragraph3 = {
  render: (args) => <Paragraph {...args} />,
  args: {
    children: "Paragraph 3",
    level: 3,
  },
};
export const Paragraph4 = {
  render: (args) => <Paragraph {...args} />,
  args: {
    children: "Paragraph 4",
    level: 4,
  },
};
