import PropTypes from "prop-types";

const Display = ({ children, level = 1, className }) => {
  const DisplayClassName = {
    1: "text-[60px]",
    2: "text-[52px]",
    3: "text-[46px]",
    4: "text-[36px]",
  };

  return (
    <span className={`font-bold ${DisplayClassName[level]} ${className}`}>
      {children}
    </span>
  );
};

Display.propTypes = {
  children: PropTypes.node.isRequired,
  level: PropTypes.oneOf([1, 2, 3, 4]),
  className: PropTypes.string,
};

export default Display;
