import { useEffect, useMemo, useRef, useState } from 'react';
import { CircularTimer } from '../components/CircularTimer';
import { buildRotation, calculateRemainingMs } from '../engine/rotation';
import { beep } from '../hooks';
import { t } from '../i18n';
import { resolveL10n, type Grade, type Lang, type Topic } from '../types';

interface RotationProps {
  lang: Lang;
  topic: Topic;
  grades: Grade[];
  periodTotal?: number;
  onPeriodChange?: (val: number) => void;
  passes?: 1 | 2;
  onPassesChange?: (val: 1 | 2) => void;
  openingMinutes?: number;
}

export function Rotation({
  lang,
  topic,
  grades,
  periodTotal,
  onPeriodChange,
  passes: propPasses,
  onPassesChange,
  openingMinutes = 5,
}: RotationProps) {
  const [localTotal, setLocalTotal] = useState(40);
  const total = periodTotal !== undefined ? periodTotal : localTotal;
  const setTotal = (val: number) => {
    if (onPeriodChange) onPeriodChange(val);
    else setLocalTotal(val);
  };

  const [localPasses, setLocalPasses] = useState<1 | 2>(1);
  const rawPasses = propPasses !== undefined ? propPasses : localPasses;
  const setPasses = (val: 1 | 2) => {
    if (onPassesChange) onPassesChange(val);
    else setLocalPasses(val);
  };

  const passes: 1 | 2 = grades.length <= 1 ? 1 : rawPasses;
  const [demo, setDemo] = useState(false);

  const plan = useMemo(
    () => buildRotation(topic, grades, total, openingMinutes, passes),
    [topic, grades, total, openingMinutes, passes]
  );
  const unit = demo ? 1000 : 60000;

  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [remain, setRemain] = useState(0);

  const endAt = useRef(0);
  const lastBeepedIndex = useRef<number>(-1);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);

  const slotMs = (i: number) => (plan.slots[i]?.minutes ?? 0) * unit;

  useEffect(() => {
    setIdx(0);
    setRunning(false);
    setFinished(false);
    lastBeepedIndex.current = -1;
    setRemain(slotMs(0));
    // eslint-disable-next-line
  }, [plan, demo]);

  const go = (i: number, keepRunning: boolean) => {
    setIdx(i);
    const ms = slotMs(i);
    setRemain(ms);
    endAt.current = Date.now() + ms;
    setRunning(keepRunning);
  };

  useEffect(() => {
    if (!running) return;
    const timerId = setInterval(() => {
      const { remainingMs, isExpired } = calculateRemainingMs(endAt.current, Date.now());
      if (!isExpired) {
        setRemain(remainingMs);
        return;
      }

      // Slot has expired
      if (lastBeepedIndex.current !== idx) {
        beep();
        lastBeepedIndex.current = idx;
      }

      if (idx + 1 < plan.slots.length) {
        go(idx + 1, true);
      } else {
        setRunning(false);
        setFinished(true);
        setRemain(0);
      }
    }, 200);

    return () => clearInterval(timerId);
    // eslint-disable-next-line
  }, [running, idx, plan]);

  useEffect(() => {
    // Keep tablet screen awake while timer runs
    const nav = navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    if (running) {
      nav.wakeLock?.request('screen').then((l) => { wake.current = l; }).catch(() => {});
    } else {
      void wake.current?.release().catch(() => {});
    }
  }, [running]);

  if (!grades.length) return <p>{t(lang, 'noGrades')}</p>;

  const cur = plan.slots[idx];
  const curGradePlan = cur ? topic.grades[cur.grade] : undefined;

  const toggle = () => {
    if (running) {
      setRunning(false);
    } else {
      setFinished(false);
      endAt.current = Date.now() + remain;
      setRunning(true);
    }
  };

  const totalSlotSeconds = (plan.slots[idx]?.minutes ?? 1) * (demo ? 1 : 60);
  const remainSeconds = Math.max(0, Math.ceil(remain / 1000));

  const announcement = finished
    ? (lang === 'hi' ? 'कालांश समाप्त हो गया।' : lang === 'mr' ? 'तासिका पूर्ण झाली.' : 'Period finished.')
    : `${t(lang, 'nowTeaching')}: Grade ${cur?.grade}${cur?.pass ? ` (Pass ${cur.pass})` : ''}`;

  return (
    <div>
      {/* Screen reader polite announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="bar no-print">
        <label>
          {t(lang, 'period')}:{' '}
          <input
            type="number"
            min={10}
            max={120}
            value={total}
            onChange={(e) => setTotal(Math.max(10, Number(e.target.value) || 40))}
            style={{ width: 80 }}
            aria-label={t(lang, 'period')}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={demo}
            onChange={(e) => setDemo(e.target.checked)}
          />{' '}
          {t(lang, 'demo')}
        </label>
        <label>
          <input
            type="checkbox"
            checked={passes === 2}
            onChange={(e) => setPasses(e.target.checked ? 2 : 1)}
          />{' '}
          {lang === 'hi' ? 'दो फेरे (2 Passes)' : lang === 'mr' ? 'दोन फेऱ्या (2 Passes)' : '2 Passes'}
        </label>
      </div>

      {plan.warnings.length > 0 && (
        <div className="warn" role="alert">
          <b>{t(lang, 'warnings')}</b>
          <ul>
            {plan.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card timer">
        <div className="small">
          {finished
            ? t(lang, 'done')
            : `${t(lang, 'nowTeaching')}: Grade ${cur?.grade}${cur?.pass ? ` · Pass ${cur.pass}` : ''}`}
        </div>
        <CircularTimer timeLeft={remainSeconds} totalTime={totalSlotSeconds} isRunning={running} />
        <div className="bar" style={{ justifyContent: 'center' }}>
          <button type="button" className="primary" onClick={toggle} style={{ minWidth: 90 }}>
            {running ? t(lang, 'pause') : t(lang, 'start')}
          </button>
          <button
            type="button"
            onClick={() => idx + 1 < plan.slots.length && go(idx + 1, running)}
            disabled={idx + 1 >= plan.slots.length}
          >
            {t(lang, 'next')}
          </button>
          <button
            type="button"
            onClick={() => {
              setFinished(false);
              go(0, false);
            }}
          >
            {t(lang, 'reset')}
          </button>
        </div>

        {/* Active grade guidance */}
        {curGradePlan && !finished && (
          <div style={{ marginTop: 14, textAlign: 'left', borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            {curGradePlan.checklist && curGradePlan.checklist.length > 0 && (
              <div className="small" style={{ marginBottom: 6 }}>
                <b>📋 {lang === 'hi' ? 'शिक्षक जाँच सूची' : lang === 'mr' ? 'शिक्षक तपासणी' : 'Checklist'}:</b>
                <ul style={{ margin: '4px 0', paddingLeft: 18 }}>
                  {curGradePlan.checklist.map((c, i) => (
                    <li key={i}>{resolveL10n(c, lang)}</li>
                  ))}
                </ul>
              </div>
            )}
            {curGradePlan.earlyFinisher && (
              <div className="small" style={{ color: 'var(--ok)' }}>
                <b>⭐ {lang === 'hi' ? 'जल्दी पूरा करने वालों के लिए' : lang === 'mr' ? 'लवकर पूर्ण करणाऱ्यांसाठी' : 'Early Finisher'}:</b>{' '}
                {resolveL10n(curGradePlan.earlyFinisher, lang)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>{t(lang, 'minutes')}</th>
              {grades.map((g) => (
                <th key={g}>Grade {g}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plan.opening > 0 && (
              <tr>
                <td>0–{plan.opening}</td>
                <td colSpan={grades.length}>{t(lang, 'opening')}</td>
              </tr>
            )}
            {plan.slots.map((row, i) => (
              <tr key={i} className={running && i === idx ? 'now' : ''}>
                <td>
                  {row.start}–{row.end}
                  {row.pass ? ` (P${row.pass})` : ''}
                </td>
                {grades.map((g) =>
                  g === row.grade ? (
                    <td key={g} className="lead">
                      {t(lang, 'teacherLed')}
                    </td>
                  ) : (
                    <td key={g}>{t(lang, 'selfWork')}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
