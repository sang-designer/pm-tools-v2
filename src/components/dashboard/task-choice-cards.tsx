"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target } from "lucide-react";
import { useRouter } from "next/navigation";

export function TaskChoiceCards() {
  const router = useRouter();

  const handleHighImpactClick = () => {
    router.push("/places");
  };

  const handleQuickDailyClick = () => {
    router.push("/places-daily-tasks");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* High Impact Card */}
      <Card 
        className="group relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800"
        onClick={handleHighImpactClick}
      >
        {/* Subtle map pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2217%22%20cy%3D%2217%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2237%22%20cy%3D%2217%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2217%22%20cy%3D%2237%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2237%22%20cy%3D%2237%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%227%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div>
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg font-bold">High Impact</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Venue-based tasks
              </p>
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

      {/* Quick Daily Card */}
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
              <p className="text-sm text-muted-foreground">
                Map-based micro-tasks
              </p>
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