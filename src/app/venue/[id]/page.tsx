"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MOCK_VENUES } from "@/lib/mock-data";
import { GlobalNav } from "@/components/global-nav";
import { PhotoGallery, PHOTO_SETS } from "@/components/venue/photo-gallery";
import { VenueInfoCard } from "@/components/venue/venue-info-card";
import { DetailsTable } from "@/components/venue/details-table";
import { CategoriesSection } from "@/components/venue/categories-section";
import { SubvenuesSection } from "@/components/venue/subvenues-section";
import { VenuePhotos } from "@/components/venue/venue-photos";
import { VenueAdmin } from "@/components/venue/venue-admin";
import { SuggestEditDrawer } from "@/components/venue/suggest-edit-drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterDrawer, FilterState } from "@/components/classic/filter-drawer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGame } from "@/lib/game-context";
import { VERACITY_COLORS } from "@/lib/constants";
import {
  Search,
  BookOpen,
  SquarePen,
  Share2,
  History,
  ArrowRight,
  Settings2,
  MapPin,
  ArrowLeft,
  Check,
  Briefcase,
  CalendarDays,
  User,
} from "lucide-react";
import { useState, useRef } from "react";

function CelebrationIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="mx-auto" aria-hidden="true">
      <rect x="47.421" y="138.055" style={{ fill: "#EBEBEC" }} width="417.427" height="365.248" />
      <rect x="47.421" y="138.055" style={{ fill: "#D7D8D9" }} width="26.089" height="365.248" />
      <path style={{ fill: "#CF442B" }} d="M47.421,242.412c19.211,0,34.786-15.574,34.786-34.786H12.636C12.636,226.838,28.209,242.412,47.421,242.412z" />
      <path style={{ fill: "#FDD042" }} d="M116.993,242.412c19.211,0,34.786-15.574,34.786-34.786H82.207C82.207,226.838,97.78,242.412,116.993,242.412z" />
      <path style={{ fill: "#CF442B" }} d="M186.564,242.412c19.211,0,34.786-15.574,34.786-34.786h-69.571C151.778,226.838,167.351,242.412,186.564,242.412z" />
      <path style={{ fill: "#FDD042" }} d="M256.135,242.412c19.211,0,34.786-15.574,34.786-34.786h-69.571C221.349,226.838,236.922,242.412,256.135,242.412z" />
      <path style={{ fill: "#CF442B" }} d="M325.706,242.412c19.211,0,34.786-15.574,34.786-34.786H290.92C290.92,226.838,306.493,242.412,325.706,242.412z" />
      <path style={{ fill: "#FDD042" }} d="M395.277,242.412c19.211,0,34.786-15.574,34.786-34.786h-69.571C360.491,226.838,376.065,242.412,395.277,242.412z" />
      <path style={{ fill: "#CF442B" }} d="M464.848,242.412c19.211,0,34.786-15.574,34.786-34.786h-69.571C430.063,226.838,445.636,242.412,464.848,242.412z" />
      <polygon style={{ fill: "#E5563C" }} points="56.118,7.609 108.296,7.609 82.207,207.626 12.636,207.626" />
      <polygon style={{ fill: "#FDDD85" }} points="108.296,7.609 169.171,7.609 151.778,207.626 82.207,207.626" />
      <polygon style={{ fill: "#E5563C" }} points="169.171,7.609 221.349,7.609 221.349,207.626 151.778,207.626" />
      <rect x="221.345" y="7.609" style={{ fill: "#FDDD85" }} width="69.571" height="200.017" />
      <polygon style={{ fill: "#E5563C" }} points="290.92,7.609 343.099,7.609 360.491,207.626 290.92,207.626" />
      <polygon style={{ fill: "#FDDD85" }} points="343.099,7.609 403.973,7.609 430.063,207.626 360.491,207.626" />
      <polygon style={{ fill: "#E5563C" }} points="403.973,7.609 456.152,7.609 499.634,207.626 430.063,207.626" />
      <rect x="82.203" y="268.501" style={{ fill: "#74757B" }} width="139.142" height="234.803" />
      <rect x="82.203" y="268.501" style={{ fill: "#606268" }} width="26.089" height="234.803" />
      <rect x="273.523" y="268.501" style={{ fill: "#AFF0E8" }} width="139.142" height="104.357" />
      <polygon style={{ fill: "#74DBC9" }} points="387.668,268.501 283.311,372.858 355.056,372.858 412.67,315.244 412.67,268.501" />
      <polygon style={{ fill: "#74DBC9" }} points="273.528,268.501 273.528,334.811 339.838,268.501" />
      <polygon style={{ fill: "#74DBC9" }} points="380.602,372.858 412.67,372.858 412.67,340.79" />
      <circle style={{ fill: "#FDD042" }} cx="177.863" cy="385.902" r="17.393" />
      <path d="M4.484,207.686c0,0.023-0.271,0.046-0.271,0.068c0.062,20.831,14.944,38.211,34.511,42.024v175.259c0,4.504,3.65,8.153,8.153,8.153s8.153-3.649,8.153-8.153V249.779c11.958-2.106,20.619-8.346,26.904-17.024c7.808,10.779,20.623,17.81,34.921,17.81s27.045-7.031,34.854-17.81c7.808,10.779,20.521,17.81,34.819,17.81c14.298,0,26.995-7.031,34.803-17.81c7.808,10.779,20.496,17.81,34.794,17.81c14.298,0,26.982-7.031,34.79-17.81c7.808,10.779,20.49,17.81,34.788,17.81s26.978-7.031,34.787-17.81c7.808,10.779,20.489,17.81,34.786,17.81s26.706-7.031,34.514-17.81c6.285,8.677,15.49,14.919,26.361,17.024v36.117c0,4.504,3.649,8.153,8.153,8.153c4.504,0,8.153-3.649,8.153-8.153v-36.117c20.654-3.812,34.991-21.191,35.054-42.021c0.01-0.625,0.087-1.252-0.047-1.863L464.05,6.149C463.235,2.401,459.987,0,456.152,0H56.118c-3.835,0-7.152,2.401-7.967,6.149L4.669,206.031C4.534,206.615,4.484,207.088,4.484,207.686z M47.421,234.803c-11.843,0-21.905-8.696-25.357-18.48h50.713C69.327,226.106,59.264,234.803,47.421,234.803z M116.993,234.803c-11.843,0-21.905-8.696-25.356-18.48h50.713C138.898,226.106,128.835,234.803,116.993,234.803z M186.564,234.803c-11.843,0-21.905-8.696-25.357-18.48h50.713C208.469,226.106,198.406,234.803,186.564,234.803z M256.135,234.803c-11.843,0-21.905-8.696-25.357-18.48h50.713C278.04,226.106,267.977,234.803,256.135,234.803z M298.53,16.306h37.094l15.974,183.711H298.53V16.306z M325.706,234.803c-11.843,0-21.905-8.696-25.356-18.48h50.713C347.611,226.106,337.548,234.803,325.706,234.803z M395.277,234.803c-11.843,0-21.905-8.696-25.357-18.48h50.713C417.182,226.106,407.119,234.803,395.277,234.803z M464.848,234.803c-11.843,0-21.905-8.696-25.356-18.48h50.713C486.753,226.106,476.691,234.803,464.848,234.803z M449.581,16.306l39.937,183.711h-52.297L413.259,16.306H449.581z M396.815,16.306l23.962,183.711h-52.811L351.991,16.306H396.815z M282.224,200.017h-53.265V16.306h53.265V200.017z M212.653,200.017h-51.982l15.974-183.711h36.007V200.017z M144.304,200.017H91.493l23.962-183.711h44.823L144.304,200.017z M62.688,16.306h36.322L75.048,200.017H22.751L62.688,16.306z" />
      <path d="M412.67,260.892H273.528c-4.504,0-8.696,3.106-8.696,7.609v96.747h-8.696c-4.503,0-8.153,3.649-8.153,8.153c0,4.504,3.65,8.153,8.153,8.153h173.928c4.504,0,8.153-3.649,8.153-8.153c0-4.504-3.649-8.153-8.153-8.153h-9.783v-96.747C420.279,263.997,417.172,260.892,412.67,260.892z M281.137,365.248v-88.051h122.837v88.051H281.137z" />
      <path d="M177.867,360.357c-14.086,0-25.546,11.46-25.546,25.546c0,14.086,11.46,25.546,25.546,25.546c14.086,0,25.546-11.46,25.546-25.546C203.413,371.816,191.953,360.357,177.867,360.357z M177.867,395.142c-5.095,0-9.24-4.145-9.24-9.24c0-5.095,4.145-9.24,9.24-9.24c5.095,0,9.24,4.145,9.24,9.24C187.107,390.997,182.962,395.142,177.867,395.142z" />
      <path d="M499.634,495.694h-27.176V320.675c0-4.504-3.649-8.153-8.153-8.153c-4.504,0-8.153,3.649-8.153,8.153v175.019H228.959V268.501c0-4.504-3.107-7.609-7.609-7.609H82.207c-4.503,0-8.696,3.106-8.696,7.609v227.193h-18.48v-35.872c0-4.504-3.65-8.153-8.153-8.153s-8.153,3.649-8.153,8.153v35.872H12.636c-4.503,0-8.153,3.649-8.153,8.153c0,4.504,3.65,8.153,8.153,8.153h486.998c4.504,0,8.153-3.649,8.153-8.153C507.787,499.344,504.136,495.694,499.634,495.694z M89.816,495.694V277.197h122.837v218.497H89.816z" />
    </svg>
  );
}

