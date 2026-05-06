"use client";

import { useGame } from "@/lib/game-context";
import { Eye } from "lucide-react";

export function useQuestCompletion() {
  const { venues, venueProgress, skippedTasks } = useGame();
  const actionableVenues = venues.filter((v) => !v.globallyCompleted);
  const total = actionableVenues.length;
  const completed = actionableVenues.filter((v) => {
    const completedTaskIds = venueProgress
      .filter((p) => p.venueId === v.id)
      .map((p) => p.taskId);
    return v.tasks.every((t) => completedTaskIds.includes(t.id));
  }).length;
  const handled = actionableVenues.filter((v) => {
    const completedTaskIds = venueProgress
      .filter((p) => p.venueId === v.id)
      .map((p) => p.taskId);
    const handledIds = [...completedTaskIds, ...(skippedTasks || [])];
    return v.tasks.every((t) => handledIds.includes(t.id));
  }).length;
  const pct = total > 0 ? (handled / total) * 100 : 0;
  return { total, completed, handled, pct };
}

export function useDailyProgress() {
  const { dailyProgress } = useGame();
  if (!dailyProgress) {
    return { 
      count: 0, 
      goal: 5, 
      maxGoal: 7, 
      goalReached: false, 
      bonusEarned: false,
      showBonusGoal: false,
      pct: 0 
    };
  }
  
  // Always show progress out of 5 for the main goal
  const currentGoal = 5;
  const pct = Math.min((dailyProgress.count / currentGoal) * 100, 100);
  
  return {
    count: dailyProgress.count,
    goal: 5,
    maxGoal: 7,
    goalReached: dailyProgress.goalReached,
    bonusEarned: dailyProgress.bonusEarned,
    showBonusGoal: false, // Don't show bonus goal in main display
    pct,
  };
}

interface QuestProgressProps {
  onMyWorldToggle?: () => void;
}

export function QuestProgress({ onMyWorldToggle }: QuestProgressProps) {
  const { count, goal, goalReached, pct } = useDailyProgress();
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  // Always show progress out of 5 for the main display
  const currentGoal = goal; // Always 5
  const progressColor = goalReached 
    ? "#10b981" // Green for bonus mode (5+ tasks)
    : "#3333FF"; // Blue for normal progress

  const getStatusText = () => {
    if (goalReached) return "Bonus tasks!";
    return "daily tasks";
  };

  return (
    <button
      onClick={onMyWorldToggle}
      className="group absolute left-4 top-4 z-30 flex items-center gap-3 rounded-2xl bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-accent/80 hover:shadow-xl active:scale-95"
      role="button"
      aria-label={`${count} of ${currentGoal} daily tasks completed, ${Math.round(pct)}% complete. Click to view My World stats`}
    >
      <div className="relative size-14 sm:size-16">
        <svg className="size-full -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r={radius} className="stroke-border" strokeWidth="5" fill="none" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={progressColor}
            strokeWidth="5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
          {Math.round(pct)}%
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          {count}/{currentGoal}
        </p>
        <p className="text-xs text-muted-foreground">{getStatusText()}</p>
      </div>
      <Eye className="size-4 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
