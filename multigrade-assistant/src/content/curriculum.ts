import type { CurriculumMapping, GenSpec, GradePlan, Localizable, StaticItem, Topic } from '../types';

/**
 * CONTENT LIBRARY. Add a topic by appending to TOPICS: one theme, five grade plans.
 * Mapping to NCERT / state-board chapters is explicitly marked 'to-verify' until verified against textbooks.
 */
const item = (
  q: Localizable,
  a: Localizable,
  extra: {
    support?: [Localizable, Localizable];
    stretch?: [Localizable, Localizable];
    kind?: 'short' | 'draw';
    sameAcrossTiers?: boolean;
    sameReason?: string;
  } = {}
): StaticItem => {
  const sameAcrossTiers = Boolean(extra.sameAcrossTiers);
  return {
    core: { q, a },
    support: extra.support ? { q: extra.support[0], a: extra.support[1] } : undefined,
    stretch: extra.stretch ? { q: extra.stretch[0], a: extra.stretch[1] } : undefined,
    kind: extra.kind,
    sameAcrossTiers,
    sameReason: extra.sameReason,
  };
};

const gen = (g: GenSpec['gen'], count: number, o: Partial<GenSpec> = {}): GenSpec => ({ type: 'gen', gen: g, count, ...o });

import { migrateCurriculumMapping } from './curriculumSources';

const defaultMapping = (subject: string): CurriculumMapping[] => [
  migrateCurriculumMapping({ board: 'Maharashtra State Board', textbook: `${subject} (Balbharati / State Board)`, chapter: 'TO RESEARCH', status: 'to-verify' }),
  migrateCurriculumMapping({ board: 'NCERT', textbook: `${subject} (NCERT)`, chapter: 'TO RESEARCH', status: 'to-verify' }),
];

const water: Topic = {
  id: 'evs-water',
  subject: 'evs',
  title: { en: 'Water (EVS)', hi: 'जल (पर्यावरण अध्ययन)', mr: 'पाणी (परिसर अभ्यास)' },
  theme: { en: 'Water in our village', hi: 'हमारे गाँव में पानी', mr: 'आमच्या गावातील पाणी' },
  hook: {
    en: 'Hold up a glass of water. Ask: "Where did this water come from, and where will it go?" Let each grade answer in its own way.',
    hi: 'पानी का एक गिलास दिखाएं। पूछें: "यह पानी कहाँ से आया और कहाँ जाएगा?" हर कक्षा को अपने स्तर पर उत्तर देने दें।',
    mr: 'पाण्याचा एक ग्लास दाखवा. विचारा: "हे पाणी कुठून आले आणि कुठे जाईल?" प्रत्येक इयत्तेला त्यांच्या पद्धतीने उत्तर देऊ द्या.',
  },
  mapping: 'Draft: EVS water-related units, NCERT & Maharashtra State Board (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Names common uses and sources of water; tells clean water from dirty water.',
        hi: 'पानी के मुख्य उपयोग और स्रोत बताता है; स्वच्छ और गंदे पानी में अंतर पहचानता है।',
        mr: 'पाण्याचे मुख्य उपयोग व स्रोत सांगतो; स्वच्छ व अस्वच्छ पाण्यातला फरक ओळखतो.',
      },
      teacher: {
        title: { en: 'Picture talk: water around us', hi: 'चित्र चर्चा: हमारे आसपास पानी', mr: 'चित्रसंवाद: आपल्या सभोवतालचे पाणी' },
        minutes: 8,
        steps: [
          { en: 'Show pictures of a tap, river and well.', hi: 'नल, नदी और कुएँ के चित्र दिखाएं।', mr: 'नळ, नदी आणि विहिरीचे चित्र दाखवा.' },
          { en: 'Ask: where does your family get water?', hi: 'पूछें: आपके घर में पानी कहाँ से आता है?', mr: 'विचारा: तुमच्या घरी पाणी कुठून आणतात?' },
          { en: 'Act out washing hands, drinking and cooking.', hi: 'हाथ धोना, पानी पीना और खाना पकाने का अभिनय करें।', mr: 'हात धुणे, पाणी पिणे व स्वयंपाक करण्याचे अभिनय करा.' },
        ],
      },
      independent: {
        title: { en: 'Draw two uses of water', hi: 'पानी के दो उपयोगों का चित्र बनाएं', mr: 'पाण्याचे दोन उपयोग चित्र काढा' },
        instructions: {
          en: 'Draw two ways your family uses water. Colour the glass of clean water.',
          hi: 'आपका परिवार पानी का उपयोग कैसे करता है, ऐसे दो चित्र बनाएं। स्वच्छ पानी के गिलास में रंग भरें।',
          mr: 'तुमच्या घरी पाण्याचा वापर कसा होतो, अशी दोन चित्रे काढा. स्वच्छ पाण्याच्या ग्लासात रंग भरा.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'crayons', hi: 'मोमी रंग', mr: 'रंगखडू' },
          { en: 'drawing sheet', hi: 'ड्राइंग शीट', mr: 'चित्रकला कागद' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas Part 1'),
      earlyFinisher: {
        en: 'Draw a bucket and count how many mugs of water it takes to fill it.',
        hi: 'एक बाल्टी का चित्र बनाएं और बताएं कि इसे भरने में कितने मग पानी लगेगा।',
        mr: 'एक बादली काढा आणि ती भरण्यासाठी किती मग पाणी लागेल ते सांगा.',
      },
      checklist: [
        { en: 'Can the child name at least two natural sources of water?', hi: 'क्या बच्चा पानी के कम से कम दो प्राकृतिक स्रोतों के नाम बता सकता है?', mr: 'मूल पाण्याचे किमान दोन नैसर्गिक स्रोत सांगू शकते का?' },
        { en: 'Does the child distinguish between drinking water and washing water?', hi: 'क्या बच्चा पीने के पानी और सफाई के पानी में अंतर जानता है?', mr: 'मूल पिण्याचे पाणी आणि स्वच्छतेचे पाणी यातील फरक ओळखते का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Write one place where we get water: ______', hi: 'पानी मिलने वाले एक स्थान का नाम लिखें: ______', mr: 'आपल्याला पाणी मिळणाऱ्या एका ठिकाणाचे नाव लिहा: ______' },
          { en: 'Tap, well, river, hand pump or rain', hi: 'नल, कुआँ, नदी, हैंडपंप या बारिश', mr: 'नळ, विहीर, नदी, हातपंप किंवा पाऊस' },
          {
            support: [
              { en: 'Circle where we get water: tap / stone', hi: 'जहाँ से पानी मिलता है उस पर गोला लगाएं: नल / पत्थर', mr: 'जिथून पाणी मिळते त्याभोवती गोल करा: नळ / दगड' },
              { en: 'Tap', hi: 'नल', mr: 'नळ' },
            ],
            stretch: [
              { en: 'Write two places where we get water: ______ and ______', hi: 'पानी मिलने वाले दो स्थानों के नाम लिखें: ______ और ______', mr: 'पाणी मिळणाऱ्या दोन ठिकाणांची नावे लिहा: ______ आणि ______' },
              { en: 'Well and river', hi: 'कुआँ और नदी', mr: 'विहीर आणि नदी' },
            ],
          }
        ),
        item(
          { en: 'Draw two things we do with water.', hi: 'पानी से किए जाने वाले दो कामों के चित्र बनाएं।', mr: 'पाण्याचा वापर करून केली जाणारी दोन कामे काढा.' },
          { en: 'Any two uses, e.g. drinking, bathing', hi: 'कोई दो उपयोग, जैसे पीना, नहाना', mr: 'कोणतेही दोन उपयोग, उदा. पिणे, आंघोळ' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Visual task accessible to all Grade 1 tiers' }
        ),
        item(
          { en: 'Which water is safe to drink: boiled water or muddy pond water?', hi: 'कौन सा पानी पीने के लिए सुरक्षित है: उबला हुआ पानी या तालाब का गंदा पानी?', mr: 'पिण्यासाठी कोणते पाणी सुरक्षित आहे: उकळलेले पाणी की तळ्यातील गढूळ पाणी?' },
          { en: 'Boiled water', hi: 'उबला हुआ पानी', mr: 'उकळलेले पाणी' },
          {
            support: [
              { en: 'Is boiled water safe to drink? Yes / No', hi: 'क्या उबला हुआ पानी पीना सुरक्षित है? हाँ / नहीं', mr: 'उकळलेले पाणी पिणे सुरक्षित आहे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Why is boiled water safer than pond water?', hi: 'उबला हुआ पानी तालाब के पानी से सुरक्षित क्यों होता है?', mr: 'उकळलेले पाणी तळ्याच्या पाण्यापेक्षा अधिक सुरक्षित का असते?' },
              { en: 'Boiling kills germs', hi: 'उबालने से कीटाणु मर जाते हैं', mr: 'उकळल्याने जंतू मरतात' },
            ],
          }
        ),
      ] }],
    },
    2: {
      outcome: {
        en: 'Groups water sources (rain, river, pond, well, hand pump) and lists ways to keep water clean.',
        hi: 'पानी के स्रोतों (बारिश, नदी, तालाब, कुआँ, हैंडपंप) का वर्गीकरण करता है और पानी स्वच्छ रखने के उपाय बताता है।',
        mr: 'पाण्याचे स्रोत (पाऊस, नदी, तळे, विहीर, हातपंप) यांचे वर्गीकरण करतो आणि पाणी स्वच्छ ठेवण्याचे उपाय सांगतो.',
      },
      teacher: {
        title: { en: 'Sorting game: where does water come from?', hi: 'वर्गीकरण खेल: पानी कहाँ से आता है?', mr: 'वर्गीकरण खेळ: पाणी कुठून येते?' },
        minutes: 10,
        steps: [
          { en: 'Place picture cards: rain, river, pond, well, hand pump.', hi: 'चित्र कार्ड रखें: बारिश, नदी, तालाब, कुआँ, हैंडपंप।', mr: 'चित्रकार्डे ठेवा: पाऊस, नदी, तळे, विहीर, हातपंप.' },
          { en: 'Children sort them into "above ground" and "underground".', hi: 'बच्चे इन्हें "जमीन के ऊपर" और "जमीन के नीचे" में छाँटते हैं।', mr: 'मुले त्यांचे "जमिनीवरील" आणि "जमिनीखालील" असे वर्गीकरण करतात.' },
          { en: 'Discuss: how can we keep these sources clean?', hi: 'चर्चा करें: हम इन स्रोतों को स्वच्छ कैसे रख सकते हैं?', mr: 'चर्चा करा: हे जलस्रोत आपण स्वच्छ कसे ठेवू शकतो?' },
        ],
      },
      independent: {
        title: { en: 'Sources and clean habits', hi: 'जलस्रोत और स्वच्छता की आदतें', mr: 'जलस्रोत आणि स्वच्छतेच्या सवयी' },
        instructions: {
          en: 'Look at the source cards. Write three sources and one way to keep each clean.',
          hi: 'कार्ड देखें। तीन स्रोतों के नाम और प्रत्येक को स्वच्छ रखने का एक उपाय लिखें।',
          mr: 'कार्डे पहा. तीन स्रोतांची नावे आणि प्रत्येक स्वच्छ ठेवण्याचा एक उपाय लिहा.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [
          { en: 'source cards', hi: 'स्रोत कार्ड', mr: 'स्रोत कार्डे' },
          { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas Part 1'),
      earlyFinisher: {
        en: 'List three containers used at home to store drinking water.',
        hi: 'घर पर पीने का पानी रखने के तीन बर्तनों के नाम लिखें।',
        mr: 'घरी पिण्याचे पाणी साठवण्यासाठी वापरल्या जाणाऱ्या तीन भांड्यांची नावे लिहा.',
      },
      checklist: [
        { en: 'Can the student categorize well vs. river water?', hi: 'क्या बच्चा कुएँ और नदी के पानी में भेद कर सकता है?', mr: 'विद्यार्थी विहिरीचे आणि नदीचे पाणी यांत फरक ओळखतो का?' },
        { en: 'Does the student know never to dip dirty hands in drinking pots?', hi: 'क्या बच्चा जानता है कि पीने के पानी में गंदे हाथ नहीं डालने चाहिए?', mr: 'विद्यार्थ्याला पिण्याच्या पाण्यात हात बुडवू नये हे ठाऊक आहे का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Write the names of 3 water sources.', hi: 'पानी के 3 स्रोतों के नाम लिखें।', mr: 'पाण्याच्या 3 स्रोतांची नावे लिहा.' },
          { en: 'River, well, hand pump, pond or rain', hi: 'नदी, कुआँ, हैंडपंप, तालाब या बारिश', mr: 'नदी, विहीर, हातपंप, तळे किंवा पाऊस' },
          {
            support: [
              { en: 'Name 2 water sources: ______ and ______', hi: 'पानी के 2 स्रोत लिखें: ______ और ______', mr: 'पाण्याचे 2 स्रोत लिहा: ______ आणि ______' },
              { en: 'Well and river', hi: 'कुआँ और नदी', mr: 'विहीर आणि नदी' },
            ],
            stretch: [
              { en: 'Write 3 water sources and circle the underground source.', hi: 'पानी के 3 स्रोत लिखें और जमीन के नीचे वाले स्रोत पर गोला लगाएं।', mr: 'पाण्याचे 3 स्रोत लिहा आणि जमिनीखालील स्रोतावर गोल करा.' },
              { en: 'Well/hand pump is underground', hi: 'कुआँ/हैंडपंप जमीन के नीचे है', mr: 'विहीर/हातपंप जमिनीखालील आहे' },
            ],
          }
        ),
        item(
          { en: 'Name one way to keep drinking water clean.', hi: 'पीने का पानी स्वच्छ रखने का एक उपाय लिखें।', mr: 'पिण्याचे पाणी स्वच्छ ठेवण्याचा एक उपाय लिहा.' },
          { en: 'Cover it; use a clean ladle; keep waste away', hi: 'ढककर रखें; स्वच्छ बर्तन का उपयोग करें', mr: 'भांडे झाकून ठेवा; स्वच्छ ओगराळे वापरा' },
          {
            support: [
              { en: 'Should drinking water be kept covered? Yes / No', hi: 'क्या पीने का पानी ढककर रखना चाहिए? हाँ / नहीं', mr: 'पिण्याचे पाणी झाकून ठेवावे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Give two rules for keeping drinking water safe at school.', hi: 'स्कूल में पीने का पानी सुरक्षित रखने के दो नियम लिखें।', mr: 'शाळेत पिण्याचे पाणी सुरक्षित ठेवण्यासाठी दोन नियम लिहा.' },
              { en: 'Keep pot covered and use ladle with handle', hi: 'मटका ढककर रखें और डंडीदार लोटे से निकालें', mr: 'माठ झाकून ठेवा आणि दांड्याच्या ओगराळ्याने पाणी घ्या' },
            ],
          }
        ),
        item(
          { en: 'Why should we not throw waste in a pond?', hi: 'हमें तालाब में कचरा क्यों नहीं फेंकना चाहिए?', mr: 'तळ्यात कचरा का टाकू नये?' },
          { en: 'It makes water dirty and harms fish and people', hi: 'यह पानी को गंदा करता है और लोगों व जीवों को बीमार करता है', mr: 'पाणी दूषित होते आणि जलचर व माणसे आजारी पडतात' },
          {
            support: [
              { en: 'Does throwing garbage make pond water dirty? Yes / No', hi: 'क्या कचरा फेंकने से तालाब का पानी गंदा होता है? हाँ / नहीं', mr: 'कचरा टाकल्याने तळ्याचे पाणी अस्वच्छ होते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Why should we not throw waste in a pond? Give 2 reasons.', hi: 'तालाब में कचरा क्यों नहीं फेंकना चाहिए? 2 कारण दें।', mr: 'तळ्यात कचरा का टाकू नये? २ कारणे द्या.' },
              { en: 'Dirty water, harms fish, makes people ill', hi: 'पानी गंदा होता है, मछलियाँ मरती हैं, लोग बीमार पड़ते हैं', mr: 'पाणी दूषित होते, मासे मरतात, लोक आजारी पडतात' },
            ],
          }
        ),
      ] }],
    },
    3: {
      outcome: {
        en: 'Explains evaporation and condensation using everyday observations.',
        hi: 'दैनिक अनुभवों के आधार पर वाष्पीकरण और संघनन की व्याख्या करता है।',
        mr: 'दैनंदिन निरीक्षणांवरून बाष्पीभवन आणि संघनन स्पष्ट करतो.',
      },
      teacher: {
        title: { en: 'Evaporation demo', hi: 'वाष्पीकरण प्रयोग', mr: 'बाष्पीभवन प्रात्यक्षिक' },
        minutes: 12,
        steps: [
          { en: 'Wet a patch on the board or slate and watch it dry.', hi: 'बोर्ड या स्लेट पर पानी का गीला निशान बनाएं और उसे सूखते देखें।', mr: 'फळ्यावर किंवा पाटीवर पाण्याचा ओला डाग पाडून तो सुकताना दाखवा.' },
          { en: 'Ask: where did the water go?', hi: 'पूछें: पानी कहाँ चला गया?', mr: 'विचारा: ते पाणी कुठे गेले?' },
          { en: 'Introduce the words evaporation and cloud.', hi: 'वाष्पीकरण और बादल शब्दों का परिचय दें।', mr: 'बाष्पीभवन आणि ढग या संकल्पनांची ओळख करून द्या.' },
        ],
      },
      independent: {
        title: { en: 'Drying experiment', hi: 'सूखने का प्रयोग', mr: 'सुकण्याचा प्रयोग' },
        instructions: {
          en: 'Put two wet cloth pieces, one in sun and one in shade. Note which dries first.',
          hi: 'दो गीले कपड़े रखें, एक धूप में और एक छाया में। देखें कौन सा पहले सूखता है।',
          mr: 'दोन ओले कापड ठेवा, एक उन्हात आणि एक सावलीत. कोणते आधी सुकते ते नोंदवा.',
        },
        minutes: 15,
        mode: 'group',
        materials: [
          { en: '2 cloth pieces', hi: '2 कपड़े के टुकड़े', mr: '२ कापडाचे तुकडे' },
          { en: 'water', hi: 'पानी', mr: 'पाणी' },
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas Part 1'),
      earlyFinisher: {
        en: 'Blow warm breath on a cool mirror or steel plate and observe the water droplets (condensation).',
        hi: 'ठंडे शीशे या स्टील की प्लेट पर फूँक मारें और पानी की बूँदें देखें (संघनन)।',
        mr: 'थंड आरशावर किंवा स्टीलच्या ताटावर वाफ सोडा आणि पाण्याचे थेंब पाहा (संघनन).',
      },
      checklist: [
        { en: 'Can the child link evaporation to heat/sunlight?', hi: 'क्या बच्चा वाष्पीकरण को धूप/गर्मी से जोड़ पाता है?', mr: 'मूल बाष्पीभवनाचा संबंध उष्णता/उन्हाशी जोडते का?' },
        { en: 'Does the child understand water turns into vapour?', hi: 'क्या बच्चा समझता है कि पानी भाप में बदलता है?', mr: 'पाण्याचे वाफेमध्ये रूपांतर होते हे मूल समजते का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'What is evaporation? Write one line.', hi: 'वाष्पीकरण क्या है? एक पंक्ति में लिखें।', mr: 'बाष्पीभवन म्हणजे काय? एका ओळीत लिहा.' },
          { en: 'Water turning into vapour (gas), faster with heat', hi: 'पानी का भाप (गैस) में बदलना, जो गर्मी से तेज होता है', mr: 'पाण्याचे वाफेमध्ये रूपांतर होणे (उष्णतेमुळे वेग वाढतो)' },
          {
            support: [
              { en: 'When water turns into vapour, it is called ______ (evaporation / freezing).', hi: 'जब पानी भाप बनता है तो उसे ______ कहते हैं (वाष्पीकरण / जमना)।', mr: 'पाणी वाफेत रूपांतरित होते त्या क्रियेस ______ म्हणतात (बाष्पीभवन / गोठणे).' },
              { en: 'Evaporation', hi: 'वाष्पीकरण', mr: 'बाष्पीभवन' },
            ],
            stretch: [
              { en: 'Explain evaporation with an everyday village example.', hi: 'गाँव के किसी दैनिक उदाहरण से वाष्पीकरण को समझाइए।', mr: 'गावातील दैनंदिन उदाहरणासह बाष्पीभवन स्पष्ट करा.' },
              { en: 'Water in wet clothes turns into vapour in sunlight', hi: 'धूप में गीले कपड़ों का पानी भाप बनकर उड़ जाता है', mr: 'उन्हात वाळत घातलेल्या कपड्यांतील पाणी बाष्पीभवनाने हवेत जाते' },
            ],
          }
        ),
        item(
          { en: 'Why do wet clothes dry faster in the sun?', hi: 'धूप में गीले कपड़े जल्दी क्यों सूखते हैं?', mr: 'उन्हात ओले कपडे लवकर का वाळतात?' },
          { en: 'Heat makes water evaporate faster', hi: 'गर्मी से वाष्पीकरण तेजी से होता है', mr: 'उष्णतेमुळे पाण्याचे बाष्पीभवन जलद गतीने होते' },
          {
            support: [
              { en: 'Do wet clothes dry faster in sun or in shade?', hi: 'गीले कपड़े कहाँ जल्दी सूखते हैं: धूप में या छाया में?', mr: 'ओले कपडे कुठे लवकर वाळतात: उन्हात की सावलीत?' },
              { en: 'Sun', hi: 'धूप में', mr: 'उन्हात' },
            ],
            stretch: [
              { en: 'List two factors that make clothes dry faster.', hi: 'कपड़े जल्दी सुखाने वाले दो कारक लिखिए।', mr: 'कपडे लवकर वाळण्यासाठी मदत करणारे दोन घटक लिहा.' },
              { en: 'Sunlight (heat) and wind', hi: 'धूप (गर्मी) और हवा', mr: 'उष्णता (ऊन) आणि वारा' },
            ],
          }
        ),
        item(
          { en: 'Draw a cloud and rain. Label the cloud.', hi: 'बादल और बारिश का चित्र बनाएं। बादल का नाम लिखें।', mr: 'ढग आणि पावसाचे चित्र काढा. ढगाला नाव द्या.' },
          { en: 'Cloud labelled, rain drops below it', hi: 'बादल नामांकित, नीचे बारिश की बूंदें', mr: 'ढगाचे नाव, खाली पाण्याचे थेंब' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Diagram drawing accessible across tiers' }
        ),
        item(
          { en: 'Name one more thing that dries by evaporation.', hi: 'वाष्पीकरण से सूखने वाली किसी एक और चीज़ का नाम लिखें।', mr: 'बाष्पीभवनाने वाळणाऱ्या आणखी एका गोष्टीचे नाव लिहा.' },
          { en: 'Puddle, wet road, hair, wet slate', hi: 'गड्ढे का पानी, गीली सड़क, बाल, गीली स्लेट', mr: 'डबके, रस्ता, केस, ओली पाटी' },
          {
            support: [
              { en: 'Does a puddle of water dry up because of the sun? Yes / No', hi: 'क्या बारिश का गड्ढा धूप से सूख जाता है? हाँ / नहीं', mr: 'रस्त्यावरील साचलेले पाणी उन्हामुळे सुकते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name two places where water puddles evaporate quickly.', hi: 'ऐसे दो स्थान बताइए जहाँ पानी के गड्ढे जल्दी सूखते हैं।', mr: 'अशी दोन ठिकाणे सांगा जिथे साचलेले पाणी लवकर बाष्पीभवन पावते.' },
              { en: 'Open playground and paved road', hi: 'खुला मैदान और पक्की सड़क', mr: 'उघडे मैदान आणि डांबरी रस्ता' },
            ],
          }
        ),
      ] }],
    },
    4: {
      outcome: {
        en: 'Puts the stages of the water cycle in order and suggests rainwater harvesting.',
        hi: 'जल चक्र के चरणों को क्रमबद्ध करता है और वर्षा जल संचयन के उपाय सुझाता है।',
        mr: 'जलचक्राचे टप्पे योग्य क्रमाने लावतो आणि पावसाचे पाणी साठवण्याच्या पद्धती सांगतो.',
      },
      teacher: {
        title: { en: 'Build the water cycle', hi: 'जल चक्र का निर्माण', mr: 'जलचक्राची रचना' },
        minutes: 12,
        steps: [
          { en: 'Write four stage names on cards: evaporation, condensation, rain, collection.', hi: 'कार्ड पर चार चरण लिखें: वाष्पीकरण, संघनन, वर्षा, संग्रहण।', mr: 'चार टप्प्यांची नावे कार्डांवर लिहा: बाष्पीभवन, संघनन, पाऊस, साठवण.' },
          { en: 'Groups order the cards on the board.', hi: 'समूह बोर्ड पर कार्डों को सही क्रम में लगाते हैं।', mr: 'गट फळ्यावर कार्डे योग्य क्रमाने लावतात.' },
          { en: 'Discuss how a village can store rainwater.', hi: 'चर्चा करें कि गाँव वर्षा का पानी कैसे संचित कर सकता है।', mr: 'गावात पावसाचे पाणी कसे साठवता येईल यावर चर्चा करा.' },
        ],
      },
      independent: {
        title: { en: 'Draw and label the water cycle', hi: 'जल चक्र का चित्र और नामकरण', mr: 'जलचक्राचे चित्र व नामनिर्देशन' },
        instructions: {
          en: 'Draw the water cycle with arrows. Label all four stages.',
          hi: 'तीरों के साथ जल चक्र का चित्र बनाएं। सभी चार चरणों के नाम लिखें।',
          mr: 'बाणांच्या साहाय्याने जलचक्राचे चित्र काढा. चारही टप्प्यांना नावे द्या.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
          { en: 'colour pencils', hi: 'रंगीन पेंसिल', mr: 'रंगीत पेन्सिल' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas Part 1'),
      earlyFinisher: {
        en: 'Write two slogans on saving water in Marathi or Hindi.',
        hi: 'पानी बचाने पर दो नारे (स्लोगन) लिखें।',
        mr: 'पाणी बचतीवर दोन घोषवाक्ये लिहा (उदा. पाणी अडवा, पाणी जिरवा).',
      },
      checklist: [
        { en: 'Can the child place all 4 stages of the water cycle in sequence?', hi: 'क्या बच्चा जल चक्र के सभी 4 चरणों को क्रम में लगा सकता है?', mr: 'विद्यार्थी जलचक्राचे चारही टप्पे क्रमाने मांडतो का?' },
        { en: 'Does the child describe rainwater harvesting realistically?', hi: 'क्या बच्चा वर्षा जल संचयन की व्यावहारिक विधि समझा सकता है?', mr: 'विद्यार्थी रेन वॉटर हार्वेस्टिंगची प्रत्यक्ष पद्धत सांगू शकतो का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Put in order: rain, evaporation, collection, condensation.', hi: 'सही क्रम में रखें: वर्षा, वाष्पीकरण, संग्रहण, संघनन।', mr: 'योग्य क्रमाने लावा: पाऊस, बाष्पीभवन, साठवण, संघनन.' },
          { en: 'Evaporation, condensation, rain, collection', hi: 'वाष्पीकरण, संघनन, वर्षा, संग्रहण', mr: 'बाष्पीभवन, संघनन, पाऊस, साठवण' },
          {
            support: [
              { en: 'Which comes first: evaporation or rain?', hi: 'पहले क्या आता है: वाष्पीकरण या वर्षा?', mr: 'आधी काय घडते: बाष्पीभवन की पाऊस?' },
              { en: 'Evaporation', hi: 'वाष्पीकरण', mr: 'बाष्पीभवन' },
            ],
            stretch: [
              { en: 'Explain the role of condensation in forming clouds and rain.', hi: 'बादल और बारिश बनने में संघनन की भूमिका समझाइए।', mr: 'ढग आणि पाऊस तयार होण्यात संघननाची भूमिका स्पष्ट करा.' },
              { en: 'Vapour cools and condenses into droplets', hi: 'भाप ठंडी होकर पानी की बूंदों में बदलती है', mr: 'वाफ थंड होऊन त्याचे पाण्याच्या थेंबांत रूपांतर होते' },
            ],
          }
        ),
        item(
          { en: 'Give two ways to save rainwater at home or school.', hi: 'घर या स्कूल में बारिश का पानी बचाने के दो तरीके बताएं।', mr: 'घरी किंवा शाळेत पावसाचे पाणी साठवण्याचे दोन मार्ग सांगा.' },
          { en: 'Rooftop tanks, recharge pits, ponds', hi: 'छत की टंकी, सोखता गड्ढा, खेत तालाब', mr: 'छतावरील टाकी, शोषखड्डा, शेततळे' },
          {
            support: [
              { en: 'Can we collect rainwater from the school roof? Yes / No', hi: 'क्या हम स्कूल की छत से बारिश का पानी इकट्ठा कर सकते हैं? हाँ / नहीं', mr: 'आपण शाळेच्या छतावरून पावसाचे पाणी गोळा करू शकतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Explain how rooftop rainwater harvesting helps groundwater levels.', hi: 'छत का वर्षा जल संचयन भूजल स्तर बढ़ाने में कैसे मदद करता है?', mr: 'छतावरील पावसाचे पाणी साठवल्याने भूजल पातळी कशी वाढते ते स्पष्ट करा.' },
              { en: 'Water routed into ground recharges wells and water table', hi: 'पानी को जमीन में उतारने से कुओं और भूजल का स्तर बढ़ता है', mr: 'पाणी जमिनीत मुरवल्याने विहिरी व भूजल पातळी पुनर्भरण पावते' },
            ],
          }
        ),
        item(
          { en: 'What would happen to the water cycle if there were no clouds?', hi: 'यदि बादल न होते तो जल चक्र पर क्या प्रभाव पड़ता?', mr: 'ढगच नसते तर जलचक्रावर काय परिणाम झाला असता?' },
          { en: 'No rain, so the cycle would break', hi: 'बारिश नहीं होगी और चक्र टूट जाएगा', mr: 'पाऊस पडणार नाही आणि चक्र खंडित होईल' },
          {
            support: [
              { en: 'Do clouds give us rain? Yes / No', hi: 'क्या बादलों से बारिश होती है? हाँ / नहीं', mr: 'ढगांमुळे पाऊस पडतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Explain how a drought can happen if the water cycle is disturbed.', hi: 'समझाइए कि जल चक्र बाधित होने पर सूखा कैसे पड़ सकता है।', mr: 'जलचक्रात बिघाड झाल्यास दुष्काळ कसा पडू शकतो ते स्पष्ट करा.' },
              { en: 'Less rain, less groundwater, dry sources', hi: 'कम बारिश, भूजल की कमी और जलस्रोतों का सूखना', mr: 'कमी पाऊस, भूजल घटणे आणि जलस्रोत आटणे' },
            ],
          }
        ),
      ] }],
    },
    5: {
      outcome: {
        en: 'Estimates daily water use, links it to the water cycle and plans conservation.',
        hi: 'दैनिक पानी की खपत का अनुमान लगाता है, उसे जल चक्र से जोड़ता है और संरक्षण की योजना बनाता है।',
        mr: 'दैनंदिन पाण्याच्या वापराचा अंदाज घेतो, तो जलचक्राशी जोडतो आणि पाणी बचतीची योजना आखतो.',
      },
      teacher: {
        title: { en: 'Water use in our village', hi: 'हमारे गाँव में पानी का उपयोग', mr: 'आमच्या गावातील पाण्याचा वापर' },
        minutes: 12,
        steps: [
          { en: 'List daily water uses with the children.', hi: 'बच्चों के साथ दैनिक पानी के उपयोगों की सूची बनाएं।', mr: 'मुलांसोबत पाण्याच्या दैनंदिन वापराची यादी बनवा.' },
          { en: 'Estimate buckets used per family per day.', hi: 'प्रति परिवार प्रतिदिन बाल्टियों की संख्या का अनुमान लगाएं।', mr: 'प्रति कुटुंब दररोज किती बादल्या पाणी लागते याचा अंदाज लावा.' },
          { en: 'Discuss summer shortage and what the village can do.', hi: 'गर्मी की कमी और गाँव द्वारा किए जा सकने वाले उपायों पर चर्चा करें।', mr: 'उन्हाळ्यातील पाणीटंचाई व त्यावर उपाय यावर चर्चा करा.' },
        ],
      },
      independent: {
        title: { en: 'Family water audit', hi: 'पारिवारिक जल लेखापरीक्षण (ऑडिट)', mr: 'कौटुंबिक पाणी वापर तपासणी' },
        instructions: {
          en: 'Estimate buckets your family uses per day for each activity. Add them up.',
          hi: 'हर गतिविधि के लिए अपने परिवार द्वारा उपयोग की जाने वाली बाल्टियों का अनुमान लगाएं और जोड़ें।',
          mr: 'प्रत्येक कामासाठी लागणाऱ्या बादल्यांचा अंदाज नोंदवा आणि बेरीज करा.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas Part 1'),
      earlyFinisher: {
        en: 'Calculate: If a dripping tap wastes 1 litre per hour, how many litres are lost in one full day?',
        hi: 'गणना करें: यदि टपकते नल से प्रति घंटे 1 लीटर पानी बहता है, तो एक दिन में कितना पानी बर्बाद होगा?',
        mr: 'हिशोब करा: गळणाऱ्या नळातून तासाला १ लिटर पाणी वाया जात असल्यास एका पूर्ण दिवसात किती लिटर पाणी वाया जाईल?',
      },
      checklist: [
        { en: 'Can the child multiply bucket volumes to calculate litres?', hi: 'क्या बच्चा बाल्टी की मात्रा से गुणा करके कुल लीटर निकाल सकता है?', mr: 'विद्यार्थी बादल्यांच्या संख्येवरून एकूण लिटरचा गुणाकार करतो का?' },
        { en: 'Can the child outline three concrete community-level water actions?', hi: 'क्या बच्चा गाँव स्तर पर पानी बचाने के तीन ठोस कदम बता सकता है?', mr: 'विद्यार्थी गावपातळीवरील पाणी बचतीचे ३ ठोस उपाय सांगतो का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'One bucket holds 20 litres. A family uses 8 buckets a day. How many litres in a week?', hi: 'एक बाल्टी में 20 लीटर पानी आता है। एक परिवार रोज़ 8 बाल्टी उपयोग करता है। एक सप्ताह में कितने लीटर?', mr: 'एका बादलीत २० लिटर पाणी मावते. एक कुटुंब दररोज ८ बादल्या पाणी वापरते. एका आठवड्यात किती लिटर?' },
          { en: '1120 litres', hi: '1120 लीटर', mr: '११२० लिटर' },
          {
            support: [
              { en: 'One bucket holds 20 litres. A family uses 2 buckets. How many litres?', hi: 'एक बाल्टी में 20 लीटर आता है। एक परिवार 2 बाल्टी उपयोग करता है। कितने लीटर?', mr: 'एका बादलीत २० लिटर पाणी मावते. कुटुंब २ बादल्या वापरते. किती लिटर पाणी?' },
              { en: '40 litres', hi: '40 लीटर', mr: '४० लिटर' },
            ],
            stretch: [
              { en: 'One bucket holds 20 litres. A family uses 8 buckets a day. If they save 2 buckets daily, how many litres saved in 30 days?', hi: 'एक बाल्टी में 20 लीटर आता है। परिवार रोज़ 8 की जगह 6 बाल्टी उपयोग करे (2 बाल्टी बचत), तो 30 दिन में कितने लीटर बचेंगे?', mr: 'एका बादलीत २० लिटर पाणी. रोज २ बादल्या पाणी वाचवल्यास ३० दिवसांत किती लिटर पाणी वाचेल?' },
              { en: '1200 litres', hi: '1200 लीटर', mr: '१२०० लिटर' },
            ],
          }
        ),
        item(
          { en: 'Write a 3-step plan to save water in your village.', hi: 'अपने गाँव में पानी बचाने की 3-चरणीय योजना लिखें।', mr: 'तुमच्या गावात पाणी बचतीची ३-टप्प्यांची योजना लिहा.' },
          { en: 'Fix leaks, reuse water for plants, harvest rain', hi: 'रिसाव ठीक करना, पौधों में पानी डालना, वर्षा जल संचयन', mr: 'गळती दुरुस्त करणे, परसबागेत पुनर्वापर, रेन वॉटर हार्वेस्टिंग' },
          {
            support: [
              { en: 'Name two easy ways to save water at home.', hi: 'घर पर पानी बचाने के दो आसान तरीके बताएं।', mr: 'घरी पाणी वाचवण्याचे दोन सोपे उपाय सांगा.' },
              { en: 'Turn off running taps and reuse rinse water', hi: 'नल बंद रखें और धोने का पानी पौधों में डालें', mr: 'नळ बंद ठेवणे आणि उरलेले पाणी झाडांना घालणे' },
            ],
            stretch: [
              { en: 'Write a 3-step community action plan to recharge village groundwater.', hi: 'गाँव का भूजल स्तर बढ़ाने के लिए 3-चरणीय सामुदायिक योजना लिखें।', mr: 'गावातील भूजल पातळी वाढवण्यासाठी ३-टप्प्यांची सामुदायिक कृती योजना लिहा.' },
              { en: 'Dig continuous contour trenches, recharge borewells, desilt ponds', hi: 'खेत तालाब, सोखता गड्ढे और चेकडैम का निर्माण', mr: 'समपातळी चर खोदणे, बोअरवेल पुनर्भरण, तळ्यातील गाळ काढणे' },
            ],
          }
        ),
        item(
          { en: 'How does cutting trees reduce rainfall and groundwater?', hi: 'पेड़ों की कटाई से बारिश और भूजल पर क्या असर पड़ता है?', mr: 'झाडे तोडल्यामुळे पाऊस आणि भूजल पातळीवर काय परिणाम होतो?' },
          { en: 'Fewer trees means less moisture and less soaking of rain into the ground', hi: 'कम पेड़ों से नमी कम होती है और जमीन में पानी कम रिसता है', mr: 'झाडे कमी झाल्याने हवेत बाष्प कमी होते आणि पाणी जमिनीत कमी मुरते' },
          {
            support: [
              { en: 'Do trees help rainwater soak into the ground? Yes / No', hi: 'क्या पेड़ बारिश के पानी को जमीन में सोखने में मदद करते हैं? हाँ / नहीं', mr: 'झाडे पावसाचे पाणी जमिनीत मुरायला मदत करतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Explain two links between deforestation and the water cycle.', hi: 'वनों की कटाई और जल चक्र के बीच दो संबंध समझाइए।', mr: 'जंगलतोड आणि जलचक्र यांमधील दोन संबंध स्पष्ट करा.' },
              { en: 'Less transpiration, less rain, more runoff, less recharge', hi: 'कम वाष्पोत्सर्जन, कम बारिश, अधिक अपवाह और भूजल में कमी', mr: 'कमी बाष्पोत्सर्जन, कमी पाऊस, जमिनीवरून वाहून जाणे व कमी पुनर्भरण' },
            ],
          }
        ),
      ] }],
    },
  },
};

