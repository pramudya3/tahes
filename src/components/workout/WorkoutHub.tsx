import React, { useState } from 'react';
import { mentorPrograms, calculateRoutineEstimate } from '../../data/programs';
import { exercisesList } from '../../data/exercises';
import { WorkoutRoutine, Activity } from '../../types/index';
import { getUserProfile } from '../../db/index';
import { WorkoutPlayer } from './WorkoutPlayer';
import { ExerciseCard } from './ExerciseCard';
import { Flame, Clock, Play, Dumbbell, ShieldCheck, ChevronRight } from 'lucide-react';

interface WorkoutHubProps {
  onActivitySaved?: (activity: Activity) => void;
}

export const WorkoutHub: React.FC<WorkoutHubProps> = ({ onActivitySaved }) => {
  const [activeRoutine, setActiveRoutine] = useState<WorkoutRoutine | null>(null);
  const [selectedTab, setSelectedTab] = useState<'programs' | 'exercises'>('programs');
  const [inspectExerciseId, setInspectExerciseId] = useState<string | null>(null);

  const profile = getUserProfile();

  const handleRoutineCompleted = (activity: Activity) => {
    setActiveRoutine(null);
    if (onActivitySaved) onActivitySaved(activity);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 text-white min-h-[calc(100vh-5rem)] pb-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-strava-orange" />
              <span>WORKOUT HUB</span>
            </h1>
            <p className="text-xs text-slate-400">
              Latihan Tanpa Alat &bull; Ramah Sendi (BB 83 kg)
            </p>
          </div>

          {/* Sub Tab switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedTab('programs')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTab === 'programs'
                  ? 'bg-strava-orange text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Program
            </button>
            <button
              onClick={() => setSelectedTab('exercises')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTab === 'exercises'
                  ? 'bg-strava-orange text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gerakan
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4">
        {selectedTab === 'programs' ? (
          <>
            {/* Mentor Advice Banner */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Catatan Mentor Anda
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Di berat badan 83 kg, fokus utama adalah <strong>konsistensi dan perlindungan sendi</strong>. Semua program di bawah ini dirancang bebas dari lompatan kasar (*low impact*) untuk melindungi lutut Anda selagi membakar kalori.
              </p>
            </div>

            {/* List of Programs */}
            <div className="space-y-3">
              {mentorPrograms.map((routine) => {
                const { totalDurationMinutes, estimatedCalories } = calculateRoutineEstimate(
                  routine,
                  profile.currentWeightKg
                );

                return (
                  <div
                    key={routine.id}
                    className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl shadow-xl transition space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-strava-orange uppercase tracking-wider">
                          {routine.level === 'beginner' ? 'Pemula Bersahabat' : 'Lanjutan'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {routine.exercises.length} Gerakan
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white mt-1">
                        {routine.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{routine.subtitle}</p>
                    </div>

                    {/* Stats Pill */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>~{totalDurationMinutes} Menit</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>~{estimatedCalories} kkal (83kg)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveRoutine(routine)}
                      className="w-full py-3.5 rounded-2xl bg-strava-orange hover:bg-strava-hover text-white font-bold text-sm shadow-lg shadow-strava-orange/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Mulai Sesi Latihan
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Exercise Catalog Tab */
          <div className="space-y-3">
            <p className="text-xs text-slate-400 px-1">
              Ketuk gerakan untuk membaca instruksi postur dan tips perlindungan sendi:
            </p>

            {exercisesList.map((exercise) => {
              const isInspected = inspectExerciseId === exercise.id;
              return (
                <div key={exercise.id} className="space-y-2">
                  <div
                    onClick={() =>
                      setInspectExerciseId(isInspected ? null : exercise.id)
                    }
                    className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {exercise.name}
                        </span>
                        {exercise.jointFriendly && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {exercise.targetMuscles.join(', ')}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isInspected ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {isInspected && (
                    <div className="pt-1">
                      <ExerciseCard exercise={exercise} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Workout Player Modal */}
      {activeRoutine && (
        <WorkoutPlayer
          routine={activeRoutine}
          onFinish={handleRoutineCompleted}
          onClose={() => setActiveRoutine(null)}
        />
      )}
    </div>
  );
};
