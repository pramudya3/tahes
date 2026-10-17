import { useState, useRef, useEffect, useCallback } from 'react';
import { GPSPoint, ActivityType, Activity } from '../types/index';
import {
  haversineDistance,
  calculatePace,
  calculateCaloriesBurned,
} from '../utils/calculations';
import { getUserProfile } from '../db/index';
import { soundService } from '../utils/audio';
import { wakeLockService } from '../utils/wakeLock';

export interface UseGeolocationTrackerReturn {
  isTracking: boolean;
  isPaused: boolean;
  activityType: ActivityType;
  distanceKm: number;
  durationSeconds: number;
  currentPace: string;
  avgPace: string;
  calories: number;
  route: GPSPoint[];
  currentPosition: GPSPoint | null;
  error: string | null;
  startTracking: (type?: ActivityType) => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  stopTracking: () => Activity;
}

export function useGeolocationTracker(): UseGeolocationTrackerReturn {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>('brisk_walk');
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentPace, setCurrentPace] = useState('--:-- /km');
  const [avgPace, setAvgPace] = useState('--:-- /km');
  const [calories, setCalories] = useState(0);
  const [route, setRoute] = useState<GPSPoint[]>([]);
  const [currentPosition, setCurrentPosition] = useState<GPSPoint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const timerIdRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const lastLapKmRef = useRef<number>(0);
  const routeRef = useRef<GPSPoint[]>([]);
  const distanceRef = useRef<number>(0);

  // Sync refs
  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    distanceRef.current = distanceKm;
  }, [distanceKm]);

  // Calories update when duration or weight changes
  const updateCalories = useCallback(
    (seconds: number, _dist: number, type: ActivityType) => {
      const profile = getUserProfile();
      // Brisk walk: MET 4.3. Run: MET 7.0
      const met = type === 'run' ? 7.0 : 4.3;
      const durationMins = seconds / 60;
      const burned = calculateCaloriesBurned(met, profile.currentWeightKg, durationMins);
      setCalories(burned);
    },
    []
  );

  const handlePositionSuccess = useCallback(
    (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy, altitude } = pos.coords;

      // Ignore low accuracy points (> 30 meters)
      if (accuracy && accuracy > 30) {
        return;
      }

      const point: GPSPoint = {
        lat: latitude,
        lng: longitude,
        time: pos.timestamp || Date.now(),
        accuracy,
        altitude,
      };

      setCurrentPosition(point);

      setRoute((prevRoute) => {
        if (prevRoute.length === 0) {
          return [point];
        }

        const lastPoint = prevRoute[prevRoute.length - 1];
        const stepDist = haversineDistance(
          lastPoint.lat,
          lastPoint.lng,
          point.lat,
          point.lng
        );

        // Ignore small jitter (< 0.003 km / 3 meters)
        if (stepDist < 0.003) {
          return prevRoute;
        }

        const newDistance = distanceRef.current + stepDist;
        setDistanceKm(newDistance);
        distanceRef.current = newDistance;

        // Check 1 km Lap Alert
        const currentLap = Math.floor(newDistance);
        if (currentLap > lastLapKmRef.current && currentLap >= 1) {
          lastLapKmRef.current = currentLap;
          soundService.playSuccessChime();
        }

        // Calculate instant pace from last point
        const timeDiffSec = (point.time - lastPoint.time) / 1000;
        if (timeDiffSec > 0 && stepDist > 0) {
          const instPace = calculatePace(stepDist, timeDiffSec);
          setCurrentPace(instPace.paceString);
        }

        return [...prevRoute, point];
      });
    },
    []
  );

  const handlePositionError = useCallback((err: GeolocationPositionError) => {
    setError(err.message || 'Gagal mengakses GPS');
  }, []);

  const startTracking = useCallback(
    (type: ActivityType = 'brisk_walk') => {
      setError(null);
      setActivityType(type);
      setIsTracking(true);
      setIsPaused(false);
      setDistanceKm(0);
      distanceRef.current = 0;
      setDurationSeconds(0);
      setCalories(0);
      setRoute([]);
      routeRef.current = [];
      setCurrentPace('--:-- /km');
      setAvgPace('--:-- /km');
      lastLapKmRef.current = 0;
      startTimeRef.current = Date.now();

      wakeLockService.request();
      soundService.playCountdownBeep(true);

      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          handlePositionSuccess,
          handlePositionError,
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000,
          }
        );
      } else {
        setError('Browser Anda tidak mendukung Geolocation GPS');
      }

      // Start elapsed timer
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      timerIdRef.current = setInterval(() => {
        setDurationSeconds((sec) => {
          const nextSec = sec + 1;
          const { paceString } = calculatePace(distanceRef.current, nextSec);
          setAvgPace(paceString);
          updateCalories(nextSec, distanceRef.current, type);
          return nextSec;
        });
      }, 1000);
    },
    [handlePositionSuccess, handlePositionError, updateCalories]
  );

  const pauseTracking = useCallback(() => {
    setIsPaused(true);
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const resumeTracking = useCallback(() => {
    setIsPaused(false);
    wakeLockService.request();

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionSuccess,
        handlePositionError,
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      );
    }

    if (timerIdRef.current) clearInterval(timerIdRef.current);
    timerIdRef.current = setInterval(() => {
      setDurationSeconds((sec) => {
        const nextSec = sec + 1;
        const { paceString } = calculatePace(distanceRef.current, nextSec);
        setAvgPace(paceString);
        updateCalories(nextSec, distanceRef.current, activityType);
        return nextSec;
      });
    }, 1000);
  }, [handlePositionSuccess, handlePositionError, updateCalories, activityType]);

  const stopTracking = useCallback((): Activity => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    wakeLockService.release();
    soundService.playSuccessChime();

    const finalDistance = distanceRef.current;
    const finalRoute = [...routeRef.current];
    const finalDuration = durationSeconds;
    const finalPace = calculatePace(finalDistance, finalDuration);

    const activity: Activity = {
      id: `act_${Date.now()}`,
      type: activityType,
      title: activityType === 'run' ? 'Lari Outdoor' : 'Jalan Cepat Outdoor',
      startTime: startTimeRef.current,
      endTime: Date.now(),
      durationSeconds: finalDuration,
      caloriesBurned: calories,
      distanceKm: Math.round(finalDistance * 100) / 100,
      avgPaceSecondsPerKm: finalPace.paceSeconds,
      avgPaceString: finalPace.paceString,
      routeCoordinates: finalRoute,
    };

    setIsTracking(false);
    setIsPaused(false);

    return activity;
  }, [activityType, durationSeconds, calories]);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      wakeLockService.release();
    };
  }, []);

  return {
    isTracking,
    isPaused,
    activityType,
    distanceKm,
    durationSeconds,
    currentPace,
    avgPace,
    calories,
    route,
    currentPosition,
    error,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  };
}
