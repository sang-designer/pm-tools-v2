"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/lib/game-context";
import { Venue } from "@/lib/types";
import { VenueCard } from "./venue-card";
import { motion } from "framer-motion";

export function VenueList({ venues: venuesProp }: { venues?: Venue[] }) {
  const game = useGame();
  const venues = venuesProp ?? game.venues;
  const { selectedVenueId, setSelectedVenueId, setHoveredVenueId } = game;
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!selectedVenueId) return;
    const el = itemRefs.current.get(selectedVenueId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedVenueId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="flex h-full flex-col gap-4 overflow-y-auto p-4"
      role="list"
      aria-label="Venue list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {venues.map((venue) => (
        <motion.div
          key={venue.id}
          role="listitem"
          variants={itemVariants}
          ref={(node) => {
            if (node) {
              itemRefs.current.set(venue.id, node);
            } else {
              itemRefs.current.delete(venue.id);
            }
          }}
        >
          <VenueCard
            venue={venue}
            isSelected={selectedVenueId === venue.id}
            onClick={() => setSelectedVenueId(selectedVenueId === venue.id ? null : venue.id)}
            onMouseEnter={() => setHoveredVenueId(venue.id)}
            onMouseLeave={() => setHoveredVenueId(null)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
