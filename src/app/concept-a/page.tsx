"use client";

import { IdentityHeader } from "@/components/dashboard/identity-header";
import { LocationIntelligenceCard } from "@/components/dashboard/location-intelligence-card";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConceptAPage() {
  const router = useRouter();

  const handleHighImpactClick = () => {
    router.push("/places");
  };

  const handleQuickDailyClick = () => {
    router.push("/places-daily-tasks");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav activeTab="Concept A" />
      
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* Identity Header - Standard */}
        <div className="mb-6">
          <IdentityHeader />
        </div>

        {/* Split-Screen Vertical Cards - Main Focus */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
            
            {/* High Impact Card - Left Half */}
            <Card 
              className="group relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 flex flex-col h-full"
              onClick={handleHighImpactClick}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg" />
              
              <CardHeader className="pb-4 flex-shrink-0 relative z-10">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-foreground mb-2">
                      High Impact
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">
                      Deep venue verification & quality improvements
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between relative z-10">
                <div className="space-y-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-blue-600" />
                      <span className="text-base">Complex data validation</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-blue-600" />
                      <span className="text-base">Multi-step venue verification</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-blue-600" />
                      <span className="text-base">Strategic improvements</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      ⏱️ Time commitment: 15-45 minutes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Perfect for focused work sessions
                    </p>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className="w-full h-12 text-lg font-semibold group-hover:shadow-lg transition-all"
                  onClick={handleHighImpactClick}
                >
                  Start High Impact Tasks
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Daily Card - Right Half */}
            <Card 
              className="group relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-secondary/30 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex flex-col h-full"
              onClick={handleQuickDailyClick}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-lg" />
              
              <CardHeader className="pb-4 flex-shrink-0 relative z-10">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-foreground mb-2">
                      Quick Daily
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">
                      Map-based micro-tasks & spot checks
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between relative z-10">
                <div className="space-y-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-green-600" />
                      <span className="text-base">Quick confirmations</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-green-600" />
                      <span className="text-base">Location spot checks</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-green-600" />
                      <span className="text-base">My World map exploration</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      ⚡ Time commitment: 2-10 minutes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Perfect for quick breaks
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full h-12 text-lg font-semibold group-hover:shadow-lg transition-all border-green-200 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:hover:bg-green-950"
                  onClick={handleQuickDailyClick}
                >
                  Start Quick Tasks
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location Intelligence - Bottom Summary (Sticky Style) */}
        <div className="sticky bottom-4">
          <LocationIntelligenceCard />
        </div>
      </div>
    </div>
  );
}