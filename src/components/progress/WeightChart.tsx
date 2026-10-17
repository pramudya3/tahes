import React from 'react';
import { WeightEntry } from '../../types/index';
import { calculateSmoothedWeights } from '../../utils/calculations';

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

  const smoothedData = calculateSmoothedWeights(sorted, 0.25);

  const rawWeights = sorted.map((e) => e.weightKg);
  const smoothedWeights = smoothedData.map((e) => e.smoothedWeightKg);
  const minWeight = Math.min(...rawWeights, ...smoothedWeights, targetWeightKg) - 2;
  const maxWeight = Math.max(...rawWeights, ...smoothedWeights, 83) + 2;
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

  const rawPoints = sorted.map((entry, idx) => ({
    x: getX(idx),
    y: getY(entry.weightKg),
    date: entry.date,
    weight: entry.weightKg,
  }));

  const smoothedPoints = smoothedData.map((entry, idx) => ({
    x: getX(idx),
    y: getY(entry.smoothedWeightKg),
    date: entry.date,
    smoothedWeight: entry.smoothedWeightKg,
  }));

  const rawPolylineStr = rawPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const smoothedPolylineStr = smoothedPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const latestSmoothed = smoothedData[smoothedData.length - 1]?.smoothedWeightKg;
  const latestRaw = sorted[sorted.length - 1]?.weightKg;

  return (
    <div className="w-full bg-[#121214] border border-[#27272A] rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <div>
          <span className="font-black text-white block uppercase tracking-wider text-[11px]">
            Tren Stage Penurunan Berat Badan
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-400 font-mono">
            <span>TARGET: {targetWeightKg} KG</span>
            {latestRaw !== undefined && (
              <span className="text-zinc-400">
                • AKTUAL: {latestRaw} KG
              </span>
            )}
            {latestSmoothed !== undefined && (
              <span className="text-white font-bold">
                • TREN LEMAK: {latestSmoothed} KG
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-zinc-400 font-medium">
            <span className="w-2.5 h-0.5 bg-zinc-400 border-b border-dashed inline-block" /> Harian
          </span>
          <span className="flex items-center gap-1 text-white font-bold">
            <span className="w-2.5 h-1 bg-white rounded-sm inline-block" /> Tren Lemak
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
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
            className="font-mono"
          >
            {targetWeightKg}kg
          </text>

          {/* Raw Actual Scale Line (faded dashed) */}
          <polyline
            points={rawPolylineStr}
            fill="none"
            stroke="#71717A"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />

          {/* Raw Dots (small) */}
          {rawPoints.map((p, idx) => (
            <circle
              key={`raw-${idx}`}
              cx={p.x}
              cy={p.y}
              r="2.5"
              className="fill-zinc-500"
              opacity="0.7"
            />
          ))}

          {/* Smoothed Fat Loss Curve in bold Monolith Stark White */}
          <polyline
            points={smoothedPolylineStr}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Smoothed Dots and Dates */}
          {smoothedPoints.map((p, idx) => (
            <g key={`smooth-${idx}`} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="fill-[#09090B] stroke-white stroke-2 transition-all hover:r-6"
              />
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="bold"
                className="font-mono"
              >
                {p.smoothedWeight}
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

      {/* Behavioral Psychology Tip */}
      <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3 flex items-start gap-2 text-[11px] text-zinc-400 leading-relaxed">
        <span className="text-white text-sm shrink-0 leading-none">⚡</span>
        <div>
          <span className="text-white font-bold block mb-0.5">Smoothing Trend (EMA Filter)</span>
          Timbangan harian bisa naik-turun 0.5–1.5 kg akibat retensi air dan natrium. Garis putih mulus menyaring gangguan ini untuk menampilkan laju pembakaran lemak murni Anda.
        </div>
      </div>
    </div>
  );
};
