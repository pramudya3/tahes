import { Activity } from '../types/index';

export interface WeeklyStats {
  totalDistanceKm: number;
  totalDurationSeconds: number;
  totalCalories: number;
  totalWorkouts: number;
}

/**
 * Converts timestamp to local date string (YYYY-MM-DD) avoiding UTC timezone shifts.
 */
export function toLocalDateString(timestamp: number): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateWeeklyStats(
  activities: Activity[],
  referenceTimestamp = Date.now()
): WeeklyStats {
  const sevenDaysAgo = referenceTimestamp - 7 * 24 * 60 * 60 * 1000;

  const thisWeekActs = activities.filter(
    (a) => a.startTime >= sevenDaysAgo && a.startTime <= referenceTimestamp
  );

  let totalDist = 0;
  let totalDur = 0;
  let totalCal = 0;

  for (const act of thisWeekActs) {
    totalDist += act.distanceKm || 0;
    totalDur += act.durationSeconds || 0;
    totalCal += act.caloriesBurned || 0;
  }

  return {
    totalDistanceKm: Math.round(totalDist * 10) / 10,
    totalDurationSeconds: totalDur,
    totalCalories: totalCal,
    totalWorkouts: thisWeekActs.length,
  };
}

export function calculateStreak(
  activities: Activity[],
  referenceTimestamp = Date.now()
): number {
  if (activities.length === 0) return 0;

  // Use local date string to accurately group morning/evening workouts
  const dateSet = new Set<string>();
  for (const act of activities) {
    dateSet.add(toLocalDateString(act.startTime));
  }

  const sortedDates = Array.from(dateSet).sort().reverse();
  const todayStr = toLocalDateString(referenceTimestamp);
  const yesterdayStr = toLocalDateString(referenceTimestamp - 24 * 60 * 60 * 1000);

  // If user hasn't worked out today or yesterday, streak is broken
  if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(
    sortedDates.includes(todayStr) ? todayStr : yesterdayStr
  );

  while (true) {
    const dateStr = toLocalDateString(checkDate.getTime());
    if (sortedDates.includes(dateStr)) {
      streak++;
      // Move 1 day back in local calendar
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
