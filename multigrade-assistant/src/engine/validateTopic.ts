import type { Topic, Grade, StaticItem } from '../types';
import { MAX_SOLO_MINUTES } from './rules';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  topic?: Topic;
}

const ALLOWED_SUBJECTS = ['math', 'evs', 'lang'];
const GRADES: Grade[] = [1, 2, 3, 4, 5];
const MAX_STRING_LENGTH = 1000;
const MAX_TOTAL_SIZE_BYTES = 200 * 1024; // 200 KB max topic JSON size

const BUILT_IN_TOPIC_IDS = new Set([
  'evs-water',
  'math-market',
  'math-shapes',
  'evs-body',
  'evs-plants',
  'math-time',
  'evs-neighbourhood',
  'math-fractions',
  'evs-animals',
  'lang-marathi',
]);

function checkString(val: unknown, path: string, errors: ValidationError[], maxLen = MAX_STRING_LENGTH): boolean {
  if (typeof val !== 'string') {
    errors.push({ path, message: `Expected a string but received ${typeof val}` });
    return false;
  }
  if (!val.trim()) {
    errors.push({ path, message: 'String cannot be empty' });
    return false;
  }
  if (val.length > maxLen) {
    errors.push({ path, message: `String exceeds maximum length of ${maxLen} characters (length: ${val.length})` });
    return false;
  }
  return true;
}

function checkLocalizable(val: unknown, path: string, errors: ValidationError[]) {
  if (typeof val === 'string') {
    checkString(val, path, errors);
    return;
  }
  if (!val || typeof val !== 'object' || Array.isArray(val)) {
    errors.push({ path, message: 'Must be a string or localized dictionary { en, hi?, mr? }' });
    return;
  }
  const obj = val as Record<string, unknown>;
  if (!('en' in obj)) {
    errors.push({ path: `${path}.en`, message: 'English translation (en) is required' });
  } else {
    checkString(obj.en, `${path}.en`, errors);
  }
  if ('hi' in obj && obj.hi !== undefined) {
    checkString(obj.hi, `${path}.hi`, errors);
  }
  if ('mr' in obj && obj.mr !== undefined) {
    checkString(obj.mr, `${path}.mr`, errors);
  }
}

/**
 * Validates a parsed custom topic object or JSON string.
 * Enforces pure validation, bounded string lengths, no code execution,
 * tier differentiation checks, and Grade 1-5 pedagogical constraints.
 */
