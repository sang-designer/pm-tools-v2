"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, MapPin, ArrowRight } from "lucide-react";
import { useLocationContext } from "@/lib/location-context";

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
  { slug: "review-flagged-tips", name: "Review flagged tips", count: 47 },
  { slug: "review-flagged-photos", name: "Review flagged photos", count: 23 },
  { slug: "review-location-suggestions", name: "Review location suggestions", count: 13202 },
  { slug: "review-venue-location", name: "Review a venue's current location", count: 0 },
  { slug: "review-translated-names", name: "Review global translated name suggestions", count: 93358 },
  { slug: "review-chain-membership", name: "Review chain membership suggestions", count: 2016 },
  { slug: "review-subvenue-suggestions", name: "Review subvenue suggestions", count: 646 },
  { slug: "review-address-suggestions", name: "Review address suggestions", count: 1847 },
  { slug: "review-flagged-users", name: "Review flagged users", count: 312 },
];

const PLACE_TASKS_BY_LOCATION: Record<string, Array<{ id: string; name: string; address: string; category: string; tasks: number }>> = {
  "San Francisco Bay Area": [
    { id: "v1", name: "Koffee", address: "1 La Vuelta, Orinda, CA", category: "Coffee Shop", tasks: 3 },
    { id: "v4", name: "Tartine Bakery", address: "600 Guerrero St, San Francisco, CA", category: "Bakery", tasks: 5 },
    { id: "v7", name: "Foreign Cinema", address: "2534 Mission St, San Francisco, CA", category: "Restaurant", tasks: 2 },
    { id: "v3", name: "Baja Cali Taqueria & Grill", address: "1 La Vuelta, Orinda, CA", category: "Mexican Restaurant", tasks: 4 },
    { id: "v5", name: "Blue Bottle Coffee", address: "66 Mint St, San Francisco, CA", category: "Coffee Shop", tasks: 2 },
    { id: "v9", name: "Delfina", address: "3621 18th St, San Francisco, CA", category: "Italian Restaurant", tasks: 6 },
  ],
  "Oakland": [
    { id: "oak-1", name: "Daylight Coffee", address: "1935 Broadway, Oakland, CA", category: "Coffee Shop", tasks: 4 },
    { id: "oak-2", name: "Commis", address: "3859 Piedmont Ave, Oakland, CA", category: "Restaurant", tasks: 2 },
    { id: "oak-3", name: "Curbside Creamery", address: "482 49th St, Oakland, CA", category: "Ice Cream Shop", tasks: 3 },
    { id: "oak-4", name: "Brown Sugar Kitchen", address: "2534 Mandela Pkwy, Oakland, CA", category: "Restaurant", tasks: 5 },
  ],
  "San Jose": [
    { id: "sj-1", name: "Chromatic Coffee", address: "221 E Santa Clara St, San Jose, CA", category: "Coffee Shop", tasks: 2 },
    { id: "sj-2", name: "Adega", address: "1614 Alum Rock Ave, San Jose, CA", category: "Portuguese Restaurant", tasks: 3 },
    { id: "sj-3", name: "San Pedro Square Market", address: "87 N San Pedro St, San Jose, CA", category: "Food Hall", tasks: 7 },
  ],
  "Los Angeles": [
    { id: "la-1", name: "Intelligentsia Coffee", address: "3922 Sunset Blvd, Los Angeles, CA", category: "Coffee Shop", tasks: 3 },
    { id: "la-2", name: "Guelaguetza", address: "3014 W Olympic Blvd, Los Angeles, CA", category: "Oaxacan Restaurant", tasks: 4 },
    { id: "la-3", name: "Grand Central Market", address: "317 S Broadway, Los Angeles, CA", category: "Food Hall", tasks: 8 },
    { id: "la-4", name: "Bestia", address: "2121 E 7th Pl, Los Angeles, CA", category: "Italian Restaurant", tasks: 2 },
    { id: "la-5", name: "Howlin' Ray's", address: "727 N Broadway, Los Angeles, CA", category: "Fried Chicken", tasks: 5 },
  ],
  "Boston": [
    { id: "bos-1", name: "George Howell Coffee", address: "505 Washington St, Boston, MA", category: "Coffee Shop", tasks: 2 },
    { id: "bos-2", name: "Neptune Oyster", address: "63 Salem St, Boston, MA", category: "Seafood Restaurant", tasks: 4 },
    { id: "bos-3", name: "Tatte Bakery & Cafe", address: "70 Charles St, Boston, MA", category: "Bakery & Cafe", tasks: 3 },
    { id: "bos-4", name: "Row 34", address: "383 Congress St, Boston, MA", category: "Seafood Restaurant", tasks: 2 },
  ],
};

function seededCount(base: number, seed: number): number {
  return Math.max(0, Math.round(base * (0.4 + ((seed * 9301 + 49297) % 233280) / 233280 * 1.2)));
}

function getQueuesForLocation(location: string): ReviewQueue[] {
  const seed = location.length * 13;
  return REVIEW_QUEUES.map((q, i) => ({
    ...q,
    count: seededCount(q.count, seed + i),
  }));
}

export function PowerUserTasksCard() {
  const router = useRouter();
  const [showPlaceTasks, setShowPlaceTasks] = useState(false);
  const locationContext = useLocationContext();
  const selectedZone = locationContext?.selectedZone || "San Francisco Bay Area";

  const queues = getQueuesForLocation(selectedZone);
  const activeQueues = queues.filter((q) => q.count > 0);
  const firstQueue = activeQueues[0];
  const placeTasks = PLACE_TASKS_BY_LOCATION[selectedZone] || [];

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
          <Tabs
            value={showPlaceTasks ? "places" : "queues"}
            onValueChange={(v) => setShowPlaceTasks(v === "places")}
          >
            <TabsList className="h-8">
              <TabsTrigger value="queues" className="text-xs px-3 h-6">
                Queues
              </TabsTrigger>
              <TabsTrigger value="places" className="text-xs px-3 h-6">
                Places
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
              {placeTasks.length > 0 ? placeTasks.map((place) => (
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
              )) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No place tasks available for this location.</p>
              )}
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
              {queues.map((queue) => (
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
