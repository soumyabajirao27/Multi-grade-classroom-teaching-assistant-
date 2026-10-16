import type { CurriculumMapping, Grade, MappingStatus, Subject } from '../types';

export const OFFICIAL_NCERT_CHAPTERS: Record<string, string[]> = {
  // NCERT Class 1 Maths "Joyful Mathematics" (official list at ciet.ncert.gov.in/audio-book/118)
  'NCERT-Math-1': [
    'Finding the Furry Cat!',
    'What is Long?',
    'Mango Treat',
    'Making 10',
    'How Many?',
    'Vegetable Farm',
    'Lina\'s Family',
    'Fun with Numbers',
    'Utsav',
    'How do I Spend my Day?',
    'How Many Times?',
    'How Much Can We Spend?',
    'So Many Toys',
  ],
  // NCERT Class 2 Maths "Joyful Mathematics" (official list at ciet.ncert.gov.in/audio-book/121)
  'NCERT-Math-2': [
    'A Day at the Beach',
    'Shapes Around Us',
    'Fun with Numbers',
    'Shadow Story (Togalu)',
    'Playing with Lines',
    'Decoration for Festival',
    'Rani\'s Gift',
    'Grouping and Sharing',
    'Which Season is it?',
    'Fun at the Fair',
    'Data Handling',
  ],
  // NCERT Class 3 Maths "Maths Mela" (secondary: competishun.com/ncert-book/maths-mela/)
  'NCERT-Math-3': [
    'What\'s in a Name',
    'Toy Joy',
    'Double Century',
    'Vacation with My Nani Maa',
    'Fun with Shapes',
    'House of Hundreds - I',
    'Raksha Bandhan',
    'Fair Share',
    'House of Hundreds - II',
    'Fun at Class Party!',
    'Filling and Lifting',
    'Give and Take',
    'Time Goes On',
    'The Surajkund Fair',
  ],
  // NCERT Class 3 "The World Around Us" / "Our Wondrous World" (secondary: competishun.com/ncert-book/our-wondrous-world/)
  'NCERT-EVS-3': [
    'Family and Friends',
    'Going to the Mela',
    'Celebrating Festivals',
    'Getting to Know Plants',
    'Plants and Animals Live Together',
    'Living in Harmony',
    'Water - A Precious Gift',
    'Food We Eat',
    'Staying Healthy and Happy',
    'This World of Things',
    'Making Things',
    'Taking Charge of Waste',
  ],
  // NCERT Class 4 "The World Around Us" / "Our Wondrous World" (secondary: schools.aglasem.com)
  'NCERT-EVS-4': [
    'Living Together',
    'Exploring Our Neighbourhood',
    'Nature Trail',
    'Growing Up with Nature',
    'Food for Health',
    'Happy and Healthy Living',
    'How Things Work',
    'How Things Are Made',
    'Different Lands, Different Lives',
    'Our Sky',
  ],
  // NCERT Class 4 Maths "Math Mela" (secondary, CONFLICTING sources, confirmed-looking titles only)
  'NCERT-Math-4': [
    'Shapes Around Us',
    'Hide and Seek',
    'Pattern Around Us',
    'Thousands Around Us',
  ],
};

export interface TopicGradeCurriculumSource {
  topicId: string;
  grade: Grade;
  subject: Subject;
  mapping: CurriculumMapping;
}

/**
 * Migration helper to migrate older 'to-verify' CurriculumMapping or legacy format
 * to the new rigorous CurriculumMapping specification.
 */
