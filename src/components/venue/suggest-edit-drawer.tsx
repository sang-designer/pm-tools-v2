"use client";

import { useState, useCallback, useRef } from "react";
import { X, Copy, Check, Plus, Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { MapPreview } from "@/components/venue/map-preview";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Venue } from "@/lib/types";

interface SuggestEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue;
  osmLinked?: boolean;
}

function parseAddress(address: string) {
  const parts = address.split(",").map((s) => s.trim());
  const street = parts[0] || "";
  const city = parts[1] || "";
  const stateZip = parts[2] || "";
  const [state, ...zipParts] = stateZip.split(" ");
  return { street, city, state: state || "", zip: zipParts.join(" ") || "" };
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const SERVES_OPTIONS = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Dessert",
  "Happy Hour",
  "Bar Snacks",
  "Tasting Menu",
];

const DRINKS_OPTIONS = ["Beer", "Wine", "Full Bar", "Cocktails", "BYO"];

const DINING_OPTIONS = [
  "Table Service",
  "Bar Service",
  "Take-out",
  "Delivery",
  "Drive-thru",
];

const YES_NO_QUESTIONS = [
  "Does this place accept credit cards?",
  "Does this place take reservations?",
  "Is there Wi-Fi?",
  "Does this place have outdoor seating?",
  "Does this place have private rooms?",
  "Does this place have music?",
  "Does this place have parking?",
  "Is this place wheelchair accessible?",
  "Does this place have coat check?",
  "Does this place allow smoking?",
  "Does this place have restrooms?",
  "Does this place have an ATM?",
  "Does this place have TVs?",
];

const PROBLEM_OPTIONS = [
  "Closed",
  "Doesn't exist",
  "Inappropriate",
  "A duplicate",
  "Private/Other",
  "A home",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-xs font-medium text-foreground">{children}</Label>
  );
}

