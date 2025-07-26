import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Heart, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { dataService } from "@/services/dataService";

interface MoodTrend {
  date: Date;
  mood?: number;
  yesCount: number;
}

export function ProgressDashboard() {
  const { user } = useAuth();
  const [moodTrends, setMoodTrends] = useState<MoodTrend[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [trends, checkins] = await Promise.all([
        dataService.getMoodTrends(user.uid, 30),
        dataService.getUserCheckins(user.uid, 10),
      ]);

      setMoodTrends(trends);
      setRecentCheckins(checkins);
    } catch (error) {
      console.error("Error loading progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const averageAnxietyLevel =
    moodTrends.length > 0
      ? (
          moodTrends.reduce((acc, curr) => acc + curr.yesCount, 0) /
          moodTrends.length
        ).toFixed(1)
      : "0";

  const totalCheckins = recentCheckins.length;
  const streakDays = calculateStreak(recentCheckins);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <Heart className="w-12 h-12 mx-auto text-peace-purple mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Sign in to track progress
        </h3>
        <p className="text-peace-text-gentle mb-4">
          Your progress and insights will be saved securely and privately.
        </p>
        <Button
          onClick={() => {
            /* Add sign in logic */
          }}
          variant="comfort"
        >
          Start Tracking Progress
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-peace-text-soft">
          Your Progress
        </h2>
        <Button onClick={loadProgressData} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-peace-purple" />
            <div>
              <p className="text-sm text-peace-text-gentle">Check-in Streak</p>
              <p className="text-2xl font-bold text-peace-text-soft">
                {streakDays} days
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-peace-purple" />
            <div>
              <p className="text-sm text-peace-text-gentle">
                Avg. Anxiety Level
              </p>
              <p className="text-2xl font-bold text-peace-text-soft">
                {averageAnxietyLevel}/11
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-peace-purple" />
            <div>
              <p className="text-sm text-peace-text-gentle">Total Check-ins</p>
              <p className="text-2xl font-bold text-peace-text-soft">
                {totalCheckins}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Check-ins */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Check-ins</h3>
        <div className="space-y-3">
          {recentCheckins.slice(0, 5).map((checkin, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-peace-warm/30 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {checkin.timestamp?.toDate().toLocaleDateString()}
                </p>
                <p className="text-sm text-peace-text-gentle">
                  {checkin.selectedAnswers?.filter(
                    (a: any) => a.answer === "yes"
                  ).length || 0}{" "}
                  concerns noted
                </p>
              </div>
              {checkin.personalThoughts && (
                <div className="text-xs text-peace-text-gentle bg-peace-purple/10 px-2 py-1 rounded">
                  Has journal
                </div>
              )}
            </div>
          ))}
          {recentCheckins.length === 0 && (
            <p className="text-center text-peace-text-gentle py-8">
              No check-ins yet. Complete your first check-in to start tracking
              progress!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

function calculateStreak(checkins: any[]): number {
  // Simple streak calculation - could be enhanced
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < checkins.length; i++) {
    const checkinDate = checkins[i].timestamp?.toDate();
    if (!checkinDate) continue;

    const daysDiff = Math.floor(
      (today.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
