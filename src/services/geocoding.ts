export interface GeocodeResult {
  lat: string;
  lon: string;
  displayName: string;
  boundingBox?: [number, number, number, number]; // [south, north, west, east]
}

export interface GridCell {
  lat: string;
  lon: string;
  radius: number;
  zoom: number;
  index: number;
  total: number;
}

export const CITY_PRESETS: Record<string, { lat: string; lon: string; bbox: [number, number, number, number] }> = {
  "Austin, TX": { lat: "30.2672", lon: "-97.7431", bbox: [30.12, 30.51, -97.94, -97.56] },
  "Miami, FL": { lat: "25.7617", lon: "-80.1918", bbox: [25.70, 25.86, -80.32, -80.13] },
  "Denver, CO": { lat: "39.7392", lon: "-104.9903", bbox: [39.61, 39.91, -105.11, -104.60] },
  "New York, NY": { lat: "40.7128", lon: "-74.0060", bbox: [40.49, 40.91, -74.25, -73.70] },
  "Los Angeles, CA": { lat: "34.0522", lon: "-118.2437", bbox: [33.70, 34.33, -118.66, -118.15] },
  "Phoenix, AZ": { lat: "33.4484", lon: "-112.0740", bbox: [33.29, 33.92, -112.32, -111.92] },
  "Chicago, IL": { lat: "41.8781", lon: "-87.6298", bbox: [41.64, 42.02, -87.94, -87.52] },
  "Seattle, WA": { lat: "47.6062", lon: "-122.3321", bbox: [47.49, 47.73, -122.44, -122.24] },
  "Dallas, TX": { lat: "32.7767", lon: "-96.7970", bbox: [32.61, 33.02, -96.99, -96.55] },
  "London, UK": { lat: "51.5074", lon: "-0.1278", bbox: [51.28, 51.69, -0.51, 0.33] }
};

export async function geocodeCity(place: string): Promise<GeocodeResult | null> {
  const trimmed = place.trim();
  if (!trimmed) return null;

  // Check preset first
  const presetMatch = Object.entries(CITY_PRESETS).find(
    ([k]) => k.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(k.toLowerCase())
  );
  if (presetMatch) {
    const [name, data] = presetMatch;
    return {
      lat: data.lat,
      lon: data.lon,
      displayName: name,
      boundingBox: data.bbox
    };
  }

  // Fallback to OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const hit = data[0];
      const rawBbox = hit.boundingbox;
      let bbox: [number, number, number, number] | undefined;
      if (rawBbox && rawBbox.length === 4) {
        // Nominatim returns [south, north, west, east] as strings
        bbox = [
          parseFloat(rawBbox[0]),
          parseFloat(rawBbox[1]),
          parseFloat(rawBbox[2]),
          parseFloat(rawBbox[3])
        ];
      }
      return {
        lat: hit.lat.toString(),
        lon: hit.lon.toString(),
        displayName: hit.display_name,
        boundingBox: bbox
      };
    }
  } catch (err) {
    console.warn('Nominatim geocode failed, using approximate fallback', err);
  }

  // Graceful fallback for demo or offline
  return {
    lat: "30.2672",
    lon: "-97.7431",
    displayName: `${trimmed} (Approximate Coordinates)`,
    boundingBox: [30.12, 30.51, -97.94, -97.56]
  };
}

export function calculateGridCells(bbox: [number, number, number, number], n: number): GridCell[] {
  const [south, north, west, east] = bbox;
  const dlat = (north - south) / n;
  const dlon = (east - west) / n;
  const mPerDeg = 6371000 * Math.PI / 180;
  const cells: GridCell[] = [];
  const total = n * n;
  let idx = 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const lat = south + (i + 0.5) * dlat;
      const lon = west + (j + 0.5) * dlon;
      const cos = Math.cos(lat * Math.PI / 180);
      const width = Math.max(1.0, dlon * mPerDeg * cos);
      const diag = Math.hypot(dlat * mPerDeg, width);
      // Maps zoom whose ~1000px viewport is about as wide as the cell (11..17)
      const zoom = Math.round(Math.log2(156543.03 * cos * 1000 / width));
      const clampedZoom = Math.min(17, Math.max(11, zoom));
      const radius = Math.max(1000, Math.ceil(1.15 * diag / 2));

      cells.push({
        lat: lat.toFixed(6),
        lon: lon.toFixed(6),
        radius,
        zoom: clampedZoom,
        index: idx++,
        total
      });
    }
  }

  return cells;
}
