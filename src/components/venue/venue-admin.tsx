"use client";

import { Venue } from "@/lib/types";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MOCK_VENUE_WOES } from "@/lib/mock-data";
import dynamic from "next/dynamic";

const ShapesEditor = dynamic(
  () => import("./shapes-editor").then((m) => m.ShapesEditor),
  { ssr: false, loading: () => <div className="h-[360px] w-full animate-pulse rounded-lg bg-muted" /> }
);
import { X, Info, ArrowRight, Globe, Pentagon } from "lucide-react";

interface VenueAdminProps {
  venue: Venue;
}

export function VenueAdmin({ venue }: VenueAdminProps) {
  const [lockLocation, setLockLocation] = useState(false);
  const [markClosed, setMarkClosed] = useState(false);
  const [privateLocation, setPrivateLocation] = useState(false);
  const [allowSpecialChars, setAllowSpecialChars] = useState(false);
  const [disableNormalization, setDisableNormalization] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [aliasInput, setAliasInput] = useState("");
  const [aliases, setAliases] = useState<string[]>(["Name of alias 1", "Name of alias 2"]);
  const [harmonizationInput, setHarmonizationInput] = useState("");
  const [harmonizations, setHarmonizations] = useState<string[]>(["harmonization name whatever 1"]);

  const INITIAL_ALIASES = ["Name of alias 1", "Name of alias 2"];
  const INITIAL_HARMONIZATIONS = ["harmonization name whatever 1"];

  const hasChanges =
    lockLocation ||
    markClosed ||
    privateLocation ||
    allowSpecialChars ||
    disableNormalization ||
    countryCode !== "" ||
    aliases.length !== INITIAL_ALIASES.length ||
    aliases.some((a, i) => a !== INITIAL_ALIASES[i]) ||
    harmonizations.length !== INITIAL_HARMONIZATIONS.length ||
    harmonizations.some((h, i) => h !== INITIAL_HARMONIZATIONS[i]);

  const addAlias = () => {
    const trimmed = aliasInput.trim();
    if (trimmed && !aliases.includes(trimmed)) {
      setAliases((prev) => [...prev, trimmed]);
      setAliasInput("");
    }
  };

  const removeAlias = (name: string) => {
    setAliases((prev) => prev.filter((a) => a !== name));
  };

  const addHarmonization = () => {
    const trimmed = harmonizationInput.trim();
    if (trimmed && !harmonizations.includes(trimmed)) {
      setHarmonizations((prev) => [...prev, trimmed]);
      setHarmonizationInput("");
    }
  };

  const removeHarmonization = (name: string) => {
    setHarmonizations((prev) => prev.filter((h) => h !== name));
  };

  return (
    <div>
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Admin venue edit
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          To help keep Foursquare listings accurate, we have a few tools for trusted users that let them perform power edits on locations. Thanks for helping us to improve listings on Foursquare!
        </p>

        <Separator className="my-6" />

        {/* Status & Visibility */}
        <section>
          <h3 className="text-base font-semibold text-foreground">Status &amp; Visibility</h3>
          <div className="mt-4 space-y-4">
            <label className="flex items-start gap-3">
              <Checkbox checked={lockLocation} onCheckedChange={(v) => setLockLocation(!!v)} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Lock location</p>
                <p className="text-sm text-muted-foreground">
                  Prevent low level placemakers from editing, closing, claiming, and adding tags or categories.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <Checkbox checked={markClosed} onCheckedChange={(v) => setMarkClosed(!!v)} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Mark as permanently closed</p>
                <p className="text-sm text-muted-foreground">
                  Click to suggest that we close this location. Remember that other superusers may review your suggestion first. Unsure? Check out our editing guidelines{" "}
                  <a href="#" className="text-primary hover:underline">here</a>.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <Checkbox checked={privateLocation} onCheckedChange={(v) => setPrivateLocation(!!v)} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Private location</p>
                <p className="text-sm text-muted-foreground">
                  Remember that other superusers may review your suggestion first.
                </p>
              </div>
            </label>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Localization */}
        <section>
          <h3 className="text-base font-semibold text-foreground">Localization</h3>
          <div className="mt-4">
            <label className="text-sm font-medium text-foreground">Country code</label>
            <div className="mt-1.5 flex items-center gap-2">
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder=""
                className="max-w-sm"
              />
              <Button variant="outline">Override</Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              See{" "}
              <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
              </a>{" "}
              for the list of valid two-letter country codes.
            </p>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Data Normalization */}
        <section>
          <h3 className="text-base font-semibold text-foreground">Data Normalization</h3>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <Checkbox checked={allowSpecialChars} onCheckedChange={(v) => setAllowSpecialChars(!!v)} />
              <span className="text-sm text-foreground">Allow special characters and emoji in venue name</span>
            </label>
            <label className="flex items-center gap-3">
              <Checkbox checked={disableNormalization} onCheckedChange={(v) => setDisableNormalization(!!v)} />
              <span className="text-sm text-foreground">Disable address normalization</span>
            </label>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Aliases & Mappings */}
        <section>
          <h3 className="text-base font-semibold text-foreground">Aliases &amp; Mappings</h3>
          <div className="mt-4">
            <label className="text-sm font-medium text-foreground">Add alias</label>
            <div className="mt-1.5 flex items-center gap-2">
              <Input
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAlias()}
                className="max-w-sm"
              />
              <Button variant="outline" onClick={addAlias}>Add</Button>
            </div>
            {aliases.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {aliases.map((alias) => (
                  <Badge key={alias} variant="secondary" className="gap-1 py-1">
                    {alias}
                    <button onClick={() => removeAlias(alias)} aria-label={`Remove ${alias}`}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </section>

        <Separator className="my-6" />

        {/* Venue Harmonizations */}
        <section>
          <h3 className="text-base font-semibold text-foreground">Venue Harmonizations</h3>
          <div className="mt-4">
            <label className="text-sm font-medium text-foreground">Add harmonization</label>
            <div className="mt-1.5 flex items-center gap-2">
              <Input
                value={harmonizationInput}
                onChange={(e) => setHarmonizationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHarmonization()}
                className="max-w-sm"
              />
              <Button variant="outline" onClick={addHarmonization}>Add</Button>
            </div>
            {harmonizations.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {harmonizations.map((h) => (
                  <Badge key={h} variant="secondary" className="gap-1 py-1">
                    {h}
                    <button onClick={() => removeHarmonization(h)} aria-label={`Remove ${h}`}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </section>

        <Separator className="my-6" />

        {/* Shapes */}
        <section>
          <div className="flex items-center gap-2">
            <Pentagon className="size-4 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">Shapes</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Define the boundary geometry for this venue. Draw multiple disjoint polygons or carve holes in existing shapes. You can also import/export as GeoJSON or WKT.
          </p>
          <div className="mt-4">
            <ShapesEditor
              center={[venue.lat, venue.lng]}
              zoom={17}
            />
          </div>
        </section>

        <Separator className="my-6" />

        {/* Maintenance */}
        <section>
          <h3 className="text-base font-semibold text-foreground">Maintenance</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Reindex the venue (may take a few minutes to reflect in search)
          </p>
          <Button variant="outline" className="mt-3">
            Reindex venue
          </Button>
        </section>

        <Separator className="my-6" />

        <div>
          <Button size="lg" disabled={!hasChanges}>Apply</Button>
        </div>
      </div>

      <Separator className="my-8" />

      {(() => {
        const woeCount = MOCK_VENUE_WOES.filter((w) => w.venueId === venue.id).length;
        const openCount = MOCK_VENUE_WOES.filter((w) => w.venueId === venue.id && w.status === "open").length;
        return (
          <section>
            <h3 className="text-base font-semibold text-foreground">Venue Woes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              View and manage reported issues for this venue.
            </p>
            <Link href={`/venue/${venue.id}/woes`}>
              <Button variant="outline" className="mt-3 gap-2">
                <Info className="size-4" />
                Venue Woes
                {woeCount > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {woeCount}
                  </Badge>
                )}
                {openCount > 0 && (
                  <Badge className="bg-blue-100 text-xs text-blue-800 hover:bg-blue-100">
                    {openCount} open
                  </Badge>
                )}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </section>
        );
      })()}

      <Separator className="my-8" />

      <section>
        <h3 className="text-base font-semibold text-foreground">Geo Translations</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          View and manage how this venue&apos;s location is displayed in different languages.
        </p>
        <Link href={`/venue/${venue.id}/geo-translations`}>
          <Button variant="outline" className="mt-3 gap-2">
            <Globe className="size-4" />
            Geo Translations
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </section>

      <Separator className="my-8 sm:hidden" />
    </div>
  );
}
