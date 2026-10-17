import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, AlertCircle, Sparkles } from 'lucide-react';
import { useGeolocationTracker } from '../../hooks/useGeolocationTracker';
import { Activity } from '../../types/index';
import { ActivitySummaryModal } from './ActivitySummaryModal';

interface OutdoorTrackerProps {
  onActivitySaved?: (activity: Activity) => void;
}

export const OutdoorTracker: React.FC<OutdoorTrackerProps> = ({ onActivitySaved }) => {
  const {
    isTracking,
    isPaused,
    activityType,
    distanceKm,
    durationSeconds,
    currentPace,
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]); // Default Jakarta

  useEffect(() => {
    if (currentPosition) {
      setMapCenter([currentPosition.lat, currentPosition.lng]);
    }
  }, [currentPosition]);

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
      <div className="p-4 z-20 flex items-center justify-between bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
            <span className="text-strava-orange font-black">GPS</span> TRACKER
          </h1>
          <p className="text-xs text-slate-400">Outdoor Cardio Tanpa Alat</p>
        </div>

        {!isTracking && (
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedType('brisk_walk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedType === 'brisk_walk'
                  ? 'bg-strava-orange text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Jalan Cepat
            </button>
            <button
              onClick={() => setSelectedType('run')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedType === 'run'
                  ? 'bg-strava-orange text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lari/Jog
            </button>
          </div>
        )}
      </div>

      {/* GPS Warning if any */}
      {error && (
        <div className="mx-4 mt-2 p-3 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2 z-20">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Map Canvas / Visualizer */}
      <div className="relative flex-1 w-full bg-slate-900 overflow-hidden">
        {/* Simple Leaflet Map Container */}
        {typeof window !== 'undefined' && (
          <div id="tracker-map-placeholder" className="absolute inset-0 flex items-center justify-center bg-slate-950">
            {/* Realtime route svg canvas visualization */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              {route.length > 1 ? (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-full h-4/5 stroke-strava-orange fill-none drop-shadow-[0_0_12px_rgba(252,76,2,0.6)]">
                    <polyline
                      points={route
                        .map((pt, i) => `${(i * 15) % 280 + 20},${180 - ((pt.lat * 1000) % 120)}`)
                        .join(' ')}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : (
                <div className="space-y-3 opacity-60">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-strava-orange animate-pulse">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="text-sm font-medium text-slate-400">
                    {isTracking ? 'GPS Aktif, mencari koordinat rute...' : 'Tekan Mulai untuk mencatat rute GPS'}
                  </div>
                </div>
              )}

              {/* Status pill on map */}
              <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isTracking && !isPaused
                      ? 'bg-emerald-500 animate-ping'
                      : isPaused
                      ? 'bg-amber-500'
                      : 'bg-slate-600'
                  }`}
                />
                <span>
                  {isTracking
                    ? isPaused
                      ? 'Sesi Dijeda'
                      : 'Merekam GPS...'
                    : 'GPS Siap'}
                </span>
                {currentPosition?.accuracy && (
                  <span className="text-[10px] text-slate-500">
                    (±{Math.round(currentPosition.accuracy)}m)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Metrics HUD (Strava Style) */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-5 rounded-t-3xl shadow-2xl z-20 space-y-4">
        {/* Main Distance */}
        <div className="text-center">
          <div className="text-5xl font-black tracking-tight text-white">
            {distanceKm.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            KILOMETER
          </div>
        </div>

        {/* 3 Secondary Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-center">
          <div>
            <div className="text-xs text-slate-400 font-medium">WAKTU</div>
            <div className="text-xl font-extrabold text-white mt-0.5">
              {formatTime(durationSeconds)}
            </div>
          </div>

          <div className="border-x border-slate-800">
            <div className="text-xs text-slate-400 font-medium">AVG PACE</div>
            <div className="text-xl font-extrabold text-strava-orange mt-0.5">
              {avgPace}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-medium">KALORI (83KG)</div>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5">
              {calories} <span className="text-xs font-normal text-slate-500">kkal</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-1">
          {!isTracking ? (
            <button
              onClick={() => startTracking(selectedType)}
              className="w-full py-4 rounded-2xl bg-strava-orange hover:bg-strava-hover text-white font-black text-base shadow-xl shadow-strava-orange/25 active:scale-[0.98] transition flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Play className="w-5 h-5 fill-white" />
              Mulai {selectedType === 'run' ? 'Lari' : 'Jalan Cepat'}
            </button>
          ) : (
            <div className="flex gap-3">
              {isPaused ? (
                <button
                  onClick={resumeTracking}
                  className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Lanjut
                </button>
              ) : (
                <button
                  onClick={pauseTracking}
                  className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm active:scale-[0.98] transition flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Pause className="w-5 h-5 fill-white" />
                  Jeda
                </button>
              )}

              <button
                onClick={handleFinish}
                className="flex-1 py-4 rounded-2xl bg-strava-orange hover:bg-strava-hover text-white font-black text-sm shadow-lg shadow-strava-orange/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-white" />
                Selesai
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
