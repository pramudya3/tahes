import React, { useState, useEffect } from 'react';
import { db, getUserProfile } from '../../db/index';
import { WeightEntry } from '../../types/index';
import { calculateBMI, calculateBMR, calculateTDEE } from '../../utils/calculations';
import { WeightChart } from './WeightChart';
import { WeightLogModal } from './WeightLogModal';
import { AICoachChat } from './AICoachChat';
import {
  TrendingDown,
  Scale,
  Plus,
  MessageSquare,
  LineChart,
} from 'lucide-react';

export const ProgressHub: React.FC = () => {
  const [profile, setProfile] = useState(getUserProfile());
  const [weightLogs, setWeightLogs] = useState<WeightEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subTab, setSubTab] = useState<'chart' | 'chat'>('chart');

  const loadData = async () => {
    const logs = await db.weight_logs.toArray();
    setWeightLogs(logs);
    setProfile(getUserProfile());
  };

  useEffect(() => {
    loadData();
  }, []);

  const { bmi, category } = calculateBMI(profile.currentWeightKg, profile.heightCm);
  const bmr = calculateBMR(profile.currentWeightKg, profile.heightCm, profile.age, 'male');
  const tdee = calculateTDEE(bmr, 1.375);
  const deficitCalorieTarget = Math.round(tdee - 450); // Safe 450 kcal deficit

  const initialWeight = 83.0;
  const lostKg = Math.max(0, Math.round((initialWeight - profile.currentWeightKg) * 10) / 10);
  const remainingKg = Math.max(0, Math.round((profile.currentWeightKg - profile.targetWeightKg) * 10) / 10);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 text-white min-h-[calc(100vh-5rem)] pb-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-strava-orange" />
            <span>PROGRESS & MENTOR</span>
          </h1>
          <p className="text-xs text-slate-400">
            Perjalanan Menuju {profile.targetWeightKg} kg (TB {profile.heightCm} cm)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-strava-orange hover:bg-strava-hover text-white text-xs font-bold shadow-md shadow-strava-orange/20 flex items-center gap-1.5 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Timbang</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Weight Metric Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
          <div className="text-center">
            <div className="text-[11px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <Scale className="w-3.5 h-3.5 text-strava-orange" /> Saat Ini
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {profile.currentWeightKg}
            </div>
            <div className="text-[10px] text-slate-500">kg</div>
          </div>

          <div className="text-center border-x border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Turun
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              -{lostKg}
            </div>
            <div className="text-[10px] text-slate-500">kg dari awal</div>
          </div>

          <div className="text-center">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">
              Target
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {profile.targetWeightKg}
            </div>
            <div className="text-[10px] text-slate-500">sisa {remainingKg} kg</div>
          </div>
        </div>

        {/* BMI & Metabolic Row */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                Indeks Massa Tubuh (BMI)
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-white">{bmi}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                  {category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                Target Sehat
              </span>
              <span className="text-sm font-bold text-emerald-400">18.5 - 24.9</span>
            </div>
          </div>

          {/* Calorie Targets Banner */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">BMR</span>
              <span className="font-bold text-slate-200">~{bmr} kkal</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">TDEE</span>
              <span className="font-bold text-slate-200">~{tdee} kkal</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-strava-orange/40">
              <span className="text-[10px] text-strava-orange block uppercase font-bold">Defisit</span>
              <span className="font-bold text-white">~{deficitCalorieTarget} kkal</span>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation: Chart vs AI Mentor */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('chart')}
            className={`flex-1 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'chart'
                ? 'bg-strava-orange text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Grafik & Riwayat</span>
          </button>
          <button
            onClick={() => setSubTab('chat')}
            className={`flex-1 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              subTab === 'chat'
                ? 'bg-strava-orange text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tanya AI Mentor</span>
          </button>
        </div>

        {/* Tab Content */}
        {subTab === 'chart' ? (
          <div className="space-y-4">
            <WeightChart entries={weightLogs} targetWeightKg={profile.targetWeightKg} />

            {/* Weight Logs History List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase tracking-wider">
                  Riwayat Timbangan
                </span>
                <span className="text-[11px] text-slate-400">{weightLogs.length} Catatan</span>
              </div>

              {weightLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  Belum ada catatan timbangan. Tekan tombol + Timbang di atas.
                </p>
              ) : (
                <div className="divide-y divide-slate-800/80 max-h-56 overflow-y-auto">
                  {[...weightLogs]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{item.date}</span>
                          {item.notes && (
                            <span className="text-[11px] text-slate-400">{item.notes}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-black text-sm text-strava-orange">
                            {item.weightKg} kg
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <AICoachChat />
        )}
      </div>

      {/* Log Modal */}
      {isModalOpen && (
        <WeightLogModal
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};
