"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { ChevronRight } from "lucide-react";
import { getChainDetail } from "@/lib/chain-data";

interface SuggestedVenue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  category: string;
  checkIns: number;
  uniqueVisitors: number;
  confirmed: boolean;
}

// Address/activity template used to seed suggested venues for any chain.
const SUGGESTED_VENUE_TEMPLATE = [
  { address: "1549 North State St", city: "Orem", state: "UT", country: "United States", nameSuffix: "", checkIns: 19, uniqueVisitors: 13, confirmed: true },
  { address: "2304 S Kirkman Rd", city: "Orlando", state: "FL", country: "United States", nameSuffix: "", checkIns: 118, uniqueVisitors: 66, confirmed: true },
  { address: "3240 Gratiot Ave", city: "Marysville", state: "MI", country: "United States", nameSuffix: "", checkIns: 513, uniqueVisitors: 55, confirmed: true },
  { address: "2239 N Telegraph Rd", city: "Monroe", state: "MI", country: "United States", nameSuffix: "", checkIns: 79, uniqueVisitors: 22, confirmed: true },
  { address: "314 Baldwin St", city: "Jenison", state: "MI", country: "United States", nameSuffix: "", checkIns: 590, uniqueVisitors: 85, confirmed: true },
  { address: "51074 Romeo Plank Rd", city: "Macomb", state: "MI", country: "United States", nameSuffix: "", checkIns: 227, uniqueVisitors: 77, confirmed: true },
  { address: "6900 Silver Star Rd", city: "Ocoee", state: "FL", country: "United States", nameSuffix: "", checkIns: 24, uniqueVisitors: 14, confirmed: true },
  { address: "555 Seven Mile Rd", city: "Northville", state: "MI", country: "United States", nameSuffix: "", checkIns: 237, uniqueVisitors: 47, confirmed: true },
  { address: "200 South Clinton St", city: "Stockbridge", state: "MI", country: "United States", nameSuffix: "", checkIns: 43, uniqueVisitors: 19, confirmed: true },
  { address: "654 Fairview Rd", city: "Simpsonville", state: "SC", country: "United States", nameSuffix: "", checkIns: 42, uniqueVisitors: 20, confirmed: true },
  { address: "1100 Fillmore St", city: "San Francisco", state: "CA", country: "United States", nameSuffix: " Reserve", checkIns: 156, uniqueVisitors: 61, confirmed: false },
  { address: "2001 Market St", city: "San Francisco", state: "CA", country: "United States", nameSuffix: " Express", checkIns: 88, uniqueVisitors: 31, confirmed: false },
];

function buildSuggestedVenues(chainName: string, category: string): SuggestedVenue[] {
  return SUGGESTED_VENUE_TEMPLATE.map((v, i) => ({
    id: `sv-${i + 1}`,
    name: `${chainName}${v.nameSuffix}`,
    address: v.address,
    city: v.city,
    state: v.state,
    country: v.country,
    category,
    checkIns: v.checkIns,
    uniqueVisitors: v.uniqueVisitors,
    confirmed: v.confirmed,
  }));
}

const PAGE_SIZE = 20;

export default function ChainManageConfirmedPlacesPage() {
  const params = useParams();
  const chainId = params.chainId as string;
  const chain = getChainDetail(chainId);
  const totalVenues = chain.venueNames[0]?.count ?? 0;
  const [page, setPage] = useState(1);
  const [venues, setVenues] = useState(() =>
    buildSuggestedVenues(chain.name, chain.categories[0]?.name ?? "")
  );

  // Re-seed if the chain changes without a full page remount (e.g. navigating
  // directly between two chains' Manage Confirmed Places pages).
  useEffect(() => {
    setVenues(buildSuggestedVenues(chain.name, chain.categories[0]?.name ?? ""));
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  const totalPages = Math.max(1, Math.ceil(venues.length / PAGE_SIZE));
  const pageVenues = venues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Selecting a venue adds this chain's ID to it; unselecting removes it.
  const toggleConfirmed = (id: string) => {
    setVenues((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const next = { ...v, confirmed: !v.confirmed };
        toast.success(
          next.confirmed ? `Added ${chain.name} to this place` : `Removed ${chain.name} from this place`,
          { description: next.name }
        );
        return next;
      })
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="size-3" />
          <Link href="/admin/chains" className="hover:text-foreground transition-colors">Chains</Link>
          <ChevronRight className="size-3" />
          <Link href={`/admin/chains/${chainId}`} className="hover:text-foreground transition-colors">{chain.name}</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">Manage Confirmed Places</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Manage Confirmed Places: {chain.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add or remove {chain.name}&rsquo;s chain ID from the venues below by selecting or unselecting them.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {totalVenues.toLocaleString()} confirmed places in this chain worldwide
          </p>
          <p className="text-sm text-muted-foreground">
            {venues.length.toLocaleString()} places suggested for review
          </p>
        </div>

        {/* Suggested venues table */}
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[70px]">Confirmed Place</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="w-[160px]">Categories</TableHead>
                    <TableHead className="w-[90px] text-right">Check-ins</TableHead>
                    <TableHead className="w-[110px] text-right">Unique Visitors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageVenues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell>
                        <Checkbox
                          checked={venue.confirmed}
                          onCheckedChange={() => toggleConfirmed(venue.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/venue/${venue.id}`} className="text-sm font-medium text-primary hover:underline">
                          {venue.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {venue.address}, {venue.city}, {venue.state}, {venue.country}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[11px] font-medium">{venue.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">{venue.checkIns.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums text-sm">{venue.uniqueVisitors.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
