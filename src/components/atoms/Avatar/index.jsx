import PropTypes from "prop-types";

const Avatar = ({ url = "/default-profile.svg", className = "" }) => {
  return (
    <div
      className={`size-8 overflow-hidden rounded-full ${className}`}
      data-testid="avatar"
    >
      <img
        src={url}
        className="size-full object-cover object-center"
        alt="avatar"
      />
    </div>
  );
};

Avatar.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
};

export default Avatar;
