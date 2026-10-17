import React from 'react';
import { ExerciseItem } from '../../types/index';
import { ShieldCheck, Target, CheckCircle } from 'lucide-react';

interface ExerciseCardProps {
  exercise: ExerciseItem;
  currentSet?: number;
  totalSets?: number;
  compact?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  currentSet,
  totalSets,
  compact = false,
}) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-strava-orange/15 text-strava-orange border border-strava-orange/20">
              {exercise.category}
            </span>
            {exercise.jointFriendly && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Ramah Sendi
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-white mt-1.5 tracking-tight">
            {exercise.name}
          </h3>
        </div>

        {totalSets && (
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700/60 text-right">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Set</span>
            <span className="text-sm font-black text-white">
              {currentSet || 1} / {totalSets}
            </span>
          </div>
        )}
      </div>

      {/* Knee Safety Tip (Mentor Highlight for 83kg) */}
      {exercise.kneeSafetyTip && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-300">Tips Keselamatan Lutut & Sendi:</span>
            <span>{exercise.kneeSafetyTip}</span>
          </div>
        </div>
      )}

      {/* Target Muscles */}
      {!compact && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Target:</span>
          {exercise.targetMuscles.map((muscle) => (
            <span
              key={muscle}
              className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded-lg text-slate-300 font-medium"
            >
              {muscle}
            </span>
          ))}
        </div>
      )}

      {/* Form Cues */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Panduan Postur:
        </div>
        <ul className="space-y-1.5">
          {exercise.formCues.map((cue, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{cue}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
