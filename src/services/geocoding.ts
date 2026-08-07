// services/geocoding.ts — resolves place names and coordinates via OpenStreetMap Nominatim.

export interface GeoLocation {
  latitude: number;
  longitude: number;
  displayName: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export const geocodingService = {
  /**
   * Resolve a place name to coordinates.
   * Returns null if no match found. Throws on network error.
   */
  async geocode(placeName: string): Promise<GeoLocation | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
    const data = (await res.json()) as NominatimResult[];
    if (!data || data.length === 0) return null;
    const r = data[0];
    return {
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
      displayName: r.display_name,
    };
  },

  /**
   * Reverse geocode: resolve coordinates to a place name.
   * Returns null if no match found. Throws on network error.
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) throw new Error(`Reverse geocoding failed (${res.status})`);
    const data = (await res.json()) as NominatimResult & { address?: { city?: string; town?: string; village?: string; state?: string; country?: string } };
    if (!data || !data.lat) return null;
    const addr = data.address;
    const cityPart = addr?.city ?? addr?.town ?? addr?.village ?? '';
    const regionPart = addr?.state ?? '';
    const countryPart = addr?.country ?? '';
    const displayName = [cityPart, regionPart, countryPart].filter(Boolean).join(', ') || data.display_name;
    return {
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
      displayName,
    };
  },

  /**
   * Get the user's current location via the browser Geolocation API.
   * Returns coordinates + reverse-geocoded place name.
   * Throws if permission denied or unavailable.
   */
  async getCurrentLocation(): Promise<GeoLocation> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser.');
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      });
    });

    const { latitude, longitude } = position.coords;

    try {
      const location = await this.reverseGeocode(latitude, longitude);
      if (location) return location;
    } catch {
      // If reverse geocoding fails, still return coordinates
    }

    return {
      latitude,
      longitude,
      displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    };
  },
};
