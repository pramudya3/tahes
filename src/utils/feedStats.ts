import { Activity } from '../types/index';

export interface WeeklyStats {
  totalDistanceKm: number;
  totalDurationSeconds: number;
  totalCalories: number;
  totalWorkouts: number;
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

  // Get unique sorted dates (YYYY-MM-DD)
  const dateSet = new Set<string>();
  for (const act of activities) {
    const d = new Date(act.startTime).toISOString().split('T')[0];
    dateSet.add(d);
  }

  const sortedDates = Array.from(dateSet).sort().reverse();
  const todayStr = new Date(referenceTimestamp).toISOString().split('T')[0];
  const yesterdayStr = new Date(referenceTimestamp - 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  // If user hasn't worked out today or yesterday, streak is broken
  if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(
    sortedDates.includes(todayStr) ? todayStr : yesterdayStr
  );

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (sortedDates.includes(dateStr)) {
      streak++;
      // Move 1 day back
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
}
