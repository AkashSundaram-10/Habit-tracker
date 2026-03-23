import React from 'react';

// Base card component with theme support
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const variantClasses = {
    default: 'card',
    elevated: 'card shadow-md',
    floating: 'card shadow-lg',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverClasses = hover ? 'hover-lift cursor-pointer' : '';

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverClasses}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Stat card for displaying metrics
export const StatCard = ({ icon: Icon, label, value, color = 'var(--color-accent)', trend, subtext }) => {
  return (
    <Card variant="elevated" padding="lg" hover className="animate-scale-in">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="p-3 rounded-xl flex items-center justify-center"
          style={{
            background: `${color}20`,
          }}
        >
          <Icon size={24} style={{ color }} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-text-primary">{value}</p>
            {trend && (
              <span
                className={`text-sm font-semibold ${
                  trend > 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-text-muted mt-1">{subtext}</p>}
        </div>
      </div>
    </Card>
  );
};

// Gradient card for hero sections
export const GradientCard = ({ children, gradient = 'accent', className = '', ...props }) => {
  const gradients = {
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
  };

  return (
    <div
      className={`rounded-2xl ${gradients[gradient]} p-6 shadow-md text-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
