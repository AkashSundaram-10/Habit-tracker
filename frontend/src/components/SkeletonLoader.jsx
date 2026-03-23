import React from 'react';

// Base skeleton with shimmer effect (theme-aware)
const Skeleton = ({ className = '', variant = 'rounded' }) => {
  const variantClasses = {
    rounded: 'rounded-lg',
    circle: 'rounded-full',
    rectangle: 'rounded',
    pill: 'rounded-full',
  };

  return (
    <div
      className={`bg-surface-hover shimmer ${variantClasses[variant]} ${className}`}
    />
  );
};

// Skeleton for habit cards
export const SkeletonHabitCard = () => {
  return (
    <div className="card p-5 animate-fade-in-up">
      <div className="flex items-start gap-4">
        <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton variant="circle" className="w-8 h-8 flex-shrink-0" />
      </div>
    </div>
  );
};

// Skeleton for stat cards
export const SkeletonStatCard = () => {
  return (
    <div className="card p-5 animate-scale-in">
      <div className="space-y-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

// Skeleton for charts
export const SkeletonChart = ({ height = 'h-64' }) => {
  return (
    <div className={`card p-5 ${height} animate-scale-in`}>
      <div className="space-y-4 h-full">
        <Skeleton className="h-5 w-40" />
        <div className="h-full flex items-end gap-2 pb-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1"
              style={{ height: `${Math.random() * 60 + 40}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton for weekly tracker table
export const SkeletonWeeklyTracker = () => {
  return (
    <div className="card p-5 animate-fade-in-up">
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="w-32 h-10" />
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="flex-1 h-10" />
          ))}
        </div>
        {[...Array(4)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            <Skeleton className="w-32 h-12" />
            {[...Array(7)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="flex-1 h-12" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for settings habit list
export const SkeletonSettingsItem = () => {
  return (
    <div className="card p-4 flex items-center gap-4 animate-fade-in-up">
      <Skeleton variant="circle" className="w-10 h-10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-20 h-8" />
      </div>
    </div>
  );
};

// Skeleton for quote card
export const SkeletonQuote = () => {
  return (
    <div className="card p-5 animate-fade-in-up">
      <div className="space-y-4">
        <Skeleton variant="circle" className="w-8 h-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-32 ml-auto" />
      </div>
    </div>
  );
};

// Loading screen with multiple skeletons
export const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const components = {
    card: SkeletonHabitCard,
    stat: SkeletonStatCard,
    chart: SkeletonChart,
    settings: SkeletonSettingsItem,
  };

  const Component = components[type] || SkeletonHabitCard;

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
          <Component />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
