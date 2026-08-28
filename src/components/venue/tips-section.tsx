"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Flag, Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getVenueTips, TIP_FLAG_REASONS, type TipFlagReason, type VenueTip } from "@/lib/venue-tips";

const VISIBLE_COUNT = 3;

type SortMode = "recent" | "popular";
type Vote = "up" | "down" | null;

interface TipsSectionProps {
  venueId: string;
}

function formatTipDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function sortTips(tips: VenueTip[], sort: SortMode) {
  return [...tips].sort((a, b) => {
    if (sort === "popular") {
      const scoreDiff = b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      if (scoreDiff !== 0) return scoreDiff;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function TipCard({
  tip,
  vote,
  flagged,
  onVote,
  onFlag,
}: {
  tip: VenueTip;
  vote: Vote;
  flagged: boolean;
  onVote: (next: Vote) => void;
  onFlag: (reason: TipFlagReason) => void;
}) {
  const upCount = tip.upvotes + (vote === "up" ? 1 : 0);
  const downCount = tip.downvotes + (vote === "down" ? 1 : 0);

  return (
    <article className="rounded-lg border border-border p-4">
      <div className="flex gap-3">
        <Avatar className="size-10">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(tip.avatarSeed)}`}
            alt={tip.authorName}
          />
          <AvatarFallback>{initials(tip.authorName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">{tip.authorName}</p>
            <p className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm leading-relaxed text-foreground">
              {tip.text}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <time dateTime={tip.createdAt} className="mr-auto text-xs text-muted-foreground">
              {formatTipDate(tip.createdAt)}
            </time>
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={flagged}
                aria-label={flagged ? "Tip reported" : "Report tip"}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground",
                  flagged && "text-destructive hover:text-destructive"
                )}
              >
                <Flag className="size-3.5" />
                <span>{flagged ? "Reported" : "Report"}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {TIP_FLAG_REASONS.map((reason) => (
                  <DropdownMenuItem key={reason.value} onClick={() => onFlag(reason.value)}>
                    {reason.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground",
                vote === "up" && "text-primary hover:text-primary"
              )}
              aria-pressed={vote === "up"}
              aria-label="Upvote tip"
              onClick={() => onVote(vote === "up" ? null : "up")}
            >
              <ThumbsUp className={cn("size-3.5", vote === "up" && "fill-current")} />
              <span className="tabular-nums">{upCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground",
                vote === "down" && "text-destructive hover:text-destructive"
              )}
              aria-pressed={vote === "down"}
              aria-label="Downvote tip"
              onClick={() => onVote(vote === "down" ? null : "down")}
            >
              <ThumbsDown className={cn("size-3.5", vote === "down" && "fill-current")} />
              <span className="tabular-nums">{downCount}</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TipsSection({ venueId }: TipsSectionProps) {
  const [open, setOpen] = useState(true);
  const [sort, setSort] = useState<SortMode>("recent");
  const [showAll, setShowAll] = useState(false);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [flags, setFlags] = useState<Record<string, TipFlagReason>>({});

  const tips = useMemo(() => getVenueTips(venueId), [venueId]);
  const sorted = useMemo(() => sortTips(tips, sort), [tips, sort]);
  const visible = showAll ? sorted : sorted.slice(0, VISIBLE_COUNT);
  const hiddenCount = Math.max(0, sorted.length - VISIBLE_COUNT);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex w-full flex-wrap items-center gap-3 py-1">
        <CollapsibleTrigger className="flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Tips ({tips.length})
          </h2>
          <ChevronDown
            className={`size-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        {tips.length > 0 && (
          <div className="ml-auto flex rounded-lg border border-border p-0.5">
            <Button
              variant={sort === "recent" ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={sort === "recent"}
              onClick={() => setSort("recent")}
            >
              Recent
            </Button>
            <Button
              variant={sort === "popular" ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={sort === "popular"}
              onClick={() => setSort("popular")}
            >
              Popular
            </Button>
          </div>
        )}
      </div>
      <CollapsibleContent>
        {tips.length === 0 ? (
          <div className="mt-3 rounded-lg border-2 border-dashed border-border px-4 py-10 text-center">
            <Lightbulb className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm font-medium text-foreground">No tips yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tips from people who have been here will show up in this section.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {visible.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                vote={votes[tip.id] ?? null}
                flagged={Boolean(flags[tip.id])}
                onVote={(next) => setVotes((prev) => ({ ...prev, [tip.id]: next }))}
                onFlag={(reason) => {
                  setFlags((prev) => ({ ...prev, [tip.id]: reason }));
                  const label = TIP_FLAG_REASONS.find((item) => item.value === reason)?.label;
                  toast.success("Tip reported", { description: label });
                }}
              />
            ))}
            {!showAll && hiddenCount > 0 && (
              <Button variant="link" className="h-auto px-0" onClick={() => setShowAll(true)}>
                More tips
              </Button>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
