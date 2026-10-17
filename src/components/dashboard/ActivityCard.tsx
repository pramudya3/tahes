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
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 transition hover:border-slate-700/80">
      {/* Header: User & Type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-strava-orange to-amber-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-strava-orange/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{userName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                {isOutdoor ? (
                  <Footprints className="w-3 h-3 text-strava-orange" />
                ) : (
                  <Dumbbell className="w-3 h-3 text-amber-400" />
                )}
                {activity.type === 'brisk_walk'
                  ? 'Jalan Cepat'
                  : activity.type === 'run'
                  ? 'Lari Outdoor'
                  : 'Bodyweight'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{formatDate(activity.startTime)}</span>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
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
          <p className="text-xs text-slate-300 mt-1 italic">
            &ldquo;{activity.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Strava 3-Column Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-center">
        {isOutdoor ? (
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <Navigation className="w-3 h-3 text-strava-orange" /> Jarak
            </div>
            <div className="text-lg font-black text-white mt-0.5">
              {activity.distanceKm?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[9px] text-slate-500 uppercase">km</div>
          </div>
        ) : (
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-strava-orange" /> Format
            </div>
            <div className="text-sm font-black text-white mt-1">Sirkuit</div>
            <div className="text-[9px] text-slate-500 uppercase">Beban Tubuh</div>
          </div>
        )}

        <div className="border-x border-slate-800">
          <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" /> Waktu
          </div>
          <div className="text-lg font-black text-white mt-0.5">
            {formatTime(activity.durationSeconds)}
          </div>
          <div className="text-[9px] text-slate-500 uppercase">durasi</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-amber-500" /> Kalori
          </div>
          <div className="text-lg font-black text-amber-400 mt-0.5">
            {activity.caloriesBurned}
          </div>
          <div className="text-[9px] text-slate-500 uppercase">kkal</div>
        </div>
      </div>

      {/* Pace / Route Snippet if available */}
      {isOutdoor && activity.avgPaceString && (
        <div className="flex items-center justify-between text-xs px-2 text-slate-400">
          <span>Rata-rata Pace</span>
          <span className="font-bold text-strava-orange">{activity.avgPaceString}</span>
        </div>
      )}
    </div>
  );
};
