import React, { useState, useEffect, useRef } from 'react';
import { WorkoutRoutine, Activity } from '../../types/index';
import { getExerciseById } from '../../data/exercises';
import { ExerciseCard } from './ExerciseCard';
import { soundService } from '../../utils/audio';
import { wakeLockService } from '../../utils/wakeLock';
import { getUserProfile, db } from '../../db/index';
import { Play, Pause, SkipForward, X, CheckCircle2 } from 'lucide-react';

interface WorkoutPlayerProps {
  routine: WorkoutRoutine;
  onFinish: (activity: Activity) => void;
  onClose: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  routine,
  onFinish,
  onClose,
}) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = routine.exercises[exerciseIndex];
  const currentExercise = currentItem ? getExerciseById(currentItem.exerciseId) : null;
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentTotalDuration =
    phase === 'work'
      ? currentItem?.workSeconds || 30
      : currentItem?.restSeconds || 20;

  useEffect(() => {
    wakeLockService.request();
    soundService.playCountdownBeep(true);
    startTimeRef.current = Date.now();

    return () => {
      wakeLockService.release();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update timer initial when phase or item changes
  useEffect(() => {
    if (!currentItem) return;
    const initialSecs =
      phase === 'work'
        ? currentItem.workSeconds || 30
        : currentItem.restSeconds || 20;
    setSecondsRemaining(initialSecs);
  }, [phase, exerciseIndex, currentSet, currentItem]);

  // Main countdown timer interval
  useEffect(() => {
    if (isPaused || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTotalSecondsElapsed((prev) => prev + 1);

      setSecondsRemaining((prev) => {
        if (prev <= 4 && prev > 1) {
          // 3, 2, 1 countdown beep
          soundService.playCountdownBeep(false);
        } else if (prev === 1) {
          soundService.playCountdownBeep(true);
        }

        if (prev <= 1) {
          // Transition phase
          handlePhaseTransition();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isCompleted, phase, exerciseIndex, currentSet, currentItem]);

  const handlePhaseTransition = () => {
    if (!currentItem) return;

    if (phase === 'work') {
      // Finished a work set
      if (currentSet < currentItem.sets) {
        // More sets remaining in this exercise
        setPhase('rest');
      } else {
        // All sets of this exercise finished
        if (exerciseIndex + 1 < routine.exercises.length) {
          // Move to rest, then next exercise
          setPhase('rest');
        } else {
          // Entire routine completed!
          finishWorkout();
        }
      }
    } else {
      // Finished rest
      if (currentSet < currentItem.sets) {
        setCurrentSet((prev) => prev + 1);
        setPhase('work');
      } else {
        // Next exercise
        setExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        setPhase('work');
      }
    }
  };

  const handleSkip = () => {
    handlePhaseTransition();
  };

  const finishWorkout = async () => {
    setIsCompleted(true);
    wakeLockService.release();
    soundService.playSuccessChime();

    const profile = getUserProfile();
    const durationMinutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
    const calories = Math.round((5.0 * 3.5 * profile.currentWeightKg * durationMinutes) / 200);

    const activity: Activity = {
      id: `workout_${Date.now()}`,
      type: 'bodyweight',
      title: routine.title,
      startTime: startTimeRef.current,
      endTime: Date.now(),
      durationSeconds: totalSecondsElapsed,
      caloriesBurned: calories,
      routineId: routine.id,
      routineName: routine.title,
      notes: `Menyelesaikan ${routine.title} tanpa alat.`,
    };

    await db.activities.add(activity);
    onFinish(activity);
  };

  if (!currentExercise || !currentItem) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-6 text-center">
        <div className="space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Latihan Selesai!</h2>
          <button
            onClick={finishWorkout}
            className="px-6 py-3 rounded-2xl bg-strava-orange text-white font-bold"
          >
            Simpan & Selesai
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentTotalDuration - secondsRemaining) / currentTotalDuration) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div>
          <span className="text-[10px] font-bold text-strava-orange uppercase tracking-wider block">
            {routine.title}
          </span>
          <span className="text-xs text-slate-400">
            Gerakan {exerciseIndex + 1} dari {routine.exercises.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-lg w-full mx-auto p-4 space-y-5">
        {/* Timer Circle Component */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="86"
                className="stroke-slate-800"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="86"
                className={`transition-all duration-300 ${
                  phase === 'work' ? 'stroke-strava-orange' : 'stroke-emerald-400'
                }`}
                strokeWidth="12"
                strokeDasharray="540.35"
                strokeDashoffset={540.35 - (540.35 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Center Display */}
            <div className="absolute text-center space-y-1">
              <span
                className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                  phase === 'work'
                    ? 'bg-strava-orange/20 text-strava-orange'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {phase === 'work' ? 'Latihan' : 'Istirahat'}
              </span>
              <div className="text-5xl font-black tracking-tight text-white">
                {secondsRemaining}
              </div>
              <span className="text-xs text-slate-400 font-semibold block">detik</span>
            </div>
          </div>

          {/* Quick Reps target indicator if work phase */}
          {phase === 'work' && currentItem.targetReps && (
            <div className="mt-2 text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              Target: ~{currentItem.targetReps} Repetisi Terkontrol
            </div>
          )}
        </div>

        {/* Posture & Form Cue Card */}
        <div className="flex-1">
          <ExerciseCard
            exercise={currentExercise}
            currentSet={currentSet}
            totalSets={currentItem.sets}
          />
        </div>

        {/* Bottom Floating Action Bar */}
        <div className="sticky bottom-4 pt-2 flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98] ${
              isPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5 fill-white" /> Lanjut
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 fill-white" /> Jeda
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center gap-1.5 text-sm font-bold active:scale-[0.98] transition"
          >
            <SkipForward className="w-4 h-4" />
            <span>Lewati</span>
          </button>

          <button
            onClick={finishWorkout}
            className="px-5 py-4 rounded-2xl bg-strava-orange hover:bg-strava-hover text-white text-sm font-black shadow-lg shadow-strava-orange/25 active:scale-[0.98] transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
