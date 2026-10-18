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

export interface SmoothedWeightEntry {
  date: string;
  weightKg: number;
  smoothedWeightKg: number;
}

/**
 * Calculates smoothed weight trend using Exponential Moving Average (EMA).
 * Filters out short-term water retention, sodium, and GI fluctuations.
 */
export function calculateSmoothedWeights(
  entries: { date: string; weightKg: number }[],
  alpha = 0.25
): SmoothedWeightEntry[] {
  if (entries.length === 0) return [];

  // Sort ascending by date
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const result: SmoothedWeightEntry[] = [];
  let currentEMA = sorted[0].weightKg;

  for (let i = 0; i < sorted.length; i++) {
    const rawWeight = sorted[i].weightKg;
    if (i === 0) {
      currentEMA = rawWeight;
    } else {
      currentEMA = alpha * rawWeight + (1 - alpha) * currentEMA;
    }
    result.push({
      date: sorted[i].date,
      weightKg: rawWeight,
      smoothedWeightKg: Math.round(currentEMA * 10) / 10,
    });
  }

  return result;
}

export interface RallyStageItem {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  startWeightKg: number;
  targetWeightKg: number;
  targetLossKg: number;
  status: 'completed' | 'active' | 'upcoming';
  progressPercent: number;
  remainingKg: number;
}

export interface RallyStagesOverview {
  stages: RallyStageItem[];
  activeStage: RallyStageItem;
  totalProgressPercent: number;
  totalLostKg: number;
  totalRemainingKg: number;
}

/**
 * Calculates 4-stage micro-goals for 83kg -> 65kg journey.
 */
export function calculateRallyStages(
  currentWeightKg: number,
  initialWeightKg = 83.0,
  targetWeightKg = 65.0
): RallyStagesOverview {
  const definitions = [
    {
      id: 'stage1',
      stageNumber: 1,
      title: 'STAGE 01 // BREAK 80 KG',
      subtitle: 'Adaptasi Napas & Sendi (-3.0 kg)',
      startWeightKg: 83.0,
      targetWeightKg: 80.0,
    },
    {
      id: 'stage2',
      stageNumber: 2,
      title: 'STAGE 02 // PACING MID-70s',
      subtitle: 'Peningkatan Stamina & Split Pace (-5.0 kg)',
      startWeightKg: 80.0,
      targetWeightKg: 75.0,
    },
    {
      id: 'stage3',
      stageNumber: 3,
      title: 'STAGE 03 // OVERWEIGHT EXIT',
      subtitle: 'Beban Lutut Berkurang Drastis (-5.0 kg)',
      startWeightKg: 75.0,
      targetWeightKg: 70.0,
    },
    {
      id: 'stage4',
      stageNumber: 4,
      title: 'STAGE 04 // FINISH LINE',
      subtitle: 'Pencapaian BMI Normal Ideal (~23.9)',
      startWeightKg: 70.0,
      targetWeightKg: 65.0,
    },
  ];

  const stages: RallyStageItem[] = [];
  let activeStage: RallyStageItem | null = null;

  for (const def of definitions) {
    const targetLossKg = Math.round((def.startWeightKg - def.targetWeightKg) * 10) / 10;
    let status: 'completed' | 'active' | 'upcoming' = 'upcoming';
    let progressPercent = 0;
    let remainingKg = targetLossKg;

    if (currentWeightKg <= def.targetWeightKg) {
      status = 'completed';
      progressPercent = 100;
      remainingKg = 0;
    } else if (currentWeightKg < def.startWeightKg) {
      status = 'active';
      const lostInStage = def.startWeightKg - currentWeightKg;
      progressPercent = Math.min(100, Math.max(0, Math.round((lostInStage / targetLossKg) * 100)));
      remainingKg = Math.max(0, Math.round((currentWeightKg - def.targetWeightKg) * 10) / 10);
    } else {
      // Not yet reached or at start
      if (!activeStage && def.stageNumber === 1) {
        status = 'active';
        progressPercent = 0;
        remainingKg = targetLossKg;
      } else {
        status = 'upcoming';
        progressPercent = 0;
        remainingKg = targetLossKg;
      }
    }

    const item: RallyStageItem = {
      ...def,
      targetLossKg,
      status,
      progressPercent,
      remainingKg,
    };

    if (status === 'active' && !activeStage) {
      activeStage = item;
    }
    stages.push(item);
  }

  // Fallback active stage (e.g. if all completed, last stage is active/completed)
  if (!activeStage) {
    activeStage = stages[stages.length - 1];
  }

  const totalTargetLoss = Math.max(0.1, initialWeightKg - targetWeightKg);
  const totalLost = Math.max(0, initialWeightKg - currentWeightKg);
  const totalProgressPercent = Math.min(
    100,
    Math.max(0, Math.round((totalLost / totalTargetLoss) * 1000) / 10)
  );

  return {
    stages,
    activeStage,
    totalProgressPercent,
    totalLostKg: Math.round(totalLost * 10) / 10,
    totalRemainingKg: Math.max(0, Math.round((currentWeightKg - targetWeightKg) * 10) / 10),
  };
}

export interface IdealWeightResult {
  idealWeightKg: number;
  minHealthyKg: number;
  maxHealthyKg: number;
  bmi: number;
  category: string;
}

/**
 * Calculates ideal body weight based on the Broca Formula (modified for Asian/adult populations)
 * and healthy BMI range (18.5 - 24.9 kg/m² per WHO standard).
 * 
 * Formula Broca:
 * - TB >= 160 cm: (TB - 100) - ((TB - 100) * 10%) = (TB - 100) * 0.9
 * - TB < 160 cm: TB - 100
 * 
 * Healthy Weight Range (WHO BMI 18.5 - 24.9):
 * - Min: 18.5 * (TB/100)^2
 * - Max: 24.9 * (TB/100)^2
 */
export function calculateIdealWeight(
  heightCm: number,
  currentWeightKg?: number
): IdealWeightResult {
  if (!heightCm || heightCm <= 0) {
    return {
      idealWeightKg: 0,
      minHealthyKg: 0,
      maxHealthyKg: 0,
      bmi: 0,
      category: 'N/A',
    };
  }

  let ideal: number;
  if (heightCm < 160) {
    ideal = heightCm - 100;
  } else {
    ideal = (heightCm - 100) * 0.9;
  }
  const idealWeightKg = Math.round(ideal * 10) / 10;

  const heightM = heightCm / 100;
  const minHealthyKg = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthyKg = Math.round(24.9 * heightM * heightM * 10) / 10;

  let bmi = 0;
  let category = 'Normal';
  if (currentWeightKg && currentWeightKg > 0) {
    const bmiRes = calculateBMI(currentWeightKg, heightCm);
    bmi = bmiRes.bmi;
    category = bmiRes.category;
  }

  return {
    idealWeightKg,
    minHealthyKg,
    maxHealthyKg,
    bmi,
    category,
  };
}

