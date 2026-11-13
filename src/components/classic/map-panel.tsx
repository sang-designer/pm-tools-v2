"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useGame } from "@/lib/game-context";
import { Venue, VENUE_STATE_COLORS, VenueState } from "@/lib/types";

const TILE_LIGHT = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>';

function createPinIcon(color: string) {
  return L.divIcon({
    className: "custom-pin",
    html: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.50001 9.25072L4.50001 9.25061C4.50251 7.19579 5.31989 5.22584 6.77287 3.77286C8.2257 2.32002 10.1954 1.50266 12.25 1.5C14.3046 1.50266 16.2743 2.32002 17.7271 3.77286C19.1801 5.22584 19.9975 7.19579 20 9.25061V9.25074C20.0025 10.928 19.4547 12.5597 18.4406 13.8956L18.4269 13.9136L18.4261 13.9151L18.4045 13.9433L18.324 14.0486C18.294 14.0879 18.2633 14.1279 18.2382 14.1603L18.2065 14.2011C18.1997 14.2097 18.1963 14.214 18.1952 14.2154C18.1947 14.2159 18.1947 14.216 18.1951 14.2155L12.25 21.2269L6.30573 14.2166C6.30623 14.2172 6.30619 14.2171 6.30548 14.2162C6.3042 14.2147 6.30078 14.2104 6.29448 14.2024L6.26251 14.1614C6.23719 14.1288 6.20635 14.0886 6.17618 14.0492L6.09558 13.9438L6.0698 13.9099L6.06269 13.9006L6.06084 13.8981L6.06046 13.8977C5.04577 12.5612 4.49758 10.9287 4.50001 9.25072Z" fill="${color}" stroke="white"/>
      <circle cx="12.2012" cy="9.5" r="3" fill="white"/>
    </svg>`,
    iconSize: [26, 26],
    iconAnchor: [13, 23],
  });
}

export function MapPanel({ venues: venuesProp }: { venues?: Venue[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const game = useGame();
  const venues = venuesProp ?? game.venues;
  const { getVenueState, selectedVenueId, setSelectedVenueId, hoveredVenueId } = game;
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView([37.77, -122.42], 13);
    const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT;
    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: TILE_ATTR,
      maxZoom: 20,
    }).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersRef.current.clear();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;
    const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT;
    tileLayerRef.current.setUrl(tileUrl);
  }, [resolvedTheme]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current.clear();

    venues.forEach((venue) => {
      const state: VenueState = getVenueState(venue.id);
      const color = VENUE_STATE_COLORS[state];
      const marker = L.marker([venue.lat, venue.lng], { icon: createPinIcon(color) }).addTo(map);
      marker.on("click", () => setSelectedVenueId(venue.id));
      markersRef.current.set(venue.id, marker);
    });
  }, [venues, getVenueState, setSelectedVenueId]);

  useEffect(() => {
    const markers = markersRef.current;
    markers.forEach((marker, venueId) => {
      const isHovered = venueId === hoveredVenueId;
      const state: VenueState = getVenueState(venueId);
      const color = isHovered ? "#3b82f6" : VENUE_STATE_COLORS[state];
      marker.setIcon(createPinIcon(color));
    });
  }, [hoveredVenueId, getVenueState]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVenueId) return;
    const venue = venues.find((v) => v.id === selectedVenueId);
    if (venue) {
      map.flyTo([venue.lat, venue.lng], 15, { duration: 0.8 });
    }
  }, [selectedVenueId, venues]);

  return (
    <div ref={mapRef} className="h-full w-full rounded-2xl [&_.leaflet-control-zoom]:hidden [&_.leaflet-control-zoom]:sm:flex [&_.leaflet-control-zoom]:sm:flex-col" />
  );
}
