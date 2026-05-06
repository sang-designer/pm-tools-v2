"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QuestMap, QuestMapHandle, PinPosition } from "./quest-map";
import { TaskCard } from "./task-card";
import { QuestProgress, useQuestCompletion, useDailyProgress } from "./quest-progress";
import { StreakBanner } from "./streak-banner";
import { MyWorldOverlay } from "./my-world-overlay";
import { CelebrationOverlay } from "./celebration-overlay";
import { DailyGoalCelebration } from "./daily-goal-celebration";
import { InviteButton } from "@/components/invite/invite-button";
import { InviteModal } from "@/components/invite/invite-modal";
import { RewardBanner } from "@/components/invite/reward-banner";
import { ContextualInviteBanner } from "@/components/invite/contextual-invite-banner";
import { useInviteTrigger } from "@/lib/invite-context";
import { useGame } from "@/lib/game-context";
import { POINTS } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function QuestView() {
  const {
    currentStreak,
    lastStreakBonus,
    lastPointsAwarded,
    venues,
    venueProgress,
    getNextVenue,
    setSelectedVenueId,
    selectedVenueId,
    addMoreVenues,
  } = useGame();
  const [showStreakBanner, setShowStreakBanner] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [showMyWorld, setShowMyWorld] = useState(false);
  const [pinPos, setPinPos] = useState<PinPosition | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDailyGoalCelebration, setShowDailyGoalCelebration] = useState<"goal" | "bonus" | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const mapRef = useRef<QuestMapHandle>(null);
  const { pct } = useQuestCompletion();
  const { goalReached, bonusEarned } = useDailyProgress();
  const prevPct = useRef(pct);
  const prevGoalReached = useRef(goalReached);
  const prevBonusEarned = useRef(bonusEarned);
  const { showTrigger, triggerMessage, dismissTrigger } = useInviteTrigger();

  // Handle daily goal celebrations
  useEffect(() => {
    // Check if daily goal (5 tasks) was just reached - this is now the bonus threshold
    if (goalReached && !prevGoalReached.current) {
      setShowDailyGoalCelebration("goal");
    }
    
    prevGoalReached.current = goalReached;
    prevBonusEarned.current = bonusEarned;
  }, [goalReached, bonusEarned]);

  if (pct >= 100 && prevPct.current < 100) {
    setShowCelebration(true);
  }
  prevPct.current = pct;

  const refreshPinPos = useCallback(() => {
    if (!selectedVenueId || !mapRef.current) {
      setPinPos(null);
      return;
    }
    const p = mapRef.current.getPinPosition(selectedVenueId);
    setPinPos(p);
  }, [selectedVenueId]);

  useEffect(() => {
    refreshPinPos();
  }, [refreshPinPos]);

  // Re-position the card whenever the map moves or zooms
  useEffect(() => {
    if (!mapRef.current) return;
    return mapRef.current.onMoveEnd(refreshPinPos);
  }, [refreshPinPos]);

  // After flyTo completes, refresh position once more with a delay
  useEffect(() => {
    if (!selectedVenueId) return;
    const t = setTimeout(refreshPinPos, 700);
    return () => clearTimeout(t);
  }, [selectedVenueId, refreshPinPos]);

  useEffect(() => {
    if (hasShownWelcome) return;
    const unvisited = venues.filter(
      (v) => !v.globallyCompleted && !venueProgress.some((p) => p.venueId === v.id)
    ).length;
    if (unvisited > 0) {
      toast(`📍 ${unvisited} venues near you need help!`, { duration: 4000 });
      setHasShownWelcome(true);
    }
  }, [venues, venueProgress, hasShownWelcome]);

  useEffect(() => {
    if (lastStreakBonus) {
      setShowStreakBanner(true);
      const timer = setTimeout(() => setShowStreakBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastStreakBonus]);

  useEffect(() => {
    if (
      currentStreak > 0 &&
      currentStreak % POINTS.STREAK_THRESHOLD === POINTS.STREAK_THRESHOLD - 1
    ) {
      toast("🔥 You're 1 task away from a streak bonus!", { duration: 3000 });
    }
  }, [currentStreak]);

  const handleNextVenue = useCallback(() => {
    const center = { lat: 37.765, lng: -122.42 };
    const next = getNextVenue(center.lat, center.lng);
    if (next) {
      setSelectedVenueId(next.id);
      toast(`🏃‍♂️➡️ Heading to ${next.name}`, { duration: 2000 });
    } else {
      toast("🎉 All nearby venues completed! Great job!", { duration: 3000 });
    }
  }, [getNextVenue, setSelectedVenueId]);

  // Auto-advance to next venue after completing a task (with short delay for animation)
  // or immediately after skipping all tasks on a venue
  // Block auto-advance while celebration is showing
  useEffect(() => {
    if (!selectedVenueId && !showMyWorld && !showCelebration) {
      const delay = lastPointsAwarded ? 600 : 0;
      const timer = setTimeout(() => {
        handleNextVenue();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [lastPointsAwarded, selectedVenueId, showMyWorld, showCelebration, handleNextVenue]);

  const handleToggleMyWorld = useCallback(() => {
    setShowMyWorld((prev) => {
      const next = !prev;
      if (next) {
        setSelectedVenueId(null);
        setTimeout(() => mapRef.current?.fitCompletedVenues(), 100);
      } else {
        mapRef.current?.resetView();
      }
      return next;
    });
  }, [setSelectedVenueId]);

  const handleCloseMyWorld = useCallback(() => {
    setShowMyWorld(false);
    mapRef.current?.resetView();
  }, []);

  const handleDoMore = useCallback(() => {
    addMoreVenues();
    setShowCelebration(false);
    toast("🚀 10 new venues added! Let's go!", { duration: 3000 });
  }, [addMoreVenues]);

  return (
    <div className="relative h-[calc(100dvh-64px)] w-full overflow-hidden">
      <QuestMap ref={mapRef} showAllCompleted={showMyWorld} />
      <RewardBanner />

      {!showMyWorld && <TaskCard pinPosition={pinPos} />}
      {!showMyWorld && <QuestProgress onMyWorldToggle={handleToggleMyWorld} />}

      <StreakBanner
        streak={currentStreak}
        bonus={POINTS.STREAK_BONUS}
        visible={showStreakBanner && !showMyWorld}
      />

      <AnimatePresence>
        {showMyWorld && <MyWorldOverlay onClose={handleCloseMyWorld} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && <CelebrationOverlay onDone={() => setShowCelebration(false)} onDoMore={handleDoMore} />}
      </AnimatePresence>

      <AnimatePresence>
        {showDailyGoalCelebration && (
          <DailyGoalCelebration 
            type={showDailyGoalCelebration}
            onContinue={() => setShowDailyGoalCelebration(null)}
            onDone={() => {
              setShowDailyGoalCelebration(null);
              // Open My World to show stats after a brief delay
              setTimeout(() => handleToggleMyWorld(), 300);
            }}
          />
        )}
      </AnimatePresence>

      <ContextualInviteBanner
        visible={showTrigger && !showMyWorld && !showCelebration && !showDailyGoalCelebration}
        message={triggerMessage}
        onInvite={() => { dismissTrigger(); setInviteOpen(true); }}
        onDismiss={dismissTrigger}
      />

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-wrap justify-center gap-2">
        {!selectedVenueId && !showMyWorld && (
          <Button
            onClick={handleNextVenue}
            size="sm"
            variant="outline"
            className="h-10 gap-2 rounded-full border-border bg-card px-4 text-foreground shadow-lg hover:bg-accent sm:h-auto"
          >
            <Navigation className="size-3.5" />
            Find Next Venue
          </Button>
        )}
        <InviteButton
          variant="primary"
          onClick={() => setInviteOpen(true)}
          className="rounded-full shadow-lg max-sm:px-3"
        />
      </div>

      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
