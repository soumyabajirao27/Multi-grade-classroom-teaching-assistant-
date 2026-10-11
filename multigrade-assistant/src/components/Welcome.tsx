import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../types';

interface WelcomeProps {
  lang: Lang;
  onClose: () => void;
}

export function Welcome({ lang, onClose }: WelcomeProps) {
  const [step, setStep] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const steps = [
    {
      num: 1,
      title:
        lang === 'hi'
          ? '१. विषय और कक्षाएं चुनें'
          : lang === 'mr'
          ? '१. विषय आणि वर्ग निवडा'
          : '1. Choose Topic and Grades',
      icon: '📖',
      desc:
        lang === 'hi'
          ? 'शीर्ष बार से एक साझा विषय (जैसे जल) चुनें और आज उपस्थित कक्षाओं (जैसे कक्षा १, ३, ५) पर क्लिक करें। पाठ योजना स्वतः तैयार हो जाएगी।'
          : lang === 'mr'
          ? 'वरच्या पट्टीमधून एक सामायिक विषय (उदा. पाणी) निवडा आणि आज हजर असलेले वर्ग (उदा. इयत्ता १, ३, ५) निवडा. पाठ नियोजन लगेच तयार होईल.'
          : 'Select a unifying theme (e.g., Water) from the top dropdown and toggle the grades present in your room today. The session plan updates instantly.',
    },
    {
      num: 2,
      title:
        lang === 'hi'
          ? '२. कार्यपत्रिका प्रिंट करें'
          : lang === 'mr'
          ? '२. कार्यपत्रिका प्रिंट करा'
          : '2. Print Worksheets',
      icon: '🖨️',
      desc:
        lang === 'hi'
          ? 'कार्यपत्रिका (Worksheets) टैब खोलें। हर कक्षा के स्तर (सपोर्ट, कोर, स्ट्रेच) के अनुसार प्रश्न तैयार होते हैं। "प्रिंट" दबाकर बच्चों को हल करने के लिए दें।'
          : lang === 'mr'
          ? 'कार्यपत्रिका (Worksheets) टॅब उघडा. प्रत्येक इयत्तेच्या पातळीनुसार (सपोर्ट, कोर, स्ट्रेच) प्रश्न तयार होतात. "प्रिंट" करून मुलांना सोडवायला द्या.'
          : 'Switch to the Worksheets tab. Differentiated practice sheets (Support, Core, Stretch) with answer keys are generated for each grade. Print or write them on the board.',
    },
    {
      num: 3,
      title:
        lang === 'hi'
          ? '३. चक्र टाइमर शुरू करें'
          : lang === 'mr'
          ? '३. चक्र टाइमर सुरू करा'
          : '3. Start Rotation Timer',
      icon: '⏱️',
      desc:
        lang === 'hi'
          ? 'चक्र (Rotation) टैब पर जाएं और कुल समय तय करें। टाइमर शुरू करें - आवाज़ (बीप) बजने पर अगले कक्षा समूह को प्रत्यक्ष शिक्षण दें, बाकी बच्चे स्वतंत्र कार्य करेंगे।'
          : lang === 'mr'
          ? 'चक्र (Rotation) टॅबवर जाऊन एकूण तासिका वेळ ठरवा. टाइमर सुरू करा - बीप वाजल्यावर पुढील वर्गाकडे जा, इतर मुले स्वतःचा सराव पूर्ण करतील.'
          : 'Open Rotation, set period duration, and tap Start. Audible chimes indicate when to rotate teacher-led attention, while other groups complete self-work.',
    },
  ];

  const current = steps[step];

  return (
    <div className="welcome-backdrop no-print" role="presentation" onClick={onClose}>
      <div
        className="welcome-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label={lang === 'hi' ? 'मार्गदर्शिका बंद करें' : lang === 'mr' ? 'मार्गदर्शिका बंद करा' : 'Close guide'}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: 8,
            minWidth: 42,
            minHeight: 42,
          }}
        >
          ✕
        </button>

        <div className="welcome-icon" aria-hidden="true">
          {current.icon}
        </div>
        <h2 id="welcome-title">{current.title}</h2>
        <p>{current.desc}</p>

        <div className="welcome-dots" role="tablist" aria-label="Steps">
          {steps.map((s, i) => (
            <button
              key={s.num}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`Step ${s.num}`}
              className={`dot ${i === step ? 'active' : ''}`}
              onClick={() => setStep(i)}
              style={{ minWidth: 24, minHeight: 24, border: 'none', padding: 0 }}
            />
          ))}
        </div>

        <div className="welcome-actions">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)}>
              {lang === 'hi' ? 'पिछला' : lang === 'mr' ? 'मागे' : 'Back'}
            </button>
          )}
          {step < steps.length - 1 ? (
            <button type="button" className="primary" onClick={() => setStep(step + 1)}>
              {lang === 'hi' ? 'अगला' : lang === 'mr' ? 'पुढे' : 'Next'}
            </button>
          ) : (
            <button type="button" className="primary" onClick={onClose}>
              {lang === 'hi' ? 'समझ गए / शुरू करें' : lang === 'mr' ? 'समजले / सुरू करा' : 'Got it / Start teaching'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
