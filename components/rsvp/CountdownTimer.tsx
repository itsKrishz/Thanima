"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    function calculateTime() {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Loading / hydration placeholder
  if (!mounted || !timeLeft) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center animate-pulse opacity-60">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sargam-gold mb-4">
          Countdown to SARGAM&apos;26
        </p>
        <div className="flex gap-4">
          {["Days", "Hours", "Mins", "Secs"].map((label, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center min-w-[84px] md:min-w-[96px] rounded-2xl border border-sargam-gold/20 bg-white/70 p-4 md:p-5 shadow-sm"
            >
              <span className="font-serif text-3xl md:text-4xl font-bold text-sargam-crimson">
                00
              </span>
              <span className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-sargam-green/60 mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="mt-10 inline-block rounded-2xl border border-sargam-gold/20 bg-white/70 px-8 py-4 text-center text-base font-semibold text-sargam-gold backdrop-blur-sm">
        🎉 SARGAM&apos;26 has begun!
      </div>
    );
  }

  const timeItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sargam-gold mb-4">
        Countdown to SARGAM&apos;26
      </p>
      <div className="flex gap-4">
        {timeItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center min-w-[84px] md:min-w-[96px] rounded-2xl border border-sargam-gold/20 bg-white/75 p-4 md:p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-sargam-gold/50"
          >
            <span className="font-serif text-3xl md:text-4xl font-bold text-sargam-crimson">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-sargam-green/60 mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
