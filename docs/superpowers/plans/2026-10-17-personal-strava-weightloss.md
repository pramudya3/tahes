# Personal Strava & Bodyweight Fitness Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web PWA personal (*Personal Strava*) untuk mendampingi program penurunan berat badan dari 83 kg menuju 65 kg (TB 165 cm, 26 tahun) tanpa alat gym, menggabungkan pelacakan GPS outdoor (jalan/jogging) dan latihan beban tubuh (*bodyweight*) ramah sendi dengan panduan postur serta audio timer.

**Architecture:** Client-side PWA (React 18 + Vite + Tailwind CSS + Lucide React + Leaflet + Dexie IndexedDB) dengan model data *offline-first* lokal, synthesizer audio via Web Audio API, kalkulator MET/BMR/TDEE spesifik bobot 83 kg, dan integrasi opsional Gemini AI API via local key.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Leaflet, React-Leaflet, Dexie.js (IndexedDB), Vitest, Google Gen AI SDK.

**Spec:** `docs/superpowers/specs/2026-10-17-personal-strava-weightloss-design.md`

## Global Constraints
- Target profil fisik: Tinggi 165 cm, Berat awal 83 kg, Usia 26 tahun, Target berat 65 kg.
- Zero-equipment & ramah sendi: Latihan fase awal fokus pada gerakan *low-impact* (incline push-ups, chair squats, glute bridges, planks, step jacks, brisk walking). Tidak ada gerakan hentakan kasar/jumping squat agresif.
- Formula kalori MET akurat: Kalori terbakar per menit dihitung dengan bobot aktual pengguna ($MET \times 3.5 \times berat / 200$).
- Offline-First: Tidak boleh ada ketergantungan wajib ke server online untuk fitur dasar (peta, timer, database, audio).
- Tema warna: Palet atletik Strava Oranye (`#FC4C02`), Slate Dark (`#0F172A`), Slate Card (`#1E293B`), Slate Border (`#334155`).

## Review Focus
1. **Lonjakan koordinat GPS saat diam di tempat:** Pengujian filter akurasi (`accuracy > 30m`) dan jarak minimal ($> 2$ meter) agar jarak tidak terakumulasi fiktif saat pengguna diam.
2. **Kalkulasi Pace saat berhenti / kecepatan 0:** Penanganan pembagian dengan nol ($distance == 0$) menghasilkan display string pace `--:-- /km`, bukan `Infinity` atau `NaN`.
3. **Audio Beep di Browser Mobile:** Web Audio API `AudioContext` harus diinisialisasi setelah interaksi pengguna (user gesture) agar tidak diblokir oleh kebijakan autoplay browser.
4. **Kehilangan Sesi saat Layar Mati:** Penggunaan Screen Wake Lock API dan penyimpanan sementara titik GPS ke IndexedDB secara reaktif.
5. **Ekspor/Impor Format JSON:** Validasi skema JSON saat restore data agar tidak merusak database IndexedDB yang sudah ada.

---

