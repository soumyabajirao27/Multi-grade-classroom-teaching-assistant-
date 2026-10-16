import type { Grade, Subject } from '../types';

export type CurriculumStatus = 'verified' | 'to-verify' | 'theme-mapped';

export interface CurriculumSourceEntry {
  topicId: string;
  grade: Grade;
  subject: Subject;
  board: 'Maharashtra State Board' | 'NCERT';
  medium: 'Marathi' | 'English' | 'Hindi';
  textbook: string;
  editionYear?: number;
  chapterNo?: number;
  chapterTitle?: string;
  pageStart?: number;
  sourceUrl?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  status: CurriculumStatus;
  notes?: string;
}

/**
 * CURRICULUM SOURCES DATASET
 *
 * Rule:
 * All entries default to 'to-verify' or 'theme-mapped' until manually verified against
 * physical or digital textbooks from ebalbharati.in or ncert.nic.in.
 * If status is 'verified', validation mandates: editionYear, chapterNo, and sourceUrl.
 * Chapter titles or numbers must NOT be invented.
 */
export const CURRICULUM_SOURCES: CurriculumSourceEntry[] = [
  // --- evs-water ---
  {
    topicId: 'evs-water',
    grade: 1,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'To verify against ebalbharati Grade 1 Parisar Abhyas textbook',
  },
  {
    topicId: 'evs-water',
    grade: 1,
    subject: 'evs',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Looking Around / Environmental Studies',
    status: 'to-verify',
    notes: 'To verify against NCERT Grade 1 syllabus / Joyful learning',
  },
  {
    topicId: 'evs-water',
    grade: 2,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Water sources and cleanliness unit',
  },
  {
    topicId: 'evs-water',
    grade: 2,
    subject: 'evs',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Looking Around',
    status: 'to-verify',
    notes: 'Water habits and storage unit',
  },
  {
    topicId: 'evs-water',
    grade: 3,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Evaporation and drying unit',
  },
  {
    topicId: 'evs-water',
    grade: 3,
    subject: 'evs',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Looking Around',
    status: 'to-verify',
    notes: 'Water \'O\' Water unit',
  },
  {
    topicId: 'evs-water',
    grade: 4,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Water cycle and natural harvesting',
  },
  {
    topicId: 'evs-water',
    grade: 4,
    subject: 'evs',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Looking Around',
    status: 'to-verify',
    notes: 'Rain and water storage',
  },
  {
    topicId: 'evs-water',
    grade: 5,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Water conservation and community audit',
  },
  {
    topicId: 'evs-water',
    grade: 5,
    subject: 'evs',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Looking Around',
    status: 'to-verify',
    notes: 'Every Drop Counts chapter',
  },

  // --- math-market ---
  {
    topicId: 'math-market',
    grade: 1,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Counting objects and small coins up to 20',
  },
  {
    topicId: 'math-market',
    grade: 1,
    subject: 'math',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Math-Magic',
    status: 'to-verify',
    notes: 'Numbers 1 to 20',
  },
  {
    topicId: 'math-market',
    grade: 2,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: '2-digit addition and subtraction with money',
  },
  {
    topicId: 'math-market',
    grade: 2,
    subject: 'math',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Math-Magic',
    status: 'to-verify',
    notes: 'Tens and ones bundles',
  },
  {
    topicId: 'math-market',
    grade: 3,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: '3-digit market bills and place value',
  },
  {
    topicId: 'math-market',
    grade: 3,
    subject: 'math',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Math-Magic',
    status: 'to-verify',
    notes: 'Give and Take unit',
  },
  {
    topicId: 'math-market',
    grade: 4,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Multiplication & multi-step transaction calculations',
  },
  {
    topicId: 'math-market',
    grade: 4,
    subject: 'math',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Math-Magic',
    status: 'to-verify',
    notes: 'The Junk Seller chapter',
  },
  {
    topicId: 'math-market',
    grade: 5,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Decimals, Rupees and Paise accounting',
  },
  {
    topicId: 'math-market',
    grade: 5,
    subject: 'math',
    board: 'NCERT',
    medium: 'English',
    textbook: 'Math-Magic',
    status: 'to-verify',
    notes: 'Parts and Wholes / Currency unit',
  },

  // --- math-shapes ---
  {
    topicId: 'math-shapes',
    grade: 1,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Basic 2D shapes identification',
  },
  {
    topicId: 'math-shapes',
    grade: 2,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Edges and corners of geometric shapes',
  },
  {
    topicId: 'math-shapes',
    grade: 3,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Perimeter introduction on grid paper',
  },
  {
    topicId: 'math-shapes',
    grade: 4,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Perimeter of rectangles and regular polygons',
  },
  {
    topicId: 'math-shapes',
    grade: 5,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Perimeter, area formula and tile layout',
  },

  // --- evs-body ---
  {
    topicId: 'evs-body',
    grade: 1,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'External body parts and hygiene',
  },
  {
    topicId: 'evs-body',
    grade: 2,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Sense organs and healthy daily habits',
  },
  {
    topicId: 'evs-body',
    grade: 3,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Body movement, teeth care and balanced diet',
  },
  {
    topicId: 'evs-body',
    grade: 4,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Digestive system journey and clean eating',
  },
  {
    topicId: 'evs-body',
    grade: 5,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Internal organ systems and pulse rate measurement',
  },

  // --- evs-plants ---
  {
    topicId: 'evs-plants',
    grade: 1,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Plant parts: root, stem, leaf and flower',
  },
  {
    topicId: 'evs-plants',
    grade: 2,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Trees, shrubs, herbs and climbers',
  },
  {
    topicId: 'evs-plants',
    grade: 3,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Photosynthesis introduction: sunlight, water, air',
  },
  {
    topicId: 'evs-plants',
    grade: 4,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Taproot vs fibrous root systems',
  },
  {
    topicId: 'evs-plants',
    grade: 5,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Seed dispersal mechanisms and ecological interdependence',
  },

  // --- math-time ---
  {
    topicId: 'math-time',
    grade: 1,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Daily routine sequencing: morning, afternoon, night',
  },
  {
    topicId: 'math-time',
    grade: 2,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Reading whole hours on analog clock',
  },
  {
    topicId: 'math-time',
    grade: 3,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Reading half past, quarter past and minutes',
  },
  {
    topicId: 'math-time',
    grade: 4,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: '12-hour vs 24-hour clock and elapsed time',
  },
  {
    topicId: 'math-time',
    grade: 5,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Timetables, elapsed duration and railway schedules',
  },

  // --- evs-neighbourhood ---
  {
    topicId: 'evs-neighbourhood',
    grade: 1,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Landmarks around home and school',
  },
  {
    topicId: 'evs-neighbourhood',
    grade: 2,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Community helpers in village',
  },
  {
    topicId: 'evs-neighbourhood',
    grade: 3,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Four cardinal directions and simple sketch map',
  },
  {
    topicId: 'evs-neighbourhood',
    grade: 4,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Scale, map symbols and sub-districts',
  },
  {
    topicId: 'evs-neighbourhood',
    grade: 5,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'District and state geography, transport networks',
  },

  // --- math-fractions ---
  {
    topicId: 'math-fractions',
    grade: 1,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Equal sharing between 2 persons',
  },
  {
    topicId: 'math-fractions',
    grade: 2,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Half and quarter of real objects (bhakri/roti)',
  },
  {
    topicId: 'math-fractions',
    grade: 3,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Fractions notation: 1/2, 1/4, 3/4',
  },
  {
    topicId: 'math-fractions',
    grade: 4,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Like fractions addition and subtraction',
  },
  {
    topicId: 'math-fractions',
    grade: 5,
    subject: 'math',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Ganit (Balbharati)',
    status: 'to-verify',
    notes: 'Equivalent fractions, mixed numbers and word problems',
  },

  // --- evs-animals ---
  {
    topicId: 'evs-animals',
    grade: 1,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Domestic vs wild animals',
  },
  {
    topicId: 'evs-animals',
    grade: 2,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Animal homes and sounds',
  },
  {
    topicId: 'evs-animals',
    grade: 3,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Herbivores, carnivores and food habits',
  },
  {
    topicId: 'evs-animals',
    grade: 4,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Animal adaptations and habitats (aquatic/terrestrial)',
  },
  {
    topicId: 'evs-animals',
    grade: 5,
    subject: 'evs',
    board: 'Maharashtra State Board',
    medium: 'Marathi',
    textbook: 'Parisar Abhyas (Part 1)',
    status: 'to-verify',
    notes: 'Food chains, wildlife preservation and keystone species',
  },
];

/**
 * Returns curriculum sources for a specific topic and grade.
 */
export function getCurriculumSources(topicId: string, grade: Grade): CurriculumSourceEntry[] {
  return CURRICULUM_SOURCES.filter((s) => s.topicId === topicId && s.grade === grade);
}

/**
 * Formats a short offline plain-text curriculum citation for worksheet footer.
 */
export function formatCurriculumFooter(topicId: string, grade: Grade): string {
  const sources = getCurriculumSources(topicId, grade);
  if (!sources.length) return '';
  const first = sources[0];
  const parts: string[] = [first.board, first.textbook];
  if (first.chapterNo !== undefined && first.chapterTitle) {
    parts.push(`Ch ${first.chapterNo}: ${first.chapterTitle}`);
  }
  if (first.status === 'to-verify') {
    parts.push('(Curriculum alignment: To-verify against official textbook)');
  } else if (first.status === 'verified') {
    parts.push(`(Verified: ${first.verifiedBy || 'Reviewer'}, ${first.verifiedDate || ''})`);
  }
  return parts.join(' · ');
}
