"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { UserProfileCard } from "@/components/user-profile-card";
import { VenueList } from "./venue-list";
import { VenueTable } from "./venue-table";
import { SearchFilters } from "./search-filters";
import { MapPanel } from "./map-panel";
import { LeaderboardDrawer } from "./leaderboard-drawer";
import { InviteButton } from "@/components/invite/invite-button";
import { FilterState, FILTER_GROUPS } from "./filter-drawer";
import { InviteModal } from "@/components/invite/invite-modal";
import { RewardBanner } from "@/components/invite/reward-banner";
import { ContextualInviteBanner } from "@/components/invite/contextual-invite-banner";
import { useInviteTrigger } from "@/lib/invite-context";
import { useGame } from "@/lib/game-context";
import { useIsLgDown } from "@/hooks/use-responsive";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PanelTopOpen, PanelTopClose, X, ArrowRight, Search, SlidersHorizontal, List, Map } from "lucide-react";

const PROFILE_COLLAPSED_KEY = "placemaker-profile-collapsed";

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const CATEGORY_CHIPS = [
  { label: "Restaurants", icon: "🍽️" },
  { label: "Coffee", icon: "☕" },
  { label: "Bakery", icon: "🍞" },
  { label: "Bars", icon: "🍸" },
  { label: "Shopping", icon: "🛍️" },
];

interface ClassicViewProps {
  staggerEntrance?: boolean;
  externalLeaderboardOpen?: boolean;
  onExternalLeaderboardChange?: (open: boolean) => void;
  externalInviteOpen?: boolean;
  onExternalInviteChange?: (open: boolean) => void;
}

