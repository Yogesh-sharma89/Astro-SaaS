// features/onboarding/components/ — location input with manual geocode + live GPS detection.

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { geocodingService, type GeoLocation } from '@/services/geocoding';
import { Check, MapPin, Loader2, AlertCircle, X, Crosshair, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onResolved: (location: GeoLocation | null) => void;
  resolvedLocation: GeoLocation | null;
}

export function LocationInput({ value, onChange, onResolved, resolvedLocation }: LocationInputProps) {
  const [geocoding, setGeocoding] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleGeocode = useCallback(async () => {
    if (!value.trim()) return;
    setGeocoding(true);
    setGeoError(null);
    setConfirmed(false);
    try {
      const result = await geocodingService.geocode(value.trim());
      if (!result) {
        setGeoError('Location not found. You can continue — we\'ll use a default location.');
        onResolved(null);
      } else {
        onChange(result.displayName);
        onResolved(result);
      }
    } catch {
      setGeoError('Geocoding failed. You can continue with a manual entry.');
      onResolved(null);
    } finally {
      setGeocoding(false);
    }
  }, [value, onResolved, onChange]);

  const handleDetectLocation = useCallback(async () => {
    setDetecting(true);
    setGeoError(null);
    setConfirmed(false);
    try {
      const location = await geocodingService.getCurrentLocation();
      onChange(location.displayName);
      onResolved(location);
      setConfirmed(true);
    } catch (err) {
      const msg = err instanceof GeolocationPositionError
        ? err.code === 1
          ? 'Location access denied. Please enable location permissions in your browser.'
          : 'Unable to detect your location. Please enter manually.'
        : 'Unable to detect your location. Please enter manually.';
      setGeoError(msg);
    } finally {
      setDetecting(false);
    }
  }, [onChange, onResolved]);

  function handleConfirm() {
    setConfirmed(true);
  }

  function handleReject() {
    onResolved(null);
    setConfirmed(false);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="ob-place">Birth Place</Label>
      <div className="flex gap-2">
        <Input
          id="ob-place"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onResolved(null);
            setConfirmed(false);
            setGeoError(null);
          }}
          placeholder="City, Country"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleGeocode}
          disabled={geocoding || detecting || !value.trim()}
          size="sm"
          title="Search location"
        >
          {geocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleDetectLocation}
          disabled={geocoding || detecting}
          size="sm"
          title="Use my current location"
          className="border-primary/30 hover:bg-primary/5"
        >
          {detecting ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <LocateFixed className="h-4 w-4 text-primary" />}
        </Button>
      </div>

      {(geocoding || detecting) && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          {detecting ? 'Detecting your location…' : 'Finding location…'}
        </p>
      )}

      {resolvedLocation && !confirmed && !detecting && (
        <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-start gap-2">
            <Crosshair className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm text-foreground">
                Found: <span className="font-medium">{resolvedLocation.displayName}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Lat {resolvedLocation.latitude.toFixed(4)}, Lng {resolvedLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleConfirm} className="h-7 text-xs">
              <Check className="mr-1 h-3 w-3" /> Yes, that's right
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleReject} className="h-7 text-xs">
              <X className="mr-1 h-3 w-3" /> Try again
            </Button>
          </div>
        </div>
      )}

      {resolvedLocation && confirmed && (
        <div className="flex items-center gap-1.5 rounded-lg border border-success/20 bg-success/5 p-2 text-xs text-foreground">
          <Check className="h-3 w-3 text-success" /> {resolvedLocation.displayName}
        </div>
      )}

      {geoError && (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" /> {geoError}
        </p>
      )}

      {!resolvedLocation && !geoError && !geocoding && !detecting && value && (
        <p className="text-xs text-muted-foreground">
          Click the pin to search, or the target icon to auto-detect your location.
        </p>
      )}

      {!resolvedLocation && !geoError && !geocoding && !detecting && !value && (
        <p className="text-xs text-muted-foreground">
          Enter your birth city, or use auto-detect for your current location.
        </p>
      )}
    </div>
  );
}
