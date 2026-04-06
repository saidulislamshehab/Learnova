import { useEffect, useRef } from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loading = ({ 
  message = 'Loading...', 
  fullScreen = false,
  size = 'md',
  className = ''
}: LoadingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const containerClass = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center';

  useEffect(() => {
    const loadLottie = async () => {
      try {
        const { default: lottie } = await import('lottie-web');
        const response = await fetch('/Loading.lottie');
        const animationData = await response.json();

        if (containerRef.current && containerRef.current.querySelector('svg') === null) {
          lottie.loadAnimation({
            container: containerRef.current.querySelector('.lottie-container') as HTMLElement,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData,
          });
        }
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
      }
    };

    loadLottie();
  }, []);

  return (
    <div className={`${containerClass} ${className}`} ref={containerRef}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`${sizeMap[size]} lottie-container`} />
        {message && (
          <p className="text-[#A5C89E] text-center text-sm md:text-base">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;
