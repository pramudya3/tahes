import { describe, it, expect } from 'vitest';
import { calculateWeeklyStats, calculateStreak, toLocalDateString } from '../src/utils/feedStats';
import { Activity } from '../src/types/index';

describe('Activity Feed & Weekly Stats Calculations', () => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const mockActivities: Activity[] = [
    {
      id: 'a1',
      type: 'brisk_walk',
      title: 'Jalan Cepat Pagi',
      startTime: now - oneDay * 0.5,
      endTime: now - oneDay * 0.5 + 1800000,
      durationSeconds: 1800,
      caloriesBurned: 190,
      distanceKm: 3.2,
    },
    {
      id: 'a2',
      type: 'bodyweight',
      title: 'Sirkuit Sendi',
      startTime: now - oneDay * 1.5,
      endTime: now - oneDay * 1.5 + 1200000,
      durationSeconds: 1200,
      caloriesBurned: 110,
    },
    {
      id: 'a3',
      type: 'brisk_walk',
      title: 'Jalan Sore',
      startTime: now - oneDay * 2.5,
      endTime: now - oneDay * 2.5 + 2400000,
      durationSeconds: 2400,
      caloriesBurned: 240,
      distanceKm: 4.1,
    },
    // Old activity (> 10 days ago, not in current week)
    {
      id: 'a4',
      type: 'run',
      title: 'Lari Minggu Lalu',
      startTime: now - oneDay * 12,
      endTime: now - oneDay * 12 + 1800000,
      durationSeconds: 1800,
      caloriesBurned: 300,
      distanceKm: 3.5,
    },
  ];

  it('aggregates stats for the past 7 days', () => {
    const stats = calculateWeeklyStats(mockActivities, now);
    expect(stats.totalDistanceKm).toBe(7.3); // 3.2 + 4.1
    expect(stats.totalDurationSeconds).toBe(5400); // 1800 + 1200 + 2400
    expect(stats.totalCalories).toBe(540); // 190 + 110 + 240
    expect(stats.totalWorkouts).toBe(3);
  });

  it('calculates active streak days correctly', () => {
    const streak = calculateStreak(mockActivities, now);
    expect(streak).toBeGreaterThanOrEqual(1);
  });

  it('handles empty activities array gracefully', () => {
    const stats = calculateWeeklyStats([], now);
    expect(stats.totalDistanceKm).toBe(0);
    expect(stats.totalDurationSeconds).toBe(0);
    expect(stats.totalCalories).toBe(0);
    expect(stats.totalWorkouts).toBe(0);

    const streak = calculateStreak([], now);
    expect(streak).toBe(0);
  });

  it('correctly maps morning timestamps to local date without UTC shift', () => {
    // 2026-10-18 at 06:30:00 local time
    const d = new Date(2026, 9, 18, 6, 30, 0);
    const dateStr = toLocalDateString(d.getTime());
    expect(dateStr).toBe('2026-10-18');
  });
});

