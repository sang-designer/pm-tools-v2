export interface ChainVenue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface VenueNameEntry {
  name: string;
  count: number;
  venues: ChainVenue[];
}

export interface ChainCategory {
  name: string;
  count: number;
}

export interface ChainTranslation {
  lang: string;
  name: string;
}

export interface ChainDetail {
  id: string;
  name: string;
  logo: string;
  links: { label: string; url: string }[];
  categories: ChainCategory[];
  translations: ChainTranslation[];
  venueNames: VenueNameEntry[];
}

export const generateVenues = (name: string, count: number): ChainVenue[] => {
  const addresses = [
    { address: "1100 Fillmore St", city: "San Francisco", state: "CA", country: "United States" },
    { address: "2001 Market St", city: "San Francisco", state: "CA", country: "United States" },
    { address: "3600 16th St", city: "San Francisco", state: "CA", country: "United States" },
    { address: "1201 Ocean Ave", city: "San Francisco", state: "CA", country: "United States" },
    { address: "598 Bryant St", city: "San Francisco", state: "CA", country: "United States" },
    { address: "5001 Geary Blvd", city: "San Francisco", state: "CA", country: "United States" },
    { address: "1535 Broadway", city: "New York", state: "NY", country: "United States" },
    { address: "160 W 42nd St", city: "New York", state: "NY", country: "United States" },
    { address: "5101 Wilshire Blvd", city: "Los Angeles", state: "CA", country: "United States" },
    { address: "201 N State St", city: "Chicago", state: "IL", country: "United States" },
    { address: "1-3-2 Shinjuku", city: "Tokyo", state: "Tokyo", country: "Japan" },
    { address: "2-14-5 Shibuya", city: "Tokyo", state: "Tokyo", country: "Japan" },
    { address: "Wangfujing St 138", city: "Beijing", state: "Beijing", country: "China" },
    { address: "Gangnam-daero 156", city: "Seoul", state: "Seoul", country: "South Korea" },
    { address: "King Fahd Rd", city: "Riyadh", state: "Riyadh Province", country: "Saudi Arabia" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const venue = addresses[i % addresses.length];
    return {
      id: `${name}-${i}`,
      name,
      ...venue,
    };
  });
};

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
    { name: "McDonald's", count: 38537, venues: generateVenues("McDonald's", 4) },
    { name: "McDonald's 麦当劳...", count: 2356, venues: generateVenues("McDonald's 麦当劳...", 4) },
    { name: "マクドナルド", count: 2100, venues: generateVenues("マクドナルド", 2) },
    { name: "McDonald's 麦当劳...", count: 467, venues: generateVenues("McDonald's 麦当劳...", 4) },
    { name: "McDonald's...", count: 351, venues: generateVenues("McDonald's...", 4) },
    { name: "McDonald's (ماكدونالدز)...", count: 182, venues: generateVenues("McDonald's (ماكدونالدز)...", 3) },
    { name: "McDonald's & McCafé...", count: 166, venues: generateVenues("McDonald's & McCafé...", 2) },
    { name: "McCafé", count: 142, venues: generateVenues("McCafé", 2) },
    { name: "Mcdonald's", count: 101, venues: generateVenues("Mcdonald's", 4) },
    { name: "McDonald's 麦当劳...", count: 95, venues: generateVenues("McDonald's 麦当劳...", 4) },
    { name: "맥도날드 (McDonald's)...", count: 82, venues: generateVenues("맥도날드 (McDonald's)...", 2) },
    { name: "맥도날드 (McDonald's)...", count: 82, venues: generateVenues("맥도날드 (McDonald's)...", 3) },
    { name: "맥도날드 (McDonald's)...", count: 82, venues: generateVenues("맥도날드 (McDonald's)...", 2) },
    { name: "맥도날드 (McDonald's)...", count: 82, venues: generateVenues("맥도날드 (McDonald's)...", 3) },
    { name: "맥도날드 (McDonald's)...", count: 82, venues: generateVenues("맥도날드 (McDonald's)...", 2) },
  ],
};

export const CHAIN_OVERRIDES: Record<string, Partial<ChainDetail>> = {
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
      { name: "Starbucks", count: 30112, venues: generateVenues("Starbucks", 4) },
      { name: "Starbucks Coffee", count: 2840, venues: generateVenues("Starbucks Coffee", 3) },
      { name: "スターバックス", count: 1902, venues: generateVenues("スターバックス", 2) },
      { name: "Starbucks Reserve", count: 412, venues: generateVenues("Starbucks Reserve", 2) },
    ],
  },
};

export function titleFromId(id: string) {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getChainDetail(chainId: string): ChainDetail {
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
