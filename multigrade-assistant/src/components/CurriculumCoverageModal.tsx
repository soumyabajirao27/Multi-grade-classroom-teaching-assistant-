import { cleanTopicTitle } from '../cleanTitle';
import { TOPICS } from '../content/curriculum';
import {
  exportCurriculumMappingToCsv,
  getCurriculumCoverageCounts,
  getCurriculumSources,
} from '../content/curriculumSources';
import { t } from '../i18n';
import type { Grade, Lang, MappingStatus } from '../types';
import { IconChart, IconDownload, IconPrinter, IconX } from './icons';

interface CurriculumCoverageModalProps {
  lang: Lang;
  onClose: () => void;
}

export function getStatusBadgeStyle(status: MappingStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case 'verified':
      return { bg: '#d4edda', text: '#155724', border: '#c3e6cb' };
    case 'candidate':
      return { bg: '#cce5ff', text: '#004085', border: '#b8daff' };
    case 'extension':
      return { bg: '#e2e3e5', text: '#383d41', border: '#d6d8db' };
    case 'to-research':
    default:
      return { bg: '#fff3cd', text: '#856404', border: '#ffeeba' };
  }
}

export function formatStatusLabel(lang: Lang, status: MappingStatus): string {
  switch (status) {
    case 'verified':
      return t(lang, 'status_verified');
    case 'candidate':
      return t(lang, 'status_candidate');
    case 'extension':
      return t(lang, 'status_extension');
    case 'to-research':
    default:
      return t(lang, 'status_to_research');
  }
}

export function CurriculumCoverageModal({ lang, onClose }: CurriculumCoverageModalProps) {
  const counts = getCurriculumCoverageCounts();
  const grades: Grade[] = [1, 2, 3, 4, 5];

  const handleDownloadCsv = () => {
    const csvContent = exportCurriculumMappingToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `curriculum-mapping-coverage-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coverage-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: 920,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'var(--card)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 id="coverage-modal-title" style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconChart size={22} aria-hidden="true" />
              <span>{t(lang, 'curriculumCoverage')}</span>
            </h2>
            <p className="small" style={{ margin: '4px 0 0 0', color: 'var(--mute)' }}>
              {lang === 'hi'
                ? 'कक्षा 1-5 के सभी विषयों के लिए आधिकारिक NCERT और राज्य बोर्ड पाठ्यक्रम संरेखण'
                : lang === 'mr'
                ? 'इयत्ता १-५ च्या सर्व घटकांसाठी अधिकृत NCERT व राज्य अभ्यासक्रम संरेखन'
                : 'National (NCERT) & State Board Curriculum Alignment across Grades 1–5'}
            </p>
          </div>
          <button
            type="button"
            className="chip"
            onClick={onClose}
            style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '1.1rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}
            aria-label="Close"
          >
            <IconX size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Dynamic Computed Counts Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 8,
          }}
        >
          <div style={{ background: '#cce5ff', border: '1px solid #b8daff', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#004085' }}>{counts.candidate}</div>
            <div style={{ fontSize: '0.8rem', color: '#004085', fontWeight: 600 }}>{t(lang, 'status_candidate')}</div>
          </div>
          <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#155724' }}>{counts.verified}</div>
            <div style={{ fontSize: '0.8rem', color: '#155724', fontWeight: 600 }}>{t(lang, 'status_verified')}</div>
          </div>
          <div style={{ background: '#e2e3e5', border: '1px solid #d6d8db', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#383d41' }}>{counts.extension}</div>
            <div style={{ fontSize: '0.8rem', color: '#383d41', fontWeight: 600 }}>{t(lang, 'status_extension')}</div>
          </div>
          <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#856404' }}>{counts.toResearch}</div>
            <div style={{ fontSize: '0.8rem', color: '#856404', fontWeight: 600 }}>{t(lang, 'status_to_research')}</div>
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg, #f5f5f5)', borderBottom: '2px solid var(--line, #ccc)' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left' }}>{t(lang, 'topic')}</th>
                <th style={{ padding: '8px 6px', textAlign: 'center' }}>Subject</th>
                {grades.map((g) => (
                  <th key={g} style={{ padding: '8px 6px', textAlign: 'center' }}>
                    Grade {g}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOPICS.map((top) => {
                const cleanTitle = cleanTopicTitle(top.title[lang] || top.title.en);
                return (
                  <tr key={top.id} style={{ borderBottom: '1px solid var(--line, #eee)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600 }}>{cleanTitle}</td>
                    <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                      <span className={`subject-tag tag-${top.subject}`} style={{ fontSize: '0.72rem' }}>
                        {top.subject.toUpperCase()}
                      </span>
                    </td>
                    {grades.map((g) => {
                      const sources = getCurriculumSources(top.id, g);
                      const primary = sources[0];
                      if (!primary) {
                        return (
                          <td key={g} style={{ padding: '6px', textAlign: 'center', color: '#999' }}>
                            —
                          </td>
                        );
                      }
                      const style = getStatusBadgeStyle(primary.status);
                      const label = formatStatusLabel(lang, primary.status);
                      return (
                        <td key={g} style={{ padding: '6px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 6px',
                              borderRadius: 4,
                              background: style.bg,
                              color: style.text,
                              border: `1px solid ${style.border}`,
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                            title={`${primary.board} · ${primary.book}: ${primary.chapter}`}
                          >
                            {label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="chip"
              onClick={handleDownloadCsv}
              style={{ cursor: 'pointer', padding: '6px 14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <IconDownload size={14} aria-hidden="true" />
              <span>{t(lang, 'exportMappingCsv')}</span>
            </button>
            <button
              type="button"
              className="chip"
              onClick={handlePrint}
              style={{ cursor: 'pointer', padding: '6px 14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <IconPrinter size={14} aria-hidden="true" />
              <span>{t(lang, 'print')}</span>
            </button>
          </div>
          <button
            type="button"
            className="chip primary"
            onClick={onClose}
            style={{ cursor: 'pointer', padding: '6px 18px', fontWeight: 600 }}
          >
            {lang === 'hi' ? 'बंद करें' : lang === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
