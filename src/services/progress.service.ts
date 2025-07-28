import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types';

export interface InterviewSessionRecord {
  sessionId: string;
  topic: string;
  score: number;
  startedAt: Timestamp;
  finishedAt: Timestamp;
  transcript?: string;
  feedback?: string;
  evaluation?: any;
}

const userSessionsCol = (uid: string) => collection(db, 'users', uid, 'sessions');

/**
 * Saves a finished interview session to Firestore under users/{uid}/sessions/{sessionId}
 */
export const saveInterviewSession = async (uid: string, data: InterviewSessionRecord) => {
  await setDoc(doc(userSessionsCol(uid), data.sessionId), data);
};

/**
 * Loads a single interview session
 */
export const getInterviewSession = async (uid: string, sessionId: string): Promise<InterviewSessionRecord | null> => {
  const snap = await getDoc(doc(userSessionsCol(uid), sessionId));
  return snap.exists() ? (snap.data() as InterviewSessionRecord) : null;
};

/**
 * Lists recent interview sessions (newest first, up to `limit`)
 */
export const listInterviewSessions = async (uid: string, limit = 20): Promise<InterviewSessionRecord[]> => {
  const q = query(userSessionsCol(uid), orderBy('finishedAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => d.data() as InterviewSessionRecord);
};
