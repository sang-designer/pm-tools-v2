"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { AddPlaceForm, EpwItem } from "@/components/add-place/add-place-form";
import { RecommendedPlacesCard } from "@/components/add-place/recommended-places-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function AddPlacePage() {
  const router = useRouter();
  const [formQuery, setFormQuery] = useState<{ name: string; address: string }>({ name: "", address: "" });
  const [selectedEpw, setSelectedEpw] = useState<EpwItem | null>(null);

  const handleQueryChange = useCallback((query: { name: string; address: string }) => {
    setFormQuery(query);
  }, []);

  const handleEpwSelect = useCallback((epw: EpwItem) => {
    setSelectedEpw(epw);
  }, []);

  const handleEpwApplied = useCallback(() => {
    setSelectedEpw(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Contribute" />
      <main className="flex-1" role="main">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <div className="mb-8 flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="shrink-0"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Add a Place
              </h1>
              <p className="text-sm text-muted-foreground">
                Help us improve the map by adding a new place.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8 xl:flex-row xl:gap-10">
            <div className="min-w-0 flex-1 xl:max-w-[845px]">
              <AddPlaceForm
                onQueryChange={handleQueryChange}
                selectedEpw={selectedEpw}
                onEpwApplied={handleEpwApplied}
              />
            </div>
            <aside className="shrink-0 xl:w-[340px]">
              <div className="sticky top-20 space-y-4">
                <RecommendedPlacesCard
                  query={formQuery}
                  onSelect={handleEpwSelect}
                />
                <Card className="bg-muted/40">
                  <CardContent className="pt-6">
                    <p className="text-sm text-foreground">
                      Make sure you&apos;ve read our{" "}
                      <a
                        href="https://docs.foursquare.com/data-products/docs/placemaker-best-practices"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        Best Practices
                      </a>{" "}
                      before saving your changes.
                    </p>

                    <Separator className="my-4" />

                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                        <span>Always use correct spelling and capitalization. (Not sure about something? Look it up!)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                        <span>Please format addresses according to your city/country/region&apos;s local postal guidelines.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                        <span>If this is a private place (your backyard, your deck, etc) be sure to mark it as such.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                        <span>Provide thorough and correct Information for your listing. The rest of the Foursquare community will thank you!</span>
                      </li>
                    </ul>

                    <p className="mt-4 text-sm text-foreground">
                      Questions?{" "}
                      <a
                        href="https://discord.gg/foursquare"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        Join our Discord community!
                        <ExternalLink className="size-3.5" />
                      </a>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