export function migrateCurriculumMapping(
  rawLegacy: Record<string, any>,
  fallbackGrade: Grade = 1
): CurriculumMapping {
  const legacy = rawLegacy as Record<string, any>;
  const isNCERT = legacy.board === 'NCERT' || (typeof legacy.book === 'string' && legacy.book.includes('NCERT')) || (typeof legacy.textbook === 'string' && legacy.textbook.includes('NCERT'));
  const board: 'NCERT' | 'Maharashtra State Board' = isNCERT ? 'NCERT' : 'Maharashtra State Board';
  const classLevel: Grade = legacy.classLevel || fallbackGrade;
  const book = legacy.book || legacy.textbook || (board === 'NCERT' ? 'NCERT Textbook' : 'Balbharati Textbook');
  const chapter = legacy.chapter || 'TO RESEARCH';

  let status: MappingStatus = 'to-research';
  if (legacy.status === 'verified' && legacy.verifiedBy && legacy.verifiedOn) {
    status = 'verified';
  } else if (legacy.status === 'candidate') {
    status = 'candidate';
  } else if (legacy.status === 'extension') {
    status = 'extension';
  } else {
    status = 'to-research';
  }

  return {
    board,
    classLevel,
    book,
    chapter,
    chapterNo: legacy.chapterNo,
    matchType: legacy.matchType || (chapter !== 'TO RESEARCH' && !chapter.startsWith('TO ') ? 'title-match' : 'none'),
    status,
    source: legacy.source || (board === 'NCERT' ? 'ciet.ncert.gov.in / ncert.nic.in' : 'ebalbharati.in'),
    sourceType: legacy.sourceType || 'secondary',
    checkedOn: legacy.checkedOn || '2026-10-16',
    verifiedBy: legacy.verifiedBy,
    verifiedOn: legacy.verifiedOn,
    note: legacy.note,
  };
}

export const CHECK_DATE = '2026-10-16';

/**
 * Master mapping entries for built-in curriculum topics (Grades 1-5).
 * Strictly using only supplied chapter lists. Unresearched classes are marked 'to-research'.
 * Extension topics are marked 'extension' with note "No matching NCERT chapter identified yet; own extension content".
 */
