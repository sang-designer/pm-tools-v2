"use client";

import { useGame } from "@/lib/game-context";
import { TASK_LABELS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, X, CheckCircle2, ChevronLeft, MoreVertical, Search, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PinPosition } from "./quest-map";
import { playYesSound, playNoSound, playNotSureSound } from "@/lib/sounds";

const cardVariants = {
  enter: { opacity: 0, scale: 0.9 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const cardTransition = {
  type: "spring" as const,
  damping: 24,
  stiffness: 300,
  mass: 0.7,
};

interface TaskCardProps {
  pinPosition: PinPosition | null;
}

export function TaskCard({ pinPosition }: TaskCardProps) {
  const { venues, selectedVenueId, setSelectedVenueId, completeTask, skipTask, undoTask, getVenueState, venueProgress, skippedTasks } = useGame();
  const venue = venues.find((v) => v.id === selectedVenueId);

  const completedTaskIds = venue
    ? venueProgress.filter((p) => p.venueId === venue.id).map((p) => p.taskId)
    : [];
  const handledTaskIds = [...completedTaskIds, ...(skippedTasks || [])];
  const currentTask = venue
    ? venue.tasks.find((t) => !handledTaskIds.includes(t.id))
    : undefined;
  const taskIndex = venue && currentTask
    ? venue.tasks.indexOf(currentTask)
    : 0;

  const previousTask = venue && taskIndex > 0 ? venue.tasks[taskIndex - 1] : null;

  const handleGoBack = () => {
    if (venue && previousTask) {
      undoTask(venue.id, previousTask.id);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {venue && currentTask && (
        <TaskCardInner
          key={`${venue.id}-${currentTask.id}`}
          venue={venue}
          task={currentTask}
          taskIndex={taskIndex}
          totalTasks={venue.tasks.length}
          getVenueState={getVenueState}
          completeTask={completeTask}
          skipTask={skipTask}
          setSelectedVenueId={setSelectedVenueId}
          pinPosition={pinPosition}
          onGoBack={taskIndex > 0 ? handleGoBack : undefined}
        />
      )}
      {venue && !currentTask && (
        <CompletedCard
          key={`${venue.id}-done`}
          venue={venue}
          setSelectedVenueId={setSelectedVenueId}
          pinPosition={pinPosition}
        />
      )}
    </AnimatePresence>
  );
}

function getPositionStyle(pinPosition: PinPosition | null, pos: PinPosition) {
  const cardWidth = 340;
  const cardOffset = 24;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1024;

  if (viewportW < 640) {
    return {
      position: "fixed" as const,
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
    };
  }

  const pinTop = pos.y - 40;
  const placeRight = pos.x + cardOffset + cardWidth + 16 < viewportW;
  const left = placeRight ? pos.x + cardOffset : pos.x - cardOffset - cardWidth;

  return pinPosition
    ? { position: "absolute" as const, left, top: Math.max(16, pinTop - 60), width: cardWidth }
    : { position: "absolute" as const, bottom: 24, left: "50%", transform: "translateX(-50%)", width: cardWidth };
}

function CompletedCard({
  venue,
  setSelectedVenueId,
  pinPosition,
}: {
  venue: { id: string; name: string; address: string };
  setSelectedVenueId: (id: string | null) => void;
  pinPosition: PinPosition | null;
}) {
  const pos = pinPosition ?? { x: 0, y: 0 };
  const posStyle = getPositionStyle(pinPosition, pos);

  return (
    <motion.div
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={cardTransition}
      style={posStyle}
      className="z-30 rounded-2xl bg-card p-4 shadow-xl max-sm:rounded-b-none max-sm:rounded-t-2xl max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-label={`${venue.name} - completed`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{venue.name}</h3>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full p-2 hover:bg-accent sm:p-1"
              aria-label="More options"
            >
              <MoreVertical className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => {
                  const searchQuery = encodeURIComponent(`${venue.name} ${venue.address}`);
                  window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                }}
                className="gap-2"
              >
                <Search className="size-4" />
                Search Web
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // TODO: Navigate to edit history page
                  window.open('/edit-history', '_blank');
                }}
                className="gap-2"
              >
                <Clock className="size-4" />
                Edit History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => setSelectedVenueId(null)}
            className="rounded-full p-2 hover:bg-accent sm:p-1"
            aria-label="Close"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{venue.address}</p>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 p-2.5 dark:bg-green-950/40">
        <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
        <span className="text-xs text-green-700 dark:text-green-300">Already completed!</span>
      </div>
    </motion.div>
  );
}

