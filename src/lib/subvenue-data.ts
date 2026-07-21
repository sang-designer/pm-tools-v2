export interface NearbyVenue {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  image: string;
  alreadyIncluded: boolean;
}

// Ghirardelli Square center: 37.8060, -122.4230
export const NEARBY_VENUES_V41: NearbyVenue[] = [
  // Already included (current subvenues)
  { id: "sv-1", name: "Blue Bottle Coffee", lat: 37.80595, lng: -122.42285, address: "900 North Point St", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-2", name: "Ghirardelli Ice Cream & Chocolate Shop", lat: 37.80610, lng: -122.42320, address: "900 North Point St #200", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-3", name: "The Pub at Ghirardelli", lat: 37.80580, lng: -122.42340, address: "900 North Point St #105", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-4", name: "Wattle Creek Winery", lat: 37.80620, lng: -122.42280, address: "900 North Point St #112", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-5", name: "Crown & Crumpet Tea Salon", lat: 37.80600, lng: -122.42250, address: "900 North Point St #300", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-6", name: "Lori's Diner", lat: 37.80570, lng: -122.42310, address: "900 North Point St #106", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-7", name: "Biscoff Coffee Corner", lat: 37.80585, lng: -122.42265, address: "900 North Point St #108", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-8", name: "The San Francisco Brewing Co.", lat: 37.80615, lng: -122.42355, address: "900 North Point St #115", image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-9", name: "Kara's Cupcakes", lat: 37.80625, lng: -122.42295, address: "900 North Point St #301", image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=80&h=80&fit=crop", alreadyIncluded: true },
  { id: "sv-10", name: "Sea Breeze Café", lat: 37.80560, lng: -122.42275, address: "900 North Point St #118", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=80&h=80&fit=crop", alreadyIncluded: true },
  // Nearby but not included (discoverable)
  { id: "nv-1", name: "Buena Vista Cafe", lat: 37.80650, lng: -122.42380, address: "2765 Hyde St", image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=80&h=80&fit=crop", alreadyIncluded: false },
  { id: "nv-2", name: "Ghirardelli Square Fountain Plaza", lat: 37.80630, lng: -122.42240, address: "900 North Point St", image: "https://images.unsplash.com/photo-1568219656418-15c329312bf1?w=80&h=80&fit=crop", alreadyIncluded: false },
  { id: "nv-3", name: "Maritime Store", lat: 37.80555, lng: -122.42350, address: "2905 Hyde St", image: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=80&h=80&fit=crop", alreadyIncluded: false },
  { id: "nv-4", name: "The Wax Museum", lat: 37.80645, lng: -122.42190, address: "145 Jefferson St", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop", alreadyIncluded: false },
  { id: "nv-5", name: "Fisherman's Wharf Souvenir Shop", lat: 37.80680, lng: -122.42300, address: "2801 Leavenworth St", image: "https://images.unsplash.com/photo-1582578598774-a377d4b32223?w=80&h=80&fit=crop", alreadyIncluded: false },
  { id: "nv-6", name: "Aquatic Park Bathhouse", lat: 37.80520, lng: -122.42400, address: "890 Beach St", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=80&h=80&fit=crop", alreadyIncluded: false },
];

// Default polygon around Ghirardelli Square
// Structure: Polygon[] where Polygon = Ring[] and Ring = LatLng[]
export const DEFAULT_POLYGON_V41: [number, number][][][] = [
  [
    [
      [37.8055, -122.4245],
      [37.8055, -122.4215],
      [37.8068, -122.4215],
      [37.8068, -122.4245],
      [37.8055, -122.4245],
    ],
  ],
];

type LatLng = [number, number];
type Ring = LatLng[];
type Polygon = Ring[];

/**
 * Ray-casting point-in-polygon test.
 * Returns true if the point (lat, lng) is inside any of the given polygons.
 */
export function isPointInPolygons(lat: number, lng: number, polygons: Polygon[]): boolean {
  for (const polygon of polygons) {
    if (polygon.length === 0) continue;
    const outerRing = polygon[0];
    if (isPointInRing(lat, lng, outerRing)) {
      // Check if point is inside a hole
      let inHole = false;
      for (let h = 1; h < polygon.length; h++) {
        if (isPointInRing(lat, lng, polygon[h])) {
          inHole = true;
          break;
        }
      }
      if (!inHole) return true;
    }
  }
  return false;
}

function isPointInRing(lat: number, lng: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
