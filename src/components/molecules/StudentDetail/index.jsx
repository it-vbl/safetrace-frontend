import PropTypes from "prop-types";

import Paragraph from "@/components/atoms/Typography/Paragraph";

const StudentDetail = ({ data, className }) => {
  return (
    <div className="rounded bg-neutral3 p-4" data-testid="student-detail">
      <div className={`grid grid-cols-3 gap-x-[200px] gap-y-3 ${className}`}>
        {data?.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <Paragraph className="font-medium text-neutral8" level={4}>
              {item.label}
            </Paragraph>
            <Paragraph className="font-bold text-neutral10" level={3}>
              {item.value}
            </Paragraph>
          </div>
        ))}
      </div>
    </div>
  );
};

StudentDetail.propTypes = {
  data: PropTypes.array,
  className: PropTypes.string,
};

StudentDetail.defaultProps = {
  data: [],
  className: "",
};

export default StudentDetail;