function TaskCardInner({
  venue,
  task,
  taskIndex,
  totalTasks,
  completeTask,
  skipTask,
  setSelectedVenueId,
  pinPosition,
  onGoBack,
}: {
  venue: {
    id: string;
    name: string;
    address: string;
    category: string;
    tasks: {
      id: string;
      type: "verify_address" | "confirm_category" | "fix_coordinates" | "confirm_hours" | "photo_verification";
      question: string;
      options?: string[];
    }[];
  };
  task: {
    id: string;
    type: "verify_address" | "confirm_category" | "fix_coordinates" | "confirm_hours" | "photo_verification";
    question: string;
    options?: string[];
  };
  taskIndex: number;
  totalTasks: number;
  getVenueState: (id: string) => string;
  completeTask: (venueId: string, taskId: string) => void;
  skipTask: (venueId: string, taskId: string) => void;
  setSelectedVenueId: (id: string | null) => void;
  pinPosition: PinPosition | null;
  onGoBack?: () => void;
}) {
  const pos = pinPosition ?? { x: 0, y: 0 };
  const posStyle = getPositionStyle(pinPosition, pos);
  const isSingleTask = totalTasks === 1;
  const hasOptions = task.options && task.options.length > 0;

  return (
    <motion.div
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={cardTransition}
      style={posStyle}
      className="z-30 rounded-2xl bg-card p-4 shadow-xl max-sm:rounded-b-none max-sm:rounded-t-2xl max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-label={`Task for ${venue.name}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <MapPin className="size-3.5 text-primary" aria-hidden="true" />
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
              className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
            >
              {TASK_LABELS[task.type]}
            </motion.span>
            {totalTasks > 1 && (
              <span className="text-[10px] text-muted-foreground">
                {taskIndex + 1}/{totalTasks}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground">{venue.name}</h3>
          <p className="text-xs text-muted-foreground">{venue.address}</p>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full p-2 transition-colors hover:bg-accent sm:p-1"
              aria-label="More options"
            >
              <MoreVertical className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => {
                  const searchQuery = encodeURIComponent(`${venue.name} ${venue.address}`);
                  window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                }}
                className="gap-2"
              >
                <Search className="size-4" />
                Search Web
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // TODO: Navigate to edit history page
                  window.open('/edit-history', '_blank');
                }}
                className="gap-2"
              >
                <Clock className="size-4" />
                Edit History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => setSelectedVenueId(null)}
            className="rounded-full p-2 transition-colors hover:bg-accent sm:p-1"
            aria-label="Close task"
          >
            <X className="size-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-3 rounded-lg border border-border bg-muted p-3"
      >
        <p className="text-xs font-medium text-foreground">{task.question}</p>
        {hasOptions && (
          <div className="mt-2 flex gap-2">
            {task.options!.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="sm"
                className="h-10 flex-1 text-xs sm:h-7"
                onClick={() => {
                  if (option === "Not sure") {
                    playNotSureSound();
                    skipTask(venue.id, task.id);
                  } else if (option === "No") {
                    playNoSound();
                    completeTask(venue.id, task.id);
                  } else {
                    playYesSound();
                    completeTask(venue.id, task.id);
                  }
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.25 }}
        className="mt-2.5 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {onGoBack && (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground sm:h-7"
              onClick={onGoBack}
            >
              <ChevronLeft className="size-3" />
              Back
            </Button>
          )}
          <span className="text-[10px] text-muted-foreground">Category: {venue.category}</span>
        </div>
        {!isSingleTask && (
          <Button
            size="sm"
            className="h-10 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90 sm:h-7"
            onClick={() => {
              playYesSound();
              completeTask(venue.id, task.id);
            }}
          >
            {taskIndex < totalTasks - 1 ? "Next" : "Submit"}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
