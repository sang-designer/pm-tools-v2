"use client";

import { useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { TablePagination } from "@/components/ui/table-pagination";

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
  {
    id: "lg-6",
    name: "Shinjuku",
    type: "TOWN",
    geoid: "72057594039600123",
    language: "ja",
    currentSpelling: "新宿区",
    suggestions: [
      { id: "s8", name: "新宿", submittedBy: 3, venues: [{ name: "Ichiran Ramen", id: "v-jp1" }, { name: "Don Quijote", id: "v-jp2" }] },
    ],
  },
  {
    id: "lg-7",
    name: "Gangnam-gu",
    type: "ADMIN2",
    geoid: "72057594039610456",
    language: "ko",
    currentSpelling: "강남구",
    suggestions: [
      { id: "s9", name: "강남", submittedBy: 2, venues: [{ name: "COEX Mall", id: "v-kr1" }, { name: "Bongeunsa Temple", id: "v-kr2" }] },
    ],
  },
  {
    id: "lg-8",
    name: "Tsim Sha Tsui",
    type: "TOWN",
    geoid: "72057594039620789",
    language: "zh",
    currentSpelling: "尖沙咀",
    suggestions: [
      { id: "s10", name: "尖沙嘴", submittedBy: 1, venues: [{ name: "The Peninsula", id: "v-hk1" }] },
    ],
  },
  {
    id: "lg-9",
    name: "Petaling Jaya",
    type: "TOWN",
    geoid: "72057594039630111",
    language: "ms",
    currentSpelling: "Petaling Jaya",
    suggestions: [
      { id: "s11", name: "PJ", submittedBy: 2, venues: [{ name: "1 Utama", id: "v-my1" }, { name: "SS2 Mamak", id: "v-my2" }] },
    ],
  },
  {
    id: "lg-10",
    name: "Shibuya",
    type: "TOWN",
    geoid: "72057594039640222",
    language: "ja",
    currentSpelling: "渋谷区",
    suggestions: [
      { id: "s12", name: "渋谷", submittedBy: 4, venues: [{ name: "Shibuya 109", id: "v-jp3" }, { name: "Hachiko Square", id: "v-jp4" }] },
      { id: "s13", name: "シブヤ", submittedBy: 1, venues: [{ name: "Tower Records", id: "v-jp5" }] },
    ],
  },
  {
    id: "lg-11",
    name: "Itaewon",
    type: "TOWN",
    geoid: "72057594039650333",
    language: "ko",
    currentSpelling: "이태원동",
    suggestions: [
      { id: "s14", name: "이태원", submittedBy: 2, venues: [{ name: "Hamilton Hotel", id: "v-kr3" }] },
    ],
  },
  {
    id: "lg-12",
    name: "Minato",
    type: "ADMIN2",
    geoid: "72057594039660444",
    language: "ja",
    currentSpelling: "港区",
    suggestions: [
      { id: "s15", name: "みなと", submittedBy: 1, venues: [{ name: "Tokyo Tower", id: "v-jp6" }, { name: "Roppongi Hills", id: "v-jp7" }] },
    ],
  },
  {
    id: "lg-13",
    name: "Wan Chai",
    type: "TOWN",
    geoid: "72057594039670555",
    language: "zh",
    currentSpelling: "灣仔",
    suggestions: [
      { id: "s16", name: "湾仔", submittedBy: 1, venues: [{ name: "Hong Kong Convention Centre", id: "v-hk2" }] },
    ],
  },
  {
    id: "lg-14",
    name: "Harajuku",
    type: "TOWN",
    geoid: "72057594039680666",
    language: "ja",
    currentSpelling: "原宿",
    suggestions: [
      { id: "s17", name: "ハラジュク", submittedBy: 2, venues: [{ name: "Takeshita Street", id: "v-jp8" }, { name: "Meiji Shrine", id: "v-jp9" }] },
    ],
  },
  {
    id: "lg-15",
    name: "Hongdae",
    type: "TOWN",
    geoid: "72057594039690777",
    language: "ko",
    currentSpelling: "홍대",
    suggestions: [
      { id: "s18", name: "홍익대학교", submittedBy: 1, venues: [{ name: "KT&G Sangsangmadang", id: "v-kr4" }] },
      { id: "s19", name: "홍대입구", submittedBy: 3, venues: [{ name: "Thanks Nature Cafe", id: "v-kr5" }, { name: "Kakao Friends Store", id: "v-kr6" }] },
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
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const activeGroups = groups.filter((g) => g.suggestions.length > 0);
  const totalPages = Math.max(1, Math.ceil(activeGroups.length / PER_PAGE));
  const paginated = activeGroups.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
          {paginated.map((group) => (
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

        <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
