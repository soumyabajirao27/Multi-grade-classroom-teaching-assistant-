import { useEffect, useRef, useState } from 'react';
import { cleanTopicTitle } from '../cleanTitle';
import { TOPICS } from '../content/curriculum';
import { t } from '../i18n';
import type { Lang } from '../types';

interface TopicPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
  lang: Lang;
  initialSubjectFilter?: 'all' | 'math' | 'evs';
}

export function TopicPickerModal({
  isOpen,
  onClose,
  selectedTopicId,
  onSelectTopic,
  lang,
  initialSubjectFilter = 'all',
}: TopicPickerModalProps) {
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<'all' | 'math' | 'evs'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilterSubject(initialSubjectFilter);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialSubjectFilter]);


  if (!isOpen) return null;

  const filteredTopics = TOPICS.filter((tp) => {
    if (filterSubject !== 'all' && tp.subject !== filterSubject) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const cleanTitle = cleanTopicTitle(tp.title[lang] || tp.title.en).toLowerCase();
    const rawTitle = (tp.title[lang] || '').toLowerCase();
    const rawEn = tp.title.en.toLowerCase();
    const subjectLabel = tp.subject === 'math' ? 'maths गणित' : 'evs पर्यावरण परिसर अभ्यास';
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
          </div>
        </div>

        <div
          ref={gridRef}
          className="topic-cards-grid"
          role="grid"
          aria-label="Available topics"
        >
          {filteredTopics.map((tp) => {
            const isSelected = tp.id === selectedTopicId;
            const cleanedTitle = cleanTopicTitle(tp.title[lang] || tp.title.en);
            const icon = tp.subject === 'math' ? '📐' : '🌱';
            const subjectTag =
              tp.subject === 'math'
                ? lang === 'hi'
                  ? 'गणित'
                  : lang === 'mr'
                  ? 'गणित'
                  : 'Maths'
                : lang === 'hi'
                ? 'पर्यावरण'
                : lang === 'mr'
                ? 'परिसर अभ्यास'
                : 'EVS';

            return (
              <button
                key={tp.id}
                type="button"
                className={`topic-card-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelectTopic(tp.id);
                  onClose();
                }}
                aria-selected={isSelected}
                role="gridcell"
              >
                <div className="topic-card-top">
                  <span className="topic-card-icon" aria-hidden="true">
                    {icon}
                  </span>
                  <span className={`subject-tag tag-${tp.subject}`}>{subjectTag}</span>
                </div>
                <div className="topic-card-title">{cleanedTitle}</div>
                {isSelected && (
                  <span className="topic-card-selected-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
