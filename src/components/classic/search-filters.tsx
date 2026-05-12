"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Search, ChevronDown, Settings2, MapPin, X } from "lucide-react";
import { FilterDrawer, FilterState, getActiveFilterChips, removeGroupFromSelected } from "./filter-drawer";

const CITIES = [
  "San Francisco",
  "New York",
  "Los Angeles",
  "Chicago",
  "Seattle",
  "Austin",
  "Portland",
  "Denver",
];

interface SearchFiltersProps {
  needsReviewOnly?: boolean;
  onNeedsReviewChange?: (value: boolean) => void;
  onFiltersChange?: (filters: FilterState) => void;
  onSearchChange?: (query: string) => void;
  pendingCounts?: Record<string, number>;
  filterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  appliedFilters?: FilterState;
  viewMode?: "map" | "list";
}

export function SearchFilters({ needsReviewOnly = false, onNeedsReviewChange, onFiltersChange, onSearchChange, pendingCounts, filterOpen: filterOpenProp, onFilterOpenChange, appliedFilters, viewMode = "map" }: SearchFiltersProps) {
  const [filterOpenInternal, setFilterOpenInternal] = useState(false);
  const filterOpen = filterOpenProp ?? filterOpenInternal;
  const setFilterOpen = onFilterOpenChange ?? setFilterOpenInternal;
  const [filters, setFilters] = useState<FilterState>({ selected: new Set() });
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("San Francisco");
  const [locationInput, setLocationInput] = useState("");

  // Sync external applied filters into internal state
  useEffect(() => {
    if (appliedFilters && appliedFilters.selected.size > 0) {
      setFilters(appliedFilters);
    }
  }, [appliedFilters]);

  const handleApply = useCallback((next: FilterState) => {
    setFilters(next);
    onFiltersChange?.(next);
  }, [onFiltersChange]);

  const activeChips = getActiveFilterChips(filters.selected);

  const handleRemoveChip = useCallback((groupKey: string) => {
    const nextSelected = removeGroupFromSelected(groupKey, filters.selected);
    const next: FilterState = { ...filters, selected: nextSelected };
    setFilters(next);
    onFiltersChange?.(next);
  }, [filters, onFiltersChange]);

  const handleClearAll = useCallback(() => {
    const next: FilterState = { ...filters, selected: new Set() };
    setFilters(next);
    onFiltersChange?.(next);
  }, [filters, onFiltersChange]);

  const [moreOpen, setMoreOpen] = useState(false);

  const MAX_VISIBLE_CHIPS = 2;
  const visibleChips = activeChips.slice(0, MAX_VISIBLE_CHIPS);
  const overflowChips = activeChips.slice(MAX_VISIBLE_CHIPS);

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(locationInput.toLowerCase())
  );

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedCity("My Location");
        setLocationOpen(false);
      },
      () => {
        setSelectedCity("My Location");
        setLocationOpen(false);
      }
    );
  };

  return (
    <>
      <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[468px] sm:shrink-0">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search for places"
              className="pl-9 border-border/40 bg-background/50 backdrop-blur"
              aria-label="Search for places"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverTrigger>
              <button
                className="flex h-10 w-full items-center justify-between rounded-md border border-border/40 bg-background/50 backdrop-blur px-3 text-sm transition-colors hover:bg-accent hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto sm:shrink-0 sm:gap-6"
                aria-label="Select city"
                aria-haspopup="listbox"
              >
                <span className="text-foreground font-medium">{selectedCity}</span>
                <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 sm:w-64" align="start">
              <div className="p-2">
                <Input
                  placeholder="Enter location"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="h-9"
                  autoFocus
                />
              </div>
              <button
                className="flex w-full items-center gap-2.5 border-b border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={handleUseMyLocation}
              >
                <MapPin className="size-4 text-muted-foreground" />
                Use my location
              </button>
              <div className="max-h-48 overflow-y-auto py-1">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    className="flex w-full items-center px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                    onClick={() => {
                      setSelectedCity(city);
                      setLocationOpen(false);
                      setLocationInput("");
                    }}
                  >
                    {city}
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
          {viewMode === "map" && (
            <label className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-sm font-medium text-foreground">Show only places needing your review</span>
              <Switch
                checked={needsReviewOnly}
                onCheckedChange={onNeedsReviewChange}
                aria-label="Toggle review filter"
              />
            </label>
          )}
          {activeChips.length > 0 && (
            <div className="hidden items-center gap-2 sm:ml-auto sm:flex">
              {visibleChips.map((chip) => (
                <button
                  key={chip.groupKey}
                  onClick={() => handleRemoveChip(chip.groupKey)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
                >
                  {chip.label}
                  {chip.childCount != null && (
                    <span className="text-primary/70">({chip.childCount})</span>
                  )}
                  <X className="size-3.5 text-primary/70 transition-colors group-hover:text-primary" />
                </button>
              ))}
              {overflowChips.length > 0 && (
                <Popover open={moreOpen} onOpenChange={setMoreOpen}>
                  <PopoverTrigger>
                    <button className="inline-flex items-center rounded-full border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10">
                      +{overflowChips.length} more
                    </button>
                  </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-2">
                  <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">Applied filters</p>
                  <div className="flex flex-col gap-1">
                    {overflowChips.map((chip) => (
                      <button
                        key={chip.groupKey}
                        onClick={() => handleRemoveChip(chip.groupKey)}
                        className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
                      >
                        <span>
                          {chip.label}
                          {chip.childCount != null && (
                            <span className="ml-1 text-muted-foreground">({chip.childCount})</span>
                          )}
                        </span>
                        <X className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <button
              onClick={handleClearAll}
              className="whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              Clear All
            </button>
          </div>
        )}
          <Button
            variant="outline"
            className="gap-2 border-border/40 bg-background/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary sm:ml-auto"
            onClick={() => setFilterOpen(true)}
          >
            <Settings2 className="size-4" aria-hidden="true" />
            Filter
          </Button>
        </div>
      </div>

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={handleApply}
        pendingCounts={pendingCounts}
      />
    </>
  );
}