export function validateCustomTopic(input: unknown, existingCustomIds: string[] = []): ValidationResult {
  const errors: ValidationError[] = [];

  let data: unknown = input;
  if (typeof input === 'string') {
    if (new TextEncoder().encode(input).length > MAX_TOTAL_SIZE_BYTES) {
      return {
        valid: false,
        errors: [{ path: 'file', message: `File size exceeds maximum allowed size of ${MAX_TOTAL_SIZE_BYTES / 1024} KB` }],
      };
    }
    try {
      data = JSON.parse(input);
    } catch (e) {
      return {
        valid: false,
        errors: [{ path: 'json', message: `Malformed JSON: ${(e as Error).message}` }],
      };
    }
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      valid: false,
      errors: [{ path: 'root', message: 'Topic must be a JSON object' }],
    };
  }

  const topicObj = data as Record<string, unknown>;

  // Check unexpected top-level keys
  const allowedTopKeys = new Set(['id', 'subject', 'title', 'theme', 'hook', 'mapping', 'reviewed', 'grades', 'isCustom', 'schemaVersion']);
  for (const k of Object.keys(topicObj)) {
    if (!allowedTopKeys.has(k)) {
      errors.push({ path: k, message: `Unexpected property '${k}' in topic specification` });
    }
  }

  // ID validation
  if (!topicObj.id || typeof topicObj.id !== 'string') {
    errors.push({ path: 'id', message: 'Field "id" is required and must be a string' });
  } else {
    const id = topicObj.id.trim();
    if (!/^[a-z0-9_-]+$/i.test(id)) {
      errors.push({ path: 'id', message: 'Topic ID may only contain alphanumeric characters, hyphens, and underscores' });
    }
    if (BUILT_IN_TOPIC_IDS.has(id)) {
      errors.push({ path: 'id', message: `Topic ID '${id}' clashes with a built-in system topic` });
    }
    if (existingCustomIds.includes(id)) {
      errors.push({ path: 'id', message: `A custom topic with ID '${id}' already exists` });
    }
  }

  // Subject validation
  if (!topicObj.subject || typeof topicObj.subject !== 'string' || !ALLOWED_SUBJECTS.includes(topicObj.subject)) {
    errors.push({ path: 'subject', message: `Subject must be one of: ${ALLOWED_SUBJECTS.join(', ')}` });
  }

  // Title, theme, hook
  if (!topicObj.title) {
    errors.push({ path: 'title', message: 'Topic title is required' });
  } else {
    checkLocalizable(topicObj.title, 'title', errors);
  }

  if (!topicObj.theme) {
    errors.push({ path: 'theme', message: 'Topic theme is required' });
  } else {
    checkLocalizable(topicObj.theme, 'theme', errors);
  }

  if (!topicObj.hook) {
    errors.push({ path: 'hook', message: 'Topic hook / opening is required' });
  } else {
    checkLocalizable(topicObj.hook, 'hook', errors);
  }

  // Grades object validation
  if (!topicObj.grades || typeof topicObj.grades !== 'object' || Array.isArray(topicObj.grades)) {
    errors.push({ path: 'grades', message: 'Field "grades" is required and must be an object with plans for Grades 1 to 5' });
  } else {
    const gradesObj = topicObj.grades as Record<string, unknown>;
    for (const g of GRADES) {
      const gPlan = gradesObj[g];
      if (!gPlan || typeof gPlan !== 'object' || Array.isArray(gPlan)) {
        errors.push({ path: `grades.${g}`, message: `Grade ${g} plan is missing or invalid` });
        continue;
      }
      const plan = gPlan as Record<string, unknown>;

      // Outcome
      if (!plan.outcome) {
        errors.push({ path: `grades.${g}.outcome`, message: `Learning outcome is required for Grade ${g}` });
      } else {
        checkLocalizable(plan.outcome, `grades.${g}.outcome`, errors);
      }

      // Teacher activity
      if (!plan.teacher || typeof plan.teacher !== 'object' || Array.isArray(plan.teacher)) {
        errors.push({ path: `grades.${g}.teacher`, message: `Teacher activity is required for Grade ${g}` });
      } else {
        const teacher = plan.teacher as Record<string, unknown>;
        if (typeof teacher.minutes !== 'number' || teacher.minutes <= 0) {
          errors.push({ path: `grades.${g}.teacher.minutes`, message: `Teacher minutes must be a positive number for Grade ${g}` });
        }
        if (!Array.isArray(teacher.steps) || teacher.steps.length === 0) {
          errors.push({ path: `grades.${g}.teacher.steps`, message: `Teacher steps must be a non-empty array for Grade ${g}` });
        } else {
          teacher.steps.forEach((step, idx) => {
            checkLocalizable(step, `grades.${g}.teacher.steps[${idx}]`, errors);
          });
        }
      }

      // Independent task
      if (!plan.independent || typeof plan.independent !== 'object' || Array.isArray(plan.independent)) {
        errors.push({ path: `grades.${g}.independent`, message: `Independent task is required for Grade ${g}` });
      } else {
        const indep = plan.independent as Record<string, unknown>;
        if (typeof indep.minutes !== 'number' || indep.minutes <= 0) {
          errors.push({ path: `grades.${g}.independent.minutes`, message: `Independent minutes must be a positive number for Grade ${g}` });
        } else if (indep.minutes > MAX_SOLO_MINUTES[g]) {
          errors.push({
            path: `grades.${g}.independent.minutes`,
            message: `Solo minutes (${indep.minutes}) exceeds MAX_SOLO_MINUTES for Grade ${g} (${MAX_SOLO_MINUTES[g]} min)`,
          });
        }
        if (!indep.instructions && !indep.task) {
          errors.push({ path: `grades.${g}.independent.instructions`, message: `Independent task instructions are required for Grade ${g}` });
        } else {
          checkLocalizable(indep.instructions || indep.task, `grades.${g}.independent.instructions`, errors);
        }
        if (indep.mode && !['solo', 'pair', 'group'].includes(indep.mode as string)) {
          errors.push({ path: `grades.${g}.independent.mode`, message: 'Mode must be "solo", "pair", or "group"' });
        }
      }

      // Early finisher & checklist
      if (plan.earlyFinisher) {
        checkLocalizable(plan.earlyFinisher, `grades.${g}.earlyFinisher`, errors);
      }
      if (plan.checklist && Array.isArray(plan.checklist)) {
        plan.checklist.forEach((item, idx) => {
          checkLocalizable(item, `grades.${g}.checklist[${idx}]`, errors);
        });
      }

      // Questions array
      if (!Array.isArray(plan.questions) || plan.questions.length === 0) {
        errors.push({ path: `grades.${g}.questions`, message: `At least one question specification is required for Grade ${g}` });
      } else {
        plan.questions.forEach((qSpec, qIdx) => {
          if (!qSpec || typeof qSpec !== 'object') {
            errors.push({ path: `grades.${g}.questions[${qIdx}]`, message: 'Invalid question specification' });
            return;
          }
          const spec = qSpec as Record<string, unknown>;
          if (spec.type === 'static') {
            if (!Array.isArray(spec.items) || spec.items.length === 0) {
              errors.push({ path: `grades.${g}.questions[${qIdx}].items`, message: 'Static questions must contain at least one item' });
            } else {
              spec.items.forEach((item, itIdx) => {
                const it = item as StaticItem;
                const pathPrefix = `grades.${g}.questions[${qIdx}].items[${itIdx}]`;
                if (!it.core || !it.core.q || !it.core.a) {
                  errors.push({ path: `${pathPrefix}.core`, message: 'Core question prompt and answer are required' });
                } else {
                  checkLocalizable(it.core.q, `${pathPrefix}.core.q`, errors);
                  checkLocalizable(it.core.a, `${pathPrefix}.core.a`, errors);
                }

                // Tier differentiation check: must have support AND stretch, or sameAcrossTiers with valid sameReason
                if (it.sameAcrossTiers) {
                  if (!it.sameReason || !it.sameReason.trim()) {
                    errors.push({
                      path: `${pathPrefix}.sameReason`,
                      message: 'Questions marked sameAcrossTiers must specify a justified sameReason (e.g. drawing or visual task)',
                    });
                  }
                } else {
                  if (!it.support || !it.support.q || !it.support.a) {
                    errors.push({
                      path: `${pathPrefix}.support`,
                      message: 'Authored item must have support tier variant or declare sameAcrossTiers: true with sameReason',
                    });
                  }
                  if (!it.stretch || !it.stretch.q || !it.stretch.a) {
                    errors.push({
                      path: `${pathPrefix}.stretch`,
                      message: 'Authored item must have stretch tier variant or declare sameAcrossTiers: true with sameReason',
                    });
                  }
                }
              });
            }
          } else if (spec.type === 'gen') {
            if (!spec.gen || typeof spec.gen !== 'string') {
              errors.push({ path: `grades.${g}.questions[${qIdx}].gen`, message: 'Generator ID is required' });
            }
            if (typeof spec.count !== 'number' || spec.count <= 0) {
              errors.push({ path: `grades.${g}.questions[${qIdx}].count`, message: 'Generator count must be greater than 0' });
            }
          } else {
            errors.push({ path: `grades.${g}.questions[${qIdx}].type`, message: 'Question type must be "static" or "gen"' });
          }
        });
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const topic: Topic = {
    id: (topicObj.id as string).trim(),
    subject: topicObj.subject as 'math' | 'evs' | 'lang',
    title: topicObj.title as any,
    theme: topicObj.theme as any,
    hook: topicObj.hook as any,
    mapping: (topicObj.mapping as any) || 'Custom topic created by teacher',
    reviewed: { en: true, hi: false, mr: false },
    grades: topicObj.grades as any,
    isCustom: true,
  };

  return { valid: true, errors: [], topic };
}

/**
 * Creates an empty template topic JSON for teachers to author or download.
 */
export function getTopicTemplateJson(): string {
  const template: Partial<Topic> & { schemaVersion: number } = {
    schemaVersion: 1,
    id: 'custom-topic-example',
    subject: 'evs',
    title: {
      en: 'Local Birds (Custom)',
      hi: 'स्थानीय पक्षी (कस्टम)',
      mr: 'स्थानिक पक्षी (कस्टम)',
    },
    theme: {
      en: 'Birds observed around our village',
      hi: 'हमारे गाँव के आसपास दिखने वाले पक्षी',
      mr: 'आपल्या गावाच्या परिसरात दिसणारे पक्षी',
    },
    hook: {
      en: 'Ask children: "Which bird did you hear or see on your way to school this morning?"',
      hi: 'बच्चों से पूछें: "आज सुबह स्कूल आते समय आपने कौन सा पक्षी देखा या सुना?"',
      mr: 'मुलांना विचारा: "आज सकाळी शाळेत येताना तुम्ही कोणता पक्षी पाहिला किंवा ऐकला?"',
    },
    grades: {
      1: {
        outcome: { en: 'Identifies common birds by sound and appearance', hi: 'आवाज़ और रूप से आम पक्षियों को पहचानता है', mr: 'आवाज आणि रूपावरून सामान्य पक्षी ओळखतो' },
        teacher: {
          title: { en: 'Bird picture talk', hi: 'पक्षी चित्र चर्चा', mr: 'पक्षी चित्रसंवाद' },
          minutes: 8,
          steps: [{ en: 'Show pictures of sparrow and crow', hi: 'गौरैया और कौवे का चित्र दिखाएं', mr: 'चिमणी आणि कावळ्याचे चित्र दाखवा' }],
        },
        independent: {
          title: { en: 'Draw your favourite bird', hi: 'अपना पसंदीदा पक्षी बनाएं', mr: 'तुमचा आवडता पक्षी काढा' },
          instructions: { en: 'Draw your favourite bird', hi: 'अपना पसंदीदा पक्षी बनाएं', mr: 'तुमचा आवडता पक्षी काढा' },
          minutes: 10,
          mode: 'solo',
          materials: [{ en: 'paper', hi: 'कागज़', mr: 'कागद' }],
        },
        earlyFinisher: { en: 'Colour your drawing', hi: 'अपने चित्र में रंग भरें', mr: 'चित्रात रंग भरा' },
        checklist: [{ en: 'Did the student draw a bird?', hi: 'क्या विद्यार्थी ने पक्षी बनाया?', mr: 'विद्यार्थ्याने पक्षी काढला का?' }],
        questions: [{
          type: 'static',
          items: [{
            core: { q: { en: 'Draw a crow or sparrow.' }, a: { en: 'Drawing of bird' } },
            kind: 'draw',
            sameAcrossTiers: true,
            sameReason: 'Visual drawing task accessible to all Grade 1 tiers',
          }],
        }],
      },
      2: {
        outcome: { en: 'Names 3 local birds and what they eat', hi: '3 स्थानीय पक्षियों और उनके भोजन के नाम बताता है', mr: '३ स्थानिक पक्षी आणि त्यांच्या अन्नाची नावे सांगतो' },
        teacher: {
          title: { en: 'What do birds eat?', hi: 'पक्षी क्या खाते हैं?', mr: 'पक्षी काय खातात?' },
          minutes: 8,
          steps: [{ en: 'Discuss grains, insects, fruits', hi: 'अनाज, कीड़े, फल पर चर्चा करें', mr: 'दाणे, कीटक, फळे यांवर चर्चा करा' }],
        },
        independent: {
          title: { en: 'Match bird with food', hi: 'पक्षी का भोजन से मिलान करें', mr: 'पक्षी आणि अन्नाच्या जोड्या लावा' },
          instructions: { en: 'Match bird with food', hi: 'पक्षी का भोजन से मिलान करें', mr: 'पक्षी आणि अन्नाच्या जोड्या लावा' },
          minutes: 12,
          mode: 'pair',
          materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
        },
        questions: [{
          type: 'static',
          items: [{
            core: { q: { en: 'What does a sparrow eat?' }, a: { en: 'Grains and small seeds' } },
            support: { q: { en: 'Does a sparrow eat grains? Yes / No' }, a: { en: 'Yes' } },
            stretch: { q: { en: 'Name two places where sparrows find food.' }, a: { en: 'Fields and courtyards' } },
          }],
        }],
      },
      3: {
        outcome: { en: 'Explains how beak shape relates to food habits', hi: 'चोंच के आकार और भोजन का संबंध समझाता है', mr: 'चोचीचा आकार व अन्न यांचा संबंध स्पष्ट करतो' },
        teacher: {
          title: { en: 'Beaks and feet', hi: 'चोंच और पंजे', mr: 'चोच व पंजे' },
          minutes: 10,
          steps: [{ en: 'Compare duck beak and eagle beak', hi: 'बत्तख और चील की चोंच की तुलना करें', mr: 'बदक आणि गरुडाच्या चोचीची तुलना करा' }],
        },
        independent: {
          title: { en: 'Complete beak table', hi: 'चोंच तालिका पूरी करें', mr: 'चोच तक्ता पूर्ण करा' },
          instructions: { en: 'Complete beak table', hi: 'चोंच तालिका पूरी करें', mr: 'चोच तक्ता पूर्ण करा' },
          minutes: 15,
          mode: 'solo',
          materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
        },
        questions: [{
          type: 'static',
          items: [{
            core: { q: { en: 'Why does an eagle have a hooked beak?' }, a: { en: 'To tear meat' } },
            support: { q: { en: 'Is an eagle beak hooked or flat?' }, a: { en: 'Hooked' } },
            stretch: { q: { en: 'Compare a woodpecker beak with a duck beak.' }, a: { en: 'Woodpecker has chiselling beak; duck has flat strainer beak' } },
          }],
        }],
      },
      4: {
        outcome: { en: 'Describes bird nesting habitats and materials', hi: 'पक्षियों के घोंसले और सामग्री का विवरण देता है', mr: 'पक्ष्यांची घरटी आणि साहित्याचे वर्णन करतो' },
        teacher: {
          title: { en: 'Nests and eggs', hi: 'घोंसले और अंडे', mr: 'घरटी आणि अंडी' },
          minutes: 10,
          steps: [{ en: 'Discuss weaver bird, tailor bird, crow nests', hi: 'बया, दर्जी पक्षी और कौवे के घोंसलों पर चर्चा करें', mr: 'सुगरण, शिंपी आणि कावळ्याच्या घरट्यांची चर्चा करा' }],
        },
        independent: {
          title: { en: 'Write materials used for nests', hi: 'घोंसले के लिए उपयोग सामग्री लिखें', mr: 'घरट्यासाठी लागणारे साहित्य लिहा' },
          instructions: { en: 'Write materials used for nests', hi: 'घोंसले के लिए उपयोग सामग्री लिखें', mr: 'घरट्यासाठी लागणारे साहित्य लिहा' },
          minutes: 20,
          mode: 'solo',
          materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
        },
        questions: [{
          type: 'static',
          items: [{
            core: { q: { en: 'Name 3 materials birds use to build nests.' }, a: { en: 'Twigs, dry grass, cotton' } },
            support: { q: { en: 'Do birds use twigs to build nests? Yes / No' }, a: { en: 'Yes' } },
            stretch: { q: { en: 'Why do tailor birds stitch leaves together?' }, a: { en: 'To create a hidden safe nest for eggs' } },
          }],
        }],
      },
      5: {
        outcome: { en: 'Analyzes threats to local bird populations and conservation measures', hi: 'स्थानीय पक्षियों के संकट और संरक्षण के उपाय समझता है', mr: 'स्थानिक पक्ष्यांचे धोके व संवर्धन उपाय समजून घेतो' },
        teacher: {
          title: { en: 'Bird conservation', hi: 'पक्षी संरक्षण', mr: 'पक्षी संवर्धन' },
          minutes: 10,
          steps: [{ en: 'Discuss loss of trees, water bowls in summer', hi: 'पेड़ों की कटाई, गर्मियों में पानी के सकोरे पर चर्चा करें', mr: 'झाडांची तोड, उन्हाळ्यात पाण्याचे भांडे यावर चर्चा करा' }],
        },
        independent: {
          title: { en: 'Write a plan for a school bird feeder', hi: 'स्कूल बर्ड फीडर की योजना लिखें', mr: 'शाळेत पक्षी खाद्याची योजना तयार करा' },
          instructions: { en: 'Write a plan for a school bird feeder', hi: 'स्कूल बर्ड फीडर की योजना लिखें', mr: 'शाळेत पक्षी खाद्याची योजना तयार करा' },
          minutes: 22,
          mode: 'solo',
          materials: [{ en: 'notebook', hi: 'कॉपी', mr: 'वही' }],
        },
        questions: [{
          type: 'static',
          items: [{
            core: { q: { en: 'What can students do to help birds in summer?' }, a: { en: 'Keep clay water bowls and grain feeders' } },
            support: { q: { en: 'Should we keep water bowls for birds in summer? Yes / No' }, a: { en: 'Yes' } },
            stretch: { q: { en: 'List two reasons why house sparrows have decreased in villages and cities.' }, a: { en: 'Loss of nesting spaces in modern houses and insecticide use' } },
          }],
        }],
      },
    },
  };

  return JSON.stringify(template, null, 2);
}
