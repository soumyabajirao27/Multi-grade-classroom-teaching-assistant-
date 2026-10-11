import type { Student } from '../db/db';
import type { Grade, Status } from '../types';

interface BarChartProps {
  students: (Student & { status?: Status })[];
  grades: Grade[];
}

export function BarChart({ students, grades }: BarChartProps) {
  if (students.length === 0) return null;

  return (
    <div className="card barchart-card">
      <h4>📊 Grade-wise Mastery Overview</h4>
      <div className="barchart-container">
        {grades.map((g) => {
          const list = students.filter((s) => s.grade === g);
          const total = list.length;
          if (total === 0) return null;

          const done = list.filter((s) => s.status === 'done').length;
          const help = list.filter((s) => s.status === 'needs-help').length;
          const notStarted = total - done - help;

          const donePct = Math.round((done / total) * 100);
          const helpPct = Math.round((help / total) * 100);
          const notPct = 100 - donePct - helpPct;

          return (
            <div key={g} className="barchart-row">
              <span className="barchart-label">Grade {g} ({total})</span>
              <div className="barchart-bar">
                {donePct > 0 && (
                  <div className="bar-seg seg-done" style={{ width: `${donePct}%` }} title={`Completed: ${done}`} />
                )}
                {helpPct > 0 && (
                  <div className="bar-seg seg-help" style={{ width: `${helpPct}%` }} title={`Needs Help: ${help}`} />
                )}
                {notPct > 0 && (
                  <div className="bar-seg seg-not" style={{ width: `${notPct}%` }} title={`Not Started: ${notStarted}`} />
                )}
              </div>
              <span className="barchart-pct">{donePct}%</span>
            </div>
          );
        })}
      </div>
      <div className="barchart-legend">
        <span className="legend-item"><span className="dot dot-done" /> Completed</span>
        <span className="legend-item"><span className="dot dot-help" /> Needs Help</span>
        <span className="legend-item"><span className="dot dot-not" /> Not Started</span>
      </div>
    </div>
  );
}
