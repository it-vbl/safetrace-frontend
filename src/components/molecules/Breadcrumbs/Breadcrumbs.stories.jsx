import Breadcrumb from ".";

export default {
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    crumbs: [
      { name: "Home", url: "https://example.com" },
      { name: "Master Data Siswa", url: "https://example.com" },
      { name: "Breadcrumbs", url: "https://example.com" },
    ],
  },
};
