"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  History,
  Users,
} from "lucide-react";
import Link from "next/link";
import { TablePagination } from "@/components/ui/table-pagination";
import { cn } from "@/lib/utils";

interface VenueNameEntry {
  name: string;
  count: number;
  sampleVenues: { id: string; label: string }[];
}

interface ChainCategory {
  name: string;
  count: number;
}

interface ChainTranslation {
  lang: string;
  name: string;
}

interface ChainDetail {
  id: string;
  name: string;
  logo: string;
  links: { label: string; url: string }[];
  categories: ChainCategory[];
  translations: ChainTranslation[];
  venueNames: VenueNameEntry[];
}

const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "jp", label: "Japan" },
  { value: "kr", label: "South Korea" },
  { value: "cn", label: "China" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
] as const;

const SAMPLE = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: `v${50 + i}`,
    label: "Sample venue",
  }));

const DEFAULT_CHAIN: Omit<ChainDetail, "id" | "name" | "logo"> = {
  links: [
    { label: "On The Web", url: "#" },
    { label: "On X", url: "#" },
    { label: "On Facebook", url: "#" },
    { label: "On Instagram", url: "#" },
  ],
  categories: [
    { name: "Fast Food Restaurants", count: 1234 },
    { name: "Burger Joints", count: 7 },
    { name: "Cafés", count: 4 },
  ],
  translations: [
    { lang: "en", name: "McDonald's" },
    { lang: "he", name: "מקדונלד׳ס" },
    { lang: "ar", name: "ماكدونالدز" },
    { lang: "ko", name: "맥도날드" },
    { lang: "ja", name: "マクドナルド" },
    { lang: "zh", name: "麦当劳" },
  ],
  venueNames: [
    { name: "McDonald's", count: 38537, sampleVenues: SAMPLE(4) },
    { name: "McDonald's 麦当劳...", count: 2356, sampleVenues: SAMPLE(4) },
    { name: "マクドナルド", count: 2100, sampleVenues: SAMPLE(2) },
    { name: "McDonald's 麦当劳...", count: 467, sampleVenues: SAMPLE(4) },
    { name: "McDonald's...", count: 351, sampleVenues: SAMPLE(4) },
    { name: "McDonald's (ماكدونالدز)...", count: 182, sampleVenues: SAMPLE(3) },
    { name: "McDonald's & McCafé...", count: 166, sampleVenues: SAMPLE(2) },
    { name: "McCafé", count: 142, sampleVenues: SAMPLE(2) },
    { name: "Mcdonald's", count: 101, sampleVenues: SAMPLE(4) },
    { name: "McDonald's 麦当劳...", count: 95, sampleVenues: SAMPLE(4) },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: SAMPLE(2) },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: SAMPLE(3) },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: SAMPLE(2) },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: SAMPLE(3) },
    { name: "맥도날드 (McDonald's)...", count: 82, sampleVenues: SAMPLE(2) },
  ],
};

const CHAIN_OVERRIDES: Record<string, Partial<ChainDetail>> = {
  mcdonalds: {
    id: "mcdonalds",
    name: "McDonald's",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/120px-McDonald%27s_Golden_Arches.svg.png",
  },
  starbucks: {
    id: "starbucks",
    name: "Starbucks",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/120px-Starbucks_Corporation_Logo_2011.svg.png",
    categories: [
      { name: "Coffee Shops", count: 34012 },
      { name: "Cafés", count: 1204 },
      { name: "Bakeries", count: 88 },
    ],
    translations: [
      { lang: "en", name: "Starbucks" },
      { lang: "ja", name: "スターバックス" },
      { lang: "zh", name: "星巴克" },
      { lang: "ko", name: "스타벅스" },
      { lang: "ar", name: "ستاربكس" },
    ],
    venueNames: [
      { name: "Starbucks", count: 30112, sampleVenues: SAMPLE(4) },
      { name: "Starbucks Coffee", count: 2840, sampleVenues: SAMPLE(3) },
      { name: "スターバックス", count: 1902, sampleVenues: SAMPLE(2) },
      { name: "Starbucks Reserve", count: 412, sampleVenues: SAMPLE(2) },
    ],
  },
};

