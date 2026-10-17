import React, { useState } from 'react';
import { db, getUserProfile, saveUserProfile } from '../../db/index';
import { WeightEntry } from '../../types/index';
import { Scale, X, CheckCircle2 } from 'lucide-react';

interface WeightLogModalProps {
  onClose: () => void;
  onSaved: (entry: WeightEntry) => void;
}

export const WeightLogModal: React.FC<WeightLogModalProps> = ({
  onClose,
  onSaved,
}) => {
  const profile = getUserProfile();
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [weightKg, setWeightKg] = useState(profile.currentWeightKg.toString());
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightKg);
    if (!val || val <= 0) return;

    setIsSubmitting(true);
    const entry: WeightEntry = {
      id: `w_${Date.now()}`,
      date,
      weightKg: Math.round(val * 10) / 10,
      notes: notes.trim() || undefined,
    };

    await db.weight_logs.add(entry);
    saveUserProfile({ currentWeightKg: entry.weightKg });
    setIsSubmitting(false);
    onSaved(entry);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-strava-orange/20 rounded-xl text-strava-orange">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white">Catat Berat Badan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Tanggal Timbangan
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-strava-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Berat Badan (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Contoh: 82.5"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-black text-xl focus:outline-none focus:border-strava-orange"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                KG
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Disarankan timbang pagi hari setelah buang air & sebelum sarapan.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Terasa lebih enteng, habis jalan 4 km"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-strava-orange"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-800 text-slate-400 text-sm font-semibold hover:text-white transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-strava-orange hover:bg-strava-hover text-white text-sm font-bold shadow-lg shadow-strava-orange/25 flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
