import React, { useState } from 'react';
import { Activity } from '../../types/index';
import { db } from '../../db/index';
import { Flame, Clock, Navigation, CheckCircle2, X } from 'lucide-react';

interface ActivitySummaryModalProps {
  activity: Activity;
  onSaved: (activity: Activity) => void;
  onDiscard: () => void;
}

export const ActivitySummaryModal: React.FC<ActivitySummaryModalProps> = ({
  activity,
  onSaved,
  onDiscard,
}) => {
  const [title, setTitle] = useState(activity.title);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const formatDuration = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    if (hrs > 0) {
      return `${hrs}j ${mins}m ${remainingSecs}d`;
    }
    return `${mins}m ${remainingSecs}d`;
  };

  const handleSave = async () => {
    setSaving(true);
    const finalActivity: Activity = {
      ...activity,
      title: title.trim() || activity.title,
      notes: notes.trim() || undefined,
    };
    await db.activities.add(finalActivity);
    setSaving(false);
    onSaved(finalActivity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-strava-orange animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-white">Selesai Latihan! 🎉</h2>
          </div>
          <button
            onClick={onDiscard}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid ala Strava */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          <div className="text-center">
            <div className="flex items-center justify-center text-slate-400 text-xs mb-1">
              <Navigation className="w-3.5 h-3.5 mr-1 text-strava-orange" /> Jarak
            </div>
            <div className="text-xl font-black text-white">{activity.distanceKm?.toFixed(2) || '0.00'}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">km</div>
          </div>

          <div className="text-center border-x border-slate-800">
            <div className="flex items-center justify-center text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" /> Waktu
            </div>
            <div className="text-xl font-black text-white">{formatDuration(activity.durationSeconds)}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">durasi</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center text-slate-400 text-xs mb-1">
              <Flame className="w-3.5 h-3.5 mr-1 text-amber-500" /> Kalori
            </div>
            <div className="text-xl font-black text-white">{activity.caloriesBurned}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">kkal</div>
          </div>
        </div>

        {/* Pace Banner */}
        {activity.avgPaceString && activity.avgPaceString !== '--:-- /km' && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 rounded-xl text-sm">
            <span className="text-slate-400">Rata-rata Pace</span>
            <span className="font-bold text-strava-orange">{activity.avgPaceString}</span>
          </div>
        )}

        {/* Title & Notes Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Judul Aktivitas
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Jalan Cepat Sore di Lapangan"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-strava-orange text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Catatan / Perasaan Tubuh
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Contoh: Lutut aman, keringat deras, ritme stabil..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-strava-orange text-sm resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={onDiscard}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-medium text-sm transition"
          >
            Hapus Sesi
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 px-4 rounded-xl bg-strava-orange hover:bg-strava-hover text-white font-bold text-sm shadow-lg shadow-strava-orange/20 flex items-center justify-center space-x-1.5 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Sesi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
