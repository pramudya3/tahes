import { describe, it, expect } from 'vitest';
import { exercisesList, getExerciseById } from '../src/data/exercises';
import { mentorPrograms, calculateRoutineEstimate } from '../src/data/programs';

describe('Workout Data & Routine Estimations', () => {
  it('contains curated low-impact joint-friendly exercises for 83kg beginner', () => {
    expect(exercisesList.length).toBeGreaterThanOrEqual(8);
    const boxSquat = getExerciseById('chair_squat');
    expect(boxSquat).toBeDefined();
    expect(boxSquat?.jointFriendly).toBe(true);
    expect(boxSquat?.kneeSafetyTip).toBeDefined();
  });

  it('includes 4-week mentor programs', () => {
    expect(mentorPrograms.length).toBeGreaterThanOrEqual(2);
    const week1 = mentorPrograms.find((p) => p.week === 1);
    expect(week1).toBeDefined();
    expect(week1?.exercises.length).toBeGreaterThanOrEqual(4);
  });

  it('calculates estimated duration and calories for 83kg user correctly', () => {
    const routine = mentorPrograms[0];
    const { totalDurationMinutes, estimatedCalories } = calculateRoutineEstimate(
      routine,
      83 // user weight
    );

    expect(totalDurationMinutes).toBeGreaterThan(5);
    expect(estimatedCalories).toBeGreaterThan(40);
  });
});
