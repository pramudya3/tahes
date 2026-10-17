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
  const [isConfirmingDiscard, setIsConfirmingDiscard] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-md bg-[#111827] border border-[#24334A] rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-rally-orange" />
              <span className="text-[10px] font-black tracking-widest text-rally-orange uppercase font-mono">
                TELEMETRY // DEBRIEF
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
              Sesi Selesai! 🎉
            </h2>
          </div>
          <button
            onClick={() => setIsConfirmingDiscard(true)}
            className="p-1.5 rounded-xl bg-[#0B0F19] border border-[#24334A] text-slate-400 hover:text-white cursor-pointer"
            title="Tutup / Buang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid Tripmeter */}
        <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#0B0F19] rounded-xl border border-[#24334A] text-center font-mono">
          <div>
            <div className="flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase mb-1">
              <Navigation className="w-3 h-3 mr-1 text-rally-orange" /> Jarak
            </div>
            <div className="text-xl font-black text-white">{activity.distanceKm?.toFixed(2) || '0.00'}</div>
            <div className="text-[9px] text-slate-500 uppercase">km</div>
          </div>

          <div className="border-x border-[#24334A]">
            <div className="flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase mb-1">
              <Clock className="w-3 h-3 mr-1 text-blue-400" /> Waktu
            </div>
            <div className="text-xl font-black text-white">{formatDuration(activity.durationSeconds)}</div>
            <div className="text-[9px] text-slate-500 uppercase">durasi</div>
          </div>

          <div>
            <div className="flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase mb-1">
              <Flame className="w-3 h-3 mr-1 text-amber-500" /> Kalori
            </div>
            <div className="text-xl font-black text-amber-400">{activity.caloriesBurned}</div>
            <div className="text-[9px] text-slate-500 uppercase">kcal</div>
          </div>
        </div>

        {/* Pace Banner */}
        {activity.avgPaceString && activity.avgPaceString !== '--:-- /km' && (
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0B0F19] border border-[#24334A] rounded-xl text-xs font-mono">
            <span className="text-slate-400 font-bold">RATA-RATA PACE</span>
            <span className="font-black text-rally-orange">{activity.avgPaceString}</span>
          </div>
        )}

        {/* Title & Notes Input */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Judul Sesi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Jalan Cepat Sore di Lapangan"
              className="w-full px-4 py-2.5 bg-[#0B0F19] border border-[#24334A] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rally-orange text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Catatan Tubuh / Sendi
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Contoh: Lutut aman, napas stabil, ritme langkah konstan..."
              className="w-full px-4 py-2.5 bg-[#0B0F19] border border-[#24334A] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rally-orange text-xs resize-none"
            />
          </div>
        </div>

        {/* Action Buttons or Discard Guard */}
        {!isConfirmingDiscard ? (
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setIsConfirmingDiscard(true)}
              className="py-3 px-4 btn-rally-secondary text-slate-300 hover:text-red-400 font-black text-xs transition cursor-pointer"
            >
              Hapus
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 px-4 btn-rally-primary text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'SIMPAN KE LOGBOOK'}</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl space-y-2.5 animate-fade-in font-mono">
            <span className="text-[11px] font-black text-red-400 uppercase block">
              KONFIRMASI // BUANG DATA SESI?
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Seluruh catatan rute GPS, jarak, dan kalori yang baru saja selesai akan dihapus permanen.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsConfirmingDiscard(false)}
                className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold text-xs cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={onDiscard}
                className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-xs cursor-pointer"
              >
                Ya, Buang Sesi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
