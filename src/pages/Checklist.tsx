import { useNavigate } from "react-router-dom";
import { ChecklistQuestions } from "@/components/ChecklistQuestions";
import { useAppContext } from "@/context/AppContext";
import { aiService } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import DogLoadingAnimation from "@/components/DogLoadingAnimation";

interface QuestionAnswer {
  questionId: string;
  answer: "yes" | "no" | "maybe" | "";
}

export default function Checklist() {
  const navigate = useNavigate();
  const { setSelectedAnswers, setPersonalThoughts } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleChecklistComplete = async (
    answers: QuestionAnswer[],
    personalThoughts: string
  ) => {
    setIsLoading(true);
    setSelectedAnswers(answers);
    setPersonalThoughts(personalThoughts);

    // Add a brief delay to show the dog loader
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate AI summary if API key is available
    if (
      aiService.hasApiKey() &&
      (answers.some((a) => a.answer !== "") || personalThoughts.trim())
    ) {
      try {
        await aiService.generatePeaceResponse("", answers);
        if (personalThoughts.trim()) {
          await aiService.generatePersonalReasonsResponse(
            personalThoughts,
            answers
          );
        }
        toast({
          title: "AI insights generated",
          description:
            "Peace has provided some gentle thoughts and micro-tasks about your check-in.",
        });
      } catch (error) {
        console.error("AI summary error:", error);
      }
    }

    setIsLoading(false);
    navigate("/reflection");
  };

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen bg-gradient-comfort flex items-center justify-center">
          <DogLoadingAnimation />
        </div>
      ) : (
        <ChecklistQuestions onComplete={handleChecklistComplete} />
      )}
    </>
  );
}
