import { t } from '../i18n';
import type { Lang, Worksheet } from '../types';

export function Sheet({ ws, lang, showKey }: { ws: Worksheet; lang: Lang; showKey: boolean }) {
  return (
    <article className="sheet">
      <h3>
        Grade {ws.grade} · {ws.title}{' '}
        {ws.subject && (
          <span className={`subject-tag tag-${ws.subject}`} style={{ fontSize: '0.75rem', verticalAlign: 'middle', marginRight: 4 }}>
            {ws.subject === 'math' ? '📐 Maths' : '🌱 EVS'}
          </span>
        )}
        <span className={`tier tier-${ws.tier}`}>{t(lang, `tier_${ws.tier}` as const)}</span>
      </h3>
      <p>{t(lang, 'name')}: <span className="ln" /> &nbsp; {t(lang, 'date')}: <span className="ln short" /></p>

      {ws.students.length > 0 && <p className="small">{t(lang, 'students')}: {ws.students.join(', ')}</p>}
      <p><b>{ws.instructions}</b></p>
      <ol>
        {ws.questions.map((q) => (
          <li key={q.id}>
            {q.prompt}
            {q.kind === 'draw' ? <div className="box" /> : <div className="ln wide" />}
          </li>
        ))}
      </ol>
      {ws.earlyFinisher && (
        <p className="small" style={{ borderTop: '1px dashed #999', paddingTop: '6px', marginTop: '10px' }}>
          <b>⭐ {lang === 'hi' ? 'जल्दी पूरा करने वालों के लिए चुनौती' : lang === 'mr' ? 'लवकर पूर्ण करणाऱ्यांसाठी आव्हान' : 'Early Finisher Challenge'}:</b> {ws.earlyFinisher}
        </p>
      )}
      <p className="small seed">{t(lang, 'seed')}: {ws.seed}</p>
      {showKey && (
        <div className="key"><b>{t(lang, 'answerKey')}</b>
          <ol>{ws.questions.map((q) => <li key={q.id}>{q.answer}</li>)}</ol>
        </div>
      )}
    </article>
  );
}
