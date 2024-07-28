'use client';
import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
  title: string;
  timezoneOffset: number; // timezone offset in minutes
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, title, timezoneOffset }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(calculateTimeLeft(targetDate, timezoneOffset));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate, timezoneOffset));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, timezoneOffset]);

  function calculateTimeLeft(targetDate: Date, timezoneOffset: number) {
    const adjustedTargetDate = new Date(targetDate.getTime() - timezoneOffset * 60000);
    const difference = +adjustedTargetDate - +new Date();
    let timeLeft: { days: number; hours: number; minutes: number; seconds: number } | null = null;

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  return (
    <div className="countdown">
      <h3>{title}</h3>
      {timeLeft ? (
        <div>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      ) : (
        <div>Time is up!</div>
      )}
    </div>
  );
};

export default Countdown;
