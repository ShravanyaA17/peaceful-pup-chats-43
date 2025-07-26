import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, Eye, EyeOff, Save, Book } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { dataService } from "@/services/dataService";

interface SecureJournalProps {
  initialContent?: string;
  onSave?: (content: string, password: string) => void;
  mode?: "write" | "view";
}

export function SecureJournal({
  initialContent = "",
  onSave,
  mode = "write",
}: SecureJournalProps) {
  const { user } = useAuth();
  const [journalContent, setJournalContent] = useState(initialContent);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedJournals, setSavedJournals] = useState<any[]>([]);

  useEffect(() => {
    checkIfUserHasPassword();
  }, [user]);

  const checkIfUserHasPassword = async () => {
    if (!user) return;

    try {
      // Check if user has set up a journal password
      // This would be stored in their user document
      setHasPassword(false); // For now, assume no password setup
    } catch (error) {
      console.error("Error checking password status:", error);
    }
  };

  const setupJournalPassword = async () => {
    if (!user || !password) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await dataService.saveJournalPasswordHash(user.uid, password);
      setHasPassword(true);
      setIsLocked(false);
      setError("");
    } catch (error) {
      setError("Failed to set up journal password");
      console.error("Password setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockJournal = async () => {
    if (!user || !password) return;

    try {
      setLoading(true);
      setError("");

      const isValid = await dataService.verifyJournalPassword(
        user.uid,
        password
      );
      if (isValid) {
        setIsLocked(false);
        loadSavedJournals();
      } else {
        setError("Incorrect password");
      }
    } catch (error) {
      setError("Failed to unlock journal");
      console.error("Unlock error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJournals = async () => {
    if (!user || !password) return;

    try {
      const journals = await dataService.getDecryptedJournals(
        user.uid,
        password
      );
      setSavedJournals(journals);
    } catch (error) {
      console.error("Error loading journals:", error);
    }
  };

  const saveJournal = async () => {
    if (!user || !journalContent.trim() || !password) return;

    try {
      setLoading(true);
      await onSave?.(journalContent, password);
      setError("");
      // Optionally clear the content after saving
      // setJournalContent('');
    } catch (error) {
      setError("Failed to save journal entry");
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <Lock className="w-12 h-12 mx-auto text-peace-purple mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
        <p className="text-peace-text-gentle">
          Please sign in to access your secure journal.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Password Setup/Unlock */}
      {isLocked && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 mx-auto text-peace-purple mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {hasPassword ? "Unlock Your Journal" : "Secure Your Journal"}
            </h3>
            <p className="text-peace-text-gentle">
              {hasPassword
                ? "Enter your journal password to access your private entries."
                : "Set up a password to keep your journal entries completely private and encrypted."}
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <Label htmlFor="password">Journal Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    hasPassword
                      ? "Enter your password"
                      : "Create a strong password"
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-peace-text-gentle"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {!hasPassword && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button
              onClick={hasPassword ? unlockJournal : setupJournalPassword}
              disabled={
                loading ||
                !password ||
                (!hasPassword && password !== confirmPassword)
              }
              className="w-full"
              variant="comfort"
            >
              {loading
                ? "Processing..."
                : hasPassword
                ? "Unlock Journal"
                : "Set Up Secure Journal"}
            </Button>

            <div className="text-xs text-peace-text-gentle text-center">
              <Lock className="w-3 h-3 inline mr-1" />
              Your journal entries are encrypted on your device before being
              stored. Even we cannot read them without your password.
            </div>
          </div>
        </Card>
      )}

      {/* Journal Writing Area */}
      {!isLocked && mode === "write" && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Unlock className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Your Secure Journal</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="journal">Write your thoughts...</Label>
              <Textarea
                id="journal"
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder="This is your private space. Write about anything - your feelings, thoughts, experiences, or reflections. Everything here is encrypted and completely private."
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={saveJournal}
                disabled={loading || !journalContent.trim()}
                variant="comfort"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>

              <Button onClick={() => setIsLocked(true)} variant="outline">
                <Lock className="w-4 h-4 mr-2" />
                Lock Journal
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Previous Journal Entries */}
      {!isLocked && savedJournals.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Book className="w-5 h-5" />
            Previous Entries
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {savedJournals.map((journal, index) => (
              <div
                key={journal.id}
                className="border-l-4 border-peace-purple pl-4 py-2"
              >
                <div className="text-sm text-peace-text-gentle mb-1">
                  {journal.timestamp?.toDate().toLocaleDateString()}
                </div>
                <div className="text-peace-text-soft">
                  {journal.journalEntry.length > 200
                    ? journal.journalEntry.substring(0, 200) + "..."
                    : journal.journalEntry}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
