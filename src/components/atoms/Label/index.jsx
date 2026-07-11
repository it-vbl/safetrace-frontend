import PropTypes from 'prop-types';

import Paragraph from '../Typography/Paragraph';

const Label = ({ children, isRequired = false, className = '', ...props }) => {
  return (
    <div className='flex flex-row'>
      <Paragraph level={3} className={`font-medium text-neutral-900 ${className}`} {...props}>
        {children} {isRequired && <span className='text-tertiary'>*</span>}
      </Paragraph>
    </div>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
};

export default Label;
