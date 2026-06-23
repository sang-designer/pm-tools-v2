"use client";

import { Venue } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { VERACITY_COLORS } from "@/lib/constants";

interface VenueCardProps {
  venue: Venue;
  isSelected?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function VenueCard({ venue, isSelected, onClick, onMouseEnter, onMouseLeave }: VenueCardProps) {
  const router = useRouter();

  const handleClick = () => {
    onClick?.();
    router.push(`/venue/${venue.id}`);
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-full rounded-xl border bg-card/50 backdrop-blur p-4 text-left transition-all hover:shadow-lg group",
        "bg-gradient-to-br from-white via-slate-50/80 to-gray-100/60 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-800/60",
        isSelected
          ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30"
          : "border-border/40 hover:border-primary/30"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="font-semibold text-foreground text-base truncate">{venue.name}</div>
            {venue.veracityRating != null && (
              <Badge className={`shrink-0 tabular-nums text-xs px-1.5 py-0 ${VERACITY_COLORS[venue.veracityRating] ?? ""}`}>
                {venue.veracityRating}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{venue.address}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
      </div>
      
      {!venue.globallyCompleted && venue.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {venue.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.button>
  );
}
