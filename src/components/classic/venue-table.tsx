"use client";

import { useState } from "react";
import { useGame } from "@/lib/game-context";
import { Venue } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ROWS_PER_PAGE = 15;

const VERACITY_COLORS: Record<number, string> = {
  1: "border-transparent bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  2: "border-transparent bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
  3: "border-transparent bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
  4: "border-transparent bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  5: "border-transparent bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
};

function VenueRow({ venue }: { venue: Venue }) {
  const router = useRouter();

  return (
    <tr
      className="border-b border-border transition-colors hover:bg-muted/50 cursor-pointer"
      onClick={() => router.push(`/venue/${venue.id}`)}
    >
      <td className="px-4 py-3">
        <span className="text-sm text-foreground underline underline-offset-2">
          {venue.name}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-foreground">{venue.address}</span>
      </td>
      <td className="px-4 py-3">
        {venue.veracityRating ? (
          <Badge variant="outline" className={`tabular-nums ${VERACITY_COLORS[venue.veracityRating] ?? ""}`}>
            {venue.veracityRating}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">–</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {!venue.globallyCompleted && venue.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </td>
    </tr>
  );
}

function ColumnHeader({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  return (
    <div className="flex items-center gap-1">
      <span>{children}</span>
      {tooltip && (
        <TooltipProvider delay={300}>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

export function VenueTable({ venues: venuesProp }: { venues?: Venue[] }) {
  const game = useGame();
  const venues = venuesProp ?? game.venues;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(venues.length / ROWS_PER_PAGE));
  const start = (page - 1) * ROWS_PER_PAGE;
  const paginatedVenues = venues.slice(start, start + ROWS_PER_PAGE);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-sm font-medium text-muted-foreground">
                Name of place
              </th>
              <th className="px-4 py-2 text-sm font-medium text-muted-foreground">
                Address
              </th>
              <th className="px-4 py-2 text-sm font-medium text-muted-foreground">
                <ColumnHeader tooltip="A score from 1 to 5 measuring how truthful a claim is, where 1 is completely false and 5 is completely true.">
                  Veracity Rating
                </ColumnHeader>
              </th>
              <th className="px-4 py-2 text-sm font-medium text-muted-foreground">
                <ColumnHeader tooltip="Types of reviews needed for this place">
                  Review Types
                </ColumnHeader>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedVenues.map((venue) => (
              <VenueRow key={venue.id} venue={venue} />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text=""
                onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pageNumbers.map((p, i) =>
              p === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => { e.preventDefault(); setPage(p); }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                text=""
                onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                aria-disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
