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
}

export const FeedDashboard: React.FC<FeedDashboardProps> = ({ onNavigateTab }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profile, setProfile] = useState(getUserProfile());

  const loadActivities = async () => {
    const list = await db.activities.toArray();
    // Sort descending by time
    list.sort((a, b) => b.startTime - a.startTime);
    setActivities(list);
    setProfile(getUserProfile());
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleDeleteActivity = async (id: string) => {
    await db.activities.delete(id);
    loadActivities();
  };

  const weekly = calculateWeeklyStats(activities);
  const streak = calculateStreak(activities);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 text-white min-h-[calc(100vh-5rem)] pb-20">
      {/* Top Header */}
      <div className="p-4 border-b border-[#24334A] bg-[#111827]/95 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-rally-orange" />
            <span className="text-[10px] font-black text-rally-orange uppercase tracking-widest block">
              STAGE TELEMETRY // ATHLETE CONSOLE
            </span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white mt-0.5">
            {profile.name} // 83KG ➔ 65KG
          </h1>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-400 shadow-sm">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span className="text-xs font-black font-mono">{streak} HARI STREAK</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Weekly Progress Card (Rally Telemetry) */}
        <div className="p-5 bg-[#111827] border border-[#24334A] rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-rally-orange" /> 7-DAY STAGE RECAP
            </span>
            <span className="text-slate-400 font-mono font-bold bg-[#0B0F19] px-2 py-0.5 rounded-md border border-[#24334A]">
              {weekly.totalWorkouts} SESI TERCATAT
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                STAGE KM
              </span>
              <div className="text-2xl font-black font-mono text-white mt-0.5">
                {weekly.totalDistanceKm}
              </div>
              <span className="text-[9px] text-slate-500 font-mono uppercase">km total</span>
            </div>

            <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                TOTAL WAKTU
              </span>
              <div className="text-2xl font-black font-mono text-white mt-0.5">
                {Math.round(weekly.totalDurationSeconds / 60)}
              </div>
              <span className="text-[9px] text-slate-500 font-mono uppercase">menit</span>
            </div>

            <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                KALORI
              </span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
                {weekly.totalCalories}
              </div>
              <span className="text-[9px] text-slate-500 font-mono uppercase">kcal</span>
            </div>
          </div>
        </div>

        {/* Quick Stage Launchers with Chamfered Mechanical Push Feel */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigateTab('record')}
            className="p-4 bg-[#111827] border border-[#24334A] hover:border-rally-orange rounded-2xl shadow-lg transition text-left space-y-2 group active:scale-[0.98] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rally-orange/15 text-rally-orange flex items-center justify-center border border-rally-orange/30 group-hover:bg-rally-orange group-hover:text-white transition">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block tracking-tight">STAGE 01 // GPS</span>
              <span className="text-[11px] text-slate-400">Jalan Cepat & Lari</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('workout')}
            className="p-4 bg-[#111827] border border-[#24334A] hover:border-amber-500 rounded-2xl shadow-lg transition text-left space-y-2 group active:scale-[0.98] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-white transition">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block tracking-tight">STAGE 02 // CIRCUIT</span>
              <span className="text-[11px] text-slate-400">Kalistenik Ramah Sendi</span>
            </div>
          </button>
        </div>

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
                onClick={() => onNavigateTab('record')}
                className="px-4 py-2 bg-strava-orange text-white text-xs font-bold rounded-xl shadow"
              >
                Mulai Olahraga Sekarang
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
