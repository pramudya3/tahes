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
      <div className="p-4 border-b border-[#24334A] bg-[#111827]/95 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-rally-orange" />
            <span className="text-[10px] font-black text-rally-orange uppercase tracking-wider block">
              STAGE 03 // WEIGHT TELEMETRY
            </span>
          </div>
          <h1 className="text-lg font-black tracking-tight text-white mt-0.5">
            Progress Menuju {profile.targetWeightKg} kg
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 btn-rally-primary text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>TIMBANG</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Weight Metric Grid */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-[#111827] border border-[#24334A] rounded-2xl shadow-xl font-mono">
          <div className="text-center bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
            <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
              <Scale className="w-3 h-3 text-rally-orange" /> SAAT INI
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {profile.currentWeightKg}
            </div>
            <div className="text-[9px] text-slate-500 uppercase">kg</div>
          </div>

          <div className="text-center bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
            <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
              <TrendingDown className="w-3 h-3 text-emerald-400" /> TURUN
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              -{lostKg}
            </div>
            <div className="text-[9px] text-slate-500 uppercase">kg</div>
          </div>

          <div className="text-center bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
            <div className="text-[9px] text-slate-400 font-bold uppercase">
              TARGET
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {profile.targetWeightKg}
            </div>
            <div className="text-[9px] text-slate-500 uppercase">sisa {remainingKg}kg</div>
          </div>
        </div>

        {/* BMI & Metabolic Row */}
        <div className="p-4 bg-[#111827] border border-[#24334A] rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                INDEKS MASSA TUBUH (BMI)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-white">{bmi}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 font-black">
                  {category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                ZONA TARGET SEHAT
              </span>
              <span className="text-sm font-mono font-black text-emerald-400">18.5 - 24.9</span>
            </div>
          </div>

          {/* Calorie Targets Banner */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#24334A] text-center text-xs font-mono">
            <div className="bg-[#0B0F19] p-2.5 rounded-xl border border-[#24334A]">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">BMR</span>
              <span className="font-bold text-slate-200">~{bmr} kcal</span>
            </div>
            <div className="bg-[#0B0F19] p-2.5 rounded-xl border border-[#24334A]">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">TDEE</span>
              <span className="font-bold text-slate-200">~{tdee} kcal</span>
            </div>
            <div className="bg-[#0B0F19] p-2.5 rounded-xl border border-rally-orange/50">
              <span className="text-[9px] text-rally-orange block uppercase font-black">DEFISIT</span>
              <span className="font-black text-white">~{deficitCalorieTarget} kcal</span>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation: Chart vs AI Mentor */}
        <div className="flex bg-[#111827] p-1 rounded-xl border border-[#24334A] text-xs">
          <button
            onClick={() => setSubTab('chart')}
            className={`flex-1 py-2.5 rounded-lg font-black transition flex items-center justify-center gap-1.5 ${
              subTab === 'chart'
                ? 'bg-rally-orange text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>GRAFIK & LOG</span>
          </button>
          <button
            onClick={() => setSubTab('chat')}
            className={`flex-1 py-2.5 rounded-lg font-black transition flex items-center justify-center gap-1.5 ${
              subTab === 'chat'
                ? 'bg-rally-orange text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI MENTOR</span>
          </button>
        </div>

        {/* Tab Content */}
        {subTab === 'chart' ? (
          <div className="space-y-4">
            <WeightChart entries={weightLogs} targetWeightKg={profile.targetWeightKg} />

            {/* Weight Logs History List */}
            <div className="bg-[#111827] border border-[#24334A] rounded-2xl p-4 shadow-xl space-y-3">
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
