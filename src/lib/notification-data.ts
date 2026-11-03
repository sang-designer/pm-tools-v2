export type NotificationType = "vote_status" | "new_location" | "product_news";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  read: boolean;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n-1",
    type: "vote_status",
    title: "Your edit was approved",
    body: "Your suggested hours change for McDonald's on Fillmore St was approved.",
    href: "/my-contributions",
    createdAt: hoursAgo(2),
    read: false,
  },
  {
    id: "n-2",
    type: "new_location",
    title: "New places in San Francisco",
    body: "3 new places were added near your selected area this week.",
    href: "/places",
    createdAt: hoursAgo(20),
    read: false,
  },
  {
    id: "n-3",
    type: "product_news",
    title: "Leaderboard season 2 is live",
    body: "Compete for the top spot this month and earn bonus points.",
    href: "/leaderboard",
    createdAt: hoursAgo(30),
    read: false,
  },
  {
    id: "n-4",
    type: "vote_status",
    title: "Your submission was rejected",
    body: "Your proposed new place \"Starbucks Reserve\" needs more details before it can be approved.",
    href: "/my-contributions",
    createdAt: hoursAgo(48),
    read: true,
  },
];

/** Simulates a reviewer resolving a pending submission as approved or rejected. */
export function buildOutcomeNotification(
  name: string,
  href: string
): Omit<AppNotification, "id" | "createdAt" | "read"> {
  const approved = Math.random() > 0.35;
  return approved
    ? {
        type: "vote_status",
        title: "Your submission was approved",
        body: `"${name}" was approved. Thanks for contributing!`,
        href,
      }
    : {
        type: "vote_status",
        title: "Your submission was rejected",
        body: `Your submission for "${name}" needs more details before it can be approved.`,
        href,
      };
}
