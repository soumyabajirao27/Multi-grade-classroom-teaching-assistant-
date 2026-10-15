import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Sheet } from '../components/Sheet';
import { db } from '../db/db';
import { buildWorksheet } from '../engine/worksheet';
import { suggestTier } from '../engine/progress';
import { buildRotation } from '../engine/rotation';
import { t } from '../i18n';
import { getTopic } from '../content/curriculum';
import { TIERS, resolveL10n, type Grade, type GradeTopicMap, type Lang, type SessionMode, type Tier, type Topic, type Worksheet } from '../types';

interface WorksheetsProps {
  lang: Lang;
  topic: Topic;
  grades: Grade[];
  periodTotal?: number;
  passes?: 1 | 2;
  openingMinutes?: number;
  mode?: SessionMode;
  gradeTopics?: GradeTopicMap;
}

export function Worksheets({
  lang,
  topic,
  grades,
  periodTotal = 40,
  passes = 1,
  openingMinutes = 5,
  mode = 'theme',
  gradeTopics = {},
}: WorksheetsProps) {
  const students = useLiveQuery(() => db.students.toArray(), [], []);
  const records = useLiveQuery(() => db.records.toArray(), [], []);
  const [seed, setSeed] = useState('class-1');
  const [diff, setDiff] = useState(true);
  const [key, setKey] = useState(false);
  const [includeSchedule, setIncludeSchedule] = useState(true);
  const [includeQuickStart, setIncludeQuickStart] = useState(true);

  const effectivePasses: 1 | 2 = grades.length <= 1 ? 1 : passes;

  const getTopicForGrade = useMemo(() => {
    return (g: Grade): Topic => {
      if (mode === 'multi_subject' && gradeTopics[g]) {
        return getTopic(gradeTopics[g]!);
      }
      return topic;
    };
  }, [mode, gradeTopics, topic]);

  const sheets = useMemo(() => {
    const out: Worksheet[] = [];
    for (const g of [...grades].sort()) {
      const activeTopic = getTopicForGrade(g);
      const kids = students.filter((s) => s.grade === g);
      if (!diff || !kids.length) {
        const ws = buildWorksheet({ topic: activeTopic, grade: g, tier: 'core', seed, students: kids.map((k) => k.name), lang });
        ws.subject = activeTopic.subject;
        out.push(ws);
        continue;
      }
      const byTier = new Map<Tier, string[]>();
      for (const k of kids) {
        const tier = suggestTier(records.filter((r) => r.studentId === k.id && r.topicId === activeTopic.id));
        byTier.set(tier, [...(byTier.get(tier) ?? []), k.name]);
      }
      for (const tier of TIERS) {
        if (byTier.has(tier)) {
          const ws = buildWorksheet({ topic: activeTopic, grade: g, tier, seed, students: byTier.get(tier), lang });
          ws.subject = activeTopic.subject;
          out.push(ws);
        }
      }
    }
    return out;
  }, [grades, students, records, topic, seed, diff, lang, getTopicForGrade]);

  const rotation = useMemo(() => {
    if (!grades.length) return null;
    return buildRotation(topic, grades, periodTotal, openingMinutes, effectivePasses, mode === 'multi_subject' ? getTopicForGrade : undefined);
  }, [topic, grades, periodTotal, openingMinutes, effectivePasses, mode, getTopicForGrade]);


  const actualOpening = rotation?.opening ?? openingMinutes;
  const actualPeriodTotal = rotation?.total ?? periodTotal;
  const rotationSlotsEnd = rotation?.slots.length ? rotation.slots[rotation.slots.length - 1].end : actualPeriodTotal;

  const handlePrintPack = () => {
    setIncludeSchedule(true);
    setIncludeQuickStart(true);
    setTimeout(() => window.print(), 50);
  };

  const handleDownloadPdf = () => {
    const msg =
      lang === 'hi'
        ? 'पीडीएफ (PDF) डाउनलोड करने के लिए: प्रिंट विंडो में "Destination" को "Save as PDF" चुनें।'
        : lang === 'mr'
        ? 'पीडीएफ (PDF) डाउनलोड करण्यासाठी: प्रिंट विंडोमध्ये "Destination" म्हणून "Save as PDF" निवडा.'
        : 'To save as PDF: In the print dialog, change "Destination" to "Save as PDF".';
    alert(msg);
    window.print();
  };

  if (!grades.length) return <p>{t(lang, 'noGrades')}</p>;
  return (
    <div>
      <div className="bar no-print">
        <button type="button" className="primary" onClick={handlePrintPack} title="Print Quick Start + Rotation Schedule + All Worksheets">
          📦 {lang === 'hi' ? 'प्रिंट पैक (शेड्यूल + वर्कशीट)' : lang === 'mr' ? 'प्रिंट पॅक (शेड्युल + वर्कशीट)' : 'Print Pack'}
        </button>
        <button type="button" onClick={() => window.print()}>
          🖨️ {t(lang, 'print')}
        </button>
        <button type="button" onClick={handleDownloadPdf}>
          📥 {lang === 'hi' ? 'पीडीएफ डाउनलोड' : lang === 'mr' ? 'PDF डाउनलोड' : 'Download PDF'}
        </button>
        <button type="button" onClick={() => setSeed(Math.random().toString(36).slice(2, 7))}>
          {t(lang, 'regenerate')}
        </button>
        <label>
          <input type="checkbox" checked={includeQuickStart} onChange={(e) => setIncludeQuickStart(e.target.checked)} />{' '}
          {lang === 'hi' ? 'त्वरित मार्गदर्शिका शामिल करें' : lang === 'mr' ? 'जलद मार्गदर्शिका समाविष्ट करा' : 'Include Quick Start (A4)'}
        </label>
        <label>
          <input type="checkbox" checked={includeSchedule} onChange={(e) => setIncludeSchedule(e.target.checked)} />{' '}
          {lang === 'hi' ? 'शेड्यूल शामिल करें' : lang === 'mr' ? 'शेड्युल समाविष्ट करा' : 'Include Schedule'}
        </label>
        <label>
          <input type="checkbox" checked={diff} onChange={(e) => setDiff(e.target.checked)} /> {t(lang, 'differentiate')}
        </label>
        <label>
          <input type="checkbox" checked={key} onChange={(e) => setKey(e.target.checked)} /> {t(lang, 'showKey')}
        </label>
      </div>
      {!students.length && <p className="small no-print">{t(lang, 'noKid')}</p>}

      <div className="print-area">
        {includeQuickStart && (
          <div className="print-pack-quickstart page-break-after">
            <div className="print-pack-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
                  {lang === 'hi'
                    ? 'शिक्षक त्वरित मार्गदर्शिका (3 चरण)'
                    : lang === 'mr'
                    ? 'शिक्षक जलद मार्गदर्शिका (३ पायऱ्या)'
                    : 'Teacher Quick Start Guide (3 Steps)'}
                </h2>
                <div style={{ color: '#444', fontSize: '0.9rem', marginTop: 4 }}>
                  {resolveL10n(topic.title, lang)} • {grades.map((g) => `Grade ${g}`).join(', ')}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <div>Multi-Grade Assistant</div>
                <div>Print Pack • Page 1</div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ border: '2px solid #1b4940', borderRadius: 8, padding: 14, background: '#f4f9f7' }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#1b4940', fontSize: '1.15rem' }}>
                  {lang === 'hi'
                    ? `चरण 1: साझा हुक और विषय परिचय (0 - ${actualOpening} मिनट)`
                    : lang === 'mr'
                    ? `पायरी १: एकत्रित हुक आणि संकल्पना परिचय (० - ${actualOpening} मिनिटे)`
                    : `Step 1: Whole-Class Hook & Common Theme (0 - ${actualOpening} min)`}
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {lang === 'hi'
                    ? 'सभी कक्षाओं को एक साथ बैठाएं। साझा विषय पर हुक प्रश्न पूछें या कोई वस्तु/चित्र दिखाकर बातचीत शुरू करें। प्रत्येक विद्यार्थी अपनी समझ के स्तर पर उत्तर देगा।'
                    : lang === 'mr'
                    ? 'सर्व इयत्तांच्या विद्यार्थ्यांना एकत्र बसवा. मध्यवर्ती संकल्पनेवर आधारित हुक प्रश्न विचारा किंवा वस्तू दाखवून चर्चा सुरू करा. प्रत्येक मूल आपापल्या पातळीवर जोडले जाईल.'
                    : 'Gather all grades together on the rug or floor. Introduce the shared theme using the opening hook question or real-life object. All students engage simultaneously at their own level.'}
                </p>
                <div style={{ marginTop: 8, padding: 8, background: '#e1ede8', borderRadius: 4, fontSize: '0.9rem' }}>
                  <strong>{lang === 'hi' ? 'आज का हुक' : lang === 'mr' ? 'आजचा हुक' : "Today's Hook"}:</strong> {resolveL10n(topic.hook, lang)}
                </div>
              </div>

              <div style={{ border: '2px solid #2471a3', borderRadius: 8, padding: 14, background: '#f3f8fc' }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#2471a3', fontSize: '1.15rem' }}>
                  {lang === 'hi'
                    ? `चरण 2: चक्रीय शिक्षण और स्तरित कार्यपत्रक (${actualOpening} - ${rotationSlotsEnd} मिनट)`
                    : lang === 'mr'
                    ? `पायरी २: चक्रीय मार्गदर्शन आणि स्तरित कार्यपत्रिका (${actualOpening} - ${rotationSlotsEnd} मिनिटे)`
                    : `Step 2: Rotational Teaching & Differentiated Practice (${actualOpening} - ${rotationSlotsEnd} min)`}
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {lang === 'hi'
                    ? 'प्रत्यक्ष मार्गदर्शन के लिए एक कक्षा को अपने पास बुलाएं। शेष कक्षाएं अपने स्तर के कार्यपत्रक (सपोर्ट/कोर/स्ट्रेच) हल करेंगी या जोड़ी में स्वाध्याय करेंगी। कक्षा 1-2 के बच्चों को बड़े साथी (Peer Buddy) के साथ बैठाएं।'
                    : lang === 'mr'
                    ? 'प्रत्यक्ष शिकवण्यासाठी एका इयत्तेला जवळ घ्या. इतर इयत्ता त्यांच्या स्तरावरील कार्यपत्रिका (सपोर्ट/कोर/स्ट्रेच) किंवा जोडीने स्वाध्याय सोडवतील. इयत्ता १-२ च्या विद्यार्थ्यांना मोठ्या वर्गमित्राची (बडी) मदत द्या.'
                    : 'Rotate direct teacher instruction to one grade cluster at a time. Other grades work on their differentiated worksheets (Support, Core, or Stretch) or pair tasks. Pair Grades 1-2 with older peer buddies when working independently.'}
                </p>
              </div>

              <div style={{ border: '2px solid #7d3c98', borderRadius: 8, padding: 14, background: '#faf5fc' }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#7d3c98', fontSize: '1.15rem' }}>
                  {lang === 'hi'
                    ? `चरण 3: जाँच, प्रगति दर्ज और समापन (${rotationSlotsEnd} - ${actualPeriodTotal} मिनट)`
                    : lang === 'mr'
                    ? `पायरी ३: तपासणी, प्रगती नोंद आणि सांगता (${rotationSlotsEnd} - ${actualPeriodTotal} मिनिटे)`
                    : `Step 3: Review, Record Progress & Wrap-up (${rotationSlotsEnd} - ${actualPeriodTotal} min)`}
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {lang === 'hi'
                    ? 'शीघ्र कार्य पूरा करने वालों (Early Finisher) की जांच करें। प्रगती ट्रैकर में छात्रों की स्थिति (हो गया / मदद चाहिए) दर्ज करें। कार्यपत्रक जमा करें और कल के स्तर की योजना बनाएं।'
                    : lang === 'mr'
                    ? 'लवकर पूर्ण करणाऱ्यांचे (Early Finisher) काम तपासा. ॲपमध्ये विद्यार्थ्यांची प्रगती नोंदवा (पूर्ण / मदतीची गरज). कार्यपत्रिका गोळा करा आणि उद्याच्या स्तराचे नियोजन करा.'
                    : 'Check early-finisher tasks. Record each student’s status (Done / Needs Help / Stretch) in the Progress Tracker. Collect worksheets for student portfolios.'}
                </p>
              </div>

              <div style={{ marginTop: 8, padding: 10, border: '1px dashed #666', borderRadius: 6, fontSize: '0.85rem', color: '#333' }}>
                💡 <strong>{lang === 'hi' ? 'शिक्षक टिप' : lang === 'mr' ? 'शिक्षक टीप' : 'Teacher Tip'}:</strong>{' '}
                {lang === 'hi'
                  ? 'यदि कक्षा 1 या 2 को अतिरिक्त मार्गदर्शन चाहिए, तो 2 फेरों (2 Passes) वाला रोटेशन चुनें ताकि हर बच्चे को शिक्षक का समय मिल सके।'
                  : lang === 'mr'
                  ? 'जर इयत्ता १ किंवा २ ला अधिक वेळ हवा असेल, तर २ फेऱ्यांचा (2 Passes) रोटेशन पर्याय निवडा जेणेकरून प्रत्येकाला लक्ष मिळेल.'
                  : 'If Grades 1 or 2 need frequent re-direction, use the 2-Pass rotation option to give them multiple shorter teacher touchpoints.'}
              </div>
            </div>
          </div>
        )}

        {includeSchedule && rotation && (
          <div className="print-pack-schedule page-break-after">
            <div className="print-pack-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
                  {resolveL10n(topic.title, lang)} — {lang === 'hi' ? 'कक्षा रोटेशन तालिका' : lang === 'mr' ? 'वर्ग रोटेशन वेळापत्रक' : 'Classroom Rotation Schedule'}
                </h2>
                <div style={{ color: '#444', fontSize: '0.9rem', marginTop: 4 }}>
                  {lang === 'hi' ? 'कक्षाएं' : lang === 'mr' ? 'इयत्ता' : 'Grades'}: {grades.map((g) => `Grade ${g}`).join(', ')} • {actualPeriodTotal}{' '}
                  {lang === 'hi' ? 'मिनट' : lang === 'mr' ? 'मिनिटे' : 'min'}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <div>Date: ____________</div>
                <div>Teacher: ____________</div>
              </div>
            </div>

            {actualOpening > 0 && (
              <div style={{ marginBottom: 12, padding: 8, background: '#f5f5f5', borderRadius: 4, fontSize: '0.9rem' }}>
                <strong>0:00 - {actualOpening}:00 ({lang === 'hi' ? 'साझा शुरुआत' : lang === 'mr' ? 'एकत्रित सुरुवात' : 'Whole-class Opening Hook'}):</strong>{' '}
                {resolveL10n(topic.hook, lang)}
              </div>
            )}

            <table className="print-pack-table">
              <thead>
                <tr>
                  <th style={{ width: grades.length > 1 ? '12%' : '18%' }}>{lang === 'hi' ? 'समय' : lang === 'mr' ? 'वेळ' : 'Time'}</th>
                  <th style={{ width: grades.length > 1 ? '15%' : '22%' }}>{lang === 'hi' ? 'प्रत्यक्ष मार्गदर्शन' : lang === 'mr' ? 'प्रत्यक्ष शिकवणे' : 'Direct Teacher'}</th>
                  <th style={{ width: grades.length > 1 ? '40%' : '60%' }}>{lang === 'hi' ? 'शिक्षक चरण व अवलोकन' : lang === 'mr' ? 'शिक्षक पायऱ्या व निरीक्षण' : 'Teacher Steps & Checklist'}</th>
                  {grades.length > 1 && (
                    <th style={{ width: '33%' }}>{lang === 'hi' ? 'अन्य कक्षाओं का स्वाध्याय' : lang === 'mr' ? 'इतर इयत्तांचा स्वाध्याय' : 'Other Grades Solo/Peer Task'}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rotation.slots.map((s, idx) => {
                  const gData = topic.grades[s.grade];
                  const checklist = gData.checklist?.map((c) => resolveL10n(c, lang)).join('; ') ?? '';
                  const otherGrades = grades.filter((g) => g !== s.grade);
                  return (
                    <tr key={idx}>
                      <td>
                        <strong>
                          {s.start}:00 - {s.end}:00
                        </strong>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>({s.minutes} min)</div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '1.05rem' }}>Grade {s.grade}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{resolveL10n(gData.outcome, lang)}</div>
                        {checklist && (
                          <div style={{ fontSize: '0.82rem', marginTop: 4, color: '#333' }}>
                            <em>Checklist:</em> {checklist}
                          </div>
                        )}
                      </td>
                      {grades.length > 1 && (
                        <td style={{ fontSize: '0.85rem' }}>
                          {otherGrades.map((og) => {
                            const ogData = topic.grades[og];
                            return (
                              <div key={og} style={{ marginBottom: 4 }}>
                                <strong>G{og}:</strong> {resolveL10n(ogData.independent.title, lang)} — {resolveL10n(ogData.independent.instructions, lang)}
                              </div>
                            );
                          })}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {sheets.map((w) => (
          <Sheet key={w.id} ws={w} lang={lang} showKey={key} />
        ))}
      </div>
    </div>
  );
}
