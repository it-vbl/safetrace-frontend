import AccordionItem from ".";

export default {
  component: AccordionItem,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "How do I login?",
    description: (
      <p className="text-[14px] font-medium leading-[18px] text-[#414347]">
        Please check this video.{" "}
        <span
          className="cursor-pointer font-bold text-[#4C79AB] underline"
          onClick={() => console.log("clicked!")}
        >
          Click Here
        </span>
      </p>
    ),
  },
};
