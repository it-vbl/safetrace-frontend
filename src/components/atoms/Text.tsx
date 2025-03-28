import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

const Text: React.FC<TextProps> = ({ children, className }) => {
  return <span className={className}>{children}</span>;
};

export default Text;
