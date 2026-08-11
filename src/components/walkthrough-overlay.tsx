"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WALKTHROUGH_STORAGE_KEY = "placemaker-walkthrough-completed";

interface WalkthroughStep {
  title: string;
  description: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  pulsePosition: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  scrollTo?: string; // CSS selector to scroll to
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    title: "Your profile at a glance",
    description: "This is your home base. Track your level, progress, and contribution stats — all in one place.",
    position: { top: "180px", left: "50%", transform: "translateX(-50%)" },
    pulsePosition: { top: "160px", left: "50%" },
  },
  {
    title: "Review Queue",
    description: "This is where the magic happens. Review places, verify information, and help improve the map for millions of people.",
    position: { top: "320px", left: "50%", transform: "translateX(-50%)" },
    pulsePosition: { top: "450px", left: "50%" },
  },
  {
    title: "Track your contributions",
    description: "See all your edits, approvals, and impact on the community. Watch your contributions grow over time.",
    position: { top: "200px", right: "40px" },
    pulsePosition: { bottom: "200px", right: "180px" },
    scrollTo: "#quick-links-card",
  },
  {
    title: "Compete on the leaderboard",
    description: "See how you rank against other contributors. Climb the leaderboard as you help improve places worldwide.",
    position: { top: "200px", right: "40px" },
    pulsePosition: { top: "570px", right: "200px" },
    scrollTo: "#leaderboard-card",
  },
];

interface WalkthroughOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalkthroughOverlay({ isOpen, onClose }: WalkthroughOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "true");
    }
    setCurrentStep(0);
    onClose();
  };

  const step = WALKTHROUGH_STEPS[currentStep];

  // Auto-scroll to the target element when step changes
  useEffect(() => {
    if (isOpen && step.scrollTo) {
      const element = document.querySelector(step.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, isOpen, step.scrollTo]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Light backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20"
            onClick={handleSkip}
          />

          {/* Pulsing dot indicator */}
          <motion.div
            key={`pulse-${currentStep}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={step.pulsePosition}
            className="fixed z-[60]"
          >
            <div className="relative">
              <motion.div
                className="size-4 rounded-full bg-purple-600"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-0 size-4 rounded-full bg-purple-600/30"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Walkthrough Card */}
          <motion.div
            key={`card-${currentStep}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={step.position}
            className="fixed z-50 w-full max-w-md rounded-xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {currentStep + 1}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of {WALKTHROUGH_STEPS.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
              >
                Skip
              </Button>
            </div>

            {/* Content */}
            <div className="px-5 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
              {/* Progress Dots */}
              <div className="flex gap-1.5">
                {WALKTHROUGH_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === currentStep
                        ? "w-6 bg-primary"
                        : index < currentStep
                        ? "w-1.5 bg-primary/50"
                        : "w-1.5 bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button onClick={handleBack} size="sm" variant="outline">
                    Back
                  </Button>
                )}
                <Button onClick={handleNext} size="sm">
                  {currentStep === WALKTHROUGH_STEPS.length - 1 ? "Done" : "Next"}
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function hasCompletedWalkthrough(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(WALKTHROUGH_STORAGE_KEY) === "true";
}
