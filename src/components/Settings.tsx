import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Eye, EyeOff, AlertCircle } from "lucide-react";
import { aiService } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [bytezKey, setBytezKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!bytezKey.trim()) {
      toast({
        title: "Please enter an API key",
        description: "You need to provide a Bytez API key to enable AI responses.",
        variant: "destructive"
      });
      return;
    }

    try {
      aiService.setApiKey(bytezKey);
      toast({
        title: "API key saved! ✨",
        description: "Your Bytez API key has been saved securely in your browser."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error saving API key",
        description: "There was a problem saving your API key. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 shadow-comfort border-peace-pink/20">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="w-5 h-5 text-peace-purple" />
          <h2 className="text-xl font-semibold text-peace-text-soft">Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="bytez-key" className="text-peace-text-soft">
              Bytez API Key
            </Label>
            <div className="relative mt-2">
              <Input
                id="bytez-key"
                type={showKey ? "text" : "password"}
                value={bytezKey}
                onChange={(e) => setBytezKey(e.target.value)}
                placeholder="Enter your Bytez API key..."
                className="pr-10 border-peace-pink/30 focus:border-peace-purple"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-peace-text-gentle hover:text-peace-purple transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-peace-text-gentle mt-2">
              Get your API key from{" "}
              <a 
                href="https://bytez.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-peace-purple hover:underline"
              >
                Bytez Platform
              </a>
            </p>
          </div>

          <div className="bg-peace-lavender/20 p-4 rounded-lg border border-peace-pink/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-peace-purple mt-0.5 flex-shrink-0" />
              <div className="text-xs text-peace-text-gentle">
                <p className="font-medium mb-1">Privacy Note:</p>
                <p>
                  Your API key is stored locally in your browser and used directly to call Bytez. 
                  For better security, consider using Firebase Functions in production.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveApiKey} variant="comfort" className="flex-1">
              Save API Key
            </Button>
            <Button onClick={onClose} variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}