"use client";

import { useGame } from "@/lib/game-context";
import { getLevelFromPoints } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { MapPin, Star, Flame, Trophy, X, Target } from "lucide-react";
import { useDailyProgress } from "./quest-progress";

interface MyWorldOverlayProps {
  onClose: () => void;
}

export function MyWorldOverlay({ onClose }: MyWorldOverlayProps) {
  const { totalPoints, bestStreak, venueProgress, venues } = useGame();
  const { levelName, progress } = getLevelFromPoints(totalPoints);
  const completedCount = venueProgress.length;
  const { count: dailyCount, goal, goalReached } = useDailyProgress();

  // Determine daily task progress - always show out of 5 for main goal
  const currentGoal = goal; // Always 5 for main display
  const dailyProgress = Math.min((dailyCount / currentGoal) * 100, 100);
  const getDailyTaskStatus = () => {
    if (goalReached) return "Bonus Active! 🚀";
    return "In Progress";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="absolute left-4 top-4 z-30 w-[calc(100%-2rem)] overflow-hidden rounded-2xl bg-card/95 shadow-xl backdrop-blur-sm sm:w-[280px]"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">My World</h2>
        <button
          onClick={onClose}
          className="rounded-full p-2 transition-colors hover:bg-accent sm:p-1"
          aria-label="Close My World"
        >
          <X className="size-4 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <Trophy className="size-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{levelName}</p>
            <Progress value={progress * 100} className="mt-1 h-1.5 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Star className="size-4 text-amber-500" fill="currentColor" />} value={totalPoints} label="Total Points" />
          <StatCard icon={<MapPin className="size-4 text-green-500" />} value={completedCount} label="Venues Helped" />
          <StatCard icon={<Flame className="size-4 text-orange-500" fill="currentColor" />} value={bestStreak} label="Best Streak" />
          <StatCard 
            icon={<Target className={`size-4 ${goalReached ? 'text-emerald-500' : 'text-blue-500'}`} />} 
            value={dailyCount} 
            label="Daily Tasks" 
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Daily Tasks</span>
            <span>{dailyCount}/{currentGoal}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className={`h-full rounded-full transition-colors duration-300 ${
                goalReached 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  : 'bg-gradient-to-r from-primary to-purple-500'
              }`}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{getDailyTaskStatus()}</span>
            {goalReached && <span>Keep going for more XP!</span>}
          </div>
        </div>

        {venueProgress.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Activity</p>
            <div className="space-y-1.5">
              {venueProgress.slice(-3).reverse().map((p) => {
                const v = venues.find((ven) => ven.id === p.venueId);
                return (
                  <motion.div
                    key={p.venueId + p.completedAt}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 rounded-lg bg-green-50/80 px-3 py-1.5 dark:bg-green-950/30"
                  >
                    <div className="size-1.5 rounded-full bg-green-500" />
                    <span className="truncate text-xs text-foreground">{v?.name || "Unknown"}</span>
                    <span className="ml-auto shrink-0 text-[10px] text-green-600 dark:text-green-400">+{p.pointsAwarded}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-base font-bold text-foreground">{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