export function ClassicView({
  staggerEntrance = false,
  externalLeaderboardOpen = false,
  onExternalLeaderboardChange,
  externalInviteOpen = false,
  onExternalInviteChange,
}: ClassicViewProps) {
  const [internalLeaderboard, setInternalLeaderboard] = useState(false);
  const [internalInvite, setInternalInvite] = useState(false);

  const leaderboardOpen = externalLeaderboardOpen || internalLeaderboard;
  const setLeaderboardOpen = useCallback((open: boolean) => {
    setInternalLeaderboard(open);
    onExternalLeaderboardChange?.(open);
  }, [onExternalLeaderboardChange]);

  const inviteOpen = externalInviteOpen || internalInvite;
  const setInviteOpen = useCallback((open: boolean) => {
    setInternalInvite(open);
    onExternalInviteChange?.(open);
  }, [onExternalInviteChange]);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [mobileViewMode, setMobileViewMode] = useState<"list" | "map">("map");
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);
  const [profileCollapsed, setProfileCollapsed] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileHeight, setProfileHeight] = useState<number>(0);
  const { showTrigger, triggerMessage, dismissTrigger } = useInviteTrigger();
  const { venues, selectedVenueId, setSelectedVenueId, getVenueState } = useGame();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLgDown = useIsLgDown();

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ selected: new Set() });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Apply filter from URL param (e.g. ?filter=hours)
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setAppliedFilters({ selected: new Set([filterParam]) });
    }
  }, [searchParams]);

  const pendingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of venues) {
      if (v.globallyCompleted) continue;
      const state = getVenueState(v.id);
      if (state === "completed" || state === "completed_globally") continue;
      const taskCount = v.tasks.length;
      if (taskCount === 0) continue;
      for (const tag of v.tags) {
        counts[tag] = (counts[tag] || 0) + taskCount;
      }
    }

    for (const group of FILTER_GROUPS) {
      if (!group.children) continue;
      const parentTotal = counts[group.label] || 0;
      if (parentTotal === 0) continue;
      let remaining = parentTotal;
      group.children.forEach((child, i) => {
        if (i === group.children!.length - 1) {
          counts[child.key] = remaining;
        } else {
          const share = Math.round(parentTotal * ((i + 1) / (group.children!.length * 2)));
          counts[child.key] = share;
          remaining -= share;
        }
      });
    }

    return counts;
  }, [venues, getVenueState]);

  const filteredVenues = useMemo(() => {
    let result = venues;
    if (needsReviewOnly) {
      result = result.filter((v) => {
        const state = getVenueState(v.id);
        return state === "unvisited" || state === "in_progress";
      });
    }

    if (appliedFilters.selected.size > 0) {
      const activeTags = new Set<string>();
      for (const group of FILTER_GROUPS) {
        if (group.children) {
          const hasChild = group.children.some((c) => appliedFilters.selected.has(c.key));
          if (hasChild) activeTags.add(group.label);
        } else if (appliedFilters.selected.has(group.key)) {
          activeTags.add(group.label);
        }
      }
      if (activeTags.size > 0) {
        result = result.filter((v) =>
          v.tags.some((tag) => activeTags.has(tag))
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.address.toLowerCase().includes(q)
      );
    }

    return result;
  }, [venues, needsReviewOnly, appliedFilters, searchQuery, getVenueState]);

  const selectedVenue = selectedVenueId
    ? filteredVenues.find((v) => v.id === selectedVenueId) ?? venues.find((v) => v.id === selectedVenueId)
    : null;

  useEffect(() => {
    setProfileCollapsed(localStorage.getItem(PROFILE_COLLAPSED_KEY) === "true");
  }, []);

  useEffect(() => {
    const el = profileRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setProfileHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggleProfile = useCallback(() => {
    setProfileCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(PROFILE_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  const animate = staggerEntrance ? "visible" : undefined;
  const initial = staggerEntrance ? "hidden" : undefined;

  // ─── Mobile full-screen map view ──────────────────────────────────────
  if (isLgDown && mobileViewMode === "map") {
    return (
      <>
        <div className="relative flex h-[calc(100dvh-56px)] flex-col">
          {/* Full-screen map */}
          <div className="absolute inset-0 z-0">
            <MapPanel venues={filteredVenues} />
          </div>

          {/* Floating search + filters overlay */}
          <div className="pointer-events-none relative z-10 flex flex-col gap-2 px-4 pt-3">
            <div className="pointer-events-auto relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for place"
                className="h-12 rounded-xl border-0 bg-background pl-10 shadow-lg ring-1 ring-border/50"
                aria-label="Search for place"
              />
            </div>
            <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORY_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent active:scale-95"
                >
                  <span>{chip.icon}</span>
                  {chip.label}
                </button>
              ))}
            </div>
            <div className="pointer-events-auto flex justify-center">
              <button className="whitespace-nowrap rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg ring-1 ring-border/50 transition-transform active:scale-95">
                Search this area
              </button>
            </div>
          </div>

          {/* Map control buttons (right side) */}
          <div className="pointer-events-none absolute right-3 top-[120px] z-10 flex flex-col gap-2">
            <button
              className="pointer-events-auto flex size-10 items-center justify-center rounded-lg bg-background shadow-lg ring-1 ring-border/50 transition-colors hover:bg-accent"
              aria-label="My location"
            >
              <svg className="size-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
            </button>
            <button
              className="pointer-events-auto flex size-10 items-center justify-center rounded-lg bg-background shadow-lg ring-1 ring-border/50 transition-colors hover:bg-accent"
              aria-label="Filter settings"
            >
              <SlidersHorizontal className="size-5 text-foreground" />
            </button>
          </div>

          {/* Bottom venue card (appears when a pin is tapped) */}
          <AnimatePresence>
            {selectedVenue && (
              <motion.div
                key={selectedVenue.id}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="absolute inset-x-4 bottom-20 z-20 rounded-2xl border border-border bg-card p-4 shadow-xl ring-1 ring-foreground/5"
              >
                <button
                  onClick={() => setSelectedVenueId(null)}
                  className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>

                <button
                  onClick={() => router.push(`/venue/${selectedVenue.id}`)}
                  className="w-full text-left"
                >
                  <div className="pr-8 text-base font-semibold text-foreground">
                    {selectedVenue.name}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {selectedVenue.address}
                  </p>
                  {!selectedVenue.globallyCompleted && selectedVenue.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedVenue.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                    Venue Details
                    <ArrowRight className="size-3.5" />
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List view toggle FAB */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
            <button
              onClick={() => setMobileViewMode("list")}
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-lg transition-transform active:scale-95"
            >
              <List className="size-4" aria-hidden="true" />
              List view
            </button>
          </div>
        </div>

        <ContextualInviteBanner
          visible={showTrigger}
          message={triggerMessage}
          onInvite={() => { dismissTrigger(); setInviteOpen(true); }}
          onDismiss={dismissTrigger}
        />
        <LeaderboardDrawer open={leaderboardOpen} onOpenChange={setLeaderboardOpen} onInvite={() => { setLeaderboardOpen(false); setInviteOpen(true); }} />
        <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
      </>
    );
  }

  // ─── Desktop layout (unchanged) / Mobile list view ────────────────────
  return (
    <div className="relative px-4 py-4 sm:px-8 lg:px-12">
      <RewardBanner />

      <motion.div
        variants={staggerItem}
        custom={0}
        initial={initial}
        animate={animate}
      >
        <motion.div
          animate={{
            height: profileCollapsed ? 0 : profileHeight,
            opacity: profileCollapsed ? 0 : 1,
          }}
          transition={{
            height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.2, ease: "easeOut" },
          }}
          style={{ overflow: "clip" }}
        >
          <div ref={profileRef}>
            <h1 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Welcome, Sang
            </h1>
            <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start" data-guide="profile">
              <div className="min-w-0 flex-1">
                <UserProfileCard />
              </div>
              <div className="flex w-full shrink-0 flex-col lg:w-[304px]">
                <div className="lg:px-4">
                  <h3 className="my-1 text-base font-medium text-foreground">Quick Links</h3>
                </div>
                <nav className="flex flex-1 gap-4 lg:flex-col lg:gap-1.5 lg:px-4" aria-label="Quick links">
                  <a href="/add-place" className="min-h-[44px] flex items-center text-sm text-primary hover:underline sm:min-h-0">Add a new place</a>
                  <a href="/my-contributions" className="min-h-[44px] flex items-center text-sm text-primary hover:underline sm:min-h-0">My suggestions</a>
                  <button onClick={() => setLeaderboardOpen(true)} className="min-h-[44px] flex items-center text-sm text-primary hover:underline text-left sm:min-h-0">Leaderboard</button>
                  <div>
                    <InviteButton variant="inline" onClick={() => setInviteOpen(true)} />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        custom={1}
        initial={initial}
        animate={animate}
        className="mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    onClick={toggleProfile}
                    className="group inline-flex size-10 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground shadow-sm transition-all hover:border-border hover:bg-accent hover:text-foreground hover:shadow active:scale-95 sm:size-8"
                  />
                }
              >
                <AnimatePresence mode="wait" initial={false}>
                  {profileCollapsed ? (
                    <motion.span
                      key="open"
                      className="inline-flex"
                      initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <PanelTopOpen className="size-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="close"
                      className="inline-flex"
                      initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <PanelTopClose className="size-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {profileCollapsed ? "Show profile" : "Hide profile"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Foursquare Places
          </h2>
        </div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        custom={2}
        initial={initial}
        animate={animate}
        className="mb-4"
      >
        <SearchFilters
          needsReviewOnly={needsReviewOnly}
          onNeedsReviewChange={setNeedsReviewOnly}
          onFiltersChange={setAppliedFilters}
          onSearchChange={setSearchQuery}
          pendingCounts={pendingCounts}
          filterOpen={filterOpen}
          onFilterOpenChange={setFilterOpen}
          appliedFilters={appliedFilters}
        />
      </motion.div>

      <motion.div
        variants={staggerItem}
        custom={3}
        initial={initial}
        animate={animate}
        className="relative"
      >
        {viewMode === "map" ? (
          <div
            className={`flex flex-col gap-4 lg:flex-row lg:gap-0 ${
              profileCollapsed
                ? "h-[calc(100dvh-180px)] lg:h-[calc(100vh-180px)]"
                : "h-[calc(100dvh-340px)] lg:h-[calc(100vh-340px)]"
            }`}
            style={{ minHeight: "400px" }}
          >
            {(!isLgDown || mobileViewMode === "list") && (
              <div className="h-full w-full shrink-0 lg:w-[476px]" data-guide="venue-list">
                <VenueList venues={filteredVenues} />
              </div>
            )}
            {(!isLgDown || mobileViewMode === "map") && (
              <div className="flex-1 overflow-hidden rounded-2xl relative z-0" data-guide="map">
                <MapPanel venues={filteredVenues} />

                <AnimatePresence>
                  {isLgDown && selectedVenue && (
                    <motion.div
                      key={selectedVenue.id}
                      initial={{ y: 120, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 120, opacity: 0 }}
                      transition={{ type: "spring", damping: 26, stiffness: 300 }}
                      className="absolute inset-x-3 bottom-3 z-10 rounded-2xl border border-border bg-card p-4 shadow-xl ring-1 ring-foreground/5"
                    >
                      <button
                        onClick={() => setSelectedVenueId(null)}
                        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                      >
                        <X className="size-4" />
                      </button>

                      <button
                        onClick={() => router.push(`/venue/${selectedVenue.id}`)}
                        className="w-full text-left"
                      >
                        <div className="pr-8 text-base font-semibold text-foreground">
                          {selectedVenue.name}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {selectedVenue.address}
                        </p>
                        {!selectedVenue.globallyCompleted && selectedVenue.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {selectedVenue.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                          Venue Details
                          <ArrowRight className="size-3.5" />
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          <div style={{ minHeight: "400px" }}>
            <p className="mb-4 text-sm text-muted-foreground">
              Click on a place below to start voting on other users&apos; edits, or provide feedback about a specific place by using the search bar above.
            </p>
            <VenueTable venues={filteredVenues} />
          </div>
        )}

        <div className="pointer-events-none sticky bottom-6 z-10 flex justify-center">
          <button
            onClick={() => {
              if (isLgDown) {
                setMobileViewMode(mobileViewMode === "list" ? "map" : "list");
              } else {
                setViewMode(viewMode === "map" ? "list" : "map");
              }
            }}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-lg transition-transform hover:scale-105 active:scale-95 sm:py-2.5"
          >
            {(() => {
              const currentMode = isLgDown ? mobileViewMode : viewMode;
              if (currentMode === "list") {
                return (
                  <>
                    <Map className="size-4" aria-hidden="true" />
                    Map view
                  </>
                );
              }
              return (
                <>
                  <List className="size-4" aria-hidden="true" />
                  List view
                </>
              );
            })()}
          </button>
        </div>
      </motion.div>

      <ContextualInviteBanner
        visible={showTrigger}
        message={triggerMessage}
        onInvite={() => { dismissTrigger(); setInviteOpen(true); }}
        onDismiss={dismissTrigger}
      />

      <LeaderboardDrawer open={leaderboardOpen} onOpenChange={setLeaderboardOpen} onInvite={() => { setLeaderboardOpen(false); setInviteOpen(true); }} />
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
