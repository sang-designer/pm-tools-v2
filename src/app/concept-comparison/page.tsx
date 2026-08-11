"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { ArrowRight, Gamepad2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ConceptComparisonPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav activeTab="Concept Showcase" />
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            🚀 Placemaker Tools Landing Page Concepts
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compare different UX approaches for bifurcated task entry points based on &quot;velocity&quot; (High Impact vs. Quick Daily)
          </p>
        </div>

        {/* Concept Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Concept A Card */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Concept A: Binary Choice</CardTitle>
              <Badge variant="secondary" className="w-fit mx-auto">
                Efficiency First
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-3"><strong>The Vibe:</strong> Minimalist and high-contrast. Forces immediate decision to prevent &quot;scroll paralysis.&quot;</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Features:</h4>
                  <ul className="space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-blue-600" />
                      <span>Split-screen vertical cards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-blue-600" />
                      <span>High-contrast design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-blue-600" />
                      <span>Sticky bottom drawer for location stats</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <Link href="/concept-a" className="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm group-hover:shadow-md transition-shadow">
                  View Concept A
                  <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </CardContent>
          </Card>

          {/* Concept B Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Concept B: Progress Hub</CardTitle>
              <Badge className="w-fit mx-auto">
                Gamified ⭐
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="mb-3"><strong>The Vibe:</strong> Motivational and data-rich. User stats take center stage with gamification elements.</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Features:</h4>
                  <ul className="space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-green-600" />
                      <span>Center-stage user progress bar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-green-600" />
                      <span>Horizontal cards with badges & streaks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-green-600" />
                      <span>Expanded location heatmap</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <Link href="/concept-b" className="inline-flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm group-hover:shadow-md transition-shadow">
                  View Concept B
                  <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold">Concept A</th>
                    <th className="text-center py-3 px-4 font-semibold">Concept B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">User Identity</td>
                    <td className="text-center py-3 px-4">Standard header</td>
                    <td className="text-center py-3 px-4">⭐ Center stage with progress</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Task Cards Layout</td>
                    <td className="text-center py-3 px-4">Vertical split-screen</td>
                    <td className="text-center py-3 px-4">Horizontal stacked</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Gamification</td>
                    <td className="text-center py-3 px-4">Minimal</td>
                    <td className="text-center py-3 px-4">⭐ Badges, streaks, progress</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Location Intelligence</td>
                    <td className="text-center py-3 px-4">Bottom summary</td>
                    <td className="text-center py-3 px-4">⭐ Expanded with heatmap</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Decision Speed</td>
                    <td className="text-center py-3 px-4">⭐ Very fast</td>
                    <td className="text-center py-3 px-4">Engaging exploration</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">User Motivation</td>
                    <td className="text-center py-3 px-4">Task-focused</td>
                    <td className="text-center py-3 px-4">⭐ Achievement-focused</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* PRD Context */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Product Requirements Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Objective</h4>
              <p className="text-muted-foreground">
                Increase user engagement and task completion by providing a bifurcated entry point based on task &quot;velocity&quot; (High Impact vs. Quick Daily).
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">User Profile Context</h4>
              <p className="text-muted-foreground">
                The header must establish immediate identity and achievement through gamification, including avatar, name, and performance metrics (# Proposed, # Approved for success rate calculation).
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Functional Requirements</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">FR-01:</span>
                  Dynamic identity header with &quot;Hello, [Name]! You&apos;ve improved [Approved #] locations to date.&quot;
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">FR-02:</span>
                  Task routing - High Impact → /placemaker-classic-review, Quick Daily → /my-world
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-foreground">FR-03:</span>
                  Location intelligence with total locations, pending vs. verified status
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}