### Task 1: Project Scaffolding, Core Types & Fitness Calculations (TDD)

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/types/index.ts`
- Create: `src/utils/calculations.ts`
- Test: `tests/calculations.test.ts`

**Interfaces:**
- Produces:
  - `haversineDistance(lat1, lon1, lat2, lon2): number` (dalam kilometer)
  - `calculatePace(distanceKm, durationSeconds): { paceSeconds: number; paceString: string }`
  - `calculateCaloriesBurned(met, weightKg, durationMinutes): number`
  - `calculateBMR(weightKg, heightCm, ageYears, gender): number`
  - `calculateTDEE(bmr, activityLevel): number`
  - `calculateBMI(weightKg, heightCm): { bmi: number; category: string }`

- [ ] **Step 1: Inisialisasi Vite + React + TypeScript + Tailwind + Vitest project**
  Install dependensi dasar: `react`, `react-dom`, `lucide-react`, `dexie`, `leaflet`, `react-leaflet`, `@types/leaflet`. Dependensi dev: `vite`, `vitest`, `tailwindcss`, `postcss`, `autoprefixer`, `@types/react`, `@types/react-dom`.

- [ ] **Step 2: Definisikan skema tipe di `src/types/index.ts`**
  Tipe `UserProfile`, `Activity`, `WeightEntry`, `ExerciseItem`, `WorkoutRoutine`, dan `GPSPoint`.

- [ ] **Step 3: Tulis unit test di `tests/calculations.test.ts`**
  Uji formula Haversine (jarak Monas - Bundaran HI), Pace formatting (misal 5 km dalam 30 menit = 06:00 /km, jarak 0 = `--:-- /km`), Kalori MET untuk 83 kg, BMR Mifflin-St Jeor (165cm, 83kg, 26th = ~1.736 kkal), dan BMI (83kg / 1.65m^2 = 30.5).

- [ ] **Step 4: Jalankan test dan pastikan gagal**
  Run: `npx vitest run tests/calculations.test.ts`
  Expected: FAIL dengan "calculations module not found".

- [ ] **Step 5: Implementasikan `src/utils/calculations.ts`**
  Implementasikan seluruh fungsi matematis presisi tanpa asumsi floating-point error.

- [ ] **Step 6: Jalankan test dan pastikan lulus**
  Run: `npx vitest run tests/calculations.test.ts`
  Expected: PASS seluruh tes.

- [ ] **Step 7: Commit Task 1**
  Run: `git add . && git commit -m "feat: scaffold project, core types, and calculation engine with tests"`

---

### Task 2: Database Layer, Audio Synthesizer, & Wake Lock Service

**Files:**
- Create: `src/db/index.ts`
- Create: `src/utils/audio.ts`
- Create: `src/utils/wakeLock.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Consumes: `src/types/index.ts`
- Produces:
  - `db.activities`: Dexie Table
  - `db.weight_logs`: Dexie Table
  - `getUserProfile(): UserProfile`, `saveUserProfile(profile: Partial<UserProfile>): UserProfile`
  - `exportAllData(): Promise<string>`, `importAllData(jsonString: string): Promise<boolean>`
  - `soundService.playCountdownBeep(isFinal: boolean): void`
  - `soundService.playSuccessChime(): void`
  - `wakeLockService.request(): Promise<boolean>`, `wakeLockService.release(): Promise<void>`

- [ ] **Step 1: Tulis unit test untuk database dan import/export di `tests/db.test.ts`**
  Menggunakan `fake-indexeddb` untuk menguji penyimpanan aktivitas, log berat badan, serta ekspor & impor JSON tanpa korupsi data.

- [ ] **Step 2: Jalankan test dan pastikan gagal**
  Run: `npx vitest run tests/db.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implementasikan `src/db/index.ts`**
  Konfigurasi Dexie class `PersonalStravaDatabase` dengan stores `activities: 'id, type, startTime'` dan `weight_logs: 'id, date'`. Tambahkan helper `exportAllData` dan `importAllData`.

- [ ] **Step 4: Implementasikan `src/utils/audio.ts`**
  Gunakan Web Audio API `AudioContext` untuk menghasilkan *short beep* (frekuensi 440 Hz untuk 3-2-1 dan frekuensi 880 Hz untuk nada go/finish) tanpa aset audio eksternal.

- [ ] **Step 5: Implementasikan `src/utils/wakeLock.ts`**
  Wrapper untuk `navigator.wakeLock.request('screen')` dengan penanganan graceful jika API tidak didukung pada browser lama.

- [ ] **Step 6: Jalankan test dan pastikan lulus**
  Run: `npx vitest run tests/db.test.ts`
  Expected: PASS.

- [ ] **Step 7: Commit Task 2**
  Run: `git add src/db src/utils tests/db.test.ts && git commit -m "feat: add dexie database, audio synthesizer, and wake lock service"`

---

### Task 3: Outdoor GPS Tracker Component (Leaflet & Live Metrics)

**Files:**
- Create: `src/components/tracker/OutdoorTracker.tsx`
- Create: `src/components/tracker/ActivitySummaryModal.tsx`
- Create: `src/hooks/useGeolocationTracker.ts`
- Test: `tests/tracker.test.ts`

**Interfaces:**
- Consumes:
  - `src/utils/calculations.ts` (haversineDistance, calculatePace, calculateCaloriesBurned)
  - `src/db/index.ts` (db.activities, getUserProfile)
  - `src/utils/audio.ts` (soundService)
  - `src/utils/wakeLock.ts` (wakeLockService)
- Produces:
  - `<OutdoorTracker onFinishActivity={(activity) => void} />`
  - `<ActivitySummaryModal activity={activity} onClose={() => void} />`

- [ ] **Step 1: Tulis unit test untuk `useGeolocationTracker` logic di `tests/tracker.test.ts`**
  Mock `navigator.geolocation`, uji transisi state (idle -> recording -> paused -> stopped), uji filter akurasi GPS ($accuracy > 30m$ diabaikan), dan uji pemicu audio lap split per kelipatan 1 km.

- [ ] **Step 2: Jalankan test dan pastikan gagal**
  Run: `npx vitest run tests/tracker.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implementasikan custom hook `useGeolocationTracker.ts`**
  Mengatur rekaman koordinat GPS, akumulasi jarak, waktu berlalu, live pace, dan kalori yang dibakar.

