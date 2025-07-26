import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb, Heart, Sparkles } from "lucide-react";

interface Insight {
  title: string;
  explanation: string;
  suggestion: string;
}

const insightMap: Record<string, Insight> = {
  water: {
    title: "Your body needs gentle care",
    explanation: "Dehydration can quietly affect our mood and energy, making everything feel harder than it needs to be.",
    suggestion: "Try sipping some water slowly, maybe with a slice of lemon or cucumber to make it feel special."
  },
  food: {
    title: "Nourishment for your soul",
    explanation: "When we haven't fed ourselves well, our emotions can feel more intense and overwhelming.",
    suggestion: "Consider having something warm and comforting—even a piece of toast with honey can help ground you."
  },
  sleep: {
    title: "Rest is a form of self-love",
    explanation: "Poor sleep can make our minds more reactive and our hearts more fragile. You're not broken—you're tired.",
    suggestion: "Tonight, try to wind down 30 minutes earlier. Even if you can't sleep, rest is still healing."
  },
  unprepared: {
    title: "The anxiety of the unknown",
    explanation: "Feeling unprepared can create a low hum of worry that colors everything else. This is so normal.",
    suggestion: "Write down one small thing you can do to feel more ready. Even gathering supplies or making a list helps."
  },
  argument: {
    title: "Emotional residue is real",
    explanation: "Conflict leaves traces in our nervous system. Your body remembers even when your mind tries to move on.",
    suggestion: "Take three deep breaths and shake out your hands. Sometimes we need to physically release tension."
  },
  lingering: {
    title: "Words can echo in sensitive hearts",
    explanation: "When we care deeply about connection, others' words or actions can replay in our minds like a song on repeat.",
    suggestion: "Try writing down what's bothering you, then ask: 'Is this thought helping me or hurting me right now?'"
  },
  judged: {
    title: "The weight of comparison",
    explanation: "The fear of not being enough can feel crushing. But you're already worthy, just as you are in this moment.",
    suggestion: "Name three things you've done well recently, no matter how small. You're doing better than you think."
  },
  unwell: {
    title: "Physical discomfort affects everything",
    explanation: "When our bodies feel off, our emotional resilience naturally decreases. This is wisdom, not weakness.",
    suggestion: "Honor what your body needs—rest, warmth, gentle movement, or just acknowledging the discomfort."
  },
  disconnected: {
    title: "The longing to feel at home in yourself",
    explanation: "Sometimes we can feel like strangers in our own skin. This disconnection can feel deeply unsettling.",
    suggestion: "Try placing your hand on your heart and taking five slow breaths. You're here, you're real, you're enough."
  },
  hormonal: {
    title: "Hormonal wisdom",
    explanation: "Your body's cycles can make emotions feel more intense. This isn't 'just hormones'—it's your body's truth.",
    suggestion: "Be extra gentle with yourself. Consider what you needed as a child when you felt sensitive, and offer that to yourself now."
  },
  lonely: {
    title: "The ache of disconnection",
    explanation: "Feeling unseen or lonely can create a deep sadness that touches everything. Your need for connection is beautiful and human.",
    suggestion: "Reach out to one person, even if it's just sending a heart emoji. Or write a letter to yourself with love."
  }
};

interface ReflectionResultsProps {
  selectedAnswers: string[];
  onJournal: () => void;
  onStartOver: () => void;
}

export function ReflectionResults({ selectedAnswers, onJournal, onStartOver }: ReflectionResultsProps) {
  const relevantInsights = selectedAnswers.map(id => ({
    id,
    ...insightMap[id]
  })).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-comfort p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-comfort border-peace-pink/20">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 mx-auto text-peace-purple mb-4" />
            <h2 className="text-2xl font-bold text-peace-text-soft mb-4">
              Here's what I noticed 💜
            </h2>
            <p className="text-peace-text-gentle leading-relaxed">
              Based on what you shared, here are a few things that might be adding weight to your heart today. 
              I could be wrong—and that's okay. We're just exploring together.
            </p>
          </div>

          {relevantInsights.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 mx-auto text-peace-purple mb-4" />
              <p className="text-peace-text-gentle mb-6">
                It sounds like you might be feeling something that doesn't fit into these categories, 
                and that's completely valid. Sometimes our hearts carry things that are hard to name.
              </p>
              <p className="text-peace-text-soft">
                Would you like to explore this feeling through some gentle writing together?
              </p>
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {relevantInsights.map((insight) => (
                <div key={insight.id} className="bg-gradient-gentle p-6 rounded-xl border border-peace-pink/20">
                  <h3 className="text-lg font-semibold text-peace-text-soft mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-peace-purple" />
                    {insight.title}
                  </h3>
                  <p className="text-peace-text-gentle mb-4 leading-relaxed">
                    ✨ {insight.explanation}
                  </p>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-peace-purple mt-0.5 flex-shrink-0" />
                    <p className="text-peace-text-soft">
                      💡 {insight.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onJournal}
                variant="comfort"
                size="lg"
              >
                Let's write together 📝
              </Button>
              <Button 
                onClick={onStartOver}
                variant="secondary"
                size="lg"
              >
                Start over
              </Button>
            </div>
            
            <div className="bg-peace-warm/50 p-6 rounded-xl border border-peace-pink/20 mt-8">
              <p className="text-peace-text-soft leading-relaxed text-center">
                🫶 <strong>You don't need to have all the answers today.</strong> You showed up. You listened to yourself. 
                You cared. That's already more than enough.
              </p>
              <p className="text-peace-text-gentle mt-3 text-center">
                I'm proud of you. I'll be here anytime the world feels too loud. 🐾
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}