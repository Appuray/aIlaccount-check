import React, { useState, useEffect } from 'react';

interface LiveCountdownProps {
  targetDate: number | null;
}

export const LiveCountdown: React.FC<LiveCountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{d: number, h: number, m: number, s: number} | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
      
      return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate || !timeLeft) return <span>Never</span>;

  if (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) {
    return <span>Now</span>;
  }

  // Format as HH:MM:SS or DDd HH:MM:SS
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  if (timeLeft.d > 0) {
    return <span>{timeLeft.d}d {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</span>;
  }
  
  return <span>{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</span>;
};
