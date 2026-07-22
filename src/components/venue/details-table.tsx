"use client";

import { Venue, VenueHours } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  AlertTriangle,
  Info,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-responsive";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { MapPreview, DualMapPreview } from "@/components/venue/map-preview";
import { TablePagination as Pagination } from "@/components/ui/table-pagination";

type RowAction = "none" | "removed" | "suggested" | "not_sure" | "na";

interface DetailsRow {
  label: string;
  icon: React.ReactNode;
  current: string | VenueHours[];
  suggested?: string | VenueHours[];
  coords?: {
    currentLat: number;
    currentLng: number;
    suggestedLat: number;
    suggestedLng: number;
  };
}

function SuggesterAvatar({ name = "Sang Yeo", date = "January 2, 2025" }: { name?: string; date?: string }) {
  return (
    <div className="group/avatar relative ml-1 shrink-0">
      <div className="size-6 overflow-hidden rounded-full ring-2 ring-background">
        <img
          src="https://api.dicebear.com/7.x/adventurer/svg?seed=SangYeo"
          alt={name}
          className="size-full object-cover"
        />
      </div>
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 opacity-0 transition-opacity group-hover/avatar:opacity-100"
      >
        <div className="mx-auto size-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-foreground" />
        <div className="w-max max-w-xs rounded-lg bg-foreground px-3 py-2 text-center shadow-lg">
          <p className="text-sm font-medium text-background">Suggested by {name}</p>
          <p className="text-xs text-background/70">{date}</p>
        </div>
      </div>
    </div>
  );
}

function formatValue(val: string | VenueHours[] | undefined): React.ReactNode {
  if (!val) return "—";
  if (typeof val === "string") return val;
  return (
    <div className="space-y-1">
      {val.map((h, i) => (
        <div key={i} className="flex items-baseline gap-4">
          <span className="w-24 text-sm">{h.day}</span>
          <span className="text-sm">{h.hours}</span>
        </div>
      ))}
    </div>
  );
}

