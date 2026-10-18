import React, { useState, useId } from 'react';
import { User, Calendar, Ruler, Scale, Target, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateIdealWeight } from '../../utils/calculations';
import { saveUserProfile, db } from '../../db/index';
import { UserProfile } from '../../types/index';

interface OnboardingViewProps {
  onComplete: () => void;
  initialProfile?: UserProfile;
  isRecalibration?: boolean;
  onCancel?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onComplete,
  initialProfile,
  isRecalibration = false,
  onCancel,
}) => {
  const nameId = useId();
  const ageId = useId();
  const heightId = useId();
  const weightId = useId();
  const targetId = useId();

  const [name, setName] = useState(initialProfile?.name && initialProfile.name !== 'Athlete' ? initialProfile.name : '');
  const [age, setAge] = useState(initialProfile?.age ? initialProfile.age.toString() : '26');
  const [heightCm, setHeightCm] = useState(initialProfile?.heightCm ? initialProfile.heightCm.toString() : '165');
  const [currentWeightKg, setCurrentWeightKg] = useState(
    initialProfile?.currentWeightKg ? initialProfile.currentWeightKg.toString() : '83.0'
  );
  const [targetWeightKg, setTargetWeightKg] = useState(
    initialProfile?.targetWeightKg ? initialProfile.targetWeightKg.toString() : '65.0'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live real-time calculations
  const parsedHeight = parseFloat(heightCm) || 0;
  const parsedWeight = parseFloat(currentWeightKg) || 0;
  const idealStats = calculateIdealWeight(parsedHeight, parsedWeight);

  const handleApplyIdeal = (targetVal: number) => {
    setTargetWeightKg(targetVal.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg('Silakan masukkan nama atau panggilan Anda.');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (!ageNum || ageNum < 10 || ageNum > 120) {
      setErrorMsg('Umur harus antara 10 hingga 120 tahun.');
      return;
    }

    const heightNum = parseFloat(heightCm);
    if (!heightNum || heightNum < 100 || heightNum > 250) {
      setErrorMsg('Tinggi badan harus antara 100 hingga 250 cm.');
      return;
    }

    const weightNum = parseFloat(currentWeightKg);
    if (!weightNum || weightNum < 25 || weightNum > 300) {
      setErrorMsg('Berat badan saat ini harus antara 25 hingga 300 kg.');
      return;
    }

    const targetNum = parseFloat(targetWeightKg);
    if (!targetNum || targetNum < 25 || targetNum > 300) {
      setErrorMsg('Target berat badan harus antara 25 hingga 300 kg.');
      return;
    }

    setIsSubmitting(true);
    try {
      saveUserProfile({
        name: cleanName,
        age: ageNum,
        heightCm: heightNum,
        currentWeightKg: weightNum,
        targetWeightKg: targetNum,
        onboarded: true,
      });

      // If there are no weight logs in Dexie yet, log initial baseline entry
      const existingLogsCount = await db.weight_logs.count();
      if (existingLogsCount === 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        await db.weight_logs.add({
          id: `weight-${Date.now()}`,
          date: todayStr,
          weightKg: weightNum,
          notes: 'Baseline awal Onboarding Tahes',
        });
      }

      onComplete();
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col justify-center px-4 py-8 max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src="/icon-192.png"
            alt="Tahes Logo"
            className="w-16 h-16 rounded-2xl border-2 border-zinc-700 shadow-2xl object-cover bg-black"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-[#09090B]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181B] border border-[#27272A] text-zinc-300 text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
          <Sparkles className="w-3 h-3 text-white" />
          {isRecalibration ? 'KALIBRASI ULANG PROFIL' : 'INISIALISASI // ONBOARDING'}
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">
          {isRecalibration ? 'Kalibrasi Ulang Atlet' : 'Selamat Datang di Tahes'}
        </h1>
        <p className="text-xs text-zinc-400 max-w-xs mt-1 leading-relaxed">
          Atur data fisik dasar untuk menghitung berat badan ideal, defisit kalori aman, dan rute telemetry Anda.
        </p>
      </div>

      {/* Main Card Form */}
      <div className="bg-[#121214] border border-[#27272A] rounded-2xl p-5 shadow-2xl space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="space-y-3.5">
            {/* Nama */}
            <div>
              <label htmlFor={nameId} className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-300" />
                Nama / Panggilan
              </label>
              <input
                id={nameId}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Pramudya"
                className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white font-sans transition"
                autoFocus
              />
            </div>

            {/* Umur & Tinggi Badan */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={ageId} className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                  Umur
                </label>
                <div className="relative">
                  <input
                    id={ageId}
                    type="number"
                    min="10"
                    max="120"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="26"
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-400 pointer-events-none">
                    THN
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor={heightId} className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-zinc-300" />
                  Tinggi Badan
                </label>
                <div className="relative">
                  <input
                    id={heightId}
                    type="number"
                    step="0.5"
                    min="100"
                    max="250"
                    required
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="165"
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-400 pointer-events-none">
                    CM
                  </span>
                </div>
              </div>
            </div>

            {/* Berat Badan Sekarang */}
            <div>
              <label htmlFor={weightId} className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-zinc-300" />
                Berat Badan Sekarang
              </label>
              <div className="relative">
                <input
                  id={weightId}
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  required
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(e.target.value)}
                  placeholder="83.0"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition pr-12"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-400 pointer-events-none">
                  KG
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Live Telemetry: Berat Badan Ideal */}
          {parsedHeight > 0 && (
            <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  Kalkulasi Berat Badan Ideal
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#09090B] border border-[#27272A] text-zinc-400">
                  RUMUS BROCA & WHO
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#121214] p-3 rounded-lg border border-[#27272A]">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Berat Ideal (Broca)</div>
                  <div className="text-xl font-mono font-black text-white mt-0.5">
                    {idealStats.idealWeightKg}{' '}
                    <span className="text-xs font-normal text-zinc-400">KG</span>
                  </div>
                </div>

                <div className="bg-[#121214] p-3 rounded-lg border border-[#27272A]">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Rentang Normal (WHO)</div>
                  <div className="text-sm font-mono font-black text-zinc-200 mt-1">
                    {idealStats.minHealthyKg} - {idealStats.maxHealthyKg}{' '}
                    <span className="text-[10px] font-normal text-zinc-400">KG</span>
                  </div>
                </div>
              </div>

              {/* BMI Status indicator */}
              {parsedWeight > 0 && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#27272A]/80">
                  <span className="text-zinc-400 font-mono text-[11px]">BMI Saat Ini:</span>
                  <span className="font-mono font-bold text-zinc-200 text-[11px] bg-[#09090B] px-2 py-0.5 rounded border border-[#27272A]">
                    {idealStats.bmi} • {idealStats.category}
                  </span>
                </div>
              )}

              {/* Quick suggestion button */}
              {idealStats.idealWeightKg > 0 && (
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyIdeal(idealStats.idealWeightKg)}
                    className="flex-1 text-[11px] font-mono py-1.5 px-2 bg-[#27272A] hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-600 transition flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>Gunakan Ideal ({idealStats.idealWeightKg} kg)</span>
                  </button>
                  {idealStats.maxHealthyKg > idealStats.idealWeightKg && (
                    <button
                      type="button"
                      onClick={() => handleApplyIdeal(idealStats.maxHealthyKg)}
                      className="text-[11px] font-mono py-1.5 px-2 bg-[#121214] hover:bg-[#27272A] text-zinc-400 hover:text-zinc-200 rounded-lg border border-[#27272A] transition active:scale-95"
                      title="Batas atas BMI normal untuk target jangka menengah yang lebih santai"
                    >
                      <span>Batas Normal ({idealStats.maxHealthyKg} kg)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Target Berat Badan */}
          <div>
            <label htmlFor={targetId} className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-zinc-300" />
              Target Berat Badan
            </label>
            <div className="relative">
              <input
                id={targetId}
                type="number"
                step="0.5"
                min="30"
                max="300"
                required
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(e.target.value)}
                placeholder="65.0"
                className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition pr-12"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-zinc-400 pointer-events-none">
                KG
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono">
              Target yang ingin dicapai melalui defisit bertahap tanpa membebani sendi lutut.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-white hover:bg-zinc-200 active:scale-[0.99] text-black font-mono font-black text-sm tracking-wider uppercase rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isRecalibration ? 'SIMPAN PERUBAHAN // TAHES' : 'SIMPAN & AKTIFKAN TAHES'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isRecalibration && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 bg-transparent hover:bg-[#18181B] text-zinc-400 hover:text-white font-mono text-xs rounded-xl border border-transparent transition"
              >
                BATALKAN KALIBRASI
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Footer reassurance */}
      <div className="mt-6 text-center text-[11px] font-mono text-zinc-400 space-y-1">
        <div>DATA TERSIMPAN SECARA LOKAL DI PERANGKAT (OFFLINE-FIRST)</div>
        <div className="text-[10px] text-zinc-400">Privasi terjaga 100% tanpa upload ke server eksternal</div>
      </div>
    </div>
  );
};
