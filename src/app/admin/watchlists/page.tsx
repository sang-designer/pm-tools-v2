"use client";

import { useState } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { TablePagination } from "@/components/ui/table-pagination";

interface WatchlistItem {
  id: string;
  type: string;
  location: string;
  editType: string;
  oldValue: string;
  newValue: string;
  user: string;
  date: string;
}

const MOCK_ITEMS: WatchlistItem[] = [
  { id: "wi-1", type: "marker", location: "Café Amazon, Ban Rangsit", editType: "position", oldValue: "14.0721, 100.6167", newValue: "14.0725, 100.6170", user: "user_th1", date: "Jul 12, 2026" },
  { id: "wi-2", type: "name", location: "KFC, Pathum Thani", editType: "name change", oldValue: "KFC Rangsit", newValue: "KFC Future Park", user: "user_th2", date: "Jul 11, 2026" },
  { id: "wi-3", type: "category", location: "FamilyMart, Khlong San", editType: "category", oldValue: "Convenience Store", newValue: "Mini Mart", user: "user_th3", date: "Jul 10, 2026" },
  { id: "wi-4", type: "marker", location: "Coffee Today, Rayong", editType: "position", oldValue: "12.6814, 101.2575", newValue: "12.6818, 101.2580", user: "user_th4", date: "Jul 9, 2026" },
  { id: "wi-5", type: "name", location: "Marsi Hotel Bangkok", editType: "name change", oldValue: "Marsi Hotel", newValue: "Marsi Hotel Bangkok", user: "user_th5", date: "Jul 8, 2026" },
];

export default function WatchlistsPage() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filteredItems = filter === "all" ? MOCK_ITEMS : MOCK_ITEMS.filter((item) => item.type === filter);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PER_PAGE));
  const paginated = filteredItems.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="size-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Watchlists</h1>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">all</SelectItem>
              <SelectItem value="marker">marker edits</SelectItem>
              <SelectItem value="name">name changes</SelectItem>
              <SelectItem value="category">category changes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 mb-6 rounded-md border border-border bg-muted/30 px-3 py-2">
          <Info className="size-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            (note: for marker edits, &quot;O&quot; is old position, &quot;N&quot; is new position)
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Edit Type</TableHead>
                    <TableHead>Old Value (O)</TableHead>
                    <TableHead>New Value (N)</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{item.editType}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{item.oldValue}</TableCell>
                      <TableCell className="text-sm font-mono">{item.newValue}</TableCell>
                      <TableCell>
                        <a href="#" className="text-primary hover:underline text-sm">{item.user}</a>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Info className="size-8 text-muted-foreground mb-3" />
              <p className="text-base font-medium text-foreground mb-1">No watched items found</p>
              <p className="text-sm text-muted-foreground">
                No edits match the selected filter. Try selecting &quot;all&quot; to see everything.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
