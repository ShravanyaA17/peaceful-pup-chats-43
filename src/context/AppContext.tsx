import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { dataService } from "@/services/dataService";

interface QuestionAnswer {
  questionId: string;
  answer: "yes" | "no" | "maybe" | "";
}

interface AppContextType {
  selectedAnswers: QuestionAnswer[];
  setSelectedAnswers: (answers: QuestionAnswer[]) => void;
  personalThoughts: string;
  setPersonalThoughts: (thoughts: string) => void;
  journalEntry: string;
  setJournalEntry: (entry: string) => void;
  isConfigured: boolean;
  setIsConfigured: (configured: boolean) => void;
  saveCurrentSession: () => Promise<void>;
  sessionSaved: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedAnswers, setSelectedAnswers] = useState<QuestionAnswer[]>([]);
  const [personalThoughts, setPersonalThoughts] = useState<string>("");
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [sessionSaved, setSessionSaved] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState(() => {
    // Automatically set as configured since Firebase credentials are now built-in
    localStorage.setItem("firebase_configured", "true");
    return true;
  });

  const { user, signInAnonymously } = useAuth();

  // Auto sign-in anonymously for privacy
  useEffect(() => {
    if (!user) {
      signInAnonymously().catch(console.error);
    }
  }, [user, signInAnonymously]);

  const saveCurrentSession = async () => {
    if (!user || sessionSaved) return;

    try {
      // Only save if there's meaningful data
      if (
        selectedAnswers.some((a) => a.answer !== "") ||
        personalThoughts.trim() ||
        journalEntry.trim()
      ) {
        await dataService.saveCheckin(user.uid, {
          selectedAnswers,
          personalThoughts: personalThoughts.trim() || undefined,
          journalEntry: journalEntry.trim() || undefined,
        });
        setSessionSaved(true);
        console.log("Session saved successfully");
      }
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedAnswers,
        setSelectedAnswers,
        personalThoughts,
        setPersonalThoughts,
        journalEntry,
        setJournalEntry,
        isConfigured,
        setIsConfigured,
        saveCurrentSession,
        sessionSaved,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
