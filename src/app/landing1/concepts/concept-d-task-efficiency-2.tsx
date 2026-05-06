"use client";

import { IdentityHeaderVariant } from "@/components/landing/identity-header-variant";
import { TaskChoiceCardsVariant } from "@/components/landing/task-choice-cards-variant";
import { DailyTasksQuickActions } from "@/components/landing/daily-tasks-quick-actions";

export function ConceptDTaskEfficiency2() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-950/50 dark:via-gray-950 dark:to-slate-950/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* User Identity Section - Community Impact */}
        <div className="mb-6">
          <IdentityHeaderVariant variant="community" />
        </div>

        {/* High Impact Card Only */}
        <div className="mb-6">
          <TaskChoiceCardsVariant variant="efficiency2" />
        </div>

        {/* Quick Actions - Daily Tasks Section */}
        <div className="mb-6">
          <DailyTasksQuickActions />
        </div>
      </div>
    </div>
  );
}