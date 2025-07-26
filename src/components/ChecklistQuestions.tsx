import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistQuestion {
  id: string;
  text: string;
  category: 'physical' | 'emotional' | 'social' | 'mental';
}

const questions: ChecklistQuestion[] = [
  { id: 'water', text: 'Did you drink enough water today?', category: 'physical' },
  { id: 'food', text: 'Have you eaten something nourishing?', category: 'physical' },
  { id: 'sleep', text: 'Did you sleep well recently?', category: 'physical' },
  { id: 'unprepared', text: 'Is there something coming up that you feel unprepared for?', category: 'mental' },
  { id: 'argument', text: 'Have you had an argument or awkward moment lately?', category: 'social' },
  { id: 'lingering', text: "Is someone's words or actions still lingering in your mind?", category: 'emotional' },
  { id: 'judged', text: 'Are you worried about falling behind or being judged?', category: 'mental' },
  { id: 'unwell', text: 'Are you feeling physically unwell or overstimulated?', category: 'physical' },
  { id: 'disconnected', text: 'Do you feel disconnected from your body or appearance?', category: 'emotional' },
  { id: 'hormonal', text: 'Are you close to your period or noticing a hormonal shift?', category: 'physical' },
  { id: 'lonely', text: "Are you feeling lonely or like you haven't truly been seen lately?", category: 'social' },
];

interface ChecklistQuestionsProps {
  onComplete: (selectedAnswers: string[]) => void;
}

export function ChecklistQuestions({ onComplete }: ChecklistQuestionsProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleAnswerChange = (questionId: string, checked: boolean) => {
    if (checked) {
      setSelectedAnswers(prev => [...prev, questionId]);
    } else {
      setSelectedAnswers(prev => prev.filter(id => id !== questionId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-comfort p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 shadow-comfort border-peace-pink/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-peace-text-soft mb-4">
              Let's check in together 💜
            </h2>
            <p className="text-peace-text-gentle leading-relaxed">
              Sometimes when we feel anxious, our minds forget to check in with our bodies, hearts, 
              and the world around us. I'm going to ask you a few gentle questions—select any that 
              feel true for you today. You can skip any you're unsure about.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {questions.map((question) => (
              <div key={question.id} className="flex items-start space-x-3 p-4 rounded-lg hover:bg-peace-lavender/20 transition-colors">
                <Checkbox
                  id={question.id}
                  checked={selectedAnswers.includes(question.id)}
                  onCheckedChange={(checked) => handleAnswerChange(question.id, Boolean(checked))}
                  className="mt-1"
                />
                <label 
                  htmlFor={question.id} 
                  className="text-peace-text-soft leading-relaxed cursor-pointer flex-1"
                >
                  {question.text}
                </label>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <Button 
              onClick={() => onComplete(selectedAnswers)}
              variant="comfort"
              size="lg"
              className="w-full sm:w-auto"
            >
              Help me understand what I'm feeling
            </Button>
            
            <p className="text-sm text-peace-text-gentle">
              Take your time. There's no right or wrong answer here. 🌱
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}