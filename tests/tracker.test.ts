import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeolocationTracker } from '../src/hooks/useGeolocationTracker';
import { soundService } from '../src/utils/audio';

describe('useGeolocationTracker hook', () => {
  let watchPositionMock: any;
  let clearWatchMock: any;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    watchPositionMock = vi.fn();
    clearWatchMock = vi.fn();

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        watchPosition: watchPositionMock,
        clearWatch: clearWatchMock,
      },
      configurable: true,
      writable: true,
    });
  });

  it('initializes in idle state', () => {
    const { result } = renderHook(() => useGeolocationTracker());
    expect(result.current.isTracking).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.distanceKm).toBe(0);
    expect(result.current.durationSeconds).toBe(0);
  });

  it('starts tracking and sets up geolocation watch', () => {
    const { result } = renderHook(() => useGeolocationTracker());

    act(() => {
      result.current.startTracking('brisk_walk');
    });

    expect(result.current.isTracking).toBe(true);
    expect(result.current.isPaused).toBe(false);
    expect(watchPositionMock).toHaveBeenCalled();
  });

  it('ignores GPS updates with low accuracy (> 30m)', () => {
    let geoCallback: any;
    watchPositionMock.mockImplementation((success: any) => {
      geoCallback = success;
      return 101;
    });

    const { result } = renderHook(() => useGeolocationTracker());

    act(() => {
      result.current.startTracking('brisk_walk');
    });

    // First initial good point
    act(() => {
      geoCallback({
        coords: {
          latitude: -6.1754,
          longitude: 106.8272,
          accuracy: 10,
          altitude: 15,
        },
        timestamp: 1000,
      });
    });

    // Second point with poor accuracy (> 30m) - should be ignored
    act(() => {
      geoCallback({
        coords: {
          latitude: -6.1950,
          longitude: 106.8230,
          accuracy: 65,
          altitude: 15,
        },
        timestamp: 2000,
      });
    });

    expect(result.current.distanceKm).toBe(0);
  });

  it('triggers audio lap chime when completing a kilometer', () => {
    const chimeSpy = vi.spyOn(soundService, 'playSuccessChime').mockImplementation(() => {});

    let geoCallback: any;
    watchPositionMock.mockImplementation((success: any) => {
      geoCallback = success;
      return 102;
    });

    const { result } = renderHook(() => useGeolocationTracker());

    act(() => {
      result.current.startTracking('brisk_walk');
    });

    // Point 1: Monas
    act(() => {
      geoCallback({
        coords: {
          latitude: -6.175392,
          longitude: 106.827153,
          accuracy: 8,
          altitude: 15,
        },
        timestamp: 1000,
      });
    });

    // Point 2: Bundaran HI (~2.3 km away)
    act(() => {
      geoCallback({
        coords: {
          latitude: -6.195000,
          longitude: 106.823000,
          accuracy: 8,
          altitude: 15,
        },
        timestamp: 600000,
      });
    });

    expect(result.current.distanceKm).toBeGreaterThan(2.0);
    expect(chimeSpy).toHaveBeenCalled();
  });

  it('cleans up geolocation watch on unmount', () => {
    watchPositionMock.mockReturnValue(999);
    const { result, unmount } = renderHook(() => useGeolocationTracker());

    act(() => {
      result.current.startTracking('brisk_walk');
    });

    unmount();
    expect(clearWatchMock).toHaveBeenCalledWith(999);
  });
});

