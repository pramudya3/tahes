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
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black text-strava-orange uppercase tracking-widest block">
            PERSONAL STRAVA
          </span>
          <h1 className="text-xl font-black tracking-tight text-white">
            Halo, {profile.name}! 👋
          </h1>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-400">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span className="text-xs font-black">{streak} Hari Streak</span>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Weekly Progress Card (Athletic Ring Style) */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-strava-orange" /> Statistik 7 Hari Terakhir
            </span>
            <span className="text-slate-500 font-semibold">{weekly.totalWorkouts} Sesi</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium uppercase block">
                Total Jarak
              </span>
              <div className="text-xl font-black text-white mt-0.5">
                {weekly.totalDistanceKm}
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">km</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium uppercase block">
                Total Waktu
              </span>
              <div className="text-xl font-black text-white mt-0.5">
                {Math.round(weekly.totalDurationSeconds / 60)}
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">menit</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium uppercase block">
                Total Kalori
              </span>
              <div className="text-xl font-black text-amber-400 mt-0.5">
                {weekly.totalCalories}
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">kkal</span>
            </div>
          </div>
        </div>

        {/* Quick Launch CTA Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigateTab('record')}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-strava-orange rounded-3xl shadow-lg transition text-left space-y-2 group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-2xl bg-strava-orange/20 text-strava-orange flex items-center justify-center group-hover:bg-strava-orange group-hover:text-white transition">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">GPS Outdoor</span>
              <span className="text-[11px] text-slate-400">Jalan Cepat & Lari</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('workout')}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-3xl shadow-lg transition text-left space-y-2 group active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">Sirkuit Indoor</span>
              <span className="text-[11px] text-slate-400">Kalistenik Ramah Lutut</span>
            </div>
          </button>
        </div>

        {/* Activity Feed Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <h3 className="font-bold text-white uppercase tracking-wider">
              Aktivitas Terbaru
            </h3>
            <span className="text-slate-500">{activities.length} Total</span>
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
