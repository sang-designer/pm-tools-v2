"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { toast } from "sonner";
import { MapPreview } from "@/components/venue/map-preview";
import {
  Clock,
  Trash2,
  MapPin,
  Search,
  Loader2,
  Upload,
  X,
  ImageIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface EpwItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  countryCode: string;
  zip: string;
}

export const MOCK_EPWS: EpwItem[] = [
  { id: "epw-1", name: "Peet's Coffee & Tea", address: "2 Theater Square", city: "Orinda", state: "CA", countryCode: "US", zip: "94563" },
  { id: "epw-2", name: "Zachary's Chicago Pizza", address: "3110 Crow Canyon Pl", city: "San Ramon", state: "CA", countryCode: "US", zip: "94583" },
  { id: "epw-3", name: "La Boulangerie", address: "1228 Broadway", city: "Oakland", state: "CA", countryCode: "US", zip: "94612" },
  { id: "epw-4", name: "Summit Bank", address: "401 Grand Ave", city: "Oakland", state: "CA", countryCode: "US", zip: "94610" },
  { id: "epw-5", name: "Golden Dragon Restaurant", address: "832 Webster St", city: "Oakland", state: "CA", countryCode: "US", zip: "94607" },
  { id: "epw-6", name: "Peet's Coffee", address: "4050 Piedmont Ave", city: "Oakland", state: "CA", countryCode: "US", zip: "94611" },
  { id: "epw-7", name: "Blue Bottle Coffee", address: "4270 Broadway", city: "Oakland", state: "CA", countryCode: "US", zip: "94611" },
  { id: "epw-8", name: "Trader Joe's", address: "5727 College Ave", city: "Oakland", state: "CA", countryCode: "US", zip: "94618" },
  { id: "epw-9", name: "La Piazza Ristorante", address: "15 Moraga Way", city: "Orinda", state: "CA", countryCode: "US", zip: "94563" },
  { id: "epw-10", name: "Safeway", address: "3496 Mt Diablo Blvd", city: "Lafayette", state: "CA", countryCode: "US", zip: "94549" },
  { id: "epw-11", name: "Blue Bottle Coffee", address: "315 Linden St", city: "San Francisco", state: "CA", countryCode: "US", zip: "94102" },
  { id: "epw-12", name: "Philz Coffee", address: "549 Castro St", city: "San Francisco", state: "CA", countryCode: "US", zip: "94114" },
  { id: "epw-13", name: "Sushi Ran", address: "107 Caledonia St", city: "Sausalito", state: "CA", countryCode: "US", zip: "94965" },
  { id: "epw-14", name: "La Boulange de Walnut Creek", address: "1501 Mt Diablo Blvd", city: "Walnut Creek", state: "CA", countryCode: "US", zip: "94596" },
  { id: "epw-15", name: "Pete's Hardware", address: "2162 Chestnut St", city: "San Francisco", state: "CA", countryCode: "US", zip: "94123" },
];

const CHAINS = [
  { name: "McDonald's", icon: "🍟", color: "bg-red-500" },
  { name: "Nationwide Mutual Insurance Company", icon: "🏢", color: "bg-blue-600" },
  { name: "Metro PCS", icon: "📱", color: "bg-purple-600" },
  { name: "T-Mobile", icon: "📱", color: "bg-pink-500" },
  { name: "Exxon", icon: "⛽", color: "bg-red-600" },
  { name: "Mobil", icon: "⛽", color: "bg-blue-500" },
  { name: "Esso", icon: "⛽", color: "bg-red-500" },
  { name: "RE/MAX", icon: "🏠", color: "bg-red-600" },
  { name: "Starbucks", icon: "☕", color: "bg-green-600" },
  { name: "Subway", icon: "🥪", color: "bg-green-500" },
  { name: "7-Eleven", icon: "🏪", color: "bg-green-600" },
  { name: "Walgreens", icon: "💊", color: "bg-red-500" },
  { name: "CVS Pharmacy", icon: "💊", color: "bg-red-600" },
  { name: "Burger King", icon: "🍔", color: "bg-orange-500" },
  { name: "Wendy's", icon: "🍔", color: "bg-red-500" },
];

