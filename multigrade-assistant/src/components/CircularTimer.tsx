interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
}

export function CircularTimer({ timeLeft, totalTime, isRunning }: CircularTimerProps) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const ss = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="circular-timer-container">
      <svg className="timer-svg" width="220" height="220" viewBox="0 0 220 220">
        <circle className="timer-bg" cx="110" cy="110" r={radius} strokeWidth="12" />
        <circle
          className={`timer-progress ${isRunning ? 'pulse' : ''}`}
          cx="110"
          cy="110"
          r={radius}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 110 110)"
        />
      </svg>
      <div className="timer-display">
        <div className="clock">{mm}:{ss}</div>
      </div>
    </div>
  );
}
