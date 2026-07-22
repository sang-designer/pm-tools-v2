"use client";

import { useState, useRef, useEffect } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, MapPin, Flame, TrendingUp, ChevronDown, Search, Check } from "lucide-react";
import { MOCK_GLOBAL_LEADERBOARD, MOCK_LOCATION_PROFILES, MOCK_USER_PROFILES } from "@/lib/mock-data";
import { TablePagination } from "@/components/ui/table-pagination";
import { useUserStats } from "@/hooks/use-user-stats";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

const avatarStyles: Array<(name: string, index: number) => string | null> = [
  (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  () => `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face`,
  (name) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,ffdfbf`,
  () => `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face`,
  (name) => `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  () => null,
  (name) => `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  () => `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face`,
  (name) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  () => `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face`,
  (name) => `https://api.dicebear.com/7.x/bottts/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  () => null,
  () => `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face`,
  (name) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}2&backgroundColor=ffdfbf,d1d4f9`,
  () => `https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face`,
];

function getAvatarSrc(name: string, index: number): string | null {
  const styleFn = avatarStyles[index % avatarStyles.length];
  return styleFn(name.replace(/\s+/g, ""), index);
}

export default function LeaderboardPage() {
  const { userStats, locationStats } = useUserStats();
  const [tab, setTab] = useState<string>("global");
  const [timeRange, setTimeRange] = useState("all-time");
  const [page, setPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(
    locationStats?.homeZone || "San Francisco Bay Area"
  );

  const currentUser = userStats || MOCK_USER_PROFILES[0];

  const globalData = (() => {
    if (timeRange === "all-time") return MOCK_GLOBAL_LEADERBOARD;

    const multipliers = timeRange === "this-week"
      ? [0.08, 0.12, 0.05, 0.15, 0.10, 0.07, 0.11, 0.06, 0.14, 0.09, 0.13, 0.04, 0.16, 0.03, 0.10, 0.07, 0.12, 0.05, 0.08, 0.11, 0.06, 0.09, 0.14, 0.03, 0.07, 0.10, 0.05, 0.12, 0.08, 0.04]
      : [0.25, 0.30, 0.20, 0.35, 0.28, 0.22, 0.32, 0.18, 0.33, 0.24, 0.31, 0.15, 0.36, 0.12, 0.27, 0.21, 0.29, 0.16, 0.23, 0.26, 0.17, 0.24, 0.34, 0.11, 0.19, 0.28, 0.14, 0.30, 0.20, 0.13];

    return MOCK_GLOBAL_LEADERBOARD
      .map((c, i) => ({
        ...c,
        contributions: Math.round(c.contributions * (multipliers[i] || 0.1)),
      }))
      .sort((a, b) => b.contributions - a.contributions);
  })();

  const userGlobalRank = globalData.findIndex((c) => c.name === currentUser.name) + 1 || 13;

  const localProfile = MOCK_LOCATION_PROFILES.find((p) => p.homeZone === selectedRegion);
  const localData = (() => {
    const base = localProfile?.topContributors.map((c) => ({
      ...c,
      region: selectedRegion,
      streak: Math.floor(Math.random() * 20) + 1,
    })) || [];

    if (timeRange === "all-time") return base;

    const factor = timeRange === "this-week" ? 0.1 : 0.3;
    const offsets = [1.2, 0.8, 1.5, 0.6, 1.1, 0.9, 1.4, 0.7, 1.3, 0.5, 1.0, 0.85, 1.15, 0.75, 1.25];
    return base
      .map((c, i) => ({
        ...c,
        contributions: Math.round(c.contributions * factor * (offsets[i % offsets.length])),
      }))
      .sort((a, b) => b.contributions - a.contributions);
  })();
  const userLocalRank = localData.findIndex((c) => c.name === currentUser.name) + 1 || 3;

  const displayData = tab === "global" ? globalData : localData;
  const totalPages = Math.ceil(displayData.length / PAGE_SIZE);
  const paginatedData = displayData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const regions = MOCK_LOCATION_PROFILES.map((p) => p.homeZone);
  const [regionSearch, setRegionSearch] = useState("");
  const [regionOpen, setRegionOpen] = useState(false);
  const filteredRegions = regions.filter((r) =>
    r.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const handleTabChange = (val: string) => {
    setTab(val);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Contribute" />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
          {/* Page Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              See how you stack up against other contributors
            </p>
          </div>

          {/* Your Rank Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Global Rank</p>
                <p className="text-3xl font-bold mt-1">#{userGlobalRank}</p>
                <p className="text-xs text-muted-foreground mt-1">of {globalData.length} contributors</p>
                <div className="flex items-center gap-2 mt-3">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Up 2 spots this week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Local Rank</p>
                <p className="text-3xl font-bold mt-1">#{userLocalRank}</p>
                <p className="text-xs text-muted-foreground mt-1">in {selectedRegion}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs text-orange-500 font-medium">{currentUser.streak} day streak</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Tabs value={tab} onValueChange={handleTabChange}>
              <TabsList className="h-9">
                <TabsTrigger value="global" className="text-sm px-3 py-1.5">
                  Global
                </TabsTrigger>
                <TabsTrigger value="local" className="text-sm px-3 py-1.5">
                  Local
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              {tab === "local" && (
                <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                  <PopoverTrigger
                    className="flex items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 h-9 text-sm w-[200px] hover:bg-accent/50 transition-colors"
                  >
                    <span className="truncate">{selectedRegion}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", regionOpen && "rotate-180")} />
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[220px] p-0">
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Search regions..."
                          value={regionSearch}
                          onChange={(e) => setRegionSearch(e.target.value)}
                          className="h-8 pl-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto p-1">
                      {filteredRegions.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-3">No regions found</p>
                      ) : (
                        filteredRegions.map((region) => (
                          <button
                            key={region}
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-accent",
                              region === selectedRegion && "bg-accent"
                            )}
                            onClick={() => {
                              setSelectedRegion(region);
                              setPage(1);
                              setRegionOpen(false);
                              setRegionSearch("");
                            }}
                          >
                            <span>{region}</span>
                            {region === selectedRegion && (
                              <Check className="h-3.5 w-3.5 text-foreground" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <Select value={timeRange} onValueChange={(val) => val && setTimeRange(val)}>
                <SelectTrigger className="w-[140px] h-9 text-sm [&>svg]:shrink-0 [&>svg]:ml-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leaderboard Table */}
          {displayData.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
              <MapPin className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">No contributors yet</p>
              <p className="text-xs text-muted-foreground/80 mt-1 max-w-[240px] text-center">
                {selectedRegion} doesn&apos;t have any contributors yet. Be the first to start verifying places!
              </p>
            </div>
          ) : (
          <Card>
            <CardContent className="p-0">
              {/* Header */}
              <div className="grid grid-cols-[3rem_1fr_6rem] sm:grid-cols-[3rem_1fr_10rem_6rem] items-center px-4 py-3 border-b bg-muted/30 text-xs font-medium text-muted-foreground tracking-wide">
                <span>Rank</span>
                <span>Contributor</span>
                <span className="hidden sm:block">Region</span>
                <span className="text-right">Total Edits</span>
              </div>

              {/* Rows */}
              <div className="divide-y">
                {paginatedData.map((contributor, index) => {
                  const rank = (page - 1) * PAGE_SIZE + index + 1;
                  const isCurrentUser = contributor.name === currentUser.name;
                  const avatarSrc = isCurrentUser
                    ? currentUser.avatar
                    : getAvatarSrc(contributor.name, rank - 1);

                  return (
                    <div
                      key={contributor.name}
                      className={cn(
                        "grid grid-cols-[3rem_1fr_6rem] sm:grid-cols-[3rem_1fr_10rem_6rem] items-center px-4 py-3 transition-colors hover:bg-muted/30",
                        isCurrentUser && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                    >
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-muted-foreground">{rank}</span>
                      </div>

                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                          {avatarSrc && <AvatarImage src={avatarSrc} />}
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {contributor.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{contributor.name}</span>
                            {isCurrentUser && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">You</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground sm:hidden">{contributor.region}</span>
                        </div>
                      </div>

                      <span className="hidden sm:block text-xs text-muted-foreground">
                        {contributor.region}
                      </span>

                      <span className="text-sm font-semibold text-right">{contributor.contributions}</span>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t">
                  <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </CardContent>
          </Card>
          )}
        </div>
      </main>
    </div>
  );
}
