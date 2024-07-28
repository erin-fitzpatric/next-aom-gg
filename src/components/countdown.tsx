'use client';

import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
  title: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, title }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    // Get the client's timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();
    const adjustedTargetDate = new Date(targetDate.getTime() - timezoneOffset * 60000);

    function calculateTimeLeft() {
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

      setTimeLeft(timeLeft);
    }

    // Update the countdown every second
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

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
