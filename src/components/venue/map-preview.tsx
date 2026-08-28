"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface MapPreviewProps {
  lat: number;
  lng: number;
  name?: string;
  className?: string;
  interactive?: boolean;
  pinColor?: "red" | "blue";
  onLocationChange?: (lat: number, lng: number) => void;
}

interface DualMapPreviewProps {
  currentLat: number;
  currentLng: number;
  suggestedLat: number;
  suggestedLng: number;
  name?: string;
  className?: string;
}

interface MultiLocationMapPreviewProps {
  currentLat: number;
  currentLng: number;
  suggestedLocations: Array<{
    id: string;
    lat: number;
    lng: number;
    label: string;
  }>;
  name?: string;
  className?: string;
}

const TILE_SIZE = 256;

const PIN_FILLS: Record<"red" | "blue", string> = {
  red: "#DC2626",
  blue: "#2932C9",
};

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const xTile = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const yTile =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    n;
  return { x: xTile, y: yTile };
}

function tileToLatLng(tileX: number, tileY: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const lng = (tileX / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * tileY) / n)));
  const lat = (latRad * 180) / Math.PI;
  return { lat, lng };
}

function PinSvg({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
      <path d="M4.50001 9.25072L4.50001 9.25061C4.50251 7.19579 5.31989 5.22584 6.77287 3.77286C8.2257 2.32002 10.1954 1.50266 12.25 1.5C14.3046 1.50266 16.2743 2.32002 17.7271 3.77286C19.1801 5.22584 19.9975 7.19579 20 9.25061V9.25074C20.0025 10.928 19.4547 12.5597 18.4406 13.8956L18.4269 13.9136L18.4261 13.9151L18.4045 13.9433L18.324 14.0486C18.294 14.0879 18.2633 14.1279 18.2382 14.1603L18.2065 14.2011C18.1997 14.2097 18.1963 14.214 18.1952 14.2154C18.1947 14.2159 18.1947 14.216 18.1951 14.2155L12.25 21.2269L6.30573 14.2166C6.30623 14.2172 6.30619 14.2171 6.30548 14.2162C6.3042 14.2147 6.30078 14.2104 6.29448 14.2024L6.26251 14.1614C6.23719 14.1288 6.20635 14.0886 6.17618 14.0492L6.09558 13.9438L6.0698 13.9099L6.06269 13.9006L6.06084 13.8981L6.06046 13.8977C5.04577 12.5612 4.49758 10.9287 4.50001 9.25072Z" fill={color} stroke="white" />
      <circle cx="12.2012" cy="9.5" r="3" fill="white" />
    </svg>
  );
}

function computeZoomToFit(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  containerWidth: number, containerHeight: number
): number {
  const lngDiff = Math.abs(lng1 - lng2);
  const padding = 1.5;

  let zoom = 18;
  for (let z = 18; z >= 1; z--) {
    const n = Math.pow(2, z);
    const tileSpanLng = 360 / n;
    const tilesX = containerWidth / TILE_SIZE;
    const visibleLng = tileSpanLng * tilesX;

    const latRad1 = (Math.max(lat1, lat2) * Math.PI) / 180;
    const latRad2 = (Math.min(lat1, lat2) * Math.PI) / 180;
    const y1 = ((1 - Math.log(Math.tan(latRad1) + 1 / Math.cos(latRad1)) / Math.PI) / 2) * n;
    const y2 = ((1 - Math.log(Math.tan(latRad2) + 1 / Math.cos(latRad2)) / Math.PI) / 2) * n;
    const tileSpanY = Math.abs(y2 - y1);
    const tilesY = containerHeight / TILE_SIZE;

    if (lngDiff * padding < visibleLng && tileSpanY * padding < tilesY) {
      zoom = z;
      break;
    }
  }
  return zoom;
}

export function MapPreview({
  lat,
  lng,
  name,
  className,
  interactive,
  pinColor = "blue",
  onLocationChange,
}: MapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoom = 17;
  const tile = latLngToTile(lat, lng, zoom);

  const centerTileX = Math.floor(tile.x);
  const centerTileY = Math.floor(tile.y);

  const fracX = tile.x - centerTileX;
  const fracY = tile.y - centerTileY;

  const tiles: { x: number; y: number }[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({ x: centerTileX + dx, y: centerTileY + dy });
    }
  }

  const gridPx = TILE_SIZE * 3;
  const pinOffsetX = (fracX + 1) * TILE_SIZE;
  const pinOffsetY = (fracY + 1) * TILE_SIZE;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onLocationChange || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const diffX = clickX - centerX;
      const diffY = clickY - centerY;
      const newTileX = tile.x + diffX / TILE_SIZE;
      const newTileY = tile.y + diffY / TILE_SIZE;
      const { lat: newLat, lng: newLng } = tileToLatLng(newTileX, newTileY, zoom);
      onLocationChange(newLat, newLng);
    },
    [onLocationChange, tile.x, tile.y, zoom]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        onLocationChange && "cursor-crosshair",
        className,
      )}
      aria-label={name ? `Map showing ${name}` : "Map preview"}
      role={onLocationChange ? "button" : "img"}
      onClick={onLocationChange ? handleClick : undefined}
    >
      <div
        className="absolute grid grid-cols-3"
        style={{
          width: gridPx,
          height: gridPx,
          left: `calc(50% - ${pinOffsetX}px)`,
          top: `calc(50% - ${pinOffsetY}px)`,
        }}
      >
        {tiles.map((t) => (
          <img
            key={`${t.x}-${t.y}`}
            src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`}
            alt=""
            width={TILE_SIZE}
            height={TILE_SIZE}
            className="block"
            draggable={false}
            loading="lazy"
          />
        ))}
      </div>

      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-full"
        style={{ left: "50%", top: "50%" }}
      >
        <PinSvg color={PIN_FILLS[pinColor]} />
      </div>

      {interactive && (
        <p className="absolute inset-x-0 bottom-2 text-center text-xs text-muted-foreground drop-shadow-sm">
          Click to place a pin and update the place&apos;s location on the map
        </p>
      )}

      <p className="absolute bottom-1 left-1.5 text-[10px] text-muted-foreground/70">
        Map is in view-only mode
      </p>
    </div>
  );
}

export function DualMapPreview({
  currentLat,
  currentLng,
  suggestedLat,
  suggestedLng,
  name,
  className,
}: DualMapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const centerLat = (currentLat + suggestedLat) / 2;
  const centerLng = (currentLng + suggestedLng) / 2;

  const containerWidth = 700;
  const containerHeight = 260;
  const zoom = computeZoomToFit(
    currentLat, currentLng,
    suggestedLat, suggestedLng,
    containerWidth, containerHeight
  );

  const centerTile = latLngToTile(centerLat, centerLng, zoom);
  const centerTileX = Math.floor(centerTile.x);
  const centerTileY = Math.floor(centerTile.y);
  const fracX = centerTile.x - centerTileX;
  const fracY = centerTile.y - centerTileY;

  const gridRadius = 2;
  const tiles: { x: number; y: number }[] = [];
  for (let dy = -gridRadius; dy <= gridRadius; dy++) {
    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      tiles.push({ x: centerTileX + dx, y: centerTileY + dy });
    }
  }
  const gridCols = gridRadius * 2 + 1;
  const gridPx = TILE_SIZE * gridCols;
  const gridCenterX = (fracX + gridRadius) * TILE_SIZE;
  const gridCenterY = (fracY + gridRadius) * TILE_SIZE;

  const currentTile = latLngToTile(currentLat, currentLng, zoom);
  const suggestedTile = latLngToTile(suggestedLat, suggestedLng, zoom);

  const pinCurrentX = (currentTile.x - centerTile.x) * TILE_SIZE;
  const pinCurrentY = (currentTile.y - centerTile.y) * TILE_SIZE;
  const pinSuggestedX = (suggestedTile.x - centerTile.x) * TILE_SIZE;
  const pinSuggestedY = (suggestedTile.y - centerTile.y) * TILE_SIZE;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden bg-muted", className)}
      aria-label={name ? `Map comparing locations for ${name}` : "Map comparing two locations"}
      role="img"
    >
      <div
        className="absolute"
        style={{
          width: gridPx,
          height: gridPx,
          left: `calc(50% - ${gridCenterX}px)`,
          top: `calc(50% - ${gridCenterY}px)`,
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${TILE_SIZE}px)`,
        }}
      >
        {tiles.map((t) => (
          <img
            key={`${t.x}-${t.y}`}
            src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`}
            alt=""
            width={TILE_SIZE}
            height={TILE_SIZE}
            className="block"
            draggable={false}
            loading="lazy"
          />
        ))}
      </div>

      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-full"
        style={{
          left: `calc(50% + ${pinCurrentX}px)`,
          top: `calc(50% + ${pinCurrentY}px)`,
        }}
      >
        <PinSvg color={PIN_FILLS.red} />
      </div>

      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-full"
        style={{
          left: `calc(50% + ${pinSuggestedX}px)`,
          top: `calc(50% + ${pinSuggestedY}px)`,
        }}
      >
        <PinSvg color={PIN_FILLS.blue} />
      </div>

      <p className="absolute bottom-1 left-1.5 text-[10px] text-muted-foreground/70">
        Map is in view-only mode
      </p>
    </div>
  );
}

export function MultiLocationMapPreview({
  currentLat,
  currentLng,
  suggestedLocations,
  name,
  className,
}: MultiLocationMapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate bounds to fit all locations
  const allLats = [currentLat, ...suggestedLocations.map(l => l.lat)];
  const allLngs = [currentLng, ...suggestedLocations.map(l => l.lng)];
  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs);
  const maxLng = Math.max(...allLngs);
  
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  const containerWidth = 700;
  const containerHeight = 320;
  const zoom = computeZoomToFit(
    minLat, minLng,
    maxLat, maxLng,
    containerWidth, containerHeight
  );

  const centerTile = latLngToTile(centerLat, centerLng, zoom);
  const centerTileX = Math.floor(centerTile.x);
  const centerTileY = Math.floor(centerTile.y);
  const fracX = centerTile.x - centerTileX;
  const fracY = centerTile.y - centerTileY;

  const gridRadius = 2;
  const tiles: { x: number; y: number }[] = [];
  for (let dy = -gridRadius; dy <= gridRadius; dy++) {
    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      tiles.push({ x: centerTileX + dx, y: centerTileY + dy });
    }
  }
  const gridCols = gridRadius * 2 + 1;
  const gridPx = TILE_SIZE * gridCols;
  const gridCenterX = (fracX + gridRadius) * TILE_SIZE;
  const gridCenterY = (fracY + gridRadius) * TILE_SIZE;

  const currentTile = latLngToTile(currentLat, currentLng, zoom);
  const pinCurrentX = (currentTile.x - centerTile.x) * TILE_SIZE;
  const pinCurrentY = (currentTile.y - centerTile.y) * TILE_SIZE;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden bg-muted", className)}
      aria-label={name ? `Map showing locations for ${name}` : "Map showing multiple locations"}
      role="img"
    >
      <div
        className="absolute"
        style={{
          width: gridPx,
          height: gridPx,
          left: `calc(50% - ${gridCenterX}px)`,
          top: `calc(50% - ${gridCenterY}px)`,
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${TILE_SIZE}px)`,
        }}
      >
        {tiles.map((t) => (
          <img
            key={`${t.x}-${t.y}`}
            src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`}
            alt=""
            width={TILE_SIZE}
            height={TILE_SIZE}
            className="block"
            draggable={false}
            loading="lazy"
          />
        ))}
      </div>

      {/* Current Location Pin */}
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-full"
        style={{
          left: `calc(50% + ${pinCurrentX}px)`,
          top: `calc(50% + ${pinCurrentY}px)`,
        }}
      >
        <PinSvg color={PIN_FILLS.red} />
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap">
          <span className="text-xs font-semibold text-foreground bg-white dark:bg-gray-900 px-2 py-1 rounded shadow-md border border-border">
            Current
          </span>
        </div>
      </div>

      {/* Suggested Location Pins */}
      {suggestedLocations.map((location) => {
        const suggestedTile = latLngToTile(location.lat, location.lng, zoom);
        const pinX = (suggestedTile.x - centerTile.x) * TILE_SIZE;
        const pinY = (suggestedTile.y - centerTile.y) * TILE_SIZE;

        return (
          <div
            key={location.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-full"
            style={{
              left: `calc(50% + ${pinX}px)`,
              top: `calc(50% + ${pinY}px)`,
            }}
          >
            <PinSvg color={PIN_FILLS.blue} />
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap">
              <span className="text-xs font-semibold text-foreground bg-white dark:bg-gray-900 px-2 py-1 rounded shadow-md border border-border">
                {location.label}
              </span>
            </div>
          </div>
        );
      })}

      <p className="absolute bottom-1 left-1.5 text-[10px] text-muted-foreground/70">
        Map is in view-only mode
      </p>
    </div>
  );
}