const market: Topic = {
  id: 'math-market',
  subject: 'math',
  title: { en: 'Numbers in the Market (Maths)', hi: 'बाज़ार में संख्याएँ (गणित)', mr: 'बाजारातील संख्या (गणित)' },
  theme: { en: 'A pretend village shop', hi: 'गाँव की एक काल्पनिक दुकान', mr: 'गावातील काल्पनिक दुकान' },
  hook: {
    en: 'Set up a pretend shop with five items. Ask: "What can we buy? How many? How much?" Each grade solves its own shop problems.',
    hi: 'पाँच वस्तुओं के साथ एक काल्पनिक दुकान बनाएं। पूछें: "हम क्या खरीद सकते हैं? कितने? कितने रुपये में?" हर कक्षा अपनी समस्या हल करती है।',
    mr: 'पाच वस्तूंसह एक काल्पनिक दुकान मांडा. विचारा: "आपण काय खरेदी करू शकतो? किती? किती रुपयांना?" प्रत्येक इयत्ता आपापली गणिते सोडवेल.',
  },
  mapping: 'Draft: Number and operations strand, NCERT Maths Classes 1-5 & Maharashtra State Board (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Counts objects up to 20 and adds small numbers in shop contexts.',
        hi: '20 तक वस्तुओं की गिनती करता है और दुकान के संदर्भ में छोटी संख्याएँ जोड़ता है।',
        mr: '२० पर्यंत वस्तू मोजतो आणि दुकानाच्या संदर्भात लहान संख्यांची बेरीज करतो.',
      },
      teacher: {
        title: { en: 'Counting at the shop', hi: 'दुकान पर गिनती', mr: 'दुकानातील मोजणी' },
        minutes: 8,
        steps: [
          { en: 'Show 10 stones in groups of five.', hi: 'पाँच-पाँच के समूह में 10 कंकड़ दिखाएं।', mr: 'पाच-पाचच्या गटांत १० खडे दाखवा.' },
          { en: 'Children count and say the number.', hi: 'बच्चे गिनते हैं और संख्या बोलते हैं।', mr: 'मुले मोजतात आणि संख्या सांगतात.' },
          { en: 'Act out: 3 mangoes plus 2 mangoes.', hi: 'अभिनय करें: 3 आम और 2 आम कितने हुए?', mr: 'अभिनय करा: ३ आंबे अधिक २ आंबे.' },
        ],
      },
      independent: {
        title: { en: 'Count and add', hi: 'गिनें और जोड़ें', mr: 'मोजा आणि बेरीज करा' },
        instructions: {
          en: 'Count the objects, write the number, then solve the additions with counters.',
          hi: 'वस्तुओं को गिनें, संख्या लिखें, फिर कंकड़ों की मदद से जोड़ हल करें।',
          mr: 'वस्तू मोजा, संख्या लिहा, नंतर मण्यांच्या साहाय्याने बेरीज सोडवा.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'counters (seeds or stones)', hi: 'कंकड़ या बीज', mr: 'बिया किंवा खडे' },
          { en: 'worksheet', hi: 'अभ्यास पत्रक (वर्कशीट)', mr: 'कार्यपत्रिका' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Count how many fingers are on both your hands and both feet.',
        hi: 'अपने दोनों हाथों और दोनों पैरों की कुल उँगलियाँ गिनें।',
        mr: 'आपल्या दोन्ही हातांची व दोन्ही पायांची मिळून एकूण बोटे मोजा.',
      },
      checklist: [
        { en: 'Can the child count one-to-one correspondence up to 10?', hi: 'क्या बच्चा 10 तक एक-से-एक संगति से सही गिनता है?', mr: 'मूल १० पर्यंत एकास-एक संगतीने बरोबर मोजते का?' },
        { en: 'Can the child join two sets of seeds and tell the total?', hi: 'क्या बच्चा दो समूहों को मिलाकर कुल योग बता सकता है?', mr: 'मूल दोन संच एकत्र करून एकूण संख्या सांगू शकते का?' },
      ],
      questions: [gen('count', 3), gen('add', 4, { digits: 1 })],
    },
    2: {
      outcome: {
        en: 'Adds and subtracts two-digit numbers, first without and then with regrouping.',
        hi: 'दो अंकों की संख्याओं को पहले बिना हासिल और फिर हासिल के साथ जोड़ता और घटाता है।',
        mr: 'दोन अंकी संख्यांची प्रथम बिनहातच्याची व नंतर हातच्याची बेरीज-वजाबाकी करतो.',
      },
      teacher: {
        title: { en: 'Tens and ones bundles', hi: 'दहाई और इकाई के बंडल', mr: 'दशक आणि एककाचे गट्टे' },
        minutes: 10,
        steps: [
          { en: 'Bundle 10 sticks to make a ten.', hi: '10 तीलियों का एक बंडल बनाकर एक दहाई समझाएं।', mr: '१० काड्यांचा एक गट्टा बांधून एक दशक दाखवा.' },
          { en: 'Show 23 + 14 using bundles.', hi: 'बंडलों की मदद से 23 + 14 दिखाएं।', mr: 'गट्ट्यांच्या साहाय्याने २३ + १४ करून दाखवा.' },
          { en: 'Children make and solve their own sums.', hi: 'बच्चे अपने सवाल बनाते और हल करते हैं।', mr: 'मुले स्वतः उदाहरणे तयार करून सोडवतात.' },
        ],
      },
      independent: {
        title: { en: 'Shop bill practice', hi: 'दुकान के बिल का अभ्यास', mr: 'दुकानातील बिलांचा सराव' },
        instructions: {
          en: 'Solve each bill. Use bundles of sticks if you need help.',
          hi: 'हर बिल हल करें। ज़रूरत पड़ने पर तीलियों के बंडल का उपयोग करें।',
          mr: 'प्रत्येक बिल सोडवा. गरज वाटल्यास काड्यांच्या गट्ट्यांचा वापर करा.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [
          { en: 'worksheet', hi: 'अभ्यास पत्रक', mr: 'कार्यपत्रिका' },
          { en: 'bundles of sticks', hi: 'तीलियों के बंडल', mr: 'काड्यांचे गट्टे' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Write the number names from 21 to 30 in your notebook.',
        hi: 'अपनी कॉपी में 21 से 30 तक की संख्याओं को शब्दों में लिखें।',
        mr: 'तुमच्या वहीत २१ ते ३० संख्या अक्षरांत लिहा.',
      },
      checklist: [
        { en: 'Does the child bundle 10 ones into 1 ten correctly?', hi: 'क्या बच्चा 10 इकाइयों को 1 दहाई में सही बदलता है?', mr: 'मूल १० एककांचा १ दशक बरोबर तयार करते का?' },
        { en: 'Does the child subtract ones column first?', hi: 'क्या बच्चा पहले इकाई वाले अंक घटाता है?', mr: 'मूल प्रथम एकक स्थानाची वजाबाकी करते का?' },
      ],
      questions: [gen('addNoCarry', 3), gen('sub', 3, { digits: 2 }), gen('wordShop', 1, { digits: 2, op: 'add' })],
    },
    3: {
      outcome: {
        en: 'Adds and subtracts three-digit numbers with regrouping and solves shop problems.',
        hi: 'तीन अंकों की संख्याओं को हासिल के साथ जोड़ता-घटाता है और दुकान की समस्याएँ हल करता है।',
        mr: 'तीन अंकी संख्यांची हातच्याची बेरीज-वजाबाकी करतो आणि खरेदी-विक्रीची शाब्दिक उदाहरणे सोडवतो.',
      },
      teacher: {
        title: { en: 'Place-value bills', hi: 'स्थानीय मान और बिल', mr: 'स्थानिक किंमत आणि बिले' },
        minutes: 12,
        steps: [
          { en: 'Draw a hundreds-tens-ones chart.', hi: 'सैकड़ा-दहाई-इकाई का चार्ट बनाएं।', mr: 'शतक-दशक-एकक तक्ता फळ्यावर काढा.' },
          { en: 'Work one addition and one subtraction with regrouping.', hi: 'हासिल वाला एक जोड़ और एक घटाव करके दिखाएं।', mr: 'हातच्याची एक बेरीज आणि एक वजाबाकी सोडवून दाखवा.' },
          { en: 'Pairs check each other\'s answers.', hi: 'जोड़ियां एक-दूसरे के उत्तर जाँचती हैं।', mr: 'जोडीदार एकमेकांची उत्तरे तपासतात.' },
        ],
      },
      independent: {
        title: { en: 'Grocery bill', hi: 'किराने का बिल', mr: 'किराणा दुकानाचे बिल' },
        instructions: {
          en: 'Work out each bill in your notebook. Check by adding backwards.',
          hi: 'अपनी कॉपी में हर बिल हल करें। जोड़ की जाँच उलटा जोड़कर करें।',
          mr: 'तुमच्या वहीत प्रत्येक बिल सोडवा. उलट बेरीज करून पडताळा घ्या.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Write 3 different number pairs that add up to 500.',
        hi: 'ऐसी 3 अलग-अलग संख्या जोड़ियाँ लिखें जिनका योग 500 हो।',
        mr: 'बेरीज ५०० येईल अशा संख्यांच्या ३ वेगवेगळ्या जोड्या लिहा.',
      },
      checklist: [
        { en: 'Does the child regroup tens to hundreds accurately?', hi: 'क्या बच्चा दहाई से सैकड़े में हासिल सही लगाता है?', mr: 'मूल दशकातून शतकात हातचा अचूक नेते का?' },
        { en: 'Can the child explain change returned from a ₹500 note?', hi: 'क्या बच्चा ₹500 के नोट से बची हुई राशि निकाल सकता है?', mr: 'मूल ₹५०० च्या नोटेतून परत मिळणारी रक्कम अचूक सांगते का?' },
      ],
      questions: [gen('add', 3, { digits: 3 }), gen('sub', 3, { digits: 3 }), gen('wordShop', 2, { digits: 2, op: 'add' })],
    },
    4: {
      outcome: {
        en: 'Adds and subtracts large numbers, multiplies by one digit and solves multi-step shop problems.',
        hi: 'बड़ी संख्याओं का जोड़-घटाव करता है, एक अंक से गुणा करता है और बहु-चरणीय बिल हल करता है।',
        mr: 'मोठ्या संख्यांची बेरीज-वजाबाकी करतो, एका अंकाने गुणतो आणि बहु-टप्पी खरेदीची उदाहरणे सोडवतो.',
      },
      teacher: {
        title: { en: 'Packs and prices', hi: 'पैकेट और मूल्य', mr: 'पाकिटे आणि किमती' },
        minutes: 12,
        steps: [
          { en: 'Show packets of 6 and 8 items.', hi: '6 और 8 वस्तुओं वाले पैकेट दिखाएं।', mr: '६ आणि ८ वस्तूंची पाकिटे दाखवा.' },
          { en: 'Build multiplication from repeated addition.', hi: 'बार-बार जोड़ने से गुणा की अवधारणा स्पष्ट करें।', mr: 'वारंवार बेरजेवरून गुणाकाराची संकल्पना स्पष्ट करा.' },
          { en: 'Model a two-step problem: price then change.', hi: 'दो चरणों वाला सवाल हल करें: पहले कुल मूल्य, फिर बची राशि।', mr: 'दोन टप्प्यांतील उदाहरण सोडवा: आधी एकूण किंमत, नंतर उरलेले पैसे.' },
        ],
      },
      independent: {
        title: { en: 'Market day ledger', hi: 'बाज़ार दिवस का बहीखाता', mr: 'बाजाराचा हिशोब' },
        instructions: {
          en: 'Complete the ledger. Show your working for every line.',
          hi: 'बहीखाता पूरा करें। हर पंक्ति के लिए अपनी गणना दिखाएं।',
          mr: 'हिशोब वही पूर्ण करा. प्रत्येक ओळीसाठी कच्चे काम वहीत दाखवा.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Make a shop price list of 5 items and calculate the total cost if you buy 3 of each.',
        hi: '5 वस्तुओं की मूल्य सूची बनाएं और यदि प्रत्येक की 3 वस्तुएं खरीदें तो कुल खर्च निकालें।',
        mr: '५ वस्तूंची दरसूची बनवा आणि प्रत्येकी ३ वस्तू खरेदी केल्यास एकूण खर्च काढा.',
      },
      checklist: [
        { en: 'Does the child solve multiplication as repeated addition correctly?', hi: 'क्या बच्चा गुणा को दोहरावदार जोड़ के रूप में सही हल करता है?', mr: 'मूल गुणाकार हा वारंवार बेरीज म्हणून बरोबर समजते का?' },
        { en: 'Can the child carry out both addition and subtraction in a single story problem?', hi: 'क्या बच्चा एक ही इबारती सवाल में जोड़ और घटाव दोनों सही करता है?', mr: 'मूल एकाच शाब्दिक उदाहरणात बेरीज आणि वजाबाकी दोन्ही पायऱ्या अचूक करते का?' },
      ],
      questions: [gen('add', 2, { digits: 4 }), gen('sub', 2, { digits: 4 }), gen('mul', 3, { digits: 2 }), gen('wordShop', 2, { digits: 3, op: 'mul' })],
    },
    5: {
      outcome: {
        en: 'Adds like fractions, adds rupees and paise, and multiplies two-digit numbers in real contexts.',
        hi: 'समान हर वाले भिन्न जोड़ता है, रुपये और पैसे जोड़ता है और व्यावहारिक संदर्भों में दो अंकों का गुणा करता है।',
        mr: 'समान छेद असणारे अपूर्णांक जोडतो, रुपये व पैशांची बेरीज करतो आणि दोन अंकी गुणाकार सोडवतो.',
      },
      teacher: {
        title: { en: 'Sharing rotis, sharing money', hi: 'रोटी बाँटना, रुपये बाँटना', mr: 'भाकरी वाटप, पैसे हिशोब' },
        minutes: 12,
        steps: [
          { en: 'Fold a paper roti to show eighths.', hi: 'कागज़ की रोटी मोड़कर आठवाँ भाग (1/8) दिखाएं।', mr: 'कागदी भाकरी घडी घालून आठवा भाग (१/८) दाखवा.' },
          { en: 'Add fractions with the same denominator.', hi: 'समान हर वाले भिन्नों को जोड़ें।', mr: 'समान छेद असणाऱ्या अपूर्णांकांची बेरीज करा.' },
          { en: 'Link paise to decimals: 50 paise = ₹0.50.', hi: 'पैसे को दशमलव से जोड़ें: 50 पैसे = ₹0.50।', mr: 'पैशांचा संबंध दशांशाशी जोडा: ५० पैसे = ₹०.५०.' },
        ],
      },
      independent: {
        title: { en: 'Festival fair budget', hi: 'मेले का बजट', mr: 'जत्रेचा हिशोब व अंदाजपत्रक' },
        instructions: {
          en: 'Solve each problem. Keep a neat record of ₹ and paise.',
          hi: 'हर समस्या हल करें। रुपये और पैसों का साफ रिकॉर्ड रखें।',
          mr: 'प्रत्येक गणित सोडवा. रुपये आणि पैशांची नीट नोंद ठेवा.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Calculate: 3/8 of a cake is eaten in morning and 2/8 in evening. What fraction remains?',
        hi: 'गणना करें: केक का 3/8 हिस्सा सुबह और 2/8 हिस्सा शाम को खाया गया। कितना हिस्सा बचा?',
        mr: 'हिशोब करा: केकचा ३/८ भाग सकाळी आणि २/८ भाग संध्याकाळी खाल्ला. किती भाग शिल्लक उरला?',
      },
      checklist: [
        { en: 'Does the child remember not to add denominators when adding like fractions?', hi: 'क्या बच्चा याद रखता है कि समान हर वाले भिन्न जोड़ते समय हर नहीं जुड़ते?', mr: 'अपूर्णांक जोडताना छेद जोडायचा नसतो हे मूल लक्षात ठेवते का?' },
        { en: 'Can the child align decimal points when adding rupees and paise?', hi: 'क्या बच्चा रुपये और पैसे जोड़ते समय दशमलव बिंदु सही सीध में रखता है?', mr: 'रुपये आणि पैसे जोडताना दशांश चिन्ह एका खाली एक बरोबर मांडतो का?' },
      ],
      questions: [gen('fracAdd', 3, { den: 8 }), gen('money', 3), gen('mul', 3, { digits: 2 }), gen('wordShop', 1, { digits: 3, op: 'mul' })],
    },
  },
};

const shapes: Topic = {
  id: 'math-shapes',
  subject: 'math',
  title: { en: 'Shapes & Patterns (Maths)', hi: 'आकार और पैटर्न (गणित)', mr: 'आकार आणि नमुने (गणित)' },
  theme: { en: 'Rangoli in our village', hi: 'हमारे गाँव की रंगोली', mr: 'आमच्या गावातील रांगोळी' },
  hook: {
    en: 'Draw a simple rangoli on the board. Ask: "What shapes can you see?" Let each grade find different shapes.',
    hi: 'बोर्ड पर एक सरल रंगोली बनाएं। पूछें: "आपको कौन से आकार दिख रहे हैं?" हर कक्षा को अलग आकार खोजने दें।',
    mr: 'फळ्यावर साधी रांगोळी काढा. विचारा: "तुम्हाला कोणते आकार दिसतात?" प्रत्येक इयत्तेला आकार शोधू द्या.',
  },
  mapping: 'Draft: Geometry and patterns strand, NCERT Maths Classes 1-5 (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Identifies and names basic shapes (circle, square, triangle, rectangle) in the environment.',
        hi: 'परिवेश में बुनियादी आकारों (वृत्त, वर्ग, त्रिकोण, आयत) को पहचानता और नाम बताता है।',
        mr: 'परिसरातील मूलभूत आकार (वर्तुळ, चौरस, त्रिकोण, आयत) ओळखतो आणि त्यांची नावे सांगतो.',
      },
      teacher: {
        title: { en: 'Shape hunt', hi: 'आकार खोज गतिविधि', mr: 'आकार शोध खेळ' },
        minutes: 8,
        steps: [
          { en: 'Hold up cut-out shapes: circle, square, triangle, rectangle.', hi: 'काटे गए आकार दिखाएं: वृत्त, वर्ग, त्रिकोण, आयत।', mr: 'कापलेले आकार दाखवा: वर्तुळ, चौरस, त्रिकोण, आयत.' },
          { en: 'Name each shape; children repeat.', hi: 'प्रत्येक आकार का नाम बोलें; बच्चे दोहराएंगे।', mr: 'प्रत्येक आकाराचे नाव सांगा; मुलांनी मागे म्हणावे.' },
          { en: 'Point to shapes in the classroom: window (rectangle), clock (circle).', hi: 'कक्षा में आकारों की ओर इशारा करें: खिड़की (आयत), घड़ी (वृत्त)।', mr: 'वर्गातील आकारांकडे निर्देश करा: खिडकी (आयत), घड्याळ (वर्तुळ).' },
        ],
      },
      independent: {
        title: { en: 'Find and colour shapes', hi: 'आकार खोजें और रंग भरें', mr: 'आकार शोधा आणि रंगवा' },
        instructions: {
          en: 'Colour all circles red, all squares blue, all triangles green.',
          hi: 'सभी वृत्तों में लाल, वर्गों में नीला और त्रिकोणों में हरा रंग भरें।',
          mr: 'सर्व वर्तुळांना लाल, चौरसांना निळा आणि त्रिकोणांना हिरवा रंग द्या.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'shape worksheet', hi: 'आकार वर्कशीट', mr: 'आकार कार्यपत्रिका' },
          { en: 'crayons', hi: 'मोमी रंग', mr: 'रंगखडू' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Draw a hut using one triangle, two squares and one rectangle.',
        hi: 'एक त्रिकोण, दो वर्ग और एक आयत का उपयोग करके एक झोपड़ी बनाएं।',
        mr: 'एक त्रिकोण, दोन चौरस आणि एक आयत वापरून झोपडी काढा.',
      },
      checklist: [
        { en: 'Identifies circle without confusion', hi: 'बिना भ्रम के वृत्त पहचानता है', mr: 'गोंधळ न करता वर्तुळ ओळखतो' },
        { en: 'Can point to corners on a square', hi: 'वर्ग के कोनों की ओर इशारा कर सकता है', mr: 'चौरसाचे कोपरे अचूक दाखवू शकतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'How many sides does a triangle have?', hi: 'त्रिभुज की कितनी भुजाएँ होती हैं?', mr: 'त्रिकोणाला किती बाजू असतात?' },
          { en: '3', hi: '3', mr: '3' },
          {
            support: [
              { en: 'A triangle has _____ sides: 2 / 3 / 4', hi: 'त्रिभुज की _____ भुजाएँ होती हैं: 2 / 3 / 4', mr: 'त्रिकोणाला _____ बाजू असतात: 2 / 3 / 4' },
              { en: '3', hi: '3', mr: '3' },
            ],
            stretch: [
              { en: 'Draw a triangle and write how many corners it has.', hi: 'एक त्रिभुज बनाएं और लिखें कि उसके कितने कोने हैं।', mr: 'एक त्रिकोण काढा आणि त्याला किती कोपरे आहेत ते लिहा.' },
              { en: '3 corners', hi: '3 कोने', mr: '3 कोपरे' },
            ],
          }
        ),
        item(
          { en: 'Draw a circle and a square.', hi: 'एक वृत्त और एक वर्ग बनाएं।', mr: 'एक वर्तुळ आणि एक चौरस काढा.' },
          { en: 'One circle and one square drawn', hi: 'एक वृत्त और एक वर्ग बना हुआ', mr: 'एक वर्तुळ आणि एक चौरस काढलेला' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Freehand basic 2D shape drawing suitable across all Grade 1 tiers' }
        ),
        item(
          { en: 'Name one thing in your classroom that is shaped like a rectangle.', hi: 'अपनी कक्षा की एक वस्तु का नाम बताएं जिसका आकार आयत जैसा है।', mr: 'तुमच्या वर्गातील आयताकृती आकाराच्या एका वस्तूचे नाव सांगा.' },
          { en: 'Door, window, blackboard, book', hi: 'दरवाजा, खिड़की, श्यामपट्ट, किताब', mr: 'दरवाजा, खिडकी, फळा, वही' },
          {
            support: [
              { en: 'Is the door shaped like a rectangle? Yes / No', hi: 'क्या दरवाजा आयत के आकार का है? हाँ / नहीं', mr: 'दरवाजा आयताकृती असतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name two rectangular objects and two circular objects.', hi: 'दो आयताकार और दो गोलाकार वस्तुओं के नाम लिखें।', mr: 'दोन आयताकृती आणि दोन वर्तुळाकार वस्तूंची नावे लिहा.' },
              { en: 'Door/board (rectangles) and clock/coin (circles)', hi: 'दरवाजा/बोर्ड (आयत) और घड़ी/सिक्का (वृत्त)', mr: 'दरवाजा/फळा (आयत) आणि घड्याळ/नाणे (वर्तुळ)' },
            ],
          }
        ),
      ] }],
    },
    2: {
      outcome: {
        en: 'Sorts shapes by sides and corners; completes simple repeating patterns.',
        hi: 'भुजाओं और कोनों के आधार पर आकारों को छाँटता है; सरल दोहराए जाने वाले पैटर्न पूरे करता है।',
        mr: 'बाजू व कोपऱ्यांनुसार आकार वर्गीकरण करतो; साधे भौमितिक नमुने पूर्ण करतो.',
      },
      teacher: {
        title: { en: 'Sorting shapes', hi: 'आकारों का वर्गीकरण', mr: 'आकारांचे वर्गीकरण' },
        minutes: 10,
        steps: [
          { en: 'Give each group 10 cut-out shapes.', hi: 'प्रत्येक समूह को 10 कटे हुए आकार दें।', mr: 'प्रत्येक गटाला 10 कापलेले आकार द्या.' },
          { en: 'Sort by number of sides: 0 (circle), 3, 4.', hi: 'भुजाओं की संख्या के आधार पर छाँटें: 0 (वृत्त), 3, 4।', mr: 'बाजूंच्या संख्येनुसार वर्गीकरण करा: 0 (वर्तुळ), 3, 4.' },
          { en: 'Start a pattern on the board: circle-square-circle-square. Children continue.', hi: 'बोर्ड पर एक पैटर्न शुरू करें: वृत्त-वर्ग-वृत्त-वर्ग। बच्चे इसे आगे बढ़ाएंगे।', mr: 'फळ्यावर नमुना सुरू करा: वर्तुळ-चौरस-वर्तुळ-चौरस. मुलांनी पुढे चालू ठेवावे.' },
        ],
      },
      independent: {
        title: { en: 'Pattern completion', hi: 'पैटर्न पूरा करना', mr: 'नमुना पूर्ण करणे' },
        instructions: {
          en: 'Complete each pattern and draw the next two shapes.',
          hi: 'प्रत्येक पैटर्न पूरा करें और अगले दो आकार बनाएं।',
          mr: 'प्रत्येक नमुना पूर्ण करा आणि पुढील दोन आकार काढा.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [
          { en: 'worksheet', hi: 'वर्कशीट', mr: 'कार्यपत्रिका' },
          { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Create your own border pattern using arrows and dots.',
        hi: 'तीर और बिंदुओं का उपयोग करके अपना स्वयं का बॉर्डर पैटर्न बनाएं।',
        mr: 'बाण आणि ठिपके वापरून स्वतःची सुंदर किनार (बॉर्डर) तयार करा.',
      },
      checklist: [
        { en: 'Counts vertices accurately', hi: 'कोनों को सही-सही गिनता है', mr: 'शिरोबिंदू/कोपरे अचूक मोजतो' },
        { en: 'Predicts rule of alternating patterns', hi: 'एकांतर पैटर्न के नियम को पहचानता है', mr: 'आलटून-पालटून येणाऱ्या नमुन्याचा नियम ओळखतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'How many corners does a rectangle have?', hi: 'एक आयत के कितने कोने होते हैं?', mr: 'आयताला किती कोपरे असतात?' },
          { en: '4', hi: '4', mr: '4' },
          {
            support: [
              { en: 'A rectangle has _____ corners: 3 / 4 / 5', hi: 'एक आयत के _____ कोने होते हैं: 3 / 4 / 5', mr: 'आयताला _____ कोपरे असतात: 3 / 4 / 5' },
              { en: '4', hi: '4', mr: '4' },
            ],
            stretch: [
              { en: 'A rectangle has 4 corners. Does a circle have corners?', hi: 'एक आयत के 4 कोने होते हैं। क्या वृत्त का कोई कोना होता है?', mr: 'आयताला 4 कोपरे असतात. वर्तुळाला कोपरे असतात का?' },
              { en: 'No, 0 corners', hi: 'नहीं, 0 कोने', mr: 'नाही, 0 कोपरे' },
            ],
          }
        ),
        item(
          { en: 'Continue the pattern: ▲ ● ▲ ● ▲ ___ ___', hi: 'पैटर्न आगे बढ़ाएं: ▲ ● ▲ ● ▲ ___ ___', mr: 'नमुना पुढे चालू ठेवा: ▲ ● ▲ ● ▲ ___ ___' },
          { en: '● ▲', hi: '● ▲', mr: '● ▲' },
          {
            support: [
              { en: 'What comes next: ▲ ● ▲ ● ___', hi: 'आगे क्या आएगा: ▲ ● ▲ ● ___', mr: 'पुढे काय येईल: ▲ ● ▲ ● ___' },
              { en: '▲', hi: '▲', mr: '▲' },
            ],
            stretch: [
              { en: 'Continue: ▲ ● ● ▲ ● ● ▲ ___ ___ ___', hi: 'आगे बढ़ाएं: ▲ ● ● ▲ ● ● ▲ ___ ___ ___', mr: 'पुढे चालू ठेवा: ▲ ● ● ▲ ● ● ▲ ___ ___ ___' },
              { en: '● ● ▲', hi: '● ● ▲', mr: '● ● ▲' },
            ],
          }
        ),
        item(
          { en: 'Draw a shape with 3 sides and 3 corners. What is it called?', hi: '3 भुजाओं और 3 कोनों वाला एक आकार बनाएं। इसे क्या कहते हैं?', mr: '3 बाजू आणि 3 कोपरे असलेला आकार काढा. त्याला काय म्हणतात?' },
          { en: 'Triangle', hi: 'त्रिभुज/त्रिकोण', mr: 'त्रिकोण' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Geometry sketch requiring freehand triangle drawing accessible across tiers' }
        ),
      ] }],
    },
    3: {
      outcome: {
        en: 'Measures and calculates perimeter of simple shapes using a ruler.',
        hi: 'रूलर/स्केल का उपयोग करके सरल आकारों के परिमाप को मापता और गणना करता है।',
        mr: 'पट्टीचा वापर करून साध्या आकारांची परिमिती मोजतो आणि बेरीज करतो.',
      },
      teacher: {
        title: { en: 'Measuring around', hi: 'चारों ओर की माप', mr: 'सभोवती मोजणे' },
        minutes: 12,
        steps: [
          { en: 'Measure the sides of a textbook with a ruler.', hi: 'स्केल से पाठ्यपुस्तक की भुजाओं को मापें।', mr: 'पट्टीने पाठ्यपुस्तकाच्या बाजू मोजा.' },
          { en: 'Add all four sides. Introduce the word "perimeter".', hi: 'चारों भुजाओं को जोड़ें। "परिमाप" शब्द से परिचित कराएं।', mr: 'चारही बाजूंची बेरीज करा. "परिमिती" या शब्दाची ओळख करून द्या.' },
          { en: 'Pairs measure the perimeter of their desk top.', hi: 'जोड़ियाँ अपने डेस्क के ऊपरी भाग का परिमाप मापेंगी।', mr: 'जोड्यांमध्ये बसून बाकाची परिमिती मोजा.' },
        ],
      },
      independent: {
        title: { en: 'Perimeter practice', hi: 'परिमाप अभ्यास', mr: 'परिमिती सराव' },
        instructions: {
          en: 'Measure each shape and calculate the perimeter. Write the addition.',
          hi: 'प्रत्येक आकार को मापें और परिमाप की गणना करें। जोड़ का वाक्य लिखें।',
          mr: 'प्रत्येक आकार मोजा आणि परिमिती काढा. बेरजेची मांडणी लिहा.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [
          { en: 'ruler', hi: 'स्केल/रूलर', mr: 'पट्टी' },
          { en: 'worksheet', hi: 'वर्कशीट', mr: 'कार्यपत्रिका' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Find the perimeter of your maths notebook in centimetres.',
        hi: 'अपनी गणित की कॉपी का परिमाप सेंटीमीटर में ज्ञात करें।',
        mr: 'तुमच्या गणिताच्या वहीची परिमिती सेंटीमीटरमध्ये काढा.',
      },
      checklist: [
        { en: 'Adds all 4 sides without omitting one', hi: 'बिना छोड़े चारों भुजाओं को जोड़ता है', mr: 'एकही बाजू न वगळता चारही बाजूंची बेरीज करतो' },
        { en: 'Writes unit metres/centimetres', hi: 'मीटर या सेंटीमीटर इकाई लिखता है', mr: 'मीटर किंवा सेंटीमीटर एकक बरोबर लिहितो' },
      ],
      questions: [gen('perimeter', 4, { digits: 1 })],
    },
    4: {
      outcome: {
        en: 'Calculates area of rectangles by counting squares and using the formula length × width.',
        hi: 'वर्गों को गिनकर और लंबाई × चौड़ाई सूत्र का उपयोग करके आयतों के क्षेत्रफल की गणना करता है।',
        mr: 'चौरस मोजून आणि लांबी × रुंदी हे सूत्र वापरून आयताचे क्षेत्रफळ काढतो.',
      },
      teacher: {
        title: { en: 'Covering with squares', hi: 'वर्गों से ढकना', mr: 'चौरसांनी पृष्ठभाग झाकणे' },
        minutes: 12,
        steps: [
          { en: 'Draw a 3×4 grid on the board.', hi: 'बोर्ड पर 3×4 का ग्रिड बनाएं।', mr: 'फळ्यावर 3×4 चा आलेख (ग्रिड) काढा.' },
          { en: 'Count the squares (12). Link to 3 × 4 = 12.', hi: 'वर्गों को गिनें (12)। इसे 3 × 4 = 12 से जोड़ें।', mr: 'चौरस मोजा (12). 3 × 4 = 12 या गुणाकाराशी संबंध जोडा.' },
          { en: 'State the formula: Area = length × width.', hi: 'सूत्र बताएं: क्षेत्रफल = लंबाई × चौड़ाई।', mr: 'सूत्र सांगा: क्षेत्रफळ = लांबी × रुंदी.' },
        ],
      },
      independent: {
        title: { en: 'Area calculations', hi: 'क्षेत्रफल गणना', mr: 'क्षेत्रफळ मोजणी' },
        instructions: {
          en: 'Calculate the area of each rectangle. Draw the grid if it helps.',
          hi: 'प्रत्येक आयत का क्षेत्रफल ज्ञात करें। यदि आवश्यक हो तो ग्रिड बनाएं।',
          mr: 'प्रत्येक आयताचे क्षेत्रफळ काढा. गरज असल्यास चौरस आखून घ्या.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
          { en: 'ruler', hi: 'स्केल', mr: 'पट्टी' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'A square has area 36 sq cm. What is the length of each side?',
        hi: 'एक वर्ग का क्षेत्रफल 36 वर्ग सेमी है। प्रत्येक भुजा की लंबाई क्या है?',
        mr: 'एका चौरसाचे क्षेत्रफळ 36 चौ.सेमी आहे. त्याच्या बाजूची लांबी किती?',
      },
      checklist: [
        { en: 'Distinguishes perimeter (boundary) from area (surface)', hi: 'परिमाप (सीमा) और क्षेत्रफल (सतह) में अंतर करता है', mr: 'परिमिती (कडा) आणि क्षेत्रफळ (पृष्ठभाग) यातील फरक समजतो' },
        { en: 'Multiplies length and width correctly', hi: 'लंबाई और चौड़ाई का सही गुणन करता है', mr: 'लांबी आणि रुंदीचा अचूक गुणाकार करतो' },
      ],
      questions: [gen('area', 3, { digits: 1 }), gen('perimeter', 2, { digits: 1 })],
    },
    5: {
      outcome: {
        en: 'Solves real-world perimeter and area problems; compares areas of composite shapes.',
        hi: 'दैनिक जीवन के परिमाप और क्षेत्रफल की समस्याएं हल करता है; संयुक्त आकारों के क्षेत्रफल की तुलना करता है।',
        mr: 'परिमिती आणि क्षेत्रफळाची शाब्दिक उदाहरणे सोडवतो; संयुक्त आकारांचे क्षेत्रफळ काढतो.',
      },
      teacher: {
        title: { en: 'Planning a garden', hi: 'बगीचे की योजना', mr: 'बागेचे नियोजन' },
        minutes: 12,
        steps: [
          { en: 'Draw an L-shaped garden on the board (two rectangles joined).', hi: 'बोर्ड पर L-आकार का बगीचा बनाएं (दो जुड़े हुए आयत)।', mr: 'फळ्यावर L-आकारची बाग काढा (दोन जोडलेले आयत).' },
          { en: 'Find the area by splitting into two rectangles.', hi: 'दो आयतों में बाँटकर क्षेत्रफल ज्ञात करें।', mr: 'दोन आयतांत विभाजन करून क्षेत्रफळ काढा.' },
          { en: 'Discuss: how much fencing (perimeter) do we need?', hi: 'चर्चा करें: हमें बाड़ लगाने के लिए कितने तार (परिमाप) की आवश्यकता होगी?', mr: 'चर्चा करा: कुंपणासाठी किती तार (परिमिती) लागेल?' },
        ],
      },
      independent: {
        title: { en: 'Garden design', hi: 'बगीचा रूपरेखा', mr: 'बागेची रचना' },
        instructions: {
          en: 'Calculate area and perimeter for each shape. For composite shapes, split into rectangles first.',
          hi: 'प्रत्येक आकार के लिए क्षेत्रफल और परिमाप की गणना करें। संयुक्त आकारों को पहले दो आयतों में बाँटें।',
          mr: 'प्रत्येक आकाराचे क्षेत्रफळ व परिमिती काढा. संयुक्त आकारांचे प्रथम आयतांत विभाजन करा.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
          { en: 'ruler', hi: 'स्केल', mr: 'पट्टी' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Draw an L-shape made of a 4x2 rectangle and a 3x3 square. Calculate total area.',
        hi: '4x2 आयत और 3x3 वर्ग से बना L-आकार बनाएं। कुल क्षेत्रफल ज्ञात करें।',
        mr: '4x2 आयत आणि 3x3 चौरस मिळून L-आकार काढा. एकूण क्षेत्रफळ काढा.',
      },
      checklist: [
        { en: 'Partitions composite shapes without overlapping', hi: 'बिना ओवरलैप किए संयुक्त आकारों को विभाजित करता है', mr: 'अतिव्यापन न करता संयुक्त आकारांचे भाग करतो' },
        { en: 'Calculates fencing cost correctly', hi: 'बाड़ लगाने की लागत की सही गणना करता है', mr: 'कुंपणाचा खर्च अचूक मोजतो' },
      ],
      questions: [
        gen('area', 3, { digits: 2 }),
        gen('perimeter', 2, { digits: 2 }),
        { type: 'static', items: [
          item(
            { en: 'A garden is 12 m long and 8 m wide. How many metres of fencing are needed?', hi: 'एक बगीचा 12 मी लंबा और 8 मी चौड़ा है। चारों ओर बाड़ लगाने के लिए कितने मीटर तार चाहिए?', mr: 'एक बाग 12 मी लांब आणि 8 मी रुंद आहे. कुंपण घालण्यासाठी किती मीटर तार लागेल?' },
            { en: '40 m', hi: '40 मी', mr: '40 मी' },
            {
              support: [
                { en: 'A garden is 10 m long and 5 m wide. What is the perimeter?', hi: 'एक बगीचा 10 मी लंबा और 5 मी चौड़ा है। परिमाप क्या है?', mr: 'एक बाग 10 मी लांब आणि 5 मी रुंद आहे. परिमिती किती?' },
                { en: '30 m', hi: '30 मी', mr: '30 मी' },
              ],
              stretch: [
                { en: 'A garden is 12 m long and 8 m wide. Fencing costs ₹15 per metre. What is the total cost?', hi: 'एक बगीचा 12 मी लंबा और 8 मी चौड़ा है। बाड़ लगाने का खर्च ₹15 प्रति मीटर है। कुल खर्च क्या होगा?', mr: 'एक बाग 12 मी लांब आणि 8 मी रुंद आहे. कुंपणाचा खर्च ₹15 प्रति मीटर आहे. एकूण खर्च किती होईल?' },
                { en: '₹600', hi: '₹600', mr: '₹600' },
              ],
            }
          ),
        ] },
      ],
    },
  },
};

const body: Topic = {
  id: 'evs-body',
  subject: 'evs',
  title: { en: 'My Body (EVS)', hi: 'मेरा शरीर (पर्यावरण अध्ययन)', mr: 'माझे शरीर (परिसर अभ्यास)' },
  theme: { en: 'Staying healthy in our village', hi: 'गाँव में स्वस्थ रहना', mr: 'गावात निरोगी राहणे' },
  hook: {
    en: 'Ask the class: "Touch your head. Touch your knees. How many fingers do you have?" Each grade explores the body at its own level.',
    hi: 'कक्षा से पूछें: "अपने सिर को छुएं। अपने घुटनों को छुएं। आपकी कितनी उंगलियाँ हैं?" प्रत्येक कक्षा अपने स्तर पर शरीर का अन्वेषण करती है।',
    mr: 'वर्गाला विचारा: "डोक्याला हात लावा. गुडघ्याला हात लावा. तुम्हाला किती बोटे आहेत?" प्रत्येक इयत्ता शरीराबद्दल स्वतःच्या पातळीवर शिकते.',
  },
  mapping: 'Draft: EVS body, food, hygiene and health units, NCERT Classes 1-5 (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Names major body parts and their basic functions.',
        hi: 'शरीर के मुख्य अंगों और उनके बुनियादी कार्यों के नाम बताता है।',
        mr: 'शरीराच्या मुख्य अवयवांची व त्यांच्या मूलभूत कार्यांची नावे सांगतो.',
      },
      teacher: {
        title: { en: 'Head, shoulders, knees and toes', hi: 'सिर, कंधे, घुटने और पैर', mr: 'डोके, खांदे, गुडघे आणि पावले' },
        minutes: 8,
        steps: [
          { en: 'Sing the rhyme and point to body parts.', hi: 'कविता गाएं और शरीर के अंगों की ओर इशारा करें।', mr: 'गाणे म्हणा आणि शरीराच्या अवयवांकडे बोट दाखवा.' },
          { en: 'Ask: what do your eyes do? What do your ears do?', hi: 'पूछें: आँखें क्या करती हैं? कान क्या करते हैं?', mr: 'विचारा: डोळे काय काम करतात? कान काय काम करतात?' },
          { en: 'Count: how many fingers? How many toes?', hi: 'गिनें: हाथ की कितनी उंगलियाँ? पैर की कितनी उंगलियाँ?', mr: 'मोजा: हाताची बोटे किती? पायाची बोटे किती?' },
        ],
      },
      independent: {
        title: { en: 'Label the body', hi: 'शरीर के अंगों के नाम लिखें', mr: 'शरीराचे अवयव दाखवा' },
        instructions: {
          en: 'Draw a stick figure. Label: head, hand, leg, eyes, nose.',
          hi: 'एक सरल मानव चित्र बनाएं। नाम लिखें: सिर, हाथ, पैर, आँख, नाक।',
          mr: 'साधी मानवी आकृती काढा. नावे द्या: डोके, हात, पाय, डोळे, नाक.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'drawing sheet', hi: 'ड्राइंग शीट', mr: 'चित्रकला कागद' },
          { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Colour your stick figure and count how many sense organs it has.',
        hi: 'अपने चित्र में रंग भरें और गिनें कि इसमें कितनी ज्ञानेंद्रियाँ हैं।',
        mr: 'चित्रात रंग भरा आणि त्यात किती ज्ञानेंद्रिये आहेत ते मोजा.',
      },
      checklist: [
        { en: 'Identifies 5 basic sense organs', hi: '5 बुनियादी ज्ञानेंद्रियों की पहचान करता है', mr: '५ मूलभूत ज्ञानेंद्रिये ओळखतो' },
        { en: 'Points to body parts without hesitation', hi: 'बिना झिझक के शरीर के अंगों की ओर इशारा करता है', mr: 'न अडखळता शरीराचे अवयव दाखवतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'We see with our ______.', hi: 'हम अपनी ______ से देखते हैं।', mr: 'आपण आपल्या ______ ने पाहतो.' },
          { en: 'Eyes', hi: 'आँखों', mr: 'डोळ्यां' },
          {
            support: [
              { en: 'We see with our: ears / eyes', hi: 'हम देखते हैं: कानों से / आँखों से', mr: 'आपण पाहतो: कानाने / डोळ्याने' },
              { en: 'Eyes', hi: 'आँखों से', mr: 'डोळ्याने' },
            ],
            stretch: [
              { en: 'Name two things our eyes help us do.', hi: 'दो बातें बताएं जो आँखें हमें करने में मदद करती हैं।', mr: 'डोळे आपल्याला कोणती दोन कामे करायला मदत करतात ते सांगा.' },
              { en: 'See colours and read books', hi: 'रंग देखना और किताबें पढ़ना', mr: 'रंग पाहणे आणि पुस्तके वाचणे' },
            ],
          }
        ),
        item(
          { en: 'How many legs do you have?', hi: 'आपके कितने पैर हैं?', mr: 'तुम्हाला किती पाय आहेत?' },
          { en: '2', hi: '2', mr: '2' },
          {
            support: [
              { en: 'How many legs: 2 / 4', hi: 'कितने पैर: 2 / 4', mr: 'किती पाय: 2 / 4' },
              { en: '2', hi: '2', mr: '2' },
            ],
            stretch: [
              { en: 'How many legs do 2 children have altogether?', hi: '2 बच्चों के कुल मिलाकर कितने पैर होंगे?', mr: '२ मुलांचे मिळून एकूण किती पाय होतील?' },
              { en: '4', hi: '4', mr: '4' },
            ],
          }
        ),
        item(
          { en: 'Draw yourself and label 3 body parts.', hi: 'अपना चित्र बनाएं और 3 अंगों के नाम लिखें।', mr: 'स्वतःचे चित्र काढा आणि ३ अवयवांची नावे लिहा.' },
          { en: 'Stick figure with 3 labels', hi: '3 नामांकित अंगों वाला चित्र', mr: '३ अवयवांची नावे असलेले चित्र' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Human stick figure sketch accessible to all Grade 1 tiers' }
        ),
      ] }],
    },
    2: {
      outcome: {
        en: 'Groups foods into energy-giving, body-building, and protective; knows why each group is needed.',
        hi: 'भोज्य पदार्थों को ऊर्जा देने वाले, शरीर निर्माण और सुरक्षात्मक समूहों में बाँटता है; प्रत्येक की आवश्यकता जानता है।',
        mr: 'अन्नपदार्थांचे ऊर्जा देणारे, शरीर बांधणी करणारे आणि संरक्षणात्मक गटांत वर्गीकरण करतो; महत्त्व सांगतो.',
      },
      teacher: {
        title: { en: 'Food sorting game', hi: 'भोजन वर्गीकरण खेल', mr: 'अन्न वर्गीकरण खेळ' },
        minutes: 10,
        steps: [
          { en: 'Show picture cards: rice, dal, milk, fruit, vegetables, chapati.', hi: 'चित्र कार्ड दिखाएं: चावल, दाल, दूध, फल, सब्जियाँ, रोटी।', mr: 'चित्रे दाखवा: भात, डाळ, दूध, फळे, भाज्या, चपाती/भाकरी.' },
          { en: 'Sort into three groups: energy, body-building, protective.', hi: 'तीन समूहों में छाँटें: ऊर्जा, शरीर निर्माण, सुरक्षात्मक।', mr: 'तीन गटांत वर्गीकरण करा: ऊर्जादायी, शरीरबांधणी, संरक्षक.' },
          { en: 'Ask: what happens if we eat only rice?', hi: 'पूछें: यदि हम केवल चावल खाएं तो क्या होगा?', mr: 'विचारा: जर आपण फक्त भातच खाल्ला तर काय होईल?' },
        ],
      },
      independent: {
        title: { en: 'My food plate', hi: 'मेरी भोजन की थाली', mr: 'माझे जेवणाचे ताट' },
        instructions: {
          en: 'Draw a plate. Fill it with one food from each group. Label the groups.',
          hi: 'एक थाली का चित्र बनाएं। प्रत्येक समूह से एक भोजन रखें। समूहों के नाम लिखें।',
          mr: 'जेवणाचे ताट काढा. प्रत्येक गटातील एक पदार्थ त्यात दाखवा. गटांची नावे लिहा.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [
          { en: 'crayons', hi: 'मोमी रंग', mr: 'रंगखडू' },
          { en: 'worksheet', hi: 'वर्कशीट', mr: 'कार्यपत्रिका' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'List 3 local fruits and 3 green vegetables grown in our village.',
        hi: 'अपने गाँव में उगने वाले 3 स्थानीय फलों और 3 हरी सब्जियों के नाम लिखें।',
        mr: 'गावात पिकणारी ३ स्थानिक फळे आणि ३ पालेभाज्यांची नावे लिहा.',
      },
      checklist: [
        { en: 'Identifies dal/milk as body-building', hi: 'दाल/दूध को शरीर निर्माण करने वाले भोजन के रूप में पहचानता है', mr: 'डाळ/दूध हे शरीरबांधणीचे अन्न म्हणून ओळखतो' },
        { en: 'Names protective fruits/vegetables', hi: 'सुरक्षात्मक फल/सब्जियों के नाम बताता है', mr: 'संरक्षक फळे व भाज्यांची नावे सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Rice and chapati give us ______ (energy / strong bones).', hi: 'चावल और रोटी हमें ______ देते हैं (ऊर्जा / मजबूत हड्डियाँ)।', mr: 'भात आणि चपाती आपल्याला ______ देतात (ऊर्जा / मजबूत हाडे).' },
          { en: 'Energy', hi: 'ऊर्जा', mr: 'ऊर्जा' },
          {
            support: [
              { en: 'Do chapati and rice give us energy? Yes / No', hi: 'क्या रोटी और चावल हमें ऊर्जा देते हैं? हाँ / नहीं', mr: 'चपाती आणि भातामुळे आपल्याला ऊर्जा मिळते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Why do farm workers need more energy-giving food?', hi: 'खेत में काम करने वाले मजदूरों को अधिक ऊर्जा देने वाले भोजन की आवश्यकता क्यों होती है?', mr: 'शेतात काम करणाऱ्या मजुरांना अधिक ऊर्जा देणाऱ्या अन्नाची गरज का असते?' },
              { en: 'They do heavy physical work all day', hi: 'वे दिन भर कठिन शारीरिक श्रम करते हैं', mr: 'ते दिवसभर कष्टाचे शारीरिक काम करतात' },
            ],
          }
        ),
        item(
          { en: 'Name two body-building foods.', hi: 'शरीर का निर्माण करने वाले दो भोज्यों के नाम लिखें।', mr: 'शरीराची वाढ करणाऱ्या दोन अन्नपदार्थांची नावे लिहा.' },
          { en: 'Dal, milk, eggs, paneer, fish', hi: 'दाल, दूध, अंडे, पनीर, मछली', mr: 'डाळ, दूध, अंडी, पनीर, मासे' },
          {
            support: [
              { en: 'Is milk a body-building food? Yes / No', hi: 'क्या दूध शरीर निर्माण करने वाला भोजन है? हाँ / नहीं', mr: 'दूध शरीराची वाढ करणारे अन्न आहे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Why do growing children need more body-building foods?', hi: 'बढ़ते बच्चों को शरीर का निर्माण करने वाले भोजन की अधिक आवश्यकता क्यों होती है?', mr: 'वाढत्या वयातील मुलांना शरीर वाढवणाऱ्या अन्नाची जास्त गरज का असते?' },
              { en: 'To build muscles and bones', hi: 'मांसपेशियों और हड्डियों के विकास के लिए', mr: 'स्नायू आणि हाडे मजबूत होण्यासाठी' },
            ],
          }
        ),
        item(
          { en: 'Why should we eat fruits and vegetables every day?', hi: 'हमें रोज फल और सब्जियाँ क्यों खानी चाहिए?', mr: 'आपण दररोज फळे आणि पालेभाज्या का खाव्यात?' },
          { en: 'They protect us from diseases and give vitamins', hi: 'वे हमें बीमारियों से बचाते हैं और विटामिन देते हैं', mr: 'त्यामुळे आजारांपासून संरक्षण मिळते व जीवनसत्त्वे मिळतात' },
          {
            support: [
              { en: 'Do vegetables protect us from diseases? Yes / No', hi: 'क्या सब्जियाँ हमें बीमारियों से बचाती हैं? हाँ / नहीं', mr: 'भाज्या आपल्याला आजारांपासून वाचवतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name 2 diseases that can happen if we do not eat enough fruits and vegetables.', hi: 'ऐसे 2 रोगों के नाम लिखें जो फल और सब्जियाँ न खाने से हो सकते हैं।', mr: 'फळे व भाज्या न खाल्ल्यास होणाऱ्या २ आजारांची नावे लिहा.' },
              { en: 'Scurvy, night blindness, weak immunity', hi: 'रतौंधी, स्कर्वी, कमजोर प्रतिरोधक क्षमता', mr: 'रातांधळेपणा, स्कर्वी, अशक्तपणा' },
            ],
          }
        ),
      ] }],
    },
    3: {
      outcome: {
        en: 'Describes the journey of food through the body (mouth → stomach → intestine) in simple terms.',
        hi: 'शरीर में भोजन की यात्रा (मुँह → पेट → आंत) को सरल शब्दों में समझाता है।',
        mr: 'अन्नाचा शरीरातील प्रवास (तोंड → जठर → आतडे) साध्या शब्दांत सांगतो.',
      },
      teacher: {
        title: { en: 'Where does food go?', hi: 'भोजन कहाँ जाता है?', mr: 'अन्न कुठे जाते?' },
        minutes: 12,
        steps: [
          { en: 'Ask: what happens to a chapati after you eat it?', hi: 'पूछें: रोटी खाने के बाद उसका क्या होता है?', mr: 'विचारा: चपाती खाल्ल्यानंतर तिचे काय होते?' },
          { en: 'Draw a simple diagram: mouth → food pipe → stomach → intestine.', hi: 'सरल चित्र बनाएं: मुँह → भोजन नली → पेट → आंत।', mr: 'साधी आकृती काढा: तोंड → अन्ननलिका → जठर → आतडे.' },
          { en: 'Explain: teeth break food, stomach mixes it, intestine absorbs it.', hi: 'समझाएं: दाँत भोजन चबाते हैं, पेट इसे मिलाता है, आंत इसे सोखती है।', mr: 'समजवा: दात चावतात, जठर घुसळते, आतडे पोषकद्रव्ये शोषून घेते.' },
        ],
      },
      independent: {
        title: { en: 'Digestion diagram', hi: 'पाचन तंत्र चित्र', mr: 'पचनसंस्थेचे चित्र' },
        instructions: {
          en: 'Draw the path of food from mouth to intestine. Label each part.',
          hi: 'मुँह से आंत तक भोजन का मार्ग बनाएं। प्रत्येक भाग का नाम लिखें।',
          mr: 'तोंडापासून आतड्यापर्यंत अन्नाचा मार्ग काढा. अवयवांची नावे लिहा.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
          { en: 'colour pencils', hi: 'रंगीन पेंसिल', mr: 'रंगीत पेन्सिल' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Write why chewing food slowly with saliva helps digestion.',
        hi: 'लिखें कि लार के साथ भोजन को धीरे-धीरे चबाना पाचन में कैसे मदद करता है।',
        mr: 'लाळेसोबत अन्न हळूहळू चावून खाल्ल्याने पचन कसे चांगले होते ते लिहा.',
      },
      checklist: [
        { en: 'Explains role of teeth in chewing', hi: 'चबाने में दाँतों की भूमिका समझाता है', mr: 'चावण्यात दातांची भूमिका सांगतो' },
        { en: 'Names stomach and intestines in order', hi: 'पेट और आंतों का सही क्रम से नाम लेता है', mr: 'जठर आणि आतडी यांचा योग्य क्रम सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Where does digestion begin in our body?', hi: 'हमारे शरीर में पाचन कहाँ से शुरू होता है?', mr: 'आपल्या शरीरात पचनाची सुरुवात कुठून होते?' },
          { en: 'In the mouth (with teeth and saliva)', hi: 'मुँह में (दाँत और लार द्वारा)', mr: 'तोंडात (दात आणि लाळ यांच्या मदतीने)' },
          {
            support: [
              { en: 'Does digestion begin in mouth or stomach?', hi: 'क्या पाचन मुँह में शुरू होता है या पेट में?', mr: 'पचन तोंडात सुरू होते की पोटात?' },
              { en: 'Mouth', hi: 'मुँह में', mr: 'तोंडात' },
            ],
            stretch: [
              { en: 'What role does saliva play in digestion in the mouth?', hi: 'मुँह में लार पाचन में क्या भूमिका निभाती है?', mr: 'तोंडात लाळेचा पचनासाठी काय उपयोग होतो?' },
              { en: 'Softens food and breaks down starch', hi: 'भोजन को नरम बनाती है और स्टार्च पचाती है', mr: 'अन्न मऊ करते आणि पिष्टमय पदार्थांचे पचन सुरू करते' },
            ],
          }
        ),
        item(
          { en: 'Draw the food pipe connecting mouth to stomach.', hi: 'मुँह को पेट से जोड़ने वाली भोजन नली का चित्र बनाएं।', mr: 'तोंडाला पोटाशी जोडणारी अन्ननलिका आकृतीत दाखवा.' },
          { en: 'Diagram with mouth, food pipe, stomach labelled', hi: 'मुँह, भोजन नली, पेट नामांकित चित्र', mr: 'तोंड, अन्ननलिका आणि पोट दाखवणारी आकृती' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Anatomical path sketch connecting mouth to stomach suitable across tiers' }
        ),
        item(
          { en: 'Why should we chew our food thoroughly before swallowing?', hi: 'भोजन निगलने से पहले हमें उसे अच्छी तरह क्यों चबाना चाहिए?', mr: 'अन्न गिळण्यापूर्वी आपण ते नीट का चावले पाहिजे?' },
          { en: 'Chewing breaks food into small pieces and mixes saliva', hi: 'चबाने से भोजन छोटे टुकड़ों में टूटता है और लार मिलती है', mr: 'चावल्यामुळे अन्नाचे बारीक तुकडे होतात आणि लाळ मिसळते' },
          {
            support: [
              { en: 'Should we chew food properly? Yes / No', hi: 'क्या हमें भोजन ठीक से चबाना चाहिए? हाँ / नहीं', mr: 'आपण अन्न नीट चावून खावे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Give two benefits of chewing food thoroughly.', hi: 'भोजन को अच्छी तरह चबाने के दो फायदे बताएं।', mr: 'अन्न नीट चावून खाण्याचे दोन फायदे सांगा.' },
              { en: 'Better digestion and faster nutrient absorption', hi: 'बेहतर पाचन और पोषक तत्वों का तेजी से अवशोषण', mr: 'पचन सुलभ होते आणि पोषक घटक सहज शोषले जातात' },
            ],
          }
        ),
      ] }],
    },
    4: {
      outcome: {
        en: 'Explains how the lungs, heart, and blood work together to keep us alive.',
        hi: 'समझाता है कि फेफड़े, हृदय और रक्त मिलकर हमें जीवित रखने के लिए कैसे काम करते हैं।',
        mr: 'फुफ्फुसे, हृदय आणि रक्त हे एकत्र येऊन शरीर कसे चालवतात ते सांगतो.',
      },
      teacher: {
        title: { en: 'Breathe in, feel the pulse', hi: 'साँस लें, नाड़ी महसूस करें', mr: 'श्वास घ्या, नाडी तपासा' },
        minutes: 12,
        steps: [
          { en: 'Count breaths in 1 minute. Jump 20 times. Count again.', hi: '1 मिनट में साँसें गिनें। 20 बार कूदें। फिर से गिनें।', mr: '१ मिनिटात किती श्वास घेतले ते मोजा. २० उड्या मारा. पुन्हा मोजा.' },
          { en: 'Why did breathing speed up? Muscles need more oxygen.', hi: 'साँस तेज क्यों हुई? मांसपेशियों को अधिक ऑक्सीजन चाहिए।', mr: 'श्वास का वाढला? स्नायूंना जास्त ऑक्सिजनची गरज असते.' },
          { en: 'Feel your pulse at the wrist.', hi: 'कलाई पर अपनी नाड़ी महसूस करें।', mr: 'मनगटावर स्वतःची नाडी तपासा.' },
        ],
      },
      independent: {
        title: { en: 'Heart and lungs record', hi: 'हृदय और फेफड़ों का रिकॉर्ड', mr: 'हृदय व फुफ्फुसांची नोंद' },
        instructions: {
          en: 'Record resting heart rate vs rate after jumping. Explain the difference.',
          hi: 'विश्राम के समय की धड़कन और कूदने के बाद की धड़कन दर्ज करें। अंतर समझाएं।',
          mr: 'शांत बसताना व उड्या मारल्यानंतर ठोके किती पडतात ते नोंदवा. फरक सांगा.' },
        minutes: 15,
        mode: 'pair',
        materials: [
          { en: 'stopwatch/clock', hi: 'घड़ी', mr: 'घड्याळ' },
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Explain why smoking or inhaling chulha smoke harms our lungs.',
        hi: 'बताएं कि धूम्रपान या चूल्हे का धुआँ फेफड़ों को कैसे नुकसान पहुँचाता है।',
        mr: 'चुलीचा धूर फुफ्फुसांसाठी घातक का असतो ते दोन वाक्यांत लिहा.',
      },
      checklist: [
        { en: 'Locates heart in left chest', hi: 'छाती के बाईं ओर हृदय की स्थिति बताता है', mr: 'डाव्या छातीत हृदय असते हे ओळखतो' },
        { en: 'Explains that blood transports oxygen', hi: 'समझाता है कि रक्त ऑक्सीजन पहुँचाता है', mr: 'रक्त ऑक्सिजन वाहून नेते हे स्पष्ट करतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'What organ pumps blood to all parts of the body?', hi: 'शरीर के सभी भागों में रक्त पंप करने वाला अंग कौन सा है?', mr: 'शरीराच्या सर्व भागांना रक्त पुरवणारा अवयव कोणता?' },
          { en: 'Heart', hi: 'हृदय', mr: 'हृदय' },
          {
            support: [
              { en: 'The heart pumps: blood / air', hi: 'हृदय पंप करता है: रक्त / हवा', mr: 'हृदय पंप करते: रक्त / हवा' },
              { en: 'Blood', hi: 'रक्त', mr: 'रक्त' },
            ],
            stretch: [
              { en: 'How many chambers does the human heart have?', hi: 'मानव हृदय में कितने कक्ष होते हैं?', mr: 'मानवी हृदयात किती कप्पे असतात?' },
              { en: '4 chambers', hi: '4 कक्ष', mr: '४ कप्पे' },
            ],
          }
        ),
        item(
          { en: 'Why does our heart beat faster when we run?', hi: 'दौड़ते समय हमारा दिल तेजी से क्यों धड़कता है?', mr: 'धावताना आपली छाती वेगाने का धडधडते?' },
          { en: 'Muscles need more oxygen and energy', hi: 'मांसपेशियों को अधिक ऑक्सीजन और ऊर्जा की आवश्यकता होती है', mr: 'स्नायूंना अधिक ऑक्सिजन आणि ऊर्जेची गरज असते' },
          {
            support: [
              { en: 'Does running make heart beat faster? Yes / No', hi: 'क्या दौड़ने से दिल तेजी से धड़कता है? हाँ / नहीं', mr: 'धावल्याने हृदयाचे ठोके वाढतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Describe the path of oxygen from lungs to muscles.', hi: 'फेफड़ों से मांसपेशियों तक ऑक्सीजन का मार्ग बताएं।', mr: 'फुफ्फुसांतून स्नायूंपर्यंत ऑक्सिजनचा प्रवास सांगा.' },
              { en: 'Lungs -> Blood -> Heart -> Arteries -> Muscles', hi: 'फेफड़े -> रक्त -> हृदय -> धमनियां -> मांसपेशियां', mr: 'फुफ्फुस -> रक्त -> हृदय -> रक्तवाहिन्या -> स्नायू' },
            ],
          }
        ),
        item(
          { en: 'What gas do our lungs take in from the air?', hi: 'हमारे फेफड़े हवा से कौन सी गैस अंदर लेते हैं?', mr: 'आपली फुफ्फुसे हवेतून कोणता वायू आत घेतात?' },
          { en: 'Oxygen', hi: 'ऑक्सीजन', mr: 'ऑक्सिजन' },
          {
            support: [
              { en: 'Lungs take in: oxygen / smoke', hi: 'फेफड़े अंदर लेते हैं: ऑक्सीजन / धुआँ', mr: 'फुफ्फुसे आत घेतात: ऑक्सिजन / धूर' },
              { en: 'Oxygen', hi: 'ऑक्सीजन', mr: 'ऑक्सिजन' },
            ],
            stretch: [
              { en: 'What gas do we breathe out as waste?', hi: 'हम साँस छोड़ते समय कौन सी गैस बाहर निकालते हैं?', mr: 'उच्छ्वासावाटे आपण कोणता वायू बाहेर टाकतो?' },
              { en: 'Carbon dioxide', hi: 'कार्बन डाइऑक्साइड', mr: 'कार्बन डायऑक्साइड' },
            ],
          }
        ),
      ] }],
    },
    5: {
      outcome: {
        en: 'Classifies diseases into infectious and non-infectious; explains village sanitation and vaccination.',
        hi: 'रोगों को संक्रामक और गैर-संक्रामक में वर्गीकृत करता है; गाँव की स्वच्छता और टीकाकरण का महत्व समझाता है।',
        mr: 'आजारांचे संसर्गजन्य व असंसर्गजन्य वर्गीकरण करतो; गावातील स्वच्छता व लसीकरणाचे महत्त्व सांगतो.',
      },
      teacher: {
        title: { en: 'Germ busters in our village', hi: 'गाँव में रोगाणु निवारण', mr: 'गावातील रोगप्रतिबंध' },
        minutes: 12,
        steps: [
          { en: 'Discuss malaria, dengue, diarrhea, diabetes.', hi: 'मलेरिया, डेंगू, दस्त, मधुमेह पर चर्चा करें।', mr: 'हिवताप, डेंग्यू, अतिसार, मधुमेह यावर चर्चा करा.' },
          { en: 'Sort: spread by germs/mosquitoes vs caused by diet/lifestyle.', hi: 'छाँटें: कीटाणुओं/मच्छरों से फैलने वाले बनाम खान-पान/जीवनशैली से होने वाले।', mr: 'वर्गीकरण करा: डासांमुळे होणारे विरुद्ध आहारातील बदलांमुळे होणारे.' },
          { en: 'Explain how vaccines prevent infectious diseases.', hi: 'समझाएं कि टीके संक्रामक रोगों से कैसे बचाते हैं।', mr: 'लस घेतल्याने संसर्गजन्य आजार कसे टळतात ते सांगा.' },
        ],
      },
      independent: {
        title: { en: 'Village health charter', hi: 'गाँव स्वास्थ्य नियम', mr: 'गाव आरोग्य नियमावली' },
        instructions: {
          en: 'Write 4 rules to prevent mosquito breeding and water-borne illness.',
          hi: 'मच्छरों की वृद्धि और जलजनित रोगों को रोकने के लिए 4 नियम लिखें।',
          mr: 'डासांची उत्पत्ती आणि दूषित पाण्यामुळे होणारे आजार रोखण्यासाठी ४ नियम लिहा.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Draw a poster encouraging mothers to take babies for primary vaccination.',
        hi: 'माताओं को शिशुओं के टीकाकरण के लिए प्रेरित करने वाला एक पोस्टर बनाएं।',
        mr: 'लहान बालकांच्या लसीकरणासाठी प्रबोधन करणारे एक भित्तिपत्रक काढा.',
      },
      checklist: [
        { en: 'Knows mosquitoes transmit malaria and dengue', hi: 'जानता है कि मच्छर मलेरिया और डेंगू फैलाते हैं', mr: 'डासांमुळे हिवताप व डेंग्यू होतो हे सांगतो' },
        { en: 'Explains ORS for dehydration', hi: 'निर्जलीकरण के लिए ओआरएस का उपयोग समझाता है', mr: 'जलसंजीवनीचे महत्त्व सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Name one disease spread by mosquitoes.', hi: 'मच्छरों द्वारा फैलने वाले एक रोग का नाम लिखें।', mr: 'डासांमुळे पसरणाऱ्या एका आजाराचे नाव सांगा.' },
          { en: 'Malaria or dengue', hi: 'मलेरिया या डेंगू', mr: 'हिवताप किंवा डेंग्यू' },
          {
            support: [
              { en: 'Is malaria spread by mosquitoes? Yes / No', hi: 'क्या मलेरिया मच्छरों से फैलता है? हाँ / नहीं', mr: 'हिवताप डासांमुळे पसरतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name two diseases spread by mosquitoes and how to stop breeding.', hi: 'मच्छरों से फैलने वाले दो रोग और मच्छरों को रोकने का उपाय लिखें।', mr: 'डासांमुळे पसरणारे दोन आजार आणि पैदास रोखण्याचा उपाय लिहा.' },
              { en: 'Malaria and dengue; remove stagnant water', hi: 'मलेरिया और डेंगू; जमा पानी हटाना', mr: 'मलेरिया आणि डेंग्यू; साचलेले पाणी काढून टाकणे' },
            ],
          }
        ),
        item(
          { en: 'What is ORS used for during diarrhoea?', hi: 'दस्त के दौरान ओआरएस का उपयोग किस लिए किया जाता है?', mr: 'अतिसाराच्या वेळी जलसंजीवनी कशासाठी दिली जाते?' },
          { en: 'To replace lost water and salts, preventing dehydration', hi: 'पानी और लवण की कमी पूरी करके निर्जलीकरण रोकने के लिए', mr: 'शरीरातील पाणी व क्षारांची कमतरता भरून काढण्यासाठी' },
          {
            support: [
              { en: 'Does ORS help when a child has loose motions? Yes / No', hi: 'क्या दस्त होने पर ओआरएस मदद करता है? हाँ / नहीं', mr: 'उलट्या-जुलाब झाल्यावर ओआरएस उपयोगी पडते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'How do you prepare simple homemade ORS?', hi: 'घर पर ओआरएस घोल कैसे तैयार किया जाता है?', mr: 'घरी साधी जलसंजीवनी कशी तयार करावी?' },
              { en: '1 litre boiled water + 6 teaspoons sugar + half teaspoon salt', hi: '1 लीटर उबला पानी + 6 चम्मच चीनी + आधा चम्मच नमक', mr: '१ लिटर उकळलेले पाणी + ६ चमचे साखर + अर्धा चमचा मीठ' },
            ],
          }
        ),
        item(
          { en: 'Why do babies receive vaccines at the village primary health centre?', hi: 'गाँव के प्राथमिक स्वास्थ्य केंद्र पर बच्चों को टीके क्यों लगाए जाते हैं?', mr: 'प्राथमिक आरोग्य केंद्रात बालकांना लस का दिली जाते?' },
          { en: 'To build immunity and protect against deadly diseases like polio and measles', hi: 'प्रतिरोधक क्षमता बढ़ाने और पोलियो, खसरा जैसे घातक रोगों से बचाने के लिए', mr: 'प्रतिकारशक्ती निर्माण करून पोलिओ, गोवर यांसारख्या आजारांपासून संरक्षणासाठी' },
          {
            support: [
              { en: 'Do vaccines protect against diseases? Yes / No', hi: 'क्या टीके बीमारियों से रक्षा करते हैं? हाँ / नहीं', mr: 'लस आजारांपासून संरक्षण देते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name two diseases prevented by routine childhood vaccination.', hi: 'नियमित बाल टीकाकरण द्वारा रोके जाने वाले दो रोगों के नाम लिखें।', mr: 'नियमित लसीकरणामुळे टाळता येणाऱ्या दोन आजारांची नावे सांगा.' },
              { en: 'Polio, measles, tetanus, tuberculosis', hi: 'पोलियो, खसरा, टेटनस, टीबी', mr: 'पोलिओ, गोवर, धनुर्वात, क्षयरोग (टीबी)' },
            ],
          }
        ),
      ] }],
    },
  },
};

const plants: Topic = {
  id: 'evs-plants',
  subject: 'evs',
  title: { en: 'Plants Around Us (EVS)', hi: 'हमारे आसपास के पौधे (पर्यावरण)', mr: 'आपल्या सभोवतालच्या वनस्पती (परिसर अभ्यास)' },
  theme: { en: 'The neem tree in our school', hi: 'हमारे स्कूल का नीम का पेड़', mr: 'आमच्या शाळेतील कडुनिंबाचे झाड' },
  hook: {
    en: 'Gather near a tree or look out the window. Ask: "What makes plants different from animals? What do plants give us?"',
    hi: 'एक पेड़ के पास इकट्ठा हों या खिड़की से बाहर देखें। पूछें: "पौधे जानवरों से कैसे अलग हैं? पौधे हमें क्या देते हैं?"',
    mr: 'झाडाजवळ जमा व्हा किंवा खिडकीबाहेर पाहा. विचारा: "वनस्पती प्राण्यांपेक्षा कशा वेगळ्या असतात? वनस्पती आपल्याला काय देतात?"',
  },
  mapping: 'Draft: EVS plant life, agriculture and environment units, NCERT Classes 1-5 (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Identifies parts of a plant (root, stem, leaf, flower, fruit).',
        hi: 'पौधे के अंगों की पहचान करता है (जड़, तना, पत्ती, फूल, फल)।',
        mr: 'वनस्पतीचे अवयव ओळखतो (मूळ, खोड, पान, फूल, फळ).',
      },
      teacher: {
        title: { en: 'Plant anatomy walk', hi: 'पौधे के अंगों का अवलोकन', mr: 'वनस्पतीच्या अवयवांची ओळख' },
        minutes: 8,
        steps: [
          { en: 'Observe a potted plant or weed carefully.', hi: 'गमले के पौधे या किसी छोटे पौधे को ध्यान से देखें।', mr: 'कुंडीतील रोपाचे किंवा लहान वनस्पतीचे नीट निरीक्षण करा.' },
          { en: 'Point to roots in soil, stem holding it up, leaves catching sun, flowers.', hi: 'मिट्टी में जड़ों, पौधे को सीधा रखने वाले तने, धूप लेने वाली पत्तियों और फूलों को दिखाएं।', mr: 'मातीतील मुळे, झाडाला आधार देणारे खोड, सूर्यप्रकाश घेणारी पाने आणि फुले दाखवा.' },
          { en: 'Children touch leaves and describe texture.', hi: 'बच्चे पत्तियों को छूकर उनकी बनावट बताएं।', mr: 'मुलांनी पानांना स्पर्श करून त्यांचा पोत सांगावा.' },
        ],
      },
      independent: {
        title: { en: 'Draw and label a plant', hi: 'पौधा बनाएं और नाम लिखें', mr: 'वनस्पतीचे चित्र काढा आणि नावे द्या' },
        instructions: {
          en: 'Draw a plant. Label: root, stem, leaf, flower.',
          hi: 'एक पौधा बनाएं। नाम लिखें: जड़, तना, पत्ती, फूल।',
          mr: 'एका वनस्पतीचे चित्र काढा. नावे लिहा: मूळ, खोड, पान, फूल.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'drawing sheet', hi: 'ड्राइंग शीट', mr: 'चित्रकला कागद' },
          { en: 'colour pencils', hi: 'रंगीन पेंसिलें', mr: 'रंगीत पेन्सिल' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Collect two fallen leaves of different shapes and trace their outlines.',
        hi: 'अलग-अलग आकार की दो गिरी हुई पत्तियां उठाएं और उनकी रूपरेखा बनाएं।',
        mr: 'वेगवेगळ्या आकारांची पडलेली दोन पाने गोळा करा आणि त्यांची बाह्यरेषा पेन्सिलने गिरवा.',
      },
      checklist: [
        { en: 'Points correctly to roots underground', hi: 'जमीन के नीचे जड़ों को सही ढंग से दर्शाता है', mr: 'जमिनीखालील मुळे अचूक दाखवतो' },
        { en: 'Names green part as leaf', hi: 'हरे भाग को पत्ती बताता है', mr: 'हिरव्या भागाला पान असे सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Which part of the plant grows under the ground?', hi: 'पौधे का कौन सा भाग जमीन के नीचे बढ़ता है?', mr: 'वनस्पतीचा कोणता भाग जमिनीखाली वाढतो?' },
          { en: 'Roots', hi: 'जड़', mr: 'मूळ' },
          {
            support: [
              { en: 'Roots grow: under the ground / in the sky', hi: 'जड़ें बढ़ती हैं: जमीन के नीचे / आसमान में', mr: 'मुळे वाढतात: जमिनीखाली / आकाशात' },
              { en: 'Under the ground', hi: 'जमीन के नीचे', mr: 'जमिनीखाली' },
            ],
            stretch: [
              { en: 'Give two functions of plant roots.', hi: 'पौधे की जड़ों के दो कार्य बताएं।', mr: 'वनस्पतीच्या मुळांची दोन कार्ये सांगा.' },
              { en: 'Hold plant in soil and absorb water', hi: 'पौधे को मिट्टी में थामे रखना और पानी सोखना', mr: 'वनस्पतीला मातीत घट्ट रोवून ठेवणे आणि पाणी शोषून घेणे' },
            ],
          }
        ),
        item(
          { en: 'Draw a plant and label the leaf and flower.', hi: 'एक पौधा बनाएं और पत्ती तथा फूल को नामांकित करें।', mr: 'वनस्पतीचे चित्र काढा आणि पान व फूल दाखवा.' },
          { en: 'Plant drawing with labels', hi: 'नामांकित पौधे का चित्र', mr: 'नामांकित वनस्पतीचे चित्र' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Basic botanical plant diagram accessible to emerging writers across Grade 1 tiers' }
        ),
        item(
          { en: 'What colour are most leaves on a tree?', hi: 'पेड़ की अधिकांश पत्तियां किस रंग की होती हैं?', mr: 'झाडाची बहुतांश पाने कोणत्या रंगाची असतात?' },
          { en: 'Green', hi: 'हरा', mr: 'हिरवा' },
          {
            support: [
              { en: 'Are most leaves green? Yes / No', hi: 'क्या अधिकांश पत्तियां हरी होती हैं? हाँ / नहीं', mr: 'बहुतेक पाने हिरवी असतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What green substance in leaves makes them green?', hi: 'पत्तियों में कौन सा हरा पदार्थ उन्हें हरा रंग देता है?', mr: 'पानांमधील कोणता हिरवा घटक त्यांना हिरवा रंग देतो?' },
              { en: 'Chlorophyll', hi: 'क्लोरोफिल (पर्णहरित)', mr: 'हरितद्रव्य (क्लोरोफिल)' },
            ],
          }
        ),
      ] }],
    },
    2: {
      outcome: {
        en: 'Classifies plants into herbs, shrubs, trees, climbers and creepers.',
        hi: 'पौधों को शाक, झाड़ी, पेड़, लता और विसर्पी लता में वर्गीकृत करता है।',
        mr: 'वनस्पतींचे वर्गीकरण रोपटे, झुडूप, झाड, वेल आणि भुईवेल यात करतो.',
      },
      teacher: {
        title: { en: 'Tree, shrub or climber?', hi: 'पेड़, झाड़ी या लता?', mr: 'झाड, झुडूप की वेल?' },
        minutes: 10,
        steps: [
          { en: 'Compare grass (herb), rose (shrub), banyan (tree), money plant (climber), pumpkin (creeper).', hi: 'घास (शाक), गुलाब (झाड़ी), बरगद (पेड़), मनी प्लांट (लता) और कद्दू (विसर्पी) की तुलना करें।', mr: 'गवत (रोपटे), गुलाब (झुडूप), वड (झाड), मनी प्लांट (आरोही वेल) आणि भोपळा (भुईवेल) यांची तुलना करा.' },
          { en: 'Introduce stem differences: soft green stem vs woody trunk.', hi: 'तने के अंतर समझाएं: कोमल हरा तना बनाम लकड़ीदार तना।', mr: 'खोडांमधील फरक सांगा: मऊ हिरवे खोड विरुद्ध लाकडी बुंधा.' },
          { en: 'Children find one of each in the schoolyard.', hi: 'बच्चे स्कूल के मैदान में प्रत्येक का एक उदाहरण खोजें।', mr: 'मुलांनी शाळेच्या आवारात या प्रत्येकाचे एक उदाहरण शोधावे.' },
        ],
      },
      independent: {
        title: { en: 'Plant sorting table', hi: 'पौधों की वर्गीकरण तालिका', mr: 'वनस्पती वर्गीकरण तक्ता' },
        instructions: {
          en: 'List two examples each for tree, shrub, and climber.',
          hi: 'पेड़, झाड़ी और लता के दो-दो उदाहरण लिखें।',
          mr: 'झाड, झुडूप आणि वेल या प्रत्येकाची दोन उदाहरणे लिहा.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Draw a climber plant wrapping around a wooden stick for support.',
        hi: 'सहारे के लिए लकड़ी की छड़ी पर लिपटी लता का चित्र बनाएं।',
        mr: 'काठीच्या आधाराने वर चढणाऱ्या वेलीचे चित्र काढा.',
      },
      checklist: [
        { en: 'Recognizes that herbs have non-woody stems', hi: 'पहचानता है कि शाक का तना लकड़ीदार नहीं होता', mr: 'रोपट्यांचे खोड मऊ व हिरवे असते हे ओळखतो' },
        { en: 'Gives local examples of climbers like peas or gourds', hi: 'मटर या लौकी जैसी लताओं के स्थानीय उदाहरण देता है', mr: 'वाटाणा किंवा भोपळ्यासारख्या वेलींची स्थानिक उदाहरणे देतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'A mango tree has a thick woody stem called a ______.', hi: 'आम के पेड़ के मोटे लकड़ीदार तने को ______ कहते हैं।', mr: 'आंब्याच्या झाडाच्या जाड लाकडी खोडाला ______ म्हणतात.' },
          { en: 'Trunk', hi: 'तना', mr: 'बुंधा' },
          {
            support: [
              { en: 'The thick woody stem of a tree is a: trunk / leaf', hi: 'पेड़ का मोटा लकड़ीदार तना होता है: तना / पत्ती', mr: 'झाडाचे जाड लाकडी खोड म्हणजे: बुंधा / पान' },
              { en: 'Trunk', hi: 'तना', mr: 'बुंधा' },
            ],
            stretch: [
              { en: 'Explain the difference between a tree trunk and a herb stem.', hi: 'पेड़ के तने और शाक के तने में अंतर स्पष्ट करें।', mr: 'झाडाचा बुंधा आणि रोपट्याचे खोड यातील फरक स्पष्ट करा.' },
              { en: 'Trunk is hard and woody; herb stem is soft and green', hi: 'पेड़ का तना कठोर और लकड़ीदार होता है; शाक का तना कोमल और हरा होता है', mr: 'बुंधा कठीण व लाकडी असतो; रोपट्याचे खोड मऊ व हिरवे असते' },
            ],
          }
        ),
        item(
          { en: 'Name one plant that needs support to climb up.', hi: 'ऊपर चढ़ने के लिए सहारे की जरूरत वाले एक पौधे का नाम बताएं।', mr: 'वर चढण्यासाठी आधाराची गरज असणाऱ्या एका वनस्पतीचे नाव सांगा.' },
          { en: 'Pea plant, grapevine, bitter gourd, money plant', hi: 'मटर, अंगूर, करेला, मनी प्लांट', mr: 'वाटाणा, द्राक्ष, कारले, मनी प्लांट' },
          {
            support: [
              { en: 'Does a pea plant climb with support? Yes / No', hi: 'क्या मटर का पौधा सहारे से ऊपर चढ़ता है? हाँ / नहीं', mr: 'वाटाण्याचा वेल आधाराने वर चढतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What special spring-like parts help climbers grip supports?', hi: 'लताओं को सहारे से पकड़ने में कौन से विशेष स्प्रिंग जैसे अंग मदद करते हैं?', mr: 'वेलींना आधाराला घट्ट पकडण्यासाठी कोणते स्प्रिंगसारखे अवयव मदत करतात?' },
              { en: 'Tendrils', hi: 'प्रतान (तंतु)', mr: 'तणाव (टेंड्रिल्स)' },
            ],
          }
        ),
        item(
          { en: 'Is tulsi a tree, a shrub, or a herb?', hi: 'तुलसी पेड़ है, झाड़ी है या शाक?', mr: 'तुळस हे झाड, झुडूप की रोपटे आहे?' },
          { en: 'Shrub or herb (accept either with description)', hi: 'झाड़ी या शाक', mr: 'झुडूप किंवा रोपटे' },
          {
            support: [
              { en: 'Is tulsi a herb/shrub? Yes / No', hi: 'क्या तुलसी शाक/झाड़ी है? हाँ / नहीं', mr: 'तुळस हे रोपटे/झुडूप आहे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name two medicinal plants found in our village besides tulsi.', hi: 'तुलसी के अलावा हमारे गाँव में पाए जाने वाले दो औषधीय पौधों के नाम बताएं।', mr: 'तुळशीव्यतिरिक्त आपल्या गावात आढळणाऱ्या दोन औषधी वनस्पतींची नावे सांगा.' },
              { en: 'Neem, aloe vera (khorpad), adulsa', hi: 'नीम, एलोवेरा (ग्वारपाठा), अडूसा', mr: 'कडुनिंब, कोरफड, अडुळसा' },
            ],
          }
        ),
      ] }],
    },
    3: {
      outcome: {
        en: 'Explains how green leaves make food using sunlight, water, and air (photosynthesis).',
        hi: 'समझाता है कि हरी पत्तियां धूप, पानी और हवा से भोजन कैसे बनाती हैं (प्रकाश संश्लेषण)।',
        mr: 'हिरवी पाने सूर्यप्रकाश, पाणी आणि हवेचा वापर करून अन्न कसे तयार करतात (प्रकाशसंश्लेषण) हे स्पष्ट करतो.',
      },
      teacher: {
        title: { en: 'The food factory', hi: 'भोजन की रसोई (पत्ती)', mr: 'अन्न निर्मितीचा कारखाना' },
        minutes: 12,
        steps: [
          { en: 'Introduce the leaf as the kitchen of the plant.', hi: 'पत्ती को पौधे की रसोई के रूप में प्रस्तुत करें।', mr: 'पानाला वनस्पतीचे स्वयंपाकघर म्हणून ओळख करून द्या.' },
          { en: 'Write the recipe: Sunlight + Water + Air (Carbon dioxide) -> Food + Oxygen.', hi: 'प्रक्रिया लिखें: धूप + पानी + कार्बन डाइऑक्साइड -> भोजन + ऑक्सीजन।', mr: 'प्रक्रिया लिहा: सूर्यप्रकाश + पाणी + कार्बन डायऑक्साइड -> अन्न + ऑक्सिजन.' },
          { en: 'Explain why plants need sunlight to survive.', hi: 'समझाएं कि पौधों को जीवित रहने के लिए धूप की आवश्यकता क्यों है।', mr: 'वनस्पतींना जगण्यासाठी सूर्यप्रकाशाची गरज का असते हे स्पष्ट करा.' },
        ],
      },
      independent: {
        title: { en: 'Photosynthesis flow chart', hi: 'प्रकाश संश्लेषण का चित्र', mr: 'प्रकाशसंश्लेषण आकृती' },
        instructions: {
          en: 'Draw a leaf. Show sunlight coming in, roots sending water, and oxygen coming out.',
          hi: 'एक पत्ती बनाएं। धूप का आना, जड़ों से पानी आना और ऑक्सीजन का निकलना दिखाएं।',
          mr: 'एका पानाचे चित्र काढा. सूर्यप्रकाश मिळणे, मुळांकडून पाणी येणे आणि ऑक्सिजन बाहेर पडणे बाणांनी दाखवा.',
        },
        minutes: 15,
        mode: 'group',
        materials: [
          { en: 'chart paper', hi: 'चार्ट पेपर', mr: 'चार्ट पेपर' },
          { en: 'crayons', hi: 'मोम के रंग', mr: 'रंगीत खडू' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Explain what happens to a houseplant kept inside a dark cupboard for a week.',
        hi: 'समझाएं कि एक सप्ताह तक अंधेरी अलमारी में रखे पौधे का क्या होगा।',
        mr: 'एका आठवड्यासाठी अंधाऱ्या कपाटात ठेवलेल्या रोपट्याचे काय होईल ते स्पष्ट करा.',
      },
      checklist: [
        { en: 'Identifies sunlight and water as inputs', hi: 'धूप और पानी को आवश्यक घटकों के रूप में पहचानता है', mr: 'सूर्यप्रकाश व पाणी हे आवश्यक घटक म्हणून ओळखतो' },
        { en: 'Knows oxygen is released for animals', hi: 'जानता है कि प्राणियों के लिए ऑक्सीजन निकलती है', mr: 'प्राण्यांसाठी ऑक्सिजन बाहेर टाकला जातो हे सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'What do green leaves need to prepare food?', hi: 'हरी पत्तियों को भोजन बनाने के लिए क्या चाहिए?', mr: 'हिरव्या पानांना अन्न तयार करण्यासाठी कशाची गरज असते?' },
          { en: 'Sunlight, water, carbon dioxide, and chlorophyll', hi: 'धूप, पानी, कार्बन डाइऑक्साइड और क्लोरोफिल', mr: 'सूर्यप्रकाश, पाणी, कार्बन डायऑक्साइड आणि हरितद्रव्य' },
          {
            support: [
              { en: 'Do leaves need sunlight to make food? Yes / No', hi: 'क्या पत्तियों को भोजन बनाने के लिए धूप चाहिए? हाँ / नहीं', mr: 'पानांना अन्न बनवण्यासाठी सूर्यप्रकाश लागतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Write the word equation for photosynthesis.', hi: 'प्रकाश संश्लेषण का समीकरण लिखें।', mr: 'प्रकाशसंश्लेषणाचे शब्दरूप समीकरण लिहा.' },
              { en: 'Sunlight + Water + Carbon dioxide -> Food (Glucose) + Oxygen', hi: 'धूप + पानी + कार्बन डाइऑक्साइड -> भोजन + ऑक्सीजन', mr: 'सूर्यप्रकाश + पाणी + कार्बन डायऑक्साइड -> अन्न (ग्लुकोज) + ऑक्सिजन' },
            ],
          }
        ),
        item(
          { en: 'Which gas do plants release during photosynthesis?', hi: 'पौधे प्रकाश संश्लेषण के दौरान कौन सी गैस छोड़ते हैं?', mr: 'प्रकाशसंश्लेषणादरम्यान वनस्पती कोणता वायू बाहेर सोडतात?' },
          { en: 'Oxygen', hi: 'ऑक्सीजन', mr: 'ऑक्सिजन' },
          {
            support: [
              { en: 'Plants release: oxygen / smoke', hi: 'पौधे छोड़ते हैं: ऑक्सीजन / धुआँ', mr: 'वनस्पती बाहेर सोडतात: ऑक्सिजन / धूर' },
              { en: 'Oxygen', hi: 'ऑक्सीजन', mr: 'ऑक्सिजन' },
            ],
            stretch: [
              { en: 'Why are forests called the green lungs of our planet?', hi: 'जंगलों को हमारी पृथ्वी के हरे फेफड़े क्यों कहा जाता है?', mr: 'जंगलांना आपल्या पृथ्वीची हिरवी फुप्फुसे का म्हटले जाते?' },
              { en: 'They absorb carbon dioxide and produce oxygen', hi: 'वे कार्बन डाइऑक्साइड सोखते हैं और ऑक्सीजन उत्पन्न करते हैं', mr: 'ती कार्बन डायऑक्साइड शोषून घेतात आणि ऑक्सिजन तयार करतात' },
            ],
          }
        ),
        item(
          { en: 'Draw a leaf and show arrows for sunlight, water, and oxygen.', hi: 'एक पत्ती बनाएं और धूप, पानी और ऑक्सीजन के लिए तीर के निशान दिखाएं।', mr: 'पानाचे चित्र काढा आणि सूर्यप्रकाश, पाणी व ऑक्सिजन बाणांनी दाखवा.' },
          { en: 'Diagram of leaf with arrows', hi: 'तीरों के साथ पत्ती का आरेख', mr: 'बाणांसह पानाची आकृती' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Photosynthesis visual process diagram suitable across Grade 3 tiers' }
        ),
      ] }],
    },
    4: {
      outcome: {
        en: 'Describes different methods of seed dispersal (wind, water, animals, explosion).',
        hi: 'बीज प्रकीर्णन की विभिन्न विधियों (हवा, पानी, जानवर, फटना) का वर्णन करता है।',
        mr: 'बियांच्या प्रसाराच्या विविध पद्धतींचे (वारा, पाणी, प्राणी, फळ फुटणे) वर्णन करतो.',
      },
      teacher: {
        title: { en: 'How seeds travel', hi: 'बीज कैसे यात्रा करते हैं', mr: 'बियांचा प्रवास कसा होतो' },
        minutes: 12,
        steps: [
          { en: 'Show dandelion/cotton seed with wings, coconut with fibrous coat, burr sticking to clothes.', hi: 'पंखों वाले कपास के बीज, रेशेदार नारियल और कपड़ों पर चिपकने वाले कांटेदार बीज दिखाएं।', mr: 'कापसाच्या बिया, नारळाचे तंतुमय आवरण आणि कपड्यांना चिकटणारे गोखरू दाखवा.' },
          { en: 'Why do seeds need to travel away from the parent tree? Space, light, nutrients.', hi: 'बीजों को मूल पेड़ से दूर क्यों जाना पड़ता है? जगह, रोशनी, पोषण।', mr: 'बिया मूळ झाडापासून दूर का जाव्या लागतात? जागा, प्रकाश व पोषणासाठी.' },
          { en: 'Role of birds and monkeys eating fruit.', hi: 'फल खाने वाले पक्षियों और बंदरों की भूमिका समझाएं।', mr: 'फळे खाणाऱ्या पक्ष्यांची आणि प्राण्यांची भूमिका सांगा.' },
        ],
      },
      independent: {
        title: { en: 'Seed travel diary', hi: 'बीजों की यात्रा डायरी', mr: 'बियांची प्रवास नोंद' },
        instructions: {
          en: 'Match four seeds to their method of travel: wind, water, animals, explosive burst.',
          hi: 'चार बीजों को उनकी यात्रा विधि से मिलाएं: हवा, पानी, जानवर, फटना।',
          mr: 'चार बिया त्यांच्या प्रसार पद्धतीशी जोडा: वारा, पाणी, प्राणी, फळ फुटणे.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'worksheet', hi: 'कार्यपत्रक', mr: 'कार्यपत्रिका' }, { en: 'pencils', hi: 'पेंसिल', mr: 'पेन्सिल' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Draw a seed with wings (like maple or drumstick) and explain how wind carries it.',
        hi: 'पंखों वाले बीज (जैसे सहजन) का चित्र बनाएं और समझाएं कि हवा इसे कैसे ले जाती है।',
        mr: 'पंखासारखे आवरण असलेल्या बीचे (उदा. शेवगा) चित्र काढा आणि वारा त्याला कसा वाहून नेतो ते सांगा.',
      },
      checklist: [
        { en: 'Explains why overcrowding under parent tree is harmful', hi: 'समझाता है कि मूल पेड़ के नीचे भीड़ होना हानिकारक क्यों है', mr: 'मूळ झाडाखाली गर्दी झाल्याने नुकसान का होते हे स्पष्ट करतो' },
        { en: 'Identifies hooked seeds clinging to animal fur', hi: 'जानवरों के बालों से चिपकने वाले कांटेदार बीजों की पहचान करता है', mr: 'प्राण्यांच्या अंगाला चिकटणाऱ्या काटेरी बिया ओळखतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'How do coconut seeds travel to new places?', hi: 'नारियल के बीज नई जगहों पर कैसे पहुँचते हैं?', mr: 'नारळाच्या बिया नव्या ठिकाणी कशा पोहोचतात?' },
          { en: 'By floating on water', hi: 'पानी पर तैरकर', mr: 'पाण्यावर तरंगून' },
          {
            support: [
              { en: 'Do coconuts float on water? Yes / No', hi: 'क्या नारियल पानी पर तैरता है? हाँ / नहीं', mr: 'नारळ पाण्यावर तरंगतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What structure helps coconuts float long distances across rivers and oceans?', hi: 'कौन सी संरचना नारियल को नदियों और समुद्रों में तैरने में मदद करती है?', mr: 'नारळाला नदी किंवा समुद्रात दूरवर तरंगण्यासाठी कोणती रचना मदत करते?' },
              { en: 'Fibrous waterproof husk filled with air', hi: 'हवा से भरी रेशेदार जलरोधी भूसी', mr: 'हवेने भरलेले तंतुमय व जलरोधक आवरण' },
            ],
          }
        ),
        item(
          { en: 'Why must seeds disperse away from the mother tree?', hi: 'बीजों को मातृ वृक्ष से दूर क्यों फैलना चाहिए?', mr: 'बिया मूळ झाडापासून दूर का पसरल्या पाहिजेत?' },
          { en: 'To get enough sunlight, water and space to grow without crowding', hi: 'भीड़ के बिना बढ़ने के लिए पर्याप्त धूप, पानी और जगह पाने हेतु', mr: 'पुरेसा सूर्यप्रकाश, पाणी आणि जागा मिळून चांगली वाढ व्हावी म्हणून' },
          {
            support: [
              { en: 'Do young plants need sunlight and space? Yes / No', hi: 'क्या नए पौधों को धूप और जगह चाहिए? हाँ / नहीं', mr: 'नवीन रोपांना सूर्यप्रकाश आणि जागा लागते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What happens if all 100 seeds fall right beneath the mother banyan tree?', hi: 'यदि सभी 100 बीज बरगद के पेड़ के ठीक नीचे गिर जाएं तो क्या होगा?', mr: 'वडाच्या झाडाखालीच सर्व १०० बिया पडल्या तर काय होईल?' },
              { en: 'They compete for sunlight and soil; most will wither and die', hi: 'वे धूप और मिट्टी के लिए संघर्ष करेंगे; अधिकांश सूखकर मर जाएंगे', mr: 'त्यांना सूर्यप्रकाश व जागा मिळणार नाही; बहुतांश रोपे सुकतील' },
            ],
          }
        ),
        item(
          { en: 'Name one seed that sticks to animal fur or human clothes.', hi: 'जानवरों के बालों या कपड़ों से चिपकने वाले एक बीज का नाम बताएं।', mr: 'प्राण्यांच्या अंगाला किंवा माणसांच्या कपड्यांना चिकटणाऱ्या एका बीचे नाव सांगा.' },
          { en: 'Gokhru, burdock, spear grass', hi: 'गोखरू, भुसंडी', mr: 'गोखरू, भुसंडी' },
          {
            support: [
              { en: 'Can seeds stick to sheep wool? Yes / No', hi: 'क्या बीज भेड़ के ऊन से चिपक सकते हैं? हाँ / नहीं', mr: 'मेंढ्यांच्या लोकरीला बिया चिकटू शकतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What special features allow these seeds to attach to fur?', hi: 'कौन सी विशेषताएं इन बीजों को बालों से चिपकने में मदद करती हैं?', mr: 'या बियांना प्राण्यांच्या अंगाला चिकटण्यासाठी कोणते विशेष गुणधर्म असतात?' },
              { en: 'Hooks, spines, or sticky hairs', hi: 'हुक, कांटे या चिपचिपे रोएं', mr: 'काटे, हुक किंवा चिकट लव' },
            ],
          }
        ),
      ] }],
    },
    5: {
      outcome: {
        en: 'Draws a forest/farm food chain; understands producers, consumers, and decomposers.',
        hi: 'जंगल या खेत की खाद्य श्रृंखला बनाता है; उत्पादक, उपभोक्ता और अपघटक को समझता है।',
        mr: 'जंगल किंवा शेतातील अन्नसाखळी काढतो; उत्पादक, भक्षक आणि विघटक समजून घेतो.',
      },
      teacher: {
        title: { en: 'Web of life', hi: 'जीवन का जाल (खाद्य श्रृंखला)', mr: 'अन्नसाखळी आणि जीवनजाल' },
        minutes: 12,
        steps: [
          { en: 'Grass -> Grasshopper -> Frog -> Snake -> Eagle.', hi: 'घास -> टिड्डा -> मेंढक -> सांप -> चील।', mr: 'गवत -> नाकतोडा -> बेडूक -> साप -> गरुड.' },
          { en: 'Plants are producers because they make food.', hi: 'पौधे उत्पादक हैं क्योंकि वे अपना भोजन खुद बनाते हैं।', mr: 'वनस्पती स्वतःचे अन्न स्वतः तयार करतात म्हणून त्यांना उत्पादक म्हणतात.' },
          { en: 'Animals are consumers. Earthworms and fungi are decomposers.', hi: 'जानवर उपभोक्ता हैं। केंचुए और कवक अपघटक हैं।', mr: 'प्राणी भक्षक आहेत. गांडूळ आणि बुरशी हे विघटक आहेत.' },
        ],
      },
      independent: {
        title: { en: 'Village food chains', hi: 'गाँव की खाद्य श्रृंखला', mr: 'गावातील अन्नसाखळी' },
        instructions: {
          en: 'Draw two food chains: one from a crop field and one from a pond.',
          hi: 'दो खाद्य श्रृंखलाएं बनाएं: एक खेत की और एक तालाब की।',
          mr: 'दोन अन्नसाखळ्या काढा: एक शेतातील आणि एक तळ्यातील.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'What happens to a farmer field if all owls and snakes are killed? (Rodent outbreak).',
        hi: 'यदि खेत के सभी उल्लू और सांप मार दिए जाएं तो क्या होगा? (चूहों की संख्या बढ़ जाएगी)।',
        mr: 'शेतातील सर्व घुबडे आणि साप नष्ट झाले तर शेताचे काय होईल? (उंदरांची संख्या खूप वाढेल).',
      },
      checklist: [
        { en: 'Begins food chain with green plant producer', hi: 'खाद्य श्रृंखला की शुरुआत हरे पौधे (उत्पादक) से करता है', mr: 'अन्नसाखळीची सुरुवात हिरव्या वनस्पतीपासून करतो' },
        { en: 'Uses arrows pointing in direction of energy flow', hi: 'ऊर्जा प्रवाह की दिशा दर्शाने के लिए तीर का उपयोग करता है', mr: 'ऊर्जेचा प्रवाह दाखवण्यासाठी बाणांचा योग्य वापर करतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Why are green plants called producers in a food chain?', hi: 'खाद्य श्रृंखला में हरे पौधों को उत्पादक क्यों कहा जाता है?', mr: 'अन्नसाखळीत हिरव्या वनस्पतींना उत्पादक का म्हणतात?' },
          { en: 'Because they produce their own food using sunlight', hi: 'क्योंकि वे धूप का उपयोग करके अपना भोजन स्वयं बनाते हैं', mr: 'कारण त्या सूर्यप्रकाशाच्या साहाय्याने स्वतःचे अन्न स्वतः तयार करतात' },
          {
            support: [
              { en: 'Can plants make their own food? Yes / No', hi: 'क्या पौधे अपना भोजन खुद बना सकते हैं? हाँ / नहीं', mr: 'वनस्पती स्वतःचे अन्न स्वतः बनवू शकतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What would happen to herbivores if all green producers died?', hi: 'यदि सभी हरे उत्पादक नष्ट हो जाएं तो शाकाहारियों का क्या होगा?', mr: 'सर्व हिरव्या वनस्पती नष्ट झाल्या तर शाकाहारी प्राण्यांचे काय होईल?' },
              { en: 'Herbivores would starve, causing carnivores to starve as well', hi: 'शाकाहारी भूख से मर जाएंगे, जिससे मांसाहारी भी भूखे मरेंगे', mr: 'शाकाहारी प्राणी अन्नाविना मरतील आणि पर्यायाने मांसाहारी प्राणीही नष्ट होतील' },
            ],
          }
        ),
        item(
          { en: 'Put in order to make a food chain: Snake, Grass, Eagle, Grasshopper, Frog.', hi: 'खाद्य श्रृंखला बनाने के लिए क्रम से लगाएं: सांप, घास, चील, टिड्डा, मेंढक।', mr: 'अन्नसाखळी तयार करण्यासाठी योग्य क्रमाने लावा: साप, गवत, गरुड, नाकतोडा, बेडूक.' },
          { en: 'Grass -> Grasshopper -> Frog -> Snake -> Eagle', hi: 'घास -> टिड्डा -> मेंढक -> सांप -> चील', mr: 'गवत -> नाकतोडा -> बेडूक -> साप -> गरुड' },
          {
            support: [
              { en: 'Does grass come first in the food chain? Yes / No', hi: 'क्या खाद्य श्रृंखला में घास सबसे पहले आती है? हाँ / नहीं', mr: 'अन्नसाखळीत गवत सर्वात आधी येते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Which animal in this chain is the tertiary consumer (apex predator)?', hi: 'इस श्रृंखला में सर्वोच्च शिकारी (शीर्ष उपभोक्ता) कौन सा जानवर है?', mr: 'या साखळीतील सर्वोच्च भक्षक (शीर्षस्थ शिकारी) कोणता प्राणी आहे?' },
              { en: 'Eagle', hi: 'चील (गरुड़)', mr: 'गरुड' },
            ],
          }
        ),
        item(
          { en: 'What role do decomposers like earthworms play in soil?', hi: 'मिट्टी में केंचुए जैसे अपघटक क्या भूमिका निभाते हैं?', mr: 'मातीमध्ये गांडुळासारखे विघटक कोणती भूमिका बजावतात?' },
          { en: 'They break down dead plants and recycle nutrients back into soil', hi: 'वे मृत पौधों को सड़ाकर पोषक तत्वों को मिट्टी में वापस मिलाते हैं', mr: 'ते मृत वनस्पती कुजवून पोषक द्रव्ये पुन्हा मातीत मिसळतात' },
          {
            support: [
              { en: 'Are earthworms good for soil? Yes / No', hi: 'क्या केंचुए मिट्टी के लिए अच्छे होते हैं? हाँ / नहीं', mr: 'गांडूळ मातीसाठी उपयुक्त असतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Explain why farmers call earthworms their best friends.', hi: 'समझाएं कि किसान केंचुओं को अपना सबसे अच्छा दोस्त क्यों कहते हैं।', mr: 'शेतकरी गांडुळाला आपला मित्र का मानतात ते स्पष्ट करा.' },
              { en: 'They aerate the soil and convert organic waste into rich humus', hi: 'वे मिट्टी को हवादार बनाते हैं और कचरे को खाद में बदलते हैं', mr: 'ते माती भुसभुशीत करतात आणि सेंद्रिय कचऱ्याचे उत्तम खतात रूपांतर करतात' },
            ],
          }
        ),
      ] }],
    },
  },
};

