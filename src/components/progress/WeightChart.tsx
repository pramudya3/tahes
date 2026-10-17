import React from 'react';
import { WeightEntry } from '../../types/index';

interface WeightChartProps {
  entries: WeightEntry[];
  targetWeightKg?: number;
}

export const WeightChart: React.FC<WeightChartProps> = ({
  entries,
  targetWeightKg = 65,
}) => {
  if (entries.length === 0) {
    return (
      <div className="h-44 flex flex-col items-center justify-center bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
        <p className="text-xs text-slate-400">Belum ada riwayat timbangan berat badan.</p>
        <span className="text-[11px] text-slate-500 mt-1">
          Catat timbangan pertama Anda untuk melihat grafik perkembangan.
        </span>
      </div>
    );
  }

  // Sort by date
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const weights = sorted.map((e) => e.weightKg);
  const minWeight = Math.min(...weights, targetWeightKg) - 2;
  const maxWeight = Math.max(...weights, 83) + 2;
  const range = maxWeight - minWeight || 1;

  const width = 360;
  const height = 160;
  const paddingX = 35;
  const paddingY = 25;

  const getX = (index: number) => {
    if (sorted.length <= 1) return width / 2;
    return paddingX + (index / (sorted.length - 1)) * (width - paddingX * 2);
  };

  const getY = (weight: number) => {
    const normalized = (weight - minWeight) / range;
    return height - paddingY - normalized * (height - paddingY * 2);
  };

  const targetY = getY(targetWeightKg);

  const points = sorted.map((entry, idx) => ({
    x: getX(idx),
    y: getY(entry.weightKg),
    date: entry.date,
    weight: entry.weightKg,
  }));

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-white block">Tren Penurunan Berat Badan</span>
          <span className="text-[11px] text-slate-400">Target Ideal: {targetWeightKg} kg</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-strava-orange font-semibold">
            <span className="w-2.5 h-0.5 bg-strava-orange rounded-full inline-block" /> Aktual
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-2.5 h-0.5 bg-emerald-400 border-b border-dashed inline-block" /> Target
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible font-sans"
        >
          {/* Target Reference Line */}
          <line
            x1={paddingX}
            y1={targetY}
            x2={width - paddingX}
            y2={targetY}
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          <text
            x={width - paddingX + 5}
            y={targetY + 4}
            fill="#10B981"
            fontSize="9"
            fontWeight="bold"
          >
            {targetWeightKg}kg
          </text>

          {/* Actual Weight Line */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke="#FC4C02"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {points.map((p, idx) => (
            <g key={idx} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="fill-slate-950 stroke-strava-orange stroke-2 transition-all hover:r-6"
              />
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="bold"
              >
                {p.weight}
              </text>
              <text
                x={p.x}
                y={height - 5}
                textAnchor="middle"
                fill="#64748B"
                fontSize="8"
              >
                {p.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