- [ ] **Step 4: Implementasikan komponen Leaflet Map & HUD di `OutdoorTracker.tsx`**
  Peta OpenStreetMap dengan marker atletik, polyline oranye Strava (`#FC4C02`), panel metrik kontras tinggi (Pace, Jarak, Waktu, Kalori), dan tombol aksi besar (Start, Pause, Resume, Finish).

- [ ] **Step 5: Implementasikan `ActivitySummaryModal.tsx`**
  Modal kartu bergaya Strava setelah selesai: input judul aktivitas (default: "Jalan Cepat Pagi / Sore"), catatan pribadi, pratinjau statistik, dan tombol Simpan ke Riwayat.

- [ ] **Step 6: Jalankan test dan pastikan lulus**
  Run: `npx vitest run tests/tracker.test.ts`
  Expected: PASS.

- [ ] **Step 7: Commit Task 3**
  Run: `git add src/components/tracker src/hooks tests/tracker.test.ts && git commit -m "feat: implement outdoor gps tracker and activity summary modal"`

---

### Task 4: Indoor Bodyweight & Clean Posture Workout Player

**Files:**
- Create: `src/data/exercises.ts`
- Create: `src/data/programs.ts`
- Create: `src/components/workout/WorkoutHub.tsx`
- Create: `src/components/workout/WorkoutPlayer.tsx`
- Create: `src/components/workout/ExerciseCard.tsx`
- Test: `tests/workout.test.ts`

**Interfaces:**
- Consumes:
  - `src/utils/audio.ts` (soundService beep interval)
  - `src/db/index.ts` (db.activities)
  - `src/utils/calculations.ts` (calculateCaloriesBurned)
- Produces:
  - `<WorkoutHub onStartRoutine={(routine) => void} />`
  - `<WorkoutPlayer routine={routine} onFinish={() => void} onCancel={() => void} />`

- [ ] **Step 1: Buat katalog latihan ramah sendi di `src/data/exercises.ts` & `src/data/programs.ts`**
  Definisikan data latihan tanpa alat: Incline Push-Up, Chair Squat, Glute Bridge, Plank, Dead Bug, Step Jacks, Wall Sit, Bird Dog. Sertakan cues postur, otot target, peringatan keamanan sendi untuk BB 83 kg, serta jadwal Program Mentor 4-Minggu.

- [ ] **Step 2: Tulis test logika workout timer di `tests/workout.test.ts`**
  Uji transisi timer kerja (work duration) -> timer istirahat (rest duration) -> gerakan berikutnya -> penyelesaian latihan.

- [ ] **Step 3: Jalankan test dan pastikan gagal**
  Run: `npx vitest run tests/workout.test.ts`
  Expected: FAIL.

- [ ] **Step 4: Implementasikan `WorkoutPlayer.tsx` & `ExerciseCard.tsx`**
  Layar latihan bersih dan fokus: kartu panduan postur (*Clean Posture Cues*), ring hitung mundur detik, tombol Pause/Next, dan audio beep otomatis pada 3 detik terakhir sebelum pergantian gerakan.

- [ ] **Step 5: Implementasikan `WorkoutHub.tsx`**
  Halaman pemilihan latihan: Program Mentor Minggu 1-4, Quick 15-Minute Joint-Friendly Circuit, atau Custom Interval Timer.

- [ ] **Step 6: Jalankan test dan pastikan lulus**
  Run: `npx vitest run tests/workout.test.ts`
  Expected: PASS.

- [ ] **Step 7: Commit Task 4**
  Run: `git add src/data src/components/workout tests/workout.test.ts && git commit -m "feat: implement indoor bodyweight workout hub and interval player"`

---

### Task 5: Weight Tracker, Mentor Engine & Gemini AI Integration

