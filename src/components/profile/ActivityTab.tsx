import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ThumbsUp, MessageCircle, Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActivityStats {
  total_points: number;
  total_comments: number;
  total_petitions: number;
  total_reactions: number;
  login_streak: number;
}

interface ActivityTabProps {
  userId: string;
}

export const ActivityTab = ({ userId }: ActivityTabProps) => {
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const maxPoints = 1000; // Example threshold for progress bar

  useEffect(() => {
    const fetchActivityStats = async () => {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching activity stats:', error);
        return;
      }

      setStats(data);
    };

    fetchActivityStats();
  }, [userId]);

  if (!stats) return <div>Loading...</div>;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Your Activity</h2>
      
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Next Level</span>
            <span>{stats.total_points} / {maxPoints} points</span>
          </div>
          <Progress value={(stats.total_points / maxPoints) * 100} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Login Streak */}
          <div className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Login Streak</p>
              <p className="text-2xl font-bold">{stats.login_streak} days</p>
            </div>
          </div>

          {/* Total Points */}
          <div className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
            <Star className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold">{stats.total_points}</p>
            </div>
          </div>

          {/* Reactions */}
          <div className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
            <ThumbsUp className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Reactions</p>
              <p className="text-2xl font-bold">{stats.total_reactions}</p>
            </div>
          </div>

          {/* Comments */}
          <div className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
            <MessageCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Comments</p>
              <p className="text-2xl font-bold">{stats.total_comments}</p>
            </div>
          </div>

          {/* Petitions */}
          <div className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
            <Award className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Petitions Started</p>
              <p className="text-2xl font-bold">{stats.total_petitions}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};