"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { VenueWoe, WoeType } from "@/lib/types";
import { MOCK_VENUE_WOES } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Copy,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";

const PAGE_SIZE = 15;

const TYPE_LABELS: Record<WoeType, string> = {
  info: "Info",
  apa: "APA",
  atvc: "ATVC",
  suspicious: "Suspicious",
};

const TYPE_COLORS: Record<WoeType, string> = {
  info: "bg-muted text-foreground",
  apa: "bg-muted text-foreground",
  atvc: "bg-muted text-foreground",
  suspicious: "bg-muted text-foreground",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

type SortField = "date" | "score";
type SortDir = "asc" | "desc";

interface VenueWoesProps {
  venueId: string;
  venueName: string;
}

export function VenueWoes({ venueId }: VenueWoesProps) {
  const [woes, setWoes] = useState<VenueWoe[]>(
    () => MOCK_VENUE_WOES.filter((w) => w.venueId === venueId)
  );
  const [resolveTarget, setResolveTarget] = useState<VenueWoe | null>(null);
  const [resolveOpen, setResolveOpen] = useState(false);

  const openWoes = useMemo(() => woes.filter((w) => w.status === "open"), [woes]);
  const resolvedWoes = useMemo(() => woes.filter((w) => w.status === "resolved"), [woes]);

  const handleResolve = () => {
    if (!resolveTarget) return;
    setWoes((prev) =>
      prev.map((w) =>
        w.id === resolveTarget.id
          ? { ...w, status: "resolved" as const, resolvedAt: new Date().toISOString() }
          : w
      )
    );
    setResolveOpen(false);
    setResolveTarget(null);
  };

  return (
    <div>
      <Tabs defaultValue="open" className="mt-4">
        <TabsList variant="line">
          <TabsTrigger value="open" className="px-3 py-2 text-sm font-medium">
            Open ({openWoes.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="px-3 py-2 text-sm font-medium">
            Resolved ({resolvedWoes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-4">
          {openWoes.length === 0 ? (
            <EmptyState message="No open woes — this venue is in great shape!" />
          ) : (
            <WoeTable
              woes={openWoes}
              onResolve={(w) => {
                setResolveTarget(w);
                setResolveOpen(true);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-4">
          {resolvedWoes.length === 0 ? (
            <EmptyState message="No resolved woes yet." />
          ) : (
            <WoeTable woes={resolvedWoes} />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve this woe?</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark &ldquo;{resolveTarget?.summary}&rdquo; as resolved?
              This action can be undone later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleResolve} className="gap-1.5">
              <CheckCircle2 className="size-4" />
              Resolve
            </Button>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
      <PartyPopper className="mb-3 size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface WoeTableProps {
  woes: VenueWoe[];
  onResolve?: (woe: VenueWoe) => void;
}

function WoeTable({ woes }: WoeTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const arr = [...woes];
    arr.sort((a, b) => {
      if (sortField === "date") {
        const diff = new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
        return sortDir === "asc" ? diff : -diff;
      }
      const diff = a.score - b.score;
      return sortDir === "asc" ? diff : -diff;
    });
    return arr;
  }, [woes, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  };

  const copyWoeId = (woeId: string) => {
    navigator.clipboard.writeText(woeId);
    setCopiedId(woeId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8" />
              <TableHead className="min-w-[200px]">Summary</TableHead>
              <TableHead>Woe ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>
                <button
                  className="inline-flex items-center gap-1 hover:text-foreground"
                  onClick={() => toggleSort("date")}
                >
                  Date
                  <SortIcon field="date" activeField={sortField} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="inline-flex items-center gap-1 hover:text-foreground"
                  onClick={() => toggleSort("score")}
                >
                  Score
                  <SortIcon field="score" activeField={sortField} dir={sortDir} />
                </button>
              </TableHead>
              <TableHead>Probability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((woe) => {
              const expanded = expandedIds.has(woe.id);
              return (
                <WoeRow
                  key={woe.id}
                  woe={woe}
                  expanded={expanded}
                  onToggle={() =>
                    setExpandedIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(woe.id)) {
                        next.delete(woe.id);
                      } else {
                        next.add(woe.id);
                      }
                      return next;
                    })
                  }
                  copiedId={copiedId}
                  onCopyId={copyWoeId}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

function SortIcon({
  field,
  activeField,
  dir,
}: {
  field: SortField;
  activeField: SortField;
  dir: SortDir;
}) {
  if (field !== activeField) {
    return <ArrowUpDown className="size-3 opacity-40" />;
  }
  return dir === "asc" ? (
    <ChevronUp className="size-3" />
  ) : (
    <ChevronDown className="size-3" />
  );
}

interface WoeRowProps {
  woe: VenueWoe;
  expanded: boolean;
  onToggle: () => void;
  copiedId: string | null;
  onCopyId: (id: string) => void;
}

function WoeRow({ woe, expanded, onToggle, copiedId, onCopyId }: WoeRowProps) {
  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={onToggle}
      >
        <TableCell>
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </TableCell>
        <TableCell className="max-w-[280px]">
          <p className="truncate font-medium text-foreground">{woe.summary}</p>
        </TableCell>
        <TableCell>
          <span className="inline-flex items-center gap-1.5">
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              {woe.woeId.slice(0, 8)}...
            </code>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyId(woe.woeId);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Copy Woe ID"
                >
                  {copiedId === woe.woeId ? (
                    <CheckCircle2 className="size-3.5 text-green-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {copiedId === woe.woeId ? "Copied!" : "Copy"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </TableCell>
        <TableCell>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[woe.type]}`}>
            {TYPE_LABELS[woe.type]}
          </span>
        </TableCell>
        <TableCell>
          <Link
            href={`/user/${woe.reportedBy.id}`}
            className="text-sm text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {woe.reportedBy.name.length > 25
              ? woe.reportedBy.name.slice(0, 25) + "..."
              : woe.reportedBy.name}
          </Link>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(woe.reportedAt)}
        </TableCell>
        <TableCell>
          <div>
            <span className="font-medium">{woe.score.toFixed(1)}</span>
            <p className="text-xs text-muted-foreground">
              +{woe.acceptGoal.toFixed(2)} / {woe.rejectGoal.toFixed(2)}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant="secondary"
            className={`text-xs ${
              woe.probability >= 0.8
                ? "bg-green-100 text-green-800"
                : woe.probability >= 0.5
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {(woe.probability * 100).toFixed(1)}%
          </Badge>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={8} className="p-0">
            <div className="space-y-3 px-6 py-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </h4>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                  {woe.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-6">
                {woe.reasons && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Reasons
                    </h4>
                    <p className="mt-1 text-sm text-foreground">{woe.reasons}</p>
                  </div>
                )}
                {woe.comments && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Comments
                    </h4>
                    <p className="mt-1 text-sm text-foreground">{woe.comments}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium">Reporter:</span>{" "}
                  <Link href={`/user/${woe.reportedBy.id}`} className="text-primary hover:underline">
                    {woe.reportedBy.name}
                  </Link>{" "}
                  ({woe.reportedBy.role}, power: {woe.reportedBy.power})
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">Woe ID:</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {woe.woeId}
                  </code>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyId(woe.woeId);
                    }}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Copy className="size-3" />
                    {copiedId === woe.woeId ? "Copied!" : "Copy"}
                  </button>
                </span>
                {woe.resolvedAt && (
                  <span>
                    <span className="font-medium">Resolved:</span> {formatDate(woe.resolvedAt)}
                  </span>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
