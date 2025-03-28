import PropTypes from 'prop-types';

import Paragraph from '../Typography/Paragraph';

const Label = ({ children, isRequired = false, className = '', ...props }) => {
  return (
    <div className='flex flex-row'>
      <Paragraph level={3} className={`font-medium text-neutral11 ${className}`} {...props}>
        {children}
      </Paragraph>
      {isRequired ? (
        <Paragraph level={3} className='font-medium text-[red]'>
          *
        </Paragraph>
      ) : null}
    </div>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
};

export default Label;
