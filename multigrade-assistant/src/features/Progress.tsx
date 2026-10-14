import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart } from '../components/BarChart';
import { addStudent, canUndo, db, exportAll, importAll, removeStudent, setStatus, undoLast } from '../db/db';
import { suggestTier, summarize } from '../engine/progress';
import { t } from '../i18n';
import { GRADES, type Grade, type Lang, type Status, type Topic } from '../types';

const STATUSES: Status[] = ['not-started', 'needs-help', 'done'];

export function Progress({ lang, topic, grades }: { lang: Lang; topic: Topic; grades: Grade[] }) {
  const students = useLiveQuery(() => db.students.toArray(), [], []);
  const records = useLiveQuery(() => db.records.where('topicId').equals(topic.id).toArray(), [topic.id], []);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(grades[0] ?? 1);
  const [expandedHistory, setExpandedHistory] = useState<Record<number, boolean>>({});
  const [, setUndoTick] = useState(0);

  const hist = (id: number) => records.filter((r) => r.studentId === id);
  const latest = new Map<number, Status>();
  for (const s of students) {
    const h = [...hist(s.id!)].sort((a, b) => a.updatedAt - b.updatedAt);
    if (h.length) latest.set(s.id!, h[h.length - 1].status);
  }
  const summary = summarize(students.map((s) => ({ id: s.id!, grade: s.grade })), latest, [...grades].sort());

  const enrichedStudents = students.map((s) => ({
    ...s,
    status: latest.get(s.id!) ?? 'not-started',
  }));

  const backup = async () => {
    const url = URL.createObjectURL(new Blob([await exportAll()], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'multigrade-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const restore = async (f?: File) => {
    if (!f) return;
    try {
      await importAll(await f.text());
    } catch (err: unknown) {
      alert((err as Error).message || 'Invalid backup file');
    }
  };

  const exportClassReport = (targetGrade?: Grade) => {
    const list = targetGrade !== undefined ? students.filter((s) => s.grade === targetGrade) : students;
    const rows = ['Date,Topic,Grade,Student,Status,Score'];
    for (const s of list) {
      const h = [...hist(s.id!)].sort((a, b) => a.updatedAt - b.updatedAt);
      const last = h[h.length - 1];
      const dateStr = last ? new Date(last.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const statusStr = last ? last.status : 'not-started';
      const scoreStr = last?.score !== undefined ? String(last.score) : '';
      rows.push([
        `"${dateStr}"`,
        `"${topic.id}"`,
        s.grade,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${statusStr}"`,
        scoreStr,
      ].join(','));
    }
    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = targetGrade !== undefined
      ? `grade-${targetGrade}-${topic.id}-progress.csv`
      : `class-report-${topic.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleStatusChange = async (studentId: number, status: Status, score?: number) => {
    await setStatus(studentId, topic.id, status, score);
    setUndoTick((t) => t + 1);
  };

  const handleUndo = async () => {
    await undoLast();
    setUndoTick((t) => t + 1);
  };

  const toggleHistory = (studentId: number) => {
    setExpandedHistory((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const hasStudents = students.length > 0;
  const filteredStudents = students.filter((s) => grades.includes(s.grade));

  return (
    <div>
      {/* Add student bar: focused/highlighted when empty */}
      <form
        className={`bar ${!hasStudents ? 'highlight-add-bar' : ''}`}
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          void addStudent(name.trim(), grade);
          setName('');
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t(lang, 'name')}
          aria-label={t(lang, 'name')}
          autoFocus={!hasStudents}
        />
        <select
          value={grade}
          onChange={(e) => setGrade(Number(e.target.value) as Grade)}
          aria-label={t(lang, 'grades')}
        >
          {GRADES.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
        <button className="primary" type="submit">
          {t(lang, 'addStudent')}
        </button>
      </form>

      {!hasStudents ? (
        <div className="card empty-progress-state" style={{ textAlign: 'center', padding: '40px 20px', marginTop: 16 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }} aria-hidden="true">
            🌱
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>
            {lang === 'hi' ? 'कोई विद्यार्थी नहीं जोड़ा गया' : lang === 'mr' ? 'अद्याप कोणतेही विद्यार्थी नाहीत' : 'No Students Added Yet'}
          </h3>
          <p style={{ color: 'var(--mute)', maxWidth: 460, margin: '0 auto 16px auto', fontSize: '0.95rem' }}>
            {t(lang, 'emptyProgress')}
          </p>
        </div>
      ) : (
        <>
          <BarChart students={enrichedStudents} grades={[...grades].sort()} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ margin: 0 }}>{t(lang, 'summary')}</h3>
              <button
                type="button"
                className="primary"
                onClick={() => exportClassReport()}
                disabled={!hasStudents}
                style={{ fontSize: '0.85rem', padding: '4px 10px' }}
                title="Export CSV: Date, Topic, Grade, Student, Status, Score"
              >
                📊 {lang === 'hi' ? 'कक्षा रिपोर्ट निर्यात (CSV)' : lang === 'mr' ? 'वर्ग अहवाल निर्यात (CSV)' : 'Export Class Report (CSV)'}
              </button>
            </div>
            {canUndo() && (
              <button type="button" onClick={handleUndo} style={{ fontSize: '0.88rem', padding: '4px 10px' }}>
                ↩️ {lang === 'hi' ? 'अंतिम क्रिया पूर्ववत करें (Undo)' : lang === 'mr' ? 'शेवटची कृती मागे घ्या (Undo)' : 'Undo Last Change'}
              </button>
            )}
          </div>

          {/* Single summary strip per selected grade */}
          <div className="sumgrid">
            {summary.map((s) => (
              <div key={s.grade} className={`card g${s.grade}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b>Grade {s.grade}</b>
                  <button
                    type="button"
                    onClick={() => exportClassReport(s.grade as Grade)}
                    disabled={s.total === 0}
                    title="Export CSV"
                    style={{ fontSize: '0.78rem', padding: '2px 6px', background: 'none', border: '1px solid var(--line)' }}
                  >
                    📥 CSV
                  </button>
                </div>
                <div className="meter" aria-label={`${s.done}/${s.total}`}>
                  <span style={{ width: `${s.total ? (100 * s.done) / s.total : 0}%` }} />
                </div>
                <div className="small">
                  {s.done}/{s.total} {t(lang, 'st_done')} · {s.needsHelp} {t(lang, 'st_needs-help')}
                </div>
              </div>
            ))}
          </div>

          {/* Unified student roster */}
          <section className="card" style={{ marginTop: 16 }}>
            <h3 style={{ margin: '0 0 12px 0' }}>
              👥 {lang === 'hi' ? 'विद्यार्थी नामावली एवं स्थिति' : lang === 'mr' ? 'विद्यार्थी यादी व स्थिती' : 'Student Roster & Status'}
            </h3>
            {filteredStudents.length === 0 ? (
              <p style={{ color: 'var(--mute)' }}>
                {lang === 'hi' ? 'चयनित कक्षाओं में कोई विद्यार्थी नहीं है।' : lang === 'mr' ? 'निवडलेल्या इयत्तांमध्ये विद्यार्थी नाहीत.' : 'No students in currently selected grades.'}
              </p>
            ) : (
              filteredStudents.map((k) => {
                const h = [...hist(k.id!)].sort((a, b) => b.updatedAt - a.updatedAt);
                const cur = latest.get(k.id!) ?? 'not-started';
                const lastScore = h[0]?.score;
                const isExpanded = Boolean(expandedHistory[k.id!]);

                return (
                  <div key={k.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 8, marginBottom: 8 }}>
                    <div className="row" style={{ alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <span
                        className="who"
                        style={{
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          minWidth: 150,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: `var(--g${k.grade})`,
                            color: '#fff',
                            fontWeight: 700,
                          }}
                        >
                          G{k.grade}
                        </span>
                        {k.name}
                      </span>
                      <span className="seg" role="group" aria-label={k.name}>
                        {STATUSES.map((st) => {
                          const icon = st === 'done' ? '✓ ' : st === 'needs-help' ? '⚠️ ' : '○ ';
                          return (
                            <button
                              key={st}
                              className={`stbtn ${st} ${cur === st ? 'on' : ''}`}
                              aria-pressed={cur === st}
                              onClick={() => void handleStatusChange(k.id!, st, lastScore)}
                            >
                              <span aria-hidden="true">{icon}</span>
                              {t(lang, `st_${st}` as const)}
                            </button>
                          );
                        })}
                      </span>
                      {cur === 'done' && (
                        <input
                          className="score"
                          type="number"
                          min={0}
                          max={100}
                          placeholder={t(lang, 'score')}
                          aria-label={t(lang, 'score')}
                          defaultValue={lastScore}
                          onBlur={(e) =>
                            void handleStatusChange(
                              k.id!,
                              'done',
                              e.target.value === '' ? undefined : Number(e.target.value)
                            )
                          }
                        />
                      )}
                      <span className="small">
                        {t(lang, 'suggested')}: {t(lang, `tier_${suggestTier(h)}` as const)}
                      </span>
                      <button
                        type="button"
                        style={{ fontSize: '0.8rem', padding: '2px 8px' }}
                        onClick={() => toggleHistory(k.id!)}
                        title="History"
                      >
                        📜 {h.length}
                      </button>
                      <button
                        aria-label={`${t(lang, 'remove')} ${k.name}`}
                        onClick={() => void removeStudent(k.id!)}
                      >
                        ✕
                      </button>
                    </div>

                    {/* History View */}
                    {isExpanded && (
                      <div style={{ background: 'var(--bg)', padding: '6px 12px', borderRadius: 6, marginTop: 6, fontSize: '0.82rem' }}>
                        <b>📜 {lang === 'hi' ? 'हालिया 5 रिकॉर्ड' : lang === 'mr' ? 'मागील ५ नोंदी' : 'Last 5 Records'}:</b>
                        {h.length === 0 ? (
                          <p style={{ margin: '4px 0', color: 'var(--mute)' }}>No records yet.</p>
                        ) : (
                          <ul style={{ margin: '4px 0', paddingLeft: 18 }}>
                            {h.slice(0, 5).map((rec, i) => (
                              <li key={i}>
                                {new Date(rec.updatedAt).toLocaleDateString()} —{' '}
                                <span style={{ fontWeight: 600 }}>{t(lang, `st_${rec.status}` as const)}</span>
                                {rec.score !== undefined ? ` (${rec.score}%)` : ''}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        </>
      )}

      {hasStudents && (
        <div className="bar" style={{ marginTop: 16 }}>
          <button onClick={() => void backup()} disabled={!hasStudents}>
            {t(lang, 'export')}
          </button>
          <label className="filebtn">
            {t(lang, 'import')}
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => void restore(e.target.files?.[0])}
            />
          </label>
        </div>
      )}
    </div>
  );
}
