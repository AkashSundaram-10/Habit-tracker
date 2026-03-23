import React, { useEffect, useState } from 'react';

const Confetti = ({ color = '#8B5CF6', duration = 1500, particleCount = 30, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 200,
      size: Math.random() * 6 + 4,
      rotation: Math.random() * 360,
      speedX: (Math.random() - 0.5) * 100,
    }));

    setParticles(newParticles);

    // Auto cleanup after animation
    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [particleCount, duration, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${duration}ms`,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

// Confetti wrapper with trigger
export const ConfettiTrigger = ({ trigger, color, children }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true);
    }
  }, [trigger]);

  return (
    <>
      {children}
      {showConfetti && (
        <Confetti
          color={color}
          onComplete={() => setShowConfetti(false)}
        />
      )}
    </>
  );
};

// Multi-color confetti for special celebrations
export const RainbowConfetti = ({ duration = 2000, onComplete }) => {
  const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 300,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${duration}ms`,
            transform: `rotate(${particle.rotation}deg)`,
            boxShadow: `0 0 10px ${particle.color}`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
