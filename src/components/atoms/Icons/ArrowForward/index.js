import PropTypes from "prop-types";

import tailwindConfig from "../../../../../tailwind.config";

const ArrowForward = ({
  size = 20,
  fill = tailwindConfig.theme.extend.colors.blue8,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.1491 17.507C6.55743 17.9154 7.21576 17.9154 7.6241 17.507L14.5491 10.582C14.8741 10.257 14.8741 9.73203 14.5491 9.40703L7.6241 2.48203C7.21576 2.0737 6.55743 2.0737 6.1491 2.48203C5.74076 2.89036 5.74076 3.5487 6.1491 3.95703L12.1824 9.9987L6.14076 16.0404C5.74076 16.4404 5.74076 17.107 6.1491 17.507Z"
      fill={fill}
    />
  </svg>
);

ArrowForward.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default ArrowForward;
