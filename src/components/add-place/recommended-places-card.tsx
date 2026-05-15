"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { EpwItem, MOCK_EPWS } from "./add-place-form";

interface RecommendedPlacesCardProps {
  query: { name: string; address: string };
  onSelect: (epw: EpwItem) => void;
}

function matchesQuery(epw: EpwItem, query: { name: string; address: string }): boolean {
  const nameQ = query.name.trim().toLowerCase();
  const addressQ = query.address.trim().toLowerCase();

  if (!nameQ && !addressQ) return false;

  const epwName = epw.name.toLowerCase();
  const epwAddress = epw.address.toLowerCase();

  if (nameQ && epwName.includes(nameQ)) return true;
  if (addressQ && epwAddress.includes(addressQ)) return true;
  if (nameQ && addressQ) {
    return epwName.includes(nameQ) || epwAddress.includes(addressQ);
  }

  return false;
}

export function RecommendedPlacesCard({ query, onSelect }: RecommendedPlacesCardProps) {
  const hasQuery = query.name.trim().length > 0 || query.address.trim().length > 0;
  const filtered = hasQuery
    ? MOCK_EPWS.filter((epw) => matchesQuery(epw, query)).slice(0, 5)
    : [];

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-primary" />
          Suggested Places
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          From our dataset — click to auto-fill
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasQuery && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            Start typing a place name or address to see suggestions
          </p>
        )}
        {hasQuery && filtered.length === 0 && (
          <p className="py-2 text-center text-xs text-muted-foreground">
            No matching places in the queue
          </p>
        )}
        {filtered.length > 0 && (
          <div className="space-y-1">
            {filtered.map((epw) => (
              <button
                key={epw.id}
                type="button"
                onClick={() => onSelect(epw)}
                className={cn(
                  "w-full rounded-md border border-transparent px-3 py-2.5 text-left transition-colors",
                  "hover:border-border hover:bg-accent"
                )}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {epw.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {epw.address}, {epw.city}, {epw.state} {epw.zip}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
