import React from 'react';
import { Pause, Infinity as InfinityIcon } from 'lucide-react';

interface CircularTimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  enabled: boolean;
  isPaused: boolean;
  isRevealed: boolean;
  compact?: boolean;
  onTogglePause?: () => void;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  totalSeconds,
  remainingSeconds,
  enabled,
  isPaused,
  isRevealed,
  compact = false,
  onTogglePause,
}) => {
  const radius = compact ? 26 : 38;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(totalSeconds, 1);
  const progress = enabled ? Math.max(0, Math.min(1, remainingSeconds / safeTotal)) : 1;
  const strokeDashoffset = circumference * (1 - progress);

  const isUrgent = enabled && !isRevealed && remainingSeconds <= 5 && remainingSeconds > 0;
  const isWarning = enabled && !isRevealed && remainingSeconds <= 10 && remainingSeconds > 5;

  let strokeColor = '#F2B705';
  if (isRevealed) {
    strokeColor = '#34D399';
  } else if (isUrgent) {
    strokeColor = '#EF4444';
  } else if (isWarning) {
    strokeColor = '#F59E0B';
  }

  const containerSize = compact
    ? 'h-13 w-13 sm:h-16 sm:w-16'
    : 'h-14 w-14 min-[420px]:h-16 min-[420px]:w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24';
  const svgSize = compact
    ? 'h-12 w-12 sm:h-14 sm:w-14'
    : 'h-13 w-13 min-[420px]:h-14 min-[420px]:w-14 sm:h-18 sm:w-18 lg:h-22 lg:w-22';
  const viewBox = compact ? '0 0 64 64' : '0 0 92 92';
  const center = compact ? 32 : 46;
  const strokeWidth = compact ? 5 : 7;

  return (
    <button
      type="button"
      onClick={onTogglePause}
      disabled={!enabled || isRevealed}
      title={
        !enabled
          ? 'Timer dimatikan'
          : isRevealed
            ? 'Jawaban sudah dibuka'
            : isPaused
              ? 'Klik untuk melanjutkan timer (P)'
              : 'Klik untuk menjeda timer (P)'
      }
      className={`group relative flex ${containerSize} shrink-0 items-center justify-center rounded-full bg-[#0F1B3D]/95 shadow-xl ring-2 transition-transform active:scale-95 ${
        isUrgent
          ? 'ring-[#EF4444] scale-105'
          : isPaused
            ? 'ring-[#F2B705]/80'
            : 'ring-white/20 hover:ring-[#F2B705]'
      }`}
    >
      <svg className={`${svgSize} -rotate-90 transform`} viewBox={viewBox}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {!enabled ? (
          <>
            <InfinityIcon className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-6 sm:w-6'} text-[#F2B705]`} />
            <span className="text-[8px] sm:text-[10px] font-semibold text-slate-300">Bebas</span>
          </>
        ) : isPaused && !isRevealed ? (
          <>
            <Pause className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} text-[#F2B705]`} />
            <span className="font-mono-tabular text-[9px] sm:text-xs font-bold text-[#FFFDF7]">
              {remainingSeconds}d
            </span>
          </>
        ) : (
          <>
            <span
              className={`font-mono-tabular ${
                compact
                  ? 'text-base sm:text-xl'
                  : 'text-base min-[420px]:text-lg sm:text-2xl lg:text-3xl'
              } font-extrabold leading-none ${
                isUrgent ? 'text-[#FF6B81]' : 'text-[#FFFDF7]'
              }`}
            >
              {remainingSeconds}
            </span>
            <span className="text-[8px] sm:text-[11px] font-medium text-slate-300 leading-tight">
              dtk
            </span>
          </>
        )}
      </div>
    </button>
  );
};
