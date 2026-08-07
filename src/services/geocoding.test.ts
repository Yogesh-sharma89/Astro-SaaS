// Tests for services/geocoding.ts — Nominatim geocoding service.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geocodingService } from '@/services/geocoding';

describe('geocodingService.geocode', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves a place name to lat/lng/displayName', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([
        { lat: '28.4089', lon: '76.9719', display_name: 'Palwal, Haryana, India' },
      ]), { status: 200 })
    );

    const result = await geocodingService.geocode('Palwal, Haryana');
    expect(result).not.toBeNull();
    expect(result!.latitude).toBeCloseTo(28.4089, 2);
    expect(result!.longitude).toBeCloseTo(76.9719, 2);
    expect(result!.displayName).toBe('Palwal, Haryana, India');
  });

  it('returns null when no results found', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    const result = await geocodingService.geocode('zzznonexistentplace123');
    expect(result).toBeNull();
  });

  it('throws on HTTP error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Server Error', { status: 500 })
    );

    await expect(geocodingService.geocode('test')).rejects.toThrow('Geocoding failed (500)');
  });

  it('encodes the place name in the URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await geocodingService.geocode('New York, NY');
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain(encodeURIComponent('New York, NY'));
  });

  it('sends Accept-Language header', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await geocodingService.geocode('London');
    const opts = fetchSpy.mock.calls[0][1] as RequestInit;
    expect(opts.headers).toEqual({ 'Accept-Language': 'en' });
  });
});
