"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { getLevelFromPoints } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown, MoreHorizontal, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHLY_DATA = [
  { month: "Jan", edits: 142, rejected: 5, rolledBack: 0, flagged: 2 },
  { month: "Feb", edits: 198, rejected: 8, rolledBack: 1, flagged: 3 },
  { month: "Mar", edits: 87, rejected: 3, rolledBack: 0, flagged: 1 },
  { month: "Apr", edits: 34, rejected: 2, rolledBack: 0, flagged: 1 },
  { month: "May", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Jun", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Jul", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Aug", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Sep", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Oct", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Nov", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
  { month: "Dec", edits: 0, rejected: 0, rolledBack: 0, flagged: 0 },
];

const LEGEND = [
  { label: "Edits", color: "bg-blue-500" },
  { label: "Rejected Edits", color: "bg-red-400" },
  { label: "Rolled Back", color: "bg-orange-400" },
  { label: "Flagged Photos", color: "bg-pink-400" },
];

const PERIODS = ["Overall", "This Month", "This Week"] as const;

const STATS = {
  totalEdits: 1604,
  approvedEdits: 590,
  rejectedEdits: 40,
  rolledBack: 1,
  flaggedPhotos: 13,
  placesCreated: 3,
};

const WEEKLY_STATS = {
  totalEdits: 12,
  rejectedEdits: 0,
  rolledBack: 0,
  flaggedPhotos: 0,
  placesCreated: 0,
};

const MONTHLY_STATS = {
  totalEdits: 87,
  rejectedEdits: 3,
  rolledBack: 0,
  flaggedPhotos: 2,
  placesCreated: 1,
};