function VenueEmptyState({
  venueName,
  onBackToHome,
}: {
  venueName: string;
  onBackToHome: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-10 text-center sm:px-12 sm:py-12">
      <CelebrationIllustration />

      <h2 className="mt-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        No pending tasks for {venueName}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        This place is all set — the community has verified everything. Head back to the map or jump to another spot that needs your help.
      </p>

      <div className="mt-8">
        <Button variant="outline" className="gap-2" onClick={onBackToHome}>
          <ArrowLeft className="size-4" />
          Back to main page
        </Button>
      </div>
    </div>
  );
}

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const venueId = params.id as string;
  const venue = MOCK_VENUES.find((v) => v.id === venueId);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ selected: new Set() });
  const [shareCopied, setShareCopied] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const { getVenueState, completeTask, venueProgress, skippedTasks } = useGame();
  const justSubmittedRef = useRef(false);

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

  const allVenueIds = MOCK_VENUES.map((v) => v.id);
  const currentIndex = allVenueIds.indexOf(venueId);
  const nextId = currentIndex < allVenueIds.length - 1 ? allVenueIds[currentIndex + 1] : allVenueIds[0];

  const venueState = getVenueState(venueId);
  const hasPendingTasks = venue.tasks.length > 0 && venueState !== "completed" && venueState !== "completed_globally";
  const showEmptyState = !hasPendingTasks && !justSubmittedRef.current;
  const venuePhotos = PHOTO_SETS[venueId] || PHOTO_SETS.default;
  const initialTab = searchParams.get("tab") === "admin" ? "admin" : searchParams.get("tab") === "photos" ? "photos" : "reviews";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      <PhotoGallery venueId={venueId} />

      <div className="w-full px-3 py-6 sm:px-10">
        {/* Compact header */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {venue.name}
          </h1>
          {venue.claimed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="inline-flex size-5 items-center justify-center rounded bg-primary/10 text-primary">
                  <Briefcase className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Claimed business</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {venue.veracityRating != null && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="inline-flex items-center">
                  <Badge className={`tabular-nums text-xs px-2 py-0.5 ${VERACITY_COLORS[venue.veracityRating] ?? ""}`}>
                    Veracity: {venue.veracityRating}/5
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>A score from 1 to 5 indicating how truthful a place is, where 1 is least trustworthy and 5 is most trustworthy.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {venue.category} | {venue.address}
        </p>
        {!venue.claimed && (
          <button
            className="mt-1 text-xs font-medium text-primary hover:underline"
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

        {/* Action links row */}
        <div className="mt-4 hidden flex-wrap items-center gap-4 sm:flex">
          <ActionLink icon={<Search className="size-3.5" />} label="Search the Web" onClick={() => {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(venue.name)}`, "_blank");
          }} />
          <ActionLink icon={<BookOpen className="size-3.5" />} label="Best Practices" onClick={() => {
            window.open("https://docs.foursquare.com/data-products/docs/placemaker-best-practices", "_blank");
          }} />
          <ActionLink icon={<SquarePen className="size-3.5" />} label="View/Edit this Place" onClick={() => setEditDrawerOpen(true)} />
          <ActionLink icon={<CalendarDays className="size-3.5" />} label="Manage Events" onClick={() => setEventsOpen(true)} />
          <ActionLink icon={<History className="size-3.5" />} label="Edit History" />
          <ActionLink icon={<Share2 className="size-3.5" />} label="Share this Place" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
          }} />
          {shareCopied && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
              <Check className="size-3.5" />
              Copied
            </span>
          )}
        </div>

        {/* Main content area */}
        <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:gap-10">
          {/* Left: tabbed content */}
          <div className="min-w-0 flex-1">
              <Tabs defaultValue={initialTab}>
                <div className="mb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="min-w-0">
                      <TabsList variant="line" className="w-auto">
                        <TabsTrigger value="reviews" className="px-3 py-2 text-sm font-medium">Details</TabsTrigger>
                        <TabsTrigger value="photos" className="px-3 py-2 text-sm font-medium">Photos ({venuePhotos.length})</TabsTrigger>
                        <TabsTrigger value="admin" className="px-3 py-2 text-sm font-medium">Admin</TabsTrigger>
                      </TabsList>
                    </div>
                    {hasPendingTasks && (
                      <Button
                        variant="outline"
                        className="ml-auto shrink-0 gap-2 border-border text-foreground"
                        onClick={() => setFilterOpen(true)}
                      >
                        <Settings2 className="size-4" />
                        Filter
                        {filters.selected.size > 0 && (
                          <Badge className="ml-1 size-5 justify-center px-0">
                            {filters.selected.size}
                          </Badge>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <TabsContent value="reviews" className="mt-0">
                  {showEmptyState ? (
                    <VenueEmptyState venueName={venue.name} onBackToHome={() => router.push("/")} />
                  ) : (
                    <>
                      <DetailsTable venue={venue} />
                      <div className="mt-6">
                        <CategoriesSection venue={venue} />
                      </div>
                    </>
                  )}
                  <SubvenuesSection venueId={venueId} venueName={venue.name} />
                </TabsContent>
                <TabsContent value="photos" className="mt-0">
                  <VenuePhotos venue={venue} photos={venuePhotos} />
                </TabsContent>
                <TabsContent value="admin" className="mt-0">
                  <VenueAdmin venue={venue} />
                </TabsContent>
              </Tabs>
          </div>

          {/* Right: sidebar */}
          <div className="hidden xl:block">
            <VenueInfoCard venue={venue} />
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background px-3 py-4 sm:px-10">
        <div className="flex items-center justify-end">
          {hasPendingTasks ? (
            <Button
              className="h-12 gap-2 sm:h-10"
              onClick={() => {
                const completedTaskIds = new Set(
                  venueProgress
                    .filter((p) => p.venueId === venueId)
                    .map((p) => p.taskId)
                );
                const handledIds = new Set(Array.from(completedTaskIds).concat(Array.from(skippedTasks)));
                const pending = venue.tasks.filter((t) => !handledIds.has(t.id));
                justSubmittedRef.current = true;
                pending.forEach((t) => completeTask(venueId, t.id));
                toast.success("Submitted! We'll review your changes shortly.");
                if (nextId) {
                  setTimeout(() => router.push(`/venue/${nextId}`), 1200);
                }
              }}
              disabled={!nextId}
            >
              Save
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              className="h-12 gap-2 sm:h-10"
              onClick={() => router.push(`/venue/${nextId}`)}
            >
              <MapPin className="size-4" />
              Explore nearby places
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {/* Filter drawer */}
      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={setFilters}
      />
      <SuggestEditDrawer
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        venue={venue}
      />
      <ManageEventsSheet
        open={eventsOpen}
        onOpenChange={setEventsOpen}
        venueName={venue.name}
      />
    </div>
  );
}

function ActionLink({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface ManageEventsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueName: string;
}

interface VenueEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  timezone: string;
  registrationLink: string;
  about: string;
  createdBy: string;
}

function ManageEventsSheet({ open, onOpenChange, venueName }: ManageEventsSheetProps) {
  const [events, setEvents] = useState<VenueEvent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [registrationLink, setRegistrationLink] = useState("");
  const [about, setAbout] = useState("");

  function populateForm(event: VenueEvent) {
    setEditingId(event.id);
    setEventName(event.name);
    setEventDate(event.date);
    setEventTime(event.time);
    setTimezone(event.timezone);
    setRegistrationLink(event.registrationLink);
    setAbout(event.about);
  }

  function clearForm() {
    setEditingId(null);
    setEventName("");
    setEventDate("");
    setEventTime("");
    setRegistrationLink("");
    setAbout("");
  }

  function handleCreate() {
    if (!eventName.trim()) return;
    const newEvent: VenueEvent = {
      id: `e-${Date.now()}`,
      name: eventName,
      date: eventDate,
      time: eventTime,
      timezone,
      registrationLink,
      about,
      createdBy: "You",
    };
    setEvents([newEvent, ...events]);
    clearForm();
  }

  function handleUpdate() {
    if (!eventName.trim() || !editingId) return;
    setEvents(events.map(e => e.id === editingId ? { ...e, name: eventName, date: eventDate, time: eventTime, timezone, registrationLink, about } : e));
    clearForm();
  }

  function handleRemove() {
    if (!editingId) return;
    setEvents(events.filter(e => e.id !== editingId));
    clearForm();
  }

  const TIMEZONES = [
    { value: "America/Los_Angeles", label: "Los Angeles (GMT-7)" },
    { value: "America/Denver", label: "Denver (GMT-6)" },
    { value: "America/Chicago", label: "Chicago (GMT-5)" },
    { value: "America/New_York", label: "New York (GMT-4)" },
    { value: "Europe/London", label: "London (GMT+1)" },
    { value: "Europe/Paris", label: "Paris (GMT+2)" },
    { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col overflow-hidden">
        <SheetHeader className="shrink-0">
          <SheetTitle className="text-xl">Events</SheetTitle>
        </SheetHeader>

        <div className="mt-6 px-4 space-y-6 flex-1 overflow-y-auto">
          {/* Create/Edit event form */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                {editingId ? "Edit event" : `Create & manage events (${events.length})`}
              </h3>
              {editingId && (
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearForm}>
                  Cancel
                </Button>
              )}
            </div>

            <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Event name</label>
                  <Input
                    placeholder="e.g. Open Mic Night"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Date</label>
                    <Input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Time</label>
                    <Input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Time zone</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Registration link</label>
                  <Input
                    placeholder="https://"
                    value={registrationLink}
                    onChange={(e) => setRegistrationLink(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">About</label>
                  <textarea
                    placeholder="Describe your event..."
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>

                {editingId ? (
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleRemove}
                    >
                      Remove Event
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleUpdate}
                      disabled={!eventName.trim()}
                    >
                      Update Event
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-primary border-primary/30 hover:bg-primary/5"
                    onClick={handleCreate}
                    disabled={!eventName.trim()}
                  >
                    Create Event
                  </Button>
                )}
            </div>
          </div>

          {/* Scheduled Events */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Scheduled Events</h3>
            {events.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <CalendarDays className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium text-foreground">No events scheduled</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use the form above to add your first event for this place.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className={cn("rounded-lg border p-3 transition-colors", editingId === event.id ? "border-primary bg-primary/5" : "border-border")}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{event.name}</p>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => populateForm(event)}>
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {event.date && <span>{new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>}
                      {event.time && <span>{event.time}</span>}
                    </div>
                    <Link href="/my-contributions?tab=history&subtab=events" className="flex items-center gap-1.5 mt-2 group cursor-pointer">
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                        <User className="size-3 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">Created by <span className="font-medium text-foreground group-hover:text-primary transition-colors">{event.createdBy}</span></span>
                    </Link>
                    {event.about && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{event.about}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
