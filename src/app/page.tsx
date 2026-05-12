"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GlobalNav } from "@/components/global-nav";
import { cn } from "@/lib/utils";

import { ConceptETaskCommunity } from "./landing1/concepts/concept-e-task-community";
import { ConceptENewUser } from "./landing1/concepts/concept-e-new-user";

function HomeContent() {
  const [userVariant, setUserVariant] = useState<"existing" | "new-user">("existing");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav
        activeTab="Home"
      />
      
      {/* Task+Community Header with User Variant Toggle */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Task + Community</h1>
              <p className="text-sm text-muted-foreground">Efficient tasks with community engagement</p>
            </div>
            <Badge variant="outline" className="text-xs">Landing Page</Badge>
          </div>

          {/* User Variant Toggle */}
          <div className="flex gap-1 bg-muted/50 rounded-full p-0.5 w-fit">
            <button
              onClick={() => setUserVariant("existing")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                userVariant === "existing"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Existing User
            </button>
            <button
              onClick={() => setUserVariant("new-user")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                userVariant === "new-user"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              New User
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {userVariant === "new-user" ? <ConceptENewUser /> : <ConceptETaskCommunity />}
      </main>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}