const PERIOD_STATS: Record<(typeof PERIODS)[number], { totalEdits: number; rejectedEdits: number; rolledBack: number; flaggedPhotos: number; placesCreated: number }> = {
  "Overall": STATS,
  "This Week": WEEKLY_STATS,
  "This Month": MONTHLY_STATS,
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function BottomStatCard({ title, label, value }: { title: string; label: string; value: number }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-foreground">{title}</h4>
      <div className="rounded-lg border border-border p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ContributionSummaryPopover() {
  const [tab, setTab] = useState<"overall" | "weekly">("overall");
  const stats = tab === "overall" ? STATS : WEEKLY_STATS;

  const rows = [
    { label: "Edits", value: stats.totalEdits },
    { label: "Rejected edits", value: stats.rejectedEdits },
    { label: "Rolled back edits", value: stats.rolledBack },
    { label: "Flagged photos", value: stats.flaggedPhotos },
    { label: "Places created", value: stats.placesCreated },
  ];

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button className="text-sm font-medium text-primary hover:underline">
            Contributions summary
          </button>
        }
      />
      <PopoverContent align="start" className="w-80 p-0" sideOffset={8}>
        <div className="p-4 pb-0">
          <h3 className="text-lg font-semibold text-foreground">
            Contribution Summary
          </h3>
          <p className="text-sm text-muted-foreground">Joined October 7, 2024</p>

          <div className="mt-3 rounded-md border border-blue-200 bg-blue-50/60 px-3 py-2.5 dark:border-blue-500/30 dark:bg-blue-500/10">
            <div className="flex gap-2">
              <Info className="mt-0.5 size-3.5 shrink-0 text-blue-500" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your contribution stats update once a day, so you may notice a
                short delay before recent activity appears.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 border-b border-border px-4">
          <div className="flex gap-4">
            {(["overall", "weekly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "-mb-px border-b-2 pb-2 text-sm font-medium capitalize transition-colors",
                  tab === t
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "overall" ? "Overall" : "Weekly"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 pt-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-border py-3 last:border-b-0"
            >
              <span className="text-sm text-foreground">{row.label}</span>
              <span className="text-sm font-medium tabular-nums text-foreground">
                {row.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ContributionsChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxTotal = Math.max(
    ...MONTHLY_DATA.map((d) => d.edits + d.rejected + d.rolledBack + d.flagged),
    1
  );

  const niceMax = (() => {
    if (maxTotal <= 6) return 6;
    if (maxTotal <= 8) return 8;
    if (maxTotal <= 10) return 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxTotal)));
    const normalized = maxTotal / magnitude;
    if (normalized <= 2) return 2 * magnitude;
    if (normalized <= 5) return 5 * magnitude;
    return 10 * magnitude;
  })();

  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((niceMax / tickCount) * i)
  );

  const CHART_HEIGHT = 160;

  const SEGMENTS: { key: keyof typeof MONTHLY_DATA[number]; color: string; hoverColor: string }[] = [
    { key: "flagged", color: "bg-pink-400", hoverColor: "bg-pink-500" },
    { key: "rolledBack", color: "bg-orange-400", hoverColor: "bg-orange-500" },
    { key: "rejected", color: "bg-red-400", hoverColor: "bg-red-500" },
    { key: "edits", color: "bg-blue-400", hoverColor: "bg-blue-600" },
  ];

  return (
    <div className="flex-1 rounded-lg border border-border p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">Contributions Overview</h3>
        <div className="flex flex-wrap gap-3">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", item.color)} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Y axis */}
        <div
          className="flex w-7 shrink-0 flex-col-reverse justify-between pb-6 pr-2"
          style={{ height: CHART_HEIGHT + 24 }}
        >
          {yTicks.map((tick) => (
            <span key={tick} className="text-right text-[11px] text-muted-foreground">
              {tick}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 items-end gap-0">
          {MONTHLY_DATA.map((d, i) => {
            const total = d.edits + d.rejected + d.rolledBack + d.flagged;
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={d.month}
                className="group relative flex flex-1 flex-col items-center"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="relative flex w-full items-end justify-center"
                  style={{ height: CHART_HEIGHT }}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded transition-colors",
                      isHovered && "bg-muted/40"
                    )}
                  />

                  {total > 0 ? (
                    <div className="relative z-10 flex w-2.5 flex-col-reverse sm:w-3">
                      {SEGMENTS.map((seg) => {
                        const val = d[seg.key] as number;
                        if (val === 0) return null;
                        const pct = (val / niceMax) * 100;
                        const isFirst = seg.key === SEGMENTS.findLast((s) => (d[s.key] as number) > 0)?.key;
                        return (
                          <div
                            key={seg.key}
                            className={cn(
                              "w-full transition-all",
                              isHovered ? seg.hoverColor : seg.color,
                              isFirst && "rounded-t"
                            )}
                            style={{ height: `${(pct / 100) * CHART_HEIGHT}px` }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="relative z-10 h-px w-2.5 bg-border sm:w-3" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[11px]",
                    isHovered ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {d.month}
                </span>

                {/* Tooltip */}
                {isHovered && total > 0 && (() => {
                  const barH = (total / niceMax) * CHART_HEIGHT;
                  return (
                    <div
                      className="absolute left-1/2 z-30 -translate-x-1/2"
                      style={{ bottom: barH + 30 }}
                    >
                      <div className="w-48 rounded-lg border border-border bg-background p-3 shadow-lg">
                        <p className="mb-2 text-sm font-semibold text-foreground">{d.month}</p>
                        <div className="space-y-1.5">
                          {[
                            { label: "Edits", value: d.edits, color: "bg-blue-500" },
                            { label: "Rejected Edits", value: d.rejected, color: "bg-red-400" },
                            { label: "Rolled Back", value: d.rolledBack, color: "bg-orange-400" },
                            { label: "Flagged Photos", value: d.flagged, color: "bg-pink-400" },
                          ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className={cn("size-2 rounded-full", row.color)} />
                                <span className="text-muted-foreground">{row.label}</span>
                              </div>
                              <span className="font-medium tabular-nums text-foreground">{row.value}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">Total</span>
                          <span className="text-sm font-semibold tabular-nums text-foreground">{total}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// -- History tab data & components --

type ContributionStatus = "Pending" | "Accepted";

interface ExistingPlaceEdit {
  id: string;
  placeName: string;
  details: string;
  resolvedBy: "avatar" | "N/A";
  status: ContributionStatus;
  contributionType: string;
  created: string;
  resolved: string;
}

interface CreatedPlace {
  id: string;
  placeName: string;
  category: string;
  address: string;
  dateCreated: string;
}

const EXISTING_PLACE_EDITS: ExistingPlaceEdit[] = [
  { id: "1", placeName: "ABC Kitchen", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Photo", created: "04/14/2026", resolved: "" },
  { id: "2", placeName: "The Sacred Grounds Cafe", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Geosuggestion", created: "04/14/2026", resolved: "" },
  { id: "3", placeName: "The Lumpia Company", details: "phone: +12135707497", resolvedBy: "N/A", status: "Pending", contributionType: "Info", created: "04/06/2026", resolved: "" },
  { id: "4", placeName: "Wayland Meat Market", details: "", resolvedBy: "avatar", status: "Accepted", contributionType: "Hours", created: "04/06/2026", resolved: "04/06/2026" },
  { id: "5", placeName: "Yang Chow Restaurant", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Info", created: "04/06/2026", resolved: "" },
  { id: "6", placeName: "KYU2 Sushi", details: "", resolvedBy: "avatar", status: "Accepted", contributionType: "Closed", created: "04/06/2026", resolved: "04/06/2026" },
  { id: "7", placeName: "Ken Bullock - State Farm Insurance Agent", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Photo", created: "04/06/2026", resolved: "" },
  { id: "8", placeName: "Eco Chique Salon", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Vote", created: "03/28/2026", resolved: "" },
  { id: "9", placeName: "Moraga Country Club", details: "", resolvedBy: "avatar", status: "Accepted", contributionType: "Mislocated", created: "02/13/2026", resolved: "02/13/2026" },
  { id: "10", placeName: "Geppettos", details: "", resolvedBy: "N/A", status: "Pending", contributionType: "Photo", created: "02/13/2026", resolved: "" },
  { id: "11", placeName: "N/A", details: "", resolvedBy: "avatar", status: "Accepted", contributionType: "Delete", created: "02/03/2026", resolved: "02/03/2026" },
];

const CREATED_PLACES: CreatedPlace[] = [
  { id: "1", placeName: "Parachute Bakery", category: "Bakery", address: "1 Ferry Building, 1st St, San Francisco, CA", dateCreated: "09/03/2025" },
  { id: "2", placeName: "Chubby Cattle BBQ", category: "BBQ Joint", address: "2693 Stoneridge Dr #106., Pleasanton, CA", dateCreated: "07/30/2025" },
  { id: "3", placeName: "test-test 123", category: "Grocery Store", address: "1 La Espiral, Orinda, CA", dateCreated: "11/07/2024" },
];

const ROWS_PER_PAGE_OPTIONS = [10, 15, 25, 50];

type SortDir = "asc" | "desc" | null;

function StatusBadge({ status }: { status: ContributionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "Pending"
          ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
      )}
    >
      {status}
    </span>
  );
}

function AvatarPlaceholder() {
  return (
    <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
      <svg viewBox="0 0 24 24" className="size-5 text-white" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    </div>
  );
}

function SortIcon({ field, activeField, dir }: { field: string; activeField: string; dir: SortDir }) {
  if (field !== activeField || !dir) {
    return <ArrowUpDown className="size-3 opacity-40" />;
  }
  return dir === "asc" ? (
    <ChevronUp className="size-3" />
  ) : (
    <ChevronDown className="size-3" />
  );
}

const PAGE_SIZE = 15;

function TablePagination({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-2 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page</span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(v) => onRowsPerPageChange(Number(v))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROWS_PER_PAGE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <span className="mr-2 text-sm text-muted-foreground">
          {page} of {totalPages}
        </span>
        <ShadPagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); onPageChange(Math.max(1, page - 1)); }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); onPageChange(Math.min(totalPages, page + 1)); }}
                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </ShadPagination>
      </div>
    </div>
  );
}

function ExistingPlacesTable() {
  const [sortField, setSortField] = useState<"created" | "resolved">("created");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);

  const sorted = useMemo(() => {
    const items = [...EXISTING_PLACE_EDITS];
    const dir = sortDir ?? "desc";
    items.sort((a, b) => {
      const va = sortField === "resolved" ? a.resolved : a.created;
      const vb = sortField === "resolved" ? b.resolved : b.created;
      if (!va && !vb) return 0;
      if (!va) return 1;
      if (!vb) return -1;
      return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return items;
  }, [sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  function toggleSort(field: "created" | "resolved") {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  }

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px] font-normal text-muted-foreground">Place Name</TableHead>
              <TableHead className="font-normal text-muted-foreground">Details</TableHead>
              <TableHead className="font-normal text-muted-foreground">Resolved By</TableHead>
              <TableHead className="font-normal text-muted-foreground">Status</TableHead>
              <TableHead className="font-normal text-muted-foreground">Contribution types</TableHead>
              <TableHead className="font-normal text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("created")}>
                  Created
                  <SortIcon field="created" activeField={sortField} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="font-normal text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("resolved")}>
                  Resolved
                  <SortIcon field="resolved" activeField={sortField} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="py-3.5">
                  {row.placeName === "N/A" ? (
                    <span className="text-muted-foreground">N/A</span>
                  ) : (
                    <a href="#" className="text-primary hover:underline">{row.placeName}</a>
                  )}
                </TableCell>
                <TableCell className="py-3.5 text-muted-foreground">{row.details || ""}</TableCell>
                <TableCell className="py-3.5">
                  {row.resolvedBy === "avatar" ? <AvatarPlaceholder /> : <span className="text-muted-foreground">N/A</span>}
                </TableCell>
                <TableCell className="py-3.5">
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="py-3.5">{row.contributionType}</TableCell>
                <TableCell className="py-3.5">{row.created}</TableCell>
                <TableCell className="py-3.5">{row.resolved || ""}</TableCell>
                <TableCell className="py-3.5">
                  {row.resolved && (
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(1); }}
      />
    </>
  );
}

function CreatedPlacesTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);

  const totalPages = Math.max(1, Math.ceil(CREATED_PLACES.length / rowsPerPage));
  const paginated = CREATED_PLACES.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px] font-normal text-muted-foreground">Place Name</TableHead>
              <TableHead className="font-normal text-muted-foreground">Category</TableHead>
              <TableHead className="font-normal text-muted-foreground">Address</TableHead>
              <TableHead className="font-normal text-muted-foreground">Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="py-3.5">
                  <a href="#" className="text-primary hover:underline">{row.placeName}</a>
                </TableCell>
                <TableCell className="py-3.5">{row.category}</TableCell>
                <TableCell className="py-3.5">{row.address}</TableCell>
                <TableCell className="py-3.5">{row.dateCreated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(1); }}
      />
    </>
  );
}

// -- Votes tab data & components --

interface VoteRecord {
  id: string;
  placeName: string;
  placeId: string;
  type: string;
  details: string;
  proposedBy: "user" | "robot";
  yourVote: "Accept" | "Reject";
  correct: boolean | null;
  status: "Pending" | "Accepted" | "Denied";
  voted: string;
  resolved: string;
}

const MOCK_VOTES: VoteRecord[] = [
  { id: "v1", placeName: "ippudo", placeId: "v1", type: "Edit Info", details: "Website: https://www.ippudous.com/yerba-b...", proposedBy: "user", yourVote: "Accept", correct: null, status: "Pending", voted: "07/10/2026", resolved: "" },
  { id: "v2", placeName: "ippudo", placeId: "v1", type: "Edit Info", details: "Website: https://ippudo-us.com", proposedBy: "user", yourVote: "Reject", correct: null, status: "Pending", voted: "07/10/2026", resolved: "" },
  { id: "v3", placeName: "ippudo", placeId: "v1", type: "Edit Info", details: "Website: https://ippudous.com/yerba-buena", proposedBy: "robot", yourVote: "Reject", correct: null, status: "Pending", voted: "07/10/2026", resolved: "" },
  { id: "v4", placeName: "ippudo", placeId: "v1", type: "Edit Info", details: "Website: https://ippudous.com", proposedBy: "user", yourVote: "Reject", correct: null, status: "Pending", voted: "07/10/2026", resolved: "" },
  { id: "v5", placeName: "ippudo", placeId: "v1", type: "Edit Info", details: "Website: https://ippudo-us.com/store", proposedBy: "robot", yourVote: "Reject", correct: null, status: "Pending", voted: "07/10/2026", resolved: "" },
  { id: "v6", placeName: "ippudo", placeId: "v1", type: "Location", details: "", proposedBy: "robot", yourVote: "Reject", correct: true, status: "Denied", voted: "07/10/2026", resolved: "07/10/2026" },
  { id: "v7", placeName: "The Cheese Steak Shop", placeId: "v2", type: "Edit Info", details: "phone: +15107247160", proposedBy: "user", yourVote: "Reject", correct: true, status: "Denied", voted: "06/24/2026", resolved: "06/24/2026" },
  { id: "v8", placeName: "The Cheese Steak Shop", placeId: "v2", type: "Location", details: "", proposedBy: "robot", yourVote: "Accept", correct: true, status: "Accepted", voted: "06/24/2026", resolved: "06/24/2026" },
  { id: "v9", placeName: "Soi 4 Bangkok Eatery", placeId: "v3", type: "Hours", details: "", proposedBy: "robot", yourVote: "Accept", correct: true, status: "Accepted", voted: "06/24/2026", resolved: "06/24/2026" },
];

function VoteStatusBadge({ status }: { status: VoteRecord["status"] }) {
  const styles = {
    Pending: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    Accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    Denied: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {status}
    </span>
  );
}

function VotesTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const totalPages = Math.max(1, Math.ceil(MOCK_VOTES.length / rowsPerPage));
  const paginated = MOCK_VOTES.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[160px] font-normal text-muted-foreground">Place Name</TableHead>
              <TableHead className="font-normal text-muted-foreground">Type</TableHead>
              <TableHead className="min-w-[200px] font-normal text-muted-foreground">Details</TableHead>
              <TableHead className="font-normal text-muted-foreground">Proposed By</TableHead>
              <TableHead className="font-normal text-muted-foreground">Your Vote</TableHead>
              <TableHead className="font-normal text-muted-foreground">Correct?</TableHead>
              <TableHead className="font-normal text-muted-foreground">Status</TableHead>
              <TableHead className="font-normal text-muted-foreground">Voted</TableHead>
              <TableHead className="font-normal text-muted-foreground">Resolved</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="py-3.5">
                  <a href="#" className="text-primary hover:underline">{row.placeName}</a>
                </TableCell>
                <TableCell className="py-3.5">{row.type}</TableCell>
                <TableCell className="py-3.5 text-muted-foreground text-sm">{row.details || "—"}</TableCell>
                <TableCell className="py-3.5">
                  {row.proposedBy === "user" ? <AvatarPlaceholder /> : (
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                      <svg viewBox="0 0 24 24" className="size-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 9h6M9 13h6M9 17h4" />
                      </svg>
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-3.5">
                  <span className={cn("text-sm font-medium", row.yourVote === "Accept" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                    {row.yourVote}
                  </span>
                </TableCell>
                <TableCell className="py-3.5">
                  {row.correct === null ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <span className="text-sm">{row.correct ? "✓" : "✗"}</span>
                  )}
                </TableCell>
                <TableCell className="py-3.5">
                  <VoteStatusBadge status={row.status} />
                </TableCell>
                <TableCell className="py-3.5 text-sm">{row.voted}</TableCell>
                <TableCell className="py-3.5 text-sm text-muted-foreground">{row.resolved || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(1); }}
      />
    </>
  );
}

// -- Created Events tab data & components --

interface CreatedEvent {
  id: string;
  name: string;
  venue: string;
  venueId: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  checkins: number;
  category: string;
}

const MOCK_EVENTS: CreatedEvent[] = [
  { id: "e1", name: "Lit Up Trivia", venue: "Minnie's Bar", venueId: "v1", date: "2026-07-01", day: "Wednesday", startTime: "8:00 PM", endTime: "10:30 PM", checkins: 0, category: "Trivia" },
  { id: "e2", name: "Baila Wednesdays", venue: "Solas", venueId: "v2", date: "2026-07-01", day: "Wednesday", startTime: "8:30 PM", endTime: "1:00 AM", checkins: 0, category: "Dance" },
  { id: "e3", name: "Kings of Karaoke", venue: "American Cheez", venueId: "v3", date: "2026-07-01", day: "Wednesday", startTime: "9:00 PM", endTime: "1:00 AM", checkins: 1, category: "Karaoke" },
  { id: "e4", name: "Kings of Karaoke", venue: "Talon Bar", venueId: "v4", date: "2026-07-01", day: "Wednesday", startTime: "10:00 PM", endTime: "2:00 AM", checkins: 0, category: "Karaoke" },
  { id: "e5", name: "Greatest City In The World!", venue: "WeWork", venueId: "v5", date: "2026-07-02", day: "Thursday", startTime: "3:30 PM", endTime: "4:30 PM", checkins: 0, category: "Meetup" },
  { id: "e6", name: "Lit Up Trivia", venue: "Blue Agave", venueId: "v6", date: "2026-07-02", day: "Thursday", startTime: "8:00 PM", endTime: "10:30 PM", checkins: 0, category: "Trivia" },
  { id: "e7", name: "Lit Up Trivia", venue: "Sandy Jack's", venueId: "v7", date: "2026-07-02", day: "Thursday", startTime: "8:00 PM", endTime: "10:30 PM", checkins: 0, category: "Trivia" },
  { id: "e8", name: "Friday Night Karaoke", venue: "The Bitter End", venueId: "v8", date: "2026-07-03", day: "Friday", startTime: "9:00 PM", endTime: "1:00 AM", checkins: 3, category: "Karaoke" },
  { id: "e9", name: "Open Mic Night", venue: "Nuyorican Poets Café", venueId: "v9", date: "2026-07-04", day: "Saturday", startTime: "7:00 PM", endTime: "10:00 PM", checkins: 5, category: "Open Mic" },
  { id: "e10", name: "Jazz Brunch", venue: "Blue Note", venueId: "v10", date: "2026-07-05", day: "Sunday", startTime: "11:00 AM", endTime: "2:00 PM", checkins: 2, category: "Music" },
  { id: "e11", name: "Lit Up Trivia", venue: "Peculier Pub", venueId: "v11", date: "2026-07-08", day: "Wednesday", startTime: "8:00 PM", endTime: "10:30 PM", checkins: 0, category: "Trivia" },
  { id: "e12", name: "Salsa Tuesdays", venue: "Bembe", venueId: "v12", date: "2026-07-14", day: "Tuesday", startTime: "9:00 PM", endTime: "2:00 AM", checkins: 0, category: "Dance" },
  { id: "e13", name: "Comedy Open Mic", venue: "The Stand", venueId: "v13", date: "2026-07-15", day: "Wednesday", startTime: "7:30 PM", endTime: "9:30 PM", checkins: 0, category: "Comedy" },
  { id: "e14", name: "Karaoke Thursdays", venue: "Baby Grand", venueId: "v14", date: "2026-07-16", day: "Thursday", startTime: "9:00 PM", endTime: "1:00 AM", checkins: 0, category: "Karaoke" },
];

function MiniCalendar({ selectedDate, onSelectDate, eventDates }: { selectedDate: string | null; onSelectDate: (date: string | null) => void; eventDates: Set<string> }) {
  const [viewMonth, setViewMonth] = useState(6);
  const [viewYear, setViewYear] = useState(2026);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const monthName = new Date(viewYear, viewMonth).toLocaleString("en-US", { month: "long", year: "numeric" });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const today = new Date("2026-07-14");
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  return (
    <div className="rounded-lg border border-border p-4 w-full max-w-[320px]">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="icon" className="size-7" onClick={prevMonth}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-semibold text-foreground">{monthName.toUpperCase()}</span>
        <Button variant="ghost" size="icon" className="size-7" onClick={nextMonth}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="py-1 font-medium">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm">
        {blanks.map((_, i) => <span key={`b-${i}`} />)}
        {days.map((day) => {
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;
          const hasEvent = eventDates.has(dateStr);

          return (
            <button
              key={day}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={cn(
                "relative mx-auto flex size-8 items-center justify-center rounded-md text-sm transition-colors",
                isSelected && "bg-primary text-primary-foreground font-medium",
                !isSelected && isToday && "border border-primary text-primary font-medium",
                !isSelected && !isToday && hasEvent && "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 font-medium",
                !isSelected && !isToday && !hasEvent && "hover:bg-muted text-foreground"
              )}
            >
              {day}
              {hasEvent && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
      {selectedDate && (
        <Button variant="ghost" size="sm" className="mt-2 w-full text-xs" onClick={() => onSelectDate(null)}>
          Clear filter
        </Button>
      )}
    </div>
  );
}

function CreatedEventsTable() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const eventDates = useMemo(() => new Set(MOCK_EVENTS.map(e => e.date)), []);

  const filtered = useMemo(() => {
    if (!selectedDate) return MOCK_EVENTS;
    return MOCK_EVENTS.filter(e => e.date === selectedDate);
  }, [selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <MiniCalendar selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setPage(1); }} eventDates={eventDates} />
      <div className="flex-1">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {selectedDate
              ? `Events on ${new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
              : "All Scheduled Events"
            }
          </h3>
          <span className="text-xs text-muted-foreground">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-normal text-muted-foreground">Event Name</TableHead>
                <TableHead className="font-normal text-muted-foreground">Venue</TableHead>
                <TableHead className="font-normal text-muted-foreground">Date</TableHead>
                <TableHead className="font-normal text-muted-foreground">Time</TableHead>
                <TableHead className="font-normal text-muted-foreground">Category</TableHead>
                <TableHead className="font-normal text-muted-foreground text-center">Check-ins</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No events scheduled for this date.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="py-3.5">
                      <a href="#" className="text-primary hover:underline font-medium">{event.name}</a>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <a href="#" className="text-primary hover:underline">{event.venue}</a>
                    </TableCell>
                    <TableCell className="py-3.5 text-sm">
                      <span className="text-foreground">{event.day}</span>
                      <br />
                      <span className="text-muted-foreground text-xs">
                        {new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-sm text-muted-foreground">
                      {event.startTime} – {event.endTime}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                        {event.category}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      {event.checkins > 0 ? (
                        <span className="text-sm font-medium text-foreground">{event.checkins}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(1); }}
        />
      </div>
    </div>
  );
}

function HistoryTab({ initialSubTab = "created" }: { initialSubTab?: string }) {
  const [subTab, setSubTab] = useState<string>(initialSubTab);

  return (
    <Tabs value={subTab} onValueChange={setSubTab}>
      <TabsList>
        <TabsTrigger value="created">Created Places</TabsTrigger>
        <TabsTrigger value="existing">Existing Places</TabsTrigger>
        <TabsTrigger value="votes">Votes</TabsTrigger>
        <TabsTrigger value="events">Created Events</TabsTrigger>
      </TabsList>

      <TabsContent value="created" className="mt-4">
        <CreatedPlacesTable />
      </TabsContent>
      <TabsContent value="existing" className="mt-4">
        <ExistingPlacesTable />
      </TabsContent>
      <TabsContent value="votes" className="mt-4">
        <VotesTable />
      </TabsContent>
      <TabsContent value="events" className="mt-4">
        <CreatedEventsTable />
      </TabsContent>
    </Tabs>
  );
}

export function MyContributions() {
  const { totalPoints } = useGame();
  const { level } = getLevelFromPoints(totalPoints);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Overall");

  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "insights";
  const initialSubTab = searchParams.get("subtab") || "created";
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        My Contributions
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
          Level {level}
        </span>
        <span className="text-sm text-muted-foreground">User ID: 1410775520</span>
        <ContributionSummaryPopover />
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border">
            <TabsList variant="line">
              <TabsTrigger value="insights" className="px-4 py-2 text-sm">
                Contribution Insights
              </TabsTrigger>
              <TabsTrigger value="history" className="px-4 py-2 text-sm">
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="insights" className="mt-6">
            {/* Top section: stats + chart */}
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left: stat cards */}
              <div className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
                <StatCard label="Total Edits" value={STATS.totalEdits} />
                <StatCard label="Total approved edits" value={STATS.approvedEdits} />
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">Member since</p>
                  <p className="mt-1 flex items-center gap-1 text-3xl font-light tracking-tight text-foreground">
                    2024 <span className="text-2xl">🔥</span>
                  </p>
                </div>
              </div>

              {/* Right: chart */}
              <ContributionsChart />
            </div>

            <Separator className="my-6" />

            {/* Period toggle */}
            <div className="mb-4 flex gap-1 pb-3">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    period === p
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Bottom stat grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <BottomStatCard title="Edit" label={period} value={PERIOD_STATS[period].totalEdits} />
              <BottomStatCard title="Rejected edits" label={period} value={PERIOD_STATS[period].rejectedEdits} />
              <BottomStatCard title="Rolled back edits" label={period} value={PERIOD_STATS[period].rolledBack} />
              <BottomStatCard title="Flagged photos" label={period} value={PERIOD_STATS[period].flaggedPhotos} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <HistoryTab initialSubTab={initialSubTab} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
