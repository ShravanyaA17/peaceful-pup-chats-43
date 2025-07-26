import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioButtonGroup } from "@/components/ui/radio-button-group";
import { Edit3 } from "lucide-react";

interface ChecklistQuestion {
  id: string;
  text: string;
  category: "physical" | "emotional" | "social" | "mental";
}

interface QuestionAnswer {
  questionId: string;
  answer: "yes" | "no" | "maybe" | "";
}

const questions: ChecklistQuestion[] = [
  {
    id: "water",
    text: "Did you drink enough water today?",
    category: "physical",
  },
  {
    id: "food",
    text: "Have you eaten something nourishing?",
    category: "physical",
  },
  { id: "sleep", text: "Did you sleep well recently?", category: "physical" },
  {
    id: "unprepared",
    text: "Is there something coming up that you feel unprepared for?",
    category: "mental",
  },
  {
    id: "argument",
    text: "Have you had an argument or awkward moment lately?",
    category: "social",
  },
  {
    id: "lingering",
    text: "Is someone's words or actions still lingering in your mind?",
    category: "emotional",
  },
  {
    id: "judged",
    text: "Are you worried about falling behind or being judged?",
    category: "mental",
  },
  {
    id: "unwell",
    text: "Are you feeling physically unwell or overstimulated?",
    category: "physical",
  },
  {
    id: "disconnected",
    text: "Do you feel disconnected from your body or appearance?",
    category: "emotional",
  },
  {
    id: "hormonal",
    text: "Are you close to your period or noticing a hormonal shift?",
    category: "physical",
  },
  {
    id: "lonely",
    text: "Are you feeling lonely or like you haven't truly been seen lately?",
    category: "social",
  },
];

interface ChecklistQuestionsProps {
  onComplete: (answers: QuestionAnswer[], personalThoughts: string) => void;
}

export function ChecklistQuestions({ onComplete }: ChecklistQuestionsProps) {
  const [answers, setAnswers] = useState<QuestionAnswer[]>(
    questions.map((q) => ({ questionId: q.id, answer: "" as const }))
  );
  const [personalThoughts, setPersonalThoughts] = useState<string>("");
  const [wordCount, setWordCount] = useState(0);

  const handleAnswerChange = (
    questionId: string,
    answer: "yes" | "no" | "maybe"
  ) => {
    setAnswers((prev) =>
      prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a))
    );
  };

  const handlePersonalThoughtsChange = (value: string) => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length <= 100) {
      setPersonalThoughts(value);
      setWordCount(words.length);
    }
  };

  const getAnswerForQuestion = (questionId: string): string => {
    return answers.find((a) => a.questionId === questionId)?.answer || "";
  };

  const answeredQuestions = answers.filter((a) => a.answer !== "").length;

  const radioOptions = [
    {
      value: "yes",
      label: "Yes",
      color: "border-red-500 bg-red-500 text-white",
    },
    {
      value: "maybe",
      label: "Maybe",
      color: "border-yellow-500 bg-yellow-500 text-white",
    },
    {
      value: "no",
      label: "No",
      color: "border-green-500 bg-green-500 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-comfort p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 shadow-comfort border-peace-pink/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-peace-text-soft mb-4">
              Let's check in together
            </h2>
            <p className="text-peace-text-gentle leading-relaxed mb-4">
              Sometimes when we feel anxious, our minds forget to check in with
              our bodies, hearts, and the world around us. I'm going to ask you
              a few gentle questions—answer honestly about how you're feeling
              today.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {questions.map((question) => (
              <div
                key={question.id}
                className="p-4 rounded-lg bg-white/50 border border-peace-pink/10"
              >
                <div className="mb-3">
                  <label className="text-peace-text-soft leading-relaxed font-medium block">
                    {question.text}
                  </label>
                  <span className="text-xs text-peace-text-gentle capitalize">
                    {question.category}
                  </span>
                </div>
                <RadioButtonGroup
                  name={question.id}
                  value={getAnswerForQuestion(question.id)}
                  onChange={(value) =>
                    handleAnswerChange(
                      question.id,
                      value as "yes" | "no" | "maybe"
                    )
                  }
                  options={radioOptions}
                />
              </div>
            ))}
          </div>

          {/* Personal Thoughts Section */}
          <div className="mb-8">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                Share Your Own Thoughts
              </h3>
              <p className="text-slate-700 mb-4">
                Sometimes you know yourself better than any checklist. Share
                your own thoughts about what might be making you feel anxious
                today (up to 100 words):
              </p>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="personal-thoughts"
                    className="text-sm font-medium text-slate-700"
                  >
                    Your personal insights:
                  </Label>
                  <Textarea
                    id="personal-thoughts"
                    placeholder="For example: 'I have a presentation tomorrow and I haven't prepared enough...' or 'I've been overthinking a conversation I had with my friend...'"
                    value={personalThoughts}
                    onChange={(e) =>
                      handlePersonalThoughtsChange(e.target.value)
                    }
                    className="mt-2 min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {wordCount}/100 words
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Button
              onClick={() => onComplete(answers, personalThoughts)}
              variant="comfort"
              size="lg"
              className="w-full sm:w-auto"
            >
              Help me understand what I'm feeling
            </Button>

            <p className="text-sm text-peace-text-gentle">
              Take your time. There's no right or wrong answer here.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
