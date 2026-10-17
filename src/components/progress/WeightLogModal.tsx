import React, { useState } from 'react';
import { db, getUserProfile, saveUserProfile } from '../../db/index';
import { WeightEntry } from '../../types/index';
import { X, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-sm bg-[#121214] border border-[#27272A] rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-white" />
            <h2 className="text-lg font-black text-white">Catat Berat Badan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#09090B] border border-[#27272A] text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
              Tanggal Timbangan
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-sm focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
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
                className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] rounded-xl text-white font-black text-xl focus:outline-none focus:border-white font-mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500 font-mono">
                KG
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Disarankan timbang pagi hari setelah buang air & sebelum sarapan.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 font-mono">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Terasa lebih enteng, habis jalan 4 km"
              className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl btn-rally-secondary text-zinc-300 text-sm font-semibold hover:text-white transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl btn-rally-primary text-black text-sm font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
              <span>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
