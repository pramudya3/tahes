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
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

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
    <div className="w-full bg-[#121214] border border-[#27272A] rounded-2xl p-5 shadow-xl space-y-4 transition hover:border-zinc-500">
      {/* Header: Activity Type & Timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Functional Activity Icon Badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-md bg-[#18181B] border-zinc-700 text-white"
          >
            {isOutdoor ? (
              <Footprints className="w-5 h-5" />
            ) : (
              <Dumbbell className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{userName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider bg-[#09090B] text-zinc-300 border border-[#27272A] flex items-center gap-1.5">
                {activity.type === 'brisk_walk'
                  ? 'OUTDOOR // JALAN CEPAT'
                  : activity.type === 'run'
                  ? 'OUTDOOR // LARI'
                  : 'INDOOR // BODYWEIGHT'}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">{formatDate(activity.startTime)}</span>
          </div>
        </div>

        {/* Delete Action with In-Flight Confirmation Guard */}
        {onDelete && (
          <div>
            {!isConfirmingDelete ? (
              <button
                onClick={() => setIsConfirmingDelete(true)}
                className="p-2 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-[#09090B] transition cursor-pointer"
                title="Hapus Aktivitas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#09090B] p-1 rounded-xl border border-rose-500/40 animate-fade-in text-[10px] font-mono">
                <span className="text-rose-400 font-bold px-1.5">Hapus?</span>
                <button
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => onDelete(activity.id)}
                  className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black cursor-pointer"
                >
                  Ya
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title & Notes */}
      <div>
        <h4 className="text-base font-black text-white tracking-tight">
          {activity.title}
        </h4>
        {activity.notes && (
          <p className="text-xs text-zinc-400 mt-1 italic font-sans bg-[#09090B] px-3 py-1.5 rounded-lg border border-[#27272A]/80">
            &ldquo;{activity.notes}&rdquo;
          </p>
        )}
      </div>

      {/* 3-Column Tripmeter Grid */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-[#09090B] rounded-xl border border-[#27272A] text-center">
        {isOutdoor ? (
          <div>
            <div className="text-[9px] text-zinc-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
              <Navigation className="w-2.5 h-2.5 text-white" /> JARAK
            </div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {activity.distanceKm?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[8px] text-zinc-500 uppercase font-mono">km</div>
          </div>
        ) : (
          <div>
            <div className="text-[9px] text-zinc-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-white" /> FORMAT
            </div>
            <div className="text-xs font-black text-white mt-1">CIRCUIT</div>
            <div className="text-[8px] text-zinc-500 uppercase font-mono">RAMAH SENDI</div>
          </div>
        )}

        <div className="border-x border-[#27272A]">
          <div className="text-[9px] text-zinc-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
            <Clock className="w-2.5 h-2.5 text-zinc-400" /> WAKTU
          </div>
          <div className="text-lg font-black font-mono text-white mt-0.5">
            {formatTime(activity.durationSeconds)}
          </div>
          <div className="text-[8px] text-zinc-500 uppercase font-mono">durasi</div>
        </div>

        <div>
          <div className="text-[9px] text-zinc-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
            <Flame className="w-2.5 h-2.5 text-zinc-300" /> KALORI
          </div>
          <div className="text-lg font-black font-mono text-zinc-200 mt-0.5">
            {activity.caloriesBurned}
          </div>
          <div className="text-[8px] text-zinc-500 uppercase font-mono">kcal</div>
        </div>
      </div>

      {/* Pace / Route Snippet if available */}
      {isOutdoor && activity.avgPaceString && (
        <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
          <span className="font-bold">STAGE SPLIT:</span>
          <span className="font-mono font-black text-white">{activity.avgPaceString}</span>
        </div>
      )}
    </div>
  );
};
