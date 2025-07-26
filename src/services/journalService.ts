import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp,
  doc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface JournalEntry {
  id?: string;
  userId: string;
  content: string;
  selectedAnswers: string[];
  aiResponse?: string;
  timestamp: Timestamp | Date;
}

export const journalService = {
  async saveEntry(userId: string, content: string, selectedAnswers: string[]): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'journalEntries'), {
        userId,
        content,
        selectedAnswers,
        timestamp: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  },

  async getUserEntries(userId: string): Promise<JournalEntry[]> {
    try {
      const q = query(
        collection(db, 'journalEntries'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as JournalEntry));
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }
  },

  async updateEntryWithAIResponse(entryId: string, aiResponse: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'journalEntries', entryId), {
        aiResponse
      });
    } catch (error) {
      console.error('Error updating entry with AI response:', error);
      throw error;
    }
  }
};