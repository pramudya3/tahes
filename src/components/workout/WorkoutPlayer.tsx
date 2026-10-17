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

  const [isConfirmingExit, setIsConfirmingExit] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#24334A] bg-[#111827]/95 backdrop-blur">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-rally-orange" />
            <span className="text-[10px] font-black text-rally-orange uppercase tracking-wider block">
              CIRCUIT // INTERVAL PLAYER
            </span>
          </div>
          <h2 className="text-sm font-black text-white mt-0.5">
            {routine.title}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            GERAKAN {exerciseIndex + 1} / {routine.exercises.length}
          </span>
        </div>
        <button
          onClick={() => {
            setIsPaused(true);
            setIsConfirmingExit(true);
          }}
          className="p-2 rounded-xl bg-[#0B0F19] border border-[#24334A] text-slate-400 hover:text-white cursor-pointer"
          title="Tutup Latihan"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Exit Confirmation Dialog */}
      {isConfirmingExit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#24334A] rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in font-sans">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-rally-orange uppercase tracking-wider block font-mono">
                KONFIRMASI // KELUAR LATIHAN
              </span>
              <h3 className="text-base font-black text-white">
                Hentikan Sesi Latihan?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sesi latihan Anda belum selesai. Jika keluar sekarang, progres gerakan saat ini tidak akan tercatat ke logbook.
              </p>
            </div>

            <div className="flex gap-2 pt-1 font-mono">
              <button
                onClick={() => {
                  setIsConfirmingExit(false);
                  setIsPaused(false);
                }}
                className="flex-1 py-3 btn-rally-primary text-white text-xs font-black cursor-pointer"
              >
                LANJUTKAN
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 btn-rally-secondary text-slate-300 hover:text-red-400 text-xs font-black cursor-pointer"
              >
                KELUAR
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="stroke-[#1A2436]"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="86"
                className={`transition-all duration-300 ${
                  phase === 'work' ? 'stroke-[#FF3B00]' : 'stroke-emerald-400'
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
                className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md ${
                  phase === 'work'
                    ? 'bg-rally-orange/20 text-rally-orange border border-rally-orange/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {phase === 'work' ? 'WORK SET' : 'REST INTERVAL'}
              </span>
              <div className="text-5xl font-black font-mono tracking-tight text-white">
                {secondsRemaining}
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">detik tersisa</span>
            </div>
          </div>

          {/* Quick Reps target indicator if work phase */}
          {phase === 'work' && currentItem.targetReps && (
            <div className="mt-2 text-xs font-mono font-bold text-slate-300 bg-[#111827] border border-[#24334A] px-3.5 py-1 rounded-lg">
              TARGET: ~{currentItem.targetReps} REPETISI TERKONTROL
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
        <div className="sticky bottom-4 pt-2 flex items-center gap-2.5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex-1 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98] ${
              isPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800'
                : 'btn-rally-secondary text-white'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5 fill-white" /> LANJUT
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 fill-white" /> JEDA
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-3.5 btn-rally-secondary text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-xs font-black cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
            <span>LEWATI</span>
          </button>

          <button
            onClick={finishWorkout}
            className="px-5 py-3.5 btn-rally-primary text-white text-xs font-black cursor-pointer"
          >
            SELESAI
          </button>
        </div>
      </div>
    </div>
  );
};
