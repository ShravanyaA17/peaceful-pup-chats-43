import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Heart, Sparkles, Download, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const journalPrompts = [
  "What does this feeling remind me of?",
  "What might I need right now?",
  "If I could talk to someone about this, what would I say?",
  "Is this feeling trying to protect me from something?",
  "What would I tell a dear friend feeling this way?",
  "What small thing could bring me comfort today?",
];

interface JournalSpaceProps {
  onComplete: (entry: string) => void;
  onBack: () => void;
}

export function JournalSpace({ onComplete, onBack }: JournalSpaceProps) {
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setJournalEntry((prev) => prev + (prev ? "\n\n" : "") + prompt + "\n\n");
  };

  const downloadJournal = () => {
    if (!journalEntry.trim()) return;

    const today = new Date().toLocaleDateString();
    const blob = new Blob([journalEntry], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Peace-Journal-${today}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Journal downloaded",
      description: "Your journal entry has been saved as a text file.",
    });
  };

  const copyJournal = async () => {
    if (!journalEntry.trim()) return;

    try {
      await navigator.clipboard.writeText(journalEntry);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Journal copied",
        description: "Your journal entry has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description:
          "Unable to copy to clipboard. Try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-comfort p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 shadow-comfort border-peace-pink/20">
          <div className="text-center mb-8">
            <BookOpen className="w-12 h-12 mx-auto text-peace-purple mb-4" />
            <h2 className="text-2xl font-bold text-peace-text-soft mb-4">
              Let's write together
            </h2>
            <p className="text-peace-text-gentle leading-relaxed max-w-2xl mx-auto">
              Sometimes putting our thoughts on paper helps us understand what
              we're carrying. Here are some gentle prompts to explore, or you
              can simply write whatever comes to mind.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-peace-text-soft mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-peace-purple" />
              Writing prompts to explore:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {journalPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptSelect(prompt)}
                  className="text-left p-4 rounded-lg border border-peace-pink/30 hover:bg-peace-lavender/20 transition-colors text-peace-text-soft hover:border-peace-purple/50"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-peace-text-soft mb-3 font-medium">
              Your gentle space to write:
            </label>
            <Textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Take your time... there's no rush. Let your thoughts flow naturally."
              className="min-h-[300px] border-peace-pink/30 focus:border-peace-purple focus:ring-peace-purple/20 bg-peace-warm/30 text-peace-text-soft placeholder:text-peace-text-gentle resize-none"
            />
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onComplete(journalEntry)}
                variant="comfort"
                size="lg"
                disabled={!journalEntry.trim()}
              >
                <Heart className="w-4 h-4 mr-2" />
                I'm done writing
              </Button>
              <Button
                onClick={downloadJournal}
                variant="outline"
                size="lg"
                disabled={!journalEntry.trim()}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={copyJournal}
                variant="outline"
                size="lg"
                disabled={!journalEntry.trim()}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={onBack} variant="secondary" size="lg">
                Go back
              </Button>
            </div>

            <p className="text-sm text-peace-text-gentle max-w-md mx-auto">
              Your words are safe here. Write as much or as little as feels
              right. You can answer one prompt, or just let your thoughts flow
              freely.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
