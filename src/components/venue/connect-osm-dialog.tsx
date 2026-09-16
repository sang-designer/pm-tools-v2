"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import type { Venue } from "@/lib/types";

export interface OsmPlace {
  osmId: string;
  name: string;
}

interface ConnectOsmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue;
  onConnect: (place: OsmPlace) => void;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getNearbyOsmPlaces(venue: Venue): OsmPlace[] {
  const street = venue.address.split(",")[0]?.trim() || venue.address;
  const base = 4_000_000_000 + (hashString(venue.id) % 900_000_000);
  const names = [
    venue.name,
    `${venue.name} Building`,
    street,
    venue.category,
    `${venue.name} Parking`,
    `${venue.name} Entrance`,
  ];
  return names.map((name, index) => ({
    osmId: String(base + index * 17).padStart(11, "0"),
    name,
  }));
}

function formatSearchValue(place: OsmPlace) {
  return `${place.osmId} - ${place.name}`;
}

function isValidOsmIdFormat(value: string) {
  return /^\d+$/.test(value.trim());
}

export function ConnectOsmDialog({
  open,
  onOpenChange,
  venue,
  onConnect,
}: ConnectOsmDialogProps) {
  const nearbyPlaces = useMemo(() => getNearbyOsmPlaces(venue), [venue]);
  const searchCatalog = useMemo(() => {
    const extras: OsmPlace[] = [{ osmId: "6122801", name: venue.name }];
    const seen = new Set(nearbyPlaces.map((place) => place.osmId));
    return nearbyPlaces.concat(extras.filter((place) => !seen.has(place.osmId)));
  }, [nearbyPlaces, venue.name]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchSelected, setSearchSelected] = useState<OsmPlace | null>(null);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const selectedPlace =
    searchSelected ?? nearbyPlaces.find((place) => place.osmId === selectedId) ?? null;

  const trimmedQuery = query.trim();
  const searchError =
    trimmedQuery.length > 0 &&
    !searchSelected &&
    !isValidOsmIdFormat(trimmedQuery);

  const searchMatches = useMemo(() => {
    if (searchError || !isValidOsmIdFormat(trimmedQuery) || trimmedQuery.length < 3) {
      return [];
    }
    return searchCatalog.filter((place) => place.osmId.includes(trimmedQuery));
  }, [searchCatalog, searchError, trimmedQuery]);

  const showDropdown =
    searchFocused && !searchSelected && !searchError && searchMatches.length > 0;

  function resetAndClose(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedId(null);
      setSearchSelected(null);
      setQuery("");
      setSearchFocused(false);
    }
    onOpenChange(nextOpen);
  }

  function handleConnect() {
    if (!selectedPlace) return;
    onConnect(selectedPlace);
    resetAndClose(false);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (searchSelected && value !== formatSearchValue(searchSelected)) {
      setSearchSelected(null);
    }
  }

  function selectFromSearch(place: OsmPlace) {
    setSearchSelected(place);
    setSelectedId(null);
    setQuery(formatSearchValue(place));
    setSearchFocused(false);
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="gap-0 overflow-visible p-0 sm:max-w-[598px]">
        <DialogHeader className="gap-1.5 px-6 py-4 pr-12">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Connect to OSM
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6 pb-8">
          <DialogDescription className="text-base text-foreground">
            Connect this place to OpenStreetMap(OSM).
          </DialogDescription>

          <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto" role="listbox" aria-label="Nearby OSM places">
            {nearbyPlaces.map((place) => {
              const checked = selectedId === place.osmId;
              return (
                <label
                  key={place.osmId}
                  className="flex cursor-pointer items-start gap-2"
                >
                  <Checkbox
                    className="mt-0.5"
                    checked={checked}
                    onCheckedChange={(value) => {
                      setSelectedId(value === true ? place.osmId : null);
                      setSearchSelected(null);
                    }}
                  />
                  <span className="flex min-w-0 flex-col gap-1.5 text-sm">
                    <span className="font-medium leading-none text-foreground">
                      {place.name}
                    </span>
                    <span className="text-muted-foreground">
                      OSM ID {place.osmId}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          <p className="text-base text-foreground">
            Couldn&apos;t find what you were looking for?
          </p>

          <div className="relative flex flex-col gap-2">
            <Label
              htmlFor="osm-id-search"
              className={cn("text-xs font-semibold", searchError && "text-destructive")}
            >
              Search OSM ID
            </Label>
            <InputGroup>
              <InputGroupAddon>
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                id="osm-id-search"
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search OSM ID"
                aria-invalid={searchError}
                aria-describedby={searchError ? "osm-id-search-error" : undefined}
                autoComplete="off"
              />
            </InputGroup>
            {showDropdown && (
              <ul
                role="listbox"
                className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md"
              >
                {searchMatches.map((place) => (
                  <li key={place.osmId}>
                    <button
                      type="button"
                      role="option"
                      className="w-full rounded-sm px-2 py-1.5 text-left text-xs text-foreground hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectFromSearch(place)}
                    >
                      {formatSearchValue(place)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {searchError && (
              <p id="osm-id-search-error" className="text-xs leading-4 text-destructive">
                Invalid OSM ID format. Please enter a valid numeric OSM ID.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 gap-6 rounded-none border-0 bg-transparent px-6 pb-6 pt-0 sm:justify-end">
          <DialogClose render={<Button variant="outline" className="min-w-20 text-primary" />}>
            Cancel
          </DialogClose>
          <Button className="min-w-20" disabled={!selectedPlace} onClick={handleConnect}>
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
