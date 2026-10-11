import Dexie, { type Table } from 'dexie';
import type { Grade, Status } from '../types';

export interface Student { id?: number; name: string; grade: Grade }
export interface ProgressRecord { id?: number; studentId: number; topicId: string; status: Status; score?: number; updatedAt: number }

class AppDB extends Dexie {
  students!: Table<Student, number>;
  records!: Table<ProgressRecord, number>;
  constructor() {
    super('multigrade-assistant');
    this.version(1).stores({
      students: '++id, grade',
      records: '++id, studentId, topicId, [studentId+topicId], updatedAt',
    });
  }
}
export const db = new AppDB();

let lastUndoFn: (() => Promise<void>) | null = null;

export function canUndo(): boolean {
  return lastUndoFn !== null;
}

export async function undoLast(): Promise<boolean> {
  if (!lastUndoFn) return false;
  const fn = lastUndoFn;
  lastUndoFn = null;
  await fn();
  return true;
}

export async function addStudent(name: string, grade: Grade) {
  const n = name.trim();
  if (n) await db.students.add({ name: n, grade });
}

export async function removeStudent(id: number) {
  await db.transaction('rw', db.students, db.records, async () => {
    await db.records.where('studentId').equals(id).delete();
    await db.students.delete(id);
  });
}

/** One record per student/topic/day (re-clicking the same day updates it); a new day appends history. Supports undo. */
export async function setStatus(studentId: number, topicId: string, status: Status, score?: number) {
  const list = await db.records.where('[studentId+topicId]').equals([studentId, topicId]).sortBy('updatedAt');
  const last = list[list.length - 1];
  const now = Date.now();
  if (last && new Date(last.updatedAt).toDateString() === new Date(now).toDateString()) {
    const prevStatus = last.status;
    const prevScore = last.score;
    const prevTime = last.updatedAt;
    await db.records.update(last.id!, { status, score, updatedAt: now });
    lastUndoFn = async () => {
      await db.records.update(last.id!, { status: prevStatus, score: prevScore, updatedAt: prevTime });
    };
  } else {
    const newId = await db.records.add({ studentId, topicId, status, score, updatedAt: now });
    lastUndoFn = async () => {
      await db.records.delete(newId);
    };
  }
}

export async function exportAll(): Promise<string> {
  return JSON.stringify({ version: 1, students: await db.students.toArray(), records: await db.records.toArray() }, null, 2);
}

export async function importAll(json: string) {
  const d = JSON.parse(json);
  if (!d || typeof d !== 'object') throw new Error('Invalid backup file');
  if (d.version !== undefined && d.version !== 1) {
    throw new Error(`Unsupported backup schema version: ${d.version}`);
  }
  if (!Array.isArray(d.students) || !Array.isArray(d.records)) {
    throw new Error('Invalid backup file: students or records missing');
  }
  await db.transaction('rw', db.students, db.records, async () => {
    await db.students.clear();
    await db.records.clear();
    await db.students.bulkAdd(d.students);
    await db.records.bulkAdd(d.records);
  });
  lastUndoFn = null;
}
