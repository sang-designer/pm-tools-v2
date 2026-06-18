"use client";

import { useGame } from "@/lib/game-context";
import { getLevelFromPoints } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Trophy, ChevronDown } from "lucide-react";

const SPRING = { type: "spring", stiffness: 120, damping: 18 } as const;
const CONFETTI_COLORS = [
  "#3333FF", "#CBB8F7", "#f97316", "#22c55e", "#eab308",
  "#ec4899", "#06b6d4", "#8b5cf6",
];

interface FloatingReward {
  id: number;
  amount: number;
  type: "points" | "streak";
}

function PlacemakerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 81 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M79.33 104.137c-1.1.87-2.62 1-3.85.33l-15.21-8.29-16.33 8.33a3.49 3.49 0 0 1-3.18 0l-16.34-8.33-15.21 8.29c-1.23.67-2.75.54-3.85-.33s-1.57-2.31-1.2-3.67l7.84-28.68c.26-.96.92-1.76 1.8-2.2l12.62-6.34c-.38-.43-.75-.85-1.14-1.29-6.1-6.79-13.32-14.74-13.32-28.44 0-14.49 10.63-30.19 30.36-30.27h.03c9.87.04 17.46 3.98 22.59 9.73 5.13 5.75 7.79 13.29 7.8 20.54 0 13.7-7.23 21.65-13.33 28.44-.39.43-.76.86-1.14 1.29l12.62 6.34c.88.44 1.54 1.24 1.8 2.2l7.84 28.68c.37 1.36-.1 2.8-1.2 3.67Z" fill="currentColor" fillOpacity="0.15" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.036 99.588l16.83-9.17 4.05-26.06-13.04 6.55-7.84 28.68Zm34.811 0l17.98-9.17h.001l16.83 9.17-7.84-28.68-13.04-6.55h-.001l-13.93 6.55-13.93-6.55-4.05 26.06 17.98 9.17Z" fill="white" />
      <path d="M73.508 99.588l-16.83-9.17-4.05-26.06 13.04 6.55 7.84 28.68Z" fill="#CBB8F7" />
      <path d="M56.678 90.418l-17.98 9.17V70.908l13.93-6.55 4.05 26.06Z" fill="#3333FF" />
      <path d="M3.888 99.588l16.83-9.17 4.05-26.06-13.04 6.55-7.84 28.68Z" fill="#3333FF" />
      <path d="M20.718 90.418l17.98 9.17V70.908l-13.93-6.55-4.05 26.06Z" fill="#CBB8F7" />
      <path d="M38.844 2.942h-.018c-18.754.079-28.87 14.95-28.87 28.77 0 13.011 6.77 20.561 12.848 27.34l.093.103c4.746 5.293 9.332 10.445 11.639 18.148 1.281 4.278 7.34 4.278 8.622 0 2.307-7.704 6.893-12.855 11.639-18.148l.096-.107c6.076-6.778 12.844-14.327 12.844-27.334v-.001c-.001-13.82-10.119-28.691-28.893-28.77Z" fill="white" stroke="white" strokeWidth="4" />
      <path d="M63.236 31.928c0 20.05-18.011 24.576-24.14 43.496a.23.23 0 0 1-.45 0c-6.128-18.92-24.14-23.447-24.14-43.496 0-10.76 7.73-24.2 24.39-24.27 16.66.07 24.34 13.51 24.34 24.27Z" stroke="#3333FF" strokeWidth="5" />
      <circle cx="38.846" cy="31.015" r="10.928" fill="#3333FF" />
    </svg>
  );
}

