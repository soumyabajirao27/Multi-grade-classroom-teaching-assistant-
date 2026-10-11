import type { GenSpec, Lang, Question, Tier } from '../types';
import type { Rng } from '../engine/rng';

const NAMES: Record<Lang, string[]> = {
  en: ['Asha', 'Ravi', 'Meena', 'Sonu', 'Kiran', 'Pooja', 'Arjun', 'Geeta'],
  hi: ['आशा', 'रवि', 'मीना', 'सोनू', 'किरण', 'पूजा', 'अर्जुन', 'गीता'],
  mr: ['आशा', 'रवी', 'मीना', 'सोनू', 'किरण', 'पूजा', 'अर्जुन', 'गीता'],
};

const ITEMS: Record<Lang, string[]> = {
  en: ['mangoes', 'pencils', 'notebooks', 'bananas', 'eggs', 'oranges'],
  hi: ['आम', 'पेंसिल', 'कॉपियाँ', 'केले', 'अंडे', 'संतरे'],
  mr: ['आंबे', 'पेन्सिल', 'वह्या', 'केळी', 'अंडी', 'संत्री'],
};

const SHAPES: Record<Lang, string[]> = {
  en: ['rectangle', 'garden', 'playground', 'field', 'room'],
  hi: ['बगीचा', 'मैदान', 'खेत', 'कमरा', 'आयताकार मैदान'],
  mr: ['बाग', 'खेळाचे मैदान', 'शेत', 'खोली', 'आयताकृती मैदान'],
};

const range = (d: number) => ({ min: d === 1 ? 1 : 10 ** (d - 1), max: 10 ** d - 1 });
/** Support tier keeps numbers in the lower half of the range; core/stretch use the full range. */
const hiFor = (max: number, min: number, tier: Tier) => (tier === 'support' ? Math.max(min + 1, Math.floor(max / 2)) : max);
const ones = (n: number) => n % 10;

type Made = Omit<Question, 'id' | 'marks' | 'kind'>;

function genCount(rng: Rng, tier: Tier, lang: Lang): Made {
  const n = rng.int(3, { support: 10, core: 15, stretch: 20 }[tier]);
  const dots = '● '.repeat(n).trim();
  const prompt =
    lang === 'hi'
      ? `गिनकर संख्या लिखें: ${dots}`
      : lang === 'mr'
      ? `मोजा आणि संख्या लिहा: ${dots}`
      : `Count and write the number: ${dots}`;
  return { prompt, answer: String(n) };
}

function genAddNoCarry(rng: Rng, tier: Tier): Made {
  const ta = rng.int(1, { support: 4, core: 6, stretch: 7 }[tier]);
  const oa = rng.int(0, 8);
  const tb = rng.int(1, 9 - ta);
  const ob = rng.int(0, 9 - oa);
  const a = ta * 10 + oa, b = tb * 10 + ob;
  return { prompt: `${a} + ${b} = ____`, answer: String(a + b), meta: { a, b, op: '+' } };
}

function genAdd(rng: Rng, tier: Tier, d: number): Made {
  const { min, max } = range(d);
  const hi = hiFor(max, min, tier);
  let a = rng.int(min, hi), b = rng.int(min, hi);
  if (tier === 'stretch' && d > 1) for (let i = 0; i < 25 && ones(a) + ones(b) < 10; i++) { a = rng.int(min, hi); b = rng.int(min, hi); }
  return { prompt: `${a} + ${b} = ____`, answer: String(a + b), meta: { a, b, op: '+' } };
}

function genSub(rng: Rng, tier: Tier, d: number): Made {
  const { min, max } = range(d);
  const hi = hiFor(max, min, tier);
  let a = rng.int(min + 1, hi), b = rng.int(min, a - 1);
  if (tier === 'stretch' && d > 1) for (let i = 0; i < 25 && ones(a) >= ones(b); i++) { a = rng.int(min + 1, hi); b = rng.int(min, a - 1); }
  return { prompt: `${a} − ${b} = ____`, answer: String(a - b), meta: { a, b, op: '-' } };
}

const tables = (tier: Tier) => ({ support: [2, 5, 10], core: [2, 3, 4, 5, 6, 7, 8, 9], stretch: [6, 7, 8, 9, 11, 12] }[tier]);

function genMul(rng: Rng, tier: Tier, d: number): Made {
  const b = rng.pick(tables(tier));
  const a = d >= 2 ? rng.int(11, tier === 'support' ? 30 : 99) : rng.int(2, 10);
  return { prompt: `${a} × ${b} = ____`, answer: String(a * b), meta: { a, b, op: '*' } };
}

