/**
 * Calculates the great-circle distance between two points on the Earth (Haversine formula).
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates pace given distance in km and duration in seconds.
 * Returns both raw pace in seconds/km and formatted string "MM:SS /km".
 */
export function calculatePace(
  distanceKm: number,
  durationSeconds: number
): { paceSeconds: number; paceString: string } {
  if (!distanceKm || distanceKm <= 0 || !durationSeconds || durationSeconds <= 0) {
    return { paceSeconds: 0, paceString: '--:-- /km' };
  }

  const paceSeconds = Math.round(durationSeconds / distanceKm);
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = paceSeconds % 60;

  const paddedMins = minutes.toString().padStart(2, '0');
  const paddedSecs = seconds.toString().padStart(2, '0');

  return {
    paceSeconds,
    paceString: `${paddedMins}:${paddedSecs} /km`,
  };
}

/**
 * Calculates calories burned using MET (Metabolic Equivalent of Task).
 * Formula: Calories = (MET * 3.5 * weightKg / 200) * durationMinutes
 */
export function calculateCaloriesBurned(
  met: number,
  weightKg: number,
  durationMinutes: number
): number {
  if (met <= 0 || weightKg <= 0 || durationMinutes <= 0) {
    return 0;
  }
  const caloriesPerMinute = (met * 3.5 * weightKg) / 200;
  return Math.round(caloriesPerMinute * durationMinutes);
}

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor formula.
 * Men: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
 * Women: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female' = 'male'
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const result = gender === 'male' ? base + 5 : base - 161;
  return Math.round(result);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 * Multipliers:
 * - Sedentary: 1.2
 * - Light active (1-3 days/week): 1.375
 * - Moderately active (3-5 days/week): 1.55
 * - Very active (6-7 days/week): 1.725
 */
export function calculateTDEE(bmr: number, activityMultiplier = 1.375): number {
  return Math.round(bmr * activityMultiplier);
}

/**
 * Calculates Body Mass Index (BMI) and WHO category.
 */
export function calculateBMI(
  weightKg: number,
  heightCm: number
): { bmi: number; category: string } {
  if (weightKg <= 0 || heightCm <= 0) {
    return { bmi: 0, category: 'N/A' };
  }
  const heightM = heightCm / 100;
  const rawBMI = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBMI * 10) / 10;

  let category = 'Normal';
  if (bmi < 18.5) {
    category = 'Berat Kurang (Underweight)';
  } else if (bmi < 25) {
    category = 'Normal';
  } else if (bmi < 30) {
    category = 'Kelebihan Berat Badan (Overweight)';
  } else if (bmi < 35) {
    category = 'Obesitas Tingkat 1';
  } else {
    category = 'Obesitas Tingkat 2+';
  }

  return { bmi, category };
}
