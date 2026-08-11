"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserStats } from "@/hooks/use-user-stats";

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

export function IdentityHeader() {
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
        <div className="flex gap-8 text-right">
          <div className="space-y-1">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-6 w-8 bg-muted rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-6 w-8 bg-muted rounded" />
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

  // Get user initials for fallback
  const initials = userStats.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center justify-between p-6 bg-card border rounded-lg">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userStats.avatar} alt={userStats.name} />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-400 to-purple-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {userStats.name}
                    </h2>
                    <PlacemakerIcon className="h-4 w-4 text-gray-600" />
                  </div>
          <p className="text-sm font-medium text-gray-600">
            {userStats.rank}
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            You&apos;re currently helping us fix places near {locationStats.homeZone}
          </p>
        </div>
      </div>

      <div className="flex gap-12 text-right">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Proposed</p>
          <p className="text-2xl font-bold text-foreground">
            {userStats.proposedCount.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-foreground">
            {userStats.approvedCount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}