const time: Topic = {
  id: 'math-time',
  subject: 'math',
  title: { en: 'Time & Calendar (Maths)', hi: 'समय और कैलेंडर (गणित)', mr: 'वेळ आणि दिनदर्शिका (गणित)' },
  theme: { en: 'The village fair is next week', hi: 'गाँव का मेला अगले सप्ताह है', mr: 'गावाची जत्रा पुढच्या आठवड्यात आहे' },
  hook: {
    en: 'Look at the calendar on the wall. Ask: "What day is today? What time is it? How long until recess?"',
    hi: 'दीवार पर लगे कैलेंडर को देखें। पूछें: "आज कौन सा दिन है? कितना समय हुआ है? मध्यांतर (लंच) में कितनी देर है?"',
    mr: 'भिंतीवरील दिनदर्शिका पाहा. विचारा: "आज कोणता वार आहे? किती वाजले आहेत? मधल्या सुट्टीला किती वेळ बाकी आहे?"',
  },
  mapping: 'Draft: Measurement of time strand, NCERT Maths Classes 1-5 (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Names the days of the week in order and sequences daily events (morning, afternoon, evening, night).',
        hi: 'सप्ताह के दिनों के नाम क्रम से बताता है और दैनिक घटनाओं (सुबह, दोपहर, शाम, रात) को क्रमबद्ध करता है।',
        mr: 'आठवड्याचे वार क्रमाने सांगतो आणि दैनंदिन घटनांचा (सकाळ, दुपार, संध्याकाळ, रात्र) क्रम लावतो.',
      },
      teacher: {
        title: { en: 'Days of the week train', hi: 'सप्ताह के दिनों की रेलगाड़ी', mr: 'आठवड्याच्या वारांची गाडी' },
        minutes: 8,
        steps: [
          { en: 'Sing the 7 days rhyme: Monday, Tuesday, Wednesday...', hi: '7 दिनों का गीत गाएं: सोमवार, मंगलवार, बुधवार...', mr: 'आठवड्याच्या ७ वारांचे गाणे म्हणा: सोमवार, मंगळवार, बुधवार...' },
          { en: 'Ask: which day is school holiday? (Sunday)', hi: 'पूछें: स्कूल की छुट्टी किस दिन होती है? (रविवार)', mr: 'विचारा: शाळेला कोणत्या दिवशी सुट्टी असते? (रविवार)' },
          { en: 'Sort pictures: waking up (morning), eating lunch (afternoon), sleeping (night).', hi: 'चित्रों को क्रम में लगाएं: जागना (सुबह), खाना (दोपहर), सोना (रात)।', mr: 'चित्रांचा क्रम लावा: झोपेतून उठणे (सकाळ), जेवणे (दुपार), झोपणे (रात्र).' },
        ],
      },
      independent: {
        title: { en: 'Daily timeline', hi: 'दिनचर्या का समय चक्र', mr: 'माझा दिनक्रम' },
        instructions: {
          en: 'Draw your day: one activity in morning, one in afternoon, one at night.',
          hi: 'अपने दिन का चित्र बनाएं: एक काम सुबह का, एक दोपहर का, एक रात का।',
          mr: 'आपल्या दिवसाचे चित्र काढा: एक काम सकाळचे, एक दुपारचे, एक रात्रीचे.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'worksheet', hi: 'कार्यपत्रक', mr: 'कार्यपत्रिका' },
          { en: 'crayons', hi: 'मोम के रंग', mr: 'रंगीत खडू' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Recite all 7 days backwards starting from Sunday.',
        hi: 'रविवार से शुरू करके सभी 7 दिनों के नाम उल्टे क्रम में बोलें।',
        mr: 'रविवारपासून उलटा क्रम सुरू करून सर्व ७ वार सांगा.',
      },
      checklist: [
        { en: 'Knows there are 7 days in a week', hi: 'जानता है कि एक सप्ताह में 7 दिन होते हैं', mr: 'आठवड्यात ७ वार असतात हे माहीत आहे' },
        { en: 'Names Sunday as holiday', hi: 'रविवार को छुट्टी का दिन बताता है', mr: 'रविवार हा सुट्टीचा दिवस सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'How many days are there in a week?', hi: 'एक सप्ताह में कितने दिन होते हैं?', mr: 'एका आठवड्यात किती दिवस असतात?' },
          { en: '7', hi: '7', mr: '७' },
          {
            support: [
              { en: 'A week has: 7 / 10 days', hi: 'एक सप्ताह में होते हैं: 7 / 10 दिन', mr: 'आठवड्यात असतात: ७ / १० दिवस' },
              { en: '7', hi: '7', mr: '७' },
            ],
            stretch: [
              { en: 'If today is Tuesday, what day was yesterday and what day is tomorrow?', hi: 'यदि आज मंगलवार है, तो कल कौन सा दिन था और आने वाला कल कौन सा दिन होगा?', mr: 'जर आज मंगळवार असेल, तर काल कोणता वार होता आणि उद्या कोणता वार असेल?' },
              { en: 'Yesterday was Monday; tomorrow is Wednesday', hi: 'कल सोमवार था; आने वाला कल बुधवार होगा', mr: 'काल सोमवार होता; उद्या बुधवार असेल' },
            ],
          }
        ),
        item(
          { en: 'Which day comes after Friday?', hi: 'शुक्रवार के बाद कौन सा दिन आता है?', mr: 'शुक्रवारनंतर कोणता वार येतो?' },
          { en: 'Saturday', hi: 'शनिवार', mr: 'शनिवार' },
          {
            support: [
              { en: 'Does Saturday come after Friday? Yes / No', hi: 'क्या शुक्रवार के बाद शनिवार आता है? हाँ / नहीं', mr: 'शुक्रवारनंतर शनिवार येतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name the two weekend days.', hi: 'सप्ताहांत के दो दिनों के नाम बताएं।', mr: 'आठवड्याच्या शेवटी येणाऱ्या दोन दिवसांची नावे सांगा.' },
              { en: 'Saturday and Sunday', hi: 'शनिवार और रविवार', mr: 'शनिवार आणि रविवार' },
            ],
          }
        ),
        item(
          { en: 'Do you eat breakfast in the morning or night?', hi: 'आप नाश्ता सुबह करते हैं या रात में?', mr: 'तुम्ही न्याहारी (नाश्ता) सकाळी करता की रात्री?' },
          { en: 'Morning', hi: 'सुबह', mr: 'सकाळी' },
          {
            support: [
              { en: 'Breakfast is in: morning / night', hi: 'नाश्ता होता है: सुबह / रात', mr: 'नाश्ता असतो: सकाळी / रात्री' },
              { en: 'Morning', hi: 'सुबह', mr: 'सकाळी' },
            ],
            stretch: [
              { en: 'Name two activities you do only at night.', hi: 'दो ऐसे काम बताएं जो आप केवल रात में करते हैं।', mr: 'फक्त रात्री करता अशा दोन गोष्टींची नावे सांगा.' },
              { en: 'Sleeping, looking at stars/moon', hi: 'सोना, तारे और चाँद देखना', mr: 'झोपणे, तारे व चंद्र पाहणे' },
            ],
          }
        ),
      ] }],
    },
    2: {
      outcome: {
        en: 'Reads time on a clock to the whole hour and half hour.',
        hi: 'घड़ी में पूरे घंटे और आधे घंटे (साढ़े) का समय पढ़ता है।',
        mr: 'घड्याळात पूर्ण तास आणि अर्धा तास (साडे) वेळ ओळखतो.',
      },
      teacher: {
        title: { en: 'Clock hands', hi: 'घड़ी की सुइयाँ', mr: 'घड्याळाचे काटे' },
        minutes: 10,
        steps: [
          { en: 'Show a model clock. The short hand is the hour hand, long hand is minute hand.', hi: 'मॉडल घड़ी दिखाएं। छोटी सुई घंटे की है, बड़ी सुई मिनट की है।', mr: 'घड्याळाची प्रतिकृती दाखवा. लहान काटा तासाचा, मोठा काटा मिनिटाचा.' },
          { en: 'When the long hand points to 12, it is o\'clock.', hi: 'जब बड़ी सुई 12 पर हो, तो पूरा घंटा होता है।', mr: 'मोठा काटा १२ वर असतो तेव्हा पूर्ण तास होतो.' },
          { en: 'When the long hand points to 6, it is half past.', hi: 'जब बड़ी सुई 6 पर हो, तो आधा घंटा (साढ़े) होता है।', mr: 'मोठा काटा ६ वर असतो तेव्हा अर्धा तास (साडे) होतो.' },
        ],
      },
      independent: {
        title: { en: 'Draw clock hands', hi: 'घड़ी की सुइयाँ बनाएं', mr: 'घड्याळाचे काटे काढा' },
        instructions: {
          en: 'Draw hands for 3:00, 6:00, 9:30 and 12:00.',
          hi: '3:00, 6:00, 9:30 और 12:00 के लिए सुइयाँ बनाएं।',
          mr: '३:००, ६:००, ९:३० आणि १२:०० साठी काटे काढा.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [{ en: 'clock worksheet', hi: 'घड़ी कार्यपत्रक', mr: 'घड्याळ कार्यपत्रिका' }, { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Draw a clock showing the time school starts in the morning.',
        hi: 'सुबह स्कूल शुरू होने का समय दर्शाती घड़ी बनाएं।',
        mr: 'सकाळी शाळा सुरू होण्याची वेळ दाखवणारे घड्याळ काढा.',
      },
      checklist: [
        { en: 'Distinguishes short hour hand from long minute hand', hi: 'छोटी घंटे की सुई और बड़ी मिनट की सुई में अंतर करता है', mr: 'लहान तास काटा आणि मोठा मिनिट काटा यातील फरक ओळखतो' },
        { en: 'Identifies 30 minutes at numeral 6', hi: 'अंक 6 पर 30 मिनट पहचानता है', mr: '६ अंकावर ३० मिनिटे होतात हे ओळखतो' },
      ],
      questions: [gen('timeRead', 4)],
    },
    3: {
      outcome: {
        en: 'Reads time to 5 minutes, uses AM and PM, and calculates elapsed time in hours and minutes.',
        hi: '5 मिनट के अंतराल में समय पढ़ता है, पूर्वाह्न (AM) और अपराह्न (PM) का उपयोग करता है तथा बीता हुआ समय निकालता है।',
        mr: '५ मिनिटांच्या फरकाने वेळ वाचतो, AM आणि PM वापरतो आणि लागलेला कालावधी काढतो.',
      },
      teacher: {
        title: { en: 'Minutes around the clock', hi: 'घड़ी में मिनटों की गिनती', mr: 'घड्याळातील मिनिटे' },
        minutes: 12,
        steps: [
          { en: 'Count by 5s around the clock: 5, 10, 15, 20... 60.', hi: 'घड़ी में 5-5 करके गिनें: 5, 10, 15, 20... 60।', mr: 'घड्याळात ५-५ च्या पटीत मोजा: ५, १०, १५, २०... ६०.' },
          { en: 'Explain AM (morning) and PM (afternoon/evening).', hi: 'सुबह (AM) और दोपहर/शाम (PM) का अंतर समझाएं।', mr: 'सकाळ (AM) आणि दुपार/संध्याकाळ (PM) यातील फरक सांगा.' },
          { en: 'Practice elapsed time: if prayer starts at 9:15 and lasts 20 min, when does it end?', hi: 'बीते समय का अभ्यास: यदि प्रार्थना 9:15 पर शुरू होकर 20 मिनट चले, तो कब समाप्त होगी?', mr: 'वेळेचा सराव: परिपाठ ९:१५ ला सुरू होऊन २० मिनिटे चालल्यास कधी संपेल?' },
        ],
      },
      independent: {
        title: { en: 'School schedule math', hi: 'स्कूल समय सारणी का गणित', mr: 'शालेय वेळापत्रकाचे गणित' },
        instructions: {
          en: 'Calculate start times and durations for recess and library periods.',
          hi: 'मध्यांतर और पुस्तकालय के समय और अवधि की गणना करें।',
          mr: 'मधली सुट्टी आणि वाचनालयाच्या तासांची वेळ व कालावधी काढा.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'How many minutes are in 2 hours and 15 minutes? (135 min).',
        hi: '2 घंटे और 15 मिनट में कितने मिनट होते हैं? (135 मिनट)।',
        mr: '२ तास १५ मिनिटांत किती मिनिटे होतात? (१३५ मिनिटे).',
      },
      checklist: [
        { en: 'Multiplies clock numbers by 5 to find minutes', hi: 'मिनट जानने के लिए घड़ी के अंकों को 5 से गुणा करता है', mr: 'मिनिटे काढण्यासाठी घड्याळाच्या अंकास ५ ने गुणतो' },
        { en: 'Adds elapsed minutes across the hour boundary', hi: 'घंटे की सीमा पार करके बीते मिनटों को जोड़ता है', mr: 'तासाची मर्यादा ओलांडून मिनिटांची अचूक बेरीज करतो' },
      ],
      questions: [gen('timeRead', 2), gen('timeElapsed', 2)],
    },
    4: {
      outcome: {
        en: 'Converts between 12-hour and 24-hour railway clock; calculates duration across hours.',
        hi: '12-घंटे और 24-घंटे (रेलवे समय) में रूपांतरण करता है; घंटों की अवधि की गणना करता है।',
        mr: '१२-ताशी आणि २४-ताशी (रेल्वे वेळ) घड्याळात रूपांतर करतो; कालावधीची गणना करतो.',
      },
      teacher: {
        title: { en: 'Railway timetables', hi: 'रेलवे समय सारणी', mr: 'रेल्वे वेळापत्रक' },
        minutes: 12,
        steps: [
          { en: 'Show a bus or train ticket with 15:30 or 20:45.', hi: '15:30 या 20:45 वाला बस या रेल टिकट दिखाएं।', mr: '१५:३० किंवा २०:४५ वेळ असलेले बस किंवा रेल्वे तिकीट दाखवा.' },
          { en: 'Explain: after 12 noon, add 12 to PM hours (3 PM = 15:00).', hi: 'समझाएं: दोपहर 12 के बाद PM घंटों में 12 जोड़ें (3 PM = 15:00)।', mr: 'सांगा: दुपारी १२ नंतर PM तासांमध्ये १२ मिळवा (३ PM = १५:००).' },
          { en: 'Convert times back and forth with children.', hi: 'बच्चों के साथ दोनों प्रारूपों में समय बदलने का अभ्यास करें।', mr: 'मुलांसोबत दोन्ही पद्धतींत वेळ बदलण्याचा सराव करा.' },
        ],
      },
      independent: {
        title: { en: 'Village bus timetable', hi: 'गाँव की बस समय सारणी', mr: 'गावचे बस वेळापत्रक' },
        instructions: {
          en: 'Convert bus departure times between 12-hour and 24-hour formats.',
          hi: 'बस छूटने के समय को 12-घंटे और 24-घंटे के प्रारूप में बदलें।',
          mr: 'बस सुटण्याच्या वेळा १२-ताशी आणि २४-ताशी पद्धतीत बदला.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'A train departs Pune at 07:45 and arrives in Solapur at 13:15. What is the journey time?',
        hi: 'एक ट्रेन पुणे से 07:45 पर छूटती है और सोलापुर 13:15 पर पहुँचती है। यात्रा का समय क्या है?',
        mr: 'एक गाडी पुण्यातून ०७:४५ वाजता सुटते आणि सोलापूरला १३:१५ वाजता पोहोचते. प्रवासाचा वेळ किती?',
      },
      checklist: [
        { en: 'Converts 24-hour times by subtracting 12', hi: '12 घटाकर 24-घंटे के समय को बदलता है', mr: '१२ वजा करून २४-ताशी वेळेचे रूपांतर करतो' },
        { en: 'Calculates multi-hour journey durations without error', hi: 'कई घंटों की यात्रा अवधि की सही गणना करता है', mr: 'प्रवासाच्या कालावधीची बिनचूक गणना करतो' },
      ],
      questions: [gen('timeElapsed', 3), { type: 'static', items: [
        item(
          { en: 'Convert 4:30 PM to 24-hour railway time.', hi: '4:30 PM को 24-घंटे के रेलवे समय में बदलें।', mr: '४:३० PM चे २४-ताशी रेल्वे वेळेत रूपांतर करा.' },
          { en: '16:30', hi: '16:30', mr: '१६:३०' },
          {
            support: [
              { en: 'Is 4:30 PM equal to 16:30? Yes / No', hi: 'क्या 4:30 PM का मतलब 16:30 है? हाँ / नहीं', mr: '४:३० PM म्हणजे १६:३० का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Convert 22:15 railway time to 12-hour AM/PM time.', hi: 'रेलवे समय 22:15 को 12-घंटे (AM/PM) समय में बदलें।', mr: '२२:१५ या रेल्वे वेळेचे १२-ताशी (AM/PM) वेळेत रूपांतर करा.' },
              { en: '10:15 PM', hi: '10:15 PM', mr: '१०:१५ PM' },
            ],
          }
        ),
        item(
          { en: 'A cricket match started at 10:15 AM and ended at 2:45 PM. How long did it last?', hi: 'एक क्रिकेट मैच 10:15 AM पर शुरू हुआ और 2:45 PM पर समाप्त हुआ। यह कितने समय चला?', mr: 'क्रिकेटचा सामना १०:१५ AM वाजता सुरू झाला आणि २:४५ PM वाजता संपला. सामना किती वेळ चालला?' },
          { en: '4 hours and 30 minutes', hi: '4 घंटे 30 मिनट', mr: '४ तास ३० मिनिटे' },
          {
            support: [
              { en: 'From 10:00 to 2:00 is how many hours?', hi: '10:00 से 2:00 तक कितने घंटे होते हैं?', mr: '१०:०० ते २:०० पर्यंत किती तास होतात?' },
              { en: '4 hours', hi: '4 घंटे', mr: '४ तास' },
            ],
            stretch: [
              { en: 'If there was a 30-minute lunch break, what was the actual playing time?', hi: 'यदि 30 मिनट का लंच ब्रेक था, तो खेल का वास्तविक समय क्या था?', mr: 'जर ३० मिनिटांची भोजनाची सुट्टी असेल, तर प्रत्यक्ष खेळाचा वेळ किती होता?' },
              { en: '4 hours', hi: '4 घंटे', mr: '४ तास' },
            ],
          }
        ),
      ] }],
    },
    5: {
      outcome: {
        en: 'Solves complex timetable problems, calculates leap years, and manages project schedules.',
        hi: 'समय सारणी की जटिल समस्याएं हल करता है, लीप वर्ष की गणना करता है।',
        mr: 'वेळापत्रकाची गुंतागुंतीची उदाहरणे सोडवतो, लीप वर्ष ओळखतो.',
      },
      teacher: {
        title: { en: 'Fair organization schedule', hi: 'मेले के आयोजन की समय सारणी', mr: 'जत्रेच्या नियोजनाचे वेळापत्रक' },
        minutes: 12,
        steps: [
          { en: 'Examine a calendar: find leap years (divisible by 4).', hi: 'कैलेंडर देखें: लीप वर्ष खोजें (जो 4 से विभाज्य हों)।', mr: 'कॅलेंडर तपासा: लीप वर्ष शोधा (ज्या वर्षाला ४ ने भाग जातो).' },
          { en: 'Calculate total days in months: Jan (31), Feb (28/29)...', hi: 'महीनों के कुल दिन गिनें: जन (31), फर (28/29)...', mr: 'महिन्यांचे एकूण दिवस मोजा: जाने (३१), फेब्रु (२८/२९)...' },
          { en: 'Plan a 3-day school festival schedule with overlapping events.', hi: '3-दिवसीय स्कूल उत्सव की समय सारणी तैयार करें।', mr: '३ दिवसांच्या शालेय संमेलनाचे वेळापत्रक तयार करा.' },
        ],
      },
      independent: {
        title: { en: 'Festival master schedule', hi: 'उत्सव की मुख्य समय सारणी', mr: 'संमेलन मुख्य वेळापत्रक' },
        instructions: {
          en: 'Solve word problems on days, hours, minutes and seconds. Check calculations.',
          hi: 'दिन, घंटे, मिनट और सेकंड पर आधारित इबारती प्रश्न हल करें।',
          mr: 'दिवस, तास, मिनिटे आणि सेकंद यांवरील शाब्दिक उदाहरणे सोडवा.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'How many seconds are in 1 hour? (3600 seconds). How many in 24 hours?',
        hi: '1 घंटे में कितने सेकंड होते हैं? (3600 सेकंड)। 24 घंटे में कितने?',
        mr: '१ तासात किती सेकंद असतात? (३६०० सेकंद). २४ तासांत किती?',
      },
      checklist: [
        { en: 'Identifies February has 29 days in leap years', hi: 'पहचानता है कि लीप वर्ष में फरवरी में 29 दिन होते हैं', mr: 'लीप वर्षात फेब्रुवारीत २९ दिवस असतात हे सांगतो' },
        { en: 'Converts between days, hours, and minutes cleanly', hi: 'दिन, घंटे और मिनटों में सही रूपांतरण करता है', mr: 'दिवस, तास आणि मिनिटे यात अचूक रूपांतर करतो' },
      ],
      questions: [gen('timeElapsed', 3), { type: 'static', items: [
        item(
          { en: 'How many days are in a leap year?', hi: 'एक लीप वर्ष में कितने दिन होते हैं?', mr: 'एका लीप वर्षात किती दिवस असतात?' },
          { en: '366 days', hi: '366 दिन', mr: '३६६ दिवस' },
          {
            support: [
              { en: 'Does a leap year have 365 or 366 days?', hi: 'लीप वर्ष में 365 दिन होते हैं या 366?', mr: 'लीप वर्षात ३६५ दिवस असतात की ३६६?' },
              { en: '366 days', hi: '366 दिन', mr: '३६६ दिवस' },
            ],
            stretch: [
              { en: 'Why do we add an extra day every 4 years in our calendar?', hi: 'हम अपने कैलेंडर में हर 4 साल में एक अतिरिक्त दिन क्यों जोड़ते हैं?', mr: 'आपल्या कॅलेंडरमध्ये दर ४ वर्षांनी एक वाढीव दिवस का जोडला जातो?' },
              { en: 'Earth takes ~365.25 days to orbit Sun; 4 quarter days make 1 whole day', hi: 'पृथ्वी सूर्य की परिक्रमा में ~365.25 दिन लेती है; 4 चौथाई दिन मिलकर 1 पूरा दिन बनते हैं', mr: 'पृथ्वीला सूर्याभोवती फिरण्यासाठी ~३६५.२५ दिवस लागतात; ४ पाव दिवस मिळून १ पूर्ण दिवस होतो' },
            ],
          }
        ),
        item(
          { en: 'A farmer works in the field from 7:30 AM to 12:15 PM, rests, then works from 3:00 PM to 6:30 PM. How many total hours did he work?', hi: 'एक किसान खेत में 7:30 AM से 12:15 PM तक काम करता है, फिर 3:00 PM से 6:30 PM तक काम करता है। उसने कुल कितने घंटे काम किया?', mr: 'एक शेतकरी सकाळी ७:३० ते १२:१५ शेतात काम करतो, विश्रांती घेतो आणि पुन्हा ३:०० ते ६:३० काम करतो. त्याने एकूण किती वेळ काम केले?' },
          { en: '8 hours and 15 minutes', hi: '8 घंटे 15 मिनट', mr: '८ तास १५ मिनिटे' },
          {
            support: [
              { en: 'From 7:30 to 12:00 is 4 hours 30 min. Add 15 min.', hi: '7:30 से 12:00 तक 4 घंटे 30 मिनट हैं। 15 मिनट और जोड़ें।', mr: '७:३० ते १२:०० म्हणजे ४ तास ३० मिनिटे. त्यात १५ मिनिटे मिळवा.' },
              { en: '4 hours 45 min', hi: '4 घंटे 45 मिनट', mr: '४ तास ४५ मिनिटे' },
            ],
            stretch: [
              { en: 'If he earns ₹75 per hour, calculate his daily wage for 8 hours.', hi: 'यदि उसे ₹75 प्रति घंटा मिलता है, तो 8 घंटे की मजदूरी कितनी होगी?', mr: 'त्याला प्रति तास ₹७५ मजुरी मिळत असल्यास, ८ तासांची मजुरी किती होईल?' },
              { en: '₹600', hi: '₹600', mr: '₹६००' },
            ],
          }
        ),
      ] }],
    },
  },
};

const neighbourhood: Topic = {
  id: 'evs-neighbourhood',
  subject: 'evs',
  title: { en: 'Our Neighbourhood (EVS)', hi: 'हमारा पड़ोस (पर्यावरण अध्ययन)', mr: 'आमचा परिसर (परिसर अभ्यास)' },
  theme: { en: 'A map of our village', hi: 'हमारे गाँव का नक्शा', mr: 'आमच्या गावाचा नकाशा' },
  hook: {
    en: 'Ask: "If someone new comes to our village, how would you explain where things are?" Each grade maps the area differently.',
    hi: 'पूछें: "यदि हमारे गाँव में कोई नया व्यक्ति आए, तो आप उसे रास्ता कैसे समझाएंगे?" प्रत्येक कक्षा क्षेत्र का अलग-अलग नक्शा बनाएगी।',
    mr: 'विचारा: "आपल्या गावात कोणी नवीन पाहुणा आला, तर तुम्ही त्याला रस्ता कसा समजावून सांगाल?" प्रत्येक इयत्ता परिसराचा वेगवेगळा नकाशा बनवेल.',
  },
  mapping: 'Draft: EVS neighbourhood, mapping and environment units, NCERT Classes 1-5 (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Describes places near home using "near" and "far"; names key places in the village.',
        hi: '"पास" और "दूर" का उपयोग करके घर के पास के स्थानों का वर्णन करता है; गाँव के मुख्य स्थानों के नाम बताता है।',
        mr: '"जवळ" आणि "दूर" या शब्दांचा वापर करून घराजवळील ठिकाणे सांगतो; गावातील प्रमुख ठिकाणांची नावे सांगतो.',
      },
      teacher: {
        title: { en: 'Near and far', hi: 'पास और दूर', mr: 'जवळ आणि दूर' },
        minutes: 8,
        steps: [
          { en: 'Ask: what is near our school? (gate, tree, road)', hi: 'पूछें: हमारे स्कूल के पास क्या है? (फाटक, पेड़, सड़क)', mr: 'विचारा: आपल्या शाळेजवळ काय आहे? (फाटक, झाड, रस्ता)' },
          { en: 'What is far from school? (market, river, another village)', hi: 'स्कूल से दूर क्या है? (बाजार, नदी, दूसरा गाँव)', mr: 'शाळेपासून दूर काय आहे? (बाजार, नदी, दुसरे गाव)' },
          { en: 'Practice: is the blackboard near or far? Is the village temple near or far?', hi: 'अभ्यास: क्या ब्लैकबोर्ड पास है या दूर? गाँव का मंदिर पास है या दूर?', mr: 'सराव: फळा जवळ आहे की दूर? गावातील मंदिर जवळ आहे की दूर?' },
        ],
      },
      independent: {
        title: { en: 'My places', hi: 'मेरे आसपास की जगहें', mr: 'माझा परिसर' },
        instructions: {
          en: 'Draw your house. Draw two places near it and one place far from it. Label them.',
          hi: 'अपना घर बनाएं। इसके पास दो जगहें और दूर एक जगह बनाएं। नाम लिखें।',
          mr: 'आपले घर काढा. घराजवळ दोन ठिकाणे आणि दूर एक ठिकाण दाखवा. नावे लिहा.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'drawing sheet', hi: 'ड्राइंग शीट', mr: 'चित्रकला कागद' },
          { en: 'crayons', hi: 'मोम के रंग', mr: 'रंगीत खडू' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Draw three village helpers (doctor, postman, teacher).',
        hi: 'गाँव के तीन मददगारों (डॉक्टर, डाकिया, शिक्षक) का चित्र बनाएं।',
        mr: 'गावातील तीन मदतनीसांची (डॉक्टर, पोस्टमन, शिक्षक) चित्रे काढा.',
      },
      checklist: [
        { en: 'Uses near and far relative to reference point', hi: 'संदर्भ बिंदु के सापेक्ष पास और दूर का उपयोग करता है', mr: 'संदर्भानुसार जवळ आणि दूर संकल्पना वापरतो' },
        { en: 'Names local landmarks like gram panchayat or well', hi: 'ग्राम पंचायत या कुएँ जैसे स्थानीय स्थानों के नाम बताता है', mr: 'ग्रामपंचायत किंवा विहिरीसारख्या स्थानिक ठिकाणांची नावे सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Name one place near your school.', hi: 'अपने स्कूल के पास की किसी एक जगह का नाम बताएं।', mr: 'तुमच्या शाळेजवळील एका ठिकाणाचे नाव सांगा.' },
          { en: 'Road, tree, shop, gate (any one)', hi: 'सड़क, पेड़, दुकान, फाटक', mr: 'रस्ता, झाड, दुकान, फाटक' },
          {
            support: [
              { en: 'The blackboard is _______ (near / far) from you.', hi: 'ब्लैकबोर्ड आपसे _______ (पास / दूर) है।', mr: 'फळा तुमच्यापासून _______ (जवळ / दूर) आहे.' },
              { en: 'Near', hi: 'पास', mr: 'जवळ' },
            ],
            stretch: [
              { en: 'Name two places near school and two places far away.', hi: 'स्कूल के पास की दो और दूर की दो जगहों के नाम बताएं।', mr: 'शाळेजवळील दोन आणि दूर असलेली दोन ठिकाणे सांगा.' },
              { en: 'Near: gate, well; Far: hospital, railway station', hi: 'पास: फाटक, कुआँ; दूर: अस्पताल, रेलवे स्टेशन', mr: 'जवळ: फाटक, विहीर; दूर: दवाखाना, रेल्वे स्थानक' },
            ],
          }
        ),
        item(
          { en: 'Draw your house and the school. Show which is nearer.', hi: 'अपना घर और स्कूल बनाएं। दिखाएं कि कौन सा पास है।', mr: 'आपले घर आणि शाळा काढा. कोणते जवळ आहे ते दाखवा.' },
          { en: 'Drawing showing relative positions', hi: 'सापेक्ष स्थिति दर्शाने वाला चित्र', mr: 'सापेक्ष अंतर दाखवणारे चित्र' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Spatial house-to-school sketch accessible to emerging Grade 1 readers across tiers' }
        ),
        item(
          { en: 'Is the weekly market near or far from your school?', hi: 'क्या साप्ताहिक बाजार आपके स्कूल के पास है या दूर?', mr: 'आठवडी बाजार तुमच्या शाळेजवळ आहे की दूर?' },
          { en: 'Answer depends on child; accept with explanation', hi: 'उत्तर बच्चे के अनुसार; व्याख्या स्वीकारें', mr: 'विद्यार्थ्याच्या अनुभवानुसार उत्तर स्वीकारा' },
          {
            support: [
              { en: 'Can you walk to the market in 5 minutes? Yes / No', hi: 'क्या आप 5 मिनट में चलकर बाजार जा सकते हैं? हाँ / नहीं', mr: 'तुम्ही ५ मिनिटांत चालत बाजारात जाऊ शकता का? होय / नाही' },
              { en: 'Yes or No', hi: 'हाँ या नहीं', mr: 'होय किंवा नाही' },
            ],
            stretch: [
              { en: 'How do people travel to places that are very far from the village?', hi: 'गाँव से बहुत दूर स्थित स्थानों पर लोग कैसे यात्रा करते हैं?', mr: 'गावापासून खूप दूर असलेल्या ठिकाणी लोक कशाने प्रवास करतात?' },
              { en: 'Bus, bicycle, train, tractor', hi: 'बस, साइकिल, ट्रेन, ट्रैक्टर', mr: 'एसटी बस, सायकल, रेल्वे, ट्रॅक्टर' },
            ],
          }
        ),
      ] }],
    },
    2: {
      outcome: {
        en: 'Uses left, right, front and back to give simple directions.',
        hi: 'सरल दिशाएं बताने के लिए बाएँ, दाएँ, आगे और पीछे का उपयोग करता है।',
        mr: 'साध्या दिशा सांगण्यासाठी डावीकडे, उजवीकडे, पुढे आणि मागे या शब्दांचा वापर करतो.',
      },
      teacher: {
        title: { en: 'Direction game', hi: 'दिशाओं का खेल', mr: 'दिशांचा खेळ' },
        minutes: 10,
        steps: [
          { en: 'Play Simon Says with directions: "Turn left, turn right, step forward, step back."', hi: 'दिशाओं का खेल खेलें: "बाएँ मुड़ें, दाएँ मुड़ें, आगे बढ़ें, पीछे हटें।"', mr: 'दिशांचा खेळ खेळा: "डावीकडे वळा, उजवीकडे वळा, पुढे पाऊल टाका, मागे व्हा."' },
          { en: 'Give directions from the classroom door to the teacher\'s desk.', hi: 'कक्षा के दरवाजे से शिक्षक की मेज तक का रास्ता बताएं।', mr: 'वर्गाच्या दरवाजापासून शिक्षकांच्या टेबलापर्यंतचा मार्ग सांगा.' },
          { en: 'Introduce: left, right, front, back, beside, between.', hi: 'बाएँ, दाएँ, आगे, पीछे, पास, बीच में शब्दों का परिचय दें।', mr: 'डावीकडे, उजवीकडे, पुढे, मागे, शेजारी, मध्ये या शब्दांची ओळख करून द्या.' },
        ],
      },
      independent: {
        title: { en: 'Direction drawings', hi: 'दिशा का नक्शा', mr: 'दिशांचे चित्र' },
        instructions: {
          en: 'Draw the classroom. Show where the door, windows and blackboard are using "left" and "right".',
          hi: 'कक्षा का चित्र बनाएं। "बाएँ" और "दाएँ" लिखकर दरवाजा, खिड़कियां और ब्लैकबोर्ड दिखाएं।',
          mr: 'वर्गाचे चित्र काढा. "डावीकडे" आणि "उजवीकडे" वापरून दरवाजा, खिडक्या आणि फळा दाखवा.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }, { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Guide your partner with your eyes closed using only verbal directions.',
        hi: 'आंखें बंद करके अपने साथी को केवल बोलकर रास्ता बताएं।',
        mr: 'डोळे मिटलेल्या मित्राला फक्त तोंडी सूचना देऊन योग्य दिशेने न्या.',
      },
      checklist: [
        { en: 'Knows own left and right hand without error', hi: 'अपने बाएँ और दाएँ हाथ की बिना गलती पहचान करता है', mr: 'स्वतःचा डावा आणि उजवा हात बिनचूक ओळखतो' },
        { en: 'Follows 2-step navigation commands', hi: '2 चरणों वाले दिशा निर्देशों का पालन करता है', mr: 'दोन टप्प्यांच्या दिशाविषयक सूचनांचे पालन करतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'If you face the blackboard, which side is the door?', hi: 'यदि आपका मुंह ब्लैकबोर्ड की ओर है, तो दरवाजा किस तरफ है?', mr: 'जर तुमचे तोंड फळ्याकडे असेल, तर दरवाजा कोणत्या बाजूला आहे?' },
          { en: 'Depends on classroom; accept correct answer', hi: 'कक्षा के अनुसार उत्तर स्वीकारें', mr: 'वर्गाच्या रचनेनुसार योग्य उत्तर स्वीकारा' },
          {
            support: [
              { en: 'Is the door on your left or right?', hi: 'क्या दरवाजा आपके बाएँ है या दाएँ?', mr: 'दरवाजा तुमच्या डाव्या बाजूला आहे की उजव्या?' },
              { en: 'Left / Right', hi: 'बाएँ / दाएँ', mr: 'डावीकडे / उजवीकडे' },
            ],
            stretch: [
              { en: 'If you turn around to face the back wall, what happens to your left and right?', hi: 'यदि आप पीछे की दीवार की ओर मुंह कर लें, तो आपके बाएँ और दाएँ में क्या बदलाव होगा?', mr: 'जर तुम्ही मागे वळून मागच्या भिंतीकडे तोंड केले, तर डावी व उजवी बाजू कशी बदलेल?' },
              { en: 'They reverse relative to the room', hi: 'कमरे के सापेक्ष वे उलट जाएंगे', mr: 'वर्गाच्या संदर्भात त्यांची दिशा उलटी होईल' },
            ],
          }
        ),
        item(
          { en: 'Give directions from your seat to the school gate. Use left and right.', hi: 'अपनी जगह से स्कूल के फाटक तक का रास्ता बताएं। बाएँ और दाएँ का उपयोग करें।', mr: 'तुमच्या जागेपासून शाळेच्या फाटकापर्यंतचा मार्ग डावी-उजवी बाजू वापरून सांगा.' },
          { en: 'Sequence of direction words', hi: 'दिशा शब्दों का सही क्रम', mr: 'दिशादर्शक शब्दांचा योग्य क्रम' },
          {
            support: [
              { en: 'To go forward, you take a step ______ (front / back).', hi: 'आगे जाने के लिए आप एक कदम ______ (आगे / पीछे) बढ़ाते हैं।', mr: 'पुढे जाण्यासाठी तुम्ही ______ (पुढे / मागे) पाऊल टाकता.' },
              { en: 'Front', hi: 'आगे', mr: 'पुढे' },
            ],
            stretch: [
              { en: 'Give 4 steps of clear directions for a visitor walking from gate to office.', hi: 'फाटक से कार्यालय तक आने वाले आगंतुक के लिए 4 स्पष्ट दिशा निर्देश दें।', mr: 'फाटकापासून कार्यालयापर्यंत येणाऱ्या पाहुण्याला ४ टप्प्यांत दिशा सांगा.' },
              { en: 'Go straight 10 steps, turn right at tree, walk past verandah, office on left', hi: '10 कदम सीधे जाएं, पेड़ के पास दाएँ मुड़ें, बरामदे के पास जाएँ, कार्यालय बाएँ होगा', mr: '१० पावले सरळ जा, झाडाजवळ उजवीकडे वळा, व्हरांड्यावरून पुढे जा, डावीकडे कार्यालय आहे' },
            ],
          }
        ),
        item(
          { en: 'Draw a path from the classroom to the playground. Label each turn.', hi: 'कक्षा से खेल के मैदान तक का रास्ता बनाएं। प्रत्येक मोड़ का नाम लिखें।', mr: 'वर्गापासून खेळाच्या मैदानापर्यंतचा मार्ग काढा. प्रत्येक वळणावर नाव लिहा.' },
          { en: 'Simple map with labelled turns', hi: 'मोड़ों के साथ सरल नक्शा', mr: 'वळणांसह साधा मार्ग-नकाशा' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Classroom-to-ground pathway sketch map suitable across Grade 2 tiers' }
        ),
      ] }],
    },
    3: {
      outcome: {
        en: 'Draws a simple sketch map of the school or village with basic symbols.',
        hi: 'बुनियादी प्रतीकों के साथ स्कूल या गाँव का एक सरल रेखाचित्र नक्शा बनाता है।',
        mr: 'साध्या चिन्हांचा वापर करून शाळा किंवा गावाचा साधा रेखाचित्री नकाशा काढतो.',
      },
      teacher: {
        title: { en: 'Bird\'s-eye view', hi: 'ऊपर से दृश्य (विहंगम दृष्टि)', mr: 'पक्ष्यांच्या नजरेतून दृश्य' },
        minutes: 12,
        steps: [
          { en: 'Explain: a map is like looking down from above, like a bird.', hi: 'समझाएं: नक्शा ऊपर से नीचे देखने जैसा होता है, जैसे कोई पक्षी देखता है।', mr: 'सांगा: नकाशा म्हणजे आकाशातून पक्ष्यासारखे खाली पाहिल्यासारखे असते.' },
          { en: 'Draw the school from above on the board: rooms as rectangles, ground as a big shape.', hi: 'बोर्ड पर ऊपर से स्कूल का नक्शा बनाएं: कमरे आयत के रूप में, मैदान बड़ा आकार।', mr: 'फळ्यावर शाळेचा वरून दिसणारा नकाशा काढा: खोल्या आयताकृती, मैदान मोठा आकार.' },
          { en: 'Introduce symbols: tree = circle with dot, building = rectangle, road = lines.', hi: 'प्रतीकों का परिचय दें: पेड़ = बिंदी वाला वृत्त, इमारत = आयत, सड़क = दोहरी रेखा।', mr: 'चिन्हांची ओळख करून द्या: झाड = वर्तुळात बिंदू, इमारत = आयत, रस्ता = समांतर रेषा.' },
        ],
      },
      independent: {
        title: { en: 'My school map', hi: 'मेरे स्कूल का नक्शा', mr: 'माझ्या शाळेचा नकाशा' },
        instructions: {
          en: 'Draw a sketch map of your school from above. Use symbols for trees, buildings and the playground.',
          hi: 'ऊपर से अपने स्कूल का रेखाचित्र नक्शा बनाएं। पेड़, इमारत और मैदान के लिए प्रतीकों का उपयोग करें।',
          mr: 'शाळेचा वरून दिसणारा नकाशा काढा. झाडे, इमारती आणि मैदान दाखवण्यासाठी चिन्हे वापरा.',
        },
        minutes: 15,
        mode: 'group',
        materials: [
          { en: 'large paper', hi: 'बड़ा कागज', mr: 'मोठा कागद' },
          { en: 'pencils', hi: 'पेंसिलें', mr: 'पेन्सिली' },
          { en: 'ruler', hi: 'पटरी', mr: 'पट्टी' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Invent three new symbols for: library, drinking water tap, and first-aid box.',
        hi: 'पुस्तकालय, पीने के पानी का नल और प्राथमिक चिकित्सा पेटी के लिए तीन नए प्रतीक बनाएं।',
        mr: 'वाचनालय, पिण्याच्या पाण्याचा नळ आणि प्रथमोपचार पेटी यासाठी ३ नवी चिन्हे तयार करा.',
      },
      checklist: [
        { en: 'Understands bird-eye overhead viewpoint', hi: 'ऊपर से देखने के दृष्टिकोण को समझता है', mr: 'वरून पाहण्याचा दृष्टिकोन समजून घेतो' },
        { en: 'Uses symbols consistently instead of detailed pictures', hi: 'विस्तृत चित्रों के स्थान पर प्रतीकों का लगातार उपयोग करता है', mr: 'चित्रांऐवजी योग्य चिन्हांचा वापर करतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'What does a map show that a photo does not?', hi: 'नक्शा ऐसा क्या दिखाता है जो तस्वीर नहीं दिखाती?', mr: 'छायाचित्रात न दिसणारी कोणती गोष्ट नकाशात दिसते?' },
          { en: 'Labels, symbols, relative positions from above', hi: 'नाम, प्रतीक और ऊपर से सापेक्ष स्थिति', mr: 'नावे, चिन्हे आणि वरून दिसणारे सापेक्ष अंतर व दिशा' },
          {
            support: [
              { en: 'Does a map show things from above? Yes / No', hi: 'क्या नक्शा चीजों को ऊपर से दिखाता है? हाँ / नहीं', mr: 'नकाशा गोष्टी वरून दाखवतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Give two advantages of maps over photographs for finding locations.', hi: 'स्थान खोजने के लिए तस्वीरों की तुलना में नक्शों के दो फायदे बताएं।', mr: 'ठिकाणे शोधण्यासाठी छायाचित्रांपेक्षा नकाशांचे दोन फायदे सांगा.' },
              { en: 'Clear labels, cleaner overview without shadows and clutter', hi: 'स्पष्ट नाम, बिना परछाई और रुकावट के स्पष्ट दृश्य', mr: 'स्पष्ट दिशा व नावे, सावल्या व गर्दी नसलेले स्वच्छ दृश्य' },
            ],
          }
        ),
        item(
          { en: 'Draw a symbol for a tree and a symbol for a building.', hi: 'पेड़ का प्रतीक और इमारत का प्रतीक बनाएं।', mr: 'झाडासाठी एक चिन्ह आणि इमारतीसाठी एक चिन्ह काढा.' },
          { en: 'Consistent symbols drawn', hi: 'प्रतीक चित्र', mr: 'चिन्हे' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Symbol creation drawing exercise for basic map legends accessible across Grade 3 tiers' }
        ),
        item(
          { en: 'Why do maps use symbols instead of real pictures?', hi: 'नक्शों में वास्तविक चित्रों के स्थान पर प्रतीकों का उपयोग क्यों किया जाता है?', mr: 'नकाशात खऱ्या चित्रांऐवजी चिन्हांचा वापर का केला जातो?' },
          { en: 'Symbols are simpler and fit more information in a small space', hi: 'प्रतीक सरल होते हैं और छोटी जगह में अधिक जानकारी देते हैं', mr: 'चिन्हे सोपी असतात आणि कमी जागेत जास्त माहिती दर्शवता येते' },
          {
            support: [
              { en: 'Are symbols easy to draw on a map? Yes / No', hi: 'क्या नक्शे पर प्रतीक बनाना आसान है? हाँ / नहीं', mr: 'नकाशावर चिन्हे काढणे सोपे असते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What is the table of symbols on a map called?', hi: 'नक्शे पर प्रतीकों की सूची को क्या कहा जाता है?', mr: 'नकाशावरील चिन्हांच्या सूचीला काय म्हणतात?' },
              { en: 'Key or Legend', hi: 'संकेत सूची (Legend / Key)', mr: 'नकाशा सूची (Key / Legend)' },
            ],
          }
        ),
      ] }],
    },
    4: {
      outcome: {
        en: 'Reads simple maps with a key/legend; identifies cardinal directions (N, S, E, W).',
        hi: 'संकेत सूची के साथ सरल नक्शे पढ़ता है; मुख्य दिशाओं (उत्तर, दक्षिण, पूर्व, पश्चिम) की पहचान करता है।',
        mr: 'सूचीच्या साहाय्याने साधा नकाशा वाचतो; मुख्य दिशा (उत्तर, दक्षिण, पूर्व, पश्चिम) ओळखतो.',
      },
      teacher: {
        title: { en: 'Map and compass', hi: 'नक्शा और दिशा सूचक', mr: 'नकाशा आणि दिशाचक्र' },
        minutes: 12,
        steps: [
          { en: 'Draw a compass rose on the board: N, S, E, W.', hi: 'बोर्ड पर दिशा चक्र बनाएं: उत्तर, दक्षिण, पूर्व, पश्चिम।', mr: 'फळ्यावर दिशाचक्र काढा: उत्तर, दक्षिण, पूर्व, पश्चिम.' },
          { en: 'Show the village map with a key: blue = water, green = farm, brown = road.', hi: 'संकेत सूची वाला गाँव का नक्शा दिखाएं: नीला = पानी, हरा = खेत, भूरा = सड़क।', mr: 'सूची असलेला गावाचा नकाशा दाखवा: निळा = पाणी, हिरवा = शेत, तपकिरी = रस्ता.' },
          { en: 'Practice: "The school is north of the market" — point on the map.', hi: 'अभ्यास: "स्कूल बाजार के उत्तर में है" — नक्शे पर दिखाएं।', mr: 'सराव: "शाळा बाजाराच्या उत्तरेस आहे" — नकाशावर बोट दाखवा.' },
        ],
      },
      independent: {
        title: { en: 'Map reading', hi: 'नक्शा पढ़ना', mr: 'नकाशा वाचन' },
        instructions: {
          en: 'Use the given map to answer questions about directions and distances.',
          hi: 'दिए गए नक्शे का उपयोग करके दिशाओं और दूरियों के प्रश्नों के उत्तर दें।',
          mr: 'दिलेल्या नकाशाचा वापर करून दिशा व अंतरांवरील प्रश्नांची उत्तरे द्या.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'printed map', hi: 'छपा हुआ नक्शा', mr: 'छापील नकाशा' }, { en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Face the sunrise tomorrow morning. Write what directions are in front, behind, left and right.',
        hi: 'कल सुबह सूर्योदय की ओर मुंह करके खड़े हों। लिखें कि आगे, पीछे, बाएँ और दाएँ कौन सी दिशाएं हैं।',
        mr: 'उद्या सकाळी सूर्योदयाकडे तोंड करून उभे राहा. पुढे, मागे, डावीकडे आणि उजवीकडे कोणत्या दिशा येतात ते लिहा.',
      },
      checklist: [
        { en: 'Points North to the top of standard maps', hi: 'मानक नक्शों पर उत्तर दिशा ऊपर की ओर बताता है', mr: 'नकाशावर उत्तर दिशा नेहमी वरच्या बाजूला असते हे सांगतो' },
        { en: 'Knows East is sunrise direction', hi: 'जानता है कि पूर्व सूर्योदय की दिशा है', mr: 'पूर्व ही सूर्योदयाची दिशा आहे हे माहीत आहे' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'What are the four cardinal directions?', hi: 'चार मुख्य दिशाएं कौन सी हैं?', mr: 'चार मुख्य दिशा कोणत्या आहेत?' },
          { en: 'North, South, East, West', hi: 'उत्तर, दक्षिण, पूर्व, पश्चिम', mr: 'उत्तर, दक्षिण, पूर्व, पश्चिम' },
          {
            support: [
              { en: 'The sun rises in the ______: East / West', hi: 'सूरज निकलता है: पूर्व / पश्चिम', mr: 'सूर्य उगवतो: पूर्व / पश्चिम' },
              { en: 'East', hi: 'पूर्व', mr: 'पूर्व' },
            ],
            stretch: [
              { en: 'Name the four intermediate directions.', hi: 'चार उप-दिशाओं के नाम बताएं।', mr: 'चार उपदिशांची नावे सांगा.' },
              { en: 'North-East, North-West, South-East, South-West', hi: 'उत्तर-पूर्व, उत्तर-पश्चिम, दक्षिण-पूर्व, दक्षिण-पश्चिम', mr: 'ईशान्य, वायव्य, आग्नेय, नैऋत्य' },
            ],
          }
        ),
        item(
          { en: 'On a map, what does the "key" or "legend" tell you?', hi: 'नक्शे पर "संकेत सूची" (Key / Legend) क्या बताती है?', mr: 'नकाशावरील "सूची" (Key / Legend) आपल्याला काय माहिती देते?' },
          { en: 'It explains what each symbol or colour on the map means', hi: 'यह समझाती है कि नक्शे पर प्रत्येक प्रतीक या रंग का क्या अर्थ है', mr: 'नकाशातील प्रत्येक चिन्ह किंवा रंग कशासाठी वापरला आहे ते स्पष्ट करते' },
          {
            support: [
              { en: 'Does the map key explain symbols? Yes / No', hi: 'क्या संकेत सूची प्रतीकों का अर्थ बताती है? हाँ / नहीं', mr: 'नकाशा सूची चिन्हांचा अर्थ सांगते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Why is a uniform map key important when travelers read maps?', hi: 'यात्रियों के लिए एक समान संकेत सूची क्यों महत्वपूर्ण है?', mr: 'प्रवाशांसाठी प्रमाणित नकाशा सूची असणे का महत्त्वाचे आहे?' },
              { en: 'So anyone can understand symbols regardless of language', hi: 'ताकि कोई भी व्यक्ति भाषा की बाधा के बिना प्रतीकों को समझ सके', mr: 'भाषेची अडचण न येता कोणालाही चिन्हे सहज समजता यावीत म्हणून' },
            ],
          }
        ),
        item(
          { en: 'If you face North, East is on your ______ (left / right).', hi: 'यदि आप उत्तर की ओर मुंह करते हैं, तो पूर्व आपके ______ (बाएँ / दाएँ) होता है।', mr: 'जर तुम्ही उत्तरेकडे तोंड केले, तर पूर्व तुमच्या ______ (डावीकडे / उजवीकडे) असते.' },
          { en: 'Right', hi: 'दाएँ', mr: 'उजवीकडे' },
          {
            support: [
              { en: 'Facing North, East is on right: Yes / No', hi: 'उत्तर की ओर मुंह करने पर पूर्व दाएँ होता है: हाँ / नहीं', mr: 'उत्तरेकडे तोंड असताना पूर्व उजवीकडे असते: होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'If you face South-East, what direction is directly behind you?', hi: 'यदि आपका मुंह दक्षिण-पूर्व की ओर है, तो आपके ठीक पीछे कौन सी दिशा होगी?', mr: 'जर तुमचे तोंड आग्नेय दिशेला असेल, तर तुमच्या बरोबर मागे कोणती दिशा असेल?' },
              { en: 'North-West', hi: 'उत्तर-पश्चिम (वायव्य)', mr: 'वायव्य' },
            ],
          }
        ),
      ] }],
    },
    5: {
      outcome: {
        en: 'Understands simple scale on a map; estimates real distances from map measurements.',
        hi: 'नक्शे पर पैमाने (स्केल) को समझता है; नक्शे के माप से वास्तविक दूरी का अनुमान लगाता है।',
        mr: 'नकाशावरील प्रमाण समजून घेतो; मोजमापावरून प्रत्यक्ष अंतराचा अंदाज लावतो.',
      },
      teacher: {
        title: { en: 'Scale and distance', hi: 'पैमाना और दूरी', mr: 'प्रमाण आणि अंतर' },
        minutes: 12,
        steps: [
          { en: 'Show a map with scale: 1 cm = 100 m.', hi: 'पैमाने वाला नक्शा दिखाएं: 1 सेमी = 100 मीटर।', mr: 'प्रमाण असलेला नकाशा दाखवा: १ सेमी = १०० मीटर.' },
          { en: 'Measure the distance between two places with a ruler: 3 cm = 300 m.', hi: 'पटरी से दो स्थानों के बीच की दूरी नापें: 3 सेमी = 300 मीटर।', mr: 'पट्टीने दोन ठिकाणांमधील अंतर मोजा: ३ सेमी = ३०० मीटर.' },
          { en: 'Discuss: why can\'t we draw the village at full size?', hi: 'चर्चा करें: हम पूरे आकार का गाँव कागज पर क्यों नहीं बना सकते?', mr: 'चर्चा करा: आपण गावाच्या खऱ्या आकाराइतका मोठा नकाशा का काढू शकत नाही?' },
        ],
      },
      independent: {
        title: { en: 'Map measurements', hi: 'नक्शे की माप', mr: 'नकाशा मोजमाप' },
        instructions: {
          en: 'Use the scale to calculate real distances. Show your multiplications.',
          hi: 'वास्तविक दूरी निकालने के लिए पैमाने का उपयोग करें। अपना गुणा दिखाएं।',
          mr: 'प्रत्यक्ष अंतर काढण्यासाठी प्रमाणाचा वापर करा. गुणाकार दाखवा.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [{ en: 'map', hi: 'नक्शा', mr: 'नकाशा' }, { en: 'ruler', hi: 'पटरी', mr: 'पट्टी' }, { en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'On a map of scale 1 cm = 2 km, how far is a 14 km journey between two towns on paper?',
        hi: '1 सेमी = 2 किमी के पैमाने पर, दो कस्बों के बीच 14 किमी की यात्रा कागज पर कितनी होगी?',
        mr: '१ सेमी = २ किमी प्रमाण असल्यास, दोन गावांमधील १४ किमीचे अंतर कागदावर किती सेमी असेल?',
      },
      checklist: [
        { en: 'Multiplies ruler centimetres by scale factor', hi: 'पटरी के सेंटीमीटर को पैमाने से गुणा करता है', mr: 'पट्टीवरील सेंटीमीटरला प्रमाण घटकाने गुणतो' },
        { en: 'Understands why scale ratio is required for accuracy', hi: 'समझता है कि सटीकता के लिए पैमाना अनुपात क्यों आवश्यक है', mr: 'अचूकतेसाठी प्रमाण गुणोत्तर का आवश्यक आहे ते समजून घेतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'On a map, 1 cm = 200 m. Two places are 4 cm apart. What is the real distance?', hi: 'एक नक्शे पर 1 सेमी = 200 मीटर है। दो स्थान 4 सेमी दूर हैं। वास्तविक दूरी क्या है?', mr: 'नकाशावर १ सेमी = २०० मीटर आहे. दोन ठिकाणे ४ सेमी अंतरावर आहेत. प्रत्यक्ष अंतर किती?' },
          { en: '800 m', hi: '800 मीटर', mr: '८०० मीटर' },
          {
            support: [
              { en: '1 cm = 100 m. Two places are 3 cm apart. Real distance = _____ m.', hi: '1 सेमी = 100 मीटर। दो स्थान 3 सेमी दूर हैं। वास्तविक दूरी = _____ मीटर।', mr: '१ सेमी = १०० मीटर. दोन ठिकाणे ३ सेमी अंतरावर आहेत. प्रत्यक्ष अंतर = _____ मीटर.' },
              { en: '300 m', hi: '300 मीटर', mr: '३०० मीटर' },
            ],
            stretch: [
              { en: 'On a map, 1 cm = 250 m. A road is 2400 m long. How many cm on the map?', hi: 'नक्शे पर 1 सेमी = 250 मीटर है। एक सड़क 2400 मीटर लंबी है। नक्शे पर यह कितने सेमी होगी?', mr: 'नकाशावर १ सेमी = २५० मीटर आहे. एक रस्ता २४०० मीटर लांब आहे. नकाशावर तो किती सेमी असेल?' },
              { en: '9.6 cm', hi: '9.6 सेमी', mr: '९.६ सेमी' },
            ],
          }
        ),
        item(
          { en: 'Why do maps need a scale?', hi: 'नक्शों को पैमाने (स्केल) की आवश्यकता क्यों होती है?', mr: 'नकाशांना प्रमाणाची गरज का असते?' },
          { en: 'To show real-world distances on paper in accurate proportion', hi: 'वास्तविक दूरियों को कागज पर सही अनुपात में दिखाने के लिए', mr: 'जमिनीवरील प्रत्यक्ष अंतर कागदावर अचूक प्रमाणात दर्शवण्यासाठी' },
          {
            support: [
              { en: 'Does scale help calculate real distances? Yes / No', hi: 'क्या पैमाना वास्तविक दूरी निकालने में मदद करता है? हाँ / नहीं', mr: 'प्रमाण प्रत्यक्ष अंतर काढण्यास मदत करते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Explain what a representative fraction like 1:50,000 means on a topographical map.', hi: 'समझाएं कि 1:50,000 जैसे अनुपात का नक्शे पर क्या अर्थ है।', mr: 'नकाशावरील १:५०,००० या प्रमाणाचा नेमका अर्थ काय ते सांगा.' },
              { en: '1 unit on map equals 50,000 units on the actual ground', hi: 'नक्शे की 1 इकाई जमीन की 50,000 इकाइयों के बराबर होती है', mr: 'नकाशावरील १ एकक अंतर म्हणजे जमिनीवरील ५०,००० एकक अंतर' },
            ],
          }
        ),
        item(
          { en: 'On a map with scale 1 cm = 500 m, the school and hospital are 6.5 cm apart. How far is it in kilometres?', hi: '1 सेमी = 500 मीटर के पैमाने पर, स्कूल और अस्पताल 6.5 सेमी दूर हैं। यह कितने किलोमीटर है?', mr: '१ सेमी = ५०० मीटर प्रमाण असणाऱ्या नकाशावर शाळा व दवाखाना ६.५ सेमी अंतरावर आहेत. ते अंतर किती किलोमीटर आहे?' },
          { en: '3.25 km or 3250 m', hi: '3.25 किमी (3250 मीटर)', mr: '३.२५ किमी (३२५० मीटर)' },
          {
            support: [
              { en: '1 cm = 500 m. How many metres in 2 cm?', hi: '1 सेमी = 500 मीटर। 2 सेमी में कितने मीटर होंगे?', mr: '१ सेमी = ५०० मीटर. २ सेमी म्हणजे किती मीटर?' },
              { en: '1000 m (1 km)', hi: '1000 मीटर (1 किमी)', mr: '१००० मीटर (१ किमी)' },
            ],
            stretch: [
              { en: 'If walking speed is 4 km/hr, how long does it take to walk between these two places?', hi: 'यदि चलने की गति 4 किमी/घंटा है, तो इन दोनों स्थानों के बीच चलने में कितना समय लगेगा?', mr: 'जर चालण्याचा वेग ताशी ४ किमी असेल, तर या दोन ठिकाणांमध्ये चालण्यासाठी किती वेळ लागेल?' },
              { en: 'About 49 minutes (3.25 / 4 * 60)', hi: 'लगभग 49 मिनट', mr: 'सुमारे ४९ मिनिटे' },
            ],
          }
        ),
      ] }],
    },
  },
};

