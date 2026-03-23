import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AchievementBadge } from './AchievementBadge';
import { RainbowConfetti } from './Confetti';

const CelebrationModal = ({ achievement, onClose, motivationalMessage }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!achievement) return null;

  const messages = motivationalMessage || [
    "Amazing work! Keep it up!",
    "You're crushing it!",
    "Consistency is key!",
    "You're unstoppable!",
    "Incredible achievement!",
  ];

  const randomMessage = Array.isArray(messages)
    ? messages[Math.floor(Math.random() * messages.length)]
    : messages;

  return (
    <>
      {/* Confetti effect */}
      <RainbowConfetti duration={2500} />

      {/* Modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/50 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
        {/* Modal content */}
        <div className="relative bg-surface rounded-3xl p-8 max-w-md w-full border border-border shadow-xl animate-scale-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-surface-hover hover:bg-border transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-text-muted" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center gap-6 py-4">
            {/* Title */}
            <h2 className="text-2xl font-bold text-center gradient-text">
              Achievement Unlocked!
            </h2>

            {/* Badge */}
            <div className="relative">
              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-3xl opacity-30 animate-pulse"
                style={{ backgroundColor: achievement.color }}
              />
              <AchievementBadge achievement={achievement} size="xl" showLabel={false} animate={true} />
            </div>

            {/* Achievement name */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-text-primary">{achievement.name}</h3>
              <p className="text-text-secondary text-sm">{randomMessage}</p>
            </div>

            {/* Action button */}
            <button
              onClick={onClose}
              className="w-full btn-primary py-3 rounded-xl font-semibold tap-scale"
            >
              Continue
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </>
  );
};

export default CelebrationModal;
