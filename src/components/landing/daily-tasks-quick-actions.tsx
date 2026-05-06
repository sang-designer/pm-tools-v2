"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy, Plus } from "lucide-react";
import { MOCK_VENUES } from "@/lib/mock-data";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

// Custom Progress component with subtle green color
function SubtleProgress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`relative h-1.5 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// Utility to select 5 random tasks from venue data
function selectDailyTasks(): (Task & { venueName: string; venueAddress: string })[] {
  const allTasks: (Task & { venueName: string; venueAddress: string })[] = [];
  
  // Collect all tasks from venues
  MOCK_VENUES.forEach(venue => {
    venue.tasks.forEach(task => {
      allTasks.push({
        ...task,
        venueName: venue.name,
        venueAddress: venue.address
      });
    });
  });
  
  // Shuffle and select 5 tasks
  const shuffled = allTasks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
}

// Task completion celebration component
function TaskCompletedCelebration() {
  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    x: Math.random() * 100,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {confettiPieces.map(piece => (
        <motion.div
          key={piece.id}
          initial={{ 
            x: `${piece.x}%`, 
            y: -20, 
            opacity: 1, 
            scale: 0 
          }}
          animate={{ 
            y: 300,
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            rotate: 360
          }}
          transition={{ 
            duration: 2, 
            delay: piece.delay,
            ease: "easeOut"
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </motion.div>
  );
}

// Individual task card component - Shows one at a time
interface TaskCardProps {
  task: Task & { venueName: string; venueAddress: string };
  isCompleted: boolean;
  onComplete: () => void;
  showCelebration: boolean;
}

function TaskCard({ task, isCompleted, onComplete, showCelebration }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="relative w-full"
    >
      <Card className={`transition-all duration-500 ${
        isCompleted 
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
          : 'hover:shadow-lg border-slate-200 dark:border-slate-700'
      }`}>
        <CardHeader className="pb-4">
          {/* Venue info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-xl leading-tight">{task.venueName}</h3>
            <p className="text-sm text-muted-foreground">{task.venueAddress}</p>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-6">
          {/* Question */}
          <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-6">
            <p className="text-base font-medium text-foreground mb-6 leading-relaxed">{task.question}</p>
            
            {/* Answer buttons */}
            {task.options && (
              <div className="grid grid-cols-3 gap-3">
                {task.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="lg"
                    onClick={onComplete}
                    disabled={isCompleted}
                    className={`text-sm h-12 font-medium transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                        : 'hover:bg-white hover:shadow-md hover:border-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-green-600 font-medium py-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-base">Task completed! Next task coming up...</span>
            </motion.div>
          )}
        </CardContent>

        {showCelebration && <TaskCompletedCelebration />}
      </Card>
    </motion.div>
  );
}

// All tasks completed celebration
function AllTasksCompletedCelebration({ 
  onContinueToHighImpact, 
  onDoMore 
}: { 
  onContinueToHighImpact: () => void;
  onDoMore: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
      className="text-center py-12 px-6"
    >
      <div className="relative max-w-md mx-auto">
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -5, 5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/50 rounded-full mb-6"
        >
          <Trophy className="h-12 w-12 text-green-600" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-3xl font-bold text-foreground mb-3">Amazing Work!</h3>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            You completed all 5 daily tasks! You&apos;re building great habits and making real impact.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button 
            onClick={onDoMore}
            variant="outline"
            size="lg"
            className="min-w-[140px] border-slate-300 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Do More Tasks
          </Button>
          
          <Button 
            onClick={onContinueToHighImpact}
            size="lg"
            className="min-w-[140px] bg-slate-600 hover:bg-slate-700"
          >
            Done for Today
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function DailyTasksQuickActions() {
  const [dailyTasks] = useState(() => selectDailyTasks());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [showTaskCelebration, setShowTaskCelebration] = useState<string | null>(null);
  
  const completedCount = completedTasks.size;
  const progressPercent = (completedCount / 5) * 100;
  const allTasksCompleted = completedCount === 5;
  
  // Get current task (next uncompleted task)
  const currentTask = dailyTasks.find(task => !completedTasks.has(task.id));

  const handleTaskComplete = (taskId: string) => {
    if (completedTasks.has(taskId)) return;
    
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      newSet.add(taskId);
      return newSet;
    });
    setShowTaskCelebration(taskId);
    
    // Hide celebration after animation
    setTimeout(() => {
      setShowTaskCelebration(null);
    }, 2000);
  };

  const handleContinueToHighImpact = () => {
    // Navigate to high impact tasks or "done" state
    window.location.href = "/?mode=classic";
  };

  const handleDoMore = () => {
    // Reset tasks to do more
    setCompletedTasks(new Set());
    setShowTaskCelebration(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-8">
        {/* Header and Progress - Matching High Impact Tasks font sizing */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-semibold text-foreground">Daily Quick Actions</h2>
                <div className="text-sm text-muted-foreground font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete tasks one at a time to build your daily streak
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{completedCount}/5</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
          
          {/* Progress bar under subtitle */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">Progress</div>
            <SubtleProgress value={progressPercent} />
            <div className="text-sm font-medium text-foreground">{Math.round(progressPercent)}%</div>
          </div>
        </div>

        {/* Task Cards or Completion State */}
        <AnimatePresence mode="wait">
          {!allTasksCompleted ? (
            <motion.div
              key="current-task"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              {currentTask && (
                <div className="w-full max-w-2xl">
                  <TaskCard
                    key={currentTask.id}
                    task={currentTask}
                    isCompleted={completedTasks.has(currentTask.id)}
                    onComplete={() => handleTaskComplete(currentTask.id)}
                    showCelebration={showTaskCelebration === currentTask.id}
                  />
                  
                  {/* Upcoming tasks preview */}
                  <div className="mt-8">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">
                        {5 - completedCount - 1} more tasks after this one
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className={cn(
                            "w-3 h-3 rounded-full transition-all duration-500",
                            index < completedCount
                              ? "bg-green-500"
                              : index === completedCount
                              ? "bg-slate-400 ring-2 ring-slate-300"
                              : "bg-slate-200 dark:bg-slate-700"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="completion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AllTasksCompletedCelebration 
                onContinueToHighImpact={handleContinueToHighImpact}
                onDoMore={handleDoMore}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}