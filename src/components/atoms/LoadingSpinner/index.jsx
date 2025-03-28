import { cn } from '@/utils/cn';

const LoadingSpinner = ({ className, size = 'medium' }) => {
  const sizeClass = {
    extraSmall: '!scale-[0.25]',
    small: '!scale-[0.3]',
    medium: '!scale-[0.5]',
    large: '!scale-[0.6]',
  };

  return (
    <div data-testid='loading-spinner' className={cn('lds-ring', sizeClass[size], className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
