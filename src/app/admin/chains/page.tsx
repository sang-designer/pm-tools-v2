"use client";

import { useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Link2 } from "lucide-react";
import Link from "next/link";
import { TablePagination } from "@/components/ui/table-pagination";

interface Chain {
  id: string;
  name: string;
  category: string;
  venueCount: number;
  countries: number;
  logo: string;
}

const MOCK_CHAINS: Chain[] = [
  { id: "mcdonalds", name: "McDonald's", category: "Fast Food Restaurant", venueCount: 41245, countries: 119, logo: "🍔" },
  { id: "starbucks", name: "Starbucks", category: "Coffee Shop", venueCount: 35711, countries: 84, logo: "☕" },
  { id: "subway", name: "Subway", category: "Sandwich Place", venueCount: 36840, countries: 100, logo: "🥪" },
  { id: "kfc", name: "KFC", category: "Fast Food Restaurant", venueCount: 27000, countries: 150, logo: "🍗" },
  { id: "burger-king", name: "Burger King", category: "Burger Joint", venueCount: 18700, countries: 100, logo: "🍔" },
  { id: "pizza-hut", name: "Pizza Hut", category: "Pizza Place", venueCount: 18000, countries: 110, logo: "🍕" },
  { id: "dominos", name: "Domino's", category: "Pizza Place", venueCount: 19500, countries: 90, logo: "🍕" },
  { id: "dunkin", name: "Dunkin'", category: "Coffee Shop", venueCount: 12900, countries: 42, logo: "🍩" },
  { id: "taco-bell", name: "Taco Bell", category: "Mexican Restaurant", venueCount: 8200, countries: 32, logo: "🌮" },
  { id: "wendys", name: "Wendy's", category: "Burger Joint", venueCount: 7100, countries: 30, logo: "🍔" },
  { id: "chick-fil-a", name: "Chick-fil-A", category: "Fast Food Restaurant", venueCount: 3000, countries: 3, logo: "🐔" },
  { id: "popeyes", name: "Popeyes", category: "Fast Food Restaurant", venueCount: 3700, countries: 30, logo: "🍗" },
  { id: "five-guys", name: "Five Guys", category: "Burger Joint", venueCount: 1700, countries: 16, logo: "🍔" },
  { id: "chipotle", name: "Chipotle", category: "Mexican Restaurant", venueCount: 3300, countries: 6, logo: "🌯" },
  { id: "panera", name: "Panera Bread", category: "Bakery", venueCount: 2200, countries: 2, logo: "🍞" },
  { id: "tim-hortons", name: "Tim Hortons", category: "Coffee Shop", venueCount: 5700, countries: 15, logo: "☕" },
  { id: "costa-coffee", name: "Costa Coffee", category: "Coffee Shop", venueCount: 4000, countries: 32, logo: "☕" },
  { id: "panda-express", name: "Panda Express", category: "Chinese Restaurant", venueCount: 2400, countries: 11, logo: "🐼" },
  { id: "wingstop", name: "Wingstop", category: "Wings Joint", venueCount: 2000, countries: 8, logo: "🍗" },
  { id: "shake-shack", name: "Shake Shack", category: "Burger Joint", venueCount: 450, countries: 14, logo: "🍔" },
];

export default function ChainsListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const filtered = MOCK_CHAINS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

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
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chains</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {MOCK_CHAINS.length} chains registered · Select a chain to view details
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search chains by name or category..."
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Chain Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Venues</TableHead>
                <TableHead className="text-right">Countries</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No chains match your search.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((chain) => (
                  <TableRow key={chain.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={`/admin/chains/${chain.id}`} className="text-sm font-medium text-primary hover:underline">
                        {chain.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-normal">{chain.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums font-medium">
                      {chain.venueCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                      {chain.countries}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
