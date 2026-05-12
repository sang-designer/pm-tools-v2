"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Loader2, Home, ChevronRight } from "lucide-react";

function MapLoadingFallback() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
}

const QuestView = dynamic(
  () => import("@/components/quest/quest-view").then((m) => m.QuestView),
  { ssr: false, loading: MapLoadingFallback }
);

function PlacesDailyTasksContent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav
        activeTab="Places"
      />

      <div className="w-full px-4 pt-6 sm:px-8 lg:px-12 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 mb-4">
          <a 
            href="/" 
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </a>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Daily Tasks</span>
        </div>
      </div>

      <main className="flex-1">
        <Suspense fallback={<MapLoadingFallback />}>
          <QuestView />
        </Suspense>
      </main>
    </div>
  );
}

export default function PlacesDailyTasks() {
  return <PlacesDailyTasksContent />;
}