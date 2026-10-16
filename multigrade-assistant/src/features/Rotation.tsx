import { useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { cleanTopicTitle } from '../cleanTitle';
import { CircularTimer } from '../components/CircularTimer';
import { getTopic } from '../content/curriculum';
import { db } from '../db/db';
import { buildRotation, calculateRemainingMs } from '../engine/rotation';
import { beep } from '../hooks';
import { t } from '../i18n';
import { resolveL10n, type Grade, type GradeTopicMap, type Lang, type SessionMode, type Topic } from '../types';

interface RotationProps {
  lang: Lang;
  topic: Topic;
  grades: Grade[];
  periodTotal?: number;
  onPeriodChange?: (val: number) => void;
  passes?: 1 | 2;
  onPassesChange?: (val: 1 | 2) => void;
  openingMinutes?: number;
  mode?: SessionMode;
  gradeTopics?: GradeTopicMap;
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
  mode = 'theme',
  gradeTopics = {},
}: RotationProps) {
  const students = useLiveQuery(() => db.students.toArray(), [], []);
  const [manualCounts, setManualCounts] = useState<Partial<Record<Grade, number>>>({});

  // Auto-fill student counts from roster, allow manual override
  const activeStudentCounts = useMemo(() => {
    const counts: Partial<Record<Grade, number>> = {};
    for (const g of grades) {
      if (manualCounts[g] !== undefined) {
        counts[g] = manualCounts[g];
      } else {
        const rosterCount = students.filter((s) => s.grade === g).length;
        counts[g] = rosterCount;
      }
    }
    return counts;
  }, [grades, students, manualCounts]);

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

  const getTopicForGrade = useMemo(() => {
    return (g: Grade): Topic => {
      if (mode === 'multi_subject' && gradeTopics[g]) {
        return getTopic(gradeTopics[g]!);
      }
      return topic;
    };
  }, [mode, gradeTopics, topic]);

  const plan = useMemo(
    () =>
      buildRotation(
        topic,
        grades,
        total,
        openingMinutes,
        passes,
        mode === 'multi_subject' ? getTopicForGrade : undefined,
        activeStudentCounts
      ),
    [topic, grades, total, openingMinutes, passes, mode, getTopicForGrade, activeStudentCounts]
  );


  const unit = demo ? 1000 : 60000;

  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [remain, setRemain] = useState(0);

  const endAt = useRef(0);
  const lastBeepedIndex = useRef<number>(-1);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);
  const [muted, setMuted] = useState(false);
  const [visualFlash, setVisualFlash] = useState(false);
  const [wakeLockSupported] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  });


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

      // Slot has expired: trigger audio chime and visual fallback
      if (lastBeepedIndex.current !== idx) {
        if (!muted) {
          const played = beep();
          if (!played) {
            // Audio was blocked by browser autoplay policy: trigger visual flash
            setVisualFlash(true);
            setTimeout(() => setVisualFlash(false), 2000);
          }
        } else {
          // Muted: always show visual flash fallback
          setVisualFlash(true);
          setTimeout(() => setVisualFlash(false), 2000);
        }
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
  }, [running, idx, plan, muted]);


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

  const isMultiGrade = grades.length > 1;

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
            checked={muted}
            onChange={(e) => setMuted(e.target.checked)}
          />{' '}
          {muted ? '🔇' : '🔔'}{' '}
          {lang === 'hi'
            ? muted ? 'ध्वनि मूक (Muted)' : 'घंटी ध्वनि (Chime)'
            : lang === 'mr'
            ? muted ? 'ध्वनी बंद (Muted)' : 'घंटा ध्वनी (Chime)'
            : muted ? 'Chime Muted' : 'Audio Chime'}
        </label>
        <label style={{ opacity: !isMultiGrade ? 0.65 : 1 }}>
          <input
            type="checkbox"
            checked={passes === 2}
            disabled={!isMultiGrade}
            onChange={(e) => setPasses(e.target.checked ? 2 : 1)}
          />{' '}
          {lang === 'hi' ? 'दो फेरे (2 Passes)' : lang === 'mr' ? 'दोन फेऱ्या (2 Passes)' : '2 Passes'}
          {!isMultiGrade && (
            <span style={{ fontSize: '0.8rem', color: 'var(--mute)', marginLeft: 6, fontStyle: 'italic' }}>
              ({lang === 'hi' ? '२ या अधिक कक्षाओं की आवश्यकता है' : lang === 'mr' ? '२ किंवा अधिक वर्गांची आवश्यकता आहे' : 'Needs 2 or more grades'})
            </span>
          )}
        </label>
      </div>

      {/* Grade student counts bar (adaptive weighting) */}
      <div className="bar no-print" style={{ background: 'var(--card)', borderBottom: '1px solid var(--line)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
          👥 {lang === 'hi' ? 'विद्यार्थी संख्या (अनुकूलित कालखंड)' : lang === 'mr' ? 'विद्यार्थी संख्या (अनुकूलित वेळ)' : 'Student Counts (Adaptive Weighting)'}:
        </span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {grades.map((g) => {
            const count = activeStudentCounts[g] ?? 0;
            return (
              <label key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}>
                <span className="chip" style={{ background: `var(--g${g})`, color: '#fff', padding: '1px 6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  G{g}
                </span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={count}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                    setManualCounts({ ...manualCounts, [g]: val });
                  }}
                  style={{ width: 48, padding: '2px 4px', fontSize: '0.82rem', textAlign: 'center' }}
                  title={`Grade ${g} student count`}
                />
              </label>
            );
          })}
        </div>
        <span className="small" style={{ color: 'var(--mute)', marginLeft: 'auto' }}>
          {lang === 'hi' ? 'रोस्टर से स्वतः भरे; आवश्यकता अनुसार बदलें' : lang === 'mr' ? 'रोस्टरमधून स्वयंचलित; हवे असल्यास बदला' : 'Auto-filled from roster; editable'}
        </span>
      </div>


      {!wakeLockSupported && running && (
        <div
          role="note"
          style={{
            padding: '6px 12px',
            marginBottom: 10,
            background: 'var(--warnbg)',
            border: '1px solid #ffd591',
            borderRadius: 6,
            fontSize: '0.82rem',
            color: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>💡</span>
          <span>
            {lang === 'hi'
              ? 'स्क्रीन वेक-लॉक अनुपलब्ध: कृपया टैबलेट स्क्रीन को हस्तचालित रूप से चालू रखें।'
              : lang === 'mr'
              ? 'स्क्रीन वेक-लॉक उपलब्ध नाही: कृपया टॅबलेट स्क्रीन मॅन्युअली चालू ठेवा.'
              : 'Screen wake-lock unsupported on this browser: please keep screen on manually.'}
          </span>
        </div>
      )}

      {visualFlash && (
        <div
          role="alert"
          style={{
            padding: '10px 14px',
            marginBottom: 10,
            background: 'var(--acc)',
            color: '#1c2b27',
            fontWeight: 700,
            borderRadius: 8,
            textAlign: 'center',
            fontSize: '1rem',
            boxShadow: 'var(--shadow-md)',
            animation: 'pulse 1s infinite alternate',
          }}
        >
          🔔 {lang === 'hi' ? 'स्लॉट समाप्त! अगले समूह पर जाएँ।' : lang === 'mr' ? 'स्लॉट संपला! पुढील गटाकडे वळा.' : 'Slot Complete! Transition to next grade.'}
        </div>
      )}

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

      {/* Top compact timer & teaching panel */}
      <div className={`card rotation-top-panel ${visualFlash ? 'slot-transition-flash' : ''}`}>
        <div className="rotation-banner" role="status">
          <span className="rotation-badge" style={{ background: cur ? `var(--g${cur.grade})` : 'var(--board)' }}>
            {finished
              ? (lang === 'hi' ? 'पूर्ण' : lang === 'mr' ? 'पूर्ण' : 'Done')
              : cur
              ? `Grade ${cur.grade}`
              : 'Class'}
          </span>
          <span className="rotation-banner-text">
            {finished
              ? t(lang, 'done')
              : `${t(lang, 'nowTeaching')}: Grade ${cur?.grade}${cur?.pass ? ` · Pass ${cur.pass}` : ''} (${cur?.minutes} min)`}
            {cur?.topic && (
              <span className={`subject-tag tag-${cur.topic.subject}`} style={{ marginLeft: 8, fontSize: '0.75rem' }}>
                {cur.topic.subject === 'math' ? '📐' : '🌱'} {cleanTopicTitle(cur.topic.title[lang] || cur.topic.title.en)}
              </span>
            )}
          </span>
        </div>


        <div className="rotation-timer-row">
          <CircularTimer
            timeLeft={remainSeconds}
            totalTime={totalSlotSeconds}
            isRunning={running}
            grade={cur?.grade}
          />

          <div className="rotation-controls-col">
            <div className="rotation-btn-group">
              <button
                type="button"
                className="primary"
                onClick={toggle}
                style={{ minWidth: 100, minHeight: 44, fontWeight: 700 }}
              >
                {running ? t(lang, 'pause') : t(lang, 'start')}
              </button>
              <button
                type="button"
                onClick={() => idx + 1 < plan.slots.length && go(idx + 1, running)}
                disabled={idx + 1 >= plan.slots.length}
                style={{ minHeight: 44 }}
              >
                {t(lang, 'next')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFinished(false);
                  go(0, false);
                }}
                style={{ minHeight: 44 }}
              >
                {t(lang, 'reset')}
              </button>
            </div>

            {/* Compact guidance inside panel */}
            {curGradePlan && !finished && (
              <div className="rotation-cur-guidance">
                {curGradePlan.checklist && curGradePlan.checklist.length > 0 && (
                  <div className="small">
                    <b>📋 {lang === 'hi' ? 'शिक्षक जाँच सूची' : lang === 'mr' ? 'शिक्षक तपासणी' : 'Checklist'}:</b>
                    <ul style={{ margin: '4px 0', paddingLeft: 18 }}>
                      {curGradePlan.checklist.map((c, i) => (
                        <li key={i}>{resolveL10n(c, lang)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {curGradePlan.earlyFinisher && (
                  <div className="small" style={{ color: 'var(--ok)', marginTop: 4 }}>
                    <b>⭐ {lang === 'hi' ? 'जल्दी पूरा करने वालों के लिए' : lang === 'mr' ? 'लवकर पूर्ण करणाऱ्यांसाठी' : 'Early Finisher'}:</b>{' '}
                    {resolveL10n(curGradePlan.earlyFinisher, lang)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Timeline with marker for current slot */}
      <div className="rotation-timeline-card card">
        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--mute)' }}>
          ⏱️ {lang === 'hi' ? 'समयरेखा' : lang === 'mr' ? 'वेळरेषा' : 'Session Timeline'}
        </h4>
        <div className="rotation-timeline-track" role="progressbar" aria-label="Timeline progress">
          {plan.opening > 0 && (
            <div
              className={`timeline-slot timeline-opening ${!finished && running && idx === 0 && cur === undefined ? 'active-slot' : ''}`}
              style={{ width: `${(plan.opening / plan.total) * 100}%` }}
              title={`0-${plan.opening}m: Opening`}
            >
              <span className="timeline-slot-label">{plan.opening}m</span>
            </div>
          )}
          {plan.slots.map((s, i) => {
            const isCurrent = !finished && i === idx;
            return (
              <div
                key={i}
                className={`timeline-slot slot-g${s.grade} ${isCurrent ? 'active-slot' : ''}`}
                style={{
                  width: `${(s.minutes / plan.total) * 100}%`,
                  backgroundColor: `var(--g${s.grade})`,
                }}
                title={`${s.start}-${s.end}m: Grade ${s.grade}${s.pass ? ` (P${s.pass})` : ''}`}
                onClick={() => go(i, running)}
              >
                <span className="timeline-slot-label">
                  G{s.grade}{s.pass ? `·P${s.pass}` : ''}
                </span>
                {isCurrent && <span className="timeline-marker" aria-label="Current slot">▼</span>}
              </div>
            );
          })}
        </div>
        <div className="timeline-scale">
          <span>0 min</span>
          {plan.opening > 0 && <span>{plan.opening}m</span>}
          <span>{plan.total} min</span>
        </div>
      </div>

      {/* Schedule Table */}
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
                {grades.map((g) => {
                  const isLead = g === row.grade;
                  const gradeTopic = getTopicForGrade(g);
                  return isLead ? (
                    <td key={g} className="lead">
                      <b>{t(lang, 'teacherLed')}</b>
                      {mode === 'multi_subject' && (
                        <div className="small" style={{ fontSize: '0.75rem', marginTop: 2 }}>
                          {gradeTopic.subject === 'math' ? '📐' : '🌱'} {cleanTopicTitle(gradeTopic.title[lang] || gradeTopic.title.en)}
                        </div>
                      )}
                    </td>
                  ) : (
                    <td key={g}>
                      <span>{t(lang, 'selfWork')}</span>
                      {mode === 'multi_subject' && (
                        <div className="small" style={{ fontSize: '0.72rem', color: 'var(--mute)', marginTop: 2 }}>
                          {gradeTopic.subject === 'math' ? '📐' : '🌱'} {cleanTopicTitle(gradeTopic.title[lang] || gradeTopic.title.en)}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
