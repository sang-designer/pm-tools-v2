"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GamepadIcon, Zap, Users, Activity, EyeOff, Eye, Layers } from "lucide-react";

// Import concept components (will be created next)
import { ConceptAGamified } from "./concepts/concept-a-gamified";
import { ConceptBEfficiency } from "./concepts/concept-b-efficiency"; 
import { ConceptCCommunity } from "./concepts/concept-c-community";
import { ConceptDTaskEfficiency2 } from "./concepts/concept-d-task-efficiency-2";
import { ConceptETaskCommunity } from "./concepts/concept-e-task-community";

export default function Landing1Page() {
  const [selectedConcept, setSelectedConcept] = useState("a");
  const [headerVisible, setHeaderVisible] = useState(true);

  const concepts = [
    {
      id: "a",
      title: "Gamified Stats",
      description: "Achievement-focused with progress tracking",
      icon: GamepadIcon,
      color: "from-purple-500 to-blue-600",
      component: ConceptAGamified,
    },
    {
      id: "b", 
      title: "Task Efficiency",
      description: "Streamlined for maximum productivity",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      component: ConceptBEfficiency,
    },
    {
      id: "d", 
      title: "Task Efficiency 2",
      description: "Daily task focus with completion workflow",
      icon: Activity,
      color: "from-slate-500 to-gray-600",
      component: ConceptDTaskEfficiency2,
    },
    {
      id: "c",
      title: "Community Impact", 
      description: "Collaborative focus on local progress",
      icon: Users,
      color: "from-green-500 to-emerald-600",
      component: ConceptCCommunity,
    },
    {
      id: "e",
      title: "Task+Community",
      description: "Efficient tasks with community engagement",
      icon: Layers,
      color: "from-teal-500 to-cyan-600",
      component: ConceptETaskCommunity,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Concept Selector Header */}
      <div className={`border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 z-50 transition-all duration-300 ${
        headerVisible ? 'sticky top-0 translate-y-0' : 'fixed top-0 left-0 right-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Landing Page Concepts</h1>
              <p className="text-sm text-muted-foreground">Five different approaches to user engagement</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Design Preview</Badge>
            </div>
          </div>

          {/* Concept Tabs */}
          <Tabs value={selectedConcept} onValueChange={setSelectedConcept} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto">
              {concepts.map((concept) => {
                const Icon = concept.icon;
                return (
                  <TabsTrigger
                    key={concept.id}
                    value={concept.id}
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 h-auto data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-primary/5"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs sm:text-sm font-medium">{concept.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Concept Description */}
          <div className="mt-3">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className={`${
                  selectedConcept === concept.id ? "block" : "hidden"
                }`}
              >
                <p className="text-sm text-muted-foreground">{concept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header Toggle Button - Fixed positioned when header is hidden */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setHeaderVisible(!headerVisible)}
        className={`fixed top-4 right-4 z-[60] bg-background/80 backdrop-blur border shadow-sm transition-all duration-300 ${
          headerVisible ? 'opacity-50 hover:opacity-100' : 'opacity-100'
        }`}
        aria-label={headerVisible ? "Hide header" : "Show header"}
      >
        {headerVisible ? (
          <>
            <EyeOff className="h-4 w-4 mr-1" />
            <span className="text-xs">Hide</span>
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-xs">Show</span>
          </>
        )}
      </Button>

      {/* Concept Content */}
      <div className="relative">
        <Tabs value={selectedConcept} className="w-full">
          {concepts.map((concept) => {
            const Component = concept.component;
            return (
              <TabsContent key={concept.id} value={concept.id} className="mt-0">
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}