import React, { useState, useEffect } from 'react';
import { db, getUserProfile } from '../../db/index';
import { Activity } from '../../types/index';
import { calculateWeeklyStats, calculateStreak } from '../../utils/feedStats';
import { ActivityCard } from './ActivityCard';
import {
  Footprints,
  Dumbbell,
  Zap,
  Play,
  TrendingUp,
} from 'lucide-react';

interface FeedDashboardProps {
  onNavigateTab: (tab: 'record' | 'workout' | 'progress') => void;
  indoorOnlyMode?: boolean;
}

export const FeedDashboard: React.FC<FeedDashboardProps> = ({
  onNavigateTab,
  indoorOnlyMode,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profile, setProfile] = useState(getUserProfile());

  const isIndoor = indoorOnlyMode !== undefined ? indoorOnlyMode : (profile.indoorOnlyMode ?? false);

  const loadActivities = async () => {
    const list = await db.activities.toArray();
    // Sort descending by time
    list.sort((a, b) => b.startTime - a.startTime);
    setActivities(list);
    setProfile(getUserProfile());
  };

  useEffect(() => {
    loadActivities();
  }, [indoorOnlyMode]);

  const handleDeleteActivity = async (id: string) => {
    await db.activities.delete(id);
    loadActivities();
  };

  const weekly = calculateWeeklyStats(activities);
  const streak = calculateStreak(activities);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 text-white min-h-[calc(100vh-5rem)] pb-20">
      {/* Top Header */}
      <div className="p-4 border-b border-[#27272A] bg-[#121214]/95 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/icon-192.png"
            alt="Tahes Logo"
            className="w-10 h-10 rounded-xl border border-zinc-700 shadow-md shrink-0 object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-sm bg-white" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                {isIndoor ? 'INDOOR BASE // CONSOLE' : 'TELEMETRY // CONSOLE'}
              </span>
            </div>
            <h1 className="text-base font-black tracking-tight text-white mt-0.5 font-mono">
              {profile.name} // {profile.currentWeightKg}KG ➔ {profile.targetWeightKg}KG
            </h1>
          </div>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-xl text-zinc-200 shadow-sm">
          <Zap className="w-4 h-4 fill-zinc-200" />
          <span className="text-xs font-black font-mono">{streak} HARI STREAK</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Weekly Progress Card (Monolith Telemetry) */}
        <div className="p-5 bg-[#121214] border border-[#27272A] rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-white" /> 7-DAY STAGE RECAP
            </span>
            <span className="text-zinc-400 font-mono font-bold bg-[#09090B] px-2 py-0.5 rounded-md border border-[#27272A]">
              {isIndoor ? 'FOKUS RUMAHAN' : `${weekly.totalWorkouts} SESI TERCATAT`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                {isIndoor ? 'SESI WORKOUT' : 'STAGE KM'}
              </span>
              <div className="text-2xl font-black text-white mt-0.5">
                {isIndoor ? weekly.totalWorkouts : weekly.totalDistanceKm}
              </div>
              <span className="text-[9px] text-zinc-500 uppercase">
                {isIndoor ? 'sesi rumah' : 'km total'}
              </span>
            </div>

            <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                TOTAL WAKTU
              </span>
              <div className="text-2xl font-black text-white mt-0.5">
                {Math.round(weekly.totalDurationSeconds / 60)}
              </div>
              <span className="text-[9px] text-zinc-500 uppercase">menit</span>
            </div>

            <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                KALORI
              </span>
              <div className="text-2xl font-black text-zinc-200 mt-0.5">
                {weekly.totalCalories}
              </div>
              <span className="text-[9px] text-zinc-500 uppercase">kcal</span>
            </div>
          </div>
        </div>

        {/* Quick Launchers */}
        {isIndoor ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('workout')}
              className="p-4 bg-[#121214] border border-[#27272A] hover:border-white rounded-2xl shadow-lg transition text-left space-y-2 group active:scale-[0.98] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#18181B] text-white flex items-center justify-center border border-[#27272A] group-hover:bg-white group-hover:text-black transition">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black text-white block tracking-tight">LATIHAN // WORKOUT RUMAH</span>
                <span className="text-[11px] text-zinc-400">Kalistenik Tanpa Alat</span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('progress')}
              className="p-4 bg-[#121214] border border-[#27272A] hover:border-emerald-500 rounded-2xl shadow-lg transition text-left space-y-2 group active:scale-[0.98] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white transition">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black text-white block tracking-tight">PROGRES // TIMBANGAN</span>
                <span className="text-[11px] text-zinc-400">Catat Berat & Etape</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('record')}
              className="p-4 bg-[#121214] border border-[#27272A] hover:border-white rounded-2xl shadow-lg transition text-left space-y-2 group active:scale-[0.98] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#18181B] text-white flex items-center justify-center border border-[#27272A] group-hover:bg-white group-hover:text-black transition">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black text-white block tracking-tight">OUTDOOR // JALAN & LARI</span>
                <span className="text-[11px] text-zinc-400">Jalan Cepat & Lari</span>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('workout')}
              className="p-4 bg-[#121214] border border-[#27272A] hover:border-zinc-400 rounded-2xl shadow-lg transition text-left space-y-2 group active:scale-[0.98] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#18181B] text-white flex items-center justify-center border border-[#27272A] group-hover:bg-white group-hover:text-black transition">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black text-white block tracking-tight">INDOOR // WORKOUT RUMAH</span>
                <span className="text-[11px] text-zinc-400">Kalistenik Ramah Sendi</span>
              </div>
            </button>
          </div>
        )}

        {/* Activity Feed Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <h3 className="font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>LOGBOOK AKTIVITAS</span>
            </h3>
            <span className="text-slate-500 font-mono font-bold">{activities.length} TOTAL ENTRY</span>
          </div>

          {activities.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Belum Ada Aktivitas</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Mulai jalan santai di luar atau jalankan sirkuit latihan di rumah untuk mencatat aktivitas pertama Anda.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab(isIndoor ? 'workout' : 'record')}
                className="px-5 py-2.5 btn-rally-primary text-white text-xs font-black cursor-pointer uppercase tracking-wider"
              >
                Mulai Latihan Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  userName={profile.name}
                  onDelete={handleDeleteActivity}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
