import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import {
  db,
  getUserProfile,
  saveUserProfile,
  exportAllData,
  importAllData,
} from '../src/db/index';
import { Activity, WeightEntry } from '../src/types/index';

describe('Database Layer & Local Storage', () => {
  beforeEach(async () => {
    await db.activities.clear();
    await db.weight_logs.clear();
    localStorage.clear();
  });

  describe('User Profile', () => {
    it('returns default profile for 165cm, 83kg, 26yo', () => {
      const profile = getUserProfile();
      expect(profile.heightCm).toBe(165);
      expect(profile.currentWeightKg).toBe(83);
      expect(profile.age).toBe(26);
      expect(profile.targetWeightKg).toBe(65);
    });

    it('updates and persists profile modifications', () => {
      saveUserProfile({ currentWeightKg: 82.2, soundEnabled: false });
      const updated = getUserProfile();
      expect(updated.currentWeightKg).toBe(82.2);
      expect(updated.soundEnabled).toBe(false);
      expect(updated.heightCm).toBe(165); // preserved
    });
  });

  describe('Activities & Weight Logs CRUD', () => {
    it('saves and retrieves activity records', async () => {
      const sampleActivity: Activity = {
        id: 'act-1',
        type: 'brisk_walk',
        title: 'Jalan Cepat Sore',
        startTime: Date.now(),
        endTime: Date.now() + 1800000,
        durationSeconds: 1800,
        caloriesBurned: 187,
        distanceKm: 3.2,
        avgPaceSecondsPerKm: 562,
        avgPaceString: '09:22 /km',
      };

      await db.activities.add(sampleActivity);
      const all = await db.activities.toArray();
      expect(all.length).toBe(1);
      expect(all[0].title).toBe('Jalan Cepat Sore');
      expect(all[0].caloriesBurned).toBe(187);
    });

    it('saves and retrieves weight entries', async () => {
      const entry: WeightEntry = {
        id: 'w-1',
        date: '2026-10-17',
        weightKg: 83.0,
        notes: 'Hari pertama mulai',
      };

      await db.weight_logs.add(entry);
      const entries = await db.weight_logs.toArray();
      expect(entries.length).toBe(1);
      expect(entries[0].weightKg).toBe(83.0);
    });
  });

  describe('Export & Import Data Backup', () => {
    it('exports all activities and weight logs to valid JSON', async () => {
      await db.activities.add({
        id: 'act-10',
        type: 'bodyweight',
        title: 'Latihan Sendi',
        startTime: 1000,
        endTime: 2000,
        durationSeconds: 1000,
        caloriesBurned: 90,
      });

      await db.weight_logs.add({
        id: 'w-10',
        date: '2026-10-17',
        weightKg: 83.0,
      });

      const jsonStr = await exportAllData();
      const parsed = JSON.parse(jsonStr);
      expect(parsed.version).toBe(1);
      expect(parsed.activities.length).toBe(1);
      expect(parsed.weightLogs.length).toBe(1);
    });

    it('imports data and restores into database', async () => {
      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        profile: {
          name: 'Nand',
          age: 26,
          heightCm: 165,
          currentWeightKg: 81.5,
          targetWeightKg: 65,
          soundEnabled: true,
          voiceAlertsEnabled: true,
        },
        activities: [
          {
            id: 'imported-act',
            type: 'run',
            title: 'Jogging Pagi',
            startTime: 5000,
            endTime: 7000,
            durationSeconds: 2000,
            caloriesBurned: 240,
          },
        ],
        weightLogs: [
          {
            id: 'imported-w',
            date: '2026-10-20',
            weightKg: 81.5,
          },
        ],
      };

      const success = await importAllData(JSON.stringify(backup));
      expect(success).toBe(true);

      const activities = await db.activities.toArray();
      expect(activities.length).toBe(1);
      expect(activities[0].title).toBe('Jogging Pagi');

      const profile = getUserProfile();
      expect(profile.currentWeightKg).toBe(81.5);
    });

    it('rejects invalid JSON string gracefully', async () => {
      const success = await importAllData('not-valid-json');
      expect(success).toBe(false);
    });
  });
});