function useAnimatedNumber(target: number) {
  const motionVal = useMotionValue(target);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    const controls = animate(motionVal, target, {
      type: "spring",
      stiffness: 80,
      damping: 20,
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [target, motionVal, rounded]);

  return display;
}

function ConfettiBurst() {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const distance = 30 + Math.random() * 40;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: Math.random() * 360,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 3 + Math.random() * 3,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2, rotate: p.rotate }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function MomentumBar() {
  const pathname = usePathname();
  
  const {
    totalPoints,
    lastPointsAwarded,
    lastStreakBonus,
    clearLastReward,
    currentStreak,
  } = useGame();

  const { level, levelName, progress } =
    getLevelFromPoints(totalPoints);

  const [open, setOpen] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState<FloatingReward[]>([]);
  const [glowActive, setGlowActive] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const prevLevelRef = useRef(level);
  const rewardIdRef = useRef(0);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const displayPoints = useAnimatedNumber(totalPoints);
  const progressPercent = progress * 100;

  useEffect(() => {
    if (collapseTimerRef.current) return;
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (lastPointsAwarded) {
      setOpen(true);
      setGlowActive(true);
      setTimeout(() => setGlowActive(false), 500);

      const id = ++rewardIdRef.current;
      setFloatingRewards((prev) => [
        ...prev,
        { id, amount: lastPointsAwarded, type: "points" },
      ]);
      setTimeout(() => {
        setFloatingRewards((prev) => prev.filter((r) => r.id !== id));
      }, 1600);

      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = setTimeout(() => {
        setOpen(false);
        clearLastReward();
        collapseTimerRef.current = undefined;
      }, 5000);
    }
  }, [lastPointsAwarded, clearLastReward]);

  useEffect(() => {
    if (lastStreakBonus) {
      const id = ++rewardIdRef.current;
      setTimeout(() => {
        setFloatingRewards((prev) => [
          ...prev,
          { id, amount: lastStreakBonus, type: "streak" },
        ]);
        setTimeout(() => {
          setFloatingRewards((prev) => prev.filter((r) => r.id !== id));
        }, 1600);
      }, 400);
    }
  }, [lastStreakBonus]);

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setLeveledUp(true);
      setOpen(true);
      setTimeout(() => setLeveledUp(false), 2000);
    }
    prevLevelRef.current = level;
  }, [level]);

  // Hide MomentumBar on dashboard pages
  if (pathname === '/dashboard' || pathname === '/mock-data-demo') {
    return null;
  }

  return (
    <div className="fixed right-6 top-[72px] z-40 sm:top-[76px] max-sm:right-3 max-sm:top-[60px]">
      {/* Floating rewards above the trigger */}
      <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2">
        <AnimatePresence>
          {floatingRewards.map((r) => (
            <motion.span
              key={r.id}
              className={cn(
                "absolute left-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold shadow-lg",
                r.type === "points"
                  ? "bg-emerald-500 text-white"
                  : "bg-violet-500 text-white"
              )}
              initial={{ x: "-50%", y: 0, opacity: 1, scale: 0.6 }}
              animate={{ x: "-50%", y: -36, opacity: 1, scale: 1 }}
              exit={{ y: -52, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
            >
              +{r.amount} {r.type === "streak" ? "streak!" : "XP"}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Confetti on level-up */}
      <AnimatePresence>
        {leveledUp && <ConfettiBurst />}
      </AnimatePresence>

      {/* Trigger pill */}
      <motion.button
        className={cn(
          "relative flex items-center gap-2 rounded-full px-3 py-2 shadow-lg",
          "bg-gradient-to-r from-indigo-500 via-primary to-violet-500 text-white",
          "hover:shadow-xl hover:brightness-110 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "max-sm:gap-1.5 max-sm:px-2.5 max-sm:py-1.5"
        )}
        onClick={() => setOpen((prev) => !prev)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="flex size-6 items-center justify-center max-sm:size-5"
          animate={lastPointsAwarded ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <PlacemakerIcon className="size-5 max-sm:size-4" />
        </motion.div>
        <span className="font-mono text-sm font-bold tabular-nums max-sm:text-xs">
          {displayPoints}
        </span>

        {/* Mini progress arc — hidden on mobile */}
        <div className="relative size-5 max-sm:hidden">
          <svg viewBox="0 0 20 20" className="size-5 -rotate-90">
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2.5"
            />
            <motion.circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 8}
              animate={{ strokeDashoffset: 2 * Math.PI * 8 * (1 - progress) }}
              transition={SPRING}
            />
          </svg>
        </div>

        <ChevronDown
          className={cn(
            "size-3.5 text-white/70 transition-transform max-sm:hidden",
            open ? "rotate-180" : ""
          )}
        />
      </motion.button>

      {/* Dropdown card (below trigger) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-xl max-sm:right-0 max-sm:w-[calc(100vw-24px)] max-sm:max-w-72"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={SPRING}
          >
            <div className="px-4 pb-4 pt-3">
              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="flex size-8 items-center justify-center rounded-lg bg-primary/10"
                    animate={
                      leveledUp
                        ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {leveledUp ? (
                      <Trophy className="size-4 text-primary" />
                    ) : (
                      <PlacemakerIcon className="size-5" />
                    )}
                  </motion.div>
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={levelName}
                        className="text-sm font-semibold text-foreground"
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {levelName}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-xs text-muted-foreground">Level {level}</p>
                  </div>
                </div>
                {leveledUp && (
                  <motion.span
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    Level up!
                  </motion.span>
                )}
              </div>

              {/* Progress bar */}
              <div className="relative mb-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  animate={{ width: `${progressPercent}%` }}
                  transition={SPRING}
                />
                <AnimatePresence>
                  {glowActive && (
                    <motion.div
                      className="absolute inset-y-0 w-6 rounded-full bg-white/50 blur-sm"
                      style={{ left: `calc(${progressPercent}% - 12px)` }}
                      initial={{ opacity: 0.8, scaleX: 0.5 }}
                      animate={{ opacity: 0, scaleX: 2.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold tabular-nums text-foreground">
                  {displayPoints} XP
                </span>
                <span className="text-muted-foreground">
                  {Math.round(100 - progress * 100)}% away from leveling up
                </span>
              </div>

              {/* Streak indicator */}
              {currentStreak > 0 && (
                <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1.5">
                  <span className="text-sm">🔥</span>
                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                    {currentStreak} task streak
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
