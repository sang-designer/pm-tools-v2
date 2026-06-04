"use client";

import { useState, useMemo } from "react";
import type { Venue, GeoLevel, GeoTranslation } from "@/lib/types";
import { MOCK_GEO_TRANSLATIONS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Plus, Check, X, Pencil, Info, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils";

const DEFAULT_VISIBLE = 3;

interface GeoTranslationsProps {
  venue: Venue;
}

function MetadataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="shrink-0 text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function InlineEditCell({
  value,
  onSave,
}: {
  value: string;
  onSave: (newValue: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <button
        className="group/edit flex items-center gap-1.5 text-left text-sm text-foreground"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
      >
        <span>{value}</span>
        <Pencil className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover/edit:opacity-100" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSave(draft);
            setEditing(false);
          } else if (e.key === "Escape") {
            setEditing(false);
          }
        }}
        className="h-8 w-full min-w-[120px] text-sm"
        autoFocus
      />
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        onClick={() => {
          onSave(draft);
          setEditing(false);
        }}
      >
        <Check className="size-3.5 text-green-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        onClick={() => setEditing(false)}
      >
        <X className="size-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}

function AddTranslationForm({ onAdd, onClose }: { onAdd: (t: GeoTranslation) => void; onClose: () => void }) {
  const [isoCode, setIsoCode] = useState("");
  const [language, setLanguage] = useState("");
  const [translation, setTranslation] = useState("");

  const handleSubmit = () => {
    if (!isoCode.trim() || !language.trim() || !translation.trim()) return;
    onAdd({
      isoCode: isoCode.trim().toLowerCase(),
      language: language.trim(),
      translation: translation.trim(),
    });
    setIsoCode("");
    setLanguage("");
    setTranslation("");
    onClose();
  };

  return (
    <Card className="relative w-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 size-7"
        onClick={onClose}
      >
        <X className="size-4" />
      </Button>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              ISO 639 Code
            </label>
            <Input
              value={isoCode}
              onChange={(e) => setIsoCode(e.target.value)}
              placeholder="e.g. de"
              className="text-sm"
              maxLength={3}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Not sure?{" "}
              <a
                href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-0.5"
              >
                Find your language code here
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Language
            </label>
            <Input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. German"
              className="text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Translation
            </label>
            <Input
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="e.g. Kalifornien"
              className="text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button onClick={handleSubmit}>
            Add translation
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileTranslationCard({
  t,
  onSave,
}: {
  t: GeoTranslation;
  onSave: (newTranslation: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            {t.isoCode}
          </span>
          <span className="text-sm text-muted-foreground">{t.language}</span>
        </div>
        <InlineEditCell value={t.translation} onSave={onSave} />
      </div>
    </div>
  );
}

function GeoLevelSection({
  level,
  isMobile,
}: {
  level: GeoLevel;
  isMobile: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [translations, setTranslations] = useState<GeoTranslation[]>(
    level.translations
  );

  const hasMore = translations.length > DEFAULT_VISIBLE;
  const visible = showAll ? translations : translations.slice(0, DEFAULT_VISIBLE);

  const handleSave = (idx: number, newTranslation: string) => {
    setTranslations((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], translation: newTranslation };
      return next;
    });
  };

  const handleAdd = (t: GeoTranslation) => {
    setTranslations((prev) => [...prev, t]);
  };

  const usedLabel = level.usedAs
    ? `used as ${level.usedAs}`
    : "not shown";

  const englishTranslation = translations.find((t) => t.isoCode === "en")?.translation;
  const geonameSlug = englishTranslation
    ? englishTranslation.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : undefined;

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="text-sm font-semibold text-foreground">
          {level.level}
        </h3>
        <span className="text-sm text-muted-foreground">({usedLabel})</span>
        {level.geonameId && (
          <a
            href={`https://www.geonames.org/${level.geonameId}${geonameSlug ? `/${geonameSlug}.html` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-primary hover:underline"
          >
            geonameid:{level.geonameId}
          </a>
        )}
      </div>

      {isMobile ? (
        <div className="mt-3 space-y-2">
          {visible.map((t, i) => (
            <MobileTranslationCard
              key={`${t.isoCode}-${i}`}
              t={t}
              onSave={(val) => handleSave(translations.indexOf(t), val)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">ISO 639 Code</TableHead>
                <TableHead className="w-[160px]">Language</TableHead>
                <TableHead>Translation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((t, i) => {
                const globalIdx = translations.indexOf(t);
                return (
                  <TableRow key={`${t.isoCode}-${i}`}>
                    <TableCell className="font-mono text-muted-foreground">
                      {t.isoCode}
                    </TableCell>
                    <TableCell>{t.language}</TableCell>
                    <TableCell>
                      <InlineEditCell
                        value={t.translation}
                        onSave={(val) => handleSave(globalIdx, val)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-3 flex flex-col items-start gap-2">
        {hasMore && (
          <Button
            variant="link"
            className="gap-1.5 px-0"
            onClick={() => setShowAll((p) => !p)}
          >
            {showAll ? "Show fewer languages" : `Show more languages (${translations.length - DEFAULT_VISIBLE})`}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                showAll && "rotate-180"
              )}
            />
          </Button>
        )}
        {!addFormOpen && (
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => setAddFormOpen(true)}
          >
            <Plus className="size-3.5" />
            Add new language translation
          </Button>
        )}
      </div>

      {addFormOpen && (
        <div className="mt-3">
          <AddTranslationForm onAdd={handleAdd} onClose={() => setAddFormOpen(false)} />
        </div>
      )}
    </div>
  );
}

export function GeoTranslations({ venue }: GeoTranslationsProps) {
  const isMobile = useIsMobile();

  const geoData = useMemo(
    () => MOCK_GEO_TRANSLATIONS.find((g) => g.venueId === venue.id),
    [venue.id]
  );

  if (!geoData) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No geo translation data available for this venue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/30">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This admin page shows you how the location of this venue is displayed
          in different languages. You can suggest translation improvements by
          clicking on current translations listed below.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          <MetadataRow label="User-entered city" value={geoData.userEnteredCity} />
          <MetadataRow label="User-entered state" value={geoData.userEnteredState} />
          <MetadataRow
            label="Is geographic"
            value={geoData.isGeographic ? "true" : "false"}
          />
          <MetadataRow
            label="Geographic Venue GeoId"
            value={geoData.geoId}
          />
          <MetadataRow
            label="Geographic Venue WoeType"
            value={geoData.woeType}
          />
          <MetadataRow
            label="Local language ordering"
            value={geoData.localLanguageOrdering.join(", ")}
          />
        </div>
      </div>

      <div className="space-y-6">
        {geoData.levels.map((level, i) => (
          <div key={level.level}>
            {i > 0 && <Separator className="mb-6" />}
            <GeoLevelSection level={level} isMobile={isMobile} />
          </div>
        ))}
      </div>
    </div>
  );
}
