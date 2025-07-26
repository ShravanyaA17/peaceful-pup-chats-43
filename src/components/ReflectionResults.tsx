import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Sparkles,
  Brain,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Download,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { aiService } from "@/services/aiService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DogLoadingAnimation from "@/components/DogLoadingAnimation";

interface Insight {
  title: string;
  explanation: string;
  suggestion: string;
}

interface QuestionAnswer {
  questionId: string;
  answer: "yes" | "no" | "maybe" | "";
}

const insightMap: Record<string, Insight> = {
  water: {
    title: "Your body needs gentle care",
    explanation:
      "Dehydration can quietly affect our mood and energy, making everything feel harder than it needs to be.",
    suggestion:
      "Try sipping some water slowly, maybe with a slice of lemon or cucumber to make it feel special.",
  },
  food: {
    title: "Nourishment for your soul",
    explanation:
      "When we haven't fed ourselves well, our emotions can feel more intense and overwhelming.",
    suggestion:
      "Consider having something warm and comforting—even a piece of toast with honey can help ground you.",
  },
  sleep: {
    title: "Rest is a form of self-love",
    explanation:
      "Poor sleep can make our minds more reactive and our hearts more fragile. You're not broken—you're tired.",
    suggestion:
      "Tonight, try to wind down 30 minutes earlier. Even if you can't sleep, rest is still healing.",
  },
  unprepared: {
    title: "The anxiety of the unknown",
    explanation:
      "Feeling unprepared can create a low hum of worry that colors everything else. This is so normal.",
    suggestion:
      "Write down one small thing you can do to feel more ready. Even gathering supplies or making a list helps.",
  },
  argument: {
    title: "Emotional residue is real",
    explanation:
      "Conflict leaves traces in our nervous system. Your body remembers even when your mind tries to move on.",
    suggestion:
      "Take three deep breaths and shake out your hands. Sometimes we need to physically release tension.",
  },
  lingering: {
    title: "Words can echo in sensitive hearts",
    explanation:
      "When we care deeply about connection, others' words or actions can replay in our minds like a song on repeat.",
    suggestion:
      "Try writing down what's bothering you, then ask: 'Is this thought helping me or hurting me right now?'",
  },
  judged: {
    title: "The weight of comparison",
    explanation:
      "The fear of not being enough can feel crushing. But you're already worthy, just as you are in this moment.",
    suggestion:
      "Name three things you've done well recently, no matter how small. You're doing better than you think.",
  },
  unwell: {
    title: "Physical discomfort affects everything",
    explanation:
      "When our bodies feel off, our emotional resilience naturally decreases. This is wisdom, not weakness.",
    suggestion:
      "Honor what your body needs—rest, warmth, gentle movement, or just acknowledging the discomfort.",
  },
  disconnected: {
    title: "The longing to feel at home in yourself",
    explanation:
      "Sometimes we can feel like strangers in our own skin. This disconnection can feel deeply unsettling.",
    suggestion:
      "Try placing your hand on your heart and taking five slow breaths. You're here, you're real, you're enough.",
  },
  hormonal: {
    title: "Hormonal wisdom",
    explanation:
      "Your body's cycles can make emotions feel more intense. This isn't 'just hormones'—it's your body's truth.",
    suggestion:
      "Be extra gentle with yourself. Consider what you needed as a child when you felt sensitive, and offer that to yourself now.",
  },
  lonely: {
    title: "The ache of disconnection",
    explanation:
      "Feeling unseen or lonely can create a deep sadness that touches everything. Your need for connection is beautiful and human.",
    suggestion:
      "Reach out to one person, even if it's just sending a heart emoji. Or write a letter to yourself with love.",
  },
};

interface ReflectionResultsProps {
  selectedAnswers: QuestionAnswer[];
  personalThoughts: string;
  onJournal: () => void;
  onStartOver: () => void;
}

