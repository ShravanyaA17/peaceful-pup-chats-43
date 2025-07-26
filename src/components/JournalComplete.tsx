import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Sparkles, RefreshCw } from "lucide-react";

interface JournalCompleteProps {
  onStartOver: () => void;
}

export function JournalComplete({ onStartOver }: JournalCompleteProps) {
  return (
    <div className="min-h-screen bg-gradient-comfort flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 text-center shadow-comfort border-peace-pink/20">
        <div className="mb-6">
          <Heart className="w-16 h-16 mx-auto text-peace-purple mb-4" />
          <Sparkles className="w-8 h-8 mx-auto text-peace-pink" />
        </div>
        
        <h2 className="text-2xl font-bold text-peace-text-soft mb-6">
          Thank you for sharing with me 💜
        </h2>
        
        <div className="space-y-4 text-peace-text-gentle leading-relaxed mb-8">
          <p>
            You took the time to listen to yourself today. You gave words to feelings that might have 
            been floating unnamed in your heart. That takes courage and self-compassion.
          </p>
          
          <p>
            Whatever you wrote down—whether it was one word or many pages—it matters. 
            Your feelings matter. Your experience matters. <strong>You matter.</strong>
          </p>
          
          <p>
            Sometimes the act of writing is enough. Sometimes just being seen and heard 
            (even by yourself) can soften the edges of difficult emotions.
          </p>
        </div>
        
        <div className="bg-gradient-gentle p-6 rounded-xl border border-peace-pink/20 mb-8">
          <h3 className="font-semibold text-peace-text-soft mb-3">A gentle reminder:</h3>
          <p className="text-peace-text-gentle">
            🌱 Healing isn't linear<br/>
            🌸 It's okay to not be okay sometimes<br/>
            💜 You don't have to carry everything alone<br/>
            🐾 I'll be here whenever you need a gentle companion
          </p>
        </div>
        
        <Button 
          onClick={onStartOver}
          variant="comfort"
          size="lg"
          className="mb-6"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Check in again
        </Button>
        
        <p className="text-peace-text-soft font-medium">
          You don't need to have all the answers today.<br/>
          You showed up. You listened to yourself. You cared.<br/>
          <span className="text-peace-purple">That's already more than enough.</span>
        </p>
        
        <p className="text-peace-text-gentle mt-4">
          I'm proud of you. 🐾
        </p>
      </Card>
    </div>
  );
}