const NEARBY_PLACES = [
  { name: "Circle K Car Wash", distance: "564.06mi", address: "471 Nelson Rd, New Lenox, IL", flagged: true },
  { name: "Circle K", distance: "580.72mi", address: "10258 S Kedzie Ave, Evergreen Park, IL", flagged: true },
  { name: "Dormer Harpring LLC", distance: "344.18mi", address: "3457 Ringsby Ct Unit 110, Denver, CO", flagged: false },
  { name: "Continuum 115", distance: "1006.79mi", address: "102 Pullman Ln, Mooresville, NC", flagged: true },
  { name: "Mid Way Coop", distance: "482.31mi", address: "210 Main St, Midway, KS", flagged: false },
  { name: "Westfield Valley Fair", distance: "2.4mi", address: "2855 Stevens Creek Blvd, Santa Clara, CA", flagged: false },
  { name: "Hillsdale Shopping Center", distance: "18.7mi", address: "60 31st Ave, San Mateo, CA", flagged: false },
];

const CATEGORIES = [
  "Arts and Entertainment > Arcade",
  "Arts and Entertainment > Aquarium",
  "Arts and Entertainment > Art Gallery",
  "Arts and Entertainment > Bowling Alley",
  "Arts and Entertainment > Casino",
  "Arts and Entertainment > Movie Theater",
  "Arts and Entertainment > Movie Theater > Drive-in Theater",
  "Arts and Entertainment > Movie Theater > Indie Movie Theater",
  "Arts and Entertainment > Museum",
  "Arts and Entertainment > Museum > Art Museum",
  "Arts and Entertainment > Museum > History Museum",
  "Arts and Entertainment > Performing Arts Venue > Music Venue",
  "Arts and Entertainment > Performing Arts Venue > Theater",
  "Arts and Entertainment > Performing Arts Venue > Concert Hall",
  "Arts and Entertainment > Stadium > Baseball Stadium",
  "Arts and Entertainment > Stadium > Soccer Stadium",
  "Food and Drink > Restaurant > American Restaurant",
  "Food and Drink > Restaurant > Italian Restaurant",
  "Food and Drink > Restaurant > Mexican Restaurant",
  "Food and Drink > Restaurant > Japanese Restaurant",
  "Food and Drink > Restaurant > Chinese Restaurant",
  "Food and Drink > Restaurant > Thai Restaurant",
  "Food and Drink > Restaurant > Pizza Place",
  "Food and Drink > Restaurant > Burger Joint",
  "Food and Drink > Restaurant > Sushi Restaurant",
  "Food and Drink > Coffee Shop",
  "Food and Drink > Coffee Shop > Café",
  "Food and Drink > Bar > Cocktail Bar",
  "Food and Drink > Bar > Sports Bar",
  "Food and Drink > Bar > Wine Bar",
  "Food and Drink > Bar > Brewery",
  "Food and Drink > Bakery",
  "Food and Drink > Ice Cream Shop",
  "Food and Drink > Juice Bar",
  "Food and Drink > Food Truck",
  "Retail > Grocery Store > Supermarket",
  "Retail > Clothing Store > Boutique",
  "Retail > Clothing Store > Thrift Store",
  "Retail > Bookstore",
  "Retail > Electronics Store",
  "Retail > Pharmacy",
  "Retail > Shopping Mall",
  "Health and Fitness > Gym",
  "Health and Fitness > Gym > Yoga Studio",
  "Health and Fitness > Spa",
  "Health and Fitness > Salon > Hair Salon",
  "Health and Fitness > Salon > Barbershop",
  "Health and Fitness > Dentist",
  "Outdoors and Recreation > Park",
  "Outdoors and Recreation > Beach",
  "Outdoors and Recreation > Trail",
  "Outdoors and Recreation > Golf Course",
  "Travel and Transport > Hotel",
  "Travel and Transport > Airport",
  "Travel and Transport > Gas Station",
  "Services > Bank",
  "Services > Post Office",
  "Services > Laundromat",
  "Services > Auto Repair",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const POSTAL_CODE_LOOKUP: Record<string, { region: string; locality: string }> = {
  "10001": { region: "NY", locality: "New York" },
  "10002": { region: "NY", locality: "New York" },
  "10003": { region: "NY", locality: "New York" },
  "90210": { region: "CA", locality: "Beverly Hills" },
  "90001": { region: "CA", locality: "Los Angeles" },
  "94002": { region: "CA", locality: "Belmont" },
  "94010": { region: "CA", locality: "Burlingame" },
  "94014": { region: "CA", locality: "Daly City" },
  "94025": { region: "CA", locality: "Menlo Park" },
  "94040": { region: "CA", locality: "Mountain View" },
  "94041": { region: "CA", locality: "Mountain View" },
  "94043": { region: "CA", locality: "Mountain View" },
  "94061": { region: "CA", locality: "Redwood City" },
  "94063": { region: "CA", locality: "Redwood City" },
  "94065": { region: "CA", locality: "Redwood City" },
  "94086": { region: "CA", locality: "Sunnyvale" },
  "94087": { region: "CA", locality: "Sunnyvale" },
  "94089": { region: "CA", locality: "Sunnyvale" },
  "94102": { region: "CA", locality: "San Francisco" },
  "94103": { region: "CA", locality: "San Francisco" },
  "94104": { region: "CA", locality: "San Francisco" },
  "94105": { region: "CA", locality: "San Francisco" },
  "94107": { region: "CA", locality: "San Francisco" },
  "94108": { region: "CA", locality: "San Francisco" },
  "94109": { region: "CA", locality: "San Francisco" },
  "94110": { region: "CA", locality: "San Francisco" },
  "94111": { region: "CA", locality: "San Francisco" },
  "94112": { region: "CA", locality: "San Francisco" },
  "94114": { region: "CA", locality: "San Francisco" },
  "94115": { region: "CA", locality: "San Francisco" },
  "94116": { region: "CA", locality: "San Francisco" },
  "94117": { region: "CA", locality: "San Francisco" },
  "94118": { region: "CA", locality: "San Francisco" },
  "94121": { region: "CA", locality: "San Francisco" },
  "94122": { region: "CA", locality: "San Francisco" },
  "94123": { region: "CA", locality: "San Francisco" },
  "94124": { region: "CA", locality: "San Francisco" },
  "94127": { region: "CA", locality: "San Francisco" },
  "94131": { region: "CA", locality: "San Francisco" },
  "94132": { region: "CA", locality: "San Francisco" },
  "94133": { region: "CA", locality: "San Francisco" },
  "94134": { region: "CA", locality: "San Francisco" },
  "94301": { region: "CA", locality: "Palo Alto" },
  "94304": { region: "CA", locality: "Palo Alto" },
  "94306": { region: "CA", locality: "Palo Alto" },
  "94401": { region: "CA", locality: "San Mateo" },
  "94402": { region: "CA", locality: "San Mateo" },
  "94403": { region: "CA", locality: "San Mateo" },
  "94501": { region: "CA", locality: "Alameda" },
  "94536": { region: "CA", locality: "Fremont" },
  "94538": { region: "CA", locality: "Fremont" },
  "94539": { region: "CA", locality: "Fremont" },
  "94541": { region: "CA", locality: "Hayward" },
  "94544": { region: "CA", locality: "Hayward" },
  "94546": { region: "CA", locality: "Castro Valley" },
  "94549": { region: "CA", locality: "Lafayette" },
  "94556": { region: "CA", locality: "Moraga" },
  "94563": { region: "CA", locality: "Orinda" },
  "94566": { region: "CA", locality: "Pleasanton" },
  "94568": { region: "CA", locality: "Dublin" },
  "94577": { region: "CA", locality: "San Leandro" },
  "94583": { region: "CA", locality: "San Ramon" },
  "94588": { region: "CA", locality: "Pleasanton" },
  "94595": { region: "CA", locality: "Walnut Creek" },
  "94596": { region: "CA", locality: "Walnut Creek" },
  "94597": { region: "CA", locality: "Walnut Creek" },
  "94598": { region: "CA", locality: "Walnut Creek" },
  "94601": { region: "CA", locality: "Oakland" },
  "94602": { region: "CA", locality: "Oakland" },
  "94605": { region: "CA", locality: "Oakland" },
  "94606": { region: "CA", locality: "Oakland" },
  "94607": { region: "CA", locality: "Oakland" },
  "94608": { region: "CA", locality: "Emeryville" },
  "94609": { region: "CA", locality: "Oakland" },
  "94610": { region: "CA", locality: "Oakland" },
  "94611": { region: "CA", locality: "Oakland" },
  "94612": { region: "CA", locality: "Oakland" },
  "94618": { region: "CA", locality: "Oakland" },
  "94619": { region: "CA", locality: "Oakland" },
  "94621": { region: "CA", locality: "Oakland" },
  "94702": { region: "CA", locality: "Berkeley" },
  "94703": { region: "CA", locality: "Berkeley" },
  "94704": { region: "CA", locality: "Berkeley" },
  "94705": { region: "CA", locality: "Berkeley" },
  "94706": { region: "CA", locality: "Albany" },
  "94707": { region: "CA", locality: "Berkeley" },
  "94708": { region: "CA", locality: "Berkeley" },
  "94709": { region: "CA", locality: "Berkeley" },
  "94710": { region: "CA", locality: "Berkeley" },
  "94720": { region: "CA", locality: "Berkeley" },
  "94801": { region: "CA", locality: "Richmond" },
  "94804": { region: "CA", locality: "Richmond" },
  "94901": { region: "CA", locality: "San Rafael" },
  "94903": { region: "CA", locality: "San Rafael" },
  "94941": { region: "CA", locality: "Mill Valley" },
  "94965": { region: "CA", locality: "Sausalito" },
  "60601": { region: "IL", locality: "Chicago" },
  "60602": { region: "IL", locality: "Chicago" },
  "77001": { region: "TX", locality: "Houston" },
  "75201": { region: "TX", locality: "Dallas" },
  "85001": { region: "AZ", locality: "Phoenix" },
  "19101": { region: "PA", locality: "Philadelphia" },
  "78201": { region: "TX", locality: "San Antonio" },
  "92101": { region: "CA", locality: "San Diego" },
  "95101": { region: "CA", locality: "San Jose" },
  "95113": { region: "CA", locality: "San Jose" },
  "32801": { region: "FL", locality: "Orlando" },
  "33101": { region: "FL", locality: "Miami" },
  "98101": { region: "WA", locality: "Seattle" },
  "80201": { region: "CO", locality: "Denver" },
  "02101": { region: "MA", locality: "Boston" },
  "97201": { region: "OR", locality: "Portland" },
  "37201": { region: "TN", locality: "Nashville" },
  "20001": { region: "DC", locality: "Washington" },
  "30301": { region: "GA", locality: "Atlanta" },
  "89101": { region: "NV", locality: "Las Vegas" },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const ATTRIBUTES = [
  "ATM", "Outdoor seating", "Reservation", "Restroom",
  "Offer delivery", "Credit cards", "Parking", "Wifi",
];

interface HoursEntry {
  id: string;
  days: string[];
  open: string;
  close: string;
  is24h: boolean;
}

function RequiredDot() {
  return <span className="text-destructive">*</span>;
}

function FormField({ label, required, children, className }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required && <RequiredDot />}
      </Label>
      {children}
    </div>
  );
}

function DayToggle({ day, selected, onToggle }: {
  day: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex-1 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all duration-150",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
      )}
    >
      {day}
    </button>
  );
}

function TimeInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const timeInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) node.style.setProperty("visibility", "hidden", "important");
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="text"
        placeholder={placeholder ?? "e.g., 9:30am, 930pm"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <div className="relative shrink-0">
        <input
          ref={timeInputRef}
          type="time"
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          onChange={(e) => {
            if (!e.target.value) return;
            const [h, m] = e.target.value.split(":").map(Number);
            const suffix = h >= 12 ? "pm" : "am";
            const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
            onChange(`${h12}:${m.toString().padStart(2, "0")}${suffix}`);
          }}
        />
        <Button type="button" variant="outline" size="sm" className="pointer-events-none gap-1.5 text-muted-foreground">
          Select time
          <Clock className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function AddedHoursEntry({ entry, onRemove }: { entry: HoursEntry; onRemove: () => void }) {
  const dayLabel = entry.days.length === 7 ? "Every day" : entry.days.join(", ");
  const timeLabel = entry.is24h ? "Open 24 hours" : `${entry.open || "?"} – ${entry.close || "?"}`;

  return (
    <div className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-sm">
        <span className="font-medium text-foreground">{dayLabel}</span>
        <span className="mx-2 text-muted-foreground">·</span>
        <span className="text-muted-foreground">{timeLabel}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        className="text-muted-foreground opacity-100 hover:text-destructive sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

interface AddPlaceFormProps {
  onQueryChange?: (query: { name: string; address: string }) => void;
  selectedEpw?: EpwItem | null;
  onEpwApplied?: () => void;
}

export function AddPlaceForm({ onQueryChange, selectedEpw, onEpwApplied }: AddPlaceFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [crossStreet, setCrossStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [postalLookupStatus, setPostalLookupStatus] = useState<"idle" | "loading" | "found" | "not_found">("idle");

  const [isChain, setIsChain] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const [chainQuery, setChainQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [draftDays, setDraftDays] = useState<string[]>([]);
  const [draftOpen, setDraftOpen] = useState("");
  const [draftClose, setDraftClose] = useState("");
  const [draftIs24h, setDraftIs24h] = useState(false);
  const [hoursPaste, setHoursPaste] = useState("");
  const [showPaste, setShowPaste] = useState(false);

  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [pinLat, setPinLat] = useState(37.7749);
  const [pinLng, setPinLng] = useState(-122.4194);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const [photoSectionOpen, setPhotoSectionOpen] = useState(true);

  const handlePhotoSelect = useCallback((file: File) => {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoProcessing(true);
    setTimeout(() => {
      setPhotoProcessing(false);
    }, 2000);
  }, []);

  const handlePhotoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handlePhotoSelect(file);
    }
  }, [handlePhotoSelect]);

  const handlePhotoInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoSelect(file);
    }
  }, [handlePhotoSelect]);

  const clearPhoto = useCallback(() => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoProcessing(false);
  }, []);

  useEffect(() => {
    onQueryChange?.({ name, address });
  }, [name, address, onQueryChange]);

  useEffect(() => {
    if (!selectedEpw) return;
    setName(selectedEpw.name);
    setAddress(selectedEpw.address);
    setCity(selectedEpw.city);
    setState(selectedEpw.state);
    setPostalCode(selectedEpw.zip);
    setCountry(selectedEpw.countryCode === "US" ? "United States" : selectedEpw.countryCode);
    setPostalLookupStatus("found");
    toast.success("EPW applied", { description: `Filled fields from "${selectedEpw.name}"` });
    onEpwApplied?.();
  }, [selectedEpw, onEpwApplied]);

  const canAddHours = draftDays.length > 0 && (draftIs24h || (draftOpen.trim() !== "" && draftClose.trim() !== ""));

  const addHoursEntry = useCallback(() => {
    if (draftDays.length === 0) return;
    if (!draftIs24h && (!draftOpen.trim() || !draftClose.trim())) return;
    setHours((prev) => [
      ...prev,
      { id: crypto.randomUUID(), days: [...draftDays], open: draftIs24h ? "" : draftOpen, close: draftIs24h ? "" : draftClose, is24h: draftIs24h },
    ]);
    setDraftDays([]);
    setDraftOpen("");
    setDraftClose("");
    setDraftIs24h(false);
  }, [draftDays, draftOpen, draftClose, draftIs24h]);

  const removeHoursEntry = useCallback((id: string) => {
    setHours((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const handlePostalCodeChange = useCallback((value: string) => {
    setPostalCode(value);
    setPostalLookupStatus("idle");

    const trimmed = value.trim();
    if (trimmed.length >= 5) {
      setPostalLookupStatus("loading");
      setTimeout(() => {
        const result = POSTAL_CODE_LOOKUP[trimmed];
        if (result) {
          setState(result.region);
          setCity(result.locality);
          setPostalLookupStatus("found");
        } else {
          setPostalLookupStatus("not_found");
        }
      }, 400);
    }
  }, []);

  const toggleAttribute = useCallback((attr: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  }, []);

  const isValid = name.trim() && categories.length > 0 && address.trim() && city.trim() && postalCode.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Place submitted successfully!", {
      description: `"${name}" has been added for review.`,
    });
    setSubmitting(false);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Details */}
      <Card>
        <CardContent className="space-y-5 pt-6">
          {/* Quick Start with Photo */}
          <div className="rounded-lg border border-dashed border-border p-4">
            <button
              type="button"
              onClick={() => setPhotoSectionOpen(!photoSectionOpen)}
              className="flex w-full items-start gap-3 text-left"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Upload className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Quick Start with Photo
                  <span className="ml-2 text-xs font-normal text-muted-foreground">(Optional)</span>
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Upload a photo of the storefront, menu, or receipt to auto-fill venue name, category, address, and phone.
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                  photoSectionOpen && "rotate-180"
                )}
              />
            </button>

            {photoSectionOpen && (
              <div className="mt-3">
              {!photoFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handlePhotoDrop}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-6 transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  <Upload className="mb-2 size-6 text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop an image here, or
                  </p>
                  <label className="mt-3 cursor-pointer">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent">
                      + Choose Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoInput}
                      className="sr-only"
                    />
                  </label>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="flex items-center gap-4 p-4">
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Uploaded preview"
                        className="size-20 shrink-0 rounded-md border border-border object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
                        <p className="truncate text-sm font-medium text-foreground">
                          {photoFile.name}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {(photoFile.size / 1024).toFixed(0)} KB
                      </p>
                      {photoProcessing ? (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-xs text-primary">Analyzing image...</span>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-green-800">
                          Ready — fill in the details below or let suggestions guide you
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">Details</h3>
          </div>

          <FormField label="Place name" required>
            <Input
              placeholder="e.g. Blue Bottle Coffee"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </FormField>

          <FormField label="Category" required>
            <Combobox
              items={CATEGORIES}
              multiple
              value={categories}
              onValueChange={(val) => {
                if (val.length <= 3) setCategories(val);
              }}
            >
              <ComboboxTrigger
                render={
                  <button
                    type="button"
                    className="flex min-h-9 w-full items-start rounded-md border border-input bg-transparent px-2 py-1.5 text-sm shadow-xs hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                }
              >
                <span className="flex flex-1 flex-wrap items-center gap-1.5">
                  {categories.length === 0 ? (
                    <span className="text-muted-foreground px-1">Search categories...</span>
                  ) : (
                    categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="gap-1 pr-1 shrink-0">
                        <span className="truncate max-w-[180px]">{cat.split(" > ").pop()}</span>
                        <span
                          role="button"
                          className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategories((prev) => prev.filter((c) => c !== cat));
                          }}
                          aria-label={`Remove ${cat}`}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </Badge>
                    ))
                  )}
                </span>
              </ComboboxTrigger>
              <ComboboxContent className="p-2">
                <ComboboxInput showTrigger={false} placeholder="Search..." className="mb-2" />
                {categories.length >= 3 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 px-2 py-1.5 mb-1 rounded bg-amber-50 dark:bg-amber-950/30">
                    Maximum of 3 categories reached. Remove one to add another.
                  </p>
                )}
                <ComboboxEmpty>No categories found.</ComboboxEmpty>
                <ComboboxList className="max-h-[320px]">
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </FormField>

          <FormField label="Country" required>
            <Select value={country} onValueChange={(v) => setCountry(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
                <SelectItem value="Mexico">Mexico</SelectItem>
                <SelectItem value="Brazil">Brazil</SelectItem>
                <SelectItem value="India">India</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Postal Code" required>
              <div className="relative">
                <Input
                  placeholder="Zip / Postal code"
                  value={postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                />
                {postalLookupStatus === "loading" && (
                  <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>
              {postalLookupStatus === "found" && (
                <p className="text-xs text-green-800" role="status">Region and locality populated from postal code</p>
              )}
              {postalLookupStatus === "not_found" && (
                <p className="text-xs text-muted-foreground" role="status">Postal code not recognized — enter region and locality manually</p>
              )}
            </FormField>
            <FormField label="Region (State)">
              <Select value={state} onValueChange={(v) => setState(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Locality (City)" required>
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Address" required>
            <Input
              placeholder="Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormField>

          <FormField label="Cross Street">
            <Input
              placeholder="Nearest cross street"
              value={crossStreet}
              onChange={(e) => setCrossStreet(e.target.value)}
            />
          </FormField>

          <div className="space-y-2">
            <Label>
              Edit map location<RequiredDot />
            </Label>
            {address.trim() ? (
              <>
                <MapPreview
                  lat={pinLat}
                  lng={pinLng}
                  className="h-64 w-full rounded-lg border border-border"
                  onLocationChange={(lat, lng) => {
                    setPinLat(lat);
                    setPinLng(lng);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Click to place a pin and update the place&apos;s location on the map
                </p>
              </>
            ) : (
              <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/50">
                {/* Stylized placeholder map grid */}
                <svg className="absolute inset-0 size-full" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                  <rect width="600" height="300" className="fill-muted/30" />
                  {/* Horizontal roads */}
                  <rect x="0" y="70" width="600" height="28" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="0" y="170" width="600" height="28" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="0" y="240" width="600" height="22" rx="2" className="fill-muted-foreground/[0.06]" />
                  {/* Vertical roads */}
                  <rect x="80" y="0" width="28" height="300" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="220" y="0" width="28" height="300" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="380" y="0" width="28" height="300" rx="2" className="fill-muted-foreground/[0.06]" />
                  <rect x="500" y="0" width="28" height="300" rx="2" className="fill-muted-foreground/[0.06]" />
                  {/* Diagonal road */}
                  <rect x="280" y="-40" width="32" height="420" rx="2" className="fill-muted-foreground/[0.06]" transform="rotate(30 296 170)" />
                  {/* Blocks */}
                  <rect x="115" y="14" width="98" height="48" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="115" y="105" width="98" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="255" y="105" width="118" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="415" y="14" width="78" height="48" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="415" y="105" width="78" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="535" y="105" width="65" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="115" y="205" width="98" height="28" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="415" y="205" width="78" height="28" rx="6" className="fill-muted-foreground/[0.04]" />
                  <rect x="0" y="105" width="73" height="58" rx="6" className="fill-muted-foreground/[0.04]" />
                </svg>

                {/* Blue pin */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 -mt-4 drop-shadow-lg">
                  <path d="M4.50001 9.25072L4.50001 9.25061C4.50251 7.19579 5.31989 5.22584 6.77287 3.77286C8.2257 2.32002 10.1954 1.50266 12.25 1.5C14.3046 1.50266 16.2743 2.32002 17.7271 3.77286C19.1801 5.22584 19.9975 7.19579 20 9.25061V9.25074C20.0025 10.928 19.4547 12.5597 18.4406 13.8956L18.4269 13.9136L18.4261 13.9151L18.4045 13.9433L18.324 14.0486C18.294 14.0879 18.2633 14.1279 18.2382 14.1603L18.2065 14.2011C18.1997 14.2097 18.1963 14.214 18.1952 14.2154C18.1947 14.2159 18.1947 14.216 18.1951 14.2155L12.25 21.2269L6.30573 14.2166C6.30623 14.2172 6.30619 14.2171 6.30548 14.2162C6.3042 14.2147 6.30078 14.2104 6.29448 14.2024L6.26251 14.1614C6.23719 14.1288 6.20635 14.0886 6.17618 14.0492L6.09558 13.9438L6.0698 13.9099L6.06269 13.9006L6.06084 13.8981L6.06046 13.8977C5.04577 12.5612 4.49758 10.9287 4.50001 9.25072Z" fill="#2932C9" stroke="white" />
                  <circle cx="12.2012" cy="9.5" r="3" fill="white" />
                </svg>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className={cn(
              "rounded-lg border transition-colors",
              isPrivate ? "border-border/50 opacity-50" : "border-border",
              isChain && !isPrivate && "border-primary/40 bg-primary/[0.02]",
            )}>
              <label className={cn(
                "flex items-center gap-3 p-3",
                isPrivate ? "cursor-not-allowed" : "cursor-pointer",
              )}>
                <Checkbox
                  checked={isChain}
                  onCheckedChange={(v) => {
                    setIsChain(!!v);
                    if (!v) { setChainQuery(""); setSelectedChain(null); }
                  }}
                  disabled={isPrivate}
                />
                <div>
                  <p className="text-sm font-medium">This place is part of a chain</p>
                  <p className="text-xs text-muted-foreground">e.g. Starbucks, McDonald&apos;s</p>
                </div>
              </label>
              {isChain && !isPrivate && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  {selectedChain ? (
                    <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <span className={cn("flex size-7 items-center justify-center rounded text-sm text-white", CHAINS.find((c) => c.name === selectedChain)?.color ?? "bg-muted")}>
                          {CHAINS.find((c) => c.name === selectedChain)?.icon ?? "🏢"}
                        </span>
                        <span className="text-sm font-medium text-foreground">{selectedChain}</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => { setSelectedChain(null); setChainQuery(""); }}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <Input
                          placeholder="Search for chain"
                          value={chainQuery}
                          onChange={(e) => setChainQuery(e.target.value)}
                          className="pr-9"
                          autoFocus
                        />
                        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <div className="mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-background">
                        {CHAINS.filter((c) =>
                          c.name.toLowerCase().includes(chainQuery.toLowerCase())
                        ).map((chain) => (
                          <button
                            key={chain.name}
                            type="button"
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
                            onClick={() => { setSelectedChain(chain.name); setChainQuery(""); }}
                          >
                            <span className={cn("flex size-7 items-center justify-center rounded text-sm text-white", chain.color)}>
                              {chain.icon}
                            </span>
                            {chain.name}
                          </button>
                        ))}
                        {CHAINS.filter((c) => c.name.toLowerCase().includes(chainQuery.toLowerCase())).length === 0 && (
                          <p className="px-3 py-3 text-sm text-muted-foreground">No chains found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={cn(
              "rounded-lg border transition-colors",
              isPrivate ? "border-border/50 opacity-50" : "border-border",
              isInside && !isPrivate && "border-primary/40 bg-primary/[0.02]",
            )}>
              <label className={cn(
                "flex items-center gap-3 p-3",
                isPrivate ? "cursor-not-allowed" : "cursor-pointer",
              )}>
                <Checkbox
                  checked={isInside}
                  onCheckedChange={(v) => {
                    setIsInside(!!v);
                    if (!v) { setPlaceQuery(""); setSelectedPlace(null); }
                  }}
                  disabled={isPrivate}
                />
                <div>
                  <p className="text-sm font-medium">This is inside of another place</p>
                  <p className="text-xs text-muted-foreground">e.g. a food court stall inside a mall</p>
                </div>
              </label>
              {isInside && !isPrivate && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  {selectedPlace ? (
                    <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{selectedPlace}</span>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => { setSelectedPlace(null); setPlaceQuery(""); }}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Type something to search for a place..."
                          value={placeQuery}
                          onChange={(e) => setPlaceQuery(e.target.value)}
                          className="pl-9"
                          autoFocus
                        />
                      </div>
                      <div className="mt-1 max-h-72 overflow-y-auto rounded-md border border-border bg-background">
                        {NEARBY_PLACES.filter((p) =>
                          p.name.toLowerCase().includes(placeQuery.toLowerCase()) ||
                          p.address.toLowerCase().includes(placeQuery.toLowerCase())
                        ).map((place) => (
                          <button
                            key={place.name}
                            type="button"
                            className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                            onClick={() => { setSelectedPlace(place.name); setPlaceQuery(""); }}
                          >
                            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-foreground">{place.name}</span>
                                {place.flagged && <span className="size-2 rounded-full bg-red-800" />}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {place.distance} &middot; {place.address}
                              </p>
                            </div>
                          </button>
                        ))}
                        {NEARBY_PLACES.filter((p) =>
                          p.name.toLowerCase().includes(placeQuery.toLowerCase()) ||
                          p.address.toLowerCase().includes(placeQuery.toLowerCase())
                        ).length === 0 && (
                          <p className="px-3 py-3 text-sm text-muted-foreground">No places found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <label className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50",
              isPrivate && "border-primary/40 bg-primary/[0.02]",
            )}>
              <Checkbox
                checked={isPrivate}
                onCheckedChange={(v) => {
                  const next = !!v;
                  setIsPrivate(next);
                  if (next) {
                    setIsChain(false);
                    setChainQuery("");
                    setSelectedChain(null);
                    setIsInside(false);
                    setPlaceQuery("");
                    setSelectedPlace(null);
                  }
                }}
              />
              <div>
                <p className="text-sm font-medium">This is a private place</p>
                <p className="text-xs text-muted-foreground">Not open to the general public</p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Phone">
              <Input placeholder="(415) 555-1234" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormField>
            <FormField label="Website">
              <Input placeholder="https://example.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </FormField>
            <FormField label="Email address">
              <Input type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
            <FormField label="Facebook URL">
              <Input placeholder="facebook.com/yourpage" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            </FormField>
            <FormField label="Instagram">
              <Input placeholder="@handle" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            </FormField>
            <FormField label="Twitter/X">
              <Input placeholder="@handle" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="size-5 text-primary" />
            Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Day toggles */}
          <div className="flex gap-1.5">
            {DAYS.map((day) => (
              <DayToggle
                key={day}
                day={day}
                selected={draftDays.includes(day)}
                onToggle={() =>
                  setDraftDays((prev) =>
                    prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                  )
                }
              />
            ))}
          </div>

          {/* Time inputs */}
          {!draftIs24h && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Open time:">
                <TimeInput
                  value={draftOpen}
                  onChange={setDraftOpen}
                  placeholder="Type time (e.g., 9:30am, 930pm) or"
                />
              </FormField>
              <FormField label="Close time:">
                <TimeInput
                  value={draftClose}
                  onChange={setDraftClose}
                  placeholder="Type time (e.g., 9:30am, 930pm) or"
                />
              </FormField>
            </div>
          )}

          {/* 24/7 + Add */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={draftIs24h}
                onCheckedChange={(v) => setDraftIs24h(!!v)}
              />
              Open 24/7
            </label>
            <Button
              type="button"
              variant="secondary"
              disabled={!canAddHours}
              onClick={addHoursEntry}
            >
              Add
            </Button>
          </div>

          {/* Added entries */}
          {hours.length > 0 && (
            <div className="space-y-2">
              {hours.map((entry) => (
                <AddedHoursEntry
                  key={entry.id}
                  entry={entry}
                  onRemove={() => removeHoursEntry(entry.id)}
                />
              ))}
            </div>
          )}

          <Separator />

          {/* Paste hours */}
          {showPaste ? (
            <div className="space-y-3">
              <textarea
                className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                placeholder={"Paste hours here, e.g.:\nMon-Fri 9:00am - 5:00pm\nSat 10:00am - 3:00pm\nSun Closed"}
                value={hoursPaste}
                onChange={(e) => setHoursPaste(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowPaste(false); setHoursPaste(""); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPaste(true)}
              className="w-full text-center text-sm italic text-primary hover:underline"
            >
              Or you can just copy and paste hours, if you have them.
            </button>
          )}
        </CardContent>
      </Card>

      {/* Attributes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ATTRIBUTES.map((attr) => {
              const selected = selectedAttributes.includes(attr);
              return (
                <button
                  key={attr}
                  type="button"
                  onClick={() => toggleAttribute(attr)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all duration-150",
                    selected
                      ? "border-primary bg-primary/5 font-medium text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40"
                  )}>
                    {selected && (
                      <svg className="size-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  {attr}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 -mx-4 flex items-center gap-3 border-t border-border bg-background px-4 py-4 sm:static sm:mx-0 sm:border-t-0 sm:px-0 sm:pb-8 sm:pt-0">
        <Button
          type="submit"
          disabled={!isValid || submitting}
          className="h-12 gap-2 px-6 sm:h-10"
        >
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting…
            </>
          ) : (
            "Submit"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 sm:h-10"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
