import PropTypes from "prop-types";

const VerifiedUser = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8.00065" cy="7.9987" r="6.66667" fill="#D5F1FD" />
    <path
      d="M5.33398 8.66667L7.00065 10.3333L11.334 6"
      stroke="#007AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

VerifiedUser.propTypes = {
  size: PropTypes.number,
};

export default VerifiedUser;
