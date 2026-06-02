"use client";

import { useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Globe, MapPin, Flame, TrendingUp, Crown, Medal, Award } from "lucide-react";
import { MOCK_GLOBAL_LEADERBOARD, MOCK_LOCATION_PROFILES, MOCK_USER_PROFILES } from "@/lib/mock-data";
import { useUserStats } from "@/hooks/use-user-stats";
import { cn } from "@/lib/utils";

const avatarStyles: Array<(name: string) => string> = [
  (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  (name) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,ffdfbf`,
  (name) => `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  (name) => `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
  (name) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
];

function getAvatarSrc(name: string, index: number) {
  const styleFn = avatarStyles[index % avatarStyles.length];
  return styleFn(name.replace(/\s+/g, ""));
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-amber-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
  return null;
}

export default function LeaderboardPage() {
  const { userStats, locationStats } = useUserStats();
  const [tab, setTab] = useState<string>("global");
  const [timeRange, setTimeRange] = useState("all-time");
  const [selectedRegion, setSelectedRegion] = useState(
    locationStats?.homeZone || "San Francisco Bay Area"
  );

  const currentUser = userStats || MOCK_USER_PROFILES[0];

  const globalData = MOCK_GLOBAL_LEADERBOARD;
  const userGlobalRank = globalData.findIndex((c) => c.name === currentUser.name) + 1 || 13;

  const localProfile = MOCK_LOCATION_PROFILES.find((p) => p.homeZone === selectedRegion);
  const localData = localProfile?.topContributors.map((c) => ({
    ...c,
    region: selectedRegion,
    streak: Math.floor(Math.random() * 20) + 1,
  })) || [];
  const userLocalRank = localData.findIndex((c) => c.name === currentUser.name) + 1 || 3;

  const displayData = tab === "global" ? globalData : localData;
  const userRank = tab === "global" ? userGlobalRank : userLocalRank;

  const regions = MOCK_LOCATION_PROFILES.map((p) => p.homeZone);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-sm text-muted-foreground">
                See how you stack up against other contributors
              </p>
            </div>
          </div>

          {/* Your Rank Hero Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Global Rank</p>
                    <p className="text-3xl font-bold mt-1">#{userGlobalRank}</p>
                    <p className="text-xs text-muted-foreground mt-1">of {globalData.length} contributors</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Up 2 spots this week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Local Rank</p>
                    <p className="text-3xl font-bold mt-1">#{userLocalRank}</p>
                    <p className="text-xs text-muted-foreground mt-1">in {selectedRegion}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs text-orange-500 font-medium">{currentUser.streak} day streak</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Tabs value={tab} onValueChange={(val) => setTab(val as string)}>
              <TabsList className="h-9">
                <TabsTrigger value="global" className="text-sm px-3 py-1.5">
                  <Globe className="h-3.5 w-3.5 mr-1.5" />
                  Global
                </TabsTrigger>
                <TabsTrigger value="local" className="text-sm px-3 py-1.5">
                  <MapPin className="h-3.5 w-3.5 mr-1.5" />
                  Local
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              {tab === "local" && (
                <Select value={selectedRegion} onValueChange={(val) => val && setSelectedRegion(val)}>
                  <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={timeRange} onValueChange={(val) => val && setTimeRange(val)}>
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leaderboard Table */}
          <Card>
            <CardContent className="p-0">
              {/* Header */}
              <div className="grid grid-cols-[3rem_1fr_6rem_5rem] sm:grid-cols-[3rem_1fr_8rem_6rem_5rem] items-center px-4 py-3 border-b bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <span>Rank</span>
                <span>Contributor</span>
                <span className="hidden sm:block">Region</span>
                <span className="text-right">Verified</span>
                <span className="text-right">Streak</span>
              </div>

              {/* Rows */}
              <div className="divide-y">
                {displayData.map((contributor, index) => {
                  const rank = index + 1;
                  const isCurrentUser = contributor.name === currentUser.name;

                  return (
                    <div
                      key={contributor.name}
                      className={cn(
                        "grid grid-cols-[3rem_1fr_6rem_5rem] sm:grid-cols-[3rem_1fr_8rem_6rem_5rem] items-center px-4 py-3 transition-colors hover:bg-muted/30",
                        isCurrentUser && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                    >
                      {/* Rank */}
                      <div className="flex items-center">
                        {getRankIcon(rank) || (
                          <span className="text-sm font-bold text-muted-foreground">{rank}</span>
                        )}
                      </div>

                      {/* Contributor */}
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={getAvatarSrc(contributor.name, index)} />
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

                      {/* Region (desktop) */}
                      <span className="hidden sm:block text-xs text-muted-foreground truncate">
                        {contributor.region}
                      </span>

                      {/* Contributions */}
                      <span className="text-sm font-semibold text-right">{contributor.contributions}</span>

                      {/* Streak */}
                      <div className="flex items-center justify-end gap-1">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span className="text-sm text-muted-foreground">{contributor.streak}d</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Nearby You Section */}
          {userRank > 3 && (
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Your Neighborhood</CardTitle>
                <p className="text-xs text-muted-foreground">Contributors ranked near you</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {displayData.slice(Math.max(0, userRank - 3), userRank + 2).map((contributor, idx) => {
                    const rank = Math.max(1, userRank - 2) + idx;
                    const isCurrentUser = contributor.name === currentUser.name;
                    return (
                      <div
                        key={contributor.name}
                        className={cn(
                          "flex items-center justify-between px-5 py-3",
                          isCurrentUser && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-muted-foreground w-6">#{rank}</span>
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={getAvatarSrc(contributor.name, rank)} />
                            <AvatarFallback className="text-[10px]">
                              {contributor.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className={cn("text-sm", isCurrentUser && "font-semibold")}>
                            {contributor.name}
                            {isCurrentUser && " (You)"}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{contributor.contributions}</span>
                      </div>
                    );
                  })}
                </div>
                {userRank < displayData.length && (
                  <div className="px-5 py-3 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      {displayData[userRank - 2]?.contributions
                        ? `${displayData[userRank - 2].contributions - (displayData[userRank - 1]?.contributions || 0)} more verifications to move up!`
                        : "Keep verifying to climb the ranks!"}
                    </p>
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
