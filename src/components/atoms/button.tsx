import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, className, onClick, ...props }) => {
  return (
    <button onClick={onClick} className={`rounded-md px-4 py-2 ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
