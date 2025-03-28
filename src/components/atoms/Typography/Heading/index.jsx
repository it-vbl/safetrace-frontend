import PropTypes from 'prop-types';

import { cn } from '@/utils/cn';

const Heading = ({ children, level = 1, className = '' }) => {
  const HeadingClassName = {
    1: 'text-2xl lg:text-[32px]',
    2: 'text-xl lg:text-[28px]',
    3: 'text-lg lg:text-2xl',
    4: 'text-base lg:text-lg',
    5: 'text-sm lg:text-base',
    6: 'text-xs lg:text-sm',
  };

  const Tag = `h${level}`;

  return <Tag className={cn('font-bold', HeadingClassName[level], className)}>{children}</Tag>;
};

Heading.propTypes = {
  children: PropTypes.node.isRequired,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  className: PropTypes.string,
};

export default Heading;
