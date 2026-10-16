import { useEffect, useRef, useState } from 'react';
import { cleanTopicTitle } from '../cleanTitle';
import { BUILTIN_TOPICS } from '../content/curriculum';
import { t } from '../i18n';
import type { Lang, Topic } from '../types';
import { validateCustomTopic, getTopicTemplateJson, type ValidationError } from '../engine/validateTopic';

interface TopicPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
  lang: Lang;
  initialSubjectFilter?: 'all' | 'math' | 'evs' | 'lang';
  customTopics?: Topic[];
  onImportCustomTopic?: (topic: Topic) => Promise<void>;
  onDeleteCustomTopic?: (id: string) => Promise<void>;
}

export function TopicPickerModal({
  isOpen,
  onClose,
  selectedTopicId,
  onSelectTopic,
  lang,
  initialSubjectFilter = 'all',
  customTopics = [],
  onImportCustomTopic,
  onDeleteCustomTopic,
}: TopicPickerModalProps) {
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<'all' | 'math' | 'evs' | 'lang'>('all');
  const [importErrors, setImportErrors] = useState<ValidationError[]>([]);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilterSubject(initialSubjectFilter);
      setImportErrors([]);
      setImportSuccess(null);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialSubjectFilter]);

  if (!isOpen) return null;

  const allTopics: Topic[] = [...BUILTIN_TOPICS, ...customTopics];

  const filteredTopics = allTopics.filter((tp) => {
    if (filterSubject !== 'all' && tp.subject !== filterSubject) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const cleanTitle = cleanTopicTitle(tp.title[lang] || tp.title.en).toLowerCase();
    const rawTitle = (tp.title[lang] || '').toLowerCase();
    const rawEn = tp.title.en.toLowerCase();
    const subjectLabel =
      tp.subject === 'math'
        ? 'maths गणित'
        : tp.subject === 'evs'
        ? 'evs पर्यावरण परिसर अभ्यास'
        : 'lang language भाषा मराठी';
    return cleanTitle.includes(q) || rawTitle.includes(q) || rawEn.includes(q) || subjectLabel.includes(q);
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const cards = gridRef.current?.querySelectorAll<HTMLButtonElement>('.topic-card-btn');
      if (!cards || cards.length === 0) return;

      const activeEl = document.activeElement;
      let currentIndex = -1;
      cards.forEach((btn, idx) => {
        if (btn === activeEl) currentIndex = idx;
      });

      let nextIndex = currentIndex;
      if (currentIndex === -1) {
        nextIndex = 0;
      } else {
        if (e.key === 'ArrowDown') nextIndex = Math.min(cards.length - 1, currentIndex + 2);
        else if (e.key === 'ArrowUp') nextIndex = Math.max(0, currentIndex - 2);
        else if (e.key === 'ArrowRight') nextIndex = Math.min(cards.length - 1, currentIndex + 1);
        else if (e.key === 'ArrowLeft') nextIndex = Math.max(0, currentIndex - 1);
      }

      e.preventDefault();
      cards[nextIndex]?.focus();
    }
  };

  return (
    <div
      className="topic-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="topic-picker-title"
      onKeyDown={handleKeyDown}
    >
      <div className="topic-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="topic-modal-header">
          <div>
            <h3 id="topic-picker-title" style={{ margin: 0, fontSize: '1.25rem' }}>
              {t(lang, 'topic')}
            </h3>
            <span className="small" style={{ color: 'var(--mute)' }}>
              {lang === 'hi' ? 'पाठ विषय चुनें' : lang === 'mr' ? 'अभ्यास घटक निवडा' : 'Select classroom curriculum topic'}
            </span>
          </div>
          <button
            type="button"
            className="topic-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="topic-modal-search-row">
          <input
            ref={searchInputRef}
            type="text"
            className="topic-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'विषय खोजें...'
                : lang === 'mr'
                ? 'घटक शोधा...'
                : 'Search topics...'
            }
            aria-label="Search topics"
          />
          <div className="segmented-switch subject-filter-switch" role="group" aria-label="Subject filter">
            <button
              type="button"
              className={filterSubject === 'all' ? 'active' : ''}
              onClick={() => setFilterSubject('all')}
              aria-pressed={filterSubject === 'all'}
            >
              {lang === 'hi' ? 'सभी' : lang === 'mr' ? 'सर्व' : 'All'}
            </button>
            <button
              type="button"
              className={filterSubject === 'math' ? 'active' : ''}
              onClick={() => setFilterSubject('math')}
              aria-pressed={filterSubject === 'math'}
            >
              📐 {lang === 'hi' ? 'गणित' : lang === 'mr' ? 'गणित' : 'Maths'}
            </button>
            <button
              type="button"
              className={filterSubject === 'evs' ? 'active' : ''}
              onClick={() => setFilterSubject('evs')}
              aria-pressed={filterSubject === 'evs'}
            >
              🌱 {lang === 'hi' ? 'पर्यावरण' : lang === 'mr' ? 'परिसर' : 'EVS'}
            </button>
            <button
              type="button"
              className={filterSubject === 'lang' ? 'active' : ''}
              onClick={() => setFilterSubject('lang')}
              aria-pressed={filterSubject === 'lang'}
            >
              📖 {lang === 'hi' ? 'भाषा' : lang === 'mr' ? 'भाषा' : 'Language'}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 10, padding: '0 4px' }}>
          <button
            type="button"
            className="chip"
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', padding: '6px 12px' }}
          >
            📥 {t(lang, 'importTopic')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const existingIds = customTopics.map((t) => t.id);
                const res = validateCustomTopic(text, existingIds);
                if (!res.valid) {
                  setImportErrors(res.errors);
                  setImportSuccess(null);
                } else if (res.topic) {
                  await onImportCustomTopic?.(res.topic);
                  setImportErrors([]);
                  setImportSuccess(t(lang, 'topicImportSuccess'));
                  onSelectTopic(res.topic.id);
                }
              } catch (err) {
                setImportErrors([{ path: 'file', message: (err as Error).message || 'Failed to read file' }]);
                setImportSuccess(null);
              }
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className="chip"
            onClick={() => {
              const templateJson = getTopicTemplateJson();
              const blob = new Blob([templateJson], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'custom-topic-template.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', padding: '6px 12px' }}
          >
            📄 {t(lang, 'exportTemplate')}
          </button>
        </div>

        {importSuccess && (
          <div style={{ marginTop: 8, padding: '8px 12px', background: '#ecfdf5', color: '#065f46', borderRadius: 6, fontSize: '0.85rem' }}>
            ✓ {importSuccess}
          </div>
        )}

        {importErrors.length > 0 && (
          <div className="warn" role="alert" style={{ marginTop: 8, padding: '8px 12px', fontSize: '0.82rem' }}>
            <strong>{t(lang, 'topicImportFailed')}</strong>
            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
              {importErrors.map((err, i) => (
                <li key={i}>
                  <code>{err.path}</code>: {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          ref={gridRef}
          className="topic-cards-grid"
          role="grid"
          aria-label="Available topics"
          style={{ marginTop: 12 }}
        >
          {filteredTopics.map((tp) => {
            const isSelected = tp.id === selectedTopicId;
            const cleanedTitle = cleanTopicTitle(tp.title[lang] || tp.title.en);
            const icon = tp.subject === 'math' ? '📐' : tp.subject === 'evs' ? '🌱' : '📖';
            const subjectTag =
              tp.subject === 'math'
                ? lang === 'hi'
                  ? 'गणित'
                  : lang === 'mr'
                  ? 'गणित'
                  : 'Maths'
                : tp.subject === 'evs'
                ? lang === 'hi'
                  ? 'पर्यावरण'
                  : lang === 'mr'
                  ? 'परिसर अभ्यास'
                  : 'EVS'
                : lang === 'hi'
                ? 'भाषा'
                : lang === 'mr'
                ? 'भाषा'
                : 'Language';

            return (
              <div
                key={tp.id}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  className={`topic-card-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectTopic(tp.id);
                    onClose();
                  }}
                  aria-selected={isSelected}
                  role="gridcell"
                  style={{ width: '100%', height: '100%' }}
                >
                  <div className="topic-card-top">
                    <span className="topic-card-icon" aria-hidden="true">
                      {icon}
                    </span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {tp.isCustom && (
                        <span className="subject-tag" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                          ⭐ {t(lang, 'customBadge')}
                        </span>
                      )}
                      <span className={`subject-tag tag-${tp.subject}`}>{subjectTag}</span>
                    </div>
                  </div>
                  <div className="topic-card-title">{cleanedTitle}</div>
                  {isSelected && (
                    <span className="topic-card-selected-check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
                {tp.isCustom && (
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm(t(lang, 'confirmDeleteTopic'))) {
                        await onDeleteCustomTopic?.(tp.id);
                      }
                    }}
                    title={t(lang, 'deleteCustomTopic')}
                    aria-label={`${t(lang, 'deleteCustomTopic')}: ${cleanedTitle}`}
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#b91c1c',
                      borderRadius: 4,
                      padding: '2px 6px',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
