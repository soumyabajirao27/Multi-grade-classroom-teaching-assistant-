import { useMemo } from 'react';
import { buildSessionPlan } from '../engine/planner';
import { t } from '../i18n';
import { resolveL10n, type Grade, type Lang, type Topic } from '../types';

export function Planner({ lang, topic, grades }: { lang: Lang; topic: Topic; grades: Grade[] }) {
  const plan = useMemo(() => buildSessionPlan(topic, grades), [topic, grades]);
  if (!grades.length) return <p>{t(lang, 'noGrades')}</p>;
  return (
    <div>
      {topic.reviewed?.[lang] === false && (
        <div
          className="badge-unreviewed-banner"
          role="note"
          style={{
            margin: '0 0 12px 0',
            padding: '10px 14px',
            background: '#fff3cd',
            border: '1px solid #ffeeba',
            borderRadius: 8,
            color: '#856404',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong>
              {lang === 'hi'
                ? 'अनुवाद समीक्षा प्रतीक्षित (Needs Review)'
                : lang === 'mr'
                ? 'भाषांतर तपासणी आवश्यक (Needs Review)'
                : 'Translation Needs Review'}
              :
            </strong>{' '}
            {lang === 'hi'
              ? 'इस पाठ की सामग्री का अनुवाद प्राथमिक शिक्षकों द्वारा सत्यापन हेतु प्रतीक्षित है।'
              : lang === 'mr'
              ? 'या पाठाच्या भाषांतराची प्राथमिक शिक्षकांकडून पडताळणी होणे बाकी आहे.'
              : 'The translation for this topic is draft and awaiting native-speaker primary teacher review.'}
          </div>
        </div>
      )}
      {/* Difficulty Staircase Strip (when 2 or more grades selected) */}
      {grades.length >= 2 && (
        <div className="card staircase-strip" role="region" aria-label="Difficulty Staircase Overview">
          <div className="staircase-theme-header">
            <span className="staircase-theme-badge">
              {lang === 'hi' ? 'साझा विषय-वस्तु' : lang === 'mr' ? 'समान संकल्पना' : 'Shared Theme'}
            </span>
            <h3 className="staircase-theme-title">{resolveL10n(plan.theme, lang)}</h3>
          </div>
          <div className="staircase-steps">
            {plan.rows.map(({ grade, plan: p }, stepIdx) => (
              <div key={grade} className={`staircase-step-row g${grade}-border`}>
                <span className={`staircase-step-badge g${grade}-bg`}>
                  Grade {grade} · L{stepIdx + 1}
                </span>
                <span className="staircase-step-outcome">
                  {resolveL10n(p.outcome, lang)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card hook">
        <p><b>{t(lang, 'theme')}:</b> {resolveL10n(plan.theme, lang)}</p>
        <p><b>{t(lang, 'opening')}:</b> {resolveL10n(plan.hook, lang)}</p>
      </div>
      {plan.warnings.length > 0 && <div className="warn" role="alert"><b>{t(lang, 'warnings')}</b><ul>{plan.warnings.map((w) => <li key={w}>{w}</li>)}</ul></div>}
      {plan.rows.map(({ grade, plan: p, buddy }, stepIdx) => (
        <section key={grade} className={`card g${grade}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0 }}>Grade {grade}</h3>
              {plan.rows.length > 1 && (
                <span className="chip" style={{ fontSize: '0.8rem', padding: '2px 8px', fontWeight: 600 }}>
                  {lang === 'hi'
                    ? `स्तर ${stepIdx + 1} / ${plan.rows.length}`
                    : lang === 'mr'
                    ? `पातळी ${stepIdx + 1} / ${plan.rows.length}`
                    : `Level ${stepIdx + 1} of ${plan.rows.length}`}
                </span>
              )}
            </div>
            {buddy && <span className="small">🤝 {t(lang, 'buddy')} {buddy}</span>}
          </div>
          <p className="small" style={{ marginTop: 6 }}><b>{t(lang, 'outcome')}:</b> {resolveL10n(p.outcome, lang)}</p>
          <div className="two">
            <div>
              <h4>{t(lang, 'teacherLed')} · {p.teacher.minutes} {t(lang, 'minutes')}</h4>
              <p><b>{resolveL10n(p.teacher.title, lang)}</b></p>
              <ul>{p.teacher.steps.map((s, idx) => <li key={idx}>{resolveL10n(s, lang)}</li>)}</ul>
              {p.checklist && p.checklist.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <b>📋 {lang === 'hi' ? 'शिक्षक जाँच सूची' : lang === 'mr' ? 'शिक्षक तपासणी यादी' : 'Teacher Checklist'}:</b>
                  <ul className="small">
                    {p.checklist.map((c, i) => <li key={i}>{resolveL10n(c, lang)}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <h4>{t(lang, 'independent')} · {p.independent.minutes} {t(lang, 'minutes')} · {p.independent.mode}</h4>
              <p><b>{resolveL10n(p.independent.title, lang)}</b>: {resolveL10n(p.independent.instructions, lang)}</p>
              <p className="small">{t(lang, 'materials')}: {p.independent.materials.map((m) => resolveL10n(m, lang)).join(', ')}</p>
              {p.earlyFinisher && (
                <p className="small" style={{ color: 'var(--ok)', marginTop: 6 }}>
                  <b>⭐ {lang === 'hi' ? 'जल्दी पूरा करने वालों के लिए' : lang === 'mr' ? 'लवकर पूर्ण करणाऱ्यांसाठी' : 'Early Finisher'}:</b> {resolveL10n(p.earlyFinisher, lang)}
                </p>
              )}
            </div>
          </div>
          {p.mapping && p.mapping.length > 0 && (
            <div className="small" style={{ marginTop: 10, paddingTop: 8, borderTop: '1px dashed var(--line)' }}>
              <b>📚 {lang === 'hi' ? 'पाठ्यक्रम मिलान' : lang === 'mr' ? 'अभ्यासक्रम जुळणी' : 'Curriculum Mapping'}:</b>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {p.mapping.map((m, i) => (
                  <span key={i} className="chip" style={{ fontSize: '0.82rem' }}>
                    {m.board} · {m.textbook} · {m.chapter} ({m.status})
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
