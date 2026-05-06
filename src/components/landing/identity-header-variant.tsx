"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStats } from "@/hooks/use-user-stats";
import { Trophy, Flame, Star, MapPin, ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocationContext } from "@/lib/location-context";

// Custom Progress component with purple gradient for gamified variant
function PurpleProgress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 transition-all duration-500 ease-out shadow-sm"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface IdentityHeaderProps {
  variant?: "default" | "gamified" | "minimal" | "community" | "efficiency2";
  className?: string;
}

const RECENT_CITIES = [
  { id: "sf-bay", name: "San Francisco Bay Area", tasksCompleted: 156, lastVisited: "Today" },
  { id: "oakland", name: "Oakland", tasksCompleted: 42, lastVisited: "2 days ago" },
  { id: "san-jose", name: "San Jose", tasksCompleted: 28, lastVisited: "Last week" },
];

const ALL_LOCATIONS = [
  { id: "sf-bay", name: "San Francisco Bay Area" },
  { id: "oakland", name: "Oakland" },
  { id: "san-jose", name: "San Jose" },
  { id: "los-angeles", name: "Los Angeles" },
  { id: "boston", name: "Boston" },
  { id: "new-york", name: "New York Metro" },
  { id: "austin", name: "Austin Metro" },
];

function LocationSelector({ currentLocation }: { currentLocation: string }) {
  const locationContext = useLocationContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(currentLocation);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLocation = locationContext ? locationContext.selectedZone : selected;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSearching = search.trim().length > 0;

  const filteredRecent = RECENT_CITIES.filter(city =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  const searchResults = ALL_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(search.toLowerCase()) &&
    !RECENT_CITIES.some(rc => rc.id === loc.id)
  );

  const handleSelect = (cityName: string) => {
    setSelected(cityName);
    if (locationContext) {
      locationContext.switchZone(cityName);
    }
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-sm text-foreground font-medium hover:text-primary transition-colors rounded-md px-2 py-1 -mx-2 -my-1 hover:bg-muted/60"
      >
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span>{activeLocation}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-md">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>

          <div className="p-1.5 max-h-72 overflow-y-auto">
            {/* Recently Visited */}
            {filteredRecent.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Recently Visited
                </div>
                {filteredRecent.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city.name)}
                    className={cn(
                      "flex items-center w-full gap-3 px-2 py-2 rounded-md text-left transition-colors",
                      activeLocation === city.name ? "bg-primary/10" : "hover:bg-muted/60"
                    )}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{city.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {city.tasksCompleted} tasks completed · {city.lastVisited}
                      </div>
                    </div>
                    {activeLocation === city.name && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </>
            )}

            {/* Search results from all locations */}
            {isSearching && searchResults.length > 0 && (
              <>
                <div className="px-2 py-1.5 mt-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide border-t border-border pt-2">
                  All Locations
                </div>
                {searchResults.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect(loc.name)}
                    className={cn(
                      "flex items-center w-full gap-3 px-2 py-2 rounded-md text-left transition-colors",
                      activeLocation === loc.name ? "bg-primary/10" : "hover:bg-muted/60"
                    )}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{loc.name}</div>
                    </div>
                    {activeLocation === loc.name && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </>
            )}

            {filteredRecent.length === 0 && searchResults.length === 0 && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PlacemakerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 81 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M79.33 104.137c-1.1.87-2.62 1-3.85.33l-15.21-8.29-16.33 8.33a3.49 3.49 0 0 1-3.18 0l-16.34-8.33-15.21 8.29c-1.23.67-2.75.54-3.85-.33s-1.57-2.31-1.2-3.67l7.84-28.68c.26-.96.92-1.76 1.8-2.2l12.62-6.34c-.38-.43-.75-.85-1.14-1.29-6.1-6.79-13.32-14.74-13.32-28.44 0-14.49 10.63-30.19 30.36-30.27h.03c9.87.04 17.46 3.98 22.59 9.73 5.13 5.75 7.79 13.29 7.8 20.54 0 13.7-7.23 21.65-13.33 28.44-.39.43-.76.86-1.14 1.29l12.62 6.34c.88.44 1.54 1.24 1.8 2.2l7.84 28.68c.37 1.36-.1 2.8-1.2 3.67Z" fill="currentColor" fillOpacity="0.15" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.036 99.588l16.83-9.17 4.05-26.06-13.04 6.55-7.84 28.68Zm34.811 0l17.98-9.17h.001l16.83 9.17-7.84-28.68-13.04-6.55h-.001l-13.93 6.55-13.93-6.55-4.05 26.06 17.98 9.17Z" fill="white" />
      <path d="M73.508 99.588l-16.83-9.17-4.05-26.06 13.04 6.55 7.84 28.68Z" fill="#CBB8F7" />
      <path d="M56.678 90.418l-17.98 9.17V70.908l13.93-6.55 4.05 26.06Z" fill="#3333FF" />
      <path d="M3.888 99.588l16.83-9.17 4.05-26.06-13.04 6.55-7.84 28.68Z" fill="#3333FF" />
      <path d="M20.718 90.418l17.98 9.17V70.908l-13.93-6.55-4.05 26.06Z" fill="#CBB8F7" />
      <path d="M38.844 2.942h-.018c-18.754.079-28.87 14.95-28.87 28.77 0 13.011 6.77 20.561 12.848 27.34l.093.103c4.746 5.293 9.332 10.445 11.639 18.148 1.281 4.278 7.34 4.278 8.622 0 2.307-7.704 6.893-12.855 11.639-18.148l.096-.107c6.076-6.778 12.844-14.327 12.844-27.334v-.001c-.001-13.82-10.119-28.691-28.893-28.77Z" fill="white" stroke="white" strokeWidth="4" />
      <path d="M63.236 31.928c0 20.05-18.011 24.576-24.14 43.496a.23.23 0 0 1-.45 0c-6.128-18.92-24.14-23.447-24.14-43.496 0-10.76 7.73-24.2 24.39-24.27 16.66.07 24.34 13.51 24.34 24.27Z" stroke="#3333FF" strokeWidth="5" />
      <circle cx="38.846" cy="31.015" r="10.928" fill="#3333FF" />
    </svg>
  );
}

export function IdentityHeaderVariant({ variant = "default", className }: IdentityHeaderProps) {
  const { userStats, locationStats, isLoading, error } = useUserStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-6 bg-card border rounded-lg animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-3 w-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !userStats || !locationStats) {
    return (
      <div className="flex items-center justify-center p-6 bg-card border rounded-lg text-muted-foreground">
        <p>Unable to load profile information</p>
      </div>
    );
  }

  const initials = userStats.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  // Variant-specific rendering
  switch (variant) {
    case "gamified":
      return (
        <Card className={cn("", className)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-2 ring-border">
                    <AvatarImage src={userStats.avatar} alt={userStats.name} />
                    <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Level badge */}
                  <Badge className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2">
                    {userStats.rank}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-foreground">{userStats.name}</h2>
                    <Trophy className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  {/* XP Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-3 w-3" />
                      <span>Level Progress</span>
                    </div>
                    <PurpleProgress value={userStats.rankProgress * 100} className="w-48 h-2" />
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="h-4 w-4 text-primary" />
                    <span className="font-medium">{userStats.streak} day streak</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userStats.totalPoints.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{userStats.approvedCount}</div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{userStats.achievements.length}</div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case "minimal":
      return (
        <div className={cn("flex items-center justify-between p-4 bg-card/50 border rounded-lg backdrop-blur", className)}>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userStats.avatar} alt={userStats.name} />
              <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground">{userStats.name}</h2>
                <Badge variant="secondary" className="text-xs">{userStats.rank}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {locationStats.homeZone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-semibold">{userStats.weeklyProgress}/{userStats.weeklyGoal}</div>
              <div className="text-muted-foreground">Weekly Goal</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{userStats.approvedCount}</div>
              <div className="text-muted-foreground">Approved</div>
            </div>
          </div>
        </div>
      );

    case "community":
      return (
        <Card className={cn("", className)}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userStats.avatar} alt={userStats.name} />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-slate-400 to-gray-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-foreground">{userStats.name}</h2>
                    <PlacemakerIcon className="h-4 w-4 text-slate-600" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-slate-200 text-slate-700">
                      {userStats.rank}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      Contributing since {new Date(userStats.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-slate-600">Helping improve</span> {locationStats.homeZone}
                  </p>
                </div>
              </div>

              <div className="flex gap-8 text-right">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Community Impact</p>
                  <p className="text-2xl font-bold text-slate-600">
                    {userStats.approvedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">verified places</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Local Rank</p>
                  <p className="text-2xl font-bold text-foreground">
                    #{locationStats.topContributors.findIndex(c => c.name === userStats.name) + 1 || '?'}
                  </p>
                  <p className="text-xs text-muted-foreground">in region</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case "efficiency2":
      // Canvas-style minimal design for Task Efficiency 2
      return (
        <div className={cn("space-y-6", className)}>
          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userStats.avatar} alt={userStats.name} />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-slate-400 to-gray-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{userStats.name}</h2>
                  <PlacemakerIcon className="h-5 w-5 text-slate-600" />
                </div>
                <p className="text-sm font-medium text-slate-600">{userStats.rank} • {userStats.streak} day streak</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{userStats.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-foreground">{userStats.weeklyProgress}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-foreground">{locationStats.totalLocations}</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-slate-600">{Math.round(locationStats.regionHealth * 100)}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>
        </div>
      );

    default:
      // Default variant (existing implementation)
      return (
        <div className={cn("flex items-center justify-between p-6 bg-card border rounded-lg", className)}>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userStats.avatar} alt={userStats.name} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">{userStats.name}</h2>
                <PlacemakerIcon className="h-4 w-4 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">{userStats.rank}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>You&apos;re currently helping us fix places near</span>
                <LocationSelector currentLocation={locationStats.homeZone} />
              </div>
            </div>
          </div>

          <div className="flex gap-12 text-right">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Proposed</p>
              <p className="text-2xl font-bold text-foreground">{userStats.proposedCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-foreground">{userStats.approvedCount}</p>
            </div>
          </div>
        </div>
      );
  }
}