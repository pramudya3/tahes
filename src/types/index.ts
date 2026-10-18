export type ActivityType = 'brisk_walk' | 'run' | 'bodyweight' | 'hiit';

export interface GPSPoint {
  lat: number;
  lng: number;
  time: number;
  accuracy?: number;
  altitude?: number | null;
}

export interface ExerciseSet {
  reps?: number;
  durationSeconds?: number;
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  caloriesBurned: number;
  // Outdoor specific
  distanceKm?: number;
  avgPaceSecondsPerKm?: number;
  avgPaceString?: string;
  routeCoordinates?: GPSPoint[];
  // Indoor specific
  routineId?: string;
  routineName?: string;
  completedExercises?: CompletedExercise[];
  notes?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  geminiApiKey?: string;
  soundEnabled: boolean;
  voiceAlertsEnabled: boolean;
  indoorOnlyMode?: boolean;
  onboarded?: boolean;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  notes?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'upper' | 'lower' | 'core' | 'cardio';
  targetMuscles: string[];
  jointFriendly: boolean;
  formCues: string[];
  kneeSafetyTip?: string;
  defaultWorkDurationSeconds: number;
  defaultRestDurationSeconds: number;
  defaultReps?: number;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  week: number;
  description: string;
  level: 'beginner' | 'intermediate';
  exercises: {
    exerciseId: string;
    sets: number;
    workSeconds?: number;
    restSeconds: number;
    targetReps?: number;
  }[];
}