function genDiv(rng: Rng, tier: Tier): Made {
  const b = rng.pick(tables(tier));
  const q = rng.int(2, tier === 'support' ? 6 : 12);
  return { prompt: `${b * q} ÷ ${b} = ____`, answer: String(q), meta: { a: b * q, b, op: '/' } };
}

const mixed = (num: number, den: number) => (num > den ? ` (= ${Math.floor(num / den)} ${num % den}/${den})` : '');

function genFracAdd(rng: Rng, tier: Tier, maxDen: number): Made {
  const d = rng.int(3, tier === 'support' ? Math.min(4, maxDen) : maxDen);
  const a = rng.int(1, d - 1);
  const b = tier === 'stretch' ? rng.int(1, d - 1) : rng.int(1, Math.max(1, d - a));
  const s = a + b;
  return { prompt: `${a}/${d} + ${b}/${d} = ____`, answer: `${s}/${d}${mixed(s, d)}`, meta: { a, b, op: 'f+' } };
}

function genMoney(rng: Rng, tier: Tier): Made {
  const paise = tier === 'support' ? [0, 50] : [0, 25, 50, 75];
  const a = rng.int(5, tier === 'support' ? 30 : 60) + rng.pick(paise) / 100;
  const b = rng.int(5, tier === 'support' ? 30 : 60) + rng.pick(paise) / 100;
  return { prompt: `₹${a.toFixed(2)} + ₹${b.toFixed(2)} = ₹ ____`, answer: `₹${(a + b).toFixed(2)}`, meta: { a, b, op: 'm+' } };
}

function genWord(rng: Rng, tier: Tier, d: number, op: 'add' | 'sub' | 'mul', lang: Lang): Made {
  const name = rng.pick(NAMES[lang] ?? NAMES.en);
  const item = rng.pick(ITEMS[lang] ?? ITEMS.en);
  const { min, max } = range(d);
  const hi = hiFor(max, min, tier);

  if (op === 'mul') {
    const a = rng.int(2, tier === 'support' ? 6 : 12), b = rng.int(2, tier === 'support' ? 5 : 10);
    const prompt =
      lang === 'hi'
        ? `एक पैकेट में ${a} ${item} हैं। ${b} पैकेटों में कितने ${item} होंगे?`
        : lang === 'mr'
        ? `एका पाकिटात ${a} ${item} आहेत. ${b} पाकिटांत किती ${item} असतील?`
        : `One packet has ${a} ${item}. How many ${item} are in ${b} packets?`;
    return { prompt, answer: String(a * b), meta: { a, b, op: '*' } };
  }

  if (op === 'sub') {
    const a = rng.int(min + 1, hi), b = rng.int(min, a - 1);
    const prompt =
      lang === 'hi'
        ? `${name} के पास ${a} ${item} थे। ${b} बिक गए। अब कितने बचे?`
        : lang === 'mr'
        ? `${name}कडे ${a} ${item} होते. त्यातील ${b} विकले. आता किती उरले?`
        : `${name} had ${a} ${item}. ${b} were sold. How many are left?`;
    return { prompt, answer: String(a - b), meta: { a, b, op: '-' } };
  }

  const a = rng.int(min, hi), b = rng.int(min, hi);
  const prompt =
    lang === 'hi'
      ? `${name} ने सुबह ${a} ${item} और शाम को ${b} बेचे। कुल मिलाकर कितने ${item} बेचे?`
      : lang === 'mr'
      ? `${name}ने सकाळी ${a} ${item} आणि संध्याकाळी ${b} विकले. एकूण किती ${item} विकले?`
      : `${name} sold ${a} ${item} in the morning and ${b} in the evening. How many in all?`;
  return { prompt, answer: String(a + b), meta: { a, b, op: '+' } };
}

function genPerimeter(rng: Rng, tier: Tier, d: number, lang: Lang): Made {
  const { min, max } = range(d);
  const hi = hiFor(max, min, tier);
  const l = rng.int(Math.max(2, min), hi);
  const w = rng.int(Math.max(1, min), l);
  const shape = rng.pick(SHAPES[lang] ?? SHAPES.en);
  const p = 2 * (l + w);
  const prompt =
    lang === 'hi'
      ? `एक ${shape} ${l} मी लंबा और ${w} मी चौड़ा है। उसका परिमाप (Perimeter) क्या है?`
      : lang === 'mr'
      ? `एक ${shape} ${l} मी लांब आणि ${w} मी रुंद आहे. त्याची परिमिती (Perimeter) किती?`
      : `A ${shape} is ${l} m long and ${w} m wide. What is its perimeter?`;
  return { prompt, answer: `${p} m`, meta: { a: l, b: w, op: 'perim' } };
}

