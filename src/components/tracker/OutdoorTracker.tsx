import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, AlertCircle } from 'lucide-react';
import { useGeolocationTracker } from '../../hooks/useGeolocationTracker';
import { Activity } from '../../types/index';
import { ActivitySummaryModal } from './ActivitySummaryModal';
import { LeafletRouteMap } from './LeafletRouteMap';
import { soundService } from '../../utils/audio';
import { getUserProfile } from '../../db/index';

interface OutdoorTrackerProps {
  onActivitySaved?: (activity: Activity) => void;
}

export const OutdoorTracker: React.FC<OutdoorTrackerProps> = ({ onActivitySaved }) => {
  const profile = getUserProfile();
  const {
    isTracking,
    isPaused,
    distanceKm,
    durationSeconds,
    avgPace,
    calories,
    route,
    currentPosition,
    error,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useGeolocationTracker();

  const [selectedType, setSelectedType] = useState<'brisk_walk' | 'run'>('brisk_walk');
  const [completedActivity, setCompletedActivity] = useState<Activity | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remSecs = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remSecs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleFinish = () => {
    const act = stopTracking();
    setCompletedActivity(act);
  };

  const startHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    const holdDurationMs = 1200;
    const intervalMs = 25;
    const increment = (intervalMs / holdDurationMs) * 100;

    let current = 0;
    holdIntervalRef.current = setInterval(() => {
      current += increment;
      if (current >= 100) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        setHoldProgress(0);
        handleFinish();
      } else {
        setHoldProgress(current);
      }
    }, intervalMs);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setHoldProgress(0);
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-5rem)] w-full max-w-lg mx-auto bg-[#09090B] text-white overflow-hidden pb-16">
      {/* Top Header & Type Switcher */}
      <div className="p-4 z-20 flex items-center justify-between bg-[#121214]/95 backdrop-blur-md border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-sm ${isTracking ? 'bg-rose-500 animate-pulse' : 'bg-white'}`} />
            <span className="text-[10px] font-black tracking-widest text-zinc-300 uppercase">
              PACER // OUTDOOR GPS
            </span>
          </div>
          <h1 className="text-base font-black tracking-tight text-white mt-0.5">
            Monolith GPS Tripmeter
          </h1>
        </div>

        {!isTracking && (
          <div className="flex bg-[#09090B] p-1 rounded-xl border border-[#27272A]">
            <button
              onClick={() => setSelectedType('brisk_walk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                selectedType === 'brisk_walk'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Jalan Cepat
            </button>
            <button
              onClick={() => setSelectedType('run')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                selectedType === 'run'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Lari/Jog
            </button>
          </div>
        )}
      </div>

      {/* GPS Warning if any with Manual Log CTA */}
      {error && (
        <div className="mx-4 mt-2 p-3 bg-red-950/90 border border-red-700 text-red-200 rounded-xl text-xs flex items-center justify-between gap-2 z-20 shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => {
              const now = Date.now();
              setCompletedActivity({
                id: `act_manual_${now}`,
                type: selectedType,
                title: selectedType === 'run' ? 'Lari Outdoor (Manual)' : 'Jalan Cepat Outdoor (Manual)',
                startTime: now - 1800000,
                endTime: now,
                durationSeconds: 1800,
                distanceKm: 3.0,
                avgPaceSecondsPerKm: 600,
                avgPaceString: '10:00 /km',
                caloriesBurned: selectedType === 'run' ? 305 : 187,
                notes: 'Dicatat manual via pacebook',
              });
            }}
            className="px-2.5 py-1 bg-[#09090B] hover:bg-zinc-800 border border-rose-600 rounded-lg text-white font-bold whitespace-nowrap active:scale-95 cursor-pointer"
          >
            Catat Manual
          </button>
        </div>
      )}

      {/* Leaflet OpenStreetMap Container */}
      <div className="relative flex-1 w-full bg-[#09090B] overflow-hidden">
        <LeafletRouteMap route={route} currentPosition={currentPosition} />

        {/* Status pill overlay */}
        <div className="absolute top-4 left-4 z-20 bg-[#121214]/95 border border-[#27272A] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-xl">
          <span
            className={`w-2.5 h-2.5 rounded-sm ${
              isTracking && !isPaused
                ? 'bg-emerald-400 animate-pulse'
                : isPaused
                ? 'bg-amber-400'
                : 'bg-slate-600'
            }`}
          />
          <span className="tracking-wide">
            {isTracking
              ? isPaused
                ? 'STAGE DIJEDA'
                : 'RECORDING STAGE'
              : 'SATELLITE READY'}
          </span>
          {currentPosition?.accuracy && (
            <span className="text-[10px] text-slate-400 font-mono">
              [±{Math.round(currentPosition.accuracy)}m]
            </span>
          )}
        </div>
      </div>

      {/* Primary Metrics HUD (Monolith Tripmeter) */}
      <div className="bg-[#121214] border-t border-[#27272A] p-5 rounded-t-3xl shadow-2xl z-20 space-y-4">
        {/* Main Distance */}
        <div className="text-center bg-[#09090B] py-3 px-4 rounded-2xl border border-[#27272A]">
          <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <span className="text-white">STAGE DISTANCE</span> // KILOMETER
          </div>
          <div className="text-5xl font-black font-mono tracking-tight text-white mt-0.5">
            {distanceKm.toFixed(2)}
          </div>
        </div>

        {/* 3 Secondary Stats in Co-driver Tripmeter format */}
        <div className="grid grid-cols-3 gap-2 py-2 text-center">
          <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
            <div className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase">ELAPSED</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {formatTime(durationSeconds)}
            </div>
          </div>

          <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
            <div className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase">SPLIT PACE</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {avgPace}
            </div>
          </div>

          <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
            <div className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase font-mono">
              KALORI ({profile.currentWeightKg}KG)
            </div>
            <div className="text-lg font-black font-mono text-zinc-200 mt-0.5">
              {calories} <span className="text-[10px] font-normal text-zinc-500">kcal</span>
            </div>
          </div>
        </div>

        {/* Action Controls with Mechanical Push Feel & Laser Crimson Hold-to-Finish */}
        <div className="pt-1">
          {!isTracking ? (
            <button
              onClick={() => {
                soundService.unlockAudio();
                startTracking(selectedType);
              }}
              className="w-full py-4 btn-rally-primary text-black font-black text-base flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black text-black" />
              MULAI // {selectedType === 'run' ? 'LARI OUTDOOR' : 'JALAN CEPAT'}
            </button>
          ) : (
            <div className="flex gap-3">
              {isPaused ? (
                <button
                  onClick={() => {
                    soundService.unlockAudio();
                    resumeTracking();
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm active:translate-y-1 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white" />
                  LANJUTKAN
                </button>
              ) : (
                <button
                  onClick={pauseTracking}
                  className="flex-1 py-3.5 btn-rally-secondary text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Pause className="w-5 h-5 fill-white" />
                  JEDA
                </button>
              )}

              {/* Laser Crimson Hold-to-Finish Button */}
              <div
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                onPointerCancel={cancelHold}
                onContextMenu={(e) => e.preventDefault()}
                className="flex-1 relative overflow-hidden py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98] transition shadow-md touch-none"
              >
                {/* Hold Progress Fill */}
                <div
                  className="absolute inset-y-0 left-0 bg-rose-900 transition-all"
                  style={{ width: `${holdProgress}%` }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Square className="w-4 h-4 fill-white" />
                  {holdProgress > 0
                    ? `TAHAN... ${Math.round(holdProgress)}%`
                    : 'TAHAN SELESAI'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary modal upon completion */}
      {completedActivity && (
        <ActivitySummaryModal
          activity={completedActivity}
          onSaved={(saved) => {
            setCompletedActivity(null);
            if (onActivitySaved) onActivitySaved(saved);
          }}
          onDiscard={() => setCompletedActivity(null)}
        />
      )}
    </div>
  );
};