export const CURRICULUM_MAPPINGS: TopicGradeCurriculumSource[] = [
  // ================= evs-water =================
  {
    topicId: 'evs-water',
    grade: 1,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-water',
    grade: 2,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-water',
    grade: 3,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Our Wondrous World',
      chapter: 'Water - A Precious Gift',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/our-wondrous-world/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'evs-water',
    grade: 4,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Our Wondrous World',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'extension',
      source: 'schools.aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'No matching NCERT chapter identified yet; own extension content',
    },
  },
  {
    topicId: 'evs-water',
    grade: 5,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= math-market =================
  {
    topicId: 'math-market',
    grade: 1,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'Joyful Mathematics',
      chapter: 'How Much Can We Spend?',
      matchType: 'title-match',
      status: 'candidate',
      source: 'ciet.ncert.gov.in/audio-book/118',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'math-market',
    grade: 2,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'Joyful Mathematics',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'extension',
      source: 'ciet.ncert.gov.in/audio-book/121',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'No matching NCERT chapter identified yet; own extension content',
    },
  },
  {
    topicId: 'math-market',
    grade: 3,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Maths Mela',
      chapter: 'Give and Take',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/maths-mela/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared (also relates to House of Hundreds - I & II)',
    },
  },
  {
    topicId: 'math-market',
    grade: 4,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Math Mela',
      chapter: 'Thousands Around Us',
      chapterNo: 4,
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com / aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'Sources conflict; confirm book edition and chapter list',
    },
  },
  {
    topicId: 'math-market',
    grade: 5,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 Maths',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= math-shapes =================
  {
    topicId: 'math-shapes',
    grade: 1,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'Joyful Mathematics',
      chapter: 'Finding the Furry Cat!',
      matchType: 'title-match',
      status: 'candidate',
      source: 'ciet.ncert.gov.in/audio-book/118',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'math-shapes',
    grade: 2,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'Joyful Mathematics',
      chapter: 'Shapes Around Us',
      matchType: 'title-match',
      status: 'candidate',
      source: 'ciet.ncert.gov.in/audio-book/121',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'math-shapes',
    grade: 3,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Maths Mela',
      chapter: 'Fun with Shapes',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/maths-mela/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'math-shapes',
    grade: 4,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Math Mela',
      chapter: 'Shapes Around Us',
      chapterNo: 1,
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com / aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'Sources conflict; confirm book edition and chapter list',
    },
  },
  {
    topicId: 'math-shapes',
    grade: 5,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 Maths',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= evs-body =================
  {
    topicId: 'evs-body',
    grade: 1,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-body',
    grade: 2,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-body',
    grade: 3,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Our Wondrous World',
      chapter: 'Staying Healthy and Happy',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/our-wondrous-world/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'evs-body',
    grade: 4,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Our Wondrous World',
      chapter: 'Food for Health',
      matchType: 'title-match',
      status: 'candidate',
      source: 'schools.aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared (also relates to Happy and Healthy Living)',
    },
  },
  {
    topicId: 'evs-body',
    grade: 5,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= evs-plants =================
  {
    topicId: 'evs-plants',
    grade: 1,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-plants',
    grade: 2,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-plants',
    grade: 3,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Our Wondrous World',
      chapter: 'Getting to Know Plants',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/our-wondrous-world/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared (also relates to Plants and Animals Live Together)',
    },
  },
  {
    topicId: 'evs-plants',
    grade: 4,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Our Wondrous World',
      chapter: 'Nature Trail',
      matchType: 'title-match',
      status: 'candidate',
      source: 'schools.aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared (also relates to Growing Up with Nature)',
    },
  },
  {
    topicId: 'evs-plants',
    grade: 5,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= math-time =================
  {
    topicId: 'math-time',
    grade: 1,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'Joyful Mathematics',
      chapter: 'How do I Spend my Day?',
      matchType: 'title-match',
      status: 'candidate',
      source: 'ciet.ncert.gov.in/audio-book/118',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'math-time',
    grade: 2,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'Joyful Mathematics',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'extension',
      source: 'ciet.ncert.gov.in/audio-book/121',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'No matching NCERT chapter identified yet; own extension content',
    },
  },
  {
    topicId: 'math-time',
    grade: 3,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Maths Mela',
      chapter: 'Time Goes On',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/maths-mela/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'math-time',
    grade: 4,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Math Mela',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'extension',
      source: 'competishun.com / aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'Sources conflict; confirm book edition and chapter list',
    },
  },
  {
    topicId: 'math-time',
    grade: 5,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 Maths',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= evs-neighbourhood =================
  {
    topicId: 'evs-neighbourhood',
    grade: 1,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-neighbourhood',
    grade: 2,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-neighbourhood',
    grade: 3,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Our Wondrous World',
      chapter: 'Family and Friends',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/our-wondrous-world/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared (also relates to Going to the Mela)',
    },
  },
  {
    topicId: 'evs-neighbourhood',
    grade: 4,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Our Wondrous World',
      chapter: 'Exploring Our Neighbourhood',
      matchType: 'title-match',
      status: 'candidate',
      source: 'schools.aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'evs-neighbourhood',
    grade: 5,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= math-fractions =================
  {
    topicId: 'math-fractions',
    grade: 1,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'Joyful Mathematics',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'extension',
      source: 'ciet.ncert.gov.in/audio-book/118',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'No matching NCERT chapter identified yet; own extension content',
    },
  },
  {
    topicId: 'math-fractions',
    grade: 2,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'Joyful Mathematics',
      chapter: 'Grouping and Sharing',
      matchType: 'title-match',
      status: 'candidate',
      source: 'ciet.ncert.gov.in/audio-book/121',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'math-fractions',
    grade: 3,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Maths Mela',
      chapter: 'Fair Share',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/maths-mela/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'math-fractions',
    grade: 4,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Math Mela',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'extension',
      source: 'competishun.com / aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'Sources conflict; confirm book edition and chapter list',
    },
  },
  {
    topicId: 'math-fractions',
    grade: 5,
    subject: 'math',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 Maths',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= evs-animals =================
  {
    topicId: 'evs-animals',
    grade: 1,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 1,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-animals',
    grade: 2,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 2,
      book: 'NCERT Class 1-2 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ciet.ncert.gov.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 1-2 EVS not researched; verify against official syllabus',
    },
  },
  {
    topicId: 'evs-animals',
    grade: 3,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 3,
      book: 'Our Wondrous World',
      chapter: 'Plants and Animals Live Together',
      matchType: 'title-match',
      status: 'candidate',
      source: 'competishun.com/ncert-book/our-wondrous-world/',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'evs-animals',
    grade: 4,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 4,
      book: 'Our Wondrous World',
      chapter: 'Living Together',
      matchType: 'title-match',
      status: 'candidate',
      source: 'schools.aglasem.com',
      sourceType: 'secondary',
      checkedOn: CHECK_DATE,
      note: 'matched by chapter title only; learning outcome not yet compared',
    },
  },
  {
    topicId: 'evs-animals',
    grade: 5,
    subject: 'evs',
    mapping: {
      board: 'NCERT',
      classLevel: 5,
      book: 'NCERT Class 5 EVS',
      chapter: 'TO RESEARCH',
      matchType: 'none',
      status: 'to-research',
      source: 'ncert.nic.in',
      sourceType: 'official',
      checkedOn: CHECK_DATE,
      note: 'NCERT Class 5 not researched; confirm book edition and chapter list',
    },
  },

  // ================= Maharashtra State Board (Balbharati) All Classes: NOT RESEARCHED =================
  ...([
    'evs-water',
    'math-market',
    'math-shapes',
    'evs-body',
    'evs-plants',
    'math-time',
    'evs-neighbourhood',
    'math-fractions',
    'evs-animals',
  ] as const).flatMap((topicId) => {
    const subject: Subject = topicId.startsWith('math') ? 'math' : 'evs';
    const bookTitle = subject === 'math' ? 'Ganit (Balbharati)' : 'Parisar Abhyas (Balbharati)';
    return ([1, 2, 3, 4, 5] as Grade[]).map((grade): TopicGradeCurriculumSource => ({
      topicId,
      grade,
      subject,
      mapping: {
        board: 'Maharashtra State Board',
        classLevel: grade,
        book: bookTitle,
        chapter: 'TO RESEARCH',
        matchType: 'none',
        status: 'to-research',
        source: 'ebalbharati.in',
        sourceType: 'official',
        checkedOn: CHECK_DATE,
        note: 'Maharashtra State Board textbooks pending physical/digital copy check',
      },
    }));
  }),

  // ================= Language Marathi Topics (Task 2 preview placeholders: status 'to-research') =================
  ...(['lang-letters', 'lang-passages', 'lang-writing'] as const).flatMap((topicId) => {
    return ([1, 2, 3, 4, 5] as Grade[]).flatMap((grade): TopicGradeCurriculumSource[] => [
      {
        topicId,
        grade,
        subject: 'lang' as Subject,
        mapping: {
          board: 'Maharashtra State Board',
          classLevel: grade,
          book: 'Sulabhbharati / Balbharati Marathi',
          chapter: 'TO RESEARCH',
          matchType: 'none',
          status: 'to-research',
          source: 'ebalbharati.in',
          sourceType: 'official',
          checkedOn: CHECK_DATE,
          note: 'Marathi language topic alignment pending textbook review',
        },
      },
      {
        topicId,
        grade,
        subject: 'lang' as Subject,
        mapping: {
          board: 'NCERT',
          classLevel: grade,
          book: 'NCERT Language / FLN Curriculum',
          chapter: 'TO RESEARCH',
          matchType: 'none',
          status: 'to-research',
          source: 'ciet.ncert.gov.in',
          sourceType: 'official',
          checkedOn: CHECK_DATE,
          note: 'Language learning outcomes pending NCERT foundational stage review',
        },
      },
    ]);
  }),
];

