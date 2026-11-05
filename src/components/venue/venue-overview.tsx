"use client";

import { Phone, Facebook, Instagram, Tag, Users, MapPinned, CalendarCheck2, CheckCircle2 } from "lucide-react";
import type { Venue } from "@/lib/types";

interface VenueOverviewProps {
  venue: Venue;
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
        <Icon className="size-4 text-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-base font-semibold tabular-nums text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function VenueOverview({ venue }: VenueOverviewProps) {
  const d = venue.detail;
  const categories = d?.categories?.length ? d.categories : [venue.category];
  // Hours and website are already shown in the sidebar info card, so they're left out here to avoid duplication.
  const contactLinks = [
    d?.phone
      ? { key: "phone", icon: Phone, label: d.phone, href: `tel:${d.phone}` }
      : null,
    d?.facebook
      ? { key: "facebook", icon: Facebook, label: "Facebook", href: d.facebook }
      : null,
    d?.instagram
      ? { key: "instagram", icon: Instagram, label: "Instagram", href: d.instagram }
      : null,
  ].filter(Boolean) as { key: string; icon: React.ComponentType<{ className?: string }>; label: string; href: string }[];
  const features = d?.features ?? [];

  const stats = [
    d?.uniqueVisitors != null ? { key: "unique", icon: Users, label: "Unique visitors", value: d.uniqueVisitors.toLocaleString() } : null,
    d?.totalCheckins != null ? { key: "checkins", icon: MapPinned, label: "Total check-ins", value: d.totalCheckins.toLocaleString() } : null,
    d?.visitedLast60Days != null ? { key: "recent", icon: CalendarCheck2, label: "Visited last 60 days", value: d.visitedLast60Days.toLocaleString() } : null,
  ].filter(Boolean) as { key: string; icon: React.ComponentType<{ className?: string }>; label: string; value: string }[];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">About this place</h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-sm text-foreground"
          >
            <Tag className="size-3 text-muted-foreground" />
            {cat}
          </span>
        ))}
      </div>

      {contactLinks.length > 0 && (
        <div className="mt-5 border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-foreground">Contact</h3>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
            {contactLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                target={link.key === "phone" ? undefined : "_blank"}
                rel={link.key === "phone" ? undefined : "noopener noreferrer"}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary"
              >
                <link.icon className="size-3.5 text-muted-foreground" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {features.length > 0 && (
        <div className="mt-5 border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-foreground">Features</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm text-foreground"
              >
                <CheckCircle2 className="size-3.5 text-muted-foreground" />
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <Stat key={stat.key} icon={stat.icon} label={stat.label} value={stat.value} />
          ))}
        </div>
      )}
    </div>
  );
}
