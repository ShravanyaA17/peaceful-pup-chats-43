import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PeaceWelcome } from "@/components/PeaceWelcome";
import { FirebaseConfig } from "@/components/FirebaseConfig";
import { useAuth } from "@/hooks/useAuth";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, signInAnonymously } = useAuth();
  const { isConfigured, setIsConfigured } = useAppContext();
  const { toast } = useToast();

  const handleFirebaseConfig = (config: any) => {
    localStorage.setItem("firebase_configured", "true");
    localStorage.setItem("firebase_config", JSON.stringify(config));
    setIsConfigured(true);
    toast({
      title: "Firebase configured! 🚀",
      description: "Your app is now ready to save journal entries.",
    });
  };

  const handleSkipFirebase = () => {
    setIsConfigured(true);
  };

  const handleStartChecklist = async () => {
    // Skip Firebase auth entirely - just navigate to checklist
    navigate("/checklist");
  };

  if (!isConfigured) {
    return (
      <FirebaseConfig
        onConfigSave={handleFirebaseConfig}
        onSkip={handleSkipFirebase}
      />
    );
  }

  return <PeaceWelcome onStartChecklist={handleStartChecklist} />;
}
