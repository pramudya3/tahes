import React from 'react';
import { Activity } from '../../types/index';
import {
  Flame,
  Clock,
  Navigation,
  Trash2,
  Dumbbell,
  Footprints,
  Sparkles,
} from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  userName?: string;
  onDelete?: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  userName = 'Athlete',
  onDelete,
}) => {
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remSecs = secs % 60;
    if (hrs > 0) return `${hrs}j ${mins}m`;
    return `${mins}m ${remSecs}d`;
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOutdoor = activity.type === 'brisk_walk' || activity.type === 'run';

  return (
    <div className="w-full bg-[#111827] border border-[#24334A] rounded-2xl p-5 shadow-xl space-y-4 transition hover:border-rally-orange/60">
      {/* Header: User & Type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rally-orange flex items-center justify-center font-black text-white text-sm shadow-md shadow-rally-orange/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{userName}</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-md font-black uppercase tracking-wider bg-[#0B0F19] text-slate-300 border border-[#24334A] flex items-center gap-1.5">
                {isOutdoor ? (
                  <Footprints className="w-3 h-3 text-rally-orange" />
                ) : (
                  <Dumbbell className="w-3 h-3 text-amber-400" />
                )}
                {activity.type === 'brisk_walk'
                  ? 'STAGE // JALAN CEPAT'
                  : activity.type === 'run'
                  ? 'STAGE // LARI OUTDOOR'
                  : 'CIRCUIT // BODYWEIGHT'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{formatDate(activity.startTime)}</span>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-[#0B0F19] transition"
            title="Hapus Aktivitas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Title & Notes */}
      <div>
        <h4 className="text-base font-black text-white tracking-tight">
          {activity.title}
        </h4>
        {activity.notes && (
          <p className="text-xs text-slate-300 mt-1 italic font-sans bg-[#0B0F19] px-3 py-1.5 rounded-lg border border-[#24334A]/80">
            &ldquo;{activity.notes}&rdquo;
          </p>
        )}
      </div>

      {/* 3-Column Tripmeter Grid */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-[#0B0F19] rounded-xl border border-[#24334A] text-center">
        {isOutdoor ? (
          <div>
            <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
              <Navigation className="w-2.5 h-2.5 text-rally-orange" /> JARAK
            </div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {activity.distanceKm?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[8px] text-slate-500 uppercase font-mono">km</div>
          </div>
        ) : (
          <div>
            <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-rally-orange" /> FORMAT
            </div>
            <div className="text-xs font-black text-white mt-1">CIRCUIT</div>
            <div className="text-[8px] text-slate-500 uppercase font-mono">RAMAH SENDI</div>
          </div>
        )}

        <div className="border-x border-[#24334A]">
          <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
            <Clock className="w-2.5 h-2.5 text-slate-400" /> WAKTU
          </div>
          <div className="text-lg font-black font-mono text-white mt-0.5">
            {formatTime(activity.durationSeconds)}
          </div>
          <div className="text-[8px] text-slate-500 uppercase font-mono">durasi</div>
        </div>

        <div>
          <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
            <Flame className="w-2.5 h-2.5 text-amber-500" /> KALORI
          </div>
          <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
            {activity.caloriesBurned}
          </div>
          <div className="text-[8px] text-slate-500 uppercase font-mono">kcal</div>
        </div>
      </div>

      {/* Pace / Route Snippet if available */}
      {isOutdoor && activity.avgPaceString && (
        <div className="flex items-center justify-between text-xs px-1 text-slate-400">
          <span className="font-bold">STAGE SPLIT:</span>
          <span className="font-mono font-black text-rally-orange">{activity.avgPaceString}</span>
        </div>
      )}
    </div>
  );
};
