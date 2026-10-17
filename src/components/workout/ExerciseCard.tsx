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
    <div className="w-full bg-[#111827] border border-[#24334A] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rally-orange/15 text-rally-orange border border-rally-orange/30">
              {exercise.category}
            </span>
            {exercise.jointFriendly && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Ramah Sendi // Zero Impact
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-white mt-2 tracking-tight">
            {exercise.name}
          </h3>
        </div>

        {totalSets && (
          <div className="px-3 py-1 rounded-xl bg-[#0B0F19] border border-[#24334A] text-right font-mono">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">STAGE SET</span>
            <span className="text-base font-black text-white">
              {currentSet || 1} / {totalSets}
            </span>
          </div>
        )}
      </div>

      {/* Knee Safety Tip (Mentor Highlight for 83kg) */}
      {exercise.kneeSafetyTip && (
        <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-black block text-amber-400 uppercase tracking-wider text-[11px]">Safety Alert // Sendi & Lutut:</span>
            <span className="mt-0.5 block">{exercise.kneeSafetyTip}</span>
          </div>
        </div>
      )}

      {/* Target Muscles */}
      {!compact && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Target:</span>
          {exercise.targetMuscles.map((muscle) => (
            <span
              key={muscle}
              className="text-[11px] bg-[#0B0F19] border border-[#24334A] px-2.5 py-0.5 rounded-md text-slate-300 font-mono font-medium"
            >
              {muscle}
            </span>
          ))}
        </div>
      )}

      {/* Form Cues */}
      <div className="space-y-2 pt-2 border-t border-[#24334A]">
        <div className="text-xs font-black text-slate-300 uppercase tracking-wider">
          PANDUAN POSTUR TEPAT:
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
