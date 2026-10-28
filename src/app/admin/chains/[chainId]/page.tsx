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
import { ArrowLeft, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TablePagination } from "@/components/ui/table-pagination";
import { cn } from "@/lib/utils";

interface ChainVenue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface VenueNameEntry {
  name: string;
  count: number;
  venues: ChainVenue[];
}

// Mock venue data generator
const generateVenues = (name: string, count: number): ChainVenue[] => {
  const addresses = [
    { street: "1100 Fillmore St", city: "San Francisco", state: "CA", country: "United States" },
    { street: "2001 Market St", city: "San Francisco", state: "CA", country: "United States" },
    { street: "3600 16th St", city: "San Francisco", state: "CA", country: "United States" },
    { street: "1201 Ocean Ave", city: "San Francisco", state: "CA", country: "United States" },
    { street: "598 Bryant St", city: "San Francisco", state: "CA", country: "United States" },
    { street: "5001 Geary Blvd", city: "San Francisco", state: "CA", country: "United States" },
    { street: "2145 Chestnut St", city: "San Francisco", state: "CA", country: "United States" },
    { street: "4011 Balboa St", city: "San Francisco", state: "CA", country: "United States" },
    { street: "1 Embarcadero Center", city: "San Francisco", state: "CA", country: "United States" },
    { street: "845 Market St", city: "San Francisco", state: "CA", country: "United States" },
    { street: "1535 Broadway", city: "New York", state: "NY", country: "United States" },
    { street: "160 W 42nd St", city: "New York", state: "NY", country: "United States" },
    { street: "1560 Broadway", city: "New York", state: "NY", country: "United States" },
    { street: "5101 Wilshire Blvd", city: "Los Angeles", state: "CA", country: "United States" },
    { street: "6350 Hollywood Blvd", city: "Los Angeles", state: "CA", country: "United States" },
    { street: "201 N State St", city: "Chicago", state: "IL", country: "United States" },
    { street: "600 N Clark St", city: "Chicago", state: "IL", country: "United States" },
    { street: "1-3-2 Shinjuku", city: "Tokyo", state: "Tokyo", country: "Japan" },
    { street: "2-14-5 Shibuya", city: "Tokyo", state: "Tokyo", country: "Japan" },
    { street: "3-8-16 Ikebukuro", city: "Tokyo", state: "Tokyo", country: "Japan" },
    { street: "Wangfujing St 138", city: "Beijing", state: "Beijing", country: "China" },
    { street: "Nanjing Rd E 638", city: "Shanghai", state: "Shanghai", country: "China" },
    { street: "Gangnam-daero 156", city: "Seoul", state: "Seoul", country: "South Korea" },
    { street: "Jongno 1-ga 1", city: "Seoul", state: "Seoul", country: "South Korea" },
    { street: "King Fahd Rd", city: "Riyadh", state: "Riyadh Province", country: "Saudi Arabia" },
  ];

  return Array.from({ length: Math.min(count, 8) }, (_, i) => {
    const addr = addresses[i % addresses.length];
    return {
      id: `venue-${name}-${i}`,
      name,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country,
    };
  });
};

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
    { name: "McDonald's", count: 38537, venues: generateVenues("McDonald's", 8) },
    { name: "McDonald's 麦当劳", count: 2356, venues: generateVenues("McDonald's 麦当劳", 6) },
    { name: "マクドナルド", count: 2100, venues: generateVenues("マクドナルド", 5) },
    { name: "McDonald's & McCafé", count: 467, venues: generateVenues("McDonald's & McCafé", 4) },
    { name: "McDonald's Express", count: 351, venues: generateVenues("McDonald's Express", 5) },
    { name: "McDonald's (ماكدونالدز)", count: 182, venues: generateVenues("McDonald's (ماكدونالدز)", 3) },
    { name: "McCafé", count: 166, venues: generateVenues("McCafé", 4) },
    { name: "Mcdonald's", count: 101, venues: generateVenues("Mcdonald's", 3) },
    { name: "McDonald's 24/7", count: 95, venues: generateVenues("McDonald's 24/7", 4) },
    { name: "맥도날드", count: 82, venues: generateVenues("맥도날드", 3) },
  ] as VenueNameEntry[],
};

export default function ChainDetailPage() {
  const [page, setPage] = useState(1);
  const [country, setCountry] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const totalPages = 6;

  const maxCount = Math.max(...CHAIN_DATA.categories.map((c) => c.count));

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

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
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-[100px] text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CHAIN_DATA.venueNames.map((entry, i) => {
                      const isExpanded = expandedRows.has(i);
                      return (
                        <>
                          <TableRow 
                            key={i} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleRow(i)}
                          >
                            <TableCell>
                              {isExpanded ? (
                                <ChevronDown className="size-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="size-4 text-muted-foreground" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium text-sm">{entry.name}</TableCell>
                            <TableCell className="text-right tabular-nums text-sm">{entry.count.toLocaleString()}</TableCell>
                          </TableRow>
                          {isExpanded && entry.venues.map((venue, j) => (
                            <TableRow key={`${i}-venue-${j}`} className="bg-muted/20">
                              <TableCell></TableCell>
                              <TableCell colSpan={2} className="pl-8">
                                <Link 
                                  href={`/venue/${venue.id}`}
                                  className="block py-1 hover:text-primary"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="text-sm font-medium">{venue.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {venue.address}, {venue.city}, {venue.state}, {venue.country}
                                  </div>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      );
                    })}
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
