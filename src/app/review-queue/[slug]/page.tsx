"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { GlobalNav } from "@/components/global-nav";
import { LocationSelector } from "@/components/landing/identity-header-variant";
import { LocationProvider, useLocationContext } from "@/lib/location-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPreview } from "@/components/venue/map-preview";
import { REVIEW_QUEUES } from "@/components/landing/power-user-tasks-card";
import { toast } from "sonner";
import {
  Check,
  X,
  ExternalLink,
  History,
  Search,
  AlertTriangle,
  User,
  MapPin,
  Clock,
  SkipForward,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestedAttribute {
  id: string;
  label: string;
  currentValue?: string;
  suggestedValue: string;
  confirmed: boolean | null;
}

interface MockTask {
  id: string;
  venueId: string;
  venueName: string;
  venueAddress: string;
  venueCategory: string;
  venueClaimed: boolean;
  lat: number;
  lng: number;
  uniqueVisitors: number;
  totalCheckIns: number;
  recentCheckIns: number;
  attributes: SuggestedAttribute[];
  warnings: string[];
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface LocationVenue {
  id: string;
  name: string;
  address: string;
  category: string;
  claimed: boolean;
  lat: number;
  lng: number;
}

const LOCATION_VENUES: Record<string, LocationVenue[]> = {
  "San Francisco Bay Area": [
    { id: "v1", name: "Koffee", address: "1 La Vuelta, Orinda, CA", category: "Coffee Shop", claimed: true, lat: 37.8784, lng: -122.1796 },
    { id: "v4", name: "Tartine Bakery", address: "600 Guerrero St, San Francisco, CA", category: "Bakery", claimed: true, lat: 37.7613, lng: -122.4243 },
    { id: "v5", name: "Blue Bottle Coffee", address: "66 Mint St, San Francisco, CA", category: "Coffee Shop", claimed: true, lat: 37.7824, lng: -122.4058 },
    { id: "v7", name: "Foreign Cinema", address: "2534 Mission St, San Francisco, CA", category: "Restaurant", claimed: true, lat: 37.77493, lng: -122.41942 },
    { id: "v9", name: "Delfina", address: "3621 18th St, San Francisco, CA", category: "Italian Restaurant", claimed: true, lat: 37.7618, lng: -122.4247 },
    { id: "v10", name: "Philz Coffee", address: "3101 24th St, San Francisco, CA", category: "Coffee Shop", claimed: true, lat: 37.7526, lng: -122.4184 },
    { id: "v11", name: "La Taqueria", address: "2889 Mission St, San Francisco, CA", category: "Taqueria", claimed: false, lat: 37.7508, lng: -122.4181 },
    { id: "v12", name: "Sightglass Coffee", address: "270 7th St, San Francisco, CA", category: "Coffee Shop", claimed: true, lat: 37.7772, lng: -122.4068 },
    { id: "v15", name: "Nopa", address: "560 Divisadero St, San Francisco, CA", category: "Restaurant", claimed: true, lat: 37.7745, lng: -122.4378 },
    { id: "v20", name: "Dandelion Chocolate", address: "740 Valencia St, San Francisco, CA", category: "Chocolate Shop", claimed: true, lat: 37.7609, lng: -122.4216 },
  ],
  "Oakland": [
    { id: "oak-1", name: "Daylight Coffee", address: "1935 Broadway, Oakland, CA", category: "Coffee Shop", claimed: true, lat: 37.8085, lng: -122.2711 },
    { id: "oak-2", name: "Commis", address: "3859 Piedmont Ave, Oakland, CA", category: "Restaurant", claimed: true, lat: 37.8256, lng: -122.2532 },
    { id: "oak-3", name: "Curbside Creamery", address: "482 49th St, Oakland, CA", category: "Ice Cream Shop", claimed: false, lat: 37.8358, lng: -122.2618 },
    { id: "oak-4", name: "Brown Sugar Kitchen", address: "2534 Mandela Pkwy, Oakland, CA", category: "Restaurant", claimed: true, lat: 37.8142, lng: -122.2917 },
    { id: "oak-5", name: "Mua Oakland", address: "2442 Webster St, Oakland, CA", category: "Bar & Restaurant", claimed: true, lat: 37.8131, lng: -122.2656 },
    { id: "oak-6", name: "Souley Vegan", address: "301 Broadway, Oakland, CA", category: "Vegan Restaurant", claimed: false, lat: 37.7969, lng: -122.2754 },
    { id: "oak-7", name: "Arizmendi Bakery", address: "3265 Lakeshore Ave, Oakland, CA", category: "Bakery", claimed: true, lat: 37.8112, lng: -122.2394 },
    { id: "oak-8", name: "Burma Superstar", address: "4721 Telegraph Ave, Oakland, CA", category: "Burmese Restaurant", claimed: true, lat: 37.8374, lng: -122.2609 },
    { id: "oak-9", name: "Rudy's Can't Fail Cafe", address: "4081 Hollis St, Emeryville, CA", category: "Diner", claimed: true, lat: 37.8369, lng: -122.2897 },
    { id: "oak-10", name: "Calavera", address: "2337 Broadway, Oakland, CA", category: "Mexican Restaurant", claimed: false, lat: 37.8126, lng: -122.2673 },
  ],
  "San Jose": [
    { id: "sj-1", name: "Chromatic Coffee", address: "221 E Santa Clara St, San Jose, CA", category: "Coffee Shop", claimed: true, lat: 37.3369, lng: -121.8884 },
    { id: "sj-2", name: "Adega", address: "1614 Alum Rock Ave, San Jose, CA", category: "Portuguese Restaurant", claimed: true, lat: 37.3650, lng: -121.8551 },
    { id: "sj-3", name: "San Pedro Square Market", address: "87 N San Pedro St, San Jose, CA", category: "Food Hall", claimed: true, lat: 37.3362, lng: -121.8945 },
    { id: "sj-4", name: "Mezcal", address: "25 W San Fernando St, San Jose, CA", category: "Mexican Restaurant", claimed: false, lat: 37.3356, lng: -121.8918 },
    { id: "sj-5", name: "Paper Plane", address: "72 S 1st St, San Jose, CA", category: "Cocktail Bar", claimed: true, lat: 37.3341, lng: -121.8901 },
    { id: "sj-6", name: "Forager Tasting Room", address: "420 S 1st St, San Jose, CA", category: "Brewery", claimed: true, lat: 37.3299, lng: -121.8881 },
    { id: "sj-7", name: "Vung Tau", address: "535 E Santa Clara St, San Jose, CA", category: "Vietnamese Restaurant", claimed: false, lat: 37.3390, lng: -121.8812 },
    { id: "sj-8", name: "Back A Yard Caribbean", address: "80 N Market St, San Jose, CA", category: "Caribbean Restaurant", claimed: true, lat: 37.3374, lng: -121.8910 },
    { id: "sj-9", name: "Kaleidoscope Ice Cream", address: "898 Lincoln Ave, San Jose, CA", category: "Ice Cream Shop", claimed: true, lat: 37.3127, lng: -121.8883 },
    { id: "sj-10", name: "Henry's Hi-Life", address: "301 W St John St, San Jose, CA", category: "BBQ Restaurant", claimed: true, lat: 37.3414, lng: -121.9012 },
  ],
  "Los Angeles": [
    { id: "la-1", name: "Intelligentsia Coffee", address: "3922 Sunset Blvd, Los Angeles, CA", category: "Coffee Shop", claimed: true, lat: 34.0907, lng: -118.2796 },
    { id: "la-2", name: "Guelaguetza", address: "3014 W Olympic Blvd, Los Angeles, CA", category: "Oaxacan Restaurant", claimed: true, lat: 34.0509, lng: -118.3066 },
    { id: "la-3", name: "Grand Central Market", address: "317 S Broadway, Los Angeles, CA", category: "Food Hall", claimed: true, lat: 34.0506, lng: -118.2492 },
    { id: "la-4", name: "Bestia", address: "2121 E 7th Pl, Los Angeles, CA", category: "Italian Restaurant", claimed: true, lat: 34.0333, lng: -118.2308 },
    { id: "la-5", name: "Howlin' Ray's", address: "727 N Broadway, Los Angeles, CA", category: "Fried Chicken", claimed: false, lat: 34.0614, lng: -118.2398 },
    { id: "la-6", name: "Langer's Delicatessen", address: "704 S Alvarado St, Los Angeles, CA", category: "Deli", claimed: true, lat: 34.0574, lng: -118.2778 },
    { id: "la-7", name: "Night + Market Song", address: "3322 Sunset Blvd, Los Angeles, CA", category: "Thai Restaurant", claimed: true, lat: 34.0863, lng: -118.2694 },
    { id: "la-8", name: "Verve Coffee", address: "833 S Spring St, Los Angeles, CA", category: "Coffee Shop", claimed: true, lat: 34.0427, lng: -118.2565 },
    { id: "la-9", name: "Leo's Tacos Truck", address: "1515 S La Brea Ave, Los Angeles, CA", category: "Taco Truck", claimed: false, lat: 34.0416, lng: -118.3442 },
    { id: "la-10", name: "Gjusta", address: "320 Sunset Ave, Venice, CA", category: "Bakery & Deli", claimed: true, lat: 33.9918, lng: -118.4656 },
  ],
  "Boston": [
    { id: "bos-1", name: "George Howell Coffee", address: "505 Washington St, Boston, MA", category: "Coffee Shop", claimed: true, lat: 42.3551, lng: -71.0607 },
    { id: "bos-2", name: "Neptune Oyster", address: "63 Salem St, Boston, MA", category: "Seafood Restaurant", claimed: true, lat: 42.3640, lng: -71.0551 },
    { id: "bos-3", name: "Tatte Bakery & Cafe", address: "70 Charles St, Boston, MA", category: "Bakery & Cafe", claimed: true, lat: 42.3581, lng: -71.0719 },
    { id: "bos-4", name: "Row 34", address: "383 Congress St, Boston, MA", category: "Seafood Restaurant", claimed: true, lat: 42.3501, lng: -71.0516 },
    { id: "bos-5", name: "Trillium Brewing", address: "369 Congress St, Boston, MA", category: "Brewery", claimed: false, lat: 42.3504, lng: -71.0519 },
    { id: "bos-6", name: "Mike's Pastry", address: "300 Hanover St, Boston, MA", category: "Bakery", claimed: true, lat: 42.3638, lng: -71.0535 },
    { id: "bos-7", name: "Eventide Oyster Co.", address: "1321 Boylston St, Boston, MA", category: "Seafood Restaurant", claimed: true, lat: 42.3452, lng: -71.1013 },
    { id: "bos-8", name: "Flour Bakery", address: "131 Clarendon St, Boston, MA", category: "Bakery", claimed: true, lat: 42.3487, lng: -71.0748 },
    { id: "bos-9", name: "Saltie Girl", address: "281 Dartmouth St, Boston, MA", category: "Seafood Bar", claimed: false, lat: 42.3497, lng: -71.0769 },
    { id: "bos-10", name: "Barcelona Wine Bar", address: "525 Tremont St, Boston, MA", category: "Wine Bar", claimed: true, lat: 42.3446, lng: -71.0692 },
  ],
};

function generateMockTasks(slug: string, location?: string): MockTask[] {
  const loc = location || "San Francisco Bay Area";
  const venues = LOCATION_VENUES[loc];
  if (!venues || venues.length === 0) return [];
  const locationSeed = loc.length * 7;

  return venues.map((venue, i) => {
    const seed = i * 1000 + slug.length + locationSeed;
    const visitors = Math.floor(seededRandom(seed) * 300) + 10;
    const checkIns = Math.floor(seededRandom(seed + 1) * 800) + 20;
    const recent = Math.floor(seededRandom(seed + 2) * 30);
    return {
      id: `${slug}-${loc}-${i}`,
      venueId: venue.id,
      venueName: venue.name,
      venueAddress: venue.address,
      venueCategory: venue.category,
      venueClaimed: venue.claimed,
      lat: venue.lat,
      lng: venue.lng,
      uniqueVisitors: visitors,
      totalCheckIns: checkIns,
      recentCheckIns: recent,
      attributes: getAttributesForQueue(slug, venue.name),
      warnings: getWarnings(checkIns),
    };
  });
}

function getAttributesForQueue(slug: string, venueName: string): SuggestedAttribute[] {
  const attributeSets: Record<string, SuggestedAttribute[]> = {
    "confirm-business-details": [
      { id: "accepts_creditcards", label: "Accepts Credit Cards", suggestedValue: "Yes", confirmed: null },
      { id: "outdoor_seating", label: "Outdoor Seating", suggestedValue: "Yes", confirmed: null },
      { id: "wifi", label: "Wi-Fi", suggestedValue: "Free", confirmed: null },
      { id: "parking", label: "Parking", suggestedValue: "Street", confirmed: null },
    ],
    "review-category-suggestions": [
      { id: "primary_category", label: "Primary Category", suggestedValue: "Coffee Shop", confirmed: null },
      { id: "secondary_category", label: "Secondary Category", suggestedValue: "Cafe", confirmed: null },
    ],
    "review-removal-suggestions": [
      { id: "is_closed", label: "Place is closed", suggestedValue: "Permanently Closed", confirmed: null },
    ],
    "review-location-suggestions": [
      { id: "new_lat", label: "Latitude", suggestedValue: "37.8801", confirmed: null },
      { id: "new_lng", label: "Longitude", suggestedValue: "-122.2636", confirmed: null },
    ],
    "review-merge-suggestions": [
      { id: "merge_target", label: "Merge with", suggestedValue: `${venueName} (duplicate)`, confirmed: null },
    ],
    "mark-places-private": [
      { id: "is_private", label: "This is a private residence", suggestedValue: "Yes", confirmed: null },
    ],
    "review-flagged-photos": [
      { id: "photo_appropriate", label: "Photo is appropriate", suggestedValue: "No — flagged as spam", confirmed: null },
    ],
    "review-translated-names": [
      { id: "translated_name", label: "Translated Name (ES)", suggestedValue: `${venueName} (translated)`, confirmed: null },
    ],
    "review-chain-membership": [
      { id: "chain_name", label: "Chain", suggestedValue: "Starbucks Corporation", confirmed: null },
      { id: "chain_confirmed", label: "Is part of this chain", suggestedValue: "Yes", confirmed: null },
    ],
    "review-subvenue-suggestions": [
      { id: "parent_venue", label: "Parent Venue", suggestedValue: "Main Street Mall", confirmed: null },
    ],
    "review-address-suggestions": [
      { id: "url", label: "Url", currentValue: `locations.example.com/ll/US/CA/${venueName.replace(/\s/g, "-")}`, suggestedValue: `https://www.example.com/pages/store-locator?query=${venueName.replace(/\s/g, "+")}`, confirmed: null },
      { id: "address", label: "Address", currentValue: "2712 Pinole Valley Rd, Pinole, CA", suggestedValue: "2712 Pinole Valley Rd", confirmed: null },
      { id: "name", label: "Name", currentValue: venueName, suggestedValue: `${venueName.split(" ").slice(0, 2).join(" ")}`, confirmed: null },
    ],
  };

  return attributeSets[slug] || [
    { id: "generic", label: "Suggestion", suggestedValue: "Pending review", confirmed: null },
  ];
}

function getWarnings(checkIns: number): string[] {
  const warnings: string[] = [];
  if (checkIns > 250) warnings.push("This venue has more than 250 check-ins. Please be EXTRA careful.");
  if (checkIns > 100) warnings.push("This venue has recent check-ins. Please be EXTRA careful.");
  return warnings;
}

export default function ReviewQueuePage() {
  return (
    <LocationProvider>
      <ReviewQueueContent />
    </LocationProvider>
  );
}

function ReviewQueueContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const locationContext = useLocationContext();
  const selectedLocation = locationContext?.selectedZone || "San Francisco Bay Area";

  const currentQueue = REVIEW_QUEUES.find((q) => q.slug === slug);

  const [tasks, setTasks] = useState<MockTask[]>(() => generateMockTasks(slug));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [attributes, setAttributes] = useState<SuggestedAttribute[]>(
    () => tasks[0]?.attributes.map((a) => ({ ...a })) || []
  );

  useEffect(() => {
    const newTasks = generateMockTasks(slug, selectedLocation);
    setTasks(newTasks);
    setCurrentIndex(0);
    setSessionCount(0);
    if (newTasks[0]) {
      setAttributes(newTasks[0].attributes.map((a) => ({ ...a })));
    }
  }, [selectedLocation, slug]);

  const task = tasks[currentIndex];

  const advance = useCallback(() => {
    setSessionCount((c) => c + 1);
    const nextIndex = currentIndex < tasks.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    setAttributes(tasks[nextIndex].attributes.map((a) => ({ ...a })));
  }, [currentIndex, tasks]);

  const handleDone = () => {
    toast.success("Confirmed", { description: task.venueName });
    advance();
  };

  const handleSkip = () => {
    toast("Skipped", { description: task.venueName });
    advance();
  };

  const handleMerge = () => {
    toast.success("Merged", { description: task.venueName });
    advance();
  };

  const handleDontMerge = () => {
    toast("Not merged", { description: task.venueName });
    advance();
  };

  const confirmAttribute = (id: string, value: boolean) => {
    setAttributes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, confirmed: value } : a))
    );
  };

  if (!currentQueue) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <GlobalNav activeTab="Home" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Queue not found.</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <GlobalNav activeTab="Home" />
        <div className="flex flex-1 items-center justify-center px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-10 pb-8 px-8 space-y-5">
              <div className="flex justify-center">
                <div className="rounded-full border border-border p-3">
                  <Info className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Your review queue is currently empty
                </h2>
                <p className="text-sm text-muted-foreground">
                  Click{" "}
                  <Link href="/" className="text-primary hover:underline font-medium">
                    here
                  </Link>{" "}
                  to go back to the homepage, or change your search parameters.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <LocationSelector currentLocation={selectedLocation} />
              </div>
              <Link href="/">
                <Button variant="outline" className="mt-2">
                  Back to Homepage
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      {/* Header with queue selector */}
      <div className="border-b bg-primary/5">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Change queues:</span>
              <Select
                value={slug}
                onValueChange={(value) => router.push(`/review-queue/${value}`)}
              >
                <SelectTrigger className="w-[320px] bg-background">
                  <SelectValue>{currentQueue.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {REVIEW_QUEUES.map((q) => (
                    <SelectItem
                      key={q.slug}
                      value={q.slug}
                      className={cn("cursor-pointer hover:bg-accent", q.count === 0 && "opacity-40 cursor-not-allowed")}
                      disabled={q.count === 0}
                    >
                      {q.name} ({q.count.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {slug === "review-merge-suggestions" ? (
            /* Merge suggestions layout */
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3 space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <h3 className="text-sm font-medium text-foreground">
                    Are these places the same?
                  </h3>
                </div>

                {/* Venue A */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-foreground truncate">
                            <Link href={`/venue/${task.venueId}`} className="hover:text-primary hover:underline transition-colors">
                              {task.venueName}
                            </Link>
                          </h2>
                          {task.venueClaimed && (
                            <Badge variant="secondary" className="text-[10px] shrink-0">Claimed</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {task.venueAddress}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{task.venueCategory}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <History className="h-3 w-3" /> Edit history
                          </button>
                          <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <Search className="h-3 w-3" /> Search the web
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-3 text-center">
                      <div>
                        <p className="text-lg font-semibold text-foreground tabular-nums">{task.uniqueVisitors}</p>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Unique Visitors</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground tabular-nums">{task.totalCheckIns}</p>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Check-ins</p>
                      </div>
                      <div>
                        <p className={cn("text-lg font-semibold tabular-nums", task.recentCheckIns === 0 ? "text-destructive" : "text-foreground")}>
                          {task.recentCheckIns}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Last 60 Days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Venue B (the potential duplicate) */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-foreground truncate">
                            <Link href={`/venue/${tasks[(currentIndex + 1) % tasks.length].venueId}`} className="hover:text-primary hover:underline transition-colors">
                              {tasks[(currentIndex + 1) % tasks.length].venueName}
                            </Link>
                          </h2>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {tasks[(currentIndex + 1) % tasks.length].venueAddress}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{tasks[(currentIndex + 1) % tasks.length].venueCategory}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <History className="h-3 w-3" /> Edit history
                          </button>
                          <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <Search className="h-3 w-3" /> Search the web
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-3 text-center">
                      <div>
                        <p className="text-lg font-semibold text-foreground tabular-nums">0</p>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Unique Visitors</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground tabular-nums">0</p>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Check-ins</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-destructive tabular-nums">0</p>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Last 60 Days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Context info */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <p className="text-sm text-foreground">
                        <span className="text-primary font-medium">Jimmy F.</span> thinks these places <strong>are duplicates</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <p className="text-sm text-muted-foreground font-mono text-xs">
                        3ac5b807a0c5293065eb9cb81b825031a8c8f1eb
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        This suggestion was marked by a robot. Be extra careful, please.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Merge action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button variant="outline" size="lg" onClick={handleDontMerge}>
                    Don&apos;t merge
                  </Button>
                  <Button variant="outline" size="lg">
                    Preview merge
                  </Button>
                  <Button variant="outline" size="lg">
                    Make Subvenue
                  </Button>
                  <Button size="lg" onClick={handleMerge}>
                    Merge
                  </Button>
                  <div className="flex-1" />
                  <Button variant="outline" size="lg" onClick={handleSkip}>
                    Skip <SkipForward className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {/* Keyboard hints */}
                <p className="text-center text-xs text-muted-foreground pt-1">
                  Keyboard: <kbd className="rounded border px-1 py-0.5 text-[10px]">M</kbd> merge
                  {" "}<kbd className="rounded border px-1 py-0.5 text-[10px]">S</kbd> skip
                </p>
              </div>

              {/* Right: map */}
              <div className="lg:col-span-2 space-y-3">
                <Card className="overflow-hidden sticky top-6">
                  <MapPreview
                    lat={task.lat}
                    lng={task.lng}
                    name={task.venueName}
                    className="h-64 w-full lg:h-[400px]"
                  />
                </Card>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">near</span>
                  <LocationSelector currentLocation={selectedLocation} />
                </div>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Left: task card */}
            <div className="lg:col-span-3 space-y-4">
              {/* Venue info card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-foreground truncate">
                          <Link href={`/venue/${task.venueId}`} className="hover:text-primary hover:underline transition-colors">
                            {task.venueName}
                          </Link>
                        </h2>
                        {task.venueClaimed && (
                          <Badge variant="secondary" className="text-[10px] shrink-0">Claimed</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {task.venueAddress}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{task.venueCategory}</p>

                      <div className="flex items-center gap-3 mt-3">
                        <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <History className="h-3 w-3" /> Edit history
                        </button>
                        <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <Search className="h-3 w-3" /> Search the web
                        </button>
                        <button className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" /> Open
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-3 text-center">
                    <div>
                      <p className="text-lg font-semibold text-foreground tabular-nums">{task.uniqueVisitors}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Unique Visitors</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground tabular-nums">{task.totalCheckIns}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Check-ins</p>
                    </div>
                    <div>
                      <p className={cn("text-lg font-semibold tabular-nums", task.recentCheckIns === 0 ? "text-destructive" : "text-foreground")}>
                        {task.recentCheckIns}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Last 60 Days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attributes to confirm */}
              <Card>
                <CardContent className="p-4 space-y-0 divide-y divide-border">
                  {attributes.map((attr) => (
                    <div key={attr.id} className="flex items-start justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-muted-foreground">{attr.label}</span>

                        {attr.currentValue ? (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs text-muted-foreground w-20 shrink-0">Current:</span>
                              <span className="text-sm font-semibold text-foreground break-all">{attr.currentValue}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs text-muted-foreground w-20 shrink-0">Suggested:</span>
                              <span className="text-sm font-semibold text-primary break-all">{attr.suggestedValue}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <span className="text-sm font-semibold text-foreground">Suggested: {attr.suggestedValue}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-2">
                          <button className="text-xs text-primary hover:underline">Suggest</button>
                          <span className="text-xs text-muted-foreground">·</span>
                          <button className="text-xs text-primary hover:underline">Not applicable</button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3 mt-1">
                        <button
                          onClick={() => confirmAttribute(attr.id, true)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md border transition-colors",
                            attr.confirmed === true
                              ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"
                              : "border-border text-muted-foreground hover:border-green-300 hover:text-green-600"
                          )}
                          aria-label="Confirm"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => confirmAttribute(attr.id, false)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md border transition-colors",
                            attr.confirmed === false
                              ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                              : "border-border text-muted-foreground hover:border-red-300 hover:text-red-600"
                          )}
                          aria-label="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Warnings */}
              {task.warnings.length > 0 && (
                <div className="space-y-2">
                  {task.warnings.map((warning, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-500/30 dark:bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="text-sm text-amber-800 dark:text-amber-200">{warning}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={handleDone}
                >
                  Done
                </Button>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSkip}
                >
                  Skip <SkipForward className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {/* Keyboard hints */}
              <p className="text-center text-xs text-muted-foreground">
                Keyboard: <kbd className="rounded border px-1 py-0.5 text-[10px]">D</kbd> done
                {" "}<kbd className="rounded border px-1 py-0.5 text-[10px]">S</kbd> skip
              </p>
            </div>

            {/* Right: map */}
            <div className="lg:col-span-2 space-y-3">
              <Card className="overflow-hidden sticky top-6">
                <MapPreview
                  lat={task.lat}
                  lng={task.lng}
                  name={task.venueName}
                  className="h-64 w-full lg:h-[400px]"
                />
              </Card>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">near</span>
                <LocationSelector currentLocation={selectedLocation} />
              </div>
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
