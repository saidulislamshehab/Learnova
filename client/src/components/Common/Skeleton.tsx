import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

/**
 * Base Skeleton component with shimmer effect
 */
export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  borderRadius = '0.5rem' 
}) => {
  return (
    <div 
      className={`animate-shimmer overflow-hidden ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius 
      }}
    />
  );
};

/**
 * Skeleton component for text lines
 */
export const SkeletonText: React.FC<SkeletonProps & { lines?: number }> = ({ 
  lines = 1, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 && lines > 1 ? '75%' : '100%'} 
          height="1rem" 
          {...props} 
        />
      ))}
    </div>
  );
};

/**
 * Skeleton component for avatars/circular images
 */
export const SkeletonAvatar: React.FC<SkeletonProps & { size?: number | string }> = ({ 
  size = '3rem', 
  className = '', 
  ...props 
}) => {
  return (
    <Skeleton 
      width={size} 
      height={size} 
      borderRadius="9999px" 
      className={className} 
      {...props} 
    />
  );
};

/**
 * A generic Card skeleton that can be used for courses, articles, etc.
 */
export const SkeletonCard: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div className={`theme-card rounded-xl overflow-hidden p-6 space-y-4 ${className}`}>
      <Skeleton height="10rem" width="100%" borderRadius="0.75rem" />
      <div className="space-y-2">
        <Skeleton width="40%" height="0.75rem" borderRadius="0.25rem" />
        <SkeletonText lines={2} />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton width="30%" height="1.5rem" />
        <SkeletonAvatar size="1.5rem" />
      </div>
    </div>
  );
};

/**
 * Grid layout for skeletons
 */
export const SkeletonGrid: React.FC<{ count?: number; children: React.ReactNode; gap?: string; cols?: string }> = ({ 
  count = 6, 
  children, 
  gap = '1.5rem', 
  cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
}) => {
  return (
    <div className={`grid ${cols}`} style={{ gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {children}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Legacy CourseSkeleton specifically styled for current Course cards
 */
export const CourseSkeleton: React.FC = () => {
  return (
    <div className="theme-card backdrop-blur-sm rounded-xl overflow-hidden p-6 h-full space-y-4">
      <Skeleton height="12rem" width="100%" borderRadius="0.75rem" />
      <div className="flex justify-between items-center">
        <Skeleton width="4rem" height="1.25rem" borderRadius="0.25rem" />
        <Skeleton width="6rem" height="1.25rem" borderRadius="1rem" />
      </div>
      <Skeleton width="80%" height="1.5rem" />
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="2rem" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
      <SkeletonText lines={2} />
      <div className="pt-4">
        <Skeleton height="2.5rem" width="100%" borderRadius="0.5rem" />
      </div>
    </div>
  );
};

/**
 * Legacy TopicSkeleton specifically styled for current Topic cards
 */
export const TopicSkeleton: React.FC = () => {
  return (
    <div className="theme-card backdrop-blur-sm rounded-xl p-6 h-[200px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <Skeleton width="3rem" height="3rem" borderRadius="0.5rem" />
          <Skeleton width="2rem" height="2rem" />
        </div>
        <Skeleton width="70%" height="1.5rem" className="mb-2" />
        <SkeletonText lines={2} />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton width="5rem" height="1rem" />
        <Skeleton width="3rem" height="1rem" />
      </div>
    </div>
  );
};
