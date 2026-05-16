import React, { useState, useEffect } from 'react';
import { getTimeLeft, formatTime } from '../utils/time';
import { useStore } from '../store';

interface TimerDisplayProps {
  resetAt: number;
  id: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ resetAt, id }) => {
  const resetAccount = useStore(state => state.resetAccount);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(resetAt));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeLeft(resetAt);
      if (!remaining) {
        clearInterval(timer);
        resetAccount(id);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resetAt, id, resetAccount]);

  if (!timeLeft) return null;

  return (
    <div className="text-center">
      <span className="text-lg font-medium text-[#D97706]">
        {formatTime(timeLeft.h, timeLeft.m, timeLeft.s)}
      </span>
      <p className="text-[10px] text-[#A8A29E] mt-0.5">until reset</p>
    </div>
  );
};