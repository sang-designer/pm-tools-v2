"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalNav } from "@/components/global-nav";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { Loader2 } from "lucide-react";

function MapLoadingFallback() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
}

const ClassicView = dynamic(
  () => import("@/components/classic/classic-view").then((m) => m.ClassicView),
  { ssr: false, loading: MapLoadingFallback }
);

function PlacesContent() {
  const [showingWelcome, setShowingWelcome] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [revealDashboard, setRevealDashboard] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isFirst = !localStorage.getItem("placemaker-welcomed");
    setShowingWelcome(isFirst);
    if (!isFirst) setRevealDashboard(false);
  }, []);

  const handleWelcomeStateChange = useCallback((showing: boolean) => {
    setShowingWelcome(showing);
    if (!showing) setRevealDashboard(true);
  }, []);

  const content = showingWelcome ? (
    <main className="flex-1" role="main">
      <SkeletonLayout />
    </main>
  ) : (
    <main className="flex-1" role="main">
      <Suspense fallback={<MapLoadingFallback />}>
        <ClassicView
          staggerEntrance={revealDashboard}
          externalLeaderboardOpen={leaderboardOpen}
          onExternalLeaderboardChange={setLeaderboardOpen}
          externalInviteOpen={inviteOpen}
          onExternalInviteChange={setInviteOpen}
        />
      </Suspense>
    </main>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-stone-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <GlobalNav
        activeTab="Places"
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenInvite={() => setInviteOpen(true)}
      />


      <WelcomeDialog onWelcomeStateChange={handleWelcomeStateChange} />

      {/* Main Content Area */}
      <div className="flex-1">
        {mounted ? (
          <AnimatePresence mode="wait">
            {showingWelcome ? (
              <motion.main
                key="welcome-bg"
                className="flex-1"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                role="main"
              >
                <SkeletonLayout />
              </motion.main>
            ) : (
              <motion.main
                key="dashboard"
                className="flex-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                role="main"
              >
                <Suspense fallback={<MapLoadingFallback />}>
                  <ClassicView
                    staggerEntrance={revealDashboard}
                    externalLeaderboardOpen={leaderboardOpen}
                    onExternalLeaderboardChange={setLeaderboardOpen}
                    externalInviteOpen={inviteOpen}
                    onExternalInviteChange={setInviteOpen}
                  />
                </Suspense>
              </motion.main>
            )}
          </AnimatePresence>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className ?? ""}`} />;
}

function SkeletonLayout() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-4 opacity-60 sm:px-6 sm:py-6">
      <div className="hidden w-[340px] shrink-0 flex-col gap-4 lg:flex">
        {/* Profile card skeleton */}
        <div className="rounded-xl border border-border/40 bg-card/50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <SkeletonBlock className="size-11 !rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <SkeletonBlock className="h-3.5 w-28" />
              <SkeletonBlock className="h-2.5 w-20" />
            </div>
          </div>
          <SkeletonBlock className="mb-3 h-2 w-full" />
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <SkeletonBlock className="h-5 w-8" />
              <SkeletonBlock className="h-2 w-14" />
            </div>
            <div className="flex flex-col gap-1">
              <SkeletonBlock className="h-5 w-8" />
              <SkeletonBlock className="h-2 w-14" />
            </div>
          </div>
        </div>

        {/* Search bar skeleton */}
        <SkeletonBlock className="h-9 w-full" />

        {/* Venue cards skeleton */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border/40 bg-card/50 p-4">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <SkeletonBlock className="h-3.5 w-36" />
                <SkeletonBlock className="h-2.5 w-24" />
              </div>
              <SkeletonBlock className="h-5 w-12 !rounded-full" />
            </div>
            <div className="mt-3 flex gap-2">
              <SkeletonBlock className="h-6 w-16 !rounded-full" />
              <SkeletonBlock className="h-6 w-20 !rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Right side: map area */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Filter bar skeleton */}
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-7 w-20 !rounded-full" />
          <SkeletonBlock className="h-7 w-24 !rounded-full" />
          <div className="flex-1" />
          <SkeletonBlock className="h-7 w-32" />
        </div>
        {/* Map skeleton */}
        <div className="flex-1 overflow-hidden rounded-xl border border-border/40 bg-muted/30" style={{ minHeight: "calc(100vh - 200px)" }} />
      </div>
    </div>
  );
}

export default function Places() {
  return (
    <Suspense fallback={<MapLoadingFallback />}>
      <PlacesContent />
    </Suspense>
  );
}