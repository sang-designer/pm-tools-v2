"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { TablePagination } from "@/components/ui/table-pagination";

interface VenueNameEntry {
  name: string;
  count: number;
  sampleVenues: string[];
}

const CHAIN_DATA = {
  name: "McDonald's",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/120px-McDonald%27s_Golden_Arches.svg.png",
  links: [
    { label: "On The Web", url: "#" },
    { label: "On X", url: "#" },
    { label: "On Facebook", url: "#" },
    { label: "On Instagram", url: "#" },
  ],
  categories: [
    { name: "Fast Food Restaurants", count: 1234 },
    { name: "Burger Joints", count: 7 },
    { name: "Cafés", count: 4 },
  ],
  translations: [
    { lang: "en", name: "McDonald's" },
    { lang: "he", name: "מקדונלד׳ס" },
    { lang: "ar", name: "ماكدونالدز" },
    { lang: "ko", name: "맥도날드" },
    { lang: "ja", name: "マクドナルド" },
    { lang: "ar", name: "ماكدونالدز" },
    { lang: "zh", name: "麦当劳" },
  ],
  venueNames: [
    { name: "McDonald's", count: 38537, sampleVenues: ["Sample venue", "Sample venue", "Sample venue", "Sample venue"] },
    { name: "McDonald's 麦当劳...", count: 2356, sampleVenues: ["Sample venue", "Sample venue", "Sample venue", "Sample venue"] },
    { name: "マクドナルド", count: 2100, sampleVenues: ["Sample venue", "Sample venue"] },
    { name: "McDonald's 麦当劳...", count: 467, sampleVenues: ["Sample venue", "Sample venue", "Sample venue", "Sample venue"] },
    { name: "McDonald's...", count: 351, sampleVenues: ["Sample venue", "Sample venue", "Sample venue", "Sample venue"] },
    { name: "McDonald's (ماكدونالدز)...", count: 182, sampleVenues: ["Sample venue", "Sample venue", "Sample venue"] },
    { name: "McDonald's & McCafé...", count: 166, sampleVenues: ["Sample venue", "Sample venue"] },
    { name: "McCafé", count: 142, sampleVenues: ["Sample venue", "Sample venue"] },
    { name: "Mcdonald's", count: 101, sampleVenues: ["Sample venue", "Sample venue", "Sample venue", "Sample venue"] },
    { name: "McDonald's 麦当劳...", count: 95, sampleVenues: ["Sample venue", "Sample venue", "Sample venue", "Sample venue"] },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: ["Sample venue", "Sample venue"] },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: ["Sample venue", "Sample venue", "Sample venue"] },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: ["Sample venue", "Sample venue"] },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: ["Sample venue", "Sample venue", "Sample venue"] },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: ["Sample venue", "Sample venue"] },
  ] as VenueNameEntry[],
};

export default function ChainDetailPage() {
  const [page, setPage] = useState(1);
  const [country, setCountry] = useState("");
  const totalPages = 6;

  const maxCount = Math.max(...CHAIN_DATA.categories.map((c) => c.count));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link href="/admin/chains">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="size-4" /> Back to Chains
            </Button>
          </Link>
        </div>

        {/* Chain Header */}
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center py-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">{CHAIN_DATA.name}</h1>
            <img
              src={CHAIN_DATA.logo}
              alt={CHAIN_DATA.name}
              className="h-16 w-16 object-contain mb-4"
            />
            <div className="flex items-center gap-4 mb-4">
              {CHAIN_DATA.links.map((link) => (
                <a key={link.label} href={link.url} className="flex items-center gap-1 text-sm text-primary hover:underline">
                  {link.label} <ExternalLink className="size-3" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Manage users</Button>
              <Button variant="outline">History</Button>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="space-y-6">
            {/* Category breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Category breakdown for this chain</CardTitle>
                <p className="text-xs text-muted-foreground">Most venues in this chain are <span className="font-semibold text-foreground">Fast Food Restaurants</span></p>
              </CardHeader>
              <CardContent className="space-y-3">
                {CHAIN_DATA.categories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-foreground truncate">{cat.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="h-3 rounded-sm bg-primary/70" style={{ width: `${Math.max(8, (cat.count / maxCount) * 60)}px` }} />
                      <span className="text-sm font-medium tabular-nums text-foreground">{cat.count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Translated Names */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Translated Names</CardTitle>
                <p className="text-xs text-muted-foreground">Most venues in this chain are <span className="font-semibold text-foreground">Fast Food Restaurants</span></p>
              </CardHeader>
              <CardContent className="space-y-2">
                {CHAIN_DATA.translations.map((t, i) => (
                  <div key={`${t.lang}-${i}`} className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-6">{t.lang}</span>
                    <span className="text-sm text-foreground">{t.name}</span>
                  </div>
                ))}

                <Separator className="my-4" />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">See this chain in</p>
                  <div className="flex items-center gap-2">
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="jp">Japan</SelectItem>
                        <SelectItem value="kr">South Korea</SelectItem>
                        <SelectItem value="cn">China</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Go</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right content - Venue names table */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Most frequently occurring venue names for this chain</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-[80px] text-right">Count</TableHead>
                      <TableHead>Sample Venues</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CHAIN_DATA.venueNames.map((entry, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{entry.name}</TableCell>
                        <TableCell className="text-right tabular-nums text-sm">{entry.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                            {entry.sampleVenues.map((v, j) => (
                              <Link key={j} href="/venue/v50" className="text-xs text-primary hover:underline">{v}</Link>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
