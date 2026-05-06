"use client";

import { IdentityHeaderVariant } from "@/components/landing/identity-header-variant";
import { TaskChoiceCardsVariant } from "@/components/landing/task-choice-cards-variant";
import { LocationIntelligenceCardVariant } from "@/components/landing/location-intelligence-card-variant";
import { AchievementCollection } from "@/components/achievements/achievement-collection";

export function ConceptAGamified() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50/40 via-teal-50/20 to-white dark:from-cyan-950/40 dark:via-teal-950/20 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero Identity Section */}
        <div className="mb-8">
          <IdentityHeaderVariant variant="gamified" />
        </div>

        {/* Main Action Cards */}
        <div className="mb-8">
          <TaskChoiceCardsVariant variant="gamified" />
        </div>

        {/* Achievement Collection */}
        <div className="mb-8">
          <AchievementCollection />
        </div>

        {/* Gamified Stats & Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 xl:col-span-2 order-2 lg:order-1">
            <LocationIntelligenceCardVariant variant="gamified" />
          </div>
          
          {/* Additional Gamified Content */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Task Progress Card */}
            <div className="p-4 sm:p-6 bg-card border rounded-lg">
              <div className="text-center space-y-3">
                <div className="text-sm text-muted-foreground">Tasks Remaining Today</div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  17 tasks
                </div>
                <div className="text-sm text-muted-foreground">
                  8 completed this session
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 h-2 rounded-full shadow-sm" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>

            {/* This Week Challenge */}
            <div className="p-4 sm:p-6 bg-card border rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">
                    Weekly Challenge
                  </div>
                  <div className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-1 rounded">
                    Special Badge
                  </div>
                </div>
                
                <div className="text-base sm:text-lg font-semibold">
                  Verify 25 Bay Area venues
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">8/25 venues</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 h-2 rounded-full shadow-sm" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}