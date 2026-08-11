"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_USER_PROFILES, MOCK_LOCATION_PROFILES } from "@/lib/mock-data";
import { Trophy, MapPin, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function MockDataDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Mock Data Demo</h1>
          <p className="text-muted-foreground mb-4">
            Explore different user profiles and location scenarios for the Placemaker Dashboard
          </p>
          <Link href="/dashboard">
            <Button>View Live Dashboard</Button>
          </Link>
        </div>

        {/* User Profiles */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_USER_PROFILES.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{user.rank}</Badge>
                        {user.streak > 0 && (
                          <Badge variant="default">🔥 {user.streak} days</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">{user.approvedCount.toLocaleString()}</div>
                      <div className="text-muted-foreground">Approved</div>
                    </div>
                    <div>
                      <div className="font-medium">{user.proposedCount.toLocaleString()}</div>
                      <div className="text-muted-foreground">Proposed</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">{user.totalPoints.toLocaleString()}</div>
                      <div className="text-muted-foreground">Points</div>
                    </div>
                    <div>
                      <div className="font-medium">{Math.round((user.approvedCount / user.proposedCount) * 100)}%</div>
                      <div className="text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Achievements ({user.achievements.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {user.achievements.slice(0, 3).map((achievement) => (
                        <Badge key={achievement} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                      {user.achievements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.achievements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Location Profiles */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Location Scenarios
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MOCK_LOCATION_PROFILES.map((location) => {
              const healthScore = Math.round(location.regionHealth * 100);
              const completionRate = Math.round((location.verifiedCount / location.totalLocations) * 100);
              
              return (
                <Card key={location.homeZone}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{location.homeZone}</span>
                      <Badge 
                        variant={healthScore >= 80 ? "default" : healthScore >= 60 ? "secondary" : "destructive"}
                      >
                        {healthScore}% Health
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">{location.totalLocations.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-600">{location.verifiedCount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Verified</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-orange-600">{location.pendingCount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        This Week
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-semibold text-green-600">{location.weeklyStats.locationsAdded}</div>
                          <div className="text-xs text-muted-foreground">Added</div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-600">{location.weeklyStats.verificationsCompleted}</div>
                          <div className="text-xs text-muted-foreground">Verified</div>
                        </div>
                        <div>
                          <div className="font-semibold text-purple-600">{location.weeklyStats.issuesResolved}</div>
                          <div className="text-xs text-muted-foreground">Resolved</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Top Contributors</div>
                      {location.topContributors.slice(0, 3).map((contributor) => (
                        <div key={contributor.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-3 w-3 text-muted-foreground" />
                            <span>{contributor.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {contributor.contributions}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {location.regionChallenges.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Active Challenges</div>
                        {location.regionChallenges.slice(0, 2).map((challenge, index) => (
                          <div key={index} className="text-xs p-2 bg-muted/50 rounded mb-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{challenge.title}</span>
                              <Badge 
                                variant={challenge.priority === 'high' ? 'destructive' : challenge.priority === 'medium' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {challenge.priority}
                              </Badge>
                            </div>
                            <div className="text-muted-foreground">{challenge.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}