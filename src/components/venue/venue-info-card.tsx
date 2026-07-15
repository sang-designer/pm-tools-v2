"use client";

import { Venue } from "@/lib/types";
import { Copy, Check, SquarePen, ChevronDown, Briefcase, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPreview } from "@/components/venue/map-preview";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Link from "next/link";

interface VenueInfoCardProps {
  venue: Venue;
}

export function VenueInfoCard({ venue }: VenueInfoCardProps) {
  const d = venue.detail;
  const [copied, setCopied] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);

  const copyFsqId = () => {
    if (d?.fsqPlaceId) {
      navigator.clipboard.writeText(d.fsqPlaceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-border bg-card xl:w-[400px]">
      <MapPreview lat={venue.lat} lng={venue.lng} name={venue.name} className="h-52 w-full" />

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-foreground">[{venue.name}]</h3>
              {venue.claimed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="inline-flex">
                      <Briefcase className="size-3.5 text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>Claimed business</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {!venue.claimed && (
              <button
                className="mt-0.5 text-xs font-medium text-primary hover:underline"
                onClick={() => {
                  const parts = venue.address.split(",").map((p) => p.trim());
                  const location =
                    parts.length >= 2
                      ? `${parts[parts.length - 2]}, ${parts[parts.length - 1]}, United States`
                      : `${venue.address}, United States`;
                  const returnParams = new URLSearchParams({
                    q: venue.name,
                    location,
                    lat: String(venue.lat),
                    lng: String(venue.lng),
                  });
                  const returnPath = `/?${returnParams.toString()}`;
                  const url = `https://business.foursquare.com/places/${venue.detail?.fsqPlaceId || ""}?return=${encodeURIComponent(returnPath)}`;
                  window.open(url, "_blank");
                }}
              >
                Claim this business
              </button>
            )}
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {(() => {
                const parts = venue.address?.split(",").map((p) => p.trim()) || [];
                const street = parts[0] || "";
                const cityStateZip = parts.length > 1
                  ? `${parts.slice(1).join(", ")} 94563`
                  : "94563";
                return (
                  <>
                    <span>{street}</span>
                    <br />
                    <span>{cityStateZip}</span>
                  </>
                );
              })()}
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
            >
              Get Directions
            </a>
            {venue.parentVenue && (
              <p className="mt-1 text-sm text-muted-foreground">
                At:{" "}
                <Link
                  href={`/venue/${venue.parentVenue.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {venue.parentVenue.name}
                </Link>
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            Edit <SquarePen className="size-4" />
          </Button>
        </div>

        {d?.hours && d.hours.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Hours</h4>
              <p className="mt-1 text-sm text-green-600">Open until 5:00 PM</p>
              <button
                className="mt-1 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                onClick={() => setHoursOpen((p) => !p)}
              >
                {hoursOpen ? "Hide" : "Show more"}
                <ChevronDown className={`size-3.5 transition-transform ${hoursOpen ? "rotate-180" : ""}`} />
              </button>
              {hoursOpen && (
                <div className="mt-2 space-y-1">
                  {d.hours.map((h, i) => (
                    <div key={i} className="flex items-baseline gap-4 text-sm text-muted-foreground">
                      <span className="w-24">{h.day}</span>
                      <span>{h.hours}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {d?.website && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Menu</h4>
              <a
                href={`${d.website}${d.website.endsWith("/") ? "" : "/"}menu`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                View menu
                <ExternalLink className="size-3" />
              </a>
            </div>
          </>
        )}

        {d?.fsqPlaceId && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">FSQ Place ID</h4>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 rounded-md border border-input bg-background px-3 py-2">
                  <p className="truncate text-sm text-muted-foreground">{d.fsqPlaceId}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className={`size-10 shrink-0 sm:size-9 ${copied ? "border-emerald-500 text-emerald-600" : "border-primary"}`}
                  onClick={copyFsqId}
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  <span className="sr-only">{copied ? "Copied" : "Copy FSQ Place ID"}</span>
                </Button>
              </div>
              {copied && (
                <p className="mt-1.5 text-xs font-medium text-emerald-600">Copied</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
