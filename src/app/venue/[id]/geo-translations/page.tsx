"use client";

import { useParams, useRouter } from "next/navigation";
import { MOCK_VENUES } from "@/lib/mock-data";
import { GlobalNav } from "@/components/global-nav";
import { GeoTranslations } from "@/components/venue/geo-translations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GeoTranslationsPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.id as string;
  const venue = MOCK_VENUES.find((v) => v.id === venueId);

  if (!venue) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <GlobalNav activeTab="Home" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Venue not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      <div className="mx-auto w-full max-w-[1500px] px-3 py-6 sm:px-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-1.5 text-muted-foreground"
          onClick={() => router.push(`/venue/${venueId}?tab=admin`)}
        >
          <ArrowLeft className="size-4" />
          Back to {venue.name}
        </Button>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Geo Translations for {venue.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {venue.category} | {venue.address}
        </p>

        <div className="mt-4">
          <GeoTranslations venue={venue} />
        </div>
      </div>
    </div>
  );
}
