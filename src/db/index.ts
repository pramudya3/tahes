import Dexie, { type EntityTable } from 'dexie';
import { Activity, WeightEntry, UserProfile } from '../types/index';

export class PersonalStravaDatabase extends Dexie {
  activities!: EntityTable<Activity, 'id'>;
  weight_logs!: EntityTable<WeightEntry, 'id'>;

  constructor() {
    super('PersonalStravaDatabase');
    this.version(1).stores({
      activities: 'id, type, startTime',
      weight_logs: 'id, date',
    });
  }
}

export const db = new PersonalStravaDatabase();

const PROFILE_KEY = 'strava_user_profile';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Athlete',
  age: 26,
  heightCm: 165,
  currentWeightKg: 83.0,
  targetWeightKg: 65.0,
  soundEnabled: true,
  voiceAlertsEnabled: true,
};

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveUserProfile(partial: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated: UserProfile = { ...current, ...partial };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  profile: UserProfile;
  activities: Activity[];
  weightLogs: WeightEntry[];
}

export async function exportAllData(): Promise<string> {
  const activities = await db.activities.toArray();
  const weightLogs = await db.weight_logs.toArray();
  const profile = getUserProfile();

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    activities,
    weightLogs,
  };

  return JSON.stringify(backup, null, 2);
}

export async function importAllData(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString) as BackupData;
    if (!data || !Array.isArray(data.activities) || !Array.isArray(data.weightLogs)) {
      return false;
    }

    if (data.profile) {
      saveUserProfile(data.profile);
    }

    await db.transaction('rw', db.activities, db.weight_logs, async () => {
      await db.activities.clear();
      await db.weight_logs.clear();
      if (data.activities.length > 0) {
        await db.activities.bulkAdd(data.activities);
      }
      if (data.weightLogs.length > 0) {
        await db.weight_logs.bulkAdd(data.weightLogs);
      }
    });

    return true;
  } catch {
    return false;
  }
}