function DetailsSection({ venue }: { venue: Venue }) {
  const addr = parseAddress(venue.address);
  const detail = venue.detail;
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    if (detail?.fsqPlaceId) {
      navigator.clipboard.writeText(detail.fsqPlaceId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm font-medium text-foreground">
        Name, address and location
      </p>

      <div className="space-y-1.5">
        <FieldLabel>FSQ Place ID</FieldLabel>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={detail?.fsqPlaceId || ""}
            className="font-mono text-xs text-muted-foreground"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleCopyId}
            aria-label="Copy Place ID"
          >
            {copiedId ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Place name</FieldLabel>
        <Input defaultValue={venue.name} />
      </div>

      <button className="text-sm text-primary hover:underline">
        Edit names in other languages
      </button>

      <div className="space-y-1.5">
        <FieldLabel>Address</FieldLabel>
        <Input defaultValue={addr.street} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel>Cross Street</FieldLabel>
          <Input placeholder="" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Locality (City)</FieldLabel>
          <Input defaultValue={addr.city} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel>Region (State)</FieldLabel>
          <Input defaultValue={addr.state} />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Postal Code</FieldLabel>
          <Input defaultValue={addr.zip} />
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Edit map location</FieldLabel>
        <MapPreview
          lat={venue.lat}
          lng={venue.lng}
          name={venue.name}
          className="h-48 rounded-md border border-border"
          interactive
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="inside-place" />
        <Label htmlFor="inside-place" className="text-sm">
          This is inside of another place
        </Label>
      </div>

      <Separator />

      <p className="text-sm font-medium text-foreground">
        Contact and other info
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel>Phone</FieldLabel>
          <Input defaultValue={detail?.phone || ""} />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Email Address</FieldLabel>
          <Input type="email" placeholder="" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel>Website</FieldLabel>
          <Input defaultValue={detail?.website || ""} />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Menu Website</FieldLabel>
          <Input placeholder="" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel>Instagram</FieldLabel>
          <Input defaultValue={detail?.instagram || ""} />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Twitter/X</FieldLabel>
          <Input placeholder="" />
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Facebook URL</FieldLabel>
        <Input
          defaultValue={
            detail?.facebook
              ? `https://www.facebook.com/${detail.facebook}`
              : ""
          }
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Description</FieldLabel>
        <Textarea placeholder="" className="min-h-[80px] resize-y" />
      </div>
    </div>
  );
}

function CategoriesSection({ venue }: { venue: Venue }) {
  const categories = venue.detail?.categories || [venue.category];
  const [currentCategories, setCurrentCategories] = useState(
    categories.map((c, i) => ({ name: c, primary: i === 0 }))
  );

  const removeCategory = (index: number) => {
    setCurrentCategories((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <FieldLabel>Category</FieldLabel>
        <Input placeholder="Select or type categories" />
      </div>

      <div className="space-y-2">
        <FieldLabel>Current Categories</FieldLabel>
        {currentCategories.map((cat, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="min-w-0 flex-1 truncate rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              {cat.name}
            </span>
            {cat.primary && (
              <span className="shrink-0 text-sm text-muted-foreground">
                Primary
              </span>
            )}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => removeCategory(i)}
              aria-label={`Remove ${cat.name}`}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChainsSection() {
  return (
    <div className="space-y-1.5">
      <FieldLabel>Chain</FieldLabel>
      <Input placeholder="Search for chain" />
    </div>
  );
}

interface HourEntry {
  day: string;
  hours: string;
}

function HoursSection({ venue }: { venue: Venue }) {
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [hourEntries, setHourEntries] = useState<HourEntry[]>(
    venue.detail?.hours || []
  );

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const removeEntry = (index: number) => {
    setHourEntries((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">Regular Hours</p>

      <div className="flex flex-wrap gap-1.5">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedDays.has(day)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-accent"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel>Open time:</FieldLabel>
          <Input type="time" placeholder="Type time (e.g. 9:00 AM)" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Close time:</FieldLabel>
          <Input type="time" placeholder="Type time (e.g. 5:00 PM)" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="open-247" />
          <Label htmlFor="open-247" className="text-sm">
            Open 24/7
          </Label>
        </div>
        <Button size="sm" className="h-8">
          Add
        </Button>
      </div>

      <button className="text-sm text-primary hover:underline">
        Or you can just copy and paste hours, if you have them.
      </button>

      <div className="space-y-2">
        {hourEntries.map((entry, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {entry.day}
              </p>
              <p className="text-sm text-muted-foreground">{entry.hours}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeEntry(i)}
              aria-label={`Remove ${entry.day} hours`}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm font-medium text-foreground">Seasonal Hours</p>
        <button className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <Plus className="size-3.5" />
          Add Seasonal Hours
        </button>
      </div>
    </div>
  );
}

function AttributesSection() {
  const [serves, setServes] = useState<Set<string>>(
    new Set(["Brunch", "Lunch", "Dinner", "Happy Hour"])
  );
  const [drinks, setDrinks] = useState<Set<string>>(
    new Set(["Beer", "Wine", "Full Bar", "Cocktails"])
  );
  const [dining, setDining] = useState<Set<string>>(new Set(["Delivery"]));
  const [yesNo, setYesNo] = useState<Record<string, boolean | null>>({
    "Does this place accept credit cards?": true,
    "Does this place take reservations?": true,
    "Is there Wi-Fi?": false,
    "Does this place have outdoor seating?": false,
    "Does this place have private rooms?": false,
    "Does this place have music?": false,
    "Does this place have parking?": true,
    "Is this place wheelchair accessible?": true,
    "Does this place have coat check?": false,
    "Does this place allow smoking?": false,
    "Does this place have restrooms?": true,
    "Does this place have an ATM?": false,
    "Does this place have TVs?": false,
  });

  const toggleSet = (
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Serves</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {SERVES_OPTIONS.map((item) => (
            <label key={item} className="flex items-center gap-1.5 text-sm">
              <Checkbox
                checked={serves.has(item)}
                onCheckedChange={() => toggleSet(serves, setServes, item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Drinks</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {DRINKS_OPTIONS.map((item) => (
            <label key={item} className="flex items-center gap-1.5 text-sm">
              <Checkbox
                checked={drinks.has(item)}
                onCheckedChange={() => toggleSet(drinks, setDrinks, item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Dining Options</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {DINING_OPTIONS.map((item) => (
            <label key={item} className="flex items-center gap-1.5 text-sm">
              <Checkbox
                checked={dining.has(item)}
                onCheckedChange={() => toggleSet(dining, setDining, item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {YES_NO_QUESTIONS.map((q) => (
          <div key={q} className="space-y-1.5">
            <p className="text-sm text-foreground">{q}</p>
            <RadioGroup
              value={
                yesNo[q] === true ? "yes" : yesNo[q] === false ? "no" : ""
              }
              onValueChange={(val) =>
                setYesNo((prev) => ({ ...prev, [q]: val === "yes" }))
              }
              className="flex gap-4"
            >
              <label className="flex items-center gap-1.5 text-sm">
                <RadioGroupItem value="yes" />
                Yes
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <RadioGroupItem value="no" />
                No
              </label>
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground">
        Pick an option that best finishes the sentence: This place is...
      </p>
      <RadioGroup
        value={selected ?? ""}
        onValueChange={(val) => setSelected(val)}
      >
        {PROBLEM_OPTIONS.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <RadioGroupItem value={option} />
            {option}
          </label>
        ))}
      </RadioGroup>

      <Textarea
        placeholder="Any Additional comments?"
        className="min-h-[80px] resize-y"
      />
    </div>
  );
}

export function SuggestEditDrawer({
  open,
  onOpenChange,
  venue,
  osmLinked = false,
}: SuggestEditDrawerProps) {
  const [openSections, setOpenSections] = useState<(string | null)[]>(["details"]);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const markDirty = useCallback(() => {
    if (!isDirty) setIsDirty(true);
  }, [isDirty]);

  const handleClose = () => {
    setIsDirty(false);
    setConfirmOpen(false);
    setOpenSections(["details"]);
    onOpenChange(false);
  };

  const submitFoursquareOnly = () => {
    toast.success("Thank you for your help! You might not see your suggested edits right away, but they’re in the queue and we’ll review them shortly.");
    handleClose();
  };

  const submitWithOsm = () => {
    toast.success("Changes applied to OpenStreetMap.");
    handleClose();
  };

  const handleApply = () => {
    if (!isDirty) return;
    if (osmLinked) {
      setConfirmOpen(true);
      return;
    }
    submitFoursquareOnly();
  };

  return (
    <>
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); else onOpenChange(o); }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col p-0 sm:max-w-lg"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-4">
          <SheetTitle className="text-lg font-bold">
            Suggest an Edit
          </SheetTitle>
          <SheetDescription className="sr-only">
            Edit venue details for {venue.name}
          </SheetDescription>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        <div
          ref={formRef}
          className="flex-1 overflow-y-auto"
          onInput={markDirty}
          onClickCapture={(e) => {
            const target = e.target as HTMLElement;
            if (
              target.closest("[data-slot=checkbox]") ||
              target.closest("[data-slot=radio-group-item]") ||
              target.closest("button[aria-label^='Remove']")
            ) {
              markDirty();
            }
          }}
        >
          {osmLinked && (
            <div className="px-5 pt-4">
              <div
                role="status"
                className="flex items-center gap-2 rounded-md border border-blue-900 bg-blue-50 p-2 text-blue-900 shadow-sm dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200"
              >
                <Info className="size-4 shrink-0" />
                <p className="text-xs font-medium leading-4">
                  This place is linked to OpenStreetMap.
                </p>
              </div>
            </div>
          )}
          <Accordion
            multiple
            value={openSections}
            onValueChange={(val) => setOpenSections(val)}
          >
            <AccordionItem value="details" className="border-b px-5">
              <AccordionTrigger className="py-4 text-base font-semibold">
                Details
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <DetailsSection venue={venue} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="categories" className="border-b px-5">
              <AccordionTrigger className="py-4 text-base font-semibold">
                Categories
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <CategoriesSection venue={venue} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="chains" className="border-b px-5">
              <AccordionTrigger className="py-4 text-base font-semibold">
                Chains
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <ChainsSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hours" className="border-b px-5">
              <AccordionTrigger className="py-4 text-base font-semibold">
                Hours
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <HoursSection venue={venue} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="attributes" className="border-b px-5">
              <AccordionTrigger className="py-4 text-base font-semibold">
                Attributes
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <AttributesSection />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem" className="px-5">
              <AccordionTrigger className="py-4 text-base font-semibold">
                Problem with this place?
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <ProblemSection />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <Button size="default" disabled={!isDirty} onClick={handleApply}>Apply</Button>
          <Button
            variant="ghost"
            size="default"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[519px]">
        <DialogHeader className="gap-1.5 px-6 py-4 pr-12">
          <DialogTitle className="text-xl font-semibold leading-7">
            This place is linked to OpenStreetMap
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="px-6 pb-8 text-base text-foreground">
          Do you want to apply your changes to the OpenStreetMap place as well?
        </DialogDescription>
        <DialogFooter className="mx-0 mb-0 gap-6 rounded-none border-0 bg-transparent px-6 pb-6 pt-0 sm:justify-end">
          <Button
            variant="outline"
            className="min-w-20 text-primary"
            onClick={submitFoursquareOnly}
          >
            Don&apos;t Apply
          </Button>
          <Button className="min-w-20" onClick={submitWithOsm}>
            Apply to OpenStreetMap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