function RadioDot({ selected, disabled, onClick }: { selected: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors sm:size-4 ${
        selected
          ? "border-primary bg-primary"
          : disabled
            ? "border-input opacity-50 cursor-not-allowed"
            : "border-input hover:border-primary/60 cursor-pointer"
      }`}
    >
      {selected && <span className="size-3 rounded-full bg-primary-foreground sm:size-2" />}
    </button>
  );
}

function MobileActionCell({ rowAction, onAction }: { rowAction: RowAction; onAction: (a: RowAction) => void }) {
  if (rowAction === "removed") {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">
          Removed
        </span>
        <button onClick={() => onAction("none")} className="min-h-[44px] text-xs font-medium text-muted-foreground underline hover:text-foreground">
          Undo
        </button>
      </div>
    );
  }

  if (rowAction === "na") {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Marked as N/A
        </span>
        <button onClick={() => onAction("none")} className="min-h-[44px] text-xs font-medium text-muted-foreground underline hover:text-foreground">
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Button variant="outline" className="flex-1" onClick={() => onAction("suggested")}>
        Suggest
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => onAction("not_sure")}>
        Not sure
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => onAction("na")}>
        N/A
      </Button>
    </div>
  );
}

function DesktopActionCell({ rowAction, onAction }: { rowAction: RowAction; onAction: (a: RowAction) => void }) {
  if (rowAction === "removed") {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">
          Removed
        </span>
        <button onClick={() => onAction("none")} className="text-xs font-medium text-muted-foreground underline hover:text-foreground">
          Undo
        </button>
      </div>
    );
  }

  if (rowAction === "suggested") {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
          Suggested
        </span>
        <button onClick={() => onAction("none")} className="text-xs font-medium text-muted-foreground underline hover:text-foreground">
          Undo
        </button>
      </div>
    );
  }

  if (rowAction === "not_sure") {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
          Not sure
        </span>
        <button onClick={() => onAction("none")} className="text-xs font-medium text-muted-foreground underline hover:text-foreground">
          Undo
        </button>
      </div>
    );
  }

  if (rowAction === "na") {
    return (
      <div className="flex items-center justify-end gap-2">
        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Marked as N/A
        </span>
        <button onClick={() => onAction("none")} className="text-xs font-medium text-muted-foreground underline hover:text-foreground">
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-end">
      <div className="group/actions relative">
        <div className="absolute right-9 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-all duration-150 group-hover/actions:opacity-100">
          <button
            onClick={() => onAction("suggested")}
            className="scale-95 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm opacity-0 transition-all duration-150 hover:border-green-300 hover:bg-green-50 hover:text-green-600 group-hover/actions:scale-100 group-hover/actions:opacity-100 dark:hover:border-green-800 dark:hover:bg-green-950 dark:hover:text-green-400"
            style={{ transitionDelay: "0ms" }}
          >
            Suggest
          </button>
          <button
            onClick={() => onAction("not_sure")}
            className="scale-95 whitespace-nowrap rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm opacity-0 transition-all duration-150 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 group-hover/actions:scale-100 group-hover/actions:opacity-100 dark:hover:border-amber-800 dark:hover:bg-amber-950 dark:hover:text-amber-400"
            style={{ transitionDelay: "50ms" }}
          >
            Not sure
          </button>
          <button
            onClick={() => onAction("na")}
            className="scale-95 whitespace-nowrap rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm opacity-0 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 group-hover/actions:scale-100 group-hover/actions:opacity-100 dark:hover:border-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-300"
            style={{ transitionDelay: "100ms" }}
          >
            Set as N/A
          </button>
        </div>
        <div className="flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground">
          <MoreVertical className="size-4" />
        </div>
      </div>
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group/info relative ml-auto">
      <button type="button" className="flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground" aria-label={text}>
        <Info className="size-5" />
      </button>
      <div className="pointer-events-none absolute right-0 top-1/2 z-50 mr-7 -translate-y-1/2 opacity-0 transition-opacity group-hover/info:opacity-100">
        <div className="w-max max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-lg">
          <span className="font-semibold">{text.split(":")[0]}:</span>{text.slice(text.indexOf(":") + 1)}
        </div>
      </div>
    </div>
  );
}

function WarningBanner({ message, warnings }: { message: string; warnings?: string[] }) {
  const [open, setOpen] = useState(false);
  const items = warnings ?? [];

  return (
    <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900/40 dark:bg-orange-950/30">
      <button
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm"
        onClick={() => setOpen((p) => !p)}
      >
        <AlertTriangle className="size-4 shrink-0 text-orange-500" />
        <span className="flex-1 font-medium text-orange-700 dark:text-orange-400">{message}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-orange-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && items.length > 0 && (
        <div className="border-t border-orange-200 px-3 py-2 dark:border-orange-900/40">
          <ul className="space-y-2">
            {items.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-orange-600 dark:text-orange-400">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-orange-500" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MobileDetailCard({
  row,
  selection,
  action,
  onSelectChange,
  onActionChange,
}: {
  row: DetailsRow;
  selection: "current" | "suggested" | null;
  action: RowAction;
  onSelectChange: (v: "current" | "suggested" | null) => void;
  onActionChange: (a: RowAction) => void;
}) {
  const hasSuggested = !!row.suggested;

  return (
    <div className="rounded-xl border border-border bg-card p-4" role="radiogroup" aria-label={row.label}>
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        {row.icon}
        <span className="text-sm font-medium">{row.label}</span>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors"
          onClick={() => hasSuggested && onSelectChange("current")}
        >
          <RadioDot selected={selection === "current"} disabled={!hasSuggested} />
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Current</span>
            <span className="text-sm text-foreground">{formatValue(row.current)}</span>
          </div>
        </button>

        {hasSuggested && (
          <button
            type="button"
            className="flex w-full items-start gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/[0.03] p-3 text-left transition-colors"
            onClick={() => onSelectChange("suggested")}
          >
            <RadioDot selected={selection === "suggested"} />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Suggested</span>
                <SuggesterAvatar />
              </div>
              <span className="text-sm text-foreground">{formatValue(row.suggested)}</span>
            </div>
          </button>
        )}
      </div>

      <div className="mt-3 flex justify-end border-t border-border pt-3">
        <MobileActionCell rowAction={action} onAction={onActionChange} />
      </div>
    </div>
  );
}

function MobileLatLngCard({
  row,
  selection,
  action,
  mapViewMode,
  onSelectChange,
  onActionChange,
  onToggleMapView,
}: {
  row: DetailsRow;
  selection: "current" | "suggested" | null;
  action: RowAction;
  mapViewMode: "side-by-side" | "together";
  onSelectChange: (v: "current" | "suggested" | null) => void;
  onActionChange: (a: RowAction) => void;
  onToggleMapView: () => void;
}) {
  const coords = row.coords!;

  return (
    <div className="rounded-xl border border-border bg-card p-4" role="radiogroup" aria-label={row.label}>
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        {row.icon}
        <span className="text-sm font-medium">{row.label}</span>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors"
          onClick={() => onSelectChange("current")}
        >
          <RadioDot selected={selection === "current"} />
          <div className="min-w-0 flex-1">
            <span className="mb-0.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Current</span>
            <CoordLink lat={coords.currentLat} lng={coords.currentLng} />
          </div>
        </button>

        {mapViewMode === "side-by-side" && (
          <MapPreview
            lat={coords.currentLat}
            lng={coords.currentLng}
            pinColor="red"
            className="h-[180px] rounded-md"
          />
        )}

        <button
          type="button"
          className="flex w-full items-start gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/[0.03] p-3 text-left transition-colors"
          onClick={() => onSelectChange("suggested")}
        >
          <RadioDot selected={selection === "suggested"} />
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Suggested</span>
              <SuggesterAvatar />
            </div>
            <CoordLink lat={coords.suggestedLat} lng={coords.suggestedLng} />
          </div>
        </button>

        {mapViewMode === "side-by-side" && (
          <MapPreview
            lat={coords.suggestedLat}
            lng={coords.suggestedLng}
            pinColor="blue"
            className="h-[180px] rounded-md"
          />
        )}

        {mapViewMode === "together" && (
          <DualMapPreview
            currentLat={coords.currentLat}
            currentLng={coords.currentLng}
            suggestedLat={coords.suggestedLat}
            suggestedLng={coords.suggestedLng}
            className="h-[200px] rounded-md"
          />
        )}

        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={onToggleMapView}
          >
            {mapViewMode === "side-by-side" ? "View together" : "View side-by-side"}
          </button>
          <a
            href={googleMapsCompareUrl(coords.currentLat, coords.currentLng, coords.suggestedLat, coords.suggestedLng)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Compare both locations on Google Map
          </a>
        </div>
      </div>

      <div className="mt-3 flex justify-end border-t border-border pt-3">
        <MobileActionCell rowAction={action} onAction={onActionChange} />
      </div>
    </div>
  );
}

interface DetailsTableProps {
  venue: Venue;
}

function googleMapsCompareUrl(lat1: number, lng1: number, lat2: number, lng2: number) {
  return `https://www.google.com/maps/dir/${lat1},${lng1}/${lat2},${lng2}`;
}

function CoordLink({ lat, lng }: { lat: number; lng: number }) {
  return (
    <a
      href={`https://www.google.com/maps?q=${lat},${lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-primary underline-offset-2 hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {lat}, {lng}
    </a>
  );
}

const ROWS_PER_PAGE = 5;

export function DetailsTable({ venue }: DetailsTableProps) {
  const d = venue.detail;
  const isMobile = useIsMobile();

  const rows: DetailsRow[] = [
    {
      label: "Address",
      icon: <span className="text-xs">📍</span>,
      current: venue.address,
      suggested: d?.suggestedAddress,
    },
    {
      label: "Phone",
      icon: <span className="text-xs">📞</span>,
      current: d?.phone || "—",
      suggested: d?.suggestedPhone,
    },
    {
      label: "Hours",
      icon: <span className="text-xs">🕐</span>,
      current: d?.hours || "—",
      suggested: d?.suggestedHours,
    },
    ...(d?.suggestedLat != null && d?.suggestedLng != null
      ? [
          {
            label: "Display Lat Lng",
            icon: <span className="text-xs">✏️</span>,
            current: `${venue.lat}, ${venue.lng}`,
            suggested: `${d.suggestedLat}, ${d.suggestedLng}`,
            coords: {
              currentLat: venue.lat,
              currentLng: venue.lng,
              suggestedLat: d.suggestedLat,
              suggestedLng: d.suggestedLng,
            },
          } satisfies DetailsRow,
        ]
      : []),
  ];

  const total = rows.length;
  const [actions, setActions] = useState<RowAction[]>(rows.map(() => "none"));
  const [selections, setSelections] = useState<("current" | "suggested" | null)[]>(rows.map(() => null));
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [mapViewMode, setMapViewMode] = useState<"side-by-side" | "together">("side-by-side");

  const completed = actions.reduce((count, a, i) => {
    if (a !== "none" || selections[i] !== null) return count + 1;
    return count;
  }, 0);
  const remaining = total - completed;
  const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));
  const pagedRows = rows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const pagedOffset = (page - 1) * ROWS_PER_PAGE;

  const setRowAction = (i: number, a: RowAction) => {
    setActions((prev) => {
      const next = [...prev];
      next[i] = a;
      return next;
    });
    if (a !== "none") {
      setSelections((prev) => {
        const next = [...prev];
        next[i] = null;
        return next;
      });
    }
  };

  const setRowSelection = (i: number, v: "current" | "suggested" | null) => {
    setSelections((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v !== null) {
      setActions((prev) => {
        const next = [...prev];
        next[i] = "none";
        return next;
      });
    }
  };

  const sectionHeading = (
    <div className="flex w-full items-center gap-3 py-1">
      <CollapsibleTrigger className="flex items-center gap-3">
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Details ({completed}/{total})
        </h2>
        {remaining > 0 && (
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
            {remaining} remaining
          </span>
        )}
        <ChevronDown
          className={`size-5 text-muted-foreground transition-transform ${detailsOpen ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <InfoTooltip text="Details: Location and contact information" />
    </div>
  );

  if (isMobile) {
    return (
      <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
        {sectionHeading}
        <CollapsibleContent>
          <div className="mt-3">
            <WarningBanner
              message="This place has multiple warnings."
              warnings={[
                "This place has more than 250 check-ins. Please be EXTRA careful.",
                "This place has recent check-ins. Please be EXTRA careful.",
                "This suggestion was marked by a robot. Please be EXTRA careful.",
              ]}
            />
          </div>
          <div className="space-y-3">
            {pagedRows.map((row, i) => {
              const globalIdx = pagedOffset + i;
              if (row.label === "Display Lat Lng" && row.coords) {
                return (
                  <MobileLatLngCard
                    key={globalIdx}
                    row={row}
                    selection={selections[globalIdx]}
                    action={actions[globalIdx]}
                    mapViewMode={mapViewMode}
                    onSelectChange={(v) => setRowSelection(globalIdx, v)}
                    onActionChange={(a) => setRowAction(globalIdx, a)}
                    onToggleMapView={() => setMapViewMode((m) => m === "side-by-side" ? "together" : "side-by-side")}
                  />
                );
              }
              return (
                <MobileDetailCard
                  key={globalIdx}
                  row={row}
                  selection={selections[globalIdx]}
                  action={actions[globalIdx]}
                  onSelectChange={(v) => setRowSelection(globalIdx, v)}
                  onActionChange={(a) => setRowAction(globalIdx, a)}
                />
              );
            })}
          </div>
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
      {sectionHeading}
      <CollapsibleContent>
        <div className="mt-3">
          <WarningBanner
            message="This place has multiple warnings."
            warnings={[
              "This place has more than 250 check-ins. Please be EXTRA careful.",
              "This place has recent check-ins. Please be EXTRA careful.",
              "This suggestion was marked by a robot. Please be EXTRA careful.",
            ]}
          />
        </div>

        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="w-[100px] border-r border-border px-4 py-2 text-left font-bold text-muted-foreground">List</th>
                <th className="px-4 py-2 text-left font-bold text-muted-foreground">Current</th>
                <th className="border-l-2 border-dashed border-border px-4 py-2 text-left font-bold text-muted-foreground">Suggested</th>
                <th className="w-[120px] whitespace-nowrap border-l border-border px-4 py-2 text-right font-bold text-muted-foreground">Add Custom</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, i) => {
                const globalIdx = pagedOffset + i;
                const hasSuggested = !!row.suggested;
                const isLatLng = row.label === "Display Lat Lng" && row.coords;

                if (isLatLng && row.coords) {
                  const { currentLat, currentLng, suggestedLat, suggestedLng } = row.coords;
                  const isTogether = mapViewMode === "together";
                  return (
                    <tr key={globalIdx} className="border-b border-border last:border-b-0" role="radiogroup" aria-label={row.label}>
                      <td className="border-r border-border px-4 py-3 align-top">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {row.icon}
                          <span className="text-sm">{row.label}</span>
                        </div>
                      </td>
                      {isTogether ? (
                        <td
                          colSpan={2}
                          className="px-4 py-3 align-top"
                        >
                          <div className="mb-3 flex items-start gap-8">
                            <div
                              className="flex flex-1 cursor-pointer items-start gap-2"
                              onClick={() => setRowSelection(globalIdx, "current")}
                            >
                              <RadioDot selected={selections[globalIdx] === "current"} />
                              <CoordLink lat={currentLat} lng={currentLng} />
                            </div>
                            <div
                              className="flex flex-1 cursor-pointer items-start gap-2"
                              onClick={() => setRowSelection(globalIdx, "suggested")}
                            >
                              <RadioDot selected={selections[globalIdx] === "suggested"} />
                              <CoordLink lat={suggestedLat} lng={suggestedLng} />
                              <SuggesterAvatar />
                            </div>
                          </div>
                          <DualMapPreview
                            currentLat={currentLat}
                            currentLng={currentLng}
                            suggestedLat={suggestedLat}
                            suggestedLng={suggestedLng}
                            className="h-[240px] rounded-md"
                          />
                          <div className="mt-2 flex flex-col items-end gap-1">
                            <button
                              type="button"
                              className="text-sm text-primary hover:underline"
                              onClick={() => setMapViewMode("side-by-side")}
                            >
                              View side-by-side
                            </button>
                            <a
                              href={googleMapsCompareUrl(currentLat, currentLng, suggestedLat, suggestedLng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Compare both locations on Google Map
                            </a>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td
                            className="cursor-pointer px-4 py-3 align-top"
                            onClick={() => setRowSelection(globalIdx, "current")}
                          >
                            <div className="mb-3 flex items-start gap-2">
                              <RadioDot selected={selections[globalIdx] === "current"} />
                              <CoordLink lat={currentLat} lng={currentLng} />
                            </div>
                            <MapPreview
                              lat={currentLat}
                              lng={currentLng}
                              pinColor="red"
                              className="h-[200px] rounded-md"
                            />
                          </td>
                          <td
                            className="cursor-pointer border-l-2 border-dashed border-border px-4 py-3 align-top"
                            onClick={() => setRowSelection(globalIdx, "suggested")}
                          >
                            <div className="mb-3 flex items-start gap-2">
                              <RadioDot selected={selections[globalIdx] === "suggested"} />
                              <CoordLink lat={suggestedLat} lng={suggestedLng} />
                              <SuggesterAvatar />
                            </div>
                            <MapPreview
                              lat={suggestedLat}
                              lng={suggestedLng}
                              pinColor="blue"
                              className="h-[200px] rounded-md"
                            />
                            <div className="mt-2 flex flex-col items-end gap-1">
                              <button
                                type="button"
                                className="text-sm text-primary hover:underline"
                                onClick={() => setMapViewMode("together")}
                              >
                                View together
                              </button>
                              <a
                                href={googleMapsCompareUrl(currentLat, currentLng, suggestedLat, suggestedLng)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Compare both locations on Google Map
                              </a>
                            </div>
                          </td>
                        </>
                      )}
                      <td className="border-l border-border px-4 py-3 align-top text-right">
                        <DesktopActionCell rowAction={actions[globalIdx]} onAction={(a) => setRowAction(globalIdx, a)} />
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={globalIdx} className="border-b border-border last:border-b-0" role="radiogroup" aria-label={row.label}>
                    <td className="border-r border-border px-4 py-3 align-top">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {row.icon}
                        <span className="text-sm">{row.label}</span>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-3 align-top ${hasSuggested ? "cursor-pointer" : ""}`}
                      onClick={() => hasSuggested && setRowSelection(globalIdx, "current")}
                    >
                      <div className="flex items-start gap-2">
                        <RadioDot
                          selected={selections[globalIdx] === "current"}
                          disabled={!hasSuggested}
                        />
                        <span className="text-sm text-foreground">
                          {formatValue(row.current)}
                        </span>
                      </div>
                    </td>
                    <td
                      className="cursor-pointer border-l-2 border-dashed border-border px-4 py-3 align-top"
                      onClick={() => setRowSelection(globalIdx, "suggested")}
                    >
                      {hasSuggested ? (
                        <div className="flex items-start gap-2">
                          <RadioDot
                            selected={selections[globalIdx] === "suggested"}
                          />
                          <span className="text-sm text-foreground">
                            {formatValue(row.suggested)}
                          </span>
                          <SuggesterAvatar />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="border-l border-border px-4 py-3 align-top text-right">
                      <DesktopActionCell rowAction={actions[globalIdx]} onAction={(a) => setRowAction(globalIdx, a)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </CollapsibleContent>
    </Collapsible>
  );
}
