import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { EncryptionService } from "./encryptionService";

interface CheckinData {
  userId: string;
  selectedAnswers: Array<{
    questionId: string;
    answer: "yes" | "no" | "maybe" | "";
  }>;
  personalThoughts?: string;
  journalEntry?: string;
  encryptedJournal?: string; // Encrypted journal content
  aiResponse?: string;
  mood?: number; // 1-10 scale
  timestamp: any;
  hasEncryptedContent?: boolean; // Flag to indicate if journal is encrypted
}

export class DataService {
  // Save a check-in session with optional encrypted journal
  async saveCheckin(
    userId: string,
    checkinData: Omit<CheckinData, "userId" | "timestamp">,
    journalPassword?: string
  ) {
    try {
      let dataToSave = { ...checkinData };

      // If journal content exists and password provided, encrypt it
      if (checkinData.journalEntry && journalPassword) {
        const encryptedJournal = EncryptionService.encrypt(
          checkinData.journalEntry,
          journalPassword
        );
        dataToSave = {
          ...checkinData,
          journalEntry: undefined, // Don't store plain text
          encryptedJournal,
          hasEncryptedContent: true,
        };
      }

      const docRef = await addDoc(collection(db, "checkins"), {
        userId,
        ...dataToSave,
        timestamp: serverTimestamp(),
      });
      console.log("Check-in saved with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving check-in: ", error);
      throw error;
    }
  }

  // Save or update user's journal password hash (for verification)
  async saveJournalPasswordHash(userId: string, password: string) {
    try {
      const passwordHash = EncryptionService.hashPassword(password);
      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        {
          journalPasswordHash: passwordHash,
          hasJournalPassword: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log("Journal password hash saved");
    } catch (error) {
      console.error("Error saving password hash: ", error);
      throw error;
    }
  }

  // Verify user's journal password
  async verifyJournalPassword(
    userId: string,
    password: string
  ): Promise<boolean> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDocs(
        query(collection(db, "users"), where("__name__", "==", userId))
      );

      if (userDoc.empty) {
        return false;
      }

      const userData = userDoc.docs[0].data();
      const storedHash = userData.journalPasswordHash;

      if (!storedHash) {
        return false;
      }

      return EncryptionService.verifyPassword(password, storedHash);
    } catch (error) {
      console.error("Error verifying password: ", error);
      return false;
    }
  }

  // Get decrypted journal entries (requires password)
  async getDecryptedJournals(userId: string, password: string): Promise<any[]> {
    try {
      // First verify the password
      const isValidPassword = await this.verifyJournalPassword(
        userId,
        password
      );
      if (!isValidPassword) {
        throw new Error("Invalid journal password");
      }

      // Get all check-ins with encrypted content
      const q = query(
        collection(db, "checkins"),
        where("userId", "==", userId),
        where("hasEncryptedContent", "==", true),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const decryptedJournals = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        try {
          if (data.encryptedJournal) {
            const decryptedContent = EncryptionService.decrypt(
              data.encryptedJournal,
              password
            );
            decryptedJournals.push({
              id: doc.id,
              ...data,
              journalEntry: decryptedContent,
              encryptedJournal: undefined, // Don't return encrypted version
            });
          }
        } catch (decryptError) {
          console.warn(`Failed to decrypt journal ${doc.id}:`, decryptError);
          // Skip entries that can't be decrypted
        }
      }

      return decryptedJournals;
    } catch (error) {
      console.error("Error fetching decrypted journals: ", error);
      throw error;
    }
  }

  // Get user's check-in history
  async getUserCheckins(userId: string, limit = 30) {
    try {
      const q = query(
        collection(db, "checkins"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching check-ins: ", error);
      throw error;
    }
  }

  // Get mood trends over time
  async getMoodTrends(userId: string, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const q = query(
        collection(db, "checkins"),
        where("userId", "==", userId),
        where("timestamp", ">=", startDate),
        orderBy("timestamp", "asc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          date: data.timestamp?.toDate(),
          mood: data.mood,
          yesCount:
            data.selectedAnswers?.filter((a: any) => a.answer === "yes")
              .length || 0,
        };
      });
    } catch (error) {
      console.error("Error fetching mood trends: ", error);
      throw error;
    }
  }

  // Save user preferences
  async saveUserPreferences(userId: string, preferences: any) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        preferences,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving preferences: ", error);
      throw error;
    }
  }
}

export const dataService = new DataService();