/**
 * Returns curriculum sources for a specific topic and grade.
 */
export function getCurriculumSources(topicId: string, grade: Grade): CurriculumMapping[] {
  return CURRICULUM_MAPPINGS
    .filter((s) => s.topicId === topicId && s.grade === grade)
    .map((s) => s.mapping);
}

/**
 * Formats a short offline plain-text curriculum citation for worksheet footer.
 */
export function formatCurriculumFooter(topicId: string, grade: Grade): string {
  const sources = getCurriculumSources(topicId, grade);
  if (!sources.length) return '';
  const first = sources[0];
  const parts: string[] = [first.board, first.book];
  if (first.chapter && first.chapter !== 'TO RESEARCH' && !first.chapter.startsWith('TO ')) {
    const chNo = first.chapterNo ? `Ch ${first.chapterNo}: ` : '';
    parts.push(`${chNo}${first.chapter}`);
  }
  if (first.status === 'candidate') {
    parts.push('(Curriculum alignment: Candidate title match)');
  } else if (first.status === 'extension') {
    parts.push('(Curriculum alignment: Extension content)');
  } else if (first.status === 'to-research') {
    parts.push('(Curriculum alignment: To research against official textbook)');
  } else if (first.status === 'verified') {
    parts.push(`(Verified: ${first.verifiedBy || 'Reviewer'}, ${first.verifiedOn || ''})`);
  }
  return parts.join(' · ');
}

