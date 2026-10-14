import type { Grade } from '../types';

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  grade?: Grade;
}

const GRADE_COLORS: Record<Grade, string> = {
  1: 'var(--g1, #c0392b)',
  2: 'var(--g2, #d68910)',
  3: 'var(--g3, #1e8449)',
  4: 'var(--g4, #2471a3)',
  5: 'var(--g5, #7d3c98)',
};

export function CircularTimer({ timeLeft, totalTime, isRunning, grade }: CircularTimerProps) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  // Arc depletes as time runs down: fraction of time remaining
  const remainingFraction = totalTime > 0 ? Math.max(0, Math.min(1, timeLeft / totalTime)) : 0;
  const strokeDashoffset = circumference * (1 - remainingFraction);

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const ss = (timeLeft % 60).toString().padStart(2, '0');

  const strokeColor = grade ? GRADE_COLORS[grade] : 'var(--board)';

  return (
    <div className="circular-timer-container">
      <svg className="timer-svg" width="220" height="220" viewBox="0 0 220 220" role="img" aria-label={`Timer: ${mm} minutes ${ss} seconds remaining`}>
        <circle className="timer-bg" cx="110" cy="110" r={radius} strokeWidth="12" />
        <circle
          className={`timer-progress ${isRunning ? 'pulse' : ''}`}
          cx="110"
          cy="110"
          r={radius}
          strokeWidth="12"
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 110 110)"
          style={{ stroke: strokeColor }}
        />
      </svg>
      <div className="timer-display">
        <div className="clock">{mm}:{ss}</div>
      </div>
    </div>
  );
}