**Files:**
- Create: `src/services/ai.ts`
- Create: `src/components/progress/ProgressHub.tsx`
- Create: `src/components/progress/WeightLogModal.tsx`
- Create: `src/components/progress/WeightChart.tsx`
- Create: `src/components/progress/AICoachChat.tsx`
- Test: `tests/progress.test.ts`

**Interfaces:**
- Consumes:
  - `src/db/index.ts` (db.weight_logs, getUserProfile, saveUserProfile)
  - `src/utils/calculations.ts` (calculateBMI, calculateBMR, calculateTDEE)
- Produces:
  - `<ProgressHub />`
  - `sendAICoachMessage(prompt, context): Promise<string>`

- [ ] **Step 1: Tulis test di `tests/progress.test.ts`**
  Uji penambahan entri berat badan, kalkulasi delta penurunan berat badan dari 83 kg, status BMI, dan parsing pesan saran mentor.

- [ ] **Step 2: Jalankan test dan pastikan gagal**
  Run: `npx vitest run tests/progress.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implementasikan `src/services/ai.ts`**
  Integrasi API Gemini dengan fallback pesan cerdas *offline* berbasis rule ketika API key tidak disediakan atau perangkat sedang offline.

- [ ] **Step 4: Implementasikan `WeightChart.tsx` & `WeightLogModal.tsx`**
  Visualisasi grafik SVG interaktif perjalanan berat badan (garis aktual penurunan BB vs garis target 65 kg) dan modal pencatatan timbangan harian.

- [ ] **Step 5: Implementasikan `AICoachChat.tsx` & `ProgressHub.tsx`**
  Dashboard ringkasan BMI, target defisit kalori harian (~1.750 kkal), widget tips mentor hari ini, dan jendela chat konsultasi kebugaran.

- [ ] **Step 6: Jalankan test dan pastikan lulus**
  Run: `npx vitest run tests/progress.test.ts`
  Expected: PASS.

- [ ] **Step 7: Commit Task 5**
  Run: `git add src/services src/components/progress tests/progress.test.ts && git commit -m "feat: implement weight progression, mentor calculator, and ai coach"`

---

### Task 6: Activity Feed Dashboard, Navigation, Settings & PWA Packaging

**Files:**
- Create: `src/components/dashboard/FeedDashboard.tsx`
- Create: `src/components/dashboard/ActivityCard.tsx`
- Create: `src/components/settings/SettingsView.tsx`
- Create: `src/components/common/BottomNavbar.tsx`
- Modify: `src/App.tsx`
- Create: `public/manifest.json`
- Test: `tests/feed.test.ts`

**Interfaces:**
- Consumes:
  - Seluruh komponen Tab 1 - Tab 5
- Produces:
  - Aplikasi utuh `App.tsx` dengan transisi tab lancar dan state global

- [ ] **Step 1: Tulis test integrasi tab dan feed di `tests/feed.test.ts`**
  Uji kalkulasi agregasi statistik mingguan (total km, durasi, kalori, streak hari).

- [ ] **Step 2: Jalankan test dan pastikan gagal**
  Run: `npx vitest run tests/feed.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implementasikan `FeedDashboard.tsx` & `ActivityCard.tsx`**
  Tampilan beranda ala Strava: kartu metrik mingguan, streak counter, dan kartu feed setiap aktivitas olahraga yang telah selesai (outdoor & indoor).

- [ ] **Step 4: Implementasikan `SettingsView.tsx`**
  Pengaturan profil (tinggi 165 cm, berat terkini 83 kg, target 65 kg), toggle audio beep, input Gemini API key, serta tombol Ekspor & Impor JSON.

- [ ] **Step 5: Susun `BottomNavbar.tsx` dan integrasikan ke `src/App.tsx`**
  Navigasi 5 Tab (Feed, Outdoor GPS, Workout, Progress, Settings) dengan layout mobile-first dan dukungan layar lebar.

- [ ] **Step 6: Tambahkan `manifest.json` dan ikon PWA di `public/`**
  Konfigurasi PWA agar aplikasi dapat diinstal di smartphone (*Add to Home Screen*).

- [ ] **Step 7: Jalankan seluruh test suite & build verifikasi**
  Run: `npm run test && npm run build`
  Expected: PASS seluruh tes, build Vite sukses tanpa error TypeScript.

- [ ] **Step 8: Commit Task 6**
  Run: `git add . && git commit -m "feat: complete activity feed, settings, pwa integration, and full verification"`
