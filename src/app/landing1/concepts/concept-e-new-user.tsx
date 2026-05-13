"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IdentityHeaderVariant } from "@/components/landing/identity-header-variant";
import { LocationIntelligenceCardVariant } from "@/components/landing/location-intelligence-card-variant";
import { useUserStats } from "@/hooks/use-user-stats";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ImageOff,
  MapPinPlus,
  ListChecks,
  UserPlus,
  Users,
  CheckCircle2,
  Circle,
  Sparkles,
  PartyPopper,
  Map,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationProvider, useLocationContext } from "@/lib/location-context";
import { InviteModal } from "@/components/invite/invite-modal";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function WelcomeOnboardingCard() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    "add-place": false,
    "quick-task": false,
    "invite-friend": false,
  });

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressValue = (completedCount / 3) * 100;

  const steps = [
    {
      id: "add-place",
      title: "Add your first place",
      icon: MapPinPlus,
      href: "/add-place",
    },
    {
      id: "quick-task",
      title: "Complete a quick task",
      icon: Zap,
      href: "/places-daily-tasks",
    },
    {
      id: "invite-friend",
      title: "Invite a friend",
      icon: UserPlus,
      action: () => setInviteOpen(true),
    },
  ];

  return (
    <motion.div variants={fadeUp}>
      <Card className="shadow-lg bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-background border-primary/20 overflow-hidden">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-start gap-3">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
            >
              <Sparkles className="h-6 w-6 text-primary mt-0.5" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Welcome to Placemaker!</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Help improve your local map. Here&apos;s how to get started:
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isDone = completed[step.id];

              const itemContent = (
                <motion.div
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60 group cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (step.action) step.action();
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-foreground shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                  )}
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors flex-1">
                    {step.title}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-foreground transition-all group-hover:translate-x-0.5" />
                </motion.div>
              );

              if (step.href) {
                return (
                  <Link key={step.id} href={step.href}>
                    {itemContent}
                  </Link>
                );
              }

              return <div key={step.id}>{itemContent}</div>;
            })}
          </div>

          {completedCount < 3 ? (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{completedCount} of 3 complete</span>
                <span>Unlock your profile rank</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          ) : (
            <motion.div
              className="space-y-4 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <PartyPopper className="h-5 w-5 text-purple-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">All done! You&apos;re ready to contribute.</p>
                  <p className="text-xs text-muted-foreground">Choose how you&apos;d like to start making an impact:</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/places" className="w-full">
                  <Button className="w-full flex items-center gap-2 justify-center">
                    <Map className="h-4 w-4" />
                    <span>Venue Specific Tasks</span>
                  </Button>
                </Link>
                <Link href="/places-daily-tasks" className="w-full">
                  <Button variant="secondary" className="w-full flex items-center gap-2 justify-center">
                    <Zap className="h-4 w-4" />
                    <span>Daily Quick Tasks</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} onInviteSent={() => setCompleted((prev) => ({ ...prev, "invite-friend": true }))} />
    </motion.div>
  );
}

function ExploreVenuesSectionNewUser() {
  const [showAll, setShowAll] = useState(false);
  const locationContext = useLocationContext();
  const selectedZone = locationContext?.selectedZone || "San Francisco Bay Area";

  useEffect(() => {
    setShowAll(false);
  }, [selectedZone]);

  const venuesByLocation: Record<string, Array<{ name: string; category: string; status: string; tasksAvailable: number; image: string }>> = {
    "San Francisco Bay Area": [
      { name: "The Daily Grind", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop" },
      { name: "Sunset Yoga Studio", category: "Fitness", status: "Updated", tasksAvailable: 2, image: "" },
      { name: "Verde Mexican Grill", category: "Restaurant", status: "New", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop" },
      { name: "Main Street Books", category: "Bookstore", status: "Needs Review", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { name: "Bay Brew Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop" },
      { name: "FitZone Gym", category: "Fitness", status: "Needs Review", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
    ],
    "Oakland": [
      { name: "Highwire Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" },
      { name: "Lake Chalet", category: "Restaurant", status: "Updated", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop" },
      { name: "Temescal Alley Barber", category: "Services", status: "Needs Review", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop" },
      { name: "Pizzaiolo", category: "Restaurant", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
    ],
    "San Jose": [
      { name: "Chromatic Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop" },
      { name: "San Pedro Square Market", category: "Food Hall", status: "Updated", tasksAvailable: 6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
      { name: "Flames Eatery", category: "Restaurant", status: "Needs Review", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop" },
      { name: "The Gym SJ", category: "Fitness", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
    ],
    "Los Angeles": [
      { name: "Verve Coffee Roasters", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop" },
      { name: "Gjusta", category: "Bakery & Deli", status: "Updated", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop" },
      { name: "Grand Central Market", category: "Food Hall", status: "New", tasksAvailable: 7, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
      { name: "The Last Bookstore", category: "Bookstore", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=300&fit=crop" },
    ],
    "Boston": [
      { name: "George Howell Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" },
      { name: "Neptune Oyster", category: "Restaurant", status: "Updated", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
      { name: "Brattle Book Shop", category: "Bookstore", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { name: "Tatte Bakery & Cafe", category: "Bakery", status: "Needs Review", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop" },
    ],
  };

  const venues = venuesByLocation[selectedZone] || venuesByLocation["San Francisco Bay Area"];
  const visibleVenues = showAll ? venues : venues.slice(0, 4);

  return (
    <motion.div className="space-y-4" variants={fadeUp}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Explore New Venues</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Curate new places in your area</p>
        </div>
        <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
          {venues.length} nearby
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence initial={false}>
          {visibleVenues.map((venue) => (
            <motion.div
              key={venue.name}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex gap-3 p-3">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      {venue.image ? (
                        <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted/80 border border-dashed border-border rounded-lg">
                          <ImageOff className="h-5 w-5 text-muted-foreground/60" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm text-foreground truncate">{venue.name}</h3>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 shrink-0 font-normal">{venue.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{venue.category}</p>
                      <motion.a
                        href="/places"
                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors group"
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Start Tasks ({venue.tasksAvailable})</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </motion.a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {venues.length > 4 && (
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : `Show more (${venues.length - 4} more)`}
        </Button>
      )}
    </motion.div>
  );
}

function CommunityStatsToggleNewUser({ weeklyLocationsAdded }: { weeklyLocationsAdded: number }) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  const stats = {
    weekly: [
      { label: "Active contributors", value: "—" },
      { label: "New members", value: "—" },
      { label: "Places updated", value: "—" },
    ],
    monthly: [
      { label: "Active contributors", value: "—" },
      { label: "New members", value: "—" },
      { label: "Places updated", value: "—" },
    ],
  };

  const currentStats = stats[period];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {period === "weekly" ? "This Week" : "This Month"}
        </span>
        <button
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          onClick={() => setPeriod(period === "weekly" ? "monthly" : "weekly")}
        >
          {period === "weekly" ? "View monthly" : "View weekly"}
        </button>
      </div>
      <div className="space-y-2.5">
        {currentStats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="text-sm font-bold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewUserCommunityCard() {
  const { locationStats: hookLocationStats, userStats, isLoading } = useUserStats();
  const locationContext = useLocationContext();
  const [expanded, setExpanded] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  if (isLoading || !hookLocationStats || !userStats) {
    return <Card className="animate-pulse"><CardContent className="p-6 h-96" /></Card>;
  }

  const locationStats = locationContext ? locationContext.locationStats : hookLocationStats;
  const allContributors = locationStats.topContributors;
  const visibleContributors = expanded ? allContributors.slice(0, 10) : allContributors.slice(0, 5);
  const canExpand = allContributors.length > 5;

  const avatarStyles: Array<(name: string) => string> = [
    (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    (name) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,ffdfbf`,
    () => `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face`,
    (name) => `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    () => `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face`,
  ];

  const getAvatarSrc = (name: string, index: number) => {
    if (userStats && name === userStats.name) return userStats.avatar;
    const styleFn = avatarStyles[index % avatarStyles.length];
    return styleFn(name.replace(/\s+/g, ""));
  };

  return (
    <motion.div variants={slideInRight}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Local Leaderboard</CardTitle>
          <Badge variant="outline" className="text-[10px] w-fit mt-1">
            {locationStats.homeZone}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {visibleContributors.map((contributor, index) => (
                <motion.div
                  key={contributor.name}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between rounded-lg p-1.5 -mx-1.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={getAvatarSrc(contributor.name, index)} />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                          {contributor.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">{contributor.contributions} places verified</div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {canExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="w-full text-xs text-muted-foreground h-7"
            >
              {expanded ? (
                <>Show less <ChevronUp className="h-3.5 w-3.5 ml-1" /></>
              ) : (
                <>See more <ChevronDown className="h-3.5 w-3.5 ml-1" /></>
              )}
            </Button>
          )}

          <Separator />

          {/* Empty Friends Activity */}
          <motion.div
            className="flex flex-col items-center py-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Users className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No friends yet</p>
            <p className="text-xs text-muted-foreground/80 mt-0.5">
              Invite friends to see their activity here
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setInviteOpen(true)}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Invite Friends
            </Button>
          </motion.div>

          <Separator />

          <CommunityStatsToggleNewUser weeklyLocationsAdded={locationStats.weeklyStats.locationsAdded} />
        </CardContent>
      </Card>
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </motion.div>
  );
}

function QuickLinksCard() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const links = [
    { title: "Add New Place", icon: MapPinPlus, href: "/add-place" },
    { title: "My Contributions", icon: ListChecks, href: "/my-contributions" },
    { title: "Invite Friends", icon: UserPlus, action: () => setInviteOpen(true) },
  ];

  return (
    <motion.div variants={slideInRight}>
      <Card className="border-0 shadow-md bg-gradient-to-br from-white via-slate-50/80 to-gray-100/60 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-800/60 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {links.map((link, index) => {
            const Icon = link.icon;
            const content = (
              <motion.div
                className="flex items-center w-full gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/60 group cursor-pointer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">{link.title}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5" />
              </motion.div>
            );

            if (link.href) {
              return <Link key={link.title} href={link.href}>{content}</Link>;
            }
            return <div key={link.title} onClick={link.action}>{content}</div>;
          })}
        </CardContent>
      </Card>
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </motion.div>
  );
}

export function ConceptENewUser() {
  return (
    <LocationProvider>
      <ConceptENewUserContent />
    </LocationProvider>
  );
}

function ConceptENewUserContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-stone-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <IdentityHeaderVariant variant="new-user" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-2 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <WelcomeOnboardingCard />
              <ExploreVenuesSectionNewUser />
              <motion.div variants={fadeIn}>
                <LocationIntelligenceCardVariant variant="community" />
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <NewUserCommunityCard />
              <QuickLinksCard />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
