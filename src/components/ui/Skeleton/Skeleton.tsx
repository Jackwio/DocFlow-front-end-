/**
 * Skeleton component for loading placeholders
 * Provides animated loading states that match content layout
 */

import clsx from 'clsx';

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Shape of the skeleton */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Custom class name */
  className?: string;
  /** Whether to animate */
  animate?: boolean;
}

export function Skeleton({
  width,
  height,
  variant = 'rectangular',
  className,
  animate = true,
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  
  if (width !== undefined) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  
  if (height !== undefined) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      className={clsx(
        'bg-gray-200',
        {
          'rounded-full': variant === 'circular',
          'rounded': variant === 'rectangular',
          'rounded-md h-4': variant === 'text',
          'animate-pulse': animate,
        },
        className
      )}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
}

/**
 * Skeleton text line component
 */
export function SkeletonText({ 
  lines = 1, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton card component
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={clsx('p-4 bg-white rounded-lg shadow', className)}>
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

/**
 * Skeleton document list item component
 */
export function SkeletonDocumentItem({ className }: { className?: string }) {
  return (
    <div className={clsx('p-4 bg-white rounded-lg border border-gray-200', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton variant="text" width="70%" className="mb-2" />
          <Skeleton variant="text" width="40%" />
        </div>
        <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
        <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
        <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton detail panel component
 */
export function SkeletonDetailPanel({ className }: { className?: string }) {
  return (
    <div className={clsx('p-6 bg-white', className)}>
      {/* Header */}
      <div className="mb-6">
        <Skeleton variant="text" width="60%" className="mb-2 h-6" />
        <Skeleton variant="text" width="40%" />
      </div>

      {/* Metadata Section */}
      <div className="mb-6">
        <Skeleton variant="text" width="30%" className="mb-3 h-5" />
        <div className="space-y-2">
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>

      {/* Classification Results */}
      <div className="mb-6">
        <Skeleton variant="text" width="40%" className="mb-3 h-5" />
        <div className="space-y-3">
          <div>
            <Skeleton variant="text" width="50%" className="mb-2" />
            <Skeleton variant="rectangular" height={8} width="100%" className="rounded-full" />
          </div>
          <div>
            <Skeleton variant="text" width="50%" className="mb-2" />
            <Skeleton variant="rectangular" height={8} width="100%" className="rounded-full" />
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <Skeleton variant="text" width="20%" className="mb-3 h-5" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton variant="rectangular" width={80} height={28} className="rounded-full" />
          <Skeleton variant="rectangular" width={100} height={28} className="rounded-full" />
          <Skeleton variant="rectangular" width={90} height={28} className="rounded-full" />
        </div>
      </div>

      {/* Timeline */}
      <div>
        <Skeleton variant="text" width="35%" className="mb-3 h-5" />
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1">
              <Skeleton variant="text" width="60%" className="mb-1" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1">
              <Skeleton variant="text" width="60%" className="mb-1" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
