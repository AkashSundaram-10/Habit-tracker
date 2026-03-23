import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Custom tooltip component with theme support
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-text-primary mb-1">{label}</p>
        <p className="text-lg font-bold text-accent">
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

// Gradient Area Chart for weekly progress
export const WeeklyProgressChart = ({ data, height = 250 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
        <XAxis
          dataKey="day"
          stroke="var(--color-text-muted)"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="var(--color-text-muted)"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="completion"
          stroke="var(--color-accent)"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorProgress)"
          animationDuration={1000}
          animationBegin={0}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Enhanced Bar Chart with gradient bars
export const CompletionBarChart = ({ data, height = 200, gradientColors = ['#6366F1', '#EC4899'] }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={1} />
            <stop offset="100%" stopColor={gradientColors[1]} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
        <XAxis
          dataKey="label"
          stroke="var(--color-text-muted)"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="var(--color-text-muted)"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          fill="url(#barGradient)"
          radius={[6, 6, 0, 0]}
          animationDuration={1000}
          animationBegin={0}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Multi-colored bar chart for habit comparison
export const HabitComparisonChart = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
        <XAxis
          dataKey="name"
          stroke="var(--color-text-muted)"
          fontSize={11}
          tickLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke="var(--color-text-muted)"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="completion"
          radius={[6, 6, 0, 0]}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || 'var(--color-accent)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Mini sparkline chart for cards
export const SparklineChart = ({ data, color = 'var(--color-accent)', height = 60 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sparkGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.6} />
            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#sparkGradient-${color})`}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default WeeklyProgressChart;
