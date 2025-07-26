import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  selectedAnswers: string[];
  setSelectedAnswers: (answers: string[]) => void;
  journalEntry: string;
  setJournalEntry: (entry: string) => void;
  isConfigured: boolean;
  setIsConfigured: (configured: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState(() => {
    return !!localStorage.getItem('firebase_configured');
  });

  return (
    <AppContext.Provider value={{
      selectedAnswers,
      setSelectedAnswers,
      journalEntry,
      setJournalEntry,
      isConfigured,
      setIsConfigured,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}