import { createContext, useContext, useState, ReactNode } from "react";

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedAnswers, setSelectedAnswers] = useState<QuestionAnswer[]>([]);
  const [personalThoughts, setPersonalThoughts] = useState<string>("");
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState(() => {
    // Automatically set as configured since Firebase credentials are now built-in
    localStorage.setItem("firebase_configured", "true");
    return true;
  });

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
