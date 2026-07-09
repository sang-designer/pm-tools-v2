"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GlobalNav } from "@/components/global-nav";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

import { ConceptETaskCommunity } from "./landing1/concepts/concept-e-task-community";
import { ConceptENewUser } from "./landing1/concepts/concept-e-new-user";
import { ConceptEPowerUser } from "./landing1/concepts/concept-e-power-user";

function HomeContent() {
  const [userVariant, setUserVariant] = useState<"existing" | "power-user" | "new-user">("existing");
  const [headerVisible, setHeaderVisible] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav
        activeTab="Home"
      />

      {/* Collapse trigger when header is hidden */}
      {!headerVisible && (
        <div className="relative">
          <button
            onClick={() => setHeaderVisible(true)}
            className="absolute left-4 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background shadow-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Show page options"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Task+Community Header with User Variant Toggle */}
      {headerVisible && (
        <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 relative">
          <button
            onClick={() => setHeaderVisible(false)}
            className="absolute left-4 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background shadow-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Hide header"
          >
            <ChevronDown className="h-3.5 w-3.5 rotate-180" />
          </button>
          <div className="mx-auto max-w-7xl px-4 py-4 pl-14">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Task + Community</h1>
                <p className="text-sm text-muted-foreground">Efficient tasks with community engagement</p>
              </div>
            </div>

            {/* User Variant Toggle */}
            <div className="flex items-center justify-between">
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
                onClick={() => setUserVariant("power-user")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                  userVariant === "power-user"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Power User
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
              <Badge variant="outline" className="text-xs">Landing Page</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {userVariant === "new-user" ? <ConceptENewUser /> : userVariant === "power-user" ? <ConceptEPowerUser /> : <ConceptETaskCommunity />}
      </main>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}