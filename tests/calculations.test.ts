import { describe, it, expect } from 'vitest';
import {
  haversineDistance,
  calculatePace,
  calculateCaloriesBurned,
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  calculateSmoothedWeights,
  calculateRallyStages,
  calculateIdealWeight,
} from '../src/utils/calculations';

describe('Calculations Engine', () => {
  describe('haversineDistance', () => {
    it('calculates 0 distance for identical coordinates', () => {
      const d = haversineDistance(-6.1754, 106.8272, -6.1754, 106.8272);
      expect(d).toBe(0);
    });

    it('calculates approximate distance between Monas and Bundaran HI (~2.3 km)', () => {
      // Monas: -6.175392, 106.827153
      // Bundaran HI: -6.195000, 106.823000
      const d = haversineDistance(-6.175392, 106.827153, -6.195000, 106.823000);
      expect(d).toBeGreaterThan(2.0);
      expect(d).toBeLessThan(2.5);
    });
  });

  describe('calculatePace', () => {
    it('returns formatted pace for 5 km in 30 minutes (06:00 /km)', () => {
      const result = calculatePace(5.0, 1800);
      expect(result.paceSeconds).toBe(360);
      expect(result.paceString).toBe('06:00 /km');
    });

    it('handles zero distance gracefully without Infinity or NaN', () => {
      const result = calculatePace(0, 120);
      expect(result.paceSeconds).toBe(0);
      expect(result.paceString).toBe('--:-- /km');
    });

    it('handles zero duration correctly', () => {
      const result = calculatePace(5.0, 0);
      expect(result.paceSeconds).toBe(0);
      expect(result.paceString).toBe('--:-- /km');
    });
  });

  describe('calculateCaloriesBurned', () => {
    it('calculates calories for brisk walking (MET 4.3, 83kg, 30 min)', () => {
      // Formula: (MET * 3.5 * weightKg / 200) * durationMinutes
      // (4.3 * 3.5 * 83 / 200) * 30 = (1249.15 / 200) * 30 = 6.24575 * 30 = ~187 kcal
      const cals = calculateCaloriesBurned(4.3, 83, 30);
      expect(cals).toBe(187);
    });

    it('calculates calories for jogging (MET 7.0, 83kg, 30 min)', () => {
      // (7.0 * 3.5 * 83 / 200) * 30 = (2033.5 / 200) * 30 = 10.1675 * 30 = ~305 kcal
      const cals = calculateCaloriesBurned(7.0, 83, 30);
      expect(cals).toBe(305);
    });
  });

  describe('calculateBMR', () => {
    it('calculates BMR using Mifflin-St Jeor for 83kg, 165cm, 26yo male', () => {
      // 10 * 83 + 6.25 * 165 - 5 * 26 + 5 = 830 + 1031.25 - 130 + 5 = 1736.25 -> 1736
      const bmr = calculateBMR(83, 165, 26, 'male');
      expect(bmr).toBe(1736);
    });
  });

  describe('calculateTDEE', () => {
    it('calculates TDEE for moderate activity (multiplier 1.375 for light-moderate)', () => {
      const tdee = calculateTDEE(1736, 1.375);
      expect(tdee).toBe(2387);
    });
  });

  describe('calculateBMI', () => {
    it('calculates BMI for 83kg and 165cm (~30.5, Obesitas 1)', () => {
      // 83 / (1.65 * 1.65) = 83 / 2.7225 = 30.486 -> 30.5
      const { bmi, category } = calculateBMI(83, 165);
      expect(bmi).toBe(30.5);
      expect(category).toBe('Obesitas Tingkat 1');
    });

    it('calculates BMI for target weight 65kg and 165cm (~23.9, Normal)', () => {
      // 65 / 2.7225 = 23.87 -> 23.9
      const { bmi, category } = calculateBMI(65, 165);
      expect(bmi).toBe(23.9);
      expect(category).toBe('Normal');
    });
  });

  describe('calculateSmoothedWeights', () => {
    it('returns empty array when entries are empty', () => {
      expect(calculateSmoothedWeights([])).toEqual([]);
    });

    it('returns single entry with smoothed value equal to actual weight', () => {
      const entries = [{ date: '2026-10-01', weightKg: 83.0 }];
      const result = calculateSmoothedWeights(entries);
      expect(result).toHaveLength(1);
      expect(result[0].smoothedWeightKg).toBe(83.0);
    });

    it('smooths out sudden daily spikes using Exponential Moving Average', () => {
      const entries = [
        { date: '2026-10-01', weightKg: 83.0 },
        { date: '2026-10-02', weightKg: 82.5 },
        { date: '2026-10-03', weightKg: 83.2 }, // sudden water spike!
        { date: '2026-10-04', weightKg: 82.2 },
      ];
      const result = calculateSmoothedWeights(entries, 0.3);
      expect(result).toHaveLength(4);
      // EMA formula:
      // Day 1: 83.0
      // Day 2: 0.3 * 82.5 + 0.7 * 83.0 = 24.75 + 58.1 = 82.85 -> 82.9
      // Day 3: 0.3 * 83.2 + 0.7 * 82.85 = 24.96 + 57.995 = 82.955 -> 83.0
      // Day 4: 0.3 * 82.2 + 0.7 * 82.955 = 24.66 + 58.0685 = 82.7285 -> 82.7
      expect(result[0].smoothedWeightKg).toBe(83.0);
      expect(result[1].smoothedWeightKg).toBe(82.9);
      expect(result[2].smoothedWeightKg).toBe(83.0); // smoothed down from 83.2 spike!
      expect(result[3].smoothedWeightKg).toBe(82.7);
    });
  });

  describe('calculateRallyStages', () => {
    it('initializes Stage 1 as active at 83.0 kg baseline', () => {
      const overview = calculateRallyStages(83.0, 83.0, 65.0);
      expect(overview.activeStage.id).toBe('stage1');
      expect(overview.stages[0].status).toBe('active');
      expect(overview.stages[0].progressPercent).toBe(0);
      expect(overview.totalProgressPercent).toBe(0);
    });

    it('marks Stage 1 completed and Stage 2 active when weight reaches 79.5 kg', () => {
      const overview = calculateRallyStages(79.5, 83.0, 65.0);
      expect(overview.stages[0].status).toBe('completed');
      expect(overview.stages[0].progressPercent).toBe(100);
      expect(overview.activeStage.id).toBe('stage2');
      expect(overview.stages[1].status).toBe('active');
      expect(overview.stages[1].progressPercent).toBe(10); // (80 - 79.5) / 5 * 100 = 10%
    });

    it('marks all stages completed when reaching 65.0 kg', () => {
      const overview = calculateRallyStages(65.0, 83.0, 65.0);
      expect(overview.totalProgressPercent).toBe(100);
      expect(overview.stages.every((s) => s.status === 'completed')).toBe(true);
    });
  });

  describe('calculateIdealWeight', () => {
    it('calculates Broca ideal weight and healthy BMI range for 165 cm', () => {
      // Height 165 cm: Broca = (165 - 100) * 0.9 = 58.5 kg
      // WHO healthy range (18.5 - 24.9):
      // Min: 18.5 * 1.65^2 = 50.36625 -> 50.4 kg
      // Max: 24.9 * 1.65^2 = 67.79025 -> 67.8 kg
      const result = calculateIdealWeight(165, 83);
      expect(result.idealWeightKg).toBe(58.5);
      expect(result.minHealthyKg).toBe(50.4);
      expect(result.maxHealthyKg).toBe(67.8);
      expect(result.bmi).toBe(30.5);
      expect(result.category).toBe('Obesitas Tingkat 1');
    });

    it('calculates Broca ideal for height under 160 cm', () => {
      // Height 155 cm: Broca = 155 - 100 = 55 kg
      const result = calculateIdealWeight(155, 52);
      expect(result.idealWeightKg).toBe(55);
      expect(result.bmi).toBe(21.6);
      expect(result.category).toBe('Normal');
    });

    it('handles zero or negative height safely', () => {
      const result = calculateIdealWeight(0);
      expect(result.idealWeightKg).toBe(0);
      expect(result.category).toBe('N/A');
    });
  });
});

