"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  Activity,
  Heart
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
  const [completedHover, setCompletedHover] = useState(false);
  const [remainingHover, setRemainingHover] = useState(false);

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
              <div className="text-2xl font-bold text-slate-600">
                {Math.round(locationStats.regionHealth * 100)}%
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
              style={{ width: `${Math.min(100, Math.max(0, locationStats.regionHealth * 100))}%` }}
            />
          </div>

          {/* Tasks done vs tasks remaining */}
          <div className="grid grid-cols-2 gap-3">
            {/* Completed - celebration on hover */}
            <div
              className="relative p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 transition-all duration-300 cursor-default overflow-hidden"
              style={{
                transform: completedHover ? 'scale(1.03)' : 'scale(1)',
                boxShadow: completedHover ? '0 4px 20px rgba(34, 197, 94, 0.25)' : 'none',
              }}
              onMouseEnter={() => setCompletedHover(true)}
              onMouseLeave={() => setCompletedHover(false)}
            >
              {/* Confetti burst */}
              {completedHover && (
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const colors = ['#22c55e', '#eab308', '#ec4899', '#8b5cf6', '#f97316', '#06b6d4', '#ef4444', '#10b981'];
                    const color = colors[i % colors.length];
                    const angle = (i / 24) * 360;
                    const distance = 40 + (i % 5) * 8;
                    const x = Math.cos((angle * Math.PI) / 180) * distance;
                    const y = Math.sin((angle * Math.PI) / 180) * distance;
                    const size = 4 + (i % 3) * 2;
                    const delay = (i % 6) * 40;
                    const isRound = i % 3 !== 0;
                    return (
                      <span
                        key={i}
                        className="absolute left-1/2 top-1/2 animate-[confetti-pop_600ms_ease-out_forwards]"
                        style={{
                          width: `${size}px`,
                          height: isRound ? `${size}px` : `${size * 2.5}px`,
                          borderRadius: isRound ? '50%' : '2px',
                          backgroundColor: color,
                          animationDelay: `${delay}ms`,
                          opacity: 0,
                          // @ts-expect-error CSS custom properties
                          '--confetti-x': `${x}px`,
                          '--confetti-y': `${y}px`,
                          '--confetti-rot': `${angle + 180}deg`,
                        }}
                      />
                    );
                  })}
                  <style>{`
                    @keyframes confetti-pop {
                      0% { opacity: 1; transform: translate(-50%, -50%) scale(0) rotate(0deg); }
                      40% { opacity: 1; }
                      100% { opacity: 0; transform: translate(calc(-50% + var(--confetti-x)), calc(-50% + var(--confetti-y))) scale(1) rotate(var(--confetti-rot)); }
                    }
                  `}</style>
                </div>
              )}
              <div className={`text-xl font-bold text-foreground transition-transform duration-300 ${completedHover ? 'scale-110 origin-left' : ''}`}>
                {locationStats.verifiedCount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Tasks completed</div>
            </div>

            {/* Remaining - urgency nudge on hover */}
            <div
              className="relative p-3 rounded-lg bg-muted/60 border border-border flex items-center justify-between transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                transform: remainingHover ? 'scale(1.03)' : 'scale(1)',
                borderColor: remainingHover ? 'rgb(249, 115, 22)' : undefined,
                backgroundColor: remainingHover ? 'rgb(255, 247, 237)' : undefined,
              }}
              onMouseEnter={() => setRemainingHover(true)}
              onMouseLeave={() => setRemainingHover(false)}
            >
              {/* Pulsing ring effect */}
              {remainingHover && (
                <span className="absolute inset-0 rounded-lg border-2 border-orange-300 animate-ping opacity-30" />
              )}
              <div>
                <div className={`text-xl font-bold text-foreground transition-all duration-300 ${remainingHover ? 'text-orange-700' : ''}`}>
                  {locationStats.pendingCount}
                </div>
                <div className={`text-xs transition-all duration-300 ${remainingHover ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                  {remainingHover ? 'They need you!' : 'Tasks remaining'}
                </div>
              </div>
              <button className={`text-xs font-medium underline underline-offset-2 transition-all duration-300 ${remainingHover ? 'text-orange-700 decoration-orange-400 translate-x-0.5' : 'text-foreground decoration-muted-foreground/50'}`}>
                Help out →
              </button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {locationStats.recentActivity}
          </div>
        </CardContent>
      </Card>

      {/* Regional Challenges */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">Area Needs Your Support</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {locationStats.regionChallenges.map((challenge, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  challenge.priority === 'high' 
                    ? 'bg-red-500' 
                    : challenge.priority === 'medium'
                    ? 'bg-orange-500'
                    : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{challenge.title}</div>
                  <div className="text-sm text-muted-foreground">{challenge.description}</div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    challenge.priority === 'high' 
                      ? 'border-red-200 text-red-700 bg-red-50' 
                      : challenge.priority === 'medium'
                      ? 'border-orange-200 text-orange-700 bg-orange-50'
                      : 'border-yellow-200 text-yellow-700 bg-yellow-50'
                  }`}
                >
                  {challenge.priority}
                </Badge>
              </div>
            </div>
          ))}
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