"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdentityHeaderVariant } from "@/components/landing/identity-header-variant";
import { PowerUserTasksCard } from "@/components/landing/power-user-tasks-card";
import { LocationIntelligenceCardVariant } from "@/components/landing/location-intelligence-card-variant";
import { ArrowRight, ChevronDown, ChevronUp, MapPinPlus, ListChecks, UserPlus, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { LocationProvider, useLocationContext } from "@/lib/location-context";
import { InviteModal } from "@/components/invite/invite-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

function ContributeToPlacesSection() {
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
      { id: "sakura-sushi", name: "Sakura Sushi", category: "Restaurant", status: "New", tasksAvailable: 5, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
    ],
    "Boston": [
      { id: "george-howell-coffee", name: "George Howell Coffee", category: "Coffee Shop", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" },
      { id: "neptune-oyster", name: "Neptune Oyster", category: "Restaurant", status: "Updated", tasksAvailable: 3, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
      { id: "brattle-book-shop", name: "Brattle Book Shop", category: "Bookstore", status: "New", tasksAvailable: 2, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop" },
      { id: "tatte-bakery-cafe", name: "Tatte Bakery & Cafe", category: "Bakery", status: "Needs Review", tasksAvailable: 4, image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop" },
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
          <p className="text-sm text-muted-foreground mt-0.5">Help places in your area</p>
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
              <Card
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/venue/${venue.id}`)}
              >
                <div className="flex gap-3 p-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
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
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-0.5">
                      <h3 className="font-semibold text-sm text-foreground truncate">{venue.name}</h3>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 shrink-0 font-normal">
                        {venue.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{venue.category}</p>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors group">
                      <span>Start Tasks ({venue.tasksAvailable})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {venues.length > 4 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>Show less <ChevronUp className="h-3.5 w-3.5 ml-1" /></>
          ) : (
            <>Show all ({venues.length}) <ChevronDown className="h-3.5 w-3.5 ml-1" /></>
          )}
        </Button>
      )}
    </motion.div>
  );
}

function LeaderboardCard() {
  const [leaderboardTab, setLeaderboardTab] = useState<"local" | "global">("local");
  const [showAll, setShowAll] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const leaderboardData = [
    { name: "Sam Taylor", verified: 89, avatar: "ST" },
    { name: "Maria Rodriguez", verified: 67, avatar: "MR" },
    { name: "Alex Chen", verified: 45, avatar: "AC", isYou: true },
    { name: "Jordan Lee", verified: 38, avatar: "JL" },
    { name: "Priya Patel", verified: 34, avatar: "PP" },
    { name: "Elena Kim", verified: 27, avatar: "EK" },
    { name: "David Park", verified: 24, avatar: "DP" },
    { name: "Liam Foster", verified: 22, avatar: "LF" },
    { name: "Zara Ahmed", verified: 19, avatar: "ZA" },
    { name: "Noah Kim", verified: 17, avatar: "NK" },
    { name: "Olivia Chen", verified: 15, avatar: "OC" },
    { name: "James Wu", verified: 14, avatar: "JW" },
    { name: "Ava Singh", verified: 12, avatar: "AS" },
    { name: "Ethan Liu", verified: 10, avatar: "EL" },
    { name: "Sophie Green", verified: 9, avatar: "SG" },
  ];

  const friendsActivity = [
    { name: "Jordan Lee", verified: 38, time: "2h ago" },
    { name: "Priya Patel", verified: 34, time: "5h ago" },
    { name: "Elena Kim", verified: 27, time: "1d ago" },
  ];

  const displayedData = showAll ? leaderboardData : leaderboardData.slice(0, 5);

  const communityStats = {
    activeContributors: 23,
    newMembers: 5,
    placesUpdated: 23,
  };

  return (
    <motion.div variants={fadeUp}>
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={leaderboardTab} onValueChange={(v) => setLeaderboardTab(v as "local" | "global")}>
            <TabsList>
              <TabsTrigger value="local" className="text-xs">Local</TabsTrigger>
              <TabsTrigger value="global" className="text-xs">Global</TabsTrigger>
            </TabsList>
          </Tabs>

          <Badge variant="secondary" className="text-xs font-normal">
            San Francisco Bay Area
          </Badge>

          {/* Leaderboard list */}
          <div className="space-y-1">
            {displayedData.map((user, i) => (
              <div key={user.name} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/40 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-[10px] font-medium">{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    {user.isYou && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">You</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{user.verified} places verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {i === 0 && <span className="text-amber-500">★</span>}
                  <span className="text-sm font-semibold text-muted-foreground">#{i + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {leaderboardData.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>Show less <ChevronUp className="h-3 w-3 ml-1" /></>
              ) : (
                <>See more ({leaderboardData.length - 5} more) <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </Button>
          )}

          <Separator />

          {/* Friends Activity */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Friends Activity</p>
            {friendsActivity.map((friend) => (
              <div key={friend.name} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/40 transition-colors">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px]">{friend.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{friend.name}</span>
                  <p className="text-xs text-muted-foreground">{friend.verified} verified</p>
                </div>
                <span className="text-xs text-muted-foreground">{friend.time}</span>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Invite Friends
          </Button>

          <Separator />

          {/* Community stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">This Week</p>
              <button className="text-xs text-primary hover:underline">View monthly</button>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-foreground">Active contributors</span>
              <span className="text-sm font-semibold tabular-nums">{communityStats.activeContributors}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-foreground">New members</span>
              <span className="text-sm font-semibold tabular-nums">{communityStats.newMembers}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-foreground">Places updated</span>
              <span className="text-sm font-semibold tabular-nums">{communityStats.placesUpdated}</span>
            </div>
          </div>

          <Link href="/leaderboard" className="block">
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-7">
              View Full Leaderboard <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </motion.div>
  );
}

function QuickLinksCard() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const links = [
    { icon: MapPinPlus, title: "Add a Place", href: "/add-place" },
    { icon: ListChecks, title: "My Contributions", href: "/my-contributions" },
    { icon: UserPlus, title: "Invite Friends", href: undefined as string | undefined, action: () => setInviteOpen(true) },
  ];

  return (
    <motion.div variants={fadeUp}>
      <Card className="transition-all duration-200 hover:shadow-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {links.map((link) => {
            const content = (
              <div
                key={link.title}
                className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/40 transition-colors cursor-pointer group"
              >
                <link.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {link.title}
                </span>
                <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground group-hover:text-primary transition-all" />
              </div>
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

export function ConceptEPowerUser() {
  return (
    <LocationProvider>
      <PowerUserContent />
    </LocationProvider>
  );
}

function PowerUserContent() {
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
            <IdentityHeaderVariant userId="user-power" />
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
                <PowerUserTasksCard />
              </motion.div>
              <ContributeToPlacesSection />
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
              <LeaderboardCard />
              <QuickLinksCard />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
