"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRightIcon, ChevronLeft, ChevronRight, User, BarChart3 } from "lucide-react";
import Link from "next/link";

interface Woe {
  id: string;
  created: string;
  woeType: string;
  venue: string;
  venueId: string;
  description: string;
  resolved: string;
  resolvedDate: string;
  comment: string;
  priority: number;
  stats: { currentEnergy: number; requiredEnergyDiff: number; rejectEnergyDiff: number; probability: number };
  reporters: string;
  reviewers: string;
}

const MOCK_USER_WOES: Record<string, { total: number; woes: Woe[] }> = {
  "mykhailo-d": {
    total: 3893,
    woes: [
      { id: "w1", created: "2026-07-12T16:12:52.000Z", woeType: "closed", venue: "——", venueId: "v-1", description: "", resolved: "accepted", resolvedDate: "Jul 12, 2026 4:12 PM", comment: "", priority: 5, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.85, rejectEnergyDiff: -0.85, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
      { id: "w2", created: "2026-07-12T16:12:45.000Z", woeType: "closed", venue: "The Mermaid Parade", venueId: "v-2", description: "", resolved: "open", resolvedDate: "", comment: "", priority: 800, stats: { currentEnergy: 2.80, requiredEnergyDiff: 4.60, rejectEnergyDiff: -1.10, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
      { id: "w3", created: "2026-07-05T23:47:01.000Z", woeType: "info", venue: "Gerald Luss House", venueId: "v-3", description: "Instagram: geraldlusshouse", resolved: "accepted", resolvedDate: "Jul 05, 2026 11:47 PM", comment: "", priority: 500, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.62, rejectEnergyDiff: -0.62, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
      { id: "w4", created: "2026-07-05T23:46:23.000Z", woeType: "info", venue: "Gerald Luss House", venueId: "v-3", description: "URL: geraldlusshouse.com", resolved: "accepted", resolvedDate: "Jul 05, 2026 11:46 PM", comment: "", priority: 500, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.62, rejectEnergyDiff: -0.62, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
      { id: "w5", created: "2026-07-05T21:00:37.000Z", woeType: "info", venue: "MV Quick Food", venueId: "v-4", description: "Neighborhood: Coney Island", resolved: "accepted", resolvedDate: "Jul 05, 2026 9:00 PM", comment: "", priority: 700, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.62, rejectEnergyDiff: -0.62, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
      { id: "w6", created: "2026-07-05T21:00:37.000Z", woeType: "mislocated", venue: "MV Quick Food", venueId: "v-4", description: "Coords: [40.5779, -73.9761]", resolved: "accepted", resolvedDate: "Jul 05, 2026 9:00 PM", comment: "", priority: 0, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.85, rejectEnergyDiff: -0.85, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
      { id: "w7", created: "2026-07-05T21:00:37.000Z", woeType: "info", venue: "MV Quick Food", venueId: "v-4", description: "Name: MV Quick Food", resolved: "accepted", resolvedDate: "Jul 05, 2026 9:00 PM", comment: "", priority: 700, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.62, rejectEnergyDiff: -0.62, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
      { id: "w8", created: "2026-07-05T21:00:37.000Z", woeType: "hours", venue: "MV Quick Food", venueId: "v-4", description: "Seasonal hours", resolved: "accepted", resolvedDate: "Jul 05, 2026 9:00 PM", comment: "", priority: 700, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.00, rejectEnergyDiff: -0.00, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
      { id: "w9", created: "2026-07-05T21:00:36.000Z", woeType: "primarycategory", venue: "MV Quick Food", venueId: "v-4", description: "Category: Delis", resolved: "accepted", resolvedDate: "Jul 05, 2026 9:00 PM", comment: "", priority: 700, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.62, rejectEnergyDiff: -0.62, probability: 94.3 }, reporters: "Mykhailo D.", reviewers: "" },
    ],
  },
  "bart-v": {
    total: 1247,
    woes: [
      { id: "w10", created: "2026-07-10T15:30:00.000Z", woeType: "info", venue: "l'Estartit Beach", venueId: "v-5", description: "URL: estartit.cat", resolved: "accepted", resolvedDate: "Jul 10, 2026 3:30 PM", comment: "", priority: 600, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.62, rejectEnergyDiff: -0.62, probability: 94.3 }, reporters: "Bart V.", reviewers: "" },
      { id: "w11", created: "2026-07-10T15:28:00.000Z", woeType: "closed", venue: "Old Bakery Sint-Amandsberg", venueId: "v-6", description: "", resolved: "accepted", resolvedDate: "Jul 10, 2026 3:28 PM", comment: "", priority: 400, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.85, rejectEnergyDiff: -0.85, probability: 94.3 }, reporters: "Bart V.", reviewers: "" },
      { id: "w12", created: "2026-07-09T20:15:00.000Z", woeType: "info", venue: "Georgioupoli Taverna", venueId: "v-7", description: "Neighborhood: Georgioupoli", resolved: "accepted", resolvedDate: "Jul 09, 2026 8:15 PM", comment: "", priority: 500, stats: { currentEnergy: 2.80, requiredEnergyDiff: 0.62, rejectEnergyDiff: -0.62, probability: 94.3 }, reporters: "Bart V.", reviewers: "" },
    ],
  },
};

const USER_NAMES: Record<string, string> = {
  "mykhailo-d": "Mykhailo D.",
  "bart-v": "Bart V.",
  "sam-taylor": "Sam Taylor",
  "maria-rodriguez": "Maria Rodriguez",
  "jordan-lee": "Jordan Lee",
  "priya-patel": "Priya Patel",
  "alex-chen": "Alex Chen",
  "elena-kim": "Elena Kim",
  "david-park": "David Park",
};

const WOE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  closed: { label: "Closed", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  info: { label: "Info", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  mislocated: { label: "Mislocated", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  hours: { label: "Hours", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  primarycategory: { label: "Category", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
};

const RESOLVED_CONFIG: Record<string, { label: string; color: string }> = {
  accepted: { label: "Accepted", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  open: { label: "Open", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getPriorityLabel(priority: number): { label: string; color: string } {
  if (priority >= 700) return { label: "High", color: "text-red-600 dark:text-red-400 font-medium" };
  if (priority >= 400) return { label: "Med", color: "text-amber-600 dark:text-amber-400 font-medium" };
  if (priority > 0) return { label: "Low", color: "text-muted-foreground" };
  return { label: "—", color: "text-muted-foreground/50" };
}

export default function UserWoesPage() {
  const params = useParams();
  const userSlug = params.user as string;
  const [page, setPage] = useState(1);

  const userName = USER_NAMES[userSlug] || userSlug;
  const userData = MOCK_USER_WOES[userSlug];

  if (!userData) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <GlobalNav activeTab="Home" />
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRightIcon className="size-3" />
            <Link href="/admin/user-edits" className="hover:text-foreground">User Edits</Link>
            <ChevronRightIcon className="size-3" />
            <span className="text-foreground">{userSlug}</span>
          </nav>
          <Card className="flex flex-col items-center py-12 text-center">
            <CardContent>
              <p className="text-muted-foreground">No woes found for this user.</p>
              <Link href="/admin/user-edits" className="mt-4 inline-block">
                <Button variant="outline">Back to User Edits</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(userData.total / 10);
  const startItem = (page - 1) * 10 + 1;
  const endItem = Math.min(page * 10, userData.total);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <GlobalNav activeTab="Home" />
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRightIcon className="size-3" />
            <Link href="/admin/user-edits" className="hover:text-foreground transition-colors">User Edits</Link>
            <ChevronRightIcon className="size-3" />
            <span className="text-foreground font-medium">{userName}</span>
          </nav>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <User className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Woes by {userName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {userData.total.toLocaleString()} total entries
                </p>
              </div>
            </div>
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <Card>
              <CardContent className="pt-3 pb-2 px-4">
                <p className="text-xl font-bold tabular-nums">{userData.total.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-3 pb-2 px-4">
                <p className="text-xl font-bold tabular-nums text-green-600">{userData.woes.filter(w => w.resolved === "accepted").length}</p>
                <p className="text-[11px] text-muted-foreground">Accepted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-3 pb-2 px-4">
                <p className="text-xl font-bold tabular-nums text-amber-600">{userData.woes.filter(w => w.resolved === "open").length}</p>
                <p className="text-[11px] text-muted-foreground">Open</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-3 pb-2 px-4">
                <p className="text-xl font-bold tabular-nums text-red-600">{userData.woes.filter(w => w.priority >= 700).length}</p>
                <p className="text-[11px] text-muted-foreground">High Priority</p>
              </CardContent>
            </Card>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {startItem}–{endItem} of {userData.total.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="size-4" />
              </Button>
              <span className="px-3 text-sm tabular-nums text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[90px]">Type</TableHead>
                  <TableHead className="w-[160px]">Venue</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[90px]">Status</TableHead>
                  <TableHead className="w-[70px] text-center">Priority</TableHead>
                  <TableHead className="w-[80px] text-center">Confidence</TableHead>
                  <TableHead className="w-[100px]">Reporter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.woes.map((woe) => {
                  const typeConfig = WOE_TYPE_CONFIG[woe.woeType] || { label: woe.woeType, color: "bg-muted text-muted-foreground" };
                  const resolvedConfig = RESOLVED_CONFIG[woe.resolved] || { label: woe.resolved, color: "bg-muted text-muted-foreground" };
                  const priorityConfig = getPriorityLabel(woe.priority);

                  return (
                    <TableRow key={woe.id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-foreground cursor-default">
                              {formatDate(woe.created)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{formatDate(woe.created)} at {formatTime(woe.created)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[11px] font-medium border-0 ${typeConfig.color}`}>
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {woe.venue !== "——" ? (
                          <Link href={`/venue/${woe.venueId}`} className="text-sm font-medium text-primary hover:underline">
                            {woe.venue}
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {woe.description || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[11px] font-medium border-0 ${resolvedConfig.color}`}>
                          {resolvedConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-sm ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground cursor-default">
                              <BarChart3 className="size-3" />
                              {woe.stats.probability}%
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1 text-xs">
                              <p>Current energy: {woe.stats.currentEnergy.toFixed(2)}</p>
                              <p>Required energy diff: {woe.stats.requiredEnergyDiff.toFixed(2)}</p>
                              <p>Reject energy diff: {woe.stats.rejectEnergyDiff.toFixed(2)}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{woe.reporters || "—"}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Bottom Pagination */}
          <div className="flex items-center justify-center gap-1 mt-4">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(1)}>
              First
            </Button>
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="w-9"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
              Last
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
