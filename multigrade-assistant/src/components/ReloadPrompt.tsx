import { useRegisterSW } from 'virtual:pwa-register/react';
import type { Lang } from '../types';

export function ReloadPrompt({ lang }: { lang: Lang }) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      className="reload-prompt no-print"
      role="alert"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        background: 'var(--board)',
        color: 'var(--on)',
        padding: '12px 16px',
        borderRadius: 8,
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span>
        {lang === 'hi'
          ? 'नया संस्करण उपलब्ध है।'
          : lang === 'mr'
          ? 'नवीन आवृत्ती उपलब्ध आहे.'
          : 'New version available.'}
      </span>
      <button
        type="button"
        className="primary"
        onClick={() => updateServiceWorker(true)}
        style={{ minHeight: 36, padding: '4px 12px' }}
      >
        {lang === 'hi' ? 'रीलोड करें' : lang === 'mr' ? 'रीलोड करा' : 'Reload'}
      </button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        style={{
          minHeight: 36,
          padding: '4px 10px',
          background: 'transparent',
          color: 'var(--on)',
          border: '1px solid var(--line)',
        }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
