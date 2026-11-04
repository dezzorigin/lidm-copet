import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
// Pastikan titiknya cuma dua (../) bukan tiga atau lebih!
import { db } from '../config/firebase';

export interface UserScore {
  id?: string;
  playerName: string;
  score: number;
  testType: 'Pre-Test' | 'Post-Test';
  timestamp: Date;
}

export const saveScore = async (playerName: string, score: number, testType: 'Pre-Test' | 'Post-Test') => {
  try {
    const docRef = await addDoc(collection(db, 'student_scores'), {
      playerName,
      score,
      testType,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving score: ", error);
    throw error;
  }
};

export const getAllScores = async (): Promise<UserScore[]> => {
  try {
    const q = query(collection(db, 'student_scores'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      playerName: doc.data().playerName,
      score: doc.data().score,
      testType: doc.data().testType,
      timestamp: doc.data().timestamp.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching scores: ", error);
    return [];
  }
};