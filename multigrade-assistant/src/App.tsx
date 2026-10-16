import { useEffect, useState } from 'react';
import { ReloadPrompt } from './components/ReloadPrompt';
import { Welcome } from './components/Welcome';
import { TOPICS, getTopic } from './content/curriculum';
import { Planner } from './features/Planner';
import { Progress } from './features/Progress';
import { Rotation } from './features/Rotation';
import { Worksheets } from './features/Worksheets';
import { cleanTopicTitle } from './cleanTitle';
import { TopicPickerModal } from './components/TopicPickerModal';
import { usePersisted } from './hooks';
import { LANGS, t } from './i18n';
import { getSystemPrefersDark, resolveTheme, type ThemeMode } from './theme';
import { GRADES, type Grade, type GradeTopicMap, type Lang, type SessionMode } from './types';

type Tab = 'plan' | 'ws' | 'rot' | 'prog';
const TABS: Tab[] = ['plan', 'ws', 'rot', 'prog'];

export function App() {
  const [lang, setLang] = usePersisted<Lang>('lang', 'en');
  const [topicId, setTopicId] = usePersisted('topic', TOPICS[0].id);
  const [grades, setGrades] = usePersisted<Grade[]>('grades', [1, 3, 5]);
  const [sessionMode, setSessionMode] = usePersisted<SessionMode>('session_mode', 'theme');
  const [gradeTopics, setGradeTopics] = usePersisted<GradeTopicMap>('grade_topics', {
    1: 'math-market',
    2: 'math-market',
    3: 'evs-water',
    4: 'evs-water',
    5: 'math-fractions',
  });
  const [gradePickingFor, setGradePickingFor] = useState<Grade | null>(null);
  const [tab, setTab] = useState<Tab>('plan');
  const [showWelcome, setShowWelcome] = usePersisted<boolean>('welcome_seen', false);
  const [manualWelcome, setManualWelcome] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [themeMode, setThemeMode] = usePersisted<ThemeMode>('theme', 'auto');
  const [systemDark, setSystemDark] = useState<boolean>(() => getSystemPrefersDark());
  const [periodTotal, setPeriodTotal] = usePersisted<number>('period_total', 40);
  const [rotationPasses, setRotationPasses] = usePersisted<1 | 2>('rotation_passes', 1);

  const effectivePasses: 1 | 2 = grades.length <= 1 ? 1 : rotationPasses;


  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const activeResolvedTheme = resolveTheme(themeMode, systemDark);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeResolvedTheme);
  }, [activeResolvedTheme]);

  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [swStatus, setSwStatus] = useState<'ready' | 'preparing' | 'none'>('none');
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      setSwStatus('none');
      return;
    }

    if (navigator.serviceWorker.controller) {
      setSwStatus('ready');
    } else {
      // Check if registration exists or is installing
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) {
          setSwStatus('none');
        } else if (reg.active) {
          setSwStatus('ready');
        } else if (reg.installing || reg.waiting) {
          setSwStatus('preparing');
        } else {
          setSwStatus('none');
        }
      }).catch(() => {
        setSwStatus('none');
      });
    }

    navigator.serviceWorker.ready.then(() => {
      setSwStatus('ready');
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const topic = getTopic(topicId);
  const cleanedTopicTitle = cleanTopicTitle(topic.title[lang] || topic.title.en);
  const toggle = (g: Grade) => setGrades(grades.includes(g) ? grades.filter((x) => x !== g) : [...grades, g]);

  const isWelcomeOpen = !showWelcome || manualWelcome;

  const installLabel = lang === 'hi' ? '📲 ऐप इंस्टॉल करें' : lang === 'mr' ? '📲 ॲप इन्स्टॉल करा' : '📲 Install App';

  return (
    <>
      <ReloadPrompt lang={lang} />
      {isWelcomeOpen && (
        <Welcome
          lang={lang}
          onClose={() => {
            setShowWelcome(true);
            setManualWelcome(false);
          }}
        />
      )}

      <TopicPickerModal
        isOpen={showTopicPicker}
        onClose={() => setShowTopicPicker(false)}
        selectedTopicId={topicId}
        onSelectTopic={(id) => setTopicId(id)}
        lang={lang}
      />

      {showInstallModal && (
        <div className="install-modal-backdrop" onClick={() => setShowInstallModal(false)}>
          <div className="install-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="install-title">
            <h3 id="install-title">📲 {lang === 'hi' ? 'ऐप इंस्टॉल करें' : lang === 'mr' ? 'ॲप इन्स्टॉल करा' : 'Install for Offline Use'}</h3>
            {isIOS ? (
              <div>
                <p>
                  {lang === 'hi'
                    ? 'iOS Safari में इसे होम स्क्रीन पर जोड़ने के लिए:'
                    : lang === 'mr'
                    ? 'iOS Safari मध्ये हे होम स्क्रीनवर जोडण्यासाठी:'
                    : 'To install on iPhone / iPad Safari:'}
                </p>
                <ol>
                  <li>
                    {lang === 'hi'
                      ? 'Safari के निचले हिस्से में शेयर बटन (चौकोर बॉक्स + ऊपर तीर ⎋) पर टैप करें।'
                      : lang === 'mr'
                      ? 'Safari मधील शेअर बटणावर (⎋) टॅप करा.'
                      : 'Tap the Share button (⎋) at the bottom of Safari.'}
                  </li>
                  <li>
                    {lang === 'hi'
                      ? "'Add to Home Screen' (+) चुनें।"
                      : lang === 'mr'
                      ? "'Add to Home Screen' (+) निवडा."
                      : "Scroll down and select 'Add to Home Screen' (+)."}
                  </li>
                  <li>
                    {lang === 'hi'
                      ? "ऊपर दाईं ओर 'Add' पर टैप करें। अब ऐप बिना इंटरनेट चलेगा!"
                      : lang === 'mr'
                      ? "वरच्या उजव्या बाजूला 'Add' टॅप करा. ॲप पूर्णपणे ऑफलाइन चालेल!"
                      : "Tap 'Add' in the top right corner. The app will work completely offline!"}
                  </li>
                </ol>
              </div>
            ) : (
              <div>
                <p>
                  {lang === 'hi'
                    ? 'Chrome या Edge में मेन्यू (⋮) खोलें और "ऐप इंस्टॉल करें" या "Add to Home screen" चुनें।'
                    : lang === 'mr'
                    ? 'Chrome किंवा Edge मध्ये मेन्यू (⋮) उघडा आणि "ॲप इन्स्टॉल करा" किंवा "Add to Home screen" निवडा.'
                    : 'Open your browser menu (⋮) and tap "Install app" or "Add to Home screen" to use this app offline.'}
                </p>
              </div>
            )}
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button type="button" className="primary" onClick={() => setShowInstallModal(false)}>
                {lang === 'hi' ? 'समझ गया' : lang === 'mr' ? 'समजले' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="no-print">
        <div className="header-title">
          <h1>{t(lang, 'appTitle')}</h1>
          <span
            className={`offline-chip ${swStatus}`}
            title={
              swStatus === 'ready'
                ? (lang === 'hi'
                    ? 'सर्विस वर्कर सक्रिय एवं कैश सुरक्षित: ऐप बिना इंटरनेट पूर्णतः चलेगा'
                    : lang === 'mr'
                    ? 'सर्व्हिस वर्कर सक्रिय व कॅश सुरक्षित: ॲप इंटरनेटशिवाय पूर्ण चालेल'
                    : 'Service worker active and assets cached: ready for offline use')
                : swStatus === 'preparing'
                ? (lang === 'hi'
                    ? 'ऑफलाइन एसेट्स डाउनलोड हो रहे हैं...'
                    : lang === 'mr'
                    ? 'ऑफलाइन साहित्य डाऊनलोड होत आहे...'
                    : 'Service worker installing: preparing offline cache...')
                : (lang === 'hi'
                    ? 'केवल ऑनलाइन (डेवलपमेंट सर्वर या सर्विस वर्कर अनुपलब्ध)'
                    : lang === 'mr'
                    ? 'केवळ ऑनलाइन (डेव्हलपमेंट सर्व्हर किंवा सर्व्हिस वर्कर अनुपलब्ध)'
                    : 'Online only (dev server or service worker not active)')
            }
            aria-label={
              swStatus === 'ready'
                ? 'Offline ready: service worker active and assets cached'
                : swStatus === 'preparing'
                ? 'Preparing offline: service worker installing'
                : 'Online only: running in dev server without service worker'
            }
            role="status"
          >
            {swStatus === 'ready' && (
              <>🟢 {lang === 'hi' ? 'ऑफलाइन तैयार' : lang === 'mr' ? 'ऑफलाइन तयार' : 'Offline ready'}</>
            )}
            {swStatus === 'preparing' && (
              <>🟡 {lang === 'hi' ? 'तैयार हो रहा है' : lang === 'mr' ? 'तयार होत आहे' : 'Preparing offline'}</>
            )}
            {swStatus === 'none' && (
              <>⚪ {lang === 'hi' ? 'केवल ऑनलाइन' : lang === 'mr' ? 'केवळ ऑनलाइन' : 'Online only'}</>
            )}
          </span>
        </div>
        <div className="header-controls">
          {/* Segmented Theme Switcher */}
          <div className="segmented-switch theme-switch" role="group" aria-label="Theme mode">
            <button
              type="button"
              className={themeMode === 'light' ? 'active' : ''}
              onClick={() => setThemeMode('light')}
              title="Light Theme"
              aria-label="Light Theme"
              aria-pressed={themeMode === 'light'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>
            <button
              type="button"
              className={themeMode === 'auto' ? 'active' : ''}
              onClick={() => setThemeMode('auto')}
              title={`Auto Theme (${activeResolvedTheme})`}
              aria-label={`Auto Theme (${activeResolvedTheme})`}
              aria-pressed={themeMode === 'auto'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </button>
            <button
              type="button"
              className={themeMode === 'dark' ? 'active' : ''}
              onClick={() => setThemeMode('dark')}
              title="Dark Theme"
              aria-label="Dark Theme"
              aria-pressed={themeMode === 'dark'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>

          <button type="button" className="install-btn" onClick={handleInstallClick} title="Install PWA">
            {installLabel}
          </button>
          <button type="button" className="help-btn" onClick={() => setManualWelcome(true)} title="Help / Guide">
            ❓ {lang === 'hi' ? 'मार्गदर्शिका' : lang === 'mr' ? 'मार्गदर्शिका' : 'Guide'}
          </button>
          <label className="lang">
            {t(lang, 'language')}{' '}
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label={t(lang, 'language')}>
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <main>
        {/* Mode A / Mode B Switcher Bar */}
        <div className="bar no-print" style={{ background: 'var(--card)', borderBottom: '1px solid var(--line)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)' }}>
            🎯 {lang === 'hi' ? 'शिक्षण मोड' : lang === 'mr' ? 'अध्यापन मोड' : 'Classroom Mode'}:
          </span>
          <div className="theme-toggle" role="radiogroup" aria-label="Session Mode" style={{ display: 'inline-flex' }}>
            <button
              type="button"
              className={sessionMode === 'theme' ? 'active' : ''}
              onClick={() => setSessionMode('theme')}
              aria-pressed={sessionMode === 'theme'}
              title={t(lang, 'modeA_desc')}
              style={{ fontSize: '0.85rem', padding: '4px 12px' }}
            >
              🌱 {t(lang, 'modeA')}
            </button>
            <button
              type="button"
              className={sessionMode === 'multi_subject' ? 'active' : ''}
              onClick={() => setSessionMode('multi_subject')}
              aria-pressed={sessionMode === 'multi_subject'}
              title={t(lang, 'modeB_desc')}
              style={{ fontSize: '0.85rem', padding: '4px 12px' }}
            >
              📚 {t(lang, 'modeB')}
            </button>
          </div>
          <span className="small" style={{ color: 'var(--mute)', marginLeft: 6 }}>
            {sessionMode === 'theme' ? t(lang, 'modeA_desc') : t(lang, 'modeB_desc')}
          </span>
        </div>

        <div className="bar no-print">
          {sessionMode === 'theme' ? (
            <button
              type="button"
              className="topic-trigger-btn"
              onClick={() => {
                setGradePickingFor(null);
                setShowTopicPicker(true);
              }}
              aria-haspopup="dialog"
              aria-expanded={showTopicPicker}
              aria-label={`${t(lang, 'topic')}: ${cleanedTopicTitle}`}
            >
              <span className="topic-card-icon" aria-hidden="true">
                {topic.subject === 'math' ? '📐' : topic.subject === 'evs' ? '🌱' : '📖'}
              </span>
              <span>{cleanedTopicTitle}</span>
              <span className={`subject-tag tag-${topic.subject}`}>
                {topic.subject === 'math'
                  ? lang === 'hi'
                    ? 'गणित'
                    : lang === 'mr'
                    ? 'गणित'
                    : 'Maths'
                  : topic.subject === 'evs'
                  ? lang === 'hi'
                    ? 'पर्यावरण'
                    : lang === 'mr'
                    ? 'परिसर'
                    : 'EVS'
                  : lang === 'hi'
                  ? 'भाषा'
                  : lang === 'mr'
                  ? 'भाषा'
                  : 'Language'}
              </span>
              <span className="topic-chevron" aria-hidden="true">▼</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {lang === 'hi' ? 'कक्षा विषय' : lang === 'mr' ? 'इयत्ता घटक' : 'Grade Subjects'}:
              </span>
              {grades.map((g) => {
                const assignedTopic = getTopic(gradeTopics[g] || topicId);
                const title = cleanTopicTitle(assignedTopic.title[lang] || assignedTopic.title.en);
                return (
                  <button
                    key={g}
                    type="button"
                    className="chip"
                    onClick={() => {
                      setGradePickingFor(g);
                      setShowTopicPicker(true);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.82rem',
                      padding: '4px 8px',
                      background: 'var(--card)',
                      border: '1px solid var(--line)',
                    }}
                    title={`Grade ${g}: Click to change subject/topic`}
                  >
                    <b style={{ color: `var(--g${g})` }}>G{g}</b>
                    <span>{assignedTopic.subject === 'math' ? '📐' : assignedTopic.subject === 'evs' ? '🌱' : '📖'}</span>
                    <span>{title}</span>
                    <span style={{ fontSize: '0.7rem' }}>▼</span>
                  </button>
                );
              })}
            </div>
          )}

          {topic.reviewed?.[lang] === false && sessionMode === 'theme' && (
            <span
              className="chip unreviewed-badge"
              title="Translation needs native-speaker teacher review"
              style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffeeba', fontWeight: 600, fontSize: '0.82rem' }}
            >
              ⚠️ {lang === 'hi' ? 'अनुवाद समीक्षा प्रतीक्षित' : lang === 'mr' ? 'भाषांतर तपासणी आवश्यक' : 'Translation needs review'}
            </span>
          )}
          <span role="group" aria-label={t(lang, 'grades')} className="chips">
            {GRADES.map((g) => (
              <button key={g} type="button" className="chip" aria-pressed={grades.includes(g)} onClick={() => toggle(g)}>
                Grade {g}
              </button>
            ))}
          </span>
        </div>
        <nav className="tabs no-print" role="tablist">
          {TABS.map((k) => (
            <button key={k} type="button" role="tab" data-tab={k} aria-selected={tab === k} onClick={() => setTab(k)}>
              {t(lang, `tab_${k}` as const)}
            </button>
          ))}
        </nav>
        {tab === 'plan' && (
          <Planner
            lang={lang}
            topic={topic}
            grades={grades}
            mode={sessionMode}
            gradeTopics={gradeTopics}
            onOpenTopicPickerForGrade={(g) => {
              setGradePickingFor(g);
              setShowTopicPicker(true);
            }}
          />
        )}
        {tab === 'ws' && (
          <Worksheets
            lang={lang}
            topic={topic}
            grades={grades}
            periodTotal={periodTotal}
            passes={effectivePasses}
            openingMinutes={5}
            mode={sessionMode}
            gradeTopics={gradeTopics}
          />
        )}
        {tab === 'rot' && (
          <Rotation
            lang={lang}
            topic={topic}
            grades={grades}
            periodTotal={periodTotal}
            onPeriodChange={setPeriodTotal}
            passes={rotationPasses}
            onPassesChange={setRotationPasses}
            openingMinutes={5}
            mode={sessionMode}
            gradeTopics={gradeTopics}
          />
        )}
        {tab === 'prog' && <Progress lang={lang} topic={topic} grades={grades} />}

        {/* Global or Per-Grade Topic Picker Modal */}
        <TopicPickerModal
          isOpen={showTopicPicker}
          onClose={() => {
            setShowTopicPicker(false);
            setGradePickingFor(null);
          }}
          selectedTopicId={
            gradePickingFor ? (gradeTopics[gradePickingFor] || topicId) : topicId
          }
          onSelectTopic={(id) => {
            if (gradePickingFor) {
              setGradeTopics({ ...gradeTopics, [gradePickingFor]: id });
            } else {
              setTopicId(id);
            }
            setShowTopicPicker(false);
            setGradePickingFor(null);
          }}
          lang={lang}
        />
      </main>
    </>
  );
}

