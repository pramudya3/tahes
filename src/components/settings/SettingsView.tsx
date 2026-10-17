import React, { useState } from 'react';
import {
  getUserProfile,
  saveUserProfile,
  exportAllData,
  importAllData,
} from '../../db/index';
import {
  Settings,
  User,
  Volume2,
  VolumeX,
  Key,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
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
    });
    setProfile(updated);
    showNotification('success', 'Profil dan pengaturan berhasil disimpan!');
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
    <div className="w-full max-w-lg mx-auto bg-slate-950 text-white min-h-[calc(100vh-5rem)] pb-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-strava-orange" />
            <span>PENGATURAN</span>
          </h1>
          <p className="text-xs text-slate-400">Profil Atlet & Penyimpanan Lokal</p>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {notification && (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 animate-fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                : 'bg-red-950/80 border-red-800 text-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
        )}

        {/* Profile Settings Form */}
        <form
          onSubmit={handleSaveProfile}
          className="p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-strava-orange uppercase tracking-wider">
            <User className="w-4 h-4" /> Profil Fisik Anda
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nama Panggilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-strava-orange"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tinggi (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-strava-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Usia (tahun)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-strava-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Berat Sekarang (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-strava-orange font-bold text-strava-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Berat (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-strava-orange font-bold text-emerald-400"
              />
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <span className="text-xs font-bold text-white block">Suara Beep & Lap Audio</span>
                <span className="text-[11px] text-slate-400">Bunyi countdown timer & penanda kilometer</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-strava-orange rounded cursor-pointer"
            />
          </div>

          {/* Gemini AI Key */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Google Gemini API Key (Opsional)</span>
            </div>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Masukkan API key gratis untuk fitur AI chat penuh..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-strava-orange font-mono"
            />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Jika dikosongkan, asisten mentor tetap bekerja 100% menggunakan algoritma bawaan *offline*. Kunci Anda disimpan aman hanya di browser Anda sendiri.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-strava-orange hover:bg-strava-hover text-white text-sm font-bold rounded-2xl shadow-lg shadow-strava-orange/20 transition active:scale-[0.98]"
          >
            Simpan Perubahan Profil
          </button>
        </form>

        {/* Data Backup & Restore Section */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Download className="w-4 h-4 text-blue-400" /> Cadangkan & Pulihkan Data
          </div>
          <p className="text-xs text-slate-400">
            Aplikasi ini menyimpan data di browser Anda (IndexedDB). Anda dapat mengekspor seluruh catatan olahraga & berat badan ke file JSON kapan saja agar tidak hilang.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleExport}
              className="flex-1 py-3 px-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Ekspor JSON</span>
            </button>

            <label className="flex-1 py-3 px-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Impor Backup</span>
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
