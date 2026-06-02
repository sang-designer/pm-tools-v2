"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdentityHeaderVariant } from "@/components/landing/identity-header-variant";
import { TaskChoiceCardsVariant } from "@/components/landing/task-choice-cards-variant";
import { LocationIntelligenceCardVariant } from "@/components/landing/location-intelligence-card-variant";
import { useUserStats } from "@/hooks/use-user-stats";
import { MOCK_GLOBAL_LEADERBOARD } from "@/lib/mock-data";
import { ArrowRight, ChevronDown, ChevronUp, Globe, ImageOff, MapPinPlus, ListChecks, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationProvider, useLocationContext } from "@/lib/location-context";
import { InviteModal } from "@/components/invite/invite-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

function ExploreVenuesSection() {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const locationContext = useLocationContext();
  const selectedZone = locationContext?.selectedZone || "San Francisco Bay Area";

  useEffect(() => {
    setShowAll(false);
  }, [selectedZone]);

  const venuesByLocation: Record<string, Array<{ id: string; name: string; category: string; status: string; tasksAvailable: number; image: string }>> = {
    "San Francisco Bay Area": [
      { id: "the-daily-grind", name: "The Daily Grind", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop" },
      { id: "sunset-yoga-studio", name: "Sunset Yoga Studio", category: "Fitness", status: "Updated", tasksAvailable: 2, image: "" },
      { id: "verde-mexican-grill", name: "Verde Mexican Grill", category: "Restaurant", status: "New", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop" },
      { id: "main-street-books", name: "Main Street Books", category: "Bookstore", status: "Needs Review", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { id: "bay-brew-coffee", name: "Bay Brew Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop" },
      { id: "fitzone-gym", name: "FitZone Gym", category: "Fitness", status: "Needs Review", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
      { id: "sakura-sushi", name: "Sakura Sushi", category: "Restaurant", status: "New", tasksAvailable: 5, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
      { id: "urban-outfitters", name: "Urban Outfitters", category: "Retail", status: "Updated", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" },
    ],
    "Oakland": [
      { id: "highwire-coffee", name: "Highwire Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" },
      { id: "lake-chalet", name: "Lake Chalet", category: "Restaurant", status: "Updated", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop" },
      { id: "temescal-alley-barber", name: "Temescal Alley Barber", category: "Services", status: "Needs Review", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop" },
      { id: "pizzaiolo", name: "Pizzaiolo", category: "Restaurant", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
      { id: "mua-oakland", name: "Mua Oakland", category: "Bar & Lounge", status: "New", tasksAvailable: 5, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop" },
      { id: "standard-strange", name: "Standard & Strange", category: "Retail", status: "Updated", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" },
    ],
    "San Jose": [
      { id: "chromatic-coffee", name: "Chromatic Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop" },
      { id: "san-pedro-square-market", name: "San Pedro Square Market", category: "Food Hall", status: "Updated", tasksAvailable: 6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
      { id: "flames-eatery", name: "Flames Eatery", category: "Restaurant", status: "Needs Review", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop" },
      { id: "the-gym-sj", name: "The Gym SJ", category: "Fitness", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
      { id: "santana-row-books", name: "Santana Row Books", category: "Bookstore", status: "New", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { id: "falafels-drive-in", name: "Falafel's Drive-In", category: "Restaurant", status: "Updated", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop" },
      { id: "recycle-bookstore", name: "Recycle Bookstore", category: "Bookstore", status: "Needs Review", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=300&fit=crop" },
    ],
    "Los Angeles": [
      { id: "verve-coffee-roasters", name: "Verve Coffee Roasters", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop" },
      { id: "gjusta", name: "Gjusta", category: "Bakery & Deli", status: "Updated", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop" },
      { id: "grand-central-market", name: "Grand Central Market", category: "Food Hall", status: "New", tasksAvailable: 7, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
      { id: "runyon-canyon-trailhead", name: "Runyon Canyon Trailhead", category: "Recreation", status: "Needs Review", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
      { id: "the-last-bookstore", name: "The Last Bookstore", category: "Bookstore", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=300&fit=crop" },
      { id: "sugarfish-sushi-nozawa", name: "Sugarfish by Sushi Nozawa", category: "Restaurant", status: "Updated", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
      { id: "barrys-bootcamp-weho", name: "Barry's Bootcamp WeHo", category: "Fitness", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
      { id: "amoeba-music", name: "Amoeba Music", category: "Retail", status: "Needs Review", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&h=300&fit=crop" },
    ],
    "Boston": [
      { id: "george-howell-coffee", name: "George Howell Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" },
      { id: "neptune-oyster", name: "Neptune Oyster", category: "Restaurant", status: "Updated", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
      { id: "brattle-book-shop", name: "Brattle Book Shop", category: "Bookstore", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { id: "tatte-bakery-cafe", name: "Tatte Bakery & Cafe", category: "Bakery", status: "Needs Review", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop" },
      { id: "charles-river-canoe-kayak", name: "Charles River Canoe & Kayak", category: "Recreation", status: "New", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop" },
      { id: "row-34", name: "Row 34", category: "Restaurant", status: "Updated", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop" },
      { id: "trillium-brewing", name: "Trillium Brewing", category: "Brewery", status: "New", tasksAvailable: 5, image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=300&fit=crop" },
    ],
  };

  const venues = venuesByLocation[selectedZone] || venuesByLocation["San Francisco Bay Area"];

  const visibleVenues = showAll ? venues : venues.slice(0, 4);

  return (
    <motion.div className="space-y-4" variants={fadeUp}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Contribute to Places</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Help places in your area
          </p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        >
          <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
            {venues.length} nearby
          </Badge>
        </motion.div>
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
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/venue/${venue.id}`)}
                >
                  <div className="flex gap-3 p-3">
                    <motion.div
                      className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {venue.image ? (
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted/80 border border-dashed border-border rounded-lg">
                          <ImageOff className="h-5 w-5 text-muted-foreground/60" />
                        </div>
                      )}
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {venue.name}
                        </h3>
                        <Badge 
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 shrink-0 font-normal"
                        >
                          {venue.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{venue.category}</p>
                      
                      <motion.span
                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors group"
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Start Tasks ({venue.tasksAvailable})</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </motion.span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {venues.length > 4 && (
        <motion.div layout>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setShowAll(!showAll)}
            >
              <motion.span
                key={showAll ? "less" : "more"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {showAll ? "Show Less" : `Show more (${venues.length - 4} more)`}
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function CommunityStatsToggle({ weeklyLocationsAdded }: { weeklyLocationsAdded: number }) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  const stats = {
    weekly: [
      { label: "Active contributors", value: "23" },
      { label: "New members", value: "5" },
      { label: "Places updated", value: String(weeklyLocationsAdded) },
    ],
    monthly: [
      { label: "Active contributors", value: "87" },
      { label: "New members", value: "18" },
      { label: "Places updated", value: "94" },
    ],
  };

  const currentStats = stats[period];

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
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
      <AnimatePresence mode="wait">
        <motion.div
          key={period}
          className="space-y-2.5"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {currentStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="text-sm font-bold text-foreground">{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function YourLocalCommunityCard() {
  const { locationStats: hookLocationStats, userStats, isLoading } = useUserStats();
  const locationContext = useLocationContext();
  const [expanded, setExpanded] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState<string>("local");

  if (isLoading || !hookLocationStats || !userStats) {
    return <Card className="animate-pulse"><CardContent className="p-6 h-96" /></Card>;
  }

  const locationStats = locationContext ? locationContext.locationStats : hookLocationStats;

  const allContributors = locationStats.topContributors;
  const visibleContributors = expanded 
    ? allContributors.slice(0, 15) 
    : allContributors.slice(0, 5);
  const canExpand = allContributors.length > 5;

  const avatarStyles: Array<(name: string) => string> = [
    (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    (name) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,ffdfbf`,
    () => `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face`,
    (name) => `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    () => `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face`,
    (name) => `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    (name) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    () => `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face`,
    (name) => `https://api.dicebear.com/7.x/bottts/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    () => `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face`,
    (name) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}2&backgroundColor=ffdfbf,d1d4f9`,
    (name) => `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}2&backgroundColor=ffd5dc,c0aede`,
    () => `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face`,
    (name) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}2&backgroundColor=d1d4f9,b6e3f4`,
    (name) => `https://api.dicebear.com/7.x/notionists/svg?seed=${name}2&backgroundColor=ffdfbf,ffd5dc`,
  ];

  const getAvatarSrc = (name: string, index: number) => {
    if (userStats && name === userStats.name) return userStats.avatar;
    const styleFn = avatarStyles[index % avatarStyles.length];
    return styleFn(name.replace(/\s+/g, ''));
  };

  const friends = [
    { name: "Jordan Lee", contributions: 38, lastActive: "2h ago" },
    { name: "Priya Patel", contributions: 34, lastActive: "5h ago" },
    { name: "Elena Kim", contributions: 27, lastActive: "1d ago" },
  ];

  const friendAvatarStyles = [
    `https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=PriyaPatel&backgroundColor=ffdfbf,d1d4f9`,
    `https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face`,
  ];

  return (
    <motion.div variants={slideInRight}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
          <Tabs value={leaderboardTab} onValueChange={(val) => setLeaderboardTab(val as string)}>
            <TabsList variant="line" className="w-fit">
              <TabsTrigger value="local" className="px-3 py-1.5 text-sm font-medium">
                Local
              </TabsTrigger>
              <TabsTrigger value="global" className="px-3 py-1.5 text-sm font-medium">
                <Globe className="h-3.5 w-3.5 mr-1" />
                Global
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {leaderboardTab === "local" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="outline" className="text-[10px] w-fit mt-1">
                {locationStats.homeZone}
              </Badge>
            </motion.div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-5">
          {leaderboardTab === "local" ? (
            <>
              {allContributors.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center text-center py-6 px-4 space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <MapPinPlus className="h-7 w-7 text-primary" />
                  </motion.div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold">Be the first contributor!</p>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
                      {locationStats.homeZone} has {locationStats.pendingCount} places waiting to be verified. Start now and claim the #1 spot.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Link href="/tasks">
                      <Button size="sm" variant="secondary" className="w-full">
                        <ListChecks className="h-3.5 w-3.5 mr-1.5" />
                        Start Verifying Places
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setInviteOpen(true)}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                      Invite Friends to Join
                    </Button>
                  </div>
                </motion.div>
              ) : (
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
                        <motion.div
                          className="flex items-center justify-between rounded-lg p-1.5 -mx-1.5 transition-colors"
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.03)", x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-3">
                            <motion.div whileHover={{ scale: 1.15 }} transition={{ type: "spring", stiffness: 400 }}>
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={getAvatarSrc(contributor.name, index)} />
                                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                  {contributor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                            <div>
                              <div className="text-sm font-medium flex items-center gap-2">
                                {contributor.name}
                                {contributor.name === userStats.name && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">You</Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {contributor.contributions} places verified
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {index === 0 && (
                              <motion.svg
                                className="h-4 w-4 text-amber-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                                transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </motion.svg>
                            )}
                            <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {canExpand && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                        className="w-full text-xs text-muted-foreground h-7"
                      >
                        <motion.span
                          key={expanded ? "less" : "more"}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center"
                        >
                          {expanded ? (
                            <>Show less <ChevronUp className="h-3.5 w-3.5 ml-1" /></>
                          ) : (
                            <>See more ({Math.min(allContributors.length, 15) - 5} more) <ChevronDown className="h-3.5 w-3.5 ml-1" /></>
                          )}
                        </motion.span>
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {MOCK_GLOBAL_LEADERBOARD.slice(0, expanded ? 15 : 5).map((contributor, index) => (
                  <motion.div
                    key={contributor.name}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <motion.div
                      className="flex items-center justify-between rounded-lg p-1.5 -mx-1.5 transition-colors"
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.03)", x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div whileHover={{ scale: 1.15 }} transition={{ type: "spring", stiffness: 400 }}>
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={getAvatarSrc(contributor.name, index)} />
                            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                              {contributor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            {contributor.name}
                            {contributor.name === userStats.name && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">You</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contributor.contributions} places verified
                            <span className="ml-1.5 text-[10px] text-muted-foreground/70">• {contributor.region}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {index === 0 && (
                          <motion.svg
                            className="h-4 w-4 text-amber-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </motion.svg>
                        )}
                        <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {MOCK_GLOBAL_LEADERBOARD.length > 5 && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(!expanded)}
                    className="w-full text-xs text-muted-foreground h-7"
                  >
                    <motion.span
                      key={expanded ? "less" : "more"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center"
                    >
                      {expanded ? (
                        <>Show less <ChevronUp className="h-3.5 w-3.5 ml-1" /></>
                      ) : (
                        <>See more ({Math.min(MOCK_GLOBAL_LEADERBOARD.length, 15) - 5} more) <ChevronDown className="h-3.5 w-3.5 ml-1" /></>
                      )}
                    </motion.span>
                  </Button>
                </motion.div>
              )}
            </div>
          )}

          <Separator />

          {/* Friends Contributions */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Friends Activity
            </h3>
            <div className="space-y-2.5">
              {friends.map((friend, index) => (
                <motion.div
                  key={friend.name}
                  className="flex items-center justify-between rounded-md p-1 -mx-1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)", x: 3, transition: { duration: 0.15 } }}
                >
                  <div className="flex items-center gap-2.5">
                    <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={friendAvatarStyles[index]} />
                        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div>
                      <div className="text-xs font-medium">{friend.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {friend.contributions} verified
                      </div>
                    </div>
                  </div>
                  <motion.span
                    className="text-[11px] text-muted-foreground"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {friend.lastActive}
                  </motion.span>
                </motion.div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() => setInviteOpen(true)}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Invite Friends
            </Button>
          </motion.div>

          <Separator />

          {/* Community Stats */}
          <CommunityStatsToggle weeklyLocationsAdded={locationStats.weeklyStats.locationsAdded} />
        </CardContent>
      </Card>
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </motion.div>
  );
}

function QuickLinksCard() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const links = [
    {
      title: "Add New Place",
      icon: MapPinPlus,
      href: "/add-place",
    },
    {
      title: "My Contributions",
      icon: ListChecks,
      href: "/my-contributions",
    },
    {
      title: "Invite Friends",
      icon: UserPlus,
      action: () => setInviteOpen(true),
    },
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
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {link.title}
                </span>
                <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5" />
              </motion.div>
            );

            if (link.href) {
              return (
                <Link key={link.title} href={link.href}>
                  {content}
                </Link>
              );
            }

            return (
              <div key={link.title} onClick={link.action}>
                {content}
              </div>
            );
          })}
        </CardContent>
      </Card>
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </motion.div>
  );
}

export function ConceptETaskCommunity() {
  return (
    <LocationProvider>
      <ConceptEContent />
    </LocationProvider>
  );
}

function ConceptEContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-stone-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeUp}>
            <IdentityHeaderVariant />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp}>
                <TaskChoiceCardsVariant variant="efficiency" />
              </motion.div>
              <ExploreVenuesSection />
              <motion.div variants={fadeIn}>
                <LocationIntelligenceCardVariant variant="community" />
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <YourLocalCommunityCard />
              <QuickLinksCard />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
