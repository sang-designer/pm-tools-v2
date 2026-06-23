"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { VenueList } from "./venue-list";
import { VenueTable } from "./venue-table";
import { SearchFilters } from "./search-filters";
import { MapPanel } from "./map-panel";
import { LeaderboardDrawer } from "./leaderboard-drawer";
import { FilterState, FILTER_GROUPS } from "./filter-drawer";
import { InviteModal } from "@/components/invite/invite-modal";
import { RewardBanner } from "@/components/invite/reward-banner";
import { ContextualInviteBanner } from "@/components/invite/contextual-invite-banner";
import { useInviteTrigger } from "@/lib/invite-context";
import { useGame } from "@/lib/game-context";
import { useIsLgDown } from "@/hooks/use-responsive";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, ArrowRight, Search, SlidersHorizontal, List, Map, Home, ChevronRight } from "lucide-react";
import { VERACITY_COLORS } from "@/lib/constants";


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
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [mobileViewMode, setMobileViewMode] = useState<"list" | "map">("list");
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);
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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <a 
          href="/" 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </a>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Venue Management</span>
      </div>

      <RewardBanner />

      <motion.div
        variants={staggerItem}
        custom={1}
        initial={initial}
        animate={animate}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Active Tasks
          </h2>
        </div>
      </motion.div>

      <motion.div
        variants={staggerItem}
        custom={2}
        initial={initial}
        animate={animate}
        className="mb-6"
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
          viewMode={viewMode}
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
            className="flex flex-col gap-6 lg:flex-row lg:gap-6 h-[calc(100dvh-240px)] lg:h-[calc(100vh-240px)]"
            style={{ minHeight: "400px" }}
          >
            {(!isLgDown || mobileViewMode === "list") && (
              <div className="h-full w-full shrink-0 lg:w-[480px]" data-guide="venue-list">
                <div className="h-full rounded-xl border border-border/40 bg-card/50 shadow-sm overflow-hidden">
                  <VenueList venues={filteredVenues} />
                </div>
              </div>
            )}
            {(!isLgDown || mobileViewMode === "map") && (
              <div className="flex-1 overflow-hidden rounded-xl border border-border/40 bg-card/50 shadow-sm relative z-0" data-guide="map">
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
                        <div className="flex items-center gap-2 pr-8">
                          <div className="text-base font-semibold text-foreground">
                            {selectedVenue.name}
                          </div>
                          {selectedVenue.veracityRating != null && (
                            <Badge className={`shrink-0 tabular-nums text-xs px-1.5 py-0 ${VERACITY_COLORS[selectedVenue.veracityRating] ?? ""}`}>
                              {selectedVenue.veracityRating}
                            </Badge>
                          )}
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
          <div className="rounded-xl border border-border/40 bg-card/50 shadow-sm p-6" style={{ minHeight: "400px" }}>
            <p className="mb-6 text-sm text-muted-foreground">
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