const fractions: Topic = {
  id: 'math-fractions',
  subject: 'math',
  title: { en: 'Fractions and Sharing (Maths)', hi: 'भिन्न और बँटवारा (गणित)', mr: 'अपूर्णांक आणि वाटप (गणित)' },
  theme: { en: 'Sharing rotis and sweets at the harvest festival', hi: 'फसल उत्सव में रोटी और मिठाई बाँटना', mr: 'सुगीच्या सणात भाकरी आणि मिठाई वाटणे' },
  hook: {
    en: 'Bring a round paper cutout (pretend roti). Ask: "If two friends want equal share, how do we fold it? What if four friends come?"',
    hi: 'कागज की एक गोल रोटी लाएं। पूछें: "यदि दो दोस्तों को बराबर हिस्सा चाहिए, तो इसे कैसे मोड़ेंगे? यदि चार दोस्त आ जाएं तो?"',
    mr: 'कागदाची गोल भाकरी आणा. विचारा: "दोन मित्रांना समान वाटा हवा असल्यास, आपण ती कशी घडी घालू? चार मित्र आले तर?"',
  },
  mapping: 'Draft: Fractions strand, NCERT Classes 1-5 & Maharashtra State Board (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Understands equal sharing into 2 halves using paper folding and objects.',
        hi: 'कागज मोड़कर और वस्तुओं द्वारा 2 बराबर आधे हिस्सों (आधा) में बाँटना समझता है।',
        mr: 'कागदाची घडी घालून आणि वस्तू वापरून २ समान भागात (अर्धा) वाटणे समजून घेतो.',
      },
      teacher: {
        title: { en: 'Folding halves', hi: 'मोड़कर आधा करना', mr: 'घडी घालून अर्धा भाग करणे' },
        minutes: 8,
        steps: [
          { en: 'Fold paper circle into 2 equal parts.', hi: 'कागज के वृत्त को 2 बराबर भागों में मोड़ें।', mr: 'कागदी वर्तुळाला २ समान भागात घडी घाला.' },
          { en: 'Show half (1/2) and whole.', hi: 'आधा (1/2) और पूरा दिखाएं।', mr: 'अर्धा (१/२) आणि पूर्ण भाग दाखवा.' },
          { en: 'Children count 2 halves make 1 whole.', hi: 'बच्चे गिनें कि 2 आधे मिलकर 1 पूरा बनता है।', mr: 'मुलांनी २ अर्धे भाग मिळून १ पूर्ण भाग होतो हे मोजावे.' },
        ],
      },
      independent: {
        title: { en: 'Colour one half', hi: 'आधे भाग में रंग भरें', mr: 'अर्ध्या भागात रंग भरा' },
        instructions: {
          en: 'Colour exactly half (1/2) of each circle and rectangle.',
          hi: 'प्रत्येक वृत्त और आयत के ठीक आधे (1/2) भाग में रंग भरें।',
          mr: 'प्रत्येक वर्तुळ आणि आयताच्या बरोबर अर्ध्या (१/२) भागात रंग भरा.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'worksheet', hi: 'कार्यपत्रक', mr: 'कार्यपत्रिका' },
          { en: 'crayons', hi: 'मोम के रंग', mr: 'रंगीत खडू' },
        ],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Draw two rotis and cut each into halves with a dotted pencil line.',
        hi: 'दो रोटियां बनाएं और प्रत्येक को पेंसिल की बिंदीदार रेखा से आधे हिस्से में बांटें।',
        mr: 'दोन भाकऱ्या काढा आणि ठिपक्यांच्या रेषेने प्रत्येकीचे दोन अर्धे भाग करा.',
      },
      checklist: [
        { en: 'Identifies that both halves must be equal in size', hi: 'पहचानता है कि दोनों आधे हिस्से आकार में बराबर होने चाहिए', mr: 'दोन्ही अर्धे भाग आकारात समान असावे लागतात हे ओळखतो' },
        { en: 'Knows 2 halves combine into 1 whole', hi: 'जानता है कि 2 आधे मिलकर 1 पूरा बनता है', mr: '२ अर्धे भाग मिळून १ पूर्ण होतो हे माहीत आहे' },
      ],
      questions: [gen('count', 3), gen('add', 3, { digits: 1 })],
    },
    2: {
      outcome: {
        en: 'Identifies one-half (1/2) and one-quarter (1/4) of a collection and shape.',
        hi: 'किसी समूह और आकृति के आधे (1/2) और एक चौथाई (1/4) की पहचान करता है।',
        mr: 'एखाद्या आकृतीचा किंवा समूहाचा अर्धा (१/२) आणि पाव (१/४) भाग ओळखतो.',
      },
      teacher: {
        title: { en: 'Four equal quarters', hi: 'चार बराबर चौथाई (पाव)', mr: 'चार समान पाव भाग' },
        minutes: 10,
        steps: [
          { en: 'Fold paper into 4 equal quarters (1/4).', hi: 'कागज को 4 बराबर चौथाई (1/4) भागों में मोड़ें।', mr: 'कागदाला ४ समान पाव (१/४) भागात घडी घाला.' },
          { en: 'Share 8 marbles among 4 children: each gets 2.', hi: '8 कंचे 4 बच्चों में बाँटें: प्रत्येक को 2 मिलते हैं।', mr: '८ गोट्या ४ मुलांमध्ये वाटा: प्रत्येकाला २ मिळतात.' },
          { en: 'Introduce names: half (ardha) and quarter (paav).', hi: 'नाम बताएं: आधा और चौथाई (पाव)।', mr: 'नावे सांगा: अर्धा आणि पाव.' },
        ],
      },
      independent: {
        title: { en: 'Quarter colour practice', hi: 'चौथाई रंगने का अभ्यास', mr: 'पाव भाग रंगवण्याचा सराव' },
        instructions: {
          en: 'Shade 1/4 of each given figure and group.',
          hi: 'दी गई प्रत्येक आकृति और समूह के 1/4 भाग को छायांकित करें।',
          mr: 'दिलेल्या प्रत्येक आकृतीचा आणि समूहाचा १/४ (पाव) भाग रंगवा.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [{ en: 'worksheet', hi: 'कार्यपत्रक', mr: 'कार्यपत्रिका' }, { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'How many quarters (1/4) make one half (1/2)? Draw it to verify.',
        hi: 'कितने चौथाई मिलकर एक आधा बनाते हैं? चित्र बनाकर जाँचें।',
        mr: 'किती पाव भाग मिळून एक अर्धा भाग होतो? चित्र काढून तपासा.',
      },
      checklist: [
        { en: 'Identifies quarter as one of 4 equal parts', hi: 'पहचानता है कि चौथाई 4 बराबर भागों में से एक है', mr: 'पाव म्हणजे ४ समान भागांपैकी एक भाग हे ओळखतो' },
        { en: 'Shares small collections into 4 equal groups', hi: 'छोटे समूहों को 4 बराबर भागों में बाँटता है', mr: 'लहान समूहांची ४ समान भागात विभागणी करतो' },
      ],
      questions: [gen('addNoCarry', 3), gen('sub', 3, { digits: 2 })],
    },
    3: {
      outcome: {
        en: 'Reads and writes fractions (1/2, 1/3, 1/4, 3/4) and identifies numerator and denominator.',
        hi: 'भिन्न (1/2, 1/3, 1/4, 3/4) पढ़ता और लिखता है तथा अंश और हर की पहचान करता है।',
        mr: 'अपूर्णांक (१/२, १/३, १/४, ३/४) वाचतो व लिहितो आणि अंश व छेद ओळखतो.',
      },
      teacher: {
        title: { en: 'Numerator and Denominator', hi: 'अंश और हर', mr: 'अंश आणि छेद' },
        minutes: 12,
        steps: [
          { en: 'Denominator is total equal parts; Numerator is parts taken.', hi: 'हर कुल बराबर भाग है; अंश लिए गए भाग हैं।', mr: 'छेद म्हणजे एकूण समान भाग; अंश म्हणजे घेतलेले भाग.' },
          { en: 'Show 3/4 (three-quarters / paun).', hi: '3/4 (तीन चौथाई / पौन) दिखाएं।', mr: '३/४ (पाऊण भाग) दाखवा.' },
          { en: 'Children write fractions for shaded strip diagrams.', hi: 'बच्चे छायांकित पट्टी आरेखों के लिए भिन्न लिखें।', mr: 'मुलांनी रंगवलेल्या पट्ट्यांच्या आकृतीवरून अपूर्णांक लिहावेत.' },
        ],
      },
      independent: {
        title: { en: 'Fraction strips', hi: 'भिन्न की पट्टियां', mr: 'अपूर्णांकांच्या पट्ट्या' },
        instructions: {
          en: 'Write the fraction for each shaded strip in your notebook.',
          hi: 'अपनी कॉपी में प्रत्येक छायांकित पट्टी का भिन्न लिखें।',
          mr: 'आपल्या वहीत प्रत्येक रंगवलेल्या पट्टीचा अपूर्णांक लिहा.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Draw a chocolate bar of 6 pieces. Shade 4/6 of it.',
        hi: '6 टुकड़ों की चॉकलेट बार बनाएं। उसके 4/6 भाग को छायांकित करें।',
        mr: '६ तुकड्यांची चॉकलेट पट्टी काढा. त्यातील ४/६ भाग रंगवा.',
      },
      checklist: [
        { en: 'Names top number as numerator and bottom as denominator', hi: 'ऊपर की संख्या को अंश और नीचे की संख्या को हर बताता है', mr: 'वरच्या संख्येला अंश आणि खालच्या संख्येला छेद म्हणतो' },
        { en: 'Correctly interprets 3/4 as 3 parts out of 4', hi: '3/4 को 4 में से 3 भाग के रूप में सही समझता है', mr: '३/४ चा अर्थ ४ पैकी ३ भाग असा अचूक लावतो' },
      ],
      questions: [gen('fracAdd', 3, { den: 4 }), gen('add', 2, { digits: 2 })],
    },
    4: {
      outcome: {
        en: 'Adds and subtracts like fractions; identifies equivalent fractions (1/2 = 2/4 = 4/8).',
        hi: 'समान हर वाले भिन्नों को जोड़ता और घटाता है; समतुल्य भिन्न (1/2 = 2/4 = 4/8) पहचानता है।',
        mr: 'समछेद अपूर्णांकांची बेरीज व वजाबाकी करतो; सममूल्य अपूर्णांक (१/२ = २/४ = ४/८) ओळखतो.',
      },
      teacher: {
        title: { en: 'Equivalent fraction wall', hi: 'समतुल्य भिन्न की दीवार', mr: 'सममूल्य अपूर्णांकांची भिंत' },
        minutes: 12,
        steps: [
          { en: 'Show fraction wall: 1/2 is same length as 2/4 and 4/8.', hi: 'भिन्न दीवार दिखाएं: 1/2 की लंबाई 2/4 और 4/8 के बराबर है।', mr: 'अपूर्णांक भिंत दाखवा: १/२ ची लांबी २/४ आणि ४/८ एवढीच असते.' },
          { en: 'Rule for addition: add numerators, keep denominator same.', hi: 'जोड़ का नियम: अंश जोड़ें, हर वही रखें।', mr: 'बेरजेचा नियम: अंशांची बेरीज करा, छेद तोच ठेवा.' },
          { en: 'Model: 2/6 + 3/6 = 5/6.', hi: 'हल करके दिखाएं: 2/6 + 3/6 = 5/6।', mr: 'सोडवून दाखवा: २/६ + ३/६ = ५/६.' },
        ],
      },
      independent: {
        title: { en: 'Like fraction sums', hi: 'समान हर वाले भिन्नों के सवाल', mr: 'समछेद अपूर्णांकांची बेरीज' },
        instructions: {
          en: 'Solve all like fraction additions and match equivalent pairs.',
          hi: 'समान हर वाले सभी जोड़ हल करें और समतुल्य जोड़ों का मिलान करें।',
          mr: 'समछेद अपूर्णांकांची बेरीज सोडवा आणि सममूल्य जोड्या जुळवा.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'Find three fractions equivalent to 1/3.',
        hi: '1/3 के समतुल्य तीन भिन्न खोजें।',
        mr: '१/३ चे तीन सममूल्य अपूर्णांक शोधा.',
      },
      checklist: [
        { en: 'Adds numerators only when denominators match', hi: 'हर समान होने पर केवल अंशों को जोड़ता है', mr: 'छेद समान असताना केवळ अंशांची बेरीज करतो' },
        { en: 'Simplifies 2/4 to 1/2', hi: '2/4 को सरल करके 1/2 लिखता है', mr: '२/४ चे संक्षिप्त रूप १/२ करतो' },
      ],
      questions: [gen('fracAdd', 4, { den: 8 }), gen('mul', 2, { digits: 2 })],
    },
    5: {
      outcome: {
        en: 'Solves fraction word problems, compares unlike fractions, and adds mixed numbers.',
        hi: 'भिन्न के इबारती प्रश्न हल करता है, असमान भिन्नों की तुलना करता है और मिश्र भिन्न जोड़ता है।',
        mr: 'अपूर्णांकांची शाब्दिक उदाहरणे सोडवतो, भिन्नछेद अपूर्णांकांची तुलना करतो आणि पूर्णांकयुक्त अपूर्णांकांची बेरीज करतो.',
      },
      teacher: {
        title: { en: 'Village feast distribution', hi: 'गाँव की दावत में बँटवारा', mr: 'गावच्या पंक्तीतील वाटप' },
        minutes: 12,
        steps: [
          { en: 'Solve word problems: 3 1/2 kg rice + 2 1/4 kg rice.', hi: 'इबारती प्रश्न हल करें: 3 1/2 किग्रा चावल + 2 1/4 किग्रा चावल।', mr: 'शाब्दिक उदाहरणे सोडवा: ३ १/२ किलो तांदूळ + २ १/४ किलो तांदूळ.' },
          { en: 'Convert mixed numbers to improper fractions.', hi: 'मिश्र संख्याओं को अनुचित भिन्न में बदलें।', mr: 'पूर्णांकयुक्त अपूर्णांकांचे अंशाधिक अपूर्णांकात रूपांतर करा.' },
          { en: 'Compare fractions by making denominators equal.', hi: 'हर बराबर करके भिन्नों की तुलना करें।', mr: 'छेद समान करून अपूर्णांकांची तुलना करा.' },
        ],
      },
      independent: {
        title: { en: 'Ration shop word problems', hi: 'राशन दुकान के इबारती सवाल', mr: 'रास्त भाव दुकानातील शाब्दिक उदाहरणे' },
        instructions: {
          en: 'Solve real-life fraction word problems with steps and units.',
          hi: 'चरणों और इकाइयों के साथ वास्तविक जीवन के भिन्न प्रश्न हल करें।',
          mr: 'पायऱ्या आणि एककांसह दैनंदिन व्यवहारातील अपूर्णांकांची उदाहरणे सोडवा.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('Mathematics / Ganit'),
      earlyFinisher: {
        en: 'If 3/5 of a class of 30 students are girls, how many girls are there? How many boys?',
        hi: 'यदि 30 बच्चों की कक्षा में 3/5 लड़कियाँ हैं, तो कितनी लड़कियाँ हैं? कितने लड़के?',
        mr: '३० मुलांच्या वर्गात ३/५ मुली असल्यास, एकूण किती मुली आहेत? मुले किती?',
      },
      checklist: [
        { en: 'Converts mixed fractions correctly', hi: 'मिश्र भिन्नों का सही रूपांतरण करता है', mr: 'पूर्णांकयुक्त अपूर्णांकांचे अचूक रूपांतर करतो' },
        { en: 'Solves multi-step fraction sharing word problems', hi: 'कई चरणों वाले भिन्न के प्रश्नों को हल करता है', mr: 'अपूर्णांकांची बहु-टप्पीय शाब्दिक उदाहरणे सोडवतो' },
      ],
      questions: [gen('fracAdd', 3, { den: 8 }), gen('money', 2), gen('wordShop', 2, { digits: 2, op: 'mul' })],
    },
  },
};

const animals: Topic = {
  id: 'evs-animals',
  subject: 'evs',
  title: { en: 'Animals and Their Homes (EVS)', hi: 'जानवर और उनके आवास (पर्यावरण)', mr: 'प्राणी आणि त्यांची राहण्याची ठिकाणे (परिसर अभ्यास)' },
  theme: { en: 'Animals around our village and forest', hi: 'हमारे गाँव और जंगल के जीव-जंतु', mr: 'आपल्या गावातील आणि जंगलातील प्राणी' },
  hook: {
    en: 'Imitate animal sounds (dog, cow, bird, frog). Ask: "Who lives with us at home? Who lives in the jungle? Who lives in water?"',
    hi: 'जानवरों की आवाज़ों की नकल करें (कुत्ता, गाय, पक्षी, मेंढक)। पूछें: "हमारे साथ घर में कौन रहता है? जंगल में कौन रहता है? पानी में कौन रहता है?"',
    mr: 'प्राण्यांचे आवाज काढून दाखवा (कुत्रा, गाय, पक्षी, बेडूक). विचारा: "आपल्यासोबत घरात कोण राहते? जंगलात कोण राहते? पाण्यात कोण राहते?"',
  },
  mapping: 'Draft: Animal life and habitat units, NCERT Classes 1-5 & Maharashtra State Board (verify against state textbook).',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Distinguishes domestic from wild animals; mimics sounds and movements.',
        hi: 'पालतू और जंगली जानवरों में अंतर करता है; उनकी आवाज़ों और चाल की नकल करता है।',
        mr: 'पाळीव आणि जंगली प्राण्यांमधील फरक ओळखतो; त्यांचे आवाज व हालचालींची नक्कल करतो.',
      },
      teacher: {
        title: { en: 'Domestic vs Wild animals', hi: 'पालतू बनाम जंगली जानवर', mr: 'पाळीव विरुद्ध जंगली प्राणी' },
        minutes: 8,
        steps: [
          { en: 'Show pictures of cow, dog, goat, tiger, elephant.', hi: 'गाय, कुत्ता, बकरी, बाघ, हाथी के चित्र दिखाएं।', mr: 'गाय, कुत्रा, शेळी, वाघ, हत्ती यांची चित्रे दाखवा.' },
          { en: 'Sort: animals on the farm vs animals in deep jungle.', hi: 'वर्गीकृत करें: खेत/घर के जानवर बनाम घने जंगल के जानवर।', mr: 'वर्गीकरण करा: गोठ्यातील/घरातील प्राणी विरुद्ध घनदाट जंगलातील प्राणी.' },
          { en: 'Act out animal walks and sounds.', hi: 'जानवरों की चाल और आवाज़ों का अभिनय करें।', mr: 'प्राण्यांच्या चालीचा व आवाजांचा अभिनय करा.' },
        ],
      },
      independent: {
        title: { en: 'Animal homes match', hi: 'जानवर और उनके घर का मिलान', mr: 'प्राणी आणि त्यांच्या घरांच्या जोड्या' },
        instructions: {
          en: 'Match cow to shed, bird to nest, dog to kennel, lion to den.',
          hi: 'गाय को गोशाला, पक्षी को घोंसला, कुत्ते को घर और शेर को मांद से मिलाएं।',
          mr: 'गाय-गोठा, पक्षी-घरटे, कुत्रा-घर आणि सिंह-गुहा यांच्या जोड्या जुळवा.',
        },
        minutes: 8,
        mode: 'pair',
        materials: [
          { en: 'worksheet', hi: 'कार्यपत्रक', mr: 'कार्यपत्रिका' },
          { en: 'crayons', hi: 'मोम के रंग', mr: 'रंगीत खडू' },
        ],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Draw your favourite pet animal and write its name.',
        hi: 'अपने पसंदीदा पालतू जानवर का चित्र बनाएं और उसका नाम लिखें।',
        mr: 'आपल्या आवडत्या पाळीव प्राण्याचे चित्र काढा आणि त्याचे नाव लिहा.',
      },
      checklist: [
        { en: 'Identifies cow and goat as domestic', hi: 'गाय और बकरी को पालतू के रूप में पहचानता है', mr: 'गाय व शेळी पाळीव प्राणी आहेत हे सांगतो' },
        { en: 'Associates bird with nest', hi: 'पक्षी को घोंसले से जोड़ता है', mr: 'पक्ष्यांचे घर घरटे असते हे सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Which animal gives us milk: cow or lion?', hi: 'हमें दूध कौन सा जानवर देता है: गाय या शेर?', mr: 'आपल्याला दूध कोणता प्राणी देतो: गाय की सिंह?' },
          { en: 'Cow', hi: 'गाय', mr: 'गाय' },
          {
            support: [
              { en: 'Does a cow give milk? Yes / No', hi: 'क्या गाय दूध देती है? हाँ / नहीं', mr: 'गाय दूध देते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name two domestic animals that give us milk.', hi: 'दूध देने वाले दो पालतू जानवरों के नाम बताएं।', mr: 'दूध देणाऱ्या दोन पाळीव प्राण्यांची नावे सांगा.' },
              { en: 'Cow and goat (or buffalo)', hi: 'गाय और बकरी (या भैंस)', mr: 'गाय आणि शेळी (किंवा म्हैस)' },
            ],
          }
        ),
        item(
          { en: 'Draw a bird in its nest.', hi: 'घोंसले में बैठे पक्षी का चित्र बनाएं।', mr: 'घरट्यात बसलेल्या पक्ष्याचे चित्र काढा.' },
          { en: 'Bird in a nest drawing', hi: 'घोंसले में पक्षी का चित्र', mr: 'घरट्यातील पक्ष्याचे चित्र' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Freehand bird in nest drawing accessible to emerging Grade 1 readers across tiers' }
        ),
        item(
          { en: 'Name one wild animal that lives in the jungle.', hi: 'जंगल में रहने वाले एक जंगली जानवर का नाम बताएं।', mr: 'जंगलात राहणाऱ्या एका जंगली प्राण्याचे नाव सांगा.' },
          { en: 'Tiger, lion, bear, deer, elephant', hi: 'बाघ, शेर, भालू, हिरण, हाथी', mr: 'वाघ, सिंह, अस्वल, हरण, हत्ती' },
          {
            support: [
              { en: 'Is a tiger a wild animal? Yes / No', hi: 'क्या बाघ एक जंगली जानवर है? हाँ / नहीं', mr: 'वाघ हा जंगली प्राणी आहे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Why should wild animals live freely in forests instead of cages?', hi: 'जंगली जानवरों को पिंजरों के बजाय जंगलों में स्वतंत्र रूप से क्यों रहना चाहिए?', mr: 'जंगली प्राण्यांनी पिंजऱ्याऐवजी जंगलात मुक्तपणे का राहिले पाहिजे?' },
              { en: 'Forests provide natural food, shelter and space', hi: 'जंगल प्राकृतिक भोजन, आश्रय और खुली जगह प्रदान करते हैं', mr: 'जंगल त्यांना नैसर्गिक अन्न, निवारा आणि मुक्त जागा देते' },
            ],
          }
        ),
      ] }],
    },
    2: {
      outcome: {
        en: 'Classifies animals by where they live: land, water, air, and both land and water.',
        hi: 'जानवरों को उनके रहने के स्थान के आधार पर वर्गीकृत करता है: थल, जल, नभ और उभयचर।',
        mr: 'प्राण्यांचे राहण्याच्या ठिकाणांनुसार वर्गीकरण करतो: भूचर, जलचर, खेचर आणि उभयचर.',
      },
      teacher: {
        title: { en: 'Where do I live?', hi: 'मैं कहाँ रहता हूँ?', mr: 'मी कुठे राहतो?' },
        minutes: 10,
        steps: [
          { en: 'Cards: fish (water), sparrow (air/trees), cow (land), frog (both).', hi: 'कार्ड: मछली (जल), गौरैया (नभ/पेड़), गाय (थल), मेंढक (दोनों)।', mr: 'कार्ड: मासा (पाणी), चिमणी (आकाश/झाड), गाय (जमीन), बेडूक (दोन्ही).' },
          { en: 'Sort into habitats.', hi: 'प्राकृतिक आवासों में छाँटें।', mr: 'अधिवासानुसार वर्गीकरण करा.' },
          { en: 'Discuss how fish breathe in water using gills.', hi: 'चर्चा करें कि मछलियाँ गलफड़ों से पानी में कैसे सांस लेती हैं।', mr: 'मासे कल्ल्यांच्या साहाय्याने पाण्यात श्वास कसा घेतात यावर चर्चा करा.' },
        ],
      },
      independent: {
        title: { en: 'Habitat sorting chart', hi: 'आवास वर्गीकरण चार्ट', mr: 'अधिवास वर्गीकरण तक्ता' },
        instructions: {
          en: 'Write two animals for each: land, water, and both land and water.',
          hi: 'प्रत्येक के लिए दो-दो जानवर लिखें: थल, जल और दोनों।',
          mr: 'प्रत्येकी दोन प्राणी लिहा: जमीन, पाणी आणि दोन्ही ठिकाणी राहणारे.',
        },
        minutes: 10,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Draw a fish swimming in water with fins and gills shown.',
        hi: 'पंखों और गलफड़ों के साथ पानी में तैरती मछली का चित्र बनाएं।',
        mr: 'पर आणि कल्ले दाखवून पाण्यात पोहणाऱ्या माशाचे चित्र काढा.',
      },
      checklist: [
        { en: 'Knows frog lives on land and in water (amphibian)', hi: 'जानता है कि मेंढक जमीन और पानी दोनों में रहता है (उभयचर)', mr: 'बेडूक जमीन आणि पाणी दोन्हीकडे राहतो हे सांगतो' },
        { en: 'Identifies fish cannot breathe out of water', hi: 'पहचानता है कि मछली पानी के बाहर सांस नहीं ले सकती', mr: 'मासा पाण्याबाहेर श्वास घेऊ शकत नाही हे ओळखतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Which animal can live both on land and in water?', hi: 'कौन सा जानवर जमीन और पानी दोनों में रह सकता है?', mr: 'कोणता प्राणी जमीन आणि पाणी दोन्ही ठिकाणी राहू शकतो?' },
          { en: 'Frog, toad, crocodile, turtle', hi: 'मेंढक, मगरमच्छ, कछुआ', mr: 'बेडूक, मगर, कासव' },
          {
            support: [
              { en: 'Can a frog live on land and in water? Yes / No', hi: 'क्या मेंढक जमीन और पानी दोनों में रह सकता है? हाँ / नहीं', mr: 'बेडूक जमीन आणि पाण्यात राहू शकतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What are animals that live on both land and water called?', hi: 'जमीन और पानी दोनों में रहने वाले जानवरों को क्या कहा जाता है?', mr: 'जमीन आणि पाणी या दोन्ही ठिकाणी राहणाऱ्या प्राण्यांना काय म्हणतात?' },
              { en: 'Amphibians', hi: 'उभयचर', mr: 'उभयचर प्राणी' },
            ],
          }
        ),
        item(
          { en: 'How do fish swim in water?', hi: 'मछलियाँ पानी में कैसे तैरती हैं?', mr: 'मासे पाण्यात कसे पोहतात?' },
          { en: 'Using their fins and tail', hi: 'अपने पंखों और पूंछ की मदद से', mr: 'आपल्या परांच्या आणि शेपटीच्या साहाय्याने' },
          {
            support: [
              { en: 'Do fish use fins to swim? Yes / No', hi: 'क्या मछलियाँ तैरने के लिए पंखों का उपयोग करती हैं? हाँ / नहीं', mr: 'मासे पोहण्यासाठी परांचा वापर करतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What body part helps fish take oxygen from water?', hi: 'कौन सा अंग मछलियों को पानी से ऑक्सीजन लेने में मदद करता है?', mr: 'पाण्यातील ऑक्सिजन घेण्यासाठी माशांना कोणता अवयव मदत करतो?' },
              { en: 'Gills', hi: 'गलफड़े', mr: 'कल्ले' },
            ],
          }
        ),
        item(
          { en: 'Name two animals that fly in the air.', hi: 'हवा में उड़ने वाले दो जानवरों के नाम बताएं।', mr: 'आकाशात उडणाऱ्या दोन प्राण्यांची नावे सांगा.' },
          { en: 'Crow, sparrow, pigeon, parrot', hi: 'कौआ, गौरैया, कबूतर, तोता', mr: 'कावळा, चिमणी, कबूतर, पोपट' },
          {
            support: [
              { en: 'Can a pigeon fly? Yes / No', hi: 'क्या कबूतर उड़ सकता है? हाँ / नहीं', mr: 'कबूतर उडू शकते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What features make birds light enough to fly?', hi: 'पक्षियों को उड़ने के लिए हल्का बनाने वाली कौन सी विशेषताएं हैं?', mr: 'पक्ष्यांना उडण्यासाठी हलके बनवणारे कोणते अवयव असतात?' },
              { en: 'Hollow bones and feathers', hi: 'खोखली हड्डियां और पंख', mr: 'पोकळ हाडे आणि पिसे' },
            ],
          }
        ),
      ] }],
    },
    3: {
      outcome: {
        en: 'Groups animals by food habits: herbivores, carnivores, and omnivores.',
        hi: 'खान-पान की आदतों के आधार पर जानवरों को वर्गीकृत करता है: शाकाहारी, मांसाहारी और सर्वाहारी।',
        mr: 'खाण्याच्या सवयींनुसार प्राण्यांचे वर्गीकरण करतो: शाकाहारी, मांसाहारी आणि सर्वभक्षी.',
      },
      teacher: {
        title: { en: 'Who eats what?', hi: 'कौन क्या खाता है?', mr: 'कोण काय खातो?' },
        minutes: 12,
        steps: [
          { en: 'Herbivores eat plants (cow, deer). Carnivores eat meat (lion, snake).', hi: 'शाकाहारी पौधे खाते हैं (गाय, हिरण)। मांसाहारी मांस खाते हैं (शेर, सांप)।', mr: 'शाकाहारी वनस्पती खातात (गाय, हरण). मांसाहारी मांस खातात (सिंह, साप).' },
          { en: 'Omnivores eat both (crow, bear, human).', hi: 'सर्वाहारी दोनों खाते हैं (कौआ, भालू, मनुष्य)।', mr: 'सर्वभक्षी दोन्ही खातात (कावळा, अस्वल, माणूस).' },
          { en: 'Compare teeth: flat grinding teeth vs sharp canine teeth.', hi: 'दांतों की तुलना करें: चपटे पीसने वाले दांत बनाम नुकीले चीरने वाले दांत।', mr: 'दातांची तुलना करा: चावण्याचे चपटे दात विरुद्ध टोकदार सुळे दात.' },
        ],
      },
      independent: {
        title: { en: 'Diet sorting cards', hi: 'आहार वर्गीकरण कार्ड', mr: 'आहार वर्गीकरण तक्ता' },
        instructions: {
          en: 'Place 9 animal cards into three columns: Herbivore, Carnivore, Omnivore.',
          hi: '9 जानवरों के कार्डों को तीन स्तंभों में रखें: शाकाहारी, मांसाहारी, सर्वाहारी।',
          mr: '९ प्राण्यांची कार्डे तीन गटांत ठेवा: शाकाहारी, मांसाहारी, सर्वभक्षी.',
        },
        minutes: 15,
        mode: 'group',
        materials: [{ en: 'animal cards', hi: 'जानवरों के कार्ड', mr: 'प्राण्यांची कार्डे' }, { en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Why do cows chew the cud (regurgitate and chew again)? Write two lines.',
        hi: 'गाय जुगाली क्यों करती है (भोजन वापस लाकर चबाना)? दो पंक्तियाँ लिखें।',
        mr: 'गाय रवंथ का करते? दोन ओळी लिहा.',
      },
      checklist: [
        { en: 'Correctly defines herbivore and carnivore', hi: 'शाकाहारी और मांसाहारी की सही परिभाषा देता है', mr: 'शाकाहारी व मांसाहारी प्राण्यांची अचूक व्याख्या सांगतो' },
        { en: 'Names human or crow as omnivore', hi: 'मनुष्य या कौवे को सर्वाहारी बताता है', mr: 'माणूस किंवा कावळा सर्वभक्षी आहे हे सांगतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'An animal that eats only plants is called a ______.', hi: 'केवल पौधे खाने वाले जानवर को ______ कहते हैं।', mr: 'केवळ वनस्पती खाणाऱ्या प्राण्याला ______ म्हणतात.' },
          { en: 'Herbivore', hi: 'शाकाहारी', mr: 'शाकाहारी प्राणी' },
          {
            support: [
              { en: 'Does a goat eat plants only? Yes / No', hi: 'क्या बकरी केवल पौधे खाती है? हाँ / नहीं', mr: 'शेळी फक्त वनस्पती खाते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Give two examples of herbivores found in our village.', hi: 'हमारे गाँव में पाए जाने वाले शाकाहारी जानवरों के दो उदाहरण दें।', mr: 'आपल्या गावात आढळणाऱ्या दोन शाकाहारी प्राण्यांची उदाहरणे द्या.' },
              { en: 'Cow, goat, sheep, buffalo', hi: 'गाय, बकरी, भेड़, भैंस', mr: 'गाय, शेळी, मेंढी, म्हैस' },
            ],
          }
        ),
        item(
          { en: 'Why do tigers and lions have long, sharp teeth?', hi: 'बाघ और शेर के लंबे, नुकीले दांत क्यों होते हैं?', mr: 'वाघ आणि सिंहाला लांब, टोकदार सुळे दात का असतात?' },
          { en: 'To tear flesh and meat of their prey', hi: 'अपने शिकार के मांस को चीरने-फाड़ने के लिए', mr: 'शिकारीचे मांस फाडण्यासाठी' },
          {
            support: [
              { en: 'Do carnivores have sharp teeth? Yes / No', hi: 'क्या मांसाहारियों के नुकीले दांत होते हैं? हाँ / नहीं', mr: 'मांसाहारी प्राण्यांचे दात टोकदार असतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'How do a cow teeth differ from a tiger teeth?', hi: 'गाय के दांत बाघ के दांतों से कैसे अलग होते हैं?', mr: 'गायीचे दात वाघाच्या दातांपेक्षा कसे वेगळे असतात?' },
              { en: 'Cows have broad flat grinding teeth; tigers have sharp pointed canines', hi: 'गाय के चौड़े चपटे पीसने वाले दांत होते हैं; बाघ के नुकीले चीरने वाले दांत होते हैं', mr: 'गायीला गवत चावण्यासाठी चपटे दात असतात; वाघाला मांस फाडण्यासाठी टोकदार सुळे दात असतात' },
            ],
          }
        ),
        item(
          { en: 'Is a crow a herbivore, carnivore, or omnivore?', hi: 'कौआ शाकाहारी है, मांसाहारी है या सर्वाहारी?', mr: 'कावळा शाकाहारी, मांसाहारी की सर्वभक्षी आहे?' },
          { en: 'Omnivore (eats grains and small insects/meat)', hi: 'सर्वाहारी (अनाज और कीड़े/मांस दोनों खाता है)', mr: 'सर्वभक्षी (धान्य व कीटक/मांस दोन्ही खातो)' },
          {
            support: [
              { en: 'Does a crow eat both grains and insects? Yes / No', hi: 'क्या कौआ अनाज और कीड़े दोनों खाता है? हाँ / नहीं', mr: 'कावळा धान्य आणि कीटक दोन्ही खातो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name one other common omnivore.', hi: 'एक अन्य सामान्य सर्वाहारी प्राणी का नाम बताएं।', mr: 'आणखी एका सर्वभक्षी प्राण्याचे नाव सांगा.' },
              { en: 'Dog, bear, human', hi: 'कुत्ता, भालू, मनुष्य', mr: 'कुत्रा, अस्वल, माणूस' },
            ],
          }
        ),
      ] }],
    },
    4: {
      outcome: {
        en: 'Understands animal adaptations and senses (bats in dark, eagle sharp vision, dogs sense of smell).',
        hi: 'जानवरों के अनुकूलन और इंद्रियों को समझता है (चमगादड़, चील की दृष्टि, कुत्ते की सूंघने की शक्ति)।',
        mr: 'प्राण्यांचे अनुकूलन व ज्ञानेंद्रिये समजून घेतो (वटवाघूळ, गरुडाची नजर, कुत्र्याची घ्राणेंद्रिय शक्ती).',
      },
      teacher: {
        title: { en: 'Super senses of animals', hi: 'जानवरों की अनोखी इंद्रियां', mr: 'प्राण्यांची अद्भुत ज्ञानेंद्रिये' },
        minutes: 12,
        steps: [
          { en: 'Dogs hear high pitches and smell 10,000 times better than humans.', hi: 'कुत्ते उच्च ध्वनि सुनते हैं और इंसानों से 10,000 गुना बेहतर सूंघते हैं।', mr: 'कुत्रे माणसांपेक्षा १०,००० पट तीव्रतेने वास ओळखतात आणि सूक्ष्म आवाज ऐकतात.' },
          { en: 'Eagles spot a rat from 2 km high.', hi: 'चील 2 किमी की ऊंचाई से भी चूहे को देख लेती है।', mr: 'गरुड २ किमी उंचीवरूनही जमिनीवरील उंदीर पाहू शकतो.' },
          { en: 'Ants leave scent trails (pheromones) so others follow in a line.', hi: 'चींटियाँ गंध छोड़ती हैं ताकि अन्य चींटियाँ कतार में चल सकें।', mr: 'मुंग्या वासाचा माग सोडतात जेणेकरून इतर मुंग्या रांगेत चालू शकतील.' },
        ],
      },
      independent: {
        title: { en: 'Super senses report', hi: 'अनोखी इंद्रियों की रिपोर्ट', mr: 'अद्भुत ज्ञानेंद्रिये नोंद' },
        instructions: {
          en: 'Choose one animal and write 3 facts about its special senses.',
          hi: 'एक जानवर चुनें और उसकी विशेष इंद्रियों के बारे में 3 तथ्य लिखें।',
          mr: 'एका प्राण्याची निवड करा आणि त्याच्या विशेष ज्ञानेंद्रियांबद्दल ३ माहितीपूर्ण वाक्ये लिहा.',
        },
        minutes: 15,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Explain how bats navigate in pitch darkness using sound echoes.',
        hi: 'समझाएं कि चमगादड़ ध्वनि प्रतिध्वनि का उपयोग करके घने अंधेरे में कैसे रास्ता खोजते हैं।',
        mr: 'वटवाघळे अंधारात आवाजाच्या प्रतिध्वनीचा वापर करून दिशा कशी शोधतात ते सांगा.',
      },
      checklist: [
        { en: 'Names an animal with extraordinary smell (dog, ant)', hi: 'तीव्र गंध वाले जानवर का नाम बताता है (कुत्ता, चींटी)', mr: 'अद्भुत वास ओळखणाऱ्या प्राण्याचे नाव सांगतो (कुत्रा, मुंगी)' },
        { en: 'Explains why keen senses are vital for survival', hi: 'समझाता है कि जीवित रहने के लिए तीव्र इंद्रियां क्यों महत्वपूर्ण हैं', mr: 'जगण्यासाठी तीव्र ज्ञानेंद्रिये का महत्त्वाची आहेत हे स्पष्ट करतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Why do ants always walk in a neat line?', hi: 'चींटियाँ हमेशा एक सीधी कतार में क्यों चलती हैं?', mr: 'मुंग्या नेहमी एका सरळ रांगेत का चालतात?' },
          { en: 'They follow a scent trail left by the leader ant', hi: 'वे आगे वाली चींटी द्वारा छोड़े गए गंध के निशान का पीछा करती हैं', mr: 'त्या पुढे चालणाऱ्या मुंगीने सोडलेल्या वासाचा माग काढतात' },
          {
            support: [
              { en: 'Do ants follow a scent trail? Yes / No', hi: 'क्या चींटियाँ गंध का पीछा करती हैं? हाँ / नहीं', mr: 'मुंग्या वासाचा माग काढतात का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What are the chemical scent signals used by ants called?', hi: 'चींटियों द्वारा छोड़े जाने वाले रासायनिक गंध संकेतों को क्या कहा जाता है?', mr: 'मुंग्या एकमेकींना संदेश देण्यासाठी सोडत असलेल्या रासायनिक वासाला काय म्हणतात?' },
              { en: 'Pheromones', hi: 'फेरोमोन (Pheromones)', mr: 'फेरोमोन्स (गंधद्रव्य)' },
            ],
          }
        ),
        item(
          { en: 'Which bird can see four times farther than humans?', hi: 'कौन सा पक्षी इंसानों से चार गुना दूर तक देख सकता है?', mr: 'कोणता पक्षी माणसांपेक्षा चार पट लांबचे पाहू शकतो?' },
          { en: 'Eagle, hawk, kite, vulture', hi: 'चील, बाज, गिद्ध', mr: 'गरुड, घार, ससाणा, गिधाड' },
          {
            support: [
              { en: 'Can an eagle see far away? Yes / No', hi: 'क्या चील बहुत दूर तक देख सकती है? हाँ / नहीं', mr: 'गरुड खूप लांबचे पाहू शकतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Why is sharp eyesight crucial for birds of prey?', hi: 'शिकारी पक्षियों के लिए तेज दृष्टि क्यों महत्वपूर्ण है?', mr: 'शिकारी पक्ष्यांसाठी तीक्ष्ण दृष्टी असणे का गरजेचे आहे?' },
              { en: 'To spot small moving prey on the ground from high in the sky', hi: 'आसमान की ऊंचाई से जमीन पर छोटे चलते शिकार को पहचानने के लिए', mr: 'आकाशातून उंचावरून जमिनीवरील लहान भक्ष्य शोधण्यासाठी' },
            ],
          }
        ),
        item(
          { en: 'Why do police use dogs to track criminals and lost people?', hi: 'पुलिस अपराधियों और लापता लोगों को खोजने के लिए कुत्तों का उपयोग क्यों करती है?', mr: 'गुन्हेगार किंवा हरवलेली व्यक्ती शोधण्यासाठी पोलीस कुत्र्यांचा वापर का करतात?' },
          { en: 'Because dogs have an extraordinarily powerful sense of smell', hi: 'क्योंकि कुत्तों में सूंघने की अद्भुत शक्ति होती है', mr: 'कारण कुत्र्यांची वास ओळखण्याची क्षमता अतिशय तीव्र असते' },
          {
            support: [
              { en: 'Do dogs have a keen sense of smell? Yes / No', hi: 'क्या कुत्तों की सूंघने की शक्ति तेज होती है? हाँ / नहीं', mr: 'कुत्र्यांची घ्राणशक्ती तीव्र असते का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Explain how a dog sense of smell compares to a human.', hi: 'समझाएं कि कुत्ते की सूंघने की शक्ति मनुष्य से कितनी बेहतर होती है।', mr: 'कुत्र्याची वास घेण्याची शक्ती माणसापेक्षा किती पट जास्त असते ते स्पष्ट करा.' },
              { en: 'Dogs have up to 300 million olfactory receptors compared to 6 million in humans', hi: 'कुत्तों में 30 करोड़ घ्राण रिसेप्टर्स होते हैं जबकि मनुष्यों में केवल 60 लाख', mr: 'कुत्र्यांच्या नाकात ३० कोटी गंध पेशी असतात तर माणसांत केवळ ६० लाख असतात' },
            ],
          }
        ),
      ] }],
    },
    5: {
      outcome: {
        en: 'Analyzes wildlife conservation, national parks, and prevention of poaching/endangerment.',
        hi: 'वन्यजीव संरक्षण, राष्ट्रीय उद्यानों और शिकार की रोकथाम का विश्लेषण करता है।',
        mr: 'वन्यजीव संवर्धन, राष्ट्रीय उद्याने आणि शिकारीस प्रतिबंध यांविषयी चर्चा करतो.',
      },
      teacher: {
        title: { en: 'Save our tigers and wildlife', hi: 'बाघ और वन्यजीवों को बचाएं', mr: 'वाघ व वन्यजीव वाचवा' },
        minutes: 12,
        steps: [
          { en: 'Discuss Project Tiger and Tadoba / Jim Corbett National Parks.', hi: 'प्रोजेक्ट टाइगर और ताडोबा / जिम कॉर्बेट राष्ट्रीय उद्यानों पर चर्चा करें।', mr: 'प्रोजेक्ट टायगर आणि ताडोबा / जिम कॉर्बेट राष्ट्रीय उद्यानांवर चर्चा करा.' },
          { en: 'Why are tigers endangered? Hunting, deforestation, habitat loss.', hi: 'बाघ संकटग्रस्त क्यों हैं? शिकार, वनों की कटाई, आवास का नुकसान।', mr: 'वाघ धोक्यात का आले आहेत? शिकार, जंगलतोड आणि अधिवास नष्ट झाल्यामुळे.' },
          { en: 'Biodiversity keeps ecosystems balanced and healthy.', hi: 'जैव विविधता पारिस्थितिकी तंत्र को संतुलित और स्वस्थ रखती है।', mr: 'जैवविविधतेमुळे पर्यावरण समतोल व निरोगी राहते.' },
        ],
      },
      independent: {
        title: { en: 'Conservation pledge', hi: 'वन्यजीव संरक्षण संकल्प', mr: 'वन्यजीव संवर्धन प्रतिज्ञा' },
        instructions: {
          en: 'Write 4 reasons why cutting forests destroys wildlife habitats.',
          hi: '4 कारण लिखें कि वनों की कटाई से वन्यजीवों के आवास कैसे नष्ट होते हैं।',
          mr: 'जंगलतोडीमुळे वन्यजीवांचे अधिवास कसे नष्ट होतात याची ४ कारणे लिहा.',
        },
        minutes: 20,
        mode: 'solo',
        materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
      },
      mapping: defaultMapping('EVS / Parisar Abhyas'),
      earlyFinisher: {
        en: 'Design a campaign poster titled "Save the Tiger / Save the Forest".',
        hi: '"बाघ बचाओ / जंगल बचाओ" शीर्षक से एक अभियान पोस्टर बनाएं।',
        mr: '"वाघ वाचवा / जंगल वाचवा" या विषयावर एक घोषवाक्य पोस्टर तयार करा.',
      },
      checklist: [
        { en: 'Understands term endangered species', hi: 'संकटग्रस्त प्रजातियों का अर्थ समझता है', mr: 'दुर्मिळ व धोक्यात आलेल्या प्रजाती हा शब्द समजतो' },
        { en: 'Connects forest conservation to animal survival', hi: 'वन संरक्षण को जानवरों के अस्तित्व से जोड़ता है', mr: 'जंगल संवर्धनाचा प्राण्यांच्या जगण्याशी संबंध जोडतो' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Why is the tiger an endangered animal in India?', hi: 'भारत में बाघ एक संकटग्रस्त जानवर क्यों है?', mr: 'भारतात वाघ हा संकटग्रस्त प्राणी का बनला आहे?' },
          { en: 'Due to poaching for skin/bones and loss of natural forest habitat', hi: 'खाल और हड्डियों के अवैध शिकार तथा वनों के कटने के कारण', mr: 'कातडी व हाडांसाठी होणारी शिकार आणि जंगलांचा ऱ्हास यामुळे' },
          {
            support: [
              { en: 'Are tiger numbers in danger? Yes / No', hi: 'क्या बाघों की संख्या खतरे में है? हाँ / नहीं', mr: 'वाघांची संख्या धोक्यात आहे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'What government initiative was launched in India in 1973 to save tigers?', hi: 'बाघों को बचाने के लिए भारत में 1973 में कौन सी सरकारी योजना शुरू की गई थी?', mr: 'वाघांच्या संरक्षणासाठी भारतात १९७३ मध्ये कोणता शासकीय प्रकल्प सुरू झाला?' },
              { en: 'Project Tiger', hi: 'प्रोजेक्ट टाइगर (Project Tiger)', mr: 'प्रोजेक्ट टायगर (व्याघ्र प्रकल्प)' },
            ],
          }
        ),
        item(
          { en: 'What is a National Park or Wildlife Sanctuary?', hi: 'राष्ट्रीय उद्यान या वन्यजीव अभयारण्य क्या है?', mr: 'राष्ट्रीय उद्यान किंवा वन्यजीव अभयारण्य म्हणजे काय?' },
          { en: 'A protected forest area where wildlife is conserved and hunting is banned', hi: 'एक संरक्षित वन क्षेत्र जहाँ वन्यजीवों की रक्षा की जाती है और शिकार प्रतिबंधित है', mr: 'संरक्षित जंगल क्षेत्र जेथे वन्यजीवांचे रक्षण केले जाते आणि शिकारीस बंदी असते' },
          {
            support: [
              { en: 'Is hunting allowed in national parks? Yes / No', hi: 'क्या राष्ट्रीय उद्यानों में शिकार की अनुमति है? हाँ / नहीं', mr: 'राष्ट्रीय उद्यानात शिकारीस परवानगी असते का? होय / नाही' },
              { en: 'No', hi: 'नहीं', mr: 'नाही' },
            ],
            stretch: [
              { en: 'Name one famous national park in Maharashtra or India.', hi: 'महाराष्ट्र या भारत के एक प्रसिद्ध राष्ट्रीय उद्यान का नाम बताएं।', mr: 'महाराष्ट्र किंवा भारतातील एका प्रसिद्ध राष्ट्रीय उद्यानाचे नाव सांगा.' },
              { en: 'Tadoba (Maharashtra) or Kaziranga (Assam) or Corbett (Uttarakhand)', hi: 'ताडोबा (महाराष्ट्र) या काजीरंगा (असम) या जिम कॉर्बेट (उत्तराखंड)', mr: 'ताडोबा (महाराष्ट्र) किंवा काझीरंगा (आसाम) किंवा कॉर्बेट (उत्तराखंड)' },
            ],
          }
        ),
        item(
          { en: 'Why does protecting the top predator (tiger) save the whole forest?', hi: 'शीर्ष शिकारी (बाघ) की रक्षा करने से पूरा जंगल कैसे बचता है?', mr: 'सर्वोच्च भक्षक (वाघ) वाचवल्याने संपूर्ण जंगल कसे वाचते?' },
          { en: 'Tigers control herbivore populations, preventing overgrazing and preserving vegetation and water sources', hi: 'बाघ शाकाहारियों की संख्या नियंत्रित करते हैं, जिससे अत्यधिक चराई रुकती है और जंगल व जल स्रोत सुरक्षित रहते हैं', mr: 'वाघ शाकाहारी प्राण्यांच्या संख्येवर नियंत्रण ठेवतात, ज्यामुळे वनस्पती व जलस्रोत सुरक्षित राहतात' },
          {
            support: [
              { en: 'Does the tiger protect the balance of the forest? Yes / No', hi: 'क्या बाघ जंगल के संतुलन की रक्षा करता है? हाँ / नहीं', mr: 'वाघ जंगलाचा समतोल राखण्यास मदत करतो का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Explain the ecological concept of an apex or keystone species.', hi: 'पारिस्थितिकी में शीर्ष शिकारी या कीस्टोन प्रजाति की अवधारणा समझाएं।', mr: 'पर्यावरणशास्त्रातील कीस्टोन प्रजाती ही संकल्पना स्पष्ट करा.' },
              { en: 'A top predator that stabilizes the entire food web; removing it causes ecosystem collapse', hi: 'एक शीर्ष शिकारी जो पूरे खाद्य जाल को स्थिर रखता है; उसे हटाने से पूरा तंत्र नष्ट हो जाता है', mr: 'अन्नसाखळी संतुलित ठेवणारी प्रमुख प्रजाती; ती नष्ट झाल्यास संपूर्ण परिसंस्था कोलमडते' },
            ],
          }
        ),
      ] }],
    },
  },
};

