"use client";

import { useState } from "react";
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

const CHAIN_NAME = "McDonald's";
const TOTAL_VENUES = 38537;

const INITIAL_SUGGESTED_VENUES: SuggestedVenue[] = [
  { id: "sv-1", name: "McDonald's", address: "1549 North State St", city: "Orem", state: "UT", country: "United States", category: "Fast Food Restaurant", checkIns: 19, uniqueVisitors: 13, confirmed: true },
  { id: "sv-2", name: "Mcdonalds", address: "2304 S Kirkman Rd", city: "Orlando", state: "FL", country: "United States", category: "Fast Food Restaurant", checkIns: 118, uniqueVisitors: 66, confirmed: true },
  { id: "sv-3", name: "McDonald's", address: "3240 Gratiot Ave", city: "Marysville", state: "MI", country: "United States", category: "Fast Food Restaurant", checkIns: 513, uniqueVisitors: 55, confirmed: true },
  { id: "sv-4", name: "McDonald's", address: "2239 N Telegraph Rd", city: "Monroe", state: "MI", country: "United States", category: "Fast Food Restaurant", checkIns: 79, uniqueVisitors: 22, confirmed: true },
  { id: "sv-5", name: "McDonald's", address: "314 Baldwin St", city: "Jenison", state: "MI", country: "United States", category: "Fast Food Restaurant", checkIns: 590, uniqueVisitors: 85, confirmed: true },
  { id: "sv-6", name: "McDonald's", address: "51074 Romeo Plank Rd", city: "Macomb", state: "MI", country: "United States", category: "Fast Food Restaurant", checkIns: 227, uniqueVisitors: 77, confirmed: true },
  { id: "sv-7", name: "McDonald's", address: "6900 Silver Star Rd", city: "Ocoee", state: "FL", country: "United States", category: "Fast Food Restaurant", checkIns: 24, uniqueVisitors: 14, confirmed: true },
  { id: "sv-8", name: "McDonald's", address: "555 Seven Mile Rd", city: "Northville", state: "MI", country: "United States", category: "Fast Food Restaurant", checkIns: 237, uniqueVisitors: 47, confirmed: true },
  { id: "sv-9", name: "McDonald's", address: "200 South Clinton St", city: "Stockbridge", state: "MI", country: "United States", category: "Fast Food Restaurant", checkIns: 43, uniqueVisitors: 19, confirmed: true },
  { id: "sv-10", name: "McDonald's", address: "654 Fairview Rd", city: "Simpsonville", state: "SC", country: "United States", category: "Fast Food Restaurant", checkIns: 42, uniqueVisitors: 20, confirmed: true },
  { id: "sv-11", name: "McDonald's & McCafé", address: "1100 Fillmore St", city: "San Francisco", state: "CA", country: "United States", category: "Café", checkIns: 156, uniqueVisitors: 61, confirmed: false },
  { id: "sv-12", name: "McDonald's Express", address: "2001 Market St", city: "San Francisco", state: "CA", country: "United States", category: "Fast Food Restaurant", checkIns: 88, uniqueVisitors: 31, confirmed: false },
];

const PAGE_SIZE = 20;

export default function ChainManageUsersPage() {
  const params = useParams();
  const chainId = params.chainId as string;
  const [page, setPage] = useState(1);
  const [venues, setVenues] = useState(INITIAL_SUGGESTED_VENUES);

  const totalPages = Math.max(1, Math.ceil(venues.length / PAGE_SIZE));
  const pageVenues = venues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleConfirmed = (id: string) => {
    setVenues((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        const next = { ...v, confirmed: !v.confirmed };
        toast.success(next.confirmed ? "Marked as confirmed member" : "Removed as confirmed member", {
          description: next.name,
        });
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
          <Link href={`/admin/chains/${chainId}`} className="hover:text-foreground transition-colors">{CHAIN_NAME}</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">Manage users</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Manage users: {CHAIN_NAME}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {TOTAL_VENUES.toLocaleString()} venues in this chain worldwide currently
          </p>
          <p className="text-sm text-muted-foreground">
            {venues.length.toLocaleString()} suggested venues
          </p>
        </div>

        {/* Suggested venues table */}
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[70px]">Confirmed Member</TableHead>
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
