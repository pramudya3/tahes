import { WorkoutRoutine } from '../types/index';
import { calculateCaloriesBurned } from '../utils/calculations';

export const mentorPrograms: WorkoutRoutine[] = [
  {
    id: 'mentor_week_1_2',
    title: 'Minggu 1 & 2: Fondasi Sendi & Penguatan',
    subtitle: 'Fokus adaptasi otot, melindungi lutut, dan membiasakan ritme',
    week: 1,
    level: 'beginner',
    description:
      'Latihan sirkuit tanpa loncatan. Lakukan 2-3 kali seminggu diselingi dengan jalan cepat outdoor di hari lainnya.',
    exercises: [
      { exerciseId: 'incline_pushup', sets: 3, workSeconds: 30, restSeconds: 20, targetReps: 10 },
      { exerciseId: 'chair_squat', sets: 3, workSeconds: 30, restSeconds: 25, targetReps: 12 },
      { exerciseId: 'glute_bridge', sets: 3, workSeconds: 35, restSeconds: 20, targetReps: 15 },
      { exerciseId: 'forearm_plank', sets: 3, workSeconds: 25, restSeconds: 25 },
      { exerciseId: 'step_jacks', sets: 2, workSeconds: 35, restSeconds: 20 },
    ],
  },
  {
    id: 'mentor_week_3_4',
    title: 'Minggu 3 & 4: Fat Burn & Core Stability',
    subtitle: 'Peningkatan durasi kerja dan aktivasi metabolik lebih tinggi',
    week: 3,
    level: 'beginner',
    description:
      'Meningkatkan intensitas pembakaran lemak dengan menjaga sendi tetap aman dan memperkuat stabilitas pinggul & perut.',
    exercises: [
      { exerciseId: 'step_jacks', sets: 3, workSeconds: 40, restSeconds: 20 },
      { exerciseId: 'incline_pushup', sets: 3, workSeconds: 35, restSeconds: 20, targetReps: 12 },
      { exerciseId: 'chair_squat', sets: 3, workSeconds: 35, restSeconds: 20, targetReps: 15 },
      { exerciseId: 'dead_bug', sets: 3, workSeconds: 35, restSeconds: 15, targetReps: 12 },
      { exerciseId: 'wall_sit', sets: 2, workSeconds: 35, restSeconds: 25 },
      { exerciseId: 'forearm_plank', sets: 3, workSeconds: 35, restSeconds: 20 },
    ],
  },
  {
    id: 'quick_15_joint_friendly',
    title: 'Quick 15-Menit Sirkuit Ramah Sendi',
    subtitle: 'Latihan cepat dan efisien saat waktu terbatas',
    week: 0,
    level: 'beginner',
    description:
      'Sirkuit ringkas 4 gerakan menyeluruh untuk memompa metabolisme harian Anda.',
    exercises: [
      { exerciseId: 'step_jacks', sets: 3, workSeconds: 35, restSeconds: 15 },
      { exerciseId: 'chair_squat', sets: 3, workSeconds: 30, restSeconds: 20, targetReps: 12 },
      { exerciseId: 'incline_pushup', sets: 3, workSeconds: 30, restSeconds: 20, targetReps: 10 },
      { exerciseId: 'bird_dog', sets: 2, workSeconds: 35, restSeconds: 15, targetReps: 10 },
    ],
  },
];

/**
 * Calculates estimated total duration in minutes and calories burned
 * for a specific user weight (default 83 kg).
 * Calisthenics bodyweight circuit typical MET is ~5.0.
 */
export function calculateRoutineEstimate(
  routine: WorkoutRoutine,
  weightKg: number
): { totalDurationMinutes: number; estimatedCalories: number } {
  let totalSeconds = 0;
  for (const item of routine.exercises) {
    const work = item.workSeconds || 30;
    const rest = item.restSeconds || 20;
    totalSeconds += item.sets * (work + rest);
  }

  const totalDurationMinutes = Math.round(totalSeconds / 60);
  // MET 5.0 for bodyweight circuit
  const estimatedCalories = calculateCaloriesBurned(5.0, weightKg, totalDurationMinutes);

  return {
    totalDurationMinutes,
    estimatedCalories,
  };
}
