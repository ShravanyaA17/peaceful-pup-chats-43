import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import peaceMascot from "@/assets/peace-mascot.jpg";

interface PeaceWelcomeProps {
  onStartChecklist: () => void;
}

export function PeaceWelcome({ onStartChecklist }: PeaceWelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-comfort flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 text-center shadow-comfort border-peace-pink/20">
        <div className="mb-6">
          <img 
            src={peaceMascot} 
            alt="Peace, your gentle companion" 
            className="w-24 h-24 mx-auto rounded-full shadow-gentle"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-peace-text-soft mb-4">
          Hi there, I'm Peace 🐾
        </h1>
        
        <p className="text-lg text-peace-text-gentle mb-6 leading-relaxed">
          I'm here to help you when you're feeling anxious, overwhelmed, or just... not quite okay. 
          Sometimes our hearts carry weight we can't name, and that's perfectly normal.
        </p>
        
        <p className="text-peace-text-gentle mb-8 leading-relaxed">
          Let's gently explore what might be affecting you today. I'll walk with you through some 
          questions that might help us figure out what's going on inside. Take your time—there's no rush.
        </p>
        
        <Button 
          onClick={onStartChecklist}
          variant="comfort"
          size="lg"
          className="text-lg px-8 py-4"
        >
          Let's start together ✨
        </Button>
        
        <p className="text-sm text-peace-text-gentle mt-6">
          You're safe here. You're seen. You matter.
        </p>
      </Card>
    </div>
  );
}