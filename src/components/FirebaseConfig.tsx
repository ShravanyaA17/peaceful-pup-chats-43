import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FirebaseConfigProps {
  onConfigSave: (config: any) => void;
  onSkip: () => void;
}

export function FirebaseConfig({ onConfigSave, onSkip }: FirebaseConfigProps) {
  const [config, setConfig] = useState({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  });
  const { toast } = useToast();

  const handleSave = () => {
    if (!config.apiKey || !config.projectId) {
      toast({
        title: "Missing required fields",
        description: "Please fill in at least the API Key and Project ID.",
        variant: "destructive"
      });
      return;
    }

    onConfigSave(config);
  };

  return (
    <div className="min-h-screen bg-gradient-comfort flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 shadow-comfort border-peace-pink/20">
        <div className="text-center mb-8">
          <Database className="w-12 h-12 mx-auto text-peace-purple mb-4" />
          <h2 className="text-2xl font-bold text-peace-text-soft mb-4">
            Firebase Configuration
          </h2>
          <p className="text-peace-text-gentle leading-relaxed">
            To save your journal entries and enable personalized experiences, please provide your Firebase configuration.
            You can find this in your Firebase Console → Project Settings → General.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="apiKey" className="text-peace-text-soft">API Key *</Label>
            <Input
              id="apiKey"
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="AIzaSy..."
              className="mt-1 border-peace-pink/30 focus:border-peace-purple"
            />
          </div>

          <div>
            <Label htmlFor="authDomain" className="text-peace-text-soft">Auth Domain</Label>
            <Input
              id="authDomain"
              value={config.authDomain}
              onChange={(e) => setConfig(prev => ({ ...prev, authDomain: e.target.value }))}
              placeholder="your-project.firebaseapp.com"
              className="mt-1 border-peace-pink/30 focus:border-peace-purple"
            />
          </div>

          <div>
            <Label htmlFor="projectId" className="text-peace-text-soft">Project ID *</Label>
            <Input
              id="projectId"
              value={config.projectId}
              onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}
              placeholder="your-project-id"
              className="mt-1 border-peace-pink/30 focus:border-peace-purple"
            />
          </div>

          <div>
            <Label htmlFor="storageBucket" className="text-peace-text-soft">Storage Bucket</Label>
            <Input
              id="storageBucket"
              value={config.storageBucket}
              onChange={(e) => setConfig(prev => ({ ...prev, storageBucket: e.target.value }))}
              placeholder="your-project.appspot.com"
              className="mt-1 border-peace-pink/30 focus:border-peace-purple"
            />
          </div>

          <div>
            <Label htmlFor="messagingSenderId" className="text-peace-text-soft">Messaging Sender ID</Label>
            <Input
              id="messagingSenderId"
              value={config.messagingSenderId}
              onChange={(e) => setConfig(prev => ({ ...prev, messagingSenderId: e.target.value }))}
              placeholder="123456789"
              className="mt-1 border-peace-pink/30 focus:border-peace-purple"
            />
          </div>

          <div>
            <Label htmlFor="appId" className="text-peace-text-soft">App ID</Label>
            <Input
              id="appId"
              value={config.appId}
              onChange={(e) => setConfig(prev => ({ ...prev, appId: e.target.value }))}
              placeholder="1:123456789:web:abc123"
              className="mt-1 border-peace-pink/30 focus:border-peace-purple"
            />
          </div>
        </div>

        <div className="bg-peace-lavender/20 p-4 rounded-lg border border-peace-pink/20 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-peace-purple mt-0.5 flex-shrink-0" />
            <div className="text-xs text-peace-text-gentle">
              <p className="font-medium mb-1">Note:</p>
              <p>
                Firebase configuration values are public and safe to include in your app. 
                Make sure to set up proper Firestore security rules in your Firebase console.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleSave} variant="comfort" size="lg" className="flex-1">
            Save & Continue
          </Button>
          <Button onClick={onSkip} variant="secondary" size="lg" className="flex-1">
            Skip for Now
          </Button>
        </div>
      </Card>
    </div>
  );
}