import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "@/components/Settings";
import { Settings as SettingsIcon, User, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const [showSettings, setShowSettings] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <>
      <div className="fixed top-4 left-4 right-4 z-40 flex justify-between items-center">
        <div className="flex gap-2">
          {location.pathname !== '/' && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <Link to="/">
                <Home className="w-4 h-4 text-peace-purple" />
              </Link>
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <User className="w-4 h-4 text-peace-purple" />
            </Button>
          )}
          <Button
            onClick={() => setShowSettings(true)}
            variant="ghost"
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <SettingsIcon className="w-4 h-4 text-peace-purple" />
          </Button>
        </div>
      </div>
      
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
}