"use client";

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useGame } from "@/lib/game-context";
import { VENUE_STATE_COLORS, VenueState } from "@/lib/types";

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

function createQuestIcon(color: string, state: VenueState) {
  const pulse = state === "in_progress" ? `<circle cx="12.25" cy="9.5" r="16" fill="${color}" opacity="0.3"><animate attributeName="r" from="12" to="20" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.4" to="0" dur="1.2s" repeatCount="indefinite"/></circle>` : "";
  const check = state === "completed" ? `<polyline points="9,9.5 11.5,12 15.5,7" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>` : "";
  const inner = state === "completed" ? "" : `<circle cx="12.2012" cy="9.5" r="3" fill="white"/>`;

  return L.divIcon({
    className: "quest-pin",
    html: `<svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" style="overflow:visible">
      ${pulse}
      <path d="M4.50001 9.25072L4.50001 9.25061C4.50251 7.19579 5.31989 5.22584 6.77287 3.77286C8.2257 2.32002 10.1954 1.50266 12.25 1.5C14.3046 1.50266 16.2743 2.32002 17.7271 3.77286C19.1801 5.22584 19.9975 7.19579 20 9.25061V9.25074C20.0025 10.928 19.4547 12.5597 18.4406 13.8956L18.4269 13.9136L18.4261 13.9151L18.4045 13.9433L18.324 14.0486C18.294 14.0879 18.2633 14.1279 18.2382 14.1603L18.2065 14.2011C18.1997 14.2097 18.1963 14.214 18.1952 14.2154C18.1947 14.2159 18.1947 14.216 18.1951 14.2155L12.25 21.2269L6.30573 14.2166C6.30623 14.2172 6.30619 14.2171 6.30548 14.2162C6.3042 14.2147 6.30078 14.2104 6.29448 14.2024L6.26251 14.1614C6.23719 14.1288 6.20635 14.0886 6.17618 14.0492L6.09558 13.9438L6.0698 13.9099L6.06269 13.9006L6.06084 13.8981L6.06046 13.8977C5.04577 12.5612 4.49758 10.9287 4.50001 9.25072Z" fill="${color}" stroke="white"/>
      ${inner}${check}
    </svg>`,
    iconSize: [35, 35],
    iconAnchor: [17, 31],
    popupAnchor: [0, -31],
  });
}

export interface PinPosition {
  x: number;
  y: number;
}

export interface QuestMapHandle {
  fitCompletedVenues: () => void;
  resetView: () => void;
  getPinPosition: (venueId: string) => PinPosition | null;
  onMoveEnd: (cb: () => void) => () => void;
}

export const QuestMap = forwardRef<QuestMapHandle, { showAllCompleted?: boolean }>(
  function QuestMap({ showAllCompleted = false }, ref) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());
    const { venues, getVenueState, selectedVenueId, setSelectedVenueId, venueProgress } = useGame();
    const { resolvedTheme } = useTheme();

    useEffect(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([37.765, -122.42], 14);

      const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT;
      tileLayerRef.current = L.tileLayer(tileUrl, {
        attribution: TILE_ATTR,
        maxZoom: 20,
        subdomains: "abcd",
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstanceRef.current = map;

      return () => {
        map.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || !tileLayerRef.current) return;
      const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT;
      tileLayerRef.current.setUrl(tileUrl);
    }, [resolvedTheme]);

    useImperativeHandle(ref, () => ({
      fitCompletedVenues: () => {
        const map = mapInstanceRef.current;
        if (!map) return;
        const completedCoords = venues
          .filter((v) => venueProgress.some((p) => p.venueId === v.id) || v.globallyCompleted)
          .map((v) => [v.lat, v.lng] as [number, number]);

        if (completedCoords.length === 0) {
          map.flyTo([37.765, -122.42], 13, { duration: 0.8 });
          return;
        }
        const bounds = L.latLngBounds(completedCoords);
        map.flyToBounds(bounds.pad(0.3), { duration: 0.8, maxZoom: 14 });
      },
      resetView: () => {
        const map = mapInstanceRef.current;
        if (!map) return;
        map.flyTo([37.765, -122.42], 14, { duration: 0.6 });
      },
      getPinPosition: (venueId: string): PinPosition | null => {
        const map = mapInstanceRef.current;
        if (!map) return null;
        const venue = venues.find((v) => v.id === venueId);
        if (!venue) return null;
        const point = map.latLngToContainerPoint([venue.lat, venue.lng]);
        return { x: point.x, y: point.y };
      },
      onMoveEnd: (cb: () => void) => {
        const map = mapInstanceRef.current;
        if (!map) return () => {};
        map.on("moveend", cb);
        map.on("zoomend", cb);
        return () => {
          map.off("moveend", cb);
          map.off("zoomend", cb);
        };
      },
    }), [venues, venueProgress]);

    const renderMarkers = useCallback(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current.clear();

      venues.forEach((venue) => {
        const state = getVenueState(venue.id);

        if (!showAllCompleted && state === "unvisited") return;
        if (showAllCompleted && state === "unvisited") return;

        const color = VENUE_STATE_COLORS[state];
        const icon = createQuestIcon(color, state);
        const marker = L.marker([venue.lat, venue.lng], { icon }).addTo(map);

        marker.bindTooltip(venue.name, {
          direction: "top",
          offset: [0, -40],
          className: "quest-tooltip",
        });

        marker.on("click", () => {
          setSelectedVenueId(venue.id);
        });

        markersRef.current.set(venue.id, marker);
      });
    }, [venues, getVenueState, setSelectedVenueId, showAllCompleted]);

    useEffect(() => {
      renderMarkers();
    }, [renderMarkers, venueProgress, selectedVenueId]);

    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || !selectedVenueId || showAllCompleted) return;
      const venue = venues.find((v) => v.id === selectedVenueId);
      if (venue) {
        map.flyTo([venue.lat, venue.lng], 16, { duration: 0.6 });
      }
    }, [selectedVenueId, venues, showAllCompleted]);

    return <div ref={mapRef} className="absolute inset-0 z-0" />;
  }
);
