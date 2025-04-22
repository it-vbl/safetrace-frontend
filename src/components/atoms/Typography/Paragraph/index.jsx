import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

const Paragraph = ({ children, level = 1, className = '', ...props }) => {
  const ParagraphClassName = {
    1: 'text-xl',
    2: 'text-base',
    3: 'text-sm',
    4: 'text-xs',
  };

  return (
    <p className={cn('break-normal', ParagraphClassName[level], className)} {...props}>
      {children}
    </p>
  );
};

Paragraph.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4]),
  className: PropTypes.string,
};

export default Paragraph;
