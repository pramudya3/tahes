import { describe, it, expect } from 'vitest';
import {
  haversineDistance,
  calculatePace,
  calculateCaloriesBurned,
  calculateBMR,
  calculateTDEE,
  calculateBMI,
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
});
