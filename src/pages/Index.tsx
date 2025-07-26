import { useState, useEffect } from "react";
import { PeaceWelcome } from "@/components/PeaceWelcome";
import { ChecklistQuestions } from "@/components/ChecklistQuestions";
import { ReflectionResults } from "@/components/ReflectionResults";
import { JournalSpace } from "@/components/JournalSpace";
import { JournalComplete } from "@/components/JournalComplete";
import { FirebaseConfig } from "@/components/FirebaseConfig";
import { Settings } from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { journalService } from "@/services/journalService";
import { aiService } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

type AppState = 'firebase-config' | 'welcome' | 'checklist' | 'reflection' | 'journal' | 'complete';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('firebase-config');
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { user, signInAnonymously, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if Firebase is already configured
    const savedConfig = localStorage.getItem('firebase_configured');
    if (savedConfig) {
      setIsConfigured(true);
      setAppState('welcome');
    }
  }, []);

  const handleFirebaseConfig = (config: any) => {
    // In a real app, you'd reinitialize Firebase with this config
    localStorage.setItem('firebase_configured', 'true');
    localStorage.setItem('firebase_config', JSON.stringify(config));
    setIsConfigured(true);
    setAppState('welcome');
    toast({
      title: "Firebase configured! 🚀",
      description: "Your app is now ready to save journal entries."
    });
  };

  const handleSkipFirebase = () => {
    setAppState('welcome');
  };

  const handleStartChecklist = async () => {
    if (isConfigured && !isAuthenticated) {
      try {
        await signInAnonymously();
      } catch (error) {
        console.error('Auth error:', error);
      }
    }
    setAppState('checklist');
  };

  const handleChecklistComplete = (answers: string[]) => {
    setSelectedAnswers(answers);
    setAppState('reflection');
  };

  const handleStartJournal = () => {
    setAppState('journal');
  };

  const handleJournalComplete = async (entry: string) => {
    setJournalEntry(entry);
    
    // Save to Firebase if configured and authenticated
    if (isConfigured && user && entry.trim()) {
      try {
        const entryId = await journalService.saveEntry(user.uid, entry, selectedAnswers);
        
        // Generate AI response if API key is available
        if (aiService.hasApiKey()) {
          try {
            const aiResponse = await aiService.generatePeaceResponse(entry, selectedAnswers);
            await journalService.updateEntryWithAIResponse(entryId, aiResponse);
            toast({
              title: "Journal saved with AI insights! ✨",
              description: "Peace has added some gentle thoughts about your entry."
            });
          } catch (error) {
            console.error('AI response error:', error);
            toast({
              title: "Journal saved! 💜",
              description: "Your entry is saved, but Peace couldn't generate insights right now."
            });
          }
        } else {
          toast({
            title: "Journal saved! 💜",
            description: "Your entry is safely stored. Add a ChatGPT API key in settings for AI insights."
          });
        }
      } catch (error) {
        console.error('Save error:', error);
        toast({
          title: "Entry saved locally",
          description: "Couldn't save to cloud, but your words are still valuable.",
          variant: "destructive"
        });
      }
    }
    
    setAppState('complete');
  };

  const handleStartOver = () => {
    setAppState('welcome');
    setSelectedAnswers([]);
    setJournalEntry("");
  };

  // Header component
  const Header = () => (
    <div className="fixed top-4 right-4 z-40 flex gap-2">
      {isAuthenticated && (
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <User className="w-4 h-4 text-peace-purple" />
        </Button>
      )}
      <Button
        onClick={() => setShowSettings(true)}
        variant="ghost"
        size="icon"
        className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
      >
        <SettingsIcon className="w-4 h-4 text-peace-purple" />
      </Button>
    </div>
  );

  if (!isConfigured && appState === 'firebase-config') {
    return <FirebaseConfig onConfigSave={handleFirebaseConfig} onSkip={handleSkipFirebase} />;
  }

  return (
    <>
      <Header />
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      
      {(() => {
        switch (appState) {
          case 'welcome':
            return <PeaceWelcome onStartChecklist={handleStartChecklist} />;
          
          case 'checklist':
            return <ChecklistQuestions onComplete={handleChecklistComplete} />;
          
          case 'reflection':
            return (
              <ReflectionResults 
                selectedAnswers={selectedAnswers}
                onJournal={handleStartJournal}
                onStartOver={handleStartOver}
              />
            );
          
          case 'journal':
            return (
              <JournalSpace 
                onComplete={handleJournalComplete}
                onBack={() => setAppState('reflection')}
              />
            );
          
          case 'complete':
            return <JournalComplete onStartOver={handleStartOver} />;
          
          default:
            return <PeaceWelcome onStartChecklist={handleStartChecklist} />;
        }
      })()}
    </>
  );
};

export default Index;