function titleFromId(id: string) {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getChainDetail(chainId: string): ChainDetail {
  const override = CHAIN_OVERRIDES[chainId];
  return {
    ...DEFAULT_CHAIN,
    id: chainId,
    name: override?.name ?? titleFromId(chainId),
    logo:
      override?.logo ??
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/120px-McDonald%27s_Golden_Arches.svg.png",
    ...override,
  };
}

function ChainIdentity({
  chain,
  compact = false,
}: {
  chain: ChainDetail;
  compact?: boolean;
}) {
  const primaryCategory = chain.categories[0];

  return (
    <div className={cn("flex", compact ? "items-start gap-4" : "flex-col gap-4")}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border border-border bg-card p-2",
          compact ? "size-14" : "size-16"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chain.logo}
          alt=""
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="min-w-0 space-y-2">
        <div className="space-y-1">
          <h1
            className={cn(
              "font-semibold tracking-tight text-foreground",
              compact ? "text-xl" : "text-xl sm:text-2xl"
            )}
          >
            {chain.name}
          </h1>
          {!compact && primaryCategory && (
            <p className="text-sm text-muted-foreground">{primaryCategory.name}</p>
          )}
        </div>

        <nav aria-label="Chain links" className="flex flex-wrap gap-x-3 gap-y-1">
          {chain.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="inline-flex min-h-10 items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
            >
              {link.label}
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="outline" className="min-h-10">
            <Users data-icon="inline-start" />
            Manage users
          </Button>
          <Button variant="outline" className="min-h-10">
            <History data-icon="inline-start" />
            History
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChainMetaSections({
  chain,
  country,
  onCountryChange,
}: {
  chain: ChainDetail;
  country: string | undefined;
  onCountryChange: (value: string | null | undefined) => void;
}) {
  const maxCategoryCount = Math.max(...chain.categories.map((c) => c.count), 1);
  const primaryCategory = chain.categories[0];

  return (
    <div className="space-y-6">
      <section aria-labelledby="category-breakdown-heading" className="space-y-3">
        <div className="space-y-1">
          <h2
            id="category-breakdown-heading"
            className="text-sm font-semibold text-foreground"
          >
            Category breakdown
          </h2>
          {primaryCategory && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Most venues in this chain are{" "}
              <span className="font-medium text-foreground">
                {primaryCategory.name}
              </span>
            </p>
          )}
        </div>
        <ul className="space-y-3">
          {chain.categories.map((cat) => {
            const pct = Math.round((cat.count / maxCategoryCount) * 100);
            return (
              <li key={cat.name} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm text-foreground">{cat.name}</span>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {cat.count.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={pct}
                  className="h-1.5"
                  aria-label={`${cat.name}: ${cat.count.toLocaleString()} venues`}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <Separator />

      <section aria-labelledby="translated-names-heading" className="space-y-3">
        <div className="space-y-1">
          <h2
            id="translated-names-heading"
            className="text-sm font-semibold text-foreground"
          >
            Translated names
          </h2>
          <p className="text-xs text-muted-foreground">
            Localized brand names seen across venues in this chain.
          </p>
        </div>
        {chain.translations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No translations available.</p>
        ) : (
          <ul className="space-y-2">
            {chain.translations.map((t, i) => (
              <li
                key={`${t.lang}-${i}`}
                className="flex min-h-9 items-center gap-3 text-sm"
              >
                <Badge
                  variant="secondary"
                  className="w-10 shrink-0 justify-center font-mono text-[0.7rem] uppercase"
                >
                  {t.lang}
                </Badge>
                <span className="text-foreground">{t.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Separator />

      <section aria-labelledby="country-filter-heading" className="space-y-3">
        <h2
          id="country-filter-heading"
          className="text-sm font-semibold text-foreground"
        >
          See this chain in
        </h2>
        <div className="flex items-center gap-2">
          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger className="min-h-10 w-full flex-1">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="min-h-10 shrink-0"
            disabled={!country}
          >
            Go
          </Button>
        </div>
      </section>
    </div>
  );
}

function VenueNameFrequencyList({
  entries,
  maxCount,
}: {
  entries: VenueNameEntry[];
  maxCount: number;
}) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No venue names found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Venue name frequencies for this chain will appear here once data is
          available.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: stacked, touch-friendly list */}
      <ul className="divide-y divide-border rounded-lg border border-border md:hidden">
        {entries.map((entry, i) => {
          const pct = Math.max(4, Math.round((entry.count / maxCount) * 100));
          return (
            <li key={`${entry.name}-${i}`} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-sm font-medium leading-snug text-foreground">
                  {entry.name}
                </p>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                  {entry.count.toLocaleString()}
                </span>
              </div>
              <Progress value={pct} className="h-1.5" aria-hidden />
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <span className="sr-only">Sample venues</span>
                {entry.sampleVenues.map((venue, j) => (
                  <Link
                    key={`${venue.id}-${j}`}
                    href={`/venue/${venue.id}`}
                    className="inline-flex min-h-10 items-center text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {venue.label}
                  </Link>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop: accessible table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <Table>
          <caption className="sr-only">
            Most frequently occurring venue names for this chain
          </caption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[42%]">Name</TableHead>
              <TableHead className="w-[18%]">Frequency</TableHead>
              <TableHead className="w-[10%] text-right">Count</TableHead>
              <TableHead>Sample venues</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, i) => {
              const pct = Math.max(4, Math.round((entry.count / maxCount) * 100));
              return (
                <TableRow key={`${entry.name}-${i}`}>
                  <TableCell className="align-middle text-sm font-medium text-foreground">
                    {entry.name}
                  </TableCell>
                  <TableCell className="align-middle">
                    <Progress
                      value={pct}
                      className="h-1.5 max-w-[140px]"
                      aria-label={`Relative frequency ${pct}%`}
                    />
                  </TableCell>
                  <TableCell className="align-middle text-right text-sm tabular-nums text-foreground">
                    {entry.count.toLocaleString()}
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {entry.sampleVenues.map((venue, j) => (
                        <Link
                          key={`${venue.id}-${j}`}
                          href={`/venue/${venue.id}`}
                          className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                          {venue.label}
                        </Link>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default function ChainDetailPage() {
  const params = useParams();
  const chainId = String(params.chainId ?? "mcdonalds");
  const chain = useMemo(() => getChainDetail(chainId), [chainId]);

  const [page, setPage] = useState(1);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [metaOpen, setMetaOpen] = useState(false);

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(chain.venueNames.length / perPage));
  const pageEntries = chain.venueNames.slice((page - 1) * perPage, page * perPage);
  const maxVenueCount = Math.max(...chain.venueNames.map((v) => v.count), 1);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <Link href="/admin/chains">
            <Button variant="ghost" size="sm" className="mb-0 min-h-10 gap-2 px-2">
              <ArrowLeft className="size-4" />
              Back to Chains
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,17.5rem)_minmax(0,1fr)] lg:gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden space-y-6 lg:block">
            <ChainIdentity chain={chain} />
            <Separator />
            <ChainMetaSections
              chain={chain}
              country={country}
              onCountryChange={(v) => setCountry(v ?? undefined)}
            />
          </aside>

          {/* Mobile brand + collapsible meta */}
          <div className="space-y-4 lg:hidden">
            <ChainIdentity chain={chain} compact />

            <Collapsible open={metaOpen} onOpenChange={setMetaOpen}>
              <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                <span>Chain details</span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    metaOpen && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <ChainMetaSections
                    chain={chain}
                    country={country}
                    onCountryChange={(v) => setCountry(v ?? undefined)}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Main content */}
          <main className="min-w-0 space-y-4">
            <header className="space-y-1">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                Most frequently occurring venue names
              </h2>
              <p className="text-sm text-muted-foreground">
                {chain.venueNames.length.toLocaleString()} name variants · page{" "}
                {page} of {totalPages}
              </p>
            </header>

            <VenueNameFrequencyList
              entries={pageEntries}
              maxCount={maxVenueCount}
            />

            {chain.venueNames.length > 0 && (
              <TablePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="mt-2"
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