export function ReflectionResults({
  selectedAnswers,
  personalThoughts,
  onJournal,
  onStartOver,
}: ReflectionResultsProps) {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get only "yes" answers for traditional insights
  const yesAnswers = selectedAnswers.filter((a) => a.answer === "yes");
  const relevantInsights = yesAnswers
    .map((answer) => ({
      id: answer.questionId,
      ...insightMap[answer.questionId],
    }))
    .filter((insight) => insight.title);

  // Download PDF function
  const downloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#faf9f7",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const today = new Date().toLocaleDateString();
      pdf.save(`Peace-Reflection-${today}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Generate AI insights on mount
  useEffect(() => {
    const generateAIInsight = async () => {
      if (
        selectedAnswers.some((a) => a.answer !== "") ||
        personalThoughts.trim()
      ) {
        setIsLoadingAI(true);
        try {
          let insight = "";

          // If user provided personal thoughts, use the enhanced AI service method
          if (personalThoughts.trim()) {
            insight = await aiService.generatePersonalReasonsResponse(
              personalThoughts,
              selectedAnswers
            );
          } else {
            // Otherwise use the standard response based on checklist only
            insight = await aiService.generatePeaceResponse(
              "",
              selectedAnswers
            );
          }

          setAiInsight(insight);
        } catch (error) {
          console.error("Failed to generate AI insight:", error);
          // The AI service now handles errors gracefully and returns meaningful responses
          setAiInsight(
            "I'm experiencing some technical difficulties right now, but I want you to know that reaching out shows real strength. Please try again in a moment, or consider the guidance below. 💜"
          );
        } finally {
          setIsLoadingAI(false);
        }
      }
    };

    generateAIInsight();
  }, [selectedAnswers, personalThoughts]);

  const getAnswerIcon = (answer: string) => {
    switch (answer) {
      case "yes":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "no":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "maybe":
        return <HelpCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getAnswerColor = (answer: string) => {
    switch (answer) {
      case "yes":
        return "border-red-200 bg-red-50";
      case "no":
        return "border-green-200 bg-green-50";
      case "maybe":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-comfort p-6">
      <div className="max-w-4xl mx-auto">
        <div ref={contentRef}>
          <Card className="p-8 shadow-comfort border-peace-pink/20">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 mx-auto text-peace-purple mb-4" />
              <h2 className="text-2xl font-bold text-peace-text-soft mb-4">
                Here's what I noticed 💫
              </h2>
              <p className="text-peace-text-gentle leading-relaxed">
                Based on what you shared, here's a personalized reflection on
                how you're feeling today.
              </p>
            </div>

            {/* Personal Thoughts Section - only show if user provided thoughts */}
            {personalThoughts.trim() && (
              <div className="mb-8">
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-blue-600" />
                    Your Personal Insights 💭
                  </h3>
                  <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
                    <p className="text-blue-900 leading-relaxed italic">
                      "{personalThoughts}"
                    </p>
                  </div>
                  <p className="text-blue-700 text-sm mt-3">
                    Thank you for sharing your thoughts. These help me
                    understand you better and provide more personalized support.
                  </p>
                </Card>
              </div>
            )}

            {/* AI-Generated Insights */}
            {(aiInsight || isLoadingAI) && (
              <div className="mb-8">
                <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-slate-600" />
                    {personalThoughts.trim()
                      ? "Personalized AI Insights Based on Your Thoughts & Check-in ✨"
                      : "Personalized AI Insights & Micro-Tasks ✨"}
                  </h3>
                  {isLoadingAI ? (
                    <DogLoadingAnimation />
                  ) : (
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {aiInsight}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Quick Overview of Answers */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-peace-text-soft mb-4">
                Your Check-in Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedAnswers
                  .filter((a) => a.answer !== "")
                  .map((answer) => (
                    <div
                      key={answer.questionId}
                      className={`p-3 rounded-lg border ${getAnswerColor(
                        answer.answer
                      )} text-sm`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {getAnswerIcon(answer.answer)}
                        <span className="font-medium capitalize">
                          {answer.answer}
                        </span>
                      </div>
                      <div className="text-slate-600 text-xs">
                        {insightMap[answer.questionId]?.title ||
                          "Personal reflection"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Traditional Insights for "Yes" answers */}
            {relevantInsights.length > 0 && (
              <div className="space-y-6 mb-8">
                <h3 className="text-lg font-semibold text-peace-text-soft">
                  Areas that need extra care:
                </h3>
                {relevantInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="bg-gradient-gentle p-6 rounded-xl border border-peace-pink/20"
                  >
                    <h4 className="text-lg font-semibold text-peace-text-soft mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-peace-purple" />
                      {insight.title}
                    </h4>
                    <p className="text-peace-text-gentle mb-4 leading-relaxed">
                      ✨ {insight.explanation}
                    </p>
                    <div className="flex items-start gap-2">
                      <p className="text-peace-text-soft">
                        {insight.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {relevantInsights.length === 0 && !aiInsight && !isLoadingAI && (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 mx-auto text-peace-purple mb-4" />
                <p className="text-peace-text-gentle mb-6">
                  It sounds like you might be feeling something that doesn't fit
                  into these categories, and that's completely valid. Sometimes
                  our hearts carry things that are hard to name.
                </p>
                <p className="text-peace-text-soft">
                  Would you like to explore this feeling through some gentle
                  writing together?
                </p>
              </div>
            )}

            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={downloadPDF} variant="outline" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download as PDF
                </Button>
                <Button onClick={onJournal} variant="comfort" size="lg">
                  Let's write together
                </Button>
                <Button onClick={onStartOver} variant="secondary" size="lg">
                  Start over
                </Button>
              </div>

              <div className="bg-peace-warm/50 p-6 rounded-xl border border-peace-pink/20 mt-8">
                <p className="text-peace-text-soft leading-relaxed text-center">
                  <strong>You don't need to have all the answers today.</strong>{" "}
                  You showed up. You listened to yourself. You cared. That's
                  already more than enough.
                </p>
                <p className="text-peace-text-gentle mt-3 text-center">
                  I'm proud of you. I'll be here anytime the world feels too
                  loud.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
