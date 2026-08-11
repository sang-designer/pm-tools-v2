"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/game-context";
import { useIsMobile } from "@/hooks/use-responsive";
import { MapPin, Users, ArrowRight, Trophy, ChevronRight, ChevronLeft } from "lucide-react";
import { WalkthroughOverlay } from "@/components/walkthrough-overlay";

const STORAGE_KEY = "placemaker-welcomed";
const GUIDE_STORAGE_KEY = "placemaker-guide-done";

const HIGHLIGHTS = [
  { icon: MapPin, text: "Review and verify real places near you" },
  { icon: Users, text: "Join thousands of contributors worldwide" },
  { icon: Trophy, text: "Earn points and level up as you help" },
];

const PIN_COLORS = [
  "rgba(234,179,8,0.9)",
  "rgba(34,197,94,0.9)",
  "rgba(168,85,247,0.85)",
  "rgba(249,115,22,0.9)",
  "rgba(236,72,153,0.85)",
  "rgba(20,184,166,0.9)",
  "rgba(239,68,68,0.85)",
  "rgba(245,158,11,0.85)",
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface PinData {
  id: number;
  x: number;
  y: number;
  color: string;
  scale: number;
  delay: number;
  pulseDelay: number;
  size: number;
}

const STREET_LINES = [
  // Boulevards (wide, prominent)
  { d: "M 0,30 L 100,30", delay: 0.3, width: 1.2 },
  { d: "M 0,68 L 100,68", delay: 0.5, width: 1.0 },
  { d: "M 28,0 L 28,100", delay: 0.4, width: 1.2 },
  { d: "M 72,0 L 72,100", delay: 0.6, width: 1.0 },
  // Avenues (medium)
  { d: "M 0,15 L 100,15", delay: 0.7, width: 0.6 },
  { d: "M 0,48 L 100,48", delay: 0.8, width: 0.7 },
  { d: "M 0,85 L 100,85", delay: 0.9, width: 0.6 },
  { d: "M 10,0 L 10,100", delay: 0.7, width: 0.5 },
  { d: "M 50,0 L 50,100", delay: 0.85, width: 0.7 },
  { d: "M 90,0 L 90,100", delay: 0.95, width: 0.5 },
  // Side streets (thin)
  { d: "M 0,8 L 50,8", delay: 1.0, width: 0.25 },
  { d: "M 0,22 L 100,22", delay: 1.05, width: 0.25 },
  { d: "M 40,38 L 100,38", delay: 1.1, width: 0.2 },
  { d: "M 0,55 L 72,55", delay: 1.1, width: 0.25 },
  { d: "M 28,76 L 100,76", delay: 1.15, width: 0.2 },
  { d: "M 0,92 L 60,92", delay: 1.2, width: 0.25 },
  { d: "M 18,0 L 18,68", delay: 1.0, width: 0.25 },
  { d: "M 38,30 L 38,100", delay: 1.05, width: 0.2 },
  { d: "M 58,0 L 58,85", delay: 1.1, width: 0.25 },
  { d: "M 82,15 L 82,100", delay: 1.15, width: 0.2 },
  // Alleys (very thin, short)
  { d: "M 32,30 L 32,48", delay: 1.2, width: 0.15 },
  { d: "M 45,48 L 45,68", delay: 1.25, width: 0.15 },
  { d: "M 64,15 L 64,30", delay: 1.2, width: 0.15 },
  { d: "M 76,68 L 76,85", delay: 1.3, width: 0.15 },
  { d: "M 28,42 L 50,42", delay: 1.25, width: 0.15 },
  { d: "M 72,60 L 90,60", delay: 1.3, width: 0.15 },
  // Diagonal avenue
  { d: "M 0,95 L 55,0", delay: 1.3, width: 0.8 },
  // Curved road (park/river)
  { d: "M 68,0 Q 88,25 78,50 Q 68,75 85,100", delay: 1.4, width: 0.6 },
  // Small curved connector
  { d: "M 10,68 Q 18,78 28,85", delay: 1.45, width: 0.3 },
];

function AnimatedBanner() {
  const pins: PinData[] = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: randomBetween(8, 92),
        y: randomBetween(12, 85),
        color: PIN_COLORS[i % PIN_COLORS.length],
        scale: randomBetween(0.6, 1.1),
        delay: randomBetween(0.2, 1.2),
        pulseDelay: randomBetween(0, 3),
        size: [12, 14, 18, 22, 26, 30][Math.floor(Math.random() * 6)],
      })),
    []
  );

  const ripples = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        x: randomBetween(15, 85),
        y: randomBetween(20, 80),
        delay: i * 1.2,
      })),
    []
  );

  return (
    <div
      className="relative h-[40dvh] w-full overflow-hidden sm:h-52"
      style={{
        background:
          "linear-gradient(180deg, #fef9ee 0%, #fef3c7 20%, #fde68a 45%, #fdba74 70%, #fb923c 90%, #f97316 100%)",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, rgba(255,255,255,0.5) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 0%, transparent 40%)
          `,
        }}
      />

      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {STREET_LINES.map((street, i) => (
          <motion.path
            key={i}
            d={street.d}
            fill="none"
            stroke={`rgba(0,0,0,${street.width >= 1 ? 0.06 : street.width >= 0.5 ? 0.045 : 0.03})`}
            strokeWidth={street.width}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: street.delay, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </svg>

      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="absolute rounded-full border border-black/8"
          style={{
            left: `${r.x}%`,
            top: `${r.y}%`,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: 0, height: 0, opacity: 0.4 }}
          animate={{ width: 80, height: 80, opacity: 0 }}
          transition={{
            delay: r.delay,
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeOut",
          }}
        />
      ))}

      {pins.map((pin) => (
        <motion.div
          key={pin.id}
          className="absolute"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          initial={{ scale: 0, opacity: 0, y: -10 }}
          animate={{ scale: pin.scale, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 12,
            stiffness: 200,
            delay: pin.delay,
          }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: pin.pulseDelay,
              ease: "easeInOut",
            }}
          >
            <svg width={pin.size} height={pin.size * 1.33} viewBox="0 0 18 24" fill="none">
              <ellipse cx="9" cy="22" rx="4" ry="1.5" fill="rgba(0,0,0,0.12)" />
              <path
                d="M9 0C4.03 0 0 4.03 0 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9Z"
                fill={pin.color}
              />
              <circle cx="9" cy="9" r="3.5" fill="rgba(255,255,255,0.9)" />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />
    </div>
  );
}

const GUIDE_STEPS = [
  {
    step: 1,
    title: "Your profile at a glance",
    description:
      "This is your home base. Track your level, progress, and contribution stats — all in one place.",
    target: "profile",
  },
  {
    step: 2,
    title: "Browse places that need help",
    description:
      "Each card is a real place with information to verify. Pick one that catches your eye to get started.",
    target: "venue-list",
  },
  {
    step: 3,
    title: "Explore the map",
    description:
      "Pins on the map show places near you. Orange means places needing review, and black means places already in our dataset.",
    target: "map",
  },
  {
    step: 4,
    title: "Earn points and grow",
    description:
      "Every contribution earns points. Build streaks, level up, and watch your Proposed and Approved counts climb.",
    target: "stats",
  },
];

interface GuidePosition {
  top: number;
  left: number;
}

interface DotPosition {
  x: number;
  y: number;
}

function getTargetCenter(target: string): DotPosition | null {
  const el = document.querySelector(`[data-guide="${target}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function getCardPosition(target: string, dotCenter: DotPosition | null): GuidePosition {
  const el = document.querySelector(`[data-guide="${target}"]`);
  if (!el) return { top: window.innerHeight - 220, left: window.innerWidth / 2 - 180 };
  const rect = el.getBoundingClientRect();
  const cardWidth = 360;
  const cardHeight = 190;
  const gap = 12;

  const anchorY = dotCenter ? dotCenter.y : rect.top + rect.height / 2;
  const anchorX = dotCenter ? dotCenter.x : rect.left + rect.width / 2;

  const spaceRight = window.innerWidth - rect.right;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  let top: number;
  let left: number;

  if (spaceRight > cardWidth + gap * 2) {
    top = Math.max(gap, anchorY - cardHeight / 2);
    top = Math.min(top, window.innerHeight - cardHeight - gap);
    left = anchorX + gap;
  } else if (rect.left > cardWidth + gap * 2) {
    top = Math.max(gap, anchorY - cardHeight / 2);
    top = Math.min(top, window.innerHeight - cardHeight - gap);
    left = anchorX - gap - cardWidth;
  } else {
    if (spaceBelow > cardHeight + gap) {
      top = Math.max(gap, anchorY + 20);
    } else if (spaceAbove > cardHeight + gap) {
      top = Math.min(anchorY - 20 - cardHeight, rect.top - cardHeight - gap);
    } else {
      top = Math.max(gap, anchorY - cardHeight / 2);
    }

    top = Math.min(top, window.innerHeight - cardHeight - gap);

    left = Math.min(
      Math.max(gap, anchorX - cardWidth / 2),
      window.innerWidth - cardWidth - gap
    );
  }

  return { top, left };
}

function PulsingDot({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="pointer-events-none fixed z-40"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="relative"
      >
        <motion.div
          animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-2 rounded-full"
          style={{ backgroundColor: "rgb(217, 70, 239)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute -inset-4 rounded-full"
          style={{ backgroundColor: "rgb(217, 70, 239)" }}
        />
        <div
          className="relative size-3 rounded-full shadow-lg"
          style={{ backgroundColor: "rgb(217, 70, 239)" }}
        />
      </motion.div>
    </div>
  );
}

function OnboardingGuide({ onDismiss }: { onDismiss: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardPos, setCardPos] = useState<GuidePosition>({ top: 0, left: 0 });
  const [dotPos, setDotPos] = useState<DotPosition | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isMobile = useIsMobile();
  const total = GUIDE_STEPS.length;
  const step = GUIDE_STEPS[currentStep];

  const updatePosition = useCallback(() => {
    const dot = getTargetCenter(step.target);
    if (!dot) return false;
    setDotPos(dot);
    if (!isMobile) {
      setCardPos(getCardPosition(step.target, dot));
    }
    setIsReady(true);
    return true;
  }, [step.target, isMobile]);

  useEffect(() => {
    setIsReady(false);
    let raf: number;
    const poll = () => {
      if (updatePosition()) return;
      raf = requestAnimationFrame(poll);
    };
    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(poll);
    }, 600);
    const handleLayout = () => { updatePosition(); };
    window.addEventListener("resize", handleLayout);
    window.addEventListener("scroll", handleLayout, true);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleLayout);
      window.removeEventListener("scroll", handleLayout, true);
    };
  }, [updatePosition]);

  const handleNext = useCallback(() => {
    if (currentStep < total - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onDismiss();
    }
  }, [currentStep, total, onDismiss]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isReady && dotPos && (
          <PulsingDot key={`dot-${currentStep}`} x={dotPos.x} y={dotPos.y} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isReady && (
          <motion.div
            key={`guide-card-${currentStep}`}
            initial={isMobile ? { y: 80, opacity: 0 } : { y: 16, opacity: 0, scale: 0.97 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={isMobile ? { y: 80, opacity: 0 } : { y: -8, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
            className={
              isMobile
                ? "fixed inset-x-0 bottom-0 z-50 w-full max-h-[70dvh]"
                : "fixed z-50 w-[360px]"
            }
            style={isMobile ? undefined : { top: cardPos.top, left: cardPos.left }}
          >
            <div className={
              isMobile
                ? "overflow-hidden rounded-t-2xl bg-card shadow-xl ring-1 ring-border pb-[max(1rem,env(safe-area-inset-bottom))]"
                : "overflow-hidden rounded-xl bg-card shadow-xl ring-1 ring-border"
            }>
              {isMobile && (
                <div className="flex justify-center pt-2.5 pb-1">
                  <div className="h-1 w-10 rounded-full bg-muted-foreground/25" />
                </div>
              )}
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {step.step}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {step.step} of {total}
                  </span>
                </div>
                <button
                  onClick={onDismiss}
                  className="min-h-[44px] px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:min-h-0"
                  aria-label="Skip guide"
                >
                  Skip
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="px-4 py-4"
                >
                  <h3 className="mb-1 text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <div className="flex gap-1.5">
                  {GUIDE_STEPS.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        width: i === currentStep ? 20 : i < currentStep ? 12 : 8,
                        opacity: i <= currentStep ? 1 : 0.3,
                      }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      className="h-1.5 rounded-full"
                      style={
                        i <= currentStep
                          ? { background: "linear-gradient(90deg, #6366f1, #3b82f6, #06b6d4)" }
                          : { background: "hsl(var(--border))" }
                      }
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <Button
                      onClick={handleBack}
                      size="sm"
                      variant="ghost"
                      className="h-10 gap-1 text-muted-foreground sm:h-auto"
                    >
                      <ChevronLeft className="size-3.5" />
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    size="sm"
                    variant={currentStep === total - 1 ? "default" : "outline"}
                    className="h-10 gap-1.5 sm:h-auto"
                  >
                    {currentStep === total - 1 ? (
                      "Got it"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="size-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface WelcomeDialogProps {
  onWelcomeStateChange?: (isShowingWelcome: boolean) => void;
}

export function WelcomeDialog({ onWelcomeStateChange }: WelcomeDialogProps) {
  const { resetGame } = useGame();
  const [open, setOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
      onWelcomeStateChange?.(true);
    } else if (!localStorage.getItem(GUIDE_STORAGE_KEY)) {
      setShowGuide(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleGetStarted() {
    localStorage.setItem(STORAGE_KEY, "true");
    resetGame();
    setOpen(false);
    onWelcomeStateChange?.(false);
    setShowWalkthrough(true);
  }

  function handleCloseWalkthrough() {
    setShowWalkthrough(false);
    setShowGuide(true);
  }

  function handleDismissGuide() {
    localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    setShowGuide(false);
  }

  return (
    <>
      <Dialog open={open}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/[0.03] backdrop-blur-none"
          className="flex h-[100dvh] max-w-full flex-col gap-0 overflow-hidden rounded-none p-0 ring-0 sm:h-auto sm:max-w-lg sm:rounded-xl sm:ring-1 sm:ring-foreground/10"
        >
          <AnimatePresence>
            {open && (
              <>
                <AnimatedBanner />

                <div className="-mt-6 relative px-5 pb-2 sm:px-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <motion.h2
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.45 }}
                        className="mb-1.5 text-2xl font-semibold tracking-tight text-foreground"
                      >
                        Welcome to Placemaker
                      </motion.h2>
                      <motion.p
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.45 }}
                        className="text-sm text-muted-foreground"
                      >
                        Help improve places for millions of people around the world.
                      </motion.p>
                    </div>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      onClick={() => {
                        setOpen(false);
                        onWelcomeStateChange?.(false);
                        setShowWalkthrough(true);
                      }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Help
                    </motion.button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 px-5 py-5 sm:flex-initial sm:px-8">
                  {HIGHLIGHTS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.45 + i * 0.1, duration: 0.35 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06]">
                          <Icon className="size-4.5 text-foreground/70" />
                        </div>
                        <span className="text-sm text-foreground">
                          {item.text}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  className="mt-auto bg-muted/30 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:mt-0 sm:px-8"
                >
                  <Button
                    onClick={handleGetStarted}
                    className="h-12 w-full gap-2 sm:h-10"
                    size="lg"
                  >
                    Get Started
                    <ArrowRight className="size-4" data-icon="inline-end" />
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    8M+ places improved by the community
                  </p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showGuide && <OnboardingGuide onDismiss={handleDismissGuide} />}
      </AnimatePresence>

      <WalkthroughOverlay
        isOpen={showWalkthrough}
        onClose={handleCloseWalkthrough}
      />
    </>
  );
}
