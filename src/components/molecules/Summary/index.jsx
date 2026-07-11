import PropTypes from "prop-types";

import Paragraph from "@/components/atoms/Typography/Paragraph";

const Summary = ({ data = [], lastTextColor = "" }) =>
  data?.map((item, index) => (
    <div key={item.label} className="flex items-center justify-between">
      <Paragraph className="font-medium text-neutral-600" level={4}>
        {item.label}
      </Paragraph>
      <Paragraph
        className={`font-bold ${index === data.length - 1 ? lastTextColor : "text-neutral-900"}`}
        level={index === data.length - 1 ? 1 : 3}
      >
        {item.value}
      </Paragraph>
    </div>
  ));

Summary.propTypes = {
  data: PropTypes.array,
  lastTextColor: PropTypes.string,
};

export default Summary;
