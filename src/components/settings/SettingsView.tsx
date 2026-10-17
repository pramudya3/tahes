import React, { useState } from 'react';
import {
  getUserProfile,
  saveUserProfile,
  exportAllData,
  importAllData,
} from '../../db/index';
import {
  User,
  Volume2,
  VolumeX,
  Key,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Home,
} from 'lucide-react';

interface SettingsViewProps {
  onProfileUpdated?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onProfileUpdated }) => {
  const [profile, setProfile] = useState(getUserProfile());
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [heightCm, setHeightCm] = useState(profile.heightCm.toString());
  const [currentWeightKg, setCurrentWeightKg] = useState(
    profile.currentWeightKg.toString()
  );
  const [targetWeightKg, setTargetWeightKg] = useState(
    profile.targetWeightKg.toString()
  );
  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey || '');
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [indoorOnlyMode, setIndoorOnlyMode] = useState(profile.indoorOnlyMode ?? false);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveUserProfile({
      name: name.trim() || 'Athlete',
      age: parseInt(age) || 26,
      heightCm: parseFloat(heightCm) || 165,
      currentWeightKg: parseFloat(currentWeightKg) || 83,
      targetWeightKg: parseFloat(targetWeightKg) || 65,
      geminiApiKey: geminiApiKey.trim() || undefined,
      soundEnabled,
      indoorOnlyMode,
    });
    setProfile(updated);
    onProfileUpdated?.();
    showNotification('success', 'Profil dan mode latihan berhasil disimpan!');
  };

  const handleExport = async () => {
    try {
      const jsonStr = await exportAllData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personal-strava-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('success', 'Data backup berhasil diunduh!');
    } catch {
      showNotification('error', 'Gagal mengekspor data.');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const ok = await importAllData(text);
      if (ok) {
        setProfile(getUserProfile());
        showNotification('success', 'Data backup berhasil dipulihkan!');
      } else {
        showNotification('error', 'Format file backup tidak valid.');
      }
    } catch {
      showNotification('error', 'Gagal memproses file.');
    }
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#09090B] text-white min-h-[calc(100vh-5rem)] pb-20">
      {/* Header */}
      <div className="p-4 border-b border-[#27272A] bg-[#121214]/95 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-white" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
              STAGE CONFIG // ATHLETE SETTINGS
            </span>
          </div>
          <h1 className="text-lg font-black tracking-tight text-white mt-0.5">
            Pengaturan & Backup
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {notification && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
                : 'bg-rose-950/80 border-rose-700 text-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
        )}

        {/* Workout Environment Mode Selector */}
        <div className="p-5 bg-[#121214] border border-[#27272A] rounded-2xl shadow-xl space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Home className="w-4 h-4" /> MODE LATIHAN (ENVIRONMENT)
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                indoorOnlyMode
                  ? 'bg-white text-black border-white'
                  : 'bg-[#18181B] text-zinc-300 border-zinc-700'
              }`}
            >
              {indoorOnlyMode ? 'FOKUS RUMAHAN' : 'MODE LENGKAP'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1 font-sans">
            {/* Option 1: Indoor Only */}
            <div
              onClick={() => setIndoorOnlyMode(true)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                indoorOnlyMode
                  ? 'bg-[#09090B] border-white shadow-sm'
                  : 'bg-[#09090B]/40 border-[#27272A] hover:border-zinc-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  indoorOnlyMode ? 'border-white bg-white' : 'border-zinc-600'
                }`}
              >
                {indoorOnlyMode && <span className="w-1.5 h-1.5 rounded-full bg-black block" />}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white block">
                  🏠 Mode Fokus Rumahan (Indoor-Only)
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Hanya latihan bodyweight tanpa alat di rumah. GPS outdoor disembunyikan, perhitungan kalori harian disesuaikan ke basis rumahan (1.2× BMR), dan dashboard difokuskan pada sesi latihan rumah.
                </p>
              </div>
            </div>

            {/* Option 2: Full Mode */}
            <div
              onClick={() => setIndoorOnlyMode(false)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                !indoorOnlyMode
                  ? 'bg-[#09090B] border-white shadow-sm'
                  : 'bg-[#09090B]/40 border-[#27272A] hover:border-zinc-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  !indoorOnlyMode ? 'border-white bg-white' : 'border-zinc-600'
                }`}
              >
                {!indoorOnlyMode && <span className="w-1.5 h-1.5 rounded-full bg-black block" />}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white block">
                  🏃 Mode Lengkap (Indoor + Outdoor GPS)
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Menampilkan semua modul termasuk pelacak rute GPS outdoor untuk jalan cepat atau lari di luar ruangan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form
          onSubmit={handleSaveProfile}
          className="p-5 bg-[#121214] border border-[#27272A] rounded-2xl shadow-xl space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider font-mono">
            <User className="w-4 h-4 text-white" /> PARAMETER FISIK ATLET
          </div>

          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1">
              Nama Panggilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-sm focus:outline-none focus:border-white font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                Tinggi (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-sm focus:outline-none focus:border-white font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                Usia (thn)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-sm focus:outline-none focus:border-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                Berat Sekarang (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-base focus:outline-none focus:border-white font-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-1">
                Target Berat (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-emerald-400 text-base focus:outline-none focus:border-white font-black"
              />
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="pt-2 border-t border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              )}
              <div>
                <span className="text-xs font-black text-white block">Suara Beep & Audio Lap 1KM</span>
                <span className="text-[11px] text-zinc-400">Audio countdown Web Audio API</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-white rounded cursor-pointer"
            />
          </div>

          {/* Gemini AI Key */}
          <div className="pt-2 border-t border-[#27272A] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-black text-white">
              <Key className="w-4 h-4 text-zinc-300" />
              <span>Google Gemini API Key (Opsional)</span>
            </div>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Masukkan API key gratis untuk fitur AI chat..."
              className="w-full px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-white font-mono"
            />
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Jika dikosongkan, asisten mentor tetap bekerja 100% menggunakan algoritma bawaan *offline*.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 btn-rally-primary text-black text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            SIMPAN PERUBAHAN PROFIL
          </button>
        </form>

        {/* Data Backup & Restore Section */}
        <div className="p-5 bg-[#121214] border border-[#27272A] rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-zinc-300 uppercase tracking-wider font-mono">
            <Download className="w-4 h-4 text-white" /> CADANGKAN & PULIHKAN DATA
          </div>
          <p className="text-xs text-zinc-400">
            Aplikasi ini menyimpan data di browser Anda (IndexedDB). Anda dapat mengekspor seluruh catatan olahraga & berat badan ke file JSON kapan saja agar tidak hilang.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleExport}
              className="flex-1 py-3 px-3 btn-rally-secondary text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>EKSPOR JSON</span>
            </button>

            <label className="flex-1 py-3 px-3 btn-rally-secondary text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-4 h-4 text-zinc-300" />
              <span>IMPOR BACKUP</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