// ─────────────────────────────────────────────────────────────
// MARATHI LANGUAGE (lang-marathi) – STUB TOPIC (v1.0)
// Subject area: 'lang' – Marathi reading/writing as a curriculum subject.
// All hi/mr strings: reviewed: false — needs native-speaker teacher review.
// NOTE: This is a teaching-subject stub. Full reading-passage content
// (text comprehension, grammar exercises) is deferred to v1.1 per the
// project scope decision. See docs/REPORT.md §9.2 and README.md §Scope.
// ─────────────────────────────────────────────────────────────
const marathiLang: Topic = {
  id: 'lang-marathi',
  subject: 'lang',
  title: {
    en: 'Marathi Letters & Words (Language)',
    hi: 'मराठी अक्षरे और शब्द (भाषा)',
    mr: 'मराठी अक्षरे व शब्द (भाषा)',
  },
  theme: {
    en: 'Reading and writing in Marathi',
    hi: 'मराठी में पढ़ना और लिखना',  // reviewed: false
    mr: 'मराठीत वाचणे आणि लिहिणे',   // reviewed: false
  },
  hook: {
    en: 'Write a simple Marathi word on the board (e.g. आई). Ask each grade to read it, say its meaning, and use it in a sentence at their own level.',
    hi: 'एक सरल मराठी शब्द बोर्ड पर लिखें (जैसे आई)। हर कक्षा को उसे पढ़ने, अर्थ बताने और अपने स्तर पर वाक्य बनाने को कहें।',  // reviewed: false
    mr: 'फळ्यावर एक सोपा मराठी शब्द लिहा (उदा. आई). प्रत्येक इयत्तेला तो वाचायला, अर्थ सांगायला आणि त्यांच्या पातळीवर वाक्य बनवायला सांगा.', // reviewed: false
  },
  mapping: 'TO RESEARCH — Balbharati Marathi Language textbooks (Sulabhbharati / Kumarbharati) chapters not yet verified against physical copies.',
  reviewed: { en: true, hi: false, mr: false },
  grades: {
    1: {
      outcome: {
        en: 'Identifies and traces 5 Marathi vowels (स्वर): अ, आ, इ, ई, उ; reads simple 2-letter words.',
        hi: '5 मराठी स्वर (अ, आ, इ, ई, उ) पहचानता और लिखता है; 2 अक्षर के सरल शब्द पढ़ता है।',  // reviewed: false
        mr: '५ मराठी स्वर (अ, आ, इ, ई, उ) ओळखतो व काढतो; साध्या दोन-अक्षरी शब्द वाचतो.',        // reviewed: false
      },
      teacher: {
        title: { en: 'Vowel recognition: अ to उ', hi: 'स्वर पहचान: अ से उ', mr: 'स्वर ओळख: अ ते उ' },
        minutes: 8,
        steps: [
          { en: 'Write each vowel large on the board: अ आ इ ई उ.', hi: 'बोर्ड पर प्रत्येक स्वर बड़े अक्षर में लिखें: अ आ इ ई उ।', mr: 'फळ्यावर प्रत्येक स्वर मोठ्या आकारात लिहा: अ आ इ ई उ.' },
          { en: 'Say each vowel aloud; students repeat and trace in the air.', hi: 'प्रत्येक स्वर जोर से बोलें; विद्यार्थी दोहराएं और हवा में लिखें।', mr: 'प्रत्येक स्वर मोठ्याने म्हणा; विद्यार्थ्यांनी पुनरावृत्ती करून हवेत काढा.' },
          { en: 'Show a picture for each: आई (mother), इमली (tamarind), उंट (camel).', hi: 'हर स्वर के लिए एक चित्र दिखाएं: आई, इमली, उंट।', mr: 'प्रत्येक स्वरासाठी चित्र दाखवा: आई, इमली, उंट.' },
        ],
      },
      independent: {
        title: { en: 'Trace and match vowels', hi: 'स्वर का अनुसरण करें और मिलाएं', mr: 'स्वर काढा आणि जुळवा' },
        instructions: {
          en: 'Trace each vowel letter. Draw a line from the vowel to its matching picture.',
          hi: 'हर स्वर को ट्रेस करें। स्वर से उसके चित्र तक रेखा खींचें।',         // reviewed: false
          mr: 'प्रत्येक स्वर काढा. स्वराशी जुळणाऱ्या चित्राला रेषेने जोडा.',        // reviewed: false
        },
        minutes: 8,
        mode: 'solo',
        materials: [
          { en: 'printed vowel trace sheet', hi: 'स्वर ट्रेस शीट', mr: 'स्वर काढण्याची पत्रिका' },
          { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' },
        ],
      },
      mapping: defaultMapping('Marathi Language (Sulabhbharati Grade 1)'),
      earlyFinisher: {
        en: 'Write each vowel 3 times and draw one picture for it.',
        hi: 'प्रत्येक स्वर 3 बार लिखें और उसके लिए एक चित्र बनाएं।',  // reviewed: false
        mr: 'प्रत्येक स्वर ३ वेळा लिहा आणि त्यासाठी एक चित्र काढा.',  // reviewed: false
      },
      checklist: [
        { en: 'Can the student identify all 5 vowels when pointed to randomly?', hi: 'क्या बच्चा बेतरतीब ढंग से दिखाए जाने पर 5 स्वर पहचान सकता है?', mr: 'कोणताही स्वर दाखवला तर विद्यार्थी ओळखतो का?' },
        { en: 'Can the student trace the vowels legibly?', hi: 'क्या बच्चा स्वरों को सुपाठ्य तरीके से लिख सकता है?', mr: 'विद्यार्थी स्वर स्पष्टपणे काढतो का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Which letter comes after अ? ______', hi: 'अ के बाद कौन सा अक्षर आता है? ______', mr: 'अ नंतर कोणते अक्षर येते? ______' },
          { en: 'आ', hi: 'आ', mr: 'आ' },
          {
            support: [
              { en: 'Circle the correct letter: अ or आ comes first?', hi: 'सही अक्षर पर गोला लगाएं: अ या आ पहले आता है?', mr: 'बरोबर अक्षरावर गोल करा: अ की आ आधी येते?' },
              { en: 'अ', hi: 'अ', mr: 'अ' },
            ],
            stretch: [
              { en: 'Write the 5 vowels in order: __, __, __, __, __', hi: '5 स्वर क्रम से लिखें: __, __, __, __, __', mr: '५ स्वर क्रमाने लिहा: __, __, __, __, __' },
              { en: 'अ, आ, इ, ई, उ', hi: 'अ, आ, इ, ई, उ', mr: 'अ, आ, इ, ई, उ' },
            ],
          }
        ),
        item(
          { en: 'Draw what आई means.', hi: 'आई का अर्थ चित्र में दिखाएं।', mr: 'आई म्हणजे काय ते चित्र काढा.' },
          { en: 'Mother / आई', hi: 'माँ / आई', mr: 'आई' },
          { kind: 'draw', sameAcrossTiers: true, sameReason: 'Visual drawing task equally accessible to all Grade 1 tiers; tests vocabulary recall, not writing skill.' }
        ),
        item(
          { en: 'Which of these is a vowel (स्वर): क or इ?', hi: 'इनमें से स्वर कौन सा है: क या इ?', mr: 'यापैकी स्वर कोणता: क की इ?' },
          { en: 'इ', hi: 'इ', mr: 'इ' },
          {
            support: [
              { en: 'Is इ a vowel? Yes / No', hi: 'क्या इ एक स्वर है? हाँ / नहीं', mr: 'इ हा स्वर आहे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Write 3 words that start with a vowel.', hi: '3 ऐसे शब्द लिखें जो स्वर से शुरू हों।', mr: 'स्वराने सुरू होणारे ३ शब्द लिहा.' },
              { en: 'आम, इमली, उंट (or any correct answers)', hi: 'आम, इमली, उंट (या कोई सही उत्तर)', mr: 'आंबा, इमली, उंट (किंवा कोणतेही बरोबर उत्तर)' },
            ],
          }
        ),
      ] }],
    },
    2: {
      outcome: {
        en: 'Reads and writes simple 2-3 letter Marathi words (काका, माला, घर, पाणी); matches word to picture.',
        hi: '2-3 अक्षरों के सरल मराठी शब्द पढ़ता और लिखता है (काका, माला, घर, पाणी); शब्द को चित्र से मिलाता है।', // reviewed: false
        mr: 'सोपे २-३ अक्षरी मराठी शब्द वाचतो व लिहितो (काका, माला, घर, पाणी); शब्द चित्राशी जुळवतो.',                // reviewed: false
      },
      teacher: {
        title: { en: 'Word wall: family and home words', hi: 'शब्द दीवार: परिवार और घर के शब्द', mr: 'शब्दभित्ती: कुटुंब आणि घर शब्द' },
        minutes: 10,
        steps: [
          { en: 'Write on board: आई, बाबा, काका, घर, पाणी, दूध.', hi: 'बोर्ड पर लिखें: आई, बाबा, काका, घर, पाणी, दूध।', mr: 'फळ्यावर लिहा: आई, बाबा, काका, घर, पाणी, दूध.' },
          { en: 'Point to each word; students read aloud in chorus.', hi: 'प्रत्येक शब्द की ओर इंगित करें; विद्यार्थी मिलकर पढ़ें।', mr: 'प्रत्येक शब्दाकडे बोट दाखवा; विद्यार्थी एकत्र मोठ्याने वाचतात.' },
          { en: 'Show matching picture cards; students call out the word.', hi: 'मिलते-जुलते चित्र कार्ड दिखाएं; विद्यार्थी शब्द बोलें।', mr: 'जुळणारी चित्रकार्डे दाखवा; विद्यार्थी शब्द सांगतात.' },
        ],
      },
      independent: {
        title: { en: 'Write and match: family words', hi: 'लिखो और मिलाओ: परिवार शब्द', mr: 'लिहा आणि जुळवा: कुटुंब शब्द' },
        instructions: {
          en: 'Copy the words from the board into your notebook. Draw a line to the matching picture.',
          hi: 'बोर्ड से शब्द कॉपी में लिखें। चित्र से रेखा खींचकर मिलाएं।',        // reviewed: false
          mr: 'फळ्यावरील शब्द वहीत लिहा. चित्राशी रेषेने जुळवा.',                  // reviewed: false
        },
        minutes: 10,
        mode: 'solo',
        materials: [
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
          { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' },
          { en: 'picture word cards', hi: 'चित्र शब्द कार्ड', mr: 'चित्र शब्द कार्डे' },
        ],
      },
      mapping: defaultMapping('Marathi Language (Sulabhbharati Grade 2)'),
      earlyFinisher: {
        en: 'Write 3 more words for things you see at home.',
        hi: 'घर में दिखने वाली 3 और चीजों के मराठी शब्द लिखें।',  // reviewed: false
        mr: 'घरी दिसणाऱ्या आणखी ३ वस्तूंचे मराठी शब्द लिहा.',    // reviewed: false
      },
      checklist: [
        { en: 'Can the student read each word card without sounding out every letter?', hi: 'क्या बच्चा हर अक्षर बिना बोले शब्द पढ़ सकता है?', mr: 'प्रत्येक अक्षर न मोजता विद्यार्थी शब्दकार्ड वाचतो का?' },
        { en: 'Can the student copy the words with correct letter forms?', hi: 'क्या बच्चा शब्दों को सही अक्षर रूप में लिख सकता है?', mr: 'बरोबर अक्षरांसह शब्द लिहितो का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Write the Marathi word for "water": ______', hi: '"पानी" के लिए मराठी शब्द लिखें: ______', mr: '"पाणी" हा शब्द वहीत लिहा: ______' },
          { en: 'पाणी', hi: 'पाणी', mr: 'पाणी' },
          {
            support: [
              { en: 'Circle the correct word for water: पाणी / दूध', hi: '"पानी" के लिए सही शब्द पर गोला लगाएं: पाणी / दूध', mr: 'पाण्यासाठी बरोबर शब्दावर गोल करा: पाणी / दूध' },
              { en: 'पाणी', hi: 'पाणी', mr: 'पाणी' },
            ],
            stretch: [
              { en: 'Write a sentence using the word पाणी.', hi: 'पाणी शब्द का उपयोग करके एक वाक्य लिखें।', mr: 'पाणी हा शब्द वापरून एक वाक्य लिहा.' },
              { en: 'Any correct sentence using पाणी', hi: 'पाणी शब्द का उपयोग करने वाला कोई भी वाक्य', mr: 'पाणी शब्द असलेले कोणतेही बरोबर वाक्य' },
            ],
          }
        ),
        item(
          { en: 'Match: आई = ______', hi: 'मिलाएं: आई = ______', mr: 'जुळवा: आई = ______' },
          { en: 'Mother', hi: 'माँ', mr: 'आई (माता)' },
          {
            support: [
              { en: 'आई means: Sister / Mother (circle one)', hi: 'आई का मतलब: बहन / माँ (एक पर गोला लगाएं)', mr: 'आई म्हणजे: बहीण / माता (एकावर गोल करा)' },
              { en: 'Mother / माँ / माता', hi: 'माँ', mr: 'माता' },
            ],
            stretch: [
              { en: 'Write all 6 family words from the board and their English meaning.', hi: 'बोर्ड से सभी 6 परिवार शब्द और उनके हिंदी अर्थ लिखें।', mr: 'फळ्यावरील सर्व ६ कुटुंब शब्द आणि त्यांचा इंग्रजी अर्थ लिहा.' },
              { en: 'आई–mother, बाबा–father, काका–uncle, घर–home, पाणी–water, दूध–milk', hi: 'आई–माँ, बाबा–पिता, काका–चाचा, घर–घर, पाणी–पानी, दूध–दूध', mr: 'आई–mother, बाबा–father, काका–uncle, घर–home, पाणी–water, दूध–milk' },
            ],
          }
        ),
        item(
          { en: 'How many letters are in the word घर?', hi: '"घर" शब्द में कितने अक्षर हैं?', mr: '"घर" या शब्दात किती अक्षरे आहेत?' },
          { en: '2', hi: '2', mr: '2' },
          {
            support: [
              { en: 'Count the letters in घर: _ _ (write the count)', hi: 'घर के अक्षर गिनें: _ _ (संख्या लिखें)', mr: 'घर मधील अक्षरे मोजा: _ _ (संख्या लिहा)' },
              { en: '2', hi: '2', mr: '2' },
            ],
            stretch: [
              { en: 'Write one 2-letter word and one 3-letter word in Marathi.', hi: 'मराठी में एक 2-अक्षरी और एक 3-अक्षरी शब्द लिखें।', mr: 'मराठीत एक २-अक्षरी आणि एक ३-अक्षरी शब्द लिहा.' },
              { en: 'E.g. घर (2), पाणी (4) or any correct answer', hi: 'जैसे घर (2), पाणी (4) या कोई सही उत्तर', mr: 'उदा. घर (2), पाणी (4) किंवा कोणतेही बरोबर उत्तर' },
            ],
          }
        ),
      ] }],
    },
    3: {
      outcome: {
        en: 'Reads a 4-6 word Marathi sentence aloud; fills in a missing word from context; copies the sentence.',
        hi: '4-6 शब्दों का मराठी वाक्य जोर से पढ़ता है; संदर्भ से लुप्त शब्द भरता है; वाक्य नकल करता है।', // reviewed: false
        mr: '४-६ शब्दांचे मराठी वाक्य मोठ्याने वाचतो; रिकाम्या जागी बरोबर शब्द घालतो; वाक्य उतरवतो.',   // reviewed: false
      },
      teacher: {
        title: { en: 'Sentence reading: fill the gap', hi: 'वाक्य पठन: रिक्त स्थान भरें', mr: 'वाक्य वाचन: रिकामी जागा भरा' },
        minutes: 12,
        steps: [
          { en: 'Write on board: "माझ्या घरी एक ______ आहे." (कुत्रा / मांजर / गाय)', hi: 'बोर्ड पर लिखें: "माझ्या घरी एक ______ आहे." (कुत्रा / मांजर / गाय)', mr: 'फळ्यावर लिहा: "माझ्या घरी एक ______ आहे." (कुत्रा / मांजर / गाय)' },
          { en: 'Read the sentence together; call students to fill the blank with their animal.', hi: 'वाक्य एक साथ पढ़ें; विद्यार्थियों को अपने पशु से रिक्त स्थान भरने को कहें।', mr: 'वाक्य एकत्र वाचा; विद्यार्थ्यांना त्यांच्या प्राण्याने रिकामी जागा भरायला सांगा.' },
          { en: 'Discuss: what other words could fit?', hi: 'चर्चा करें: और कौन से शब्द फिट हो सकते हैं?', mr: 'चर्चा करा: इतर कोणते शब्द येऊ शकतात?' },
        ],
      },
      independent: {
        title: { en: 'Fill the missing word', hi: 'रिक्त शब्द भरें', mr: 'रिकामी जागा भरा' },
        instructions: {
          en: 'Read each sentence. Fill in the missing word from the word box.',
          hi: 'प्रत्येक वाक्य पढ़ें। शब्द बॉक्स से लुप्त शब्द भरें।',  // reviewed: false
          mr: 'प्रत्येक वाक्य वाचा. शब्दपेटीतून रिकामी जागा भरा.',    // reviewed: false
        },
        minutes: 15,
        mode: 'solo',
        materials: [
          { en: 'worksheet with 4 fill-in-the-blank sentences', hi: 'रिक्त स्थान भरने की वर्कशीट', mr: 'रिकामी जागा भरण्याची कार्यपत्रिका' },
          { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' },
        ],
      },
      mapping: defaultMapping('Marathi Language (Sulabhbharati Grade 3)'),
      earlyFinisher: {
        en: 'Write 2 more sentences using words from the word box.',
        hi: 'शब्द बॉक्स के शब्दों से 2 और वाक्य लिखें।',  // reviewed: false
        mr: 'शब्दपेटीतील शब्द वापरून आणखी २ वाक्ये लिहा.', // reviewed: false
      },
      checklist: [
        { en: 'Can the student read the sentence fluently (without stopping at each word)?', hi: 'क्या बच्चा वाक्य धाराप्रवाह पढ़ सकता है?', mr: 'विद्यार्थी अडखळल्याशिवाय वाक्य वाचतो का?' },
        { en: 'Does the student choose a contextually correct missing word?', hi: 'क्या बच्चा संदर्भ के अनुसार सही शब्द चुनता है?', mr: 'विद्यार्थी संदर्भानुसार बरोबर शब्द निवडतो का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Fill in the blank: "माझे नाव ______ आहे."', hi: 'रिक्त स्थान भरें: "माझे नाव ______ आहे."', mr: 'रिकामी जागा भरा: "माझे नाव ______ आहे."' },
          { en: 'Student writes their own name (any correct answer)', hi: 'विद्यार्थी अपना नाम लिखे (कोई भी सही उत्तर)', mr: 'विद्यार्थी स्वतःचे नाव लिहेल (कोणतेही बरोबर उत्तर)' },
          {
            support: [
              { en: 'My name starts with which letter? Write it: ______', hi: 'मेरे नाम का पहला अक्षर कौन सा है? लिखें: ______', mr: 'माझ्या नावाचे पहिले अक्षर कोणते? लिहा: ______' },
              { en: 'Student writes the first letter of their name', hi: 'विद्यार्थी अपने नाम का पहला अक्षर लिखे', mr: 'विद्यार्थी स्वतःच्या नावाचे पहिले अक्षर लिहेल' },
            ],
            stretch: [
              { en: 'Write a full sentence: "माझे नाव ______ आहे. मी ______ गावात राहतो/राहते."', hi: 'पूरा वाक्य लिखें: "माझे नाव ______ आहे. मी ______ गावात राहतो/राहते."', mr: 'पूर्ण वाक्ये लिहा: "माझे नाव ______ आहे. मी ______ गावात राहतो/राहते."' },
              { en: 'Student writes two sentences with their name and village', hi: 'विद्यार्थी अपना नाम और गाँव लिखकर दो वाक्य लिखे', mr: 'विद्यार्थी नाव व गाव वापरून दोन वाक्ये लिहेल' },
            ],
          }
        ),
        item(
          { en: 'Fill in the blank: "आकाश ______ आहे." (निळे / लाल / हिरवे)', hi: 'रिक्त स्थान भरें: "आकाश ______ आहे." (निळे / लाल / हिरवे)', mr: 'रिकामी जागा भरा: "आकाश ______ आहे." (निळे / लाल / हिरवे)' },
          { en: 'निळे (blue)', hi: 'निळे (नीला)', mr: 'निळे' },
          {
            support: [
              { en: 'The sky is: निळे / लाल? Circle the correct word.', hi: 'आकाश: निळे / लाल? सही शब्द पर गोला लगाएं।', mr: 'आकाश: निळे / लाल? बरोबर शब्दावर गोल करा.' },
              { en: 'निळे', hi: 'निळे', mr: 'निळे' },
            ],
            stretch: [
              { en: 'Write a sentence about the colour of the grass.', hi: 'घास के रंग के बारे में एक वाक्य लिखें।', mr: 'गवताच्या रंगाबद्दल एक वाक्य लिहा.' },
              { en: 'गवत हिरवे असते. (Grass is green.)', hi: 'गवत हिरवे असते।', mr: 'गवत हिरवे असते.' },
            ],
          }
        ),
        item(
          { en: 'Copy this sentence: "सूर्य पूर्वेला उगवतो."', hi: 'इस वाक्य को नकल करें: "सूर्य पूर्वेला उगवतो।"', mr: 'हे वाक्य उतरवा: "सूर्य पूर्वेला उगवतो."' },
          { en: 'सूर्य पूर्वेला उगवतो. (The sun rises in the east.)', hi: 'सूर्य पूर्वेला उगवतो।', mr: 'सूर्य पूर्वेला उगवतो.' },
          {
            support: [
              { en: 'Copy the first 2 words only: "सूर्य पूर्वेला"', hi: 'केवल पहले 2 शब्द नकल करें: "सूर्य पूर्वेला"', mr: 'फक्त पहिले २ शब्द उतरवा: "सूर्य पूर्वेला"' },
              { en: 'सूर्य पूर्वेला', hi: 'सूर्य पूर्वेला', mr: 'सूर्य पूर्वेला' },
            ],
            stretch: [
              { en: 'Copy the sentence and write an opposite sentence about where the sun sets.', hi: 'वाक्य नकल करें और सूर्यास्त के बारे में एक विपरीत वाक्य लिखें।', mr: 'वाक्य उतरवा आणि सूर्यास्ताबद्दल विरुद्ध वाक्य लिहा.' },
              { en: 'सूर्य पश्चिमेला मावळतो. (The sun sets in the west.)', hi: 'सूर्य पश्चिमेला मावळतो।', mr: 'सूर्य पश्चिमेला मावळतो.' },
            ],
          }
        ),
      ] }],
    },
    4: {
      outcome: {
        en: 'Reads a short Marathi paragraph (5-6 sentences) and answers 2 comprehension questions in writing.',
        hi: 'एक छोटा मराठी अनुच्छेद (5-6 वाक्य) पढ़ता है और 2 लिखित प्रश्नों के उत्तर देता है।', // reviewed: false
        mr: 'एक छोटा मराठी उतारा (५-६ वाक्ये) वाचतो आणि २ समजआधारित प्रश्नांची लेखी उत्तरे देतो.',   // reviewed: false
      },
      teacher: {
        title: { en: 'Shared reading: our school', hi: 'साझा पठन: हमारी शाला', mr: 'सामायिक वाचन: आमची शाळा' },
        minutes: 12,
        steps: [
          { en: 'Write a 5-sentence paragraph on the board about the school building, playground, and teacher.', hi: 'बोर्ड पर शाला भवन, मैदान और शिक्षक के बारे में 5 वाक्यों का अनुच्छेद लिखें।', mr: 'फळ्यावर शाळेची इमारत, मैदान आणि शिक्षक यांबद्दल ५ वाक्यांचा उतारा लिहा.' },
          { en: 'Read aloud twice; students follow with finger.', hi: 'दो बार जोर से पढ़ें; विद्यार्थी उंगली से अनुसरण करें।', mr: 'दोनदा मोठ्याने वाचा; विद्यार्थी बोटाने अनुसरण करतात.' },
          { en: 'Ask 2 oral comprehension questions; invite answers.', hi: '2 मौखिक प्रश्न पूछें; उत्तर आमंत्रित करें।', mr: '२ तोंडी प्रश्न विचारा; उत्तरांसाठी आमंत्रण द्या.' },
        ],
      },
      independent: {
        title: { en: 'Read and answer: our school', hi: 'पढ़ो और उत्तर दो: हमारी शाला', mr: 'वाचा आणि उत्तर द्या: आमची शाळा' },
        instructions: {
          en: 'Read the paragraph from the board carefully. Answer the 2 questions in full Marathi sentences.',
          hi: 'बोर्ड से अनुच्छेद ध्यान से पढ़ें। 2 प्रश्नों के उत्तर पूरे मराठी वाक्यों में दें।', // reviewed: false
          mr: 'फळ्यावरील उतारा काळजीपूर्वक वाचा. २ प्रश्नांची उत्तरे पूर्ण मराठी वाक्यांत द्या.',  // reviewed: false
        },
        minutes: 18,
        mode: 'solo',
        materials: [
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
          { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' },
        ],
      },
      mapping: defaultMapping('Marathi Language (Sulabhbharati Grade 4)'),
      earlyFinisher: {
        en: 'Write 3 more sentences adding to the paragraph about what you like best at school.',
        hi: 'स्कूल में आपको सबसे अच्छा क्या लगता है, इस पर 3 और वाक्य जोड़ें।',  // reviewed: false
        mr: 'शाळेत तुम्हाला सर्वात आवडते काय यावर आणखी ३ वाक्ये जोडा.',          // reviewed: false
      },
      checklist: [
        { en: 'Does the student re-read the paragraph before answering?', hi: 'क्या बच्चा उत्तर देने से पहले अनुच्छेद दोबारा पढ़ता है?', mr: 'उत्तर देण्यापूर्वी विद्यार्थी उतारा पुन्हा वाचतो का?' },
        { en: 'Are the answers in complete Marathi sentences?', hi: 'क्या उत्तर पूरे मराठी वाक्यों में हैं?', mr: 'उत्तरे पूर्ण मराठी वाक्यांत आहेत का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'Answer in Marathi: "आमची शाळा कुठे आहे?" (Answer: village name or "गावात")', hi: 'मराठी में उत्तर दें: "आमची शाळा कुठे आहे?"', mr: 'मराठीत उत्तर द्या: "आमची शाळा कुठे आहे?"' },
          { en: 'Student writes their village or answers from the paragraph', hi: 'विद्यार्थी अपने गाँव का या अनुच्छेद से उत्तर लिखे', mr: 'विद्यार्थी त्यांच्या गावाचे किंवा उताऱ्यातील उत्तर लिहेल' },
          {
            support: [
              { en: 'Circle the answer in the paragraph: शाळा कुठे आहे?', hi: 'अनुच्छेद में उत्तर पर गोला लगाएं: शाळा कुठे आहे?', mr: 'उताऱ्यात उत्तरावर गोल करा: शाळा कुठे आहे?' },
              { en: 'Student circles the location in the paragraph', hi: 'विद्यार्थी अनुच्छेद में स्थान पर गोला लगाए', mr: 'विद्यार्थी उताऱ्यातील ठिकाण गोलाकार करेल' },
            ],
            stretch: [
              { en: 'Write 2 sentences: one about where the school is, one about your favourite part of school.', hi: '2 वाक्य लिखें: एक शाला की स्थिति के बारे में, एक अपनी पसंदीदा बात के बारे में।', mr: '२ वाक्ये लिहा: एक शाळेच्या ठिकाणाबद्दल, एक आपल्या आवडत्या गोष्टीबद्दल.' },
              { en: 'Student writes 2 complete sentences', hi: 'विद्यार्थी 2 पूरे वाक्य लिखे', mr: 'विद्यार्थी २ पूर्ण वाक्ये लिहेल' },
            ],
          }
        ),
        item(
          { en: 'Fill in the blank from the paragraph: "मैदानात मुले ______ खेळतात."', hi: 'अनुच्छेद से रिक्त स्थान भरें: "मैदानात मुले ______ खेळतात।"', mr: 'उताऱ्यातून रिकामी जागा भरा: "मैदानात मुले ______ खेळतात."' },
          { en: 'Answer depends on the paragraph written on the board (any appropriate sport/game)', hi: 'उत्तर बोर्ड पर लिखे अनुच्छेद पर निर्भर (कोई भी उचित खेल)', mr: 'उत्तर फळ्यावर लिहिलेल्या उताऱ्यावर अवलंबून (कोणताही उचित खेळ)' },
          {
            support: [
              { en: 'What do children play in the field? Find the word in the paragraph.', hi: 'मैदान में बच्चे क्या खेलते हैं? अनुच्छेद में शब्द खोजें।', mr: 'मैदानात मुले काय खेळतात? उताऱ्यात शब्द शोधा.' },
              { en: 'Student finds and copies word from paragraph', hi: 'विद्यार्थी अनुच्छेद से शब्द खोजकर लिखे', mr: 'विद्यार्थी उताऱ्यातून शब्द शोधून लिहेल' },
            ],
            stretch: [
              { en: 'What games do you play at school? Write 3 in Marathi.', hi: 'आप स्कूल में कौन से खेल खेलते हैं? मराठी में 3 लिखें।', mr: 'तुम्ही शाळेत कोणते खेळ खेळता? मराठीत ३ लिहा.' },
              { en: 'Student writes 3 games in Marathi from own knowledge', hi: 'विद्यार्थी अपने ज्ञान से 3 खेल लिखे', mr: 'विद्यार्थी स्वतःच्या माहितीतून ३ खेळ लिहेल' },
            ],
          }
        ),
        item(
          { en: 'Write one sentence about what you see on your way to school.', hi: 'स्कूल जाते समय रास्ते में क्या दिखता है, एक वाक्य लिखें।', mr: 'शाळेच्या वाटेवर काय दिसते याबद्दल एक वाक्य लिहा.' },
          { en: 'Any correct Marathi sentence based on student\'s experience', hi: 'विद्यार्थी के अनुभव पर आधारित कोई भी सही वाक्य', mr: 'विद्यार्थ्याच्या अनुभवावर आधारित कोणतेही बरोबर वाक्य' },
          {
            support: [
              { en: 'Choose one: "वाटेत ______ दिसतो." (झाड / नदी / दुकान)', hi: 'एक चुनें: "वाटेत ______ दिसतो." (झाड / नदी / दुकान)', mr: 'एक निवडा: "वाटेत ______ दिसतो." (झाड / नदी / दुकान)' },
              { en: 'Any correct word from the options', hi: 'दिए गए विकल्पों में से कोई सही शब्द', mr: 'पर्यायातील कोणताही बरोबर शब्द' },
            ],
            stretch: [
              { en: 'Write 3 sentences describing your walk to school.', hi: 'स्कूल जाने के रास्ते का वर्णन करते हुए 3 वाक्य लिखें।', mr: 'शाळेच्या वाटेचे वर्णन करणारी ३ वाक्ये लिहा.' },
              { en: 'Student writes 3 correct Marathi sentences', hi: 'विद्यार्थी 3 सही मराठी वाक्य लिखे', mr: 'विद्यार्थी ३ बरोबर मराठी वाक्ये लिहेल' },
            ],
          }
        ),
      ] }],
    },
    5: {
      outcome: {
        en: 'Writes a 5-6 sentence paragraph in Marathi on a familiar topic (family, school, village); uses correct punctuation.',
        hi: 'परिचित विषय (परिवार, शाला, गाँव) पर 5-6 वाक्यों का मराठी अनुच्छेद लिखता है; सही विराम चिह्न उपयोग करता है।', // reviewed: false
        mr: 'परिचित विषयावर (कुटुंब, शाळा, गाव) ५-६ वाक्यांचा मराठी उतारा लिहितो; विरामचिन्हे बरोबर वापरतो.',          // reviewed: false
      },
      teacher: {
        title: { en: 'Paragraph writing: my village', hi: 'अनुच्छेद लेखन: माझे गाव', mr: 'उतारा लेखन: माझे गाव' },
        minutes: 12,
        steps: [
          { en: 'Show a model paragraph on the board about a village (5 sentences). Point out the full stop (।) after each sentence.', hi: 'बोर्ड पर गाँव के बारे में एक नमूना अनुच्छेद दिखाएं (5 वाक्य)। हर वाक्य के बाद पूर्ण विराम (।) दर्शाएं।', mr: 'फळ्यावर गावाबद्दल एक नमुना उतारा दाखवा (५ वाक्ये). प्रत्येक वाक्यानंतर पूर्णविराम (।) दाखवा.' },
          { en: 'Discuss the structure: topic sentence, detail sentences, closing.', hi: 'संरचना की चर्चा करें: विषय वाक्य, विस्तार वाक्य, समापन।', mr: 'रचनेची चर्चा करा: विषय वाक्य, तपशील वाक्ये, समारोप.' },
          { en: 'Students plan their own paragraph (topic: their home / village).', hi: 'विद्यार्थी अपने अनुच्छेद की योजना बनाएं (विषय: अपना घर / गाँव)।', mr: 'विद्यार्थी स्वतःच्या उताऱ्याची आखणी करतात (विषय: घर / गाव).' },
        ],
      },
      independent: {
        title: { en: 'Write: माझे गाव', hi: 'लिखो: माझे गाव', mr: 'लिहा: माझे गाव' },
        instructions: {
          en: 'Write a paragraph of at least 5 sentences about your village or home. Use पूर्णविराम (।) after each sentence.',
          hi: 'अपने गाँव या घर के बारे में कम से कम 5 वाक्यों का अनुच्छेद लिखें। हर वाक्य के बाद पूर्ण विराम (।) लगाएं।', // reviewed: false
          mr: 'आपल्या गावाबद्दल किंवा घराबद्दल किमान ५ वाक्यांचा उतारा लिहा. प्रत्येक वाक्यानंतर पूर्णविराम (।) वापरा.', // reviewed: false
        },
        minutes: 22,
        mode: 'solo',
        materials: [
          { en: 'notebook', hi: 'कॉपी', mr: 'वही' },
          { en: 'pencil', hi: 'पेंसिल', mr: 'पेन्सिल' },
        ],
      },
      mapping: defaultMapping('Marathi Language (Sulabhbharati Grade 5)'),
      earlyFinisher: {
        en: 'Write a second paragraph about what you would like to change or improve in your village.',
        hi: 'अपने गाँव में क्या बदलना चाहेंगे उस पर एक और अनुच्छेद लिखें।',  // reviewed: false
        mr: 'तुमच्या गावात काय बदलायचे आहे यावर आणखी एक उतारा लिहा.',         // reviewed: false
      },
      checklist: [
        { en: 'Does the paragraph have at least 5 complete sentences?', hi: 'क्या अनुच्छेद में कम से कम 5 पूरे वाक्य हैं?', mr: 'उताऱ्यात किमान ५ पूर्ण वाक्ये आहेत का?' },
        { en: 'Does the student use पूर्णविराम (।) correctly?', hi: 'क्या विद्यार्थी पूर्ण विराम (।) सही उपयोग करता है?', mr: 'विद्यार्थी पूर्णविराम (।) बरोबर वापरतो का?' },
      ],
      questions: [{ type: 'static', items: [
        item(
          { en: 'What punctuation mark (विरामचिन्ह) is used at the end of a sentence in Marathi?', hi: 'मराठी में वाक्य के अंत में कौन सा विराम चिह्न आता है?', mr: 'मराठीत वाक्याच्या शेवटी कोणते विरामचिन्ह वापरतात?' },
          { en: 'पूर्णविराम (।)', hi: 'पूर्ण विराम (।)', mr: 'पूर्णविराम (।)' },
          {
            support: [
              { en: 'Is (।) a full stop in Marathi? Yes / No', hi: '(।) मराठी का पूर्ण विराम है? हाँ / नहीं', mr: '(।) हे मराठी पूर्णविराम आहे का? होय / नाही' },
              { en: 'Yes', hi: 'हाँ', mr: 'होय' },
            ],
            stretch: [
              { en: 'Name 3 different विरामचिन्हे (punctuation marks) used in Marathi writing.', hi: 'मराठी लेखन में प्रयुक्त 3 विभिन्न विराम चिह्नों के नाम बताएं।', mr: 'मराठी लेखनात वापरण्यात येणाऱ्या ३ वेगळ्या विरामचिन्हांची नावे सांगा.' },
              { en: 'पूर्णविराम (।), स्वल्पविराम (,), प्रश्नचिन्ह (?)', hi: 'पूर्ण विराम (।), अल्प विराम (,), प्रश्न चिह्न (?)', mr: 'पूर्णविराम (।), स्वल्पविराम (,), प्रश्नचिन्ह (?)' },
            ],
          }
        ),
        item(
          { en: 'Write one topic sentence for a paragraph about "माझे गाव".', hi: '"माझे गाव" पर एक अनुच्छेद के लिए एक विषय वाक्य लिखें।', mr: '"माझे गाव" या विषयावरील उताऱ्यासाठी एक विषय वाक्य लिहा.' },
          { en: 'Any correct topic sentence, e.g. "माझे गाव खूप सुंदर आहे."', hi: 'कोई भी सही विषय वाक्य, जैसे "माझे गाव खूप सुंदर आहे।"', mr: 'कोणतेही बरोबर विषय वाक्य, उदा. "माझे गाव खूप सुंदर आहे."' },
          {
            support: [
              { en: 'Complete the sentence: "माझे गाव ______ आहे."', hi: 'वाक्य पूरा करें: "माझे गाव ______ आहे।"', mr: 'वाक्य पूर्ण करा: "माझे गाव ______ आहे."' },
              { en: 'Any correct adjective, e.g. सुंदर, मोठे, लहान', hi: 'कोई भी सही विशेषण, जैसे सुंदर, मोठे, लहान', mr: 'कोणतेही बरोबर विशेषण, उदा. सुंदर, मोठे, लहान' },
            ],
            stretch: [
              { en: 'Write the full 5-sentence paragraph about माझे गाव with a topic sentence, 3 details, and a closing sentence.', hi: '"माझे गाव" पर पूरा 5-वाक्य अनुच्छेद लिखें, जिसमें विषय वाक्य, 3 विस्तार और समापन वाक्य हो।', mr: '"माझे गाव" वर विषय वाक्य, ३ तपशील आणि समारोप वाक्यासह ५-वाक्यी उतारा लिहा.' },
              { en: 'Student writes a complete 5-sentence paragraph', hi: 'विद्यार्थी 5 वाक्यों का पूरा अनुच्छेद लिखे', mr: 'विद्यार्थी ५ वाक्यांचा पूर्ण उतारा लिहेल' },
            ],
          }
        ),
        item(
          { en: 'Put the correct विरामचिन्ह: "माझ्या गावात एक नदी आहे ___"', hi: 'सही विराम चिह्न लगाएं: "माझ्या गावात एक नदी आहे ___"', mr: 'बरोबर विरामचिन्ह लावा: "माझ्या गावात एक नदी आहे ___"' },
          { en: '। (पूर्णविराम)', hi: '। (पूर्ण विराम)', mr: '। (पूर्णविराम)' },
          {
            support: [
              { en: 'Which goes at the end of a statement: । or ?', hi: 'कथन के अंत में क्या लगता है: । या ?', mr: 'विधानाच्या शेवटी काय येते: । की ?' },
              { en: '।', hi: '।', mr: '।' },
            ],
            stretch: [
              { en: 'Rewrite this sentence as a question: "माझ्या गावात एक नदी आहे।"', hi: 'इस वाक्य को प्रश्न में बदलें: "माझ्या गावात एक नदी आहे।"', mr: 'हे वाक्य प्रश्नात रूपांतरित करा: "माझ्या गावात एक नदी आहे।"' },
              { en: '"माझ्या गावात नदी आहे का?" or similar correct question form', hi: '"माझ्या गावात नदी आहे का?" या इसी प्रकार का प्रश्न वाक्य', mr: '"माझ्या गावात नदी आहे का?" किंवा तत्सम बरोबर प्रश्न वाक्य' },
            ],
          }
        ),
      ] }],
    },
  },
};

export const TOPICS: Topic[] = [water, market, shapes, body, plants, time, neighbourhood, fractions, animals, marathiLang];
export const getTopic = (id: string): Topic => TOPICS.find((t) => t.id === id) ?? TOPICS[0];
export type { GradePlan };
