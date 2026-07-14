"use client";

import { useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Suggestion {
  id: string;
  name: string;
  submittedBy: number;
  venues: Array<{ name: string; id: string }>;
}

interface LocationGroup {
  id: string;
  name: string;
  type: string;
  geoid: string;
  language: string;
  currentSpelling: string;
  suggestions: Suggestion[];
}

const MOCK_SUGGESTIONS: LocationGroup[] = [
  {
    id: "lg-1",
    name: "Ban Rangsit",
    type: "TOWN",
    geoid: "72057594039541705",
    language: "th",
    currentSpelling: "บ้านรังสิต",
    suggestions: [
      { id: "s1", name: "ธัญบุรี", submittedBy: 1, venues: [{ name: "เจ๊เค็ง ก๋วยเตี๋ยวไก่ สวนมะลิ", id: "v-th1" }, { name: "Café Amazon", id: "v-th2" }, { name: "KFC", id: "v-th3" }, { name: "โต้ง ไอศครีม", id: "v-th4" }] },
      { id: "s2", name: "ธ", submittedBy: 1, venues: [{ name: "โต้ง ไอศครีม", id: "v-th4" }] },
      { id: "s3", name: "ธัญบุ", submittedBy: 1, venues: [{ name: "โต้ง ไอศครีม", id: "v-th4" }] },
    ],
  },
  {
    id: "lg-2",
    name: "Ban Rangsit",
    type: "TOWN",
    geoid: "72057594039541705",
    language: "en",
    currentSpelling: "Ban Rangsit",
    suggestions: [
      { id: "s4", name: "Thanyaburi", submittedBy: 1, venues: [{ name: "เจ๊เค็ง ก๋วยเตี๋ยวไก่ สวนมะลิ", id: "v-th1" }, { name: "Café Amazon", id: "v-th2" }, { name: "KFC", id: "v-th3" }, { name: "โต้ง ไอศครีม", id: "v-th4" }] },
    ],
  },
  {
    id: "lg-3",
    name: "Phra Khanong",
    type: "TOWN",
    geoid: "72057594039535478",
    language: "th",
    currentSpelling: "พระโขนง",
    suggestions: [
      { id: "s5", name: "พระโขนง", submittedBy: 1, venues: [{ name: "Marsi Hotel Bangkok", id: "v-th5" }, { name: "101 True Digital Park", id: "v-th6" }] },
    ],
  },
  {
    id: "lg-4",
    name: "Amphoe Mueang Rayong",
    type: "ADMIN2",
    geoid: "72057594039536564",
    language: "en",
    currentSpelling: "Amphoe Mueang Rayong",
    suggestions: [
      { id: "s6", name: "Mueang Rayong", submittedBy: 1, venues: [{ name: "Coffee Today", id: "v-th7" }] },
    ],
  },
  {
    id: "lg-5",
    name: "Khet Khlong San",
    type: "ADMIN2",
    geoid: "72057594039537814",
    language: "th",
    currentSpelling: "เขตคลองสาน",
    suggestions: [
      { id: "s7", name: "คลองส่าน", submittedBy: 1, venues: [{ name: "FamilyMart", id: "v-th8" }] },
    ],
  },
];

function SuggestionCard({ suggestion, onApprove, onDecline }: { suggestion: Suggestion; onApprove: () => void; onDecline: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">
          {suggestion.name} <span className="text-muted-foreground font-normal">by {suggestion.submittedBy} users.</span>
        </p>
        <div className="space-y-0.5 pl-4">
          {suggestion.venues.map((venue) => (
            <p key={venue.id} className="text-sm text-muted-foreground">
              erth at <Link href={`/venue/${venue.id}`} className="text-primary hover:underline">{venue.name}</Link>.
            </p>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button onClick={onApprove}>Approve</Button>
        <Button variant="outline" onClick={onDecline}>Decline</Button>
      </div>
    </div>
  );
}

export default function GeoSuggestionsPage() {
  const [groups, setGroups] = useState(MOCK_SUGGESTIONS);

  const totalSuggestions = groups.reduce((acc, g) => acc + g.suggestions.length, 0);
  const totalLocations = new Set(groups.map((g) => g.geoid)).size;
  const languages = new Set(groups.map((g) => g.language));
  const countries = ["JP (10)", "TH (8)", "KR (4)", "HK (2)", "MY (1)"];

  const handleApprove = (groupId: string, suggestionId: string) => {
    setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, suggestions: g.suggestions.filter((s) => s.id !== suggestionId) } : g));
  };

  const handleDecline = (groupId: string, suggestionId: string) => {
    setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, suggestions: g.suggestions.filter((s) => s.id !== suggestionId) } : g));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="size-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Geo Suggestions</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            This admin page shows you all the suggestions for names of locations (city/state/etc.) in different languages.
            The locations are ordered by number of suggestions we got for that location. In total, we have {totalSuggestions} suggestions,
            for {totalLocations} locations, in {languages.size} languages, from 9 users.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Countries with most suggestions are: {countries.join(", ")}
          </p>
        </div>

        <div className="space-y-8">
          {groups.filter((g) => g.suggestions.length > 0).map((group) => (
            <section key={group.id}>
              <div className="mb-3">
                <h2 className="text-lg font-bold text-foreground">
                  {group.name} in Pathum Thani TH ({group.type}{" "}
                  <a href="#" className="text-primary hover:underline">
                    geoid:{group.geoid}
                  </a>
                  )
                </h2>
                <p className="text-sm text-muted-foreground">
                  Alternate suggestions in {group.language} language. Currently, spelled as: {group.currentSpelling}
                </p>
              </div>
              <div className="space-y-3">
                {group.suggestions.map((s) => (
                  <SuggestionCard
                    key={s.id}
                    suggestion={s}
                    onApprove={() => handleApprove(group.id, s.id)}
                    onDecline={() => handleDecline(group.id, s.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