function genArea(rng: Rng, tier: Tier, d: number, lang: Lang): Made {
  const { min, max } = range(d);
  const hi = hiFor(max, min, tier);
  const l = rng.int(Math.max(2, min), hi);
  const w = rng.int(Math.max(1, min), l);
  const shape = rng.pick(SHAPES[lang] ?? SHAPES.en);
  const a = l * w;
  const prompt =
    lang === 'hi'
      ? `एक ${shape} ${l} मी लंबा और ${w} मी चौड़ा है। उसका क्षेत्रफल (Area) क्या है?`
      : lang === 'mr'
      ? `एक ${shape} ${l} मी लांब आणि ${w} मी रुंद आहे. त्याचे क्षेत्रफळ (Area) किती?`
      : `A ${shape} is ${l} m long and ${w} m wide. What is its area?`;
  return { prompt, answer: `${a} sq m`, meta: { a: l, b: w, op: 'area' } };
}

function genTimeRead(rng: Rng, tier: Tier, lang: Lang): Made {
  const h = rng.int(1, 12);
  const minuteOptions = tier === 'support' ? [0, 30] : tier === 'core' ? [0, 15, 30, 45] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const m = rng.pick(minuteOptions);
  const timeStr = `${h}:${String(m).padStart(2, '0')}`;
  const prompt =
    lang === 'hi'
      ? `घड़ी का छोटा काँटा ${h} पर और बड़ा काँटा ${m === 0 ? 12 : m / 5} पर है। कितना समय (time) हुआ है?`
      : lang === 'mr'
      ? `घड्याळाचा लहान काटा ${h} वर आणि मोठा काटा ${m === 0 ? 12 : m / 5} वर आहे. किती वेळ (time) झाला आहे?`
      : `The short hand points to ${h} and the long hand points to ${m === 0 ? 12 : m / 5}. What time is it?`;
  return { prompt, answer: timeStr, meta: { a: h, b: m, op: 'time' } };
}

function genTimeElapsed(rng: Rng, tier: Tier, lang: Lang): Made {
  const h = rng.int(1, 11);
  const duration = tier === 'support' ? rng.pick([30, 60]) : rng.int(1, 4) * 15;
  const startMin = tier === 'support' ? 0 : rng.pick([0, 15, 30]);
  const totalMin = h * 60 + startMin + duration;
  const endH = Math.floor(totalMin / 60) % 12 || 12;
  const endM = totalMin % 60;
  const startStr = `${h}:${String(startMin).padStart(2, '0')}`;
  const endStr = `${endH}:${String(endM).padStart(2, '0')}`;
  const prompt =
    lang === 'hi'
      ? `विद्यालय ${startStr} बजे शुरू होता है। कक्षा ${duration} मिनट की है। यह किस समय समाप्त होगी?`
      : lang === 'mr'
      ? `शाळा ${startStr} वाजता सुरू होते. तासिका ${duration} मिनिटांची आहे. तासिका किती वाजता संपेल?`
      : `School starts at ${startStr}. The period is ${duration} minutes long. What time does it end?`;
  return { prompt, answer: endStr, meta: { a: h * 60 + startMin, b: duration, op: 'telap' } };
}

export function generate(spec: GenSpec, tier: Tier, rng: Rng, startIndex: number, lang: Lang = 'en'): Question[] {
  const d = spec.digits ?? 1;
  return Array.from({ length: spec.count }, (_, i) => {
    let m: Made;
    switch (spec.gen) {
      case 'count': m = genCount(rng, tier, lang); break;
      case 'addNoCarry': m = genAddNoCarry(rng, tier); break;
      case 'add': m = genAdd(rng, tier, d); break;
      case 'sub': m = genSub(rng, tier, d); break;
      case 'mul': m = genMul(rng, tier, d); break;
      case 'div': m = genDiv(rng, tier); break;
      case 'fracAdd': m = genFracAdd(rng, tier, spec.den ?? 8); break;
      case 'money': m = genMoney(rng, tier); break;
      case 'wordShop': m = genWord(rng, tier, d, spec.op ?? 'add', lang); break;
      case 'perimeter': m = genPerimeter(rng, tier, d, lang); break;
      case 'area': m = genArea(rng, tier, d, lang); break;
      case 'timeRead': m = genTimeRead(rng, tier, lang); break;
      case 'timeElapsed': m = genTimeElapsed(rng, tier, lang); break;
    }
    return { id: `${spec.gen}-${startIndex + i}`, kind: 'short' as const, marks: spec.gen === 'wordShop' ? 2 : 1, ...m };
  });
}
