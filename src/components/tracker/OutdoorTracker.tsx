import React, { useState } from 'react';
import { Play, Pause, Square, AlertCircle } from 'lucide-react';
import { useGeolocationTracker } from '../../hooks/useGeolocationTracker';
import { Activity } from '../../types/index';
import { ActivitySummaryModal } from './ActivitySummaryModal';
import { LeafletRouteMap } from './LeafletRouteMap';
import { soundService } from '../../utils/audio';

interface OutdoorTrackerProps {
  onActivitySaved?: (activity: Activity) => void;
}

export const OutdoorTracker: React.FC<OutdoorTrackerProps> = ({ onActivitySaved }) => {
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

  return (
    <div className="relative flex flex-col h-[calc(100vh-5rem)] w-full max-w-lg mx-auto bg-slate-950 text-white overflow-hidden pb-16">
      {/* Top Header & Type Switcher */}
      <div className="p-4 z-20 flex items-center justify-between bg-[#111827]/95 backdrop-blur-md border-b border-[#24334A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-rally-orange" />
            <span className="text-[10px] font-black tracking-widest text-rally-orange uppercase">
              STAGE 01 // OUTDOOR PACER
            </span>
          </div>
          <h1 className="text-base font-black tracking-tight text-white mt-0.5">
            Rally GPS Tripmeter
          </h1>
        </div>

        {!isTracking && (
          <div className="flex bg-[#0B0F19] p-1 rounded-xl border border-[#24334A]">
            <button
              onClick={() => setSelectedType('brisk_walk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                selectedType === 'brisk_walk'
                  ? 'bg-rally-orange text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Jalan Cepat
            </button>
            <button
              onClick={() => setSelectedType('run')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                selectedType === 'run'
                  ? 'bg-rally-orange text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
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
            className="px-2.5 py-1 bg-[#0B0F19] hover:bg-slate-800 border border-red-600 rounded-lg text-white font-bold whitespace-nowrap active:scale-95"
          >
            Catat Manual
          </button>
        </div>
      )}

      {/* Leaflet OpenStreetMap Container */}
      <div className="relative flex-1 w-full bg-[#0B0F19] overflow-hidden">
        <LeafletRouteMap route={route} currentPosition={currentPosition} />

        {/* Status pill overlay */}
        <div className="absolute top-4 left-4 z-20 bg-[#111827]/95 border border-[#24334A] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-xl">
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

      {/* Primary Metrics HUD (Rally Tripmeter) */}
      <div className="bg-[#111827] border-t border-[#24334A] p-5 rounded-t-3xl shadow-2xl z-20 space-y-4">
        {/* Main Distance */}
        <div className="text-center bg-[#0B0F19] py-3 px-4 rounded-2xl border border-[#24334A]">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <span className="text-rally-orange">STAGE DISTANCE</span> // KILOMETER
          </div>
          <div className="text-5xl font-black font-mono tracking-tight text-white mt-0.5">
            {distanceKm.toFixed(2)}
          </div>
        </div>

        {/* 3 Secondary Stats in Co-driver Tripmeter format */}
        <div className="grid grid-cols-3 gap-2 py-2 text-center">
          <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
            <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">ELAPSED</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {formatTime(durationSeconds)}
            </div>
          </div>

          <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
            <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">SPLIT PACE</div>
            <div className="text-lg font-black font-mono text-rally-orange mt-0.5">
              {avgPace}
            </div>
          </div>

          <div className="bg-[#0B0F19] p-3 rounded-xl border border-[#24334A]">
            <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">CALORIES (83KG)</div>
            <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
              {calories} <span className="text-[10px] font-normal text-slate-500">kcal</span>
            </div>
          </div>
        </div>

        {/* Action Controls with Mechanical Push Feel */}
        <div className="pt-1">
          {!isTracking ? (
            <button
              onClick={() => {
                soundService.unlockAudio();
                startTracking(selectedType);
              }}
              className="w-full py-4 btn-rally-primary text-white font-black text-base flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              START STAGE // {selectedType === 'run' ? 'LARI' : 'JALAN CEPAT'}
            </button>
          ) : (
            <div className="flex gap-3">
              {isPaused ? (
                <button
                  onClick={() => {
                    soundService.unlockAudio();
                    resumeTracking();
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm active:translate-y-1 transition flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  LANJUT STAGE
                </button>
              ) : (
                <button
                  onClick={pauseTracking}
                  className="flex-1 py-3.5 btn-rally-secondary text-white font-black text-sm flex items-center justify-center gap-2"
                >
                  <Pause className="w-5 h-5 fill-white" />
                  JEDA
                </button>
              )}

              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 btn-rally-primary text-white font-black text-sm flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-white" />
                SELESAI STAGE
              </button>
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
