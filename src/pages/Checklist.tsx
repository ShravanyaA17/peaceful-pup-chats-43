import { useNavigate } from "react-router-dom";
import { ChecklistQuestions } from "@/components/ChecklistQuestions";
import { useAppContext } from "@/context/AppContext";
import { aiService } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

export default function Checklist() {
  const navigate = useNavigate();
  const { setSelectedAnswers } = useAppContext();
  const { toast } = useToast();

  const handleChecklistComplete = async (answers: string[]) => {
    setSelectedAnswers(answers);
    
    // Generate AI summary if API key is available
    if (aiService.hasApiKey() && answers.length > 0) {
      try {
        await aiService.generatePeaceResponse('', answers);
        toast({
          title: "AI insights generated ✨",
          description: "Peace has provided some gentle thoughts about your check-in."
        });
      } catch (error) {
        console.error('AI summary error:', error);
      }
    }
    
    navigate('/reflection');
  };

  return <ChecklistQuestions onComplete={handleChecklistComplete} />;
}