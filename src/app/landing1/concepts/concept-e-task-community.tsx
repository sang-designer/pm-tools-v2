"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IdentityHeaderVariant } from "@/components/landing/identity-header-variant";
import { TaskChoiceCardsVariant } from "@/components/landing/task-choice-cards-variant";
import { LocationIntelligenceCardVariant } from "@/components/landing/location-intelligence-card-variant";
import { useUserStats } from "@/hooks/use-user-stats";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationProvider, useLocationContext } from "@/lib/location-context";

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
  const locationContext = useLocationContext();
  const selectedZone = locationContext?.selectedZone || "San Francisco Bay Area";

  useEffect(() => {
    setShowAll(false);
  }, [selectedZone]);

  const venuesByLocation: Record<string, Array<{ name: string; category: string; status: string; tasksAvailable: number; image: string }>> = {
    "San Francisco Bay Area": [
      { name: "The Daily Grind", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop" },
      { name: "Sunset Yoga Studio", category: "Fitness", status: "Updated", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop" },
      { name: "Verde Mexican Grill", category: "Restaurant", status: "New", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop" },
      { name: "Main Street Books", category: "Bookstore", status: "Needs Review", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { name: "Bay Brew Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop" },
      { name: "FitZone Gym", category: "Fitness", status: "Needs Review", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
      { name: "Sakura Sushi", category: "Restaurant", status: "New", tasksAvailable: 5, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
      { name: "Urban Outfitters", category: "Retail", status: "Updated", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" },
    ],
    "Oakland": [
      { name: "Highwire Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" },
      { name: "Lake Chalet", category: "Restaurant", status: "Updated", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop" },
      { name: "Temescal Alley Barber", category: "Services", status: "Needs Review", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop" },
      { name: "Pizzaiolo", category: "Restaurant", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
      { name: "Mua Oakland", category: "Bar & Lounge", status: "New", tasksAvailable: 5, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop" },
      { name: "Standard & Strange", category: "Retail", status: "Updated", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" },
    ],
    "San Jose": [
      { name: "Chromatic Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop" },
      { name: "San Pedro Square Market", category: "Food Hall", status: "Updated", tasksAvailable: 6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
      { name: "Flames Eatery", category: "Restaurant", status: "Needs Review", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop" },
      { name: "The Gym SJ", category: "Fitness", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
      { name: "Santana Row Books", category: "Bookstore", status: "New", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { name: "Falafel's Drive-In", category: "Restaurant", status: "Updated", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop" },
      { name: "Recycle Bookstore", category: "Bookstore", status: "Needs Review", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=300&fit=crop" },
    ],
    "Los Angeles": [
      { name: "Verve Coffee Roasters", category: "Coffee Shop", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop" },
      { name: "Gjusta", category: "Bakery & Deli", status: "Updated", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop" },
      { name: "Grand Central Market", category: "Food Hall", status: "New", tasksAvailable: 7, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" },
      { name: "Runyon Canyon Trailhead", category: "Recreation", status: "Needs Review", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
      { name: "The Last Bookstore", category: "Bookstore", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=300&fit=crop" },
      { name: "Sugarfish by Sushi Nozawa", category: "Restaurant", status: "Updated", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
      { name: "Barry's Bootcamp WeHo", category: "Fitness", status: "New", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop" },
      { name: "Amoeba Music", category: "Retail", status: "Needs Review", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&h=300&fit=crop" },
    ],
    "Boston": [
      { name: "George Howell Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" },
      { name: "Neptune Oyster", category: "Restaurant", status: "Updated", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
      { name: "Brattle Book Shop", category: "Bookstore", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { name: "Tatte Bakery & Cafe", category: "Bakery", status: "Needs Review", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop" },
      { name: "Charles River Canoe & Kayak", category: "Recreation", status: "New", tasksAvailable: 1, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop" },
      { name: "Row 34", category: "Restaurant", status: "Updated", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop" },
      { name: "Trillium Brewing", category: "Brewery", status: "New", tasksAvailable: 5, image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=300&fit=crop" },
    ],
  };

  const venues = venuesByLocation[selectedZone] || venuesByLocation["San Francisco Bay Area"];

  const visibleVenues = showAll ? venues : venues.slice(0, 4);

  return (
    <motion.div className="space-y-4" variants={fadeUp}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Explore New Venues</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Curate new places in your area
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
          {visibleVenues.map((venue, index) => (
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
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex gap-3 p-3">
                    <motion.div
                      className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="h-full w-full object-cover"
                      />
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
                      
                      <motion.button
                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors group"
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Start Tasks ({venue.tasksAvailable})</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </motion.button>
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
          <CardTitle className="text-lg font-semibold">Your Local Community</CardTitle>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="outline" className="text-[10px] w-fit mt-1">
              {locationStats.homeZone}
            </Badge>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-5">
          {/* Top Contributors */}
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
          </div>

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
          </motion.div>

          <Separator />

          {/* Community Stats */}
          <CommunityStatsToggle weeklyLocationsAdded={locationStats.weeklyStats.locationsAdded} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickActionsCard() {
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  const actions = [
    {
      title: "Resume Last Session",
      description: "Continue where you left off",
      tasks: 3,
      accent: "bg-gradient-to-r from-orange-400 to-amber-400",
    },
    {
      title: "Nearby Quick Tasks",
      description: "8 locations within 1 mile",
      tasks: 8,
      accent: "bg-gradient-to-r from-emerald-400 to-teal-400",
    },
    {
      title: "High Priority Items",
      description: "3 urgent verifications",
      tasks: 3,
      accent: "bg-gradient-to-r from-rose-400 to-pink-400",
    },
    {
      title: "Your Specialties",
      description: "Restaurant data updates",
      tasks: 5,
      accent: "bg-gradient-to-r from-violet-400 to-purple-400",
    },
  ];

  return (
    <motion.div variants={slideInRight}>
      <Card className="border-0 shadow-md bg-gradient-to-br from-white via-slate-50/80 to-gray-100/60 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-800/60 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              className="flex items-center w-full gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/60 group relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              whileHover={{ x: 6, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setClickedAction(action.title);
                setTimeout(() => setClickedAction(null), 600);
              }}
            >
              {clickedAction === action.title && (
                <motion.div
                  className="absolute inset-0 bg-primary/5 rounded-lg"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              <motion.div
                className={`h-2 w-2 rounded-full ${action.accent} shrink-0`}
                animate={clickedAction === action.title ? { scale: [1, 1.8, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium group-hover:text-primary transition-colors">
                  {action.title}
                </div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
              <motion.span
                className="text-xs font-semibold text-muted-foreground tabular-nums shrink-0"
                whileHover={{ scale: 1.1 }}
              >
                {action.tasks} tasks
              </motion.span>
            </motion.button>
          ))}
        </CardContent>
      </Card>
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
              <QuickActionsCard />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
