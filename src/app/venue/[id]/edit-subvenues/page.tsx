"use client";

import { useState, useCallback, useMemo, Component, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { ArrowLeft, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  NEARBY_VENUES_V41,
  DEFAULT_POLYGON_V41,
  isPointInPolygons,
  type NearbyVenue,
} from "@/lib/subvenue-data";
import { MOCK_VENUES } from "@/lib/mock-data";

const ShapesEditor = dynamic(
  () => import("@/components/venue/shapes-editor").then((m) => m.ShapesEditor),
  { ssr: false, loading: () => <div className="h-[360px] w-full animate-pulse rounded-lg bg-muted" /> }
);

// #region agent log
class MapErrorBoundary extends Component<{children: ReactNode}, {error: string | null}> {
  state = { error: null as string | null };
  static getDerivedStateFromError(error: Error) { return { error: error.message }; }
  componentDidCatch(error: Error) {
    fetch('http://127.0.0.1:7737/ingest/790c4b03-4390-4ecf-9a0a-74c372d6adba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d096e'},body:JSON.stringify({sessionId:'3d096e',location:'edit-subvenues/page.tsx:ErrorBoundary',message:'ShapesEditor CRASHED',data:{error:error.message,stack:error.stack?.slice(0,500)},timestamp:Date.now(),hypothesisId:'H6'})}).catch(()=>{});
  }
  render() {
    if (this.state.error) return <div className="p-4 text-sm text-destructive border rounded-lg">{this.state.error}</div>;
    return this.props.children;
  }
}
// #endregion

type LatLng = [number, number];
type Ring = LatLng[];
type Polygon = Ring[];

export default function EditSubvenuesPage() {
  const params = useParams();
  const venueId = params.id as string;

  // #region agent log
  fetch('http://127.0.0.1:7737/ingest/790c4b03-4390-4ecf-9a0a-74c372d6adba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d096e'},body:JSON.stringify({sessionId:'3d096e',location:'edit-subvenues/page.tsx:33',message:'Page component mounted',data:{venueId,hasMockVenues:!!MOCK_VENUES,mockVenuesLength:MOCK_VENUES?.length},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
  // #endregion

  const venue = MOCK_VENUES.find((v) => v.id === venueId);
  const venueName = venue?.name || "Venue";
  const venueCenter: LatLng = [venue?.lat || 37.806, venue?.lng || -122.423];

  const initialGeoJSON = useMemo(() => {
    const geojson = {
      type: "Polygon",
      coordinates: DEFAULT_POLYGON_V41[0].map((ring) =>
        ring.map(([lat, lng]) => [lng, lat])
      ),
    };
    return JSON.stringify(geojson, null, 2);
  }, []);

  // #region agent log
  fetch('http://127.0.0.1:7737/ingest/790c4b03-4390-4ecf-9a0a-74c372d6adba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d096e'},body:JSON.stringify({sessionId:'3d096e',location:'edit-subvenues/page.tsx:41',message:'Venue lookup result',data:{venueFound:!!venue,venueName,venueCenter,defaultPolygonLength:DEFAULT_POLYGON_V41?.length},timestamp:Date.now(),hypothesisId:'H2,H3'})}).catch(()=>{});
  // #endregion

  const [polygons, setPolygons] = useState<Polygon[]>(DEFAULT_POLYGON_V41);
  const [includedIds, setIncludedIds] = useState<Set<string>>(
    () => new Set(NEARBY_VENUES_V41.filter((v) => v.alreadyIncluded).map((v) => v.id))
  );

  const discoveredVenues = useMemo(() => {
    if (polygons.length === 0) return [];
    try {
      const result = NEARBY_VENUES_V41.filter((v) =>
        isPointInPolygons(v.lat, v.lng, polygons)
      ).sort((a, b) => {
        if (a.alreadyIncluded === b.alreadyIncluded) return 0;
        return a.alreadyIncluded ? 1 : -1;
      });
      // #region agent log
      fetch('http://127.0.0.1:7737/ingest/790c4b03-4390-4ecf-9a0a-74c372d6adba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d096e'},body:JSON.stringify({sessionId:'3d096e',location:'edit-subvenues/page.tsx:55',message:'discoveredVenues computed',data:{polygonsCount:polygons.length,resultCount:result.length},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      return result;
    } catch (err: unknown) {
      // #region agent log
      fetch('http://127.0.0.1:7737/ingest/790c4b03-4390-4ecf-9a0a-74c372d6adba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d096e'},body:JSON.stringify({sessionId:'3d096e',location:'edit-subvenues/page.tsx:60',message:'discoveredVenues CRASHED',data:{error:String(err)},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      return [];
    }
  }, [polygons]);

  const selectedCount = discoveredVenues.filter((v) => includedIds.has(v.id)).length;

  const [saved, setSaved] = useState(false);

  const handlePolygonChange = useCallback((newPolygons: Polygon[]) => {
    setPolygons(newPolygons);
    setSaved(false);
  }, []);

  const toggleVenue = useCallback((id: string) => {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setSaved(false);
  }, []);

  const selectAll = useCallback(() => {
    setIncludedIds(new Set(discoveredVenues.map((v) => v.id)));
    setSaved(false);
  }, [discoveredVenues]);

  const deselectAll = useCallback(() => {
    setIncludedIds(new Set());
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    toast.success(`Subvenues updated for ${venueName}`, {
      description: `${selectedCount} venue${selectedCount !== 1 ? "s" : ""} included.`,
    });
    setSaved(true);
  }, [venueName, selectedCount]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/venue/${venueId}`}>
            <Button variant="ghost" className="gap-2 mb-3">
              <ArrowLeft className="size-4" /> Back to {venueName}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Edit Subvenues
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Draw a polygon on the map or import GeoJSON to discover venues within the boundary.
            Then choose which venues to include as subvenues of {venueName}.
          </p>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left panel - Map */}
          <div className="flex-1 min-w-0 xl:max-w-[60%]">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Boundary Editor</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Draw a polygon around the area to find venues inside it, or import GeoJSON/WKT coordinates.
                </p>
              </CardHeader>
              <CardContent>
                <MapErrorBoundary>
                  <ShapesEditor
                    center={venueCenter}
                    zoom={17}
                    initialPolygons={DEFAULT_POLYGON_V41}
                    initialImportText={initialGeoJSON}
                    onChange={handlePolygonChange}
                  />
                </MapErrorBoundary>
              </CardContent>
            </Card>
          </div>

          {/* Right panel - Venue list */}
          <div className="xl:w-[40%] xl:min-w-[380px]">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Venues Found
                    {discoveredVenues.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {discoveredVenues.length}
                      </Badge>
                    )}
                  </CardTitle>
                  {discoveredVenues.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={selectAll}
                      >
                        Select all
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={deselectAll}
                      >
                        Deselect
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {discoveredVenues.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <MapPin className="size-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">No venues in boundary</p>
                    <p className="text-xs text-muted-foreground max-w-[240px]">
                      Draw a polygon on the map to discover venues within the area.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                    {discoveredVenues.map((venue) => (
                      <VenueRow
                        key={venue.id}
                        venue={venue}
                        included={includedIds.has(venue.id)}
                        onToggle={() => toggleVenue(venue.id)}
                      />
                    ))}
                  </div>
                )}

                {discoveredVenues.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {selectedCount} of {discoveredVenues.length} selected
                      </p>
                      <Button onClick={handleSave} disabled={saved}>
                        Save Changes
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function VenueRow({
  venue,
  included,
  onToggle,
}: {
  venue: NearbyVenue;
  included: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className="flex items-center gap-3 rounded-lg border border-border p-2.5 cursor-pointer hover:bg-muted/40 transition-colors"
    >
      <Checkbox
        checked={included}
        onCheckedChange={onToggle}
      />
      <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={venue.image}
          alt={venue.name}
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">
            {venue.name}
          </span>
          {venue.alreadyIncluded ? (
            <Badge variant="secondary" className="text-[10px] shrink-0">
              Included
            </Badge>
          ) : (
            <Badge className="text-[10px] shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              <Sparkles className="size-2.5 mr-0.5" />
              New
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground truncate block">
          {venue.address}
        </span>
      </div>
    </label>
  );
}
