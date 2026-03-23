import React from 'react';
import { Trophy, Flame, Star, Target, Award, Zap } from 'lucide-react';

// Achievement definitions
export const ACHIEVEMENTS = {
  // Streak milestones
  STREAK_3: { id: 'streak_3', name: '3 Day Streak', icon: Flame, color: '#F59E0B', threshold: 3 },
  STREAK_7: { id: 'streak_7', name: '7 Day Streak', icon: Flame, color: '#EF4444', threshold: 7 },
  STREAK_14: { id: 'streak_14', name: '2 Week Streak', icon: Flame, color: '#DC2626', threshold: 14 },
  STREAK_30: { id: 'streak_30', name: '30 Day Streak', icon: Trophy, color: '#A855F7', threshold: 30 },
  STREAK_60: { id: 'streak_60', name: '60 Day Champion', icon: Trophy, color: '#EC4899', threshold: 60 },
  STREAK_100: { id: 'streak_100', name: '100 Day Legend', icon: Trophy, color: '#3B82F6', threshold: 100 },

  // Completion milestones
  COMPLETION_50: { id: 'completion_50', name: 'Half Way There', icon: Target, color: '#10B981', threshold: 50 },
  COMPLETION_75: { id: 'completion_75', name: 'Almost Perfect', icon: Star, color: '#F59E0B', threshold: 75 },
  COMPLETION_90: { id: 'completion_90', name: 'Overachiever', icon: Award, color: '#8B5CF6', threshold: 90 },
  COMPLETION_100: { id: 'completion_100', name: 'Perfect Day', icon: Zap, color: '#EC4899', threshold: 100 },
};

// Badge component
export const AchievementBadge = ({ achievement, size = 'md', showLabel = true, animate = false }) => {
  const Icon = achievement.icon;

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40,
    xl: 56,
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${animate ? 'animate-scaleIn' : ''}`}>
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center relative ${
          animate ? 'animate-pulse-glow' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, ${achievement.color}, ${achievement.color}dd)`,
          boxShadow: `0 0 30px ${achievement.color}66`,
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full ring-2 ring-opacity-50"
          style={{ ringColor: achievement.color }}
        />

        {/* Icon */}
        <Icon size={iconSizes[size]} className="text-white drop-shadow-lg" />
      </div>

      {showLabel && (
        <p className="text-sm font-semibold text-gray-200 text-center">
          {achievement.name}
        </p>
      )}
    </div>
  );
};

// Badge grid display
export const AchievementGrid = ({ earnedAchievements = [], onClick }) => {
  const allAchievements = Object.values(ACHIEVEMENTS);

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {allAchievements.map((achievement) => {
        const isEarned = earnedAchievements.includes(achievement.id);

        return (
          <button
            key={achievement.id}
            onClick={() => onClick?.(achievement)}
            className={`transition-all duration-200 ${
              isEarned ? 'opacity-100 scale-100' : 'opacity-30 scale-95 grayscale'
            } hover:scale-105`}
          >
            <AchievementBadge achievement={achievement} size="md" showLabel={true} />
          </button>
        );
      })}
    </div>
  );
};

// Mini badge for inline display
export const MiniBadge = ({ achievement }) => {
  const Icon = achievement.icon;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold animate-scaleIn"
      style={{
        background: `linear-gradient(135deg, ${achievement.color}33, ${achievement.color}22)`,
        color: achievement.color,
        border: `1px solid ${achievement.color}44`,
      }}
    >
      <Icon size={14} />
      <span>{achievement.name}</span>
    </div>
  );
};

// Check if an achievement was just earned
export const checkNewAchievements = (previousValue, currentValue, type = 'streak') => {
  const achievements = Object.values(ACHIEVEMENTS);
  const newAchievements = [];

  achievements.forEach((achievement) => {
    if (achievement.id.startsWith(type)) {
      if (currentValue >= achievement.threshold && previousValue < achievement.threshold) {
        newAchievements.push(achievement);
      }
    }
  });

  return newAchievements;
};

// Get all earned achievements based on streak
export const getEarnedStreakAchievements = (streak) => {
  return Object.values(ACHIEVEMENTS)
    .filter((a) => a.id.startsWith('streak') && streak >= a.threshold)
    .map((a) => a.id);
};

// Get all earned achievements based on completion percentage
export const getEarnedCompletionAchievements = (percentage) => {
  return Object.values(ACHIEVEMENTS)
    .filter((a) => a.id.startsWith('completion') && percentage >= a.threshold)
    .map((a) => a.id);
};

export default AchievementBadge;
