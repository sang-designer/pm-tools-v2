"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef, forwardRef } from "react";
import {
  HelpCircle,
  FileText,
  User,
  ChevronDown,
  LayoutGrid,
  Moon,
  Sun,
  List,
  Map,
  Menu,
  Plus,
  Trophy,
  UserPlus,
  ArrowRight,
  ExternalLink,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface GlobalNavProps {
  activeTab?: string;
  mode?: string;
  onModeSwitch?: (v: string) => void;
  onOpenLeaderboard?: () => void;
  onOpenInvite?: () => void;
}

export function GlobalNav({ activeTab = "Home", mode, onModeSwitch, onOpenLeaderboard, onOpenInvite }: GlobalNavProps) {
  const tabs = ["Home", "Places", "Contribute"];
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const contributeRef = useRef<HTMLDivElement>(null);
  const placesRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!contributeOpen && !placesOpen) return;
    function handleClick(e: MouseEvent) {
      if (contributeOpen && contributeRef.current && !contributeRef.current.contains(e.target as Node)) {
        setContributeOpen(false);
      }
      if (placesOpen && placesRef.current && !placesRef.current.contains(e.target as Node)) {
        setPlacesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [contributeOpen, placesOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4 sm:h-16 sm:px-8 lg:px-12"
        role="banner"
      >
        {mode && onModeSwitch && (
          <div className="absolute left-1/2 top-full z-40 hidden -translate-x-1/2 pt-3 sm:block">
            <Tabs value={mode} onValueChange={onModeSwitch}>
              <TabsList
                className="grid w-[280px] grid-cols-2 shadow-lg backdrop-blur-sm sm:w-[340px]"
                role="tablist"
                aria-label="View mode"
              >
                <TabsTrigger value="classic" className="gap-2" aria-label="High Impact Tasks mode">
                  <List className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">High Impact Tasks</span>
                  <span className="sm:hidden">High Impact</span>
                </TabsTrigger>
                <TabsTrigger value="quest" className="gap-2" aria-label="My World mode">
                  <Map className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">My World</span>
                  <span className="sm:hidden">My World</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded bg-foreground p-2" aria-label="Foursquare">
              <span className="text-xs font-bold leading-none text-background">
                F<br />SQ
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">/placemaker</span>
            <span className="rounded bg-primary/10 px-2 py-1 text-xs text-foreground">
              Beta
            </span>
          </Link>
          <nav className="hidden h-16 items-end sm:flex" aria-label="Main navigation">
            {tabs.map((tab) =>
              tab === "Contribute" ? (
                <div key={tab} className="relative" ref={contributeRef}>
                  <button
                    className={cn(
                      "flex h-16 items-center justify-center gap-1 px-4 text-sm transition-colors sm:px-6",
                      tab === activeTab
                        ? "border-b-2 border-foreground font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setContributeOpen((p) => !p)}
                    aria-expanded={contributeOpen}
                    aria-haspopup="true"
                  >
                    {tab}
                    <ChevronDown className={`size-3.5 transition-transform ${contributeOpen ? "rotate-180" : ""}`} />
                  </button>
                  {contributeOpen && (
                    <div className="absolute left-0 top-full z-50 mt-0 w-56 rounded-lg border border-border bg-background py-2 shadow-lg">
                      <Link
                        href="/add-place"
                        className="flex h-11 items-center px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setContributeOpen(false)}
                      >
                        Add a New Place
                      </Link>
                      <Link
                        href="/my-contributions"
                        className="flex h-11 items-center px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setContributeOpen(false)}
                      >
                        My Contributions
                      </Link>
                      <Link
                        href="/leaderboard"
                        className="flex h-11 items-center px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setContributeOpen(false)}
                      >
                        Leaderboard
                      </Link>
                      <a
                        href="https://docs.foursquare.com/data-products/docs/placemaker-best-practices"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-full items-center justify-between px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setContributeOpen(false)}
                      >
                        Best Practices
                        <ExternalLink className="size-3.5 text-muted-foreground" />
                      </a>
                    </div>
                  )}
                </div>
              ) : tab === "Places" ? (
                <div key={tab} className="relative" ref={placesRef}>
                  <button
                    className={cn(
                      "flex h-16 items-center justify-center gap-1 px-4 text-sm transition-colors sm:px-6",
                      tab === activeTab
                        ? "border-b-2 border-foreground font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setPlacesOpen((p) => !p)}
                    aria-expanded={placesOpen}
                    aria-haspopup="true"
                  >
                    {tab}
                    <ChevronDown className={`size-3.5 transition-transform ${placesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {placesOpen && (
                    <div className="absolute left-0 top-full z-50 mt-0 w-56 rounded-lg border border-border bg-background py-2 shadow-lg">
                      <Link
                        href="/places"
                        className="flex h-11 items-center px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setPlacesOpen(false)}
                      >
                        Place Specific Tasks
                      </Link>
                      <Link
                        href="/places-daily-tasks"
                        className="flex h-11 items-center px-4 text-sm text-foreground transition-colors hover:bg-accent"
                        onClick={() => setPlacesOpen(false)}
                      >
                        Daily Tasks
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={tab}
                  href="/"
                  className={cn(
                    "flex h-16 items-center justify-center px-4 text-sm transition-colors sm:px-6",
                    tab === activeTab
                      ? "border-b-2 border-foreground font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={tab === activeTab ? "page" : undefined}
                >
                  {tab}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Desktop icons */}
        <div className="hidden items-center gap-1 sm:flex sm:gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <NavIcon
                    label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {mounted && theme === "dark" ? (
                      <Sun className="size-5 text-foreground" />
                    ) : (
                      <Moon className="size-5 text-foreground" />
                    )}
                  </NavIcon>
                }
              />
              <TooltipContent side="bottom">
                {mounted && theme === "dark" ? "Light mode" : "Dark mode"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <NavIcon label="Discord server" as="a" href="https://discord.gg/foursquare" target="_blank" rel="noopener noreferrer">
                    <DiscordIcon className="size-5 text-foreground" />
                  </NavIcon>
                }
              />
              <TooltipContent side="bottom">Discord server</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <NavIcon
                    label="Support"
                    as="a"
                    href="https://support.foursquare.com/hc/en-us/requests/new?ticket_form_id=17257506184220"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HelpCircle className="size-5 text-foreground" />
                  </NavIcon>
                }
              />
              <TooltipContent side="bottom">Support</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <NavIcon
                    label="Docs"
                    as="a"
                    href="https://docs.foursquare.com/data-products/docs/placemaker-tools-overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex"
                  >
                    <FileText className="size-5 text-foreground" />
                  </NavIcon>
                }
              />
              <TooltipContent side="bottom">Docs</TooltipContent>
            </Tooltip>

            <Tooltip>
              <Popover>
                <TooltipTrigger
                  render={
                    <PopoverTrigger
                      render={
                        <button
                          className="flex size-10 items-center justify-center rounded-lg bg-transparent transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label="Profile"
                        >
                          <User className="size-5 text-foreground" />
                        </button>
                      }
                    />
                  }
                />
                <TooltipContent side="bottom">Profile</TooltipContent>
                <PopoverContent align="end" className="w-72 p-0" sideOffset={8}>
                  <div className="px-5 pb-0 pt-5">
                    <p className="text-sm font-semibold text-foreground">Sang Yeo</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">syeo@foursquare.com</p>
                  </div>

                  <Separator className="my-2" />

                  <div className="px-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Settings
                    </p>
                  </div>

                  <div className="mt-2 flex flex-col">
                    <button className="px-5 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent">
                      My Profile
                    </button>
                    <button className="px-5 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent">
                      Connected Apps
                    </button>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex flex-col">
                    <button className="px-5 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent">
                      Terms &amp; Conditions
                    </button>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex flex-col px-5 pb-5 pt-2">
                    <button className="flex items-center gap-2 py-2 text-left text-sm text-foreground transition-colors hover:text-destructive">
                      <LogOut className="size-4" />
                      Logout
                    </button>
                    <label className="flex cursor-pointer items-center gap-2 py-2 text-sm text-muted-foreground">
                      <Checkbox
                        checked={dryRun}
                        onCheckedChange={(v) => setDryRun(!!v)}
                      />
                      Dry Run Mode (for QA purpose only)
                    </label>
                  </div>
                </PopoverContent>
              </Popover>
            </Tooltip>

            <div className="mx-1 hidden h-8 w-px bg-border sm:mx-2 sm:block" />

            <Tooltip>
              <Popover>
                <TooltipTrigger
                  render={
                    <PopoverTrigger
                      render={
                        <NavIcon label="Foursquare Products" className="hidden sm:flex">
                          <LayoutGrid className="size-5 text-foreground" />
                        </NavIcon>
                      }
                    />
                  }
                />
                <TooltipContent side="bottom">Foursquare Products</TooltipContent>
                <PopoverContent align="end" className="w-80 max-h-[80vh] overflow-y-auto p-0" sideOffset={8}>
                  <ProductsMenu />
                </PopoverContent>
              </Popover>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-accent sm:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5 text-foreground" />
        </button>
      </header>

      {/* Mobile hamburger drawer */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[280px] p-0">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="text-left text-base">Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col">
            <nav className="flex flex-col px-2 py-3" aria-label="Main navigation">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={cn(
                    "flex h-11 items-center rounded-lg px-3 text-sm transition-colors",
                    tab === activeTab
                      ? "bg-accent font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <Separator />

            <div className="flex flex-col px-2 py-3">
              <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick Links</p>
              <Link
                href="/add-place"
                className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => setMenuOpen(false)}
              >
                <Plus className="size-4 text-muted-foreground" />
                Add a new place
              </Link>
              <Link
                href="/my-contributions"
                className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => setMenuOpen(false)}
              >
                <ArrowRight className="size-4 text-muted-foreground" />
                My Contributions
              </Link>
              <Link
                href="/leaderboard"
                className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => setMenuOpen(false)}
              >
                <Trophy className="size-4 text-muted-foreground" />
                Leaderboard
              </Link>
              {onOpenInvite && (
                <button
                  className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                  onClick={() => { setMenuOpen(false); onOpenInvite(); }}
                >
                  <UserPlus className="size-4 text-muted-foreground" />
                  Invite a friend
                </button>
              )}
            </div>

            <Separator />

            <div className="flex flex-col px-2 py-3">
              <button
                className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); }}
              >
                {mounted && theme === "dark" ? (
                  <Sun className="size-4 text-muted-foreground" />
                ) : (
                  <Moon className="size-4 text-muted-foreground" />
                )}
                {mounted && theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <button className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent">
                <DiscordIcon className="size-4 text-muted-foreground" />
                Discord
              </button>
              <button className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent">
                <HelpCircle className="size-4 text-muted-foreground" />
                Help
              </button>
              <button className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-accent">
                <User className="size-4 text-muted-foreground" />
                Account
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

const PRODUCTS_MENU = [
  {
    category: "Campaign Products",
    items: [
      { name: "Attribution", desc: "Understand the holistic impact of your advertising on the consumer journey." },
      { name: "Audience", desc: "Create customizable geofences to reach consumers during meaningful moments." },
      { name: "Proximity", desc: "Create customizable geofences to reach consumers during meaningful moments." },
    ],
  },
  {
    category: "Analytics Products",
    items: [
      { name: "Spatial Workbench", desc: "Powerful tools for working with geospatial data." },
      { name: "Spatial H3 Hub", desc: "A data catalog featuring H3 datasets." },
      { name: "Spatial Studio", desc: "A platform for geospatial data." },
    ],
  },
  {
    category: "Developer Products",
    items: [
      { name: "Developer Console", desc: "Configure access to Foursquare's APIs & SDKs, monitor usage, billing, and more." },
    ],
  },
  {
    category: "Data Products",
    items: [
      { name: "Placemaker Tools", desc: "Contribute edits to our Places data set.", highlighted: true },
    ],
  },
] as const;

function ProductsMenu() {
  return (
    <div className="py-3">
      {PRODUCTS_MENU.map((section, si) => (
        <div key={section.category}>
          {si > 0 && <div className="my-2" />}
          <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.category}
          </p>
          {section.items.map((item) => (
            <button
              key={item.name}
              className={cn(
                "w-full px-5 py-2.5 text-left transition-colors hover:bg-accent",
                "highlighted" in item && item.highlighted && "bg-primary/5 border-l-2 border-primary"
              )}
            >
              <p className={cn(
                "text-sm font-semibold",
                "highlighted" in item && item.highlighted ? "text-primary" : "text-foreground"
              )}>
                {item.name}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

const NavIcon = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  {
    children: React.ReactNode;
    label: string;
    className?: string;
    onClick?: () => void;
    as?: "a";
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function NavIcon({ children, label, className, onClick, as, ...rest }, ref) {
  const classes = cn(
    "flex size-10 items-center justify-center rounded-lg bg-transparent transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    className
  );

  if (as === "a") {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} aria-label={label} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
});
