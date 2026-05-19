"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserStats } from "@/hooks/use-user-stats";
import { useLocationContext } from "@/lib/location-context";
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Award,
  Target,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Progress component with purple gradient for gamified variant  
function PurpleProgress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 transition-all duration-500 ease-out shadow-sm"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface LocationIntelligenceCardProps {
  variant?: "default" | "gamified" | "efficiency" | "community";
  className?: string;
}

interface LocationStats {
  regionHealth: number;
  homeZone: string;
  totalLocations: number;
  verifiedCount: number;
  pendingCount: number;
  recentActivity: string;
  topContributors: Array<{ name: string; contributions: number }>;
  weeklyStats: { locationsAdded: number; verificationsCompleted: number; issuesResolved: number };
  regionChallenges: Array<{ title: string; description: string; priority: string }>;
}

function CommunityHealthVariant({ locationStats, className }: { locationStats: LocationStats; className?: string }) {
  const router = useRouter();
  const healthPercent = Math.round(locationStats.regionHealth * 100);
  const isEmptyState = healthPercent < 5;

  if (isEmptyState) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Community Health
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-center space-y-3 py-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {locationStats.homeZone} needs its first explorers
                </p>
                <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">
                  {locationStats.totalLocations.toLocaleString()} places are waiting to be verified. Be the first to make your mark.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 text-center">
                <div className="text-lg font-bold text-violet-700 dark:text-violet-300">
                  {locationStats.totalLocations.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Places to explore</div>
              </div>
              <div
                className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 text-center cursor-pointer hover:border-amber-300 dark:hover:border-amber-600 transition-colors"
                onClick={() => router.push('/places')}
              >
                <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {locationStats.pendingCount}
                </div>
                <div className="text-xs text-muted-foreground">Quick tasks ready</div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push('/places')}
              className="w-full"
            >
              Start your first verification
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => window.open('https://discord.gg', '_blank')}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Join {locationStats.homeZone} Discord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Community Health
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {healthPercent}%
              </div>
              <div className="text-sm text-muted-foreground">
                {locationStats.homeZone} Health Score
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{locationStats.totalLocations.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">total places</div>
            </div>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, healthPercent))}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
              <div className="text-xl font-bold text-foreground">
                {locationStats.verifiedCount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Tasks completed</div>
            </div>

            <div
              className="p-3 rounded-lg bg-muted/60 border border-border flex items-center justify-between cursor-pointer hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-200"
              onClick={() => router.push('/places')}
            >
              <div>
                <div className="text-xl font-bold text-foreground">
                  {locationStats.pendingCount}
                </div>
                <div className="text-xs text-muted-foreground">Tasks remaining</div>
              </div>
              <span className="text-xs font-medium text-foreground underline underline-offset-2 decoration-muted-foreground/50">
                Help out &rarr;
              </span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {locationStats.recentActivity}
          </div>

          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => window.open('https://discord.gg', '_blank')}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join {locationStats.homeZone} Discord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function LocationIntelligenceCardVariant({ 
  variant = "default", 
  className 
}: LocationIntelligenceCardProps) {
  const { locationStats: hookLocationStats, isLoading, error } = useUserStats();
  const locationContext = useLocationContext();

  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error || !hookLocationStats) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Unable to load location information</p>
        </CardContent>
      </Card>
    );
  }

  const locationStats = locationContext ? locationContext.locationStats : hookLocationStats;

  // Variant-specific rendering
  switch (variant) {
    case "gamified":
      return (
        <div className={cn("space-y-6", className)}>
          {/* Leaderboard Card */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg font-bold text-foreground">
                  Regional Champions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {locationStats.topContributors.map((contributor, index) => (
                <div key={contributor.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' 
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
                        : 'bg-gradient-to-r from-orange-300 to-orange-500 text-white'
                    }`}>
                      #{index + 1}
                    </div>
                    <span className="font-medium">{contributor.name}</span>
                    {index === 0 && <Badge className="text-xs bg-yellow-100 text-yellow-800">👑 Legend</Badge>}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{contributor.contributions}</div>
                    <div className="text-xs text-muted-foreground">verified</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievement Progress */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-violet-600" />
                  <CardTitle className="text-lg font-semibold">Weekly Challenge</CardTitle>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  Special Badge
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Regional Verification Goal</span>
                  <span className="font-medium">
                    {locationStats.weeklyStats.verificationsCompleted}/200
                  </span>
                </div>
                <PurpleProgress 
                  value={(locationStats.weeklyStats.verificationsCompleted / 200) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-violet-50 dark:bg-violet-900/30 rounded">
                  <div className="font-bold text-violet-600">{locationStats.weeklyStats.locationsAdded}</div>
                  <div className="text-muted-foreground">Added</div>
                </div>
                <div className="text-center p-2 bg-teal-50 dark:bg-teal-900/30 rounded">
                  <div className="font-bold text-teal-600">{locationStats.weeklyStats.verificationsCompleted}</div>
                  <div className="text-muted-foreground">Verified</div>
                </div>
                <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded">
                  <div className="font-bold text-emerald-600">{locationStats.weeklyStats.issuesResolved}</div>
                  <div className="text-muted-foreground">Fixed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );

    case "efficiency":
      return (
        <div className={cn("space-y-4", className)}>
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-semibold">Area Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{locationStats.pendingCount}</div>
                  <div className="text-sm text-muted-foreground">Tasks Available</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(locationStats.regionHealth * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Data Quality</div>
                </div>
              </div>

              {/* Today's Activity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Recent Activity</span>
                  <span className="text-green-600 font-medium">{locationStats.recentActivity}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  View nearby tasks
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  See completed work
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );

    case "community":
      return <CommunityHealthVariant locationStats={locationStats} className={className} />;

    default:
      // Default variant (existing implementation)
      return (
        <Card className={cn("", className)}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">Location Intelligence</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {locationStats.homeZone}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Verified</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {locationStats.verifiedCount.toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {locationStats.pendingCount}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Region Health</span>
                <span className="font-medium">
                  {Math.round(locationStats.regionHealth * 100)}%
                </span>
              </div>
              <Progress value={locationStats.regionHealth * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Recent Activity</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {locationStats.recentActivity}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Top Contributors</span>
              </div>
              <div className="pl-6 space-y-1">
                {locationStats.topContributors.slice(0, 3).map((contributor, index) => (
                  <div key={contributor.name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {index + 1}. {contributor.name}
                    </span>
                    <span className="font-medium">{contributor.contributions}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
  }
}