"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ClipboardCheck, MapPin, ArrowRight } from "lucide-react";

export interface ReviewQueue {
  slug: string;
  name: string;
  count: number;
}

export const REVIEW_QUEUES: ReviewQueue[] = [
  { slug: "confirm-business-details", name: "Confirm suggested business details", count: 872 },
  { slug: "review-merge-suggestions", name: "Review merge suggestions", count: 175 },
  { slug: "review-category-suggestions", name: "Review category suggestions", count: 3304 },
  { slug: "suggest-categories", name: "Suggest categories", count: 51 },
  { slug: "review-removal-suggestions", name: "Review removal suggestions", count: 863 },
  { slug: "mark-places-private", name: "Mark places as private", count: 24 },
  { slug: "review-flagged-tips", name: "Review flagged tips", count: 0 },
  { slug: "review-flagged-photos", name: "Review flagged photos", count: 23 },
  { slug: "review-location-suggestions", name: "Review location suggestions", count: 13202 },
  { slug: "review-venue-location", name: "Review a venue's current location", count: 0 },
  { slug: "review-translated-names", name: "Review global translated name suggestions", count: 93358 },
  { slug: "review-chain-membership", name: "Review chain membership suggestions", count: 2016 },
  { slug: "review-subvenue-suggestions", name: "Review subvenue suggestions", count: 646 },
  { slug: "review-address-suggestions", name: "Review address suggestions", count: 1847 },
];

const PLACE_TASKS = [
  { id: "v1", name: "Koffee", address: "1 La Vuelta, Orinda, CA", category: "Coffee Shop", tasks: 3 },
  { id: "v4", name: "Tartine Bakery", address: "600 Guerrero St, San Francisco, CA", category: "Bakery", tasks: 5 },
  { id: "v7", name: "Foreign Cinema", address: "2534 Mission St, San Francisco, CA", category: "Restaurant", tasks: 2 },
  { id: "v3", name: "Baja Cali Taqueria & Grill", address: "1 La Vuelta, Orinda, CA", category: "Mexican Restaurant", tasks: 4 },
  { id: "v5", name: "Blue Bottle Coffee", address: "66 Mint St, San Francisco, CA", category: "Coffee Shop", tasks: 2 },
  { id: "v9", name: "Delfina", address: "3621 18th St, San Francisco, CA", category: "Italian Restaurant", tasks: 6 },
];

export function PowerUserTasksCard() {
  const router = useRouter();
  const [showPlaceTasks, setShowPlaceTasks] = useState(false);

  const activeQueues = REVIEW_QUEUES.filter((q) => q.count > 0);
  const firstQueue = activeQueues[0];

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-gray-900 flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showPlaceTasks ? (
              <MapPin className="h-5 w-5 text-primary" />
            ) : (
              <ClipboardCheck className="h-5 w-5 text-primary" />
            )}
            <CardTitle className="text-lg font-semibold">
              {showPlaceTasks ? "Place Specific Tasks" : "Review Queues"}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {showPlaceTasks ? "Places" : "Queues"}
            </span>
            <Switch
              checked={showPlaceTasks}
              onCheckedChange={setShowPlaceTasks}
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {showPlaceTasks
            ? "Tasks for specific places near you"
            : "Moderate community suggestions"}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4 flex-1 flex flex-col">
        {showPlaceTasks ? (
          <>
            <div className="space-y-0.5 max-h-[360px] overflow-y-auto">
              {PLACE_TASKS.map((place) => (
                <button
                  key={place.id}
                  className="flex items-center justify-between w-full rounded-md px-2 py-2.5 hover:bg-muted/40 transition-colors text-left group border-b border-transparent hover:border-foreground/10"
                  onClick={() => router.push(`/venue/${place.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors block truncate">
                      {place.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate block">
                      {place.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <Badge variant="outline" className="text-xs tabular-nums">
                      {place.tasks} tasks
                    </Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            <Button
              className="w-full mt-auto"
              onClick={() => router.push("/places")}
            >
              Start Place Tasks
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-0.5 max-h-[360px] overflow-y-auto">
              {REVIEW_QUEUES.map((queue) => (
                <button
                  key={queue.slug}
                  className="flex items-center justify-between w-full rounded-md px-2 py-2 hover:bg-muted/40 transition-colors text-left group border-b border-transparent hover:border-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => router.push(`/review-queue/${queue.slug}`)}
                  disabled={queue.count === 0}
                >
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {queue.name}
                  </span>
                  <Badge variant="outline" className="text-xs tabular-nums shrink-0 ml-2">
                    {queue.count.toLocaleString()}
                  </Badge>
                </button>
              ))}
            </div>

            <Button
              className="w-full mt-auto"
              onClick={() => firstQueue && router.push(`/review-queue/${firstQueue.slug}`)}
            >
              Start Reviewing
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
