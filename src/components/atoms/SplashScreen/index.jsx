import { cn } from '@/utils/cn';

const SplashScreen = ({ isTransitioning }) => {
  return (
    <div className={cn('transition-opacity duration-500 ease-in-out', isTransitioning ? 'opacity-0' : 'opacity-100')}>
      <div className='fixed inset-0 flex items-center justify-center bg-white'>
        <img src='/siprusEduLogo.webp' alt='Logo' className='relative top-[-20px] h-auto w-[200px] object-contain' />
      </div>
    </div>
  );
};

export default SplashScreen;
