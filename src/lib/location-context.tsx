"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { getLocationStatsByZone, MOCK_LOCATION_STATS } from "./mock-data";
import type { LocationStats } from "./mock-data";

interface LocationContextValue {
  selectedZone: string;
  locationStats: LocationStats;
  switchZone: (zone: string) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedZone, setSelectedZone] = useState(MOCK_LOCATION_STATS.homeZone);
  const [locationStats, setLocationStats] = useState<LocationStats>(MOCK_LOCATION_STATS);

  const switchZone = useCallback((zone: string) => {
    setSelectedZone(zone);
    const stats = getLocationStatsByZone(zone);
    if (stats) {
      setLocationStats(stats);
    }
  }, []);

  return (
    <LocationContext.Provider value={{ selectedZone, locationStats, switchZone }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    return null;
  }
  return context;
}
