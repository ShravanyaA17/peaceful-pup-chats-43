import { useNavigate } from "react-router-dom";
import { JournalSpace } from "@/components/JournalSpace";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { journalService } from "@/services/journalService";
import { aiService } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

export default function Journal() {
  const navigate = useNavigate();
  const { selectedAnswers, setJournalEntry, isConfigured } = useAppContext();
  const { user } = useAuth();
  const { toast } = useToast();

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
    
    navigate('/complete');
  };

  const handleBack = () => {
    navigate('/reflection');
  };

  return (
    <JournalSpace 
      onComplete={handleJournalComplete}
      onBack={handleBack}
    />
  );
}