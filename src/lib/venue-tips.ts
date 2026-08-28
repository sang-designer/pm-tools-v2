export type TipFlagReason = "spam" | "offensive" | "no_longer_relevant";

export interface VenueTip {
  id: string;
  venueId: string;
  authorName: string;
  avatarSeed: string;
  text: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export const TIP_FLAG_REASONS: { value: TipFlagReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "offensive", label: "Offensive" },
  { value: "no_longer_relevant", label: "No longer relevant" },
];

const MOCK_TIPS: Record<string, VenueTip[]> = {
  v5: [],
  v1: [
    {
      id: "tip-v1-1",
      venueId: "v1",
      authorName: "Maya Chen",
      avatarSeed: "MayaChen",
      text: "Ask for the seasonal pour-over. They keep a small batch off-menu and it is the best drink here.",
      createdAt: "2026-08-20T14:12:00.000Z",
      upvotes: 24,
      downvotes: 1,
    },
    {
      id: "tip-v1-2",
      venueId: "v1",
      authorName: "Jordan Blake",
      avatarSeed: "JordanBlake",
      text: "Parking is easier behind the building on weekday mornings. Street spots fill up by 9.",
      createdAt: "2026-08-18T09:40:00.000Z",
      upvotes: 18,
      downvotes: 2,
    },
    {
      id: "tip-v1-3",
      venueId: "v1",
      authorName: "Priya Nair",
      avatarSeed: "PriyaNair",
      text: "The almond croissant sells out before 11. If you want one, come early or call ahead.",
      createdAt: "2026-08-12T16:05:00.000Z",
      upvotes: 31,
      downvotes: 0,
    },
    {
      id: "tip-v1-4",
      venueId: "v1",
      authorName: "Alex Rivera",
      avatarSeed: "AlexRivera",
      text: "Outdoor tables get shade after 2pm. Great for laptops if you sit on the patio, not the sidewalk.",
      createdAt: "2026-07-29T11:22:00.000Z",
      upvotes: 12,
      downvotes: 3,
    },
    {
      id: "tip-v1-5",
      venueId: "v1",
      authorName: "Sam Okonkwo",
      avatarSeed: "SamOkonkwo",
      text: "Staff will happily split a large drip if you are sharing. Just ask at the register.",
      createdAt: "2026-07-04T08:15:00.000Z",
      upvotes: 9,
      downvotes: 1,
    },
    {
      id: "tip-v1-6",
      venueId: "v1",
      authorName: "Elena Rossi",
      avatarSeed: "ElenaRossi",
      text: "Restrooms are through the back hallway past the pastry case. Code is on the receipt.",
      createdAt: "2026-06-21T19:48:00.000Z",
      upvotes: 15,
      downvotes: 0,
    },
    {
      id: "tip-v1-7",
      venueId: "v1",
      authorName: "Chris Patel",
      avatarSeed: "ChrisPatel",
      text: "They close the kitchen 30 minutes before posted hours. Grab food before then if you are hungry.",
      createdAt: "2026-05-11T13:30:00.000Z",
      upvotes: 7,
      downvotes: 4,
    },
  ],
};

const FALLBACK_TIPS: Omit<VenueTip, "id" | "venueId">[] = [
  {
    authorName: "Riley Park",
    avatarSeed: "RileyPark",
    text: "Weekday lunch is calmer than weekends. Go before noon if you want a table without waiting.",
    createdAt: "2026-08-15T17:00:00.000Z",
    upvotes: 14,
    downvotes: 1,
  },
  {
    authorName: "Nina Alvarez",
    avatarSeed: "NinaAlvarez",
    text: "Ask about daily specials. They often have a limited item that is not on the printed menu.",
    createdAt: "2026-08-02T12:20:00.000Z",
    upvotes: 21,
    downvotes: 0,
  },
  {
    authorName: "Owen Kim",
    avatarSeed: "OwenKim",
    text: "Street parking is limited. The garage one block over is usually the fastest option.",
    createdAt: "2026-07-19T10:05:00.000Z",
    upvotes: 11,
    downvotes: 2,
  },
  {
    authorName: "Taylor Brooks",
    avatarSeed: "TaylorBrooks",
    text: "If you are in a group, call ahead. They can hold a larger table during slower hours.",
    createdAt: "2026-06-08T15:44:00.000Z",
    upvotes: 8,
    downvotes: 1,
  },
  {
    authorName: "Jamie Cole",
    avatarSeed: "JamieCole",
    text: "Bring a jacket for the patio. It gets breezy even on sunny days.",
    createdAt: "2026-05-22T18:10:00.000Z",
    upvotes: 6,
    downvotes: 0,
  },
];

export function getVenueTips(venueId: string): VenueTip[] {
  if (Object.prototype.hasOwnProperty.call(MOCK_TIPS, venueId)) {
    return MOCK_TIPS[venueId];
  }
  return FALLBACK_TIPS.map((tip, index) => ({
    ...tip,
    id: `tip-${venueId}-${index + 1}`,
    venueId,
  }));
}
