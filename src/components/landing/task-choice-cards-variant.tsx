"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, TrendingUp, Users, Award, Star, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStats } from "@/hooks/use-user-stats";
import { cn } from "@/lib/utils";

// Custom Progress component with purple gradient for gamified variant
function PurpleProgress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`relative h-1 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 transition-all duration-500 ease-out shadow-sm"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface TaskChoiceCardsProps {
  variant?: "default" | "gamified" | "efficiency" | "community" | "efficiency2";
  className?: string;
}

export function TaskChoiceCardsVariant({ variant = "default", className }: TaskChoiceCardsProps) {
  const router = useRouter();
  const { userStats } = useUserStats();

  const handleHighImpactClick = () => {
    router.push("/places");
  };

  const handleQuickDailyClick = () => {
    router.push("/places-daily-tasks");
  };

  // Variant-specific rendering
  switch (variant) {
    case "gamified":
      return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
          {/* High Impact Card - Gamified */}
          <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50">
            {/* Tasks Available Badge */}
            <Badge className="absolute top-4 right-4 bg-violet-500 text-white font-medium">
              12 tasks
            </Badge>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <Target className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      High Impact Quest
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Epic venue challenges • Master difficulty
                  </p>
                  
                  {/* Difficulty indicators */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-amber-500 fill-current' : 'text-muted'}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">Expert Level</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Deep venue verification</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">4 left</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Complex data validation</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">5 left</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Quality improvements</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">3 left</Badge>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleHighImpactClick}
              >
                Start Epic Quest
              </Button>
            </CardContent>
          </Card>

          {/* Quick Daily Card - Gamified */}
          <Card className="group relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50">
            {/* Tasks Available Badge */}
            <Badge className="absolute top-4 right-4 bg-teal-500 text-white font-medium">
              23 tasks
            </Badge>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-600 rounded-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      Daily Missions
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quick wins • Perfect for streaks
                  </p>
                  
                  {/* Speed indicators */}
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-teal-600" />
                    <Zap className="h-3 w-3 text-teal-600" />
                    <Zap className="h-3 w-3 text-muted" />
                    <span className="text-xs text-muted-foreground ml-1">Fast Track</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Quick confirmations</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">8 left</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Location spotchecks</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">10 left</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">My World map view</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">5 left</Badge>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleQuickDailyClick}
              >
                Start Daily Missions
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case "efficiency":
      return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>
          {/* Venue Specific Card - Efficiency */}
          <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-gray-900 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Place Specific Tasks</CardTitle>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Venue-based verification
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4 flex-1 flex flex-col">
              <div className="space-y-1">
                <button
                  className="flex items-center justify-between w-full rounded-md px-2 py-2 hover:bg-muted/40 transition-colors text-left group border-b border-transparent hover:border-foreground/10"
                  onClick={() => router.push("/places?filter=hours")}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Confirm business hours</span>
                  </div>
                  <Badge variant="outline" className="text-xs">12 nearby</Badge>
                </button>
                <button
                  className="flex items-center justify-between w-full rounded-md px-2 py-2 hover:bg-muted/40 transition-colors text-left group border-b border-transparent hover:border-foreground/10"
                  onClick={() => router.push("/places?filter=locations")}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Verify locations</span>
                  </div>
                  <Badge variant="outline" className="text-xs">8 nearby</Badge>
                </button>
                <button
                  className="flex items-center justify-between w-full rounded-md px-2 py-2 hover:bg-muted/40 transition-colors text-left group border-b border-transparent hover:border-foreground/10"
                  onClick={() => router.push("/places?filter=contact")}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Update contact info</span>
                  </div>
                  <Badge variant="outline" className="text-xs">5 nearby</Badge>
                </button>
                <button
                  className="flex items-center justify-between w-full rounded-md px-2 py-2 hover:bg-muted/40 transition-colors text-left group border-b border-transparent hover:border-foreground/10"
                  onClick={() => router.push("/places?filter=photos")}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Add missing photos</span>
                  </div>
                  <Badge variant="outline" className="text-xs">4 nearby</Badge>
                </button>
                <button
                  className="flex items-center justify-between w-full rounded-md px-2 py-2 hover:bg-muted/40 transition-colors text-left group border-b border-transparent hover:border-foreground/10"
                  onClick={() => router.push("/places?filter=menu")}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Review menu details</span>
                  </div>
                  <Badge variant="outline" className="text-xs">3 nearby</Badge>
                </button>
              </div>
              
              <Button 
                className="w-full mt-auto"
                onClick={handleHighImpactClick}
              >
                Continue Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Daily Quick Tasks Card - Efficiency */}
          <div className="flex flex-col gap-4">
          <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Daily Quick Tasks</CardTitle>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Map-based micro-tasks
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Streak encouragement */}
              {userStats && userStats.streak > 0 && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                  <span className="text-lg">🔥</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{userStats.streak}-day streak!</div>
                    <div className="text-xs text-muted-foreground">Keep it going — complete a task today</div>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleQuickDailyClick}
              >
                Start Quick Session
              </Button>
            </CardContent>
          </Card>

          {/* Quick Wins Card - Endowed Progress Effect */}
          <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Quick Wins</CardTitle>
              <p className="text-sm text-muted-foreground">
                These tasks are almost done — just <span className="font-semibold text-foreground">your review</span> to complete them.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" className="w-full" onClick={() => router.push("/venue/v1")}>
                Let&apos;s do it!
              </Button>
            </CardContent>
          </Card>
          </div>
        </div>
      );

    case "efficiency2":
      // Task Efficiency 2 - High Impact card with improved layout
      return (
        <div className={cn("flex gap-6", className)}>
          <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-gray-900 flex-1">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg font-bold text-foreground">High Impact Tasks</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Venue-based verification</span>
                    <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400">
                      High Value
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-8">
              {/* Tightly grouped stats - left aligned */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Current Queue</h4>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">5</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">15m</div>
                    <div className="text-xs text-muted-foreground">Avg Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-600">High</div>
                    <div className="text-xs text-muted-foreground">Impact</div>
                  </div>
                </div>
              </div>
              
              {/* Compact, right-aligned CTA */}
              <div className="flex justify-end">
                <Button 
                  className="px-6"
                  onClick={handleHighImpactClick}
                >
                  Start Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Panel */}
          <div className="flex flex-col gap-4 w-48">
            <div className="text-center p-4 bg-slate-50/80 dark:bg-slate-900/30 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div className="text-center p-4 bg-slate-50/80 dark:bg-slate-900/30 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
              <div className="text-2xl font-bold text-foreground">156</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
            <div className="text-center p-4 bg-slate-50/80 dark:bg-slate-900/30 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
              <div className="text-2xl font-bold text-slate-600">94%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>
        </div>
      );

    case "community":
      return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
          {/* High Impact Card - Community */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-slate-300 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900/20 dark:via-gray-900 dark:to-gray-900/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-700 dark:text-slate-300">
                      Regional Impact
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Help improve your community&apos;s data quality
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Community stats */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                <Users className="h-5 w-5 text-slate-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Bay Area Contributors</div>
                  <div className="text-xs text-muted-foreground">23 active this week</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-600">156</div>
                  <div className="text-xs text-muted-foreground">verified</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-slate-600" />
                  <span className="text-sm">Deep venue verification</span>
                  <Badge variant="secondary" className="text-xs ml-auto">Community Priority</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Missing hours & contacts</span>
                  <Badge variant="secondary" className="text-xs ml-auto">High Need</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm">New business discovery</span>
                  <Badge variant="secondary" className="text-xs ml-auto">Growing Area</Badge>
                </div>
              </div>
              
              <Button 
                variant="default"
                className="w-full"
                onClick={handleHighImpactClick}
              >
                Join Regional Effort
              </Button>
            </CardContent>
          </Card>

          {/* Quick Daily Card - Community */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-blue-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-700 dark:text-slate-300">
                      Local Spotchecks
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quick verifications in your neighborhood
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Community progress */}
              <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Today&apos;s Community Goal</div>
                  <PurpleProgress value={73} className="h-1 mt-1" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">73%</div>
                  <div className="text-xs text-muted-foreground">complete</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm">Confirm business hours</span>
                  <Badge variant="outline" className="text-xs ml-auto">12 nearby</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-cyan-600" />
                  <span className="text-sm">Verify locations</span>
                  <Badge variant="outline" className="text-xs ml-auto">8 nearby</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  <span className="text-sm">Update contact info</span>
                  <Badge variant="outline" className="text-xs ml-auto">5 nearby</Badge>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleQuickDailyClick}
              >
                Help Local Community
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    default:
      // Default variant (existing implementation from task-choice-cards.tsx)
      return (
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", className)}>
          {/* High Impact Card - Default */}
          <Card 
            className="group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800"
            onClick={handleHighImpactClick}
          >
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2217%22%20cy%3D%2217%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2237%22%20cy%3D%2217%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2217%22%20cy%3D%2237%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2237%22%20cy%3D%2237%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div>
            
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg font-bold">High Impact</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">Venue-based tasks</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Deep venue verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Complex data validation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Quality improvements</span>
                </div>
              </div>
              
              <Button 
                variant="default"
                className="w-full"
                onClick={handleHighImpactClick}
              >
                Start High Impact Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Quick Daily Card - Default */}
          <Card 
            className="group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20"
            onClick={handleQuickDailyClick}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-lg font-bold">Quick Daily</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">Map-based micro-tasks</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Quick confirmations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">Location spotchecks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gray-600" />
                  <span className="text-sm">My World map view</span>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleQuickDailyClick}
              >
                Start Quick Tasks
              </Button>
            </CardContent>
          </Card>
        </div>
      );
  }
}