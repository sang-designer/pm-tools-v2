"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Pentagon,
  Minus,
  Trash2,
  Upload,
  Download,
  Undo2,
  MousePointer2,
  Plus,
} from "lucide-react";

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

type LatLng = [number, number];
type Ring = LatLng[];
type Polygon = Ring[]; // first ring = outer, subsequent rings = holes

type DrawMode = "select" | "draw" | "hole";

interface ShapesEditorProps {
  center?: LatLng;
  zoom?: number;
  initialPolygons?: Polygon[];
  initialImportText?: string;
  onChange?: (polygons: Polygon[]) => void;
}

export function ShapesEditor({
  center = [37.7749, -122.4194],
  zoom = 16,
  initialPolygons = [],
  initialImportText = "",
  onChange,
}: ShapesEditorProps) {
  // #region agent log
  fetch('http://127.0.0.1:7737/ingest/790c4b03-4390-4ecf-9a0a-74c372d6adba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d096e'},body:JSON.stringify({sessionId:'3d096e',location:'shapes-editor.tsx:50',message:'ShapesEditor render start',data:{center,zoom,initialPolygonsLength:initialPolygons?.length},timestamp:Date.now(),hypothesisId:'H6'})}).catch(()=>{});
  // #endregion
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { resolvedTheme } = useTheme();

  const [polygons, setPolygons] = useState<Polygon[]>(initialPolygons);
  const [drawMode, setDrawMode] = useState<DrawMode>("select");
  const [currentPoints, setCurrentPoints] = useState<LatLng[]>([]);
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<Polygon[][]>([initialPolygons]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [importMode, setImportMode] = useState<"geojson" | "wkt">("geojson");
  const [importText, setImportText] = useState(initialImportText);
  const [importError, setImportError] = useState("");

  const polygonLayersRef = useRef<L.Polygon[]>([]);
  const drawingLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.CircleMarker[]>([]);
  const editMarkersRef = useRef<L.CircleMarker[]>([]);

  const pushHistory = useCallback((newPolygons: Polygon[]) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newPolygons];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const updatePolygons = useCallback((newPolygons: Polygon[]) => {
    setPolygons(newPolygons);
    pushHistory(newPolygons);
    onChange?.(newPolygons);
  }, [pushHistory, onChange]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPolygons(history[newIndex]);
      onChange?.(history[newIndex]);
    }
  }, [historyIndex, history, onChange]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      doubleClickZoom: false,
    }).setView(center, zoom);

    const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT;
    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle map clicks for drawing
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (drawMode === "select") return;

      const point: LatLng = [e.latlng.lat, e.latlng.lng];
      setCurrentPoints((prev) => [...prev, point]);
    };

    map.on("click", handleClick);
    return () => { map.off("click", handleClick); };
  }, [drawMode]);

  // Update cursor style based on mode
  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;
    if (drawMode === "select") {
      container.style.cursor = "";
    } else {
      container.style.cursor = "crosshair";
    }
  }, [drawMode]);

  // Render polygons on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    polygonLayersRef.current.forEach((l) => l.remove());
    polygonLayersRef.current = [];

    polygons.forEach((polygon, idx) => {
      const latlngs = polygon.map((ring) =>
        ring.map(([lat, lng]) => L.latLng(lat, lng))
      );
      const layer = L.polygon(latlngs, {
        color: idx === selectedPolygonIndex ? "hsl(262, 83%, 58%)" : "hsl(221, 83%, 53%)",
        weight: idx === selectedPolygonIndex ? 3 : 2,
        fillOpacity: 0.15,
        fillColor: idx === selectedPolygonIndex ? "hsl(262, 83%, 58%)" : "hsl(221, 83%, 53%)",
      }).addTo(map);

      layer.on("click", () => {
        if (drawMode === "select") {
          setSelectedPolygonIndex(idx);
        }
      });

      polygonLayersRef.current.push(layer);
    });
  }, [polygons, selectedPolygonIndex, drawMode]);

  // Render draggable edit markers for selected polygon
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    editMarkersRef.current.forEach((m) => m.remove());
    editMarkersRef.current = [];

    if (selectedPolygonIndex === null || drawMode !== "select") return;

    const polygon = polygons[selectedPolygonIndex];
    if (!polygon) return;

    polygon.forEach((ring, ringIdx) => {
      const pointCount = ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
        ? ring.length - 1
        : ring.length;

      for (let pointIdx = 0; pointIdx < pointCount; pointIdx++) {
        const [lat, lng] = ring[pointIdx];
        const marker = L.circleMarker(L.latLng(lat, lng), {
          radius: 6,
          color: "hsl(262, 83%, 58%)",
          fillColor: "white",
          fillOpacity: 1,
          weight: 2,
          className: "cursor-grab",
        }).addTo(map);

        let dragging = false;
        let startLatLng: L.LatLng | null = null;

        marker.on("mousedown", (e) => {
          L.DomEvent.stopPropagation(e);
          dragging = true;
          startLatLng = e.latlng;
          map.dragging.disable();
          marker.setStyle({ fillColor: "hsl(262, 83%, 58%)", radius: 7 });

          const polygonLayer = polygonLayersRef.current[selectedPolygonIndex];

          const onMouseMove = (moveEvent: L.LeafletMouseEvent) => {
            if (!dragging) return;
            marker.setLatLng(moveEvent.latlng);

            // Update polygon shape in real-time
            if (polygonLayer) {
              const currentLatlngs = polygonLayer.getLatLngs() as L.LatLng[][];
              const ringLatlngs = currentLatlngs[ringIdx];
              if (ringLatlngs) {
                ringLatlngs[pointIdx] = moveEvent.latlng;
                polygonLayer.setLatLngs(currentLatlngs);
              }
            }
          };

          const onMouseUp = (upEvent: L.LeafletMouseEvent) => {
            if (!dragging) return;
            dragging = false;
            map.dragging.enable();
            marker.setStyle({ fillColor: "white", radius: 6 });
            map.off("mousemove", onMouseMove);
            map.off("mouseup", onMouseUp);

            const newLat = upEvent.latlng.lat;
            const newLng = upEvent.latlng.lng;

            setPolygons((prev) => {
              const updated = prev.map((p, pIdx) => {
                if (pIdx !== selectedPolygonIndex) return p;
                return p.map((r, rIdx) => {
                  if (rIdx !== ringIdx) return r;
                  const newRing = [...r];
                  newRing[pointIdx] = [newLat, newLng];
                  if (pointIdx === 0 && newRing.length > 1 &&
                    newRing[newRing.length - 1][0] === ring[0][0] &&
                    newRing[newRing.length - 1][1] === ring[0][1]) {
                    newRing[newRing.length - 1] = [newLat, newLng];
                  }
                  return newRing;
                });
              });
              pushHistory(updated);
              onChange?.(updated);
              return updated;
            });
          };

          map.on("mousemove", onMouseMove);
          map.on("mouseup", onMouseUp);
        });

        editMarkersRef.current.push(marker);
      }
    });
  }, [polygons, selectedPolygonIndex, drawMode, pushHistory, onChange]);

  // Render current drawing points
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (drawingLayerRef.current) {
      drawingLayerRef.current.remove();
      drawingLayerRef.current = null;
    }
    markersLayerRef.current.forEach((m) => m.remove());
    markersLayerRef.current = [];

    if (currentPoints.length > 0) {
      const latlngs = currentPoints.map(([lat, lng]) => L.latLng(lat, lng));
      const color = drawMode === "hole" ? "hsl(0, 84%, 60%)" : "hsl(262, 83%, 58%)";

      drawingLayerRef.current = L.polyline(latlngs, {
        color,
        weight: 2,
        dashArray: "6 4",
      }).addTo(map);

      currentPoints.forEach(([lat, lng], i) => {
        const marker = L.circleMarker(L.latLng(lat, lng), {
          radius: 5,
          color,
          fillColor: "white",
          fillOpacity: 1,
          weight: 2,
        }).addTo(map);

        if (i === 0 && currentPoints.length >= 3) {
          marker.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            finishDrawing();
          });
          marker.setStyle({ fillColor: color, fillOpacity: 0.5 });
        }

        markersLayerRef.current.push(marker);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPoints, drawMode]);

  const finishDrawing = useCallback(() => {
    if (currentPoints.length < 3) return;

    const ring: Ring = [...currentPoints, currentPoints[0]];

    if (drawMode === "draw") {
      updatePolygons([...polygons, [ring]]);
    } else if (drawMode === "hole" && selectedPolygonIndex !== null) {
      const updated = [...polygons];
      updated[selectedPolygonIndex] = [...updated[selectedPolygonIndex], ring];
      updatePolygons(updated);
    }

    setCurrentPoints([]);
    setDrawMode("select");
  }, [currentPoints, drawMode, polygons, selectedPolygonIndex, updatePolygons]);

  const deleteSelected = useCallback(() => {
    if (selectedPolygonIndex === null) return;
    const updated = polygons.filter((_, i) => i !== selectedPolygonIndex);
    updatePolygons(updated);
    setSelectedPolygonIndex(null);
  }, [polygons, selectedPolygonIndex, updatePolygons]);

  const cancelDrawing = useCallback(() => {
    setCurrentPoints([]);
    setDrawMode("select");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelDrawing();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [cancelDrawing]);

  const handleImport = useCallback(() => {
    setImportError("");
    try {
      if (importMode === "geojson") {
        const parsed = JSON.parse(importText);
        const imported = parseGeoJSON(parsed);
        if (imported.length === 0) {
          setImportError("No valid polygons found in the GeoJSON.");
          return;
        }
        updatePolygons([...polygons, ...imported]);
      } else {
        const imported = parseWKT(importText.trim());
        if (imported.length === 0) {
          setImportError("Could not parse WKT. Supported: POLYGON, MULTIPOLYGON.");
          return;
        }
        updatePolygons([...polygons, ...imported]);
      }
      setImportText("");
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Invalid input format.");
    }
  }, [importMode, importText, polygons, updatePolygons]);

  const handleExport = useCallback((format: "geojson" | "wkt") => {
    let output: string;
    if (format === "geojson") {
      output = JSON.stringify(polygonsToGeoJSON(polygons), null, 2);
    } else {
      output = polygonsToWKT(polygons);
    }
    navigator.clipboard.writeText(output);
  }, [polygons]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <TooltipProvider>
          <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "select" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => { setDrawMode("select"); cancelDrawing(); }}
                >
                  <MousePointer2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Select (Esc)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "draw" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => { setDrawMode("draw"); setCurrentPoints([]); }}
                >
                  <Pentagon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Draw polygon</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={drawMode === "hole" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={selectedPolygonIndex === null}
                  onClick={() => { setDrawMode("hole"); setCurrentPoints([]); }}
                >
                  <Minus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cut hole in selected polygon</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={selectedPolygonIndex === null}
                onClick={deleteSelected}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete selected</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={historyIndex === 0}
                onClick={undo}
              >
                <Undo2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <div className="ml-auto flex items-center gap-2">
            {polygons.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {polygons.length} polygon{polygons.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Drawing instructions */}
      {drawMode !== "select" && (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          {drawMode === "draw"
            ? "Click to place points. Click the first point to close the polygon."
            : "Click to place hole points. Click the first point to close."}
          <Button variant="ghost" size="sm" className="ml-auto h-6 px-2 text-xs" onClick={cancelDrawing}>
            Cancel
          </Button>
          {currentPoints.length >= 3 && (
            <Button variant="secondary" size="sm" className="h-6 px-2 text-xs" onClick={finishDrawing}>
              Finish
            </Button>
          )}
        </div>
      )}
      {drawMode === "select" && selectedPolygonIndex !== null && currentPoints.length === 0 && (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-violet-500" />
          Drag vertices to edit shape. Use the toolbar to draw holes or delete.
        </div>
      )}

      {/* Map */}
      <div
        ref={mapRef}
        className="h-[360px] w-full rounded-lg border border-border overflow-hidden"
      />

      {/* Import / Export */}
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import" className="gap-1.5 text-xs">
            <Upload className="size-3.5" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            Export
          </TabsTrigger>
        </TabsList>
        <TabsContent value="import" className="space-y-3 pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant={importMode === "geojson" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setImportMode("geojson")}
            >
              GeoJSON
            </Button>
            <Button
              variant={importMode === "wkt" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setImportMode("wkt")}
            >
              WKT
            </Button>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={importMode === "geojson"
              ? '{"type": "Polygon", "coordinates": [[[lng, lat], ...]]}'
              : "POLYGON((lng lat, lng lat, ...))"
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[80px]"
          />
          {importError && (
            <p className="text-xs text-destructive">{importError}</p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            disabled={!importText.trim()}
            className="h-7 gap-1.5 text-xs"
          >
            <Plus className="size-3.5" />
            Add to map
          </Button>
        </TabsContent>
        <TabsContent value="export" className="space-y-3 pt-3">
          {polygons.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Draw or import polygons first, then export them.
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => handleExport("geojson")}
              >
                <Download className="size-3.5" />
                Copy GeoJSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => handleExport("wkt")}
              >
                <Download className="size-3.5" />
                Copy WKT
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Geometry parsing utilities ---

function parseGeoJSON(data: unknown): Polygon[] {
  const results: Polygon[] = [];

  if (!data || typeof data !== "object") throw new Error("Invalid GeoJSON");

  const obj = data as Record<string, unknown>;

  if (obj.type === "FeatureCollection") {
    const features = obj.features as unknown[];
    if (Array.isArray(features)) {
      features.forEach((f) => results.push(...parseGeoJSON(f)));
    }
  } else if (obj.type === "Feature") {
    results.push(...parseGeoJSON(obj.geometry as unknown));
  } else if (obj.type === "Polygon") {
    const coords = obj.coordinates as number[][][];
    const polygon: Polygon = coords.map((ring) =>
      ring.map(([lng, lat]) => [lat, lng] as LatLng)
    );
    results.push(polygon);
  } else if (obj.type === "MultiPolygon") {
    const coords = obj.coordinates as number[][][][];
    coords.forEach((polyCoords) => {
      const polygon: Polygon = polyCoords.map((ring) =>
        ring.map(([lng, lat]) => [lat, lng] as LatLng)
      );
      results.push(polygon);
    });
  }

  return results;
}

function parseWKT(wkt: string): Polygon[] {
  const results: Polygon[] = [];
  const upper = wkt.toUpperCase().trim();

  if (upper.startsWith("MULTIPOLYGON")) {
    const content = wkt.slice(wkt.indexOf("(((") + 1, wkt.lastIndexOf(")"));
    const polyStrings = content.split(")),((");
    polyStrings.forEach((ps) => {
      const rings = parseWKTRings(ps.replace(/^\(+|\)+$/g, ""));
      if (rings.length > 0) results.push(rings);
    });
  } else if (upper.startsWith("POLYGON")) {
    const content = wkt.slice(wkt.indexOf("((") + 1, wkt.lastIndexOf(")"));
    const rings = parseWKTRings(content.replace(/^\(+|\)+$/g, ""));
    if (rings.length > 0) results.push(rings);
  }

  return results;
}

function parseWKTRings(content: string): Ring[] {
  const ringStrings = content.split("),(");
  return ringStrings.map((rs) => {
    const cleaned = rs.replace(/[()]/g, "").trim();
    const points = cleaned.split(",").map((p) => {
      const [lng, lat] = p.trim().split(/\s+/).map(Number);
      return [lat, lng] as LatLng;
    });
    return points;
  });
}

function polygonsToGeoJSON(polygons: Polygon[]) {
  if (polygons.length === 1) {
    return {
      type: "Polygon" as const,
      coordinates: polygons[0].map((ring) =>
        ring.map(([lat, lng]) => [lng, lat])
      ),
    };
  }
  return {
    type: "MultiPolygon" as const,
    coordinates: polygons.map((polygon) =>
      polygon.map((ring) => ring.map(([lat, lng]) => [lng, lat]))
    ),
  };
}

function polygonsToWKT(polygons: Polygon[]): string {
  const formatRing = (ring: Ring) =>
    "(" + ring.map(([lat, lng]) => `${lng} ${lat}`).join(", ") + ")";
  const formatPolygon = (polygon: Polygon) =>
    "(" + polygon.map(formatRing).join(", ") + ")";

  if (polygons.length === 1) {
    return `POLYGON${formatPolygon(polygons[0])}`;
  }
  return `MULTIPOLYGON(${polygons.map(formatPolygon).join(", ")})`;
}