export interface CurriculumCoverageCounts {
  candidate: number;
  verified: number;
  extension: number;
  toResearch: number;
  total: number;
}

/**
 * Computes coverage statistics dynamically across all mappings.
 */
export function getCurriculumCoverageCounts(topicIds?: string[]): CurriculumCoverageCounts {
  const items = topicIds
    ? CURRICULUM_MAPPINGS.filter((m) => topicIds.includes(m.topicId))
    : CURRICULUM_MAPPINGS;

  let candidate = 0;
  let verified = 0;
  let extension = 0;
  let toResearch = 0;

  for (const item of items) {
    if (item.mapping.status === 'candidate') candidate++;
    else if (item.mapping.status === 'verified') verified++;
    else if (item.mapping.status === 'extension') extension++;
    else if (item.mapping.status === 'to-research') toResearch++;
  }

  return {
    candidate,
    verified,
    extension,
    toResearch,
    total: items.length,
  };
}

/**
 * Exports curriculum mapping to standard CSV.
 */
export function exportCurriculumMappingToCsv(topicIds?: string[]): string {
  const items = topicIds
    ? CURRICULUM_MAPPINGS.filter((m) => topicIds.includes(m.topicId))
    : CURRICULUM_MAPPINGS;

  const header = ['Topic ID', 'Subject', 'Class Level', 'Board', 'Book', 'Chapter', 'Chapter No', 'Match Type', 'Status', 'Source', 'Source Type', 'Checked On', 'Verified By', 'Verified On', 'Note'];
  
  const escapeCsv = (val?: string | number) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = items.map((item) => [
    escapeCsv(item.topicId),
    escapeCsv(item.subject.toUpperCase()),
    escapeCsv(item.grade),
    escapeCsv(item.mapping.board),
    escapeCsv(item.mapping.book),
    escapeCsv(item.mapping.chapter),
    escapeCsv(item.mapping.chapterNo ?? ''),
    escapeCsv(item.mapping.matchType),
    escapeCsv(item.mapping.status),
    escapeCsv(item.mapping.source),
    escapeCsv(item.mapping.sourceType),
    escapeCsv(item.mapping.checkedOn),
    escapeCsv(item.mapping.verifiedBy ?? ''),
    escapeCsv(item.mapping.verifiedOn ?? ''),
    escapeCsv(item.mapping.note ?? ''),
  ].join(','));

  return [header.join(','), ...rows].join('\r\n');
}
