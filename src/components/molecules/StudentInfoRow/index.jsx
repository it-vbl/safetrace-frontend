import PropTypes from "prop-types";

import RowData from "@/components/atoms/RowData";

const StudentDetailCard = ({
  dataLeft = [],
  dataRight = [],
  className = "",
}) => {
  return (
    <div className={`rounded-[4px] bg-neutral3 p-6 ${className}`}>
      <div className="flex justify-between gap-8">
        <div className="flex flex-1 flex-col gap-3">
          {dataLeft?.map((item) => (
            <RowData
              className="max-w-xs break-words"
              key={item?.label}
              label={item?.label}
              value={item?.value}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {dataRight?.map((item) => (
            <RowData
              className="max-w-xs break-words"
              key={item?.label}
              label={item?.label}
              value={item?.value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

StudentDetailCard.propTypes = {
  dataLeft: PropTypes.array.isRequired,
  dataRight: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default StudentDetailCard;
