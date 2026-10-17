# Design Specification: Personal Strava & Bodyweight Fitness Tracker

## 1. Overview & Context

Aplikasi **Personal Strava & Bodyweight Tracker** adalah web app responsif (Progressive Web App / PWA) yang dirancang khusus untuk memfasilitasi program penurunan berat badan mandiri tanpa alat gym (*zero-equipment*). Aplikasi ini menggabungkan fitur pelacakan rute luar ruangan berbasis GPS ala Strava dengan modul latihan kalistenik/beban tubuh dalam ruangan (*indoor bodyweight workout*) yang dilengkapi animasi panduan gerakan *faceless* dan asisten mentor kebugaran.

### Profil Pengguna & Parameter Fisik
- **Tinggi Badan:** 165 cm
- **Berat Badan Awal:** 83 kg
- **Usia:** 26 tahun
- **Indeks Massa Tubuh (BMI):** ~30.5 kg/m² (Kategori Obesitas Tingkat 1)
- **BMR (Mifflin-St Jeor):** $10 \times 83 + 6.25 \times 165 - 5 \times 26 + 5 \approx 1.736\text{ kkal/hari}$
- **TDEE (Aktivitas Sedang 3-5x/minggu):** $\approx 2.250 - 2.350\text{ kkal/hari}$
- **Target Berat Badan:** 65 kg (BMI normal ~23.9)
- **Strategi Utama:** Defisit kalori harian ~400-500 kkal ($1.750 - 1.850\text{ kkal/hari}$) dikombinasikan dengan latihan kardio *low-impact* (jalan cepat/jogging santai) dan penguatan otot beban tubuh yang ramah sendi lutut.

---

## 2. Arsitektur Sistem

Aplikasi dibangun dengan arsitektur **Local-First & Offline-Capable PWA** tanpa ketergantungan wajib pada server backend, sehingga data privasi 100% tersimpan di perangkat pengguna dan dapat berjalan lancar saat berolahraga di luar ruangan tanpa sinyal internet.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Personal Strava UI Layer                        │
│   React 18 + Vite + Tailwind CSS + Lucide React + Leaflet OpenStreetMap│
└────────────────────────────────────────────────────────────────────────┘
       │                          │                         │
       ▼                          ▼                         ▼
┌──────────────┐       ┌──────────────────────┐   ┌──────────────────────┐
│ GPS & Sensors│       │ Workout & Timer Core │   │ Body & Mentor Engine │
│- Geolocation │       │- Faceless Anim SVG   │   │- BMR/TDEE Calculator │
│- Leaflet Map │       │- Audio Web Audio API │   │- Weight Loss Graph   │
│- Wake Lock   │       │- Work/Rest Interval  │   │- Low-impact Program  │
└──────────────┘       └──────────────────────┘   └──────────────────────┘
       │                          │                         │
       └──────────────────────────┼─────────────────────────┘
                                  ▼
                ┌───────────────────────────────────┐
                │        Local Storage Layer        │
                │ - IndexedDB: GPS tracks, log      │
                │ - LocalStorage: Profile & Config  │
                │ - JSON Data Backup / Restore      │
                └─────────────────┬─────────────────┘
                                  │ (Opsional via API Key)
                                  ▼
                ┌───────────────────────────────────┐
                │       Gemini AI Coach SDK         │
                │ - Chat Konsultasi Form & Nyeri    │
                │ - Post-workout Motivational Recap │
                └───────────────────────────────────┘
```

### Tech Stack
- **Framework:** React 18 (TypeScript) + Vite
- **Styling & UI:** Tailwind CSS (skema warna Strava: Oranye Athletic `#FC4C02`, Slate Dark `#0F172A`, Slate Card `#1E293B`, Gray Text `#94A3B8`)
- **Peta & Geolocation:** Leaflet + React-Leaflet + OpenStreetMap tiles
- **Ikon:** Lucide React
- **Penyimpanan Lokal:** Dexie.js (IndexedDB wrapper) untuk riwayat aktivitas dan koordinat rute GPS; LocalStorage untuk pengaturan profil pengguna
- **Audio & Haptics:** Web Audio API (synthesizer beep frekuensi tinggi untuk penanda interval 3-2-1 tanpa perlu unduh file MP3 eksternal)
- **Layar Aktif:** Screen Wake Lock API (mencegah layar mati otomatis saat GPS tracking atau timer berlangsung)
- **AI Integration:** Google Gen AI SDK (`@google/genai` atau direct fetch) dengan API key lokal di browser pengguna

---

## 3. Komponen & Modul Aplikasi

### 3.1. Modul Outdoor GPS Tracker (Ala Strava)
1. **Perekaman Real-Time:**
   - Memanfaatkan `navigator.geolocation.watchPosition` dengan opsi `enableHighAccuracy: true`.
   - Mengakumulasi jarak menggunakan formula *Haversine* antar titik koordinat berturut-turut dengan filter akurasi (mengabaikan lonjakan GPS yang tidak realistis `accuracy > 30m`).
   - Perhitungan *Current Pace* (menit/km dari 3 titik terakhir) dan *Average Pace* (total waktu gerak / total jarak).
   - Estimasi pembakaran kalori real-time berbasis MET (*Metabolic Equivalent of Task*):
     - Brisk Walk (~5.5 - 6.0 km/jam): MET 4.3 $\rightarrow$ Kalori/menit = $(4.3 \times 3.5 \times 83) / 200 \approx 6.2\text{ kkal/menit}$.
     - Jogging Santai (~7.5 - 8.0 km/jam): MET 7.0 $\rightarrow$ $\approx 10.1\text{ kkal/menit}$.
2. **Visualisasi Peta Leaflet:**
   - Polyline rute berwarna oranye Strava tebal `#FC4C02` dengan animasi titik marker lokasi saat ini.
   - Penanda titik *Start* (hijau) dan *Finish* (merah).
   - Mode layar penuh dengan HUD (*Heads-Up Display*) metrik besar: Jarak (km), Durasi (hh:mm:ss), Pace (min/km), Kalori (kkal).
3. **Kontrol Sesi:**
   - Tombol Start, Pause, Resume, dan Finish.
   - Peringatan konfirmasi saat menyelesaikan latihan.
   - Fitur Split Audio Lap: Bunyi nada khusus setiap kelipatan 1.0 km.
   - Kartu Ringkasan Aktivitas (*Summary Card*) yang menampilkan statistik lengkap dan rute peta mini.

### 3.2. Modul Indoor Bodyweight & Workout Player (Clean Posture Guide)
1. **Panduan Visual & Gerakan Minimalis:**
   - Menggunakan kartu panduan bersih (*Clean Posture & Cue Cards*) dengan ikon anatomi/kategori gerakan (Lucide React) dan petunjuk postur bertahap (Form Cues, Otot Sasaran, dan Kesalahan Umum).
   - Fokus pada fungsionalitas timer, repetisi, dan instruksi teknis yang mudah dibaca saat berolahraga tanpa distraksi animasi berat.
2. **Katalog Gerakan Terkurasi (Ramah Sendi untuk BB 83 kg):**
   - **Incline Push-Up:** Mengurangi beban pergelangan tangan & dada dengan tumpuan meja/dinding.
   - **Box / Chair Squat:** Gerakan squat bertumpu pada kursi untuk menjaga sudut lutut tidak melewati batas aman.
   - **Glute Bridge:** Mengaktifkan otot gluteus dan hamstring tanpa ada beban pada lutut.
   - **Plank:** Penguatan core statis tanpa gerakan meliuk pada tulang punggung.
   - **Dead Bug:** Melatih stabilitas perut dan panggul sambil berbaring telentang.
   - **Step Jacks:** Alternatif low-impact dari jumping jacks (langkah samping bergantian dengan ayunan tangan).
   - **Wall Sit:** Latihan isometrik paha depan yang stabil dan aman untuk lutut.
   - **Bird Dog:** Memperkuat punggung bawah dan postur tubuh.
3. **Player Timer Interval:**
   - Mode Kerja (Work: misal 30 detik) dan Istirahat (Rest: misal 15 detik).
   - Hitung mundur audio synthesizer (beep pendek di 3, 2, 1 dan nada tinggi di tanda Mulai/Ganti).
   - Penjelasan teks panduan singkat: *Cues* postur yang benar dan apa yang harus dihindari.
   - Tombol Next Exercise, Pause, dan Skip.

### 3.3. Modul Progres Berat Badan & Mentor Nutrisi
1. **Pencatatan Berat Badan:**
   - Input tanggal, berat badan (kg), lingkar pinggang (opsional), dan catatan perasaan harian.
   - Grafik interaktif tren berat badan (Garis aktual vs Garis target 65 kg).
   - Indikator penurunan berat badan mingguan dan akumulasi kilogram yang berhasil dipangkas.
2. **Kalkulator Kebugaran:**
   - BMI Tracker dengan badge status (Normal, Overweight, Obesitas 1).
   - Rekomendasi asupan kalori defisit harian berdasarkan berat badan terkini.
3. **Asisten AI Mentor (Hybrid):**
   - **Rule-Based Built-in:** Tips harian otomatis seputar hidrasi, istirahat, dan pencegahan cedera tanpa butuh internet.
   - **Gemini AI Coach:** Panel obrolan interaktif langsung untuk konsultasi form gerakan, alternatif latihan jika lelah, dan evaluasi makanan harian (jika API Key dimasukkan di pengaturan).

---

## 4. Skema Data (IndexedDB & LocalStorage)

### 4.1. LocalStorage (`strava_user_profile`)
```typescript
interface UserProfile {
  name: string;
  age: number;             // Default: 26
  heightCm: number;        // Default: 165
  currentWeightKg: number; // Default: 83
  targetWeightKg: number;  // Default: 65
  geminiApiKey?: string;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  voiceAlertsEnabled: boolean;
}
```

### 4.2. IndexedDB Database (`PersonalStravaDB`)
- **Store 1: `activities`**
  ```typescript
  interface Activity {
    id: string;               // UUID / timestamp string
    type: 'brisk_walk' | 'run' | 'bodyweight' | 'hiit';
    title: string;
    startTime: number;        // Epoch timestamp
    endTime: number;
    durationSeconds: number;
    caloriesBurned: number;
    // Khusus Outdoor
    distanceKm?: number;
    avgPaceSecondsPerKm?: number;
    routeCoordinates?: Array<{ lat: number; lng: number; time: number }>;
    // Khusus Indoor
    routineName?: string;
    completedExercises?: Array<{
      exerciseId: string;
      exerciseName: string;
      setsCompleted: number;
      repsOrDuration: string;
    }>;
    notes?: string;
  }
  ```
- **Store 2: `weight_logs`**
  ```typescript
  interface WeightEntry {
    id: string;
    date: string;            // YYYY-MM-DD
    weightKg: number;
    notes?: string;
  }
  ```

---

## 5. Alur Navigasi & Tampilan Antarmuka

Aplikasi menggunakan layout responsif mobile-first dengan **Bottom Navigation Bar** untuk smartphone dan sidebar ringkas untuk tampilan desktop:

1. **Tab 1: Feed / Dashboard**
   - Ringkasan statistik mingguan: Total Jarak, Total Durasi, Total Kalori, Streak Hari Aktif.
   - Feed riwayat aktivitas bergaya Strava (menampilkan ringkasan visual, badge jenis olahraga, dan kartu preview).
2. **Tab 2: Outdoor GPS (Record)**
   - Peta Leaflet penuh dengan HUD kontrol, tombol Record oranye mengambang, pemilihan mode (Jalan Cepat vs Jogging).
3. **Tab 3: Workout (Indoor)**
   - Pilihan: Program Mentor 4-Minggu, Custom Interval Timer, atau Latihan Cepat 15 Menit.
   - Fullscreen Animated Workout Player dengan animasi siluet *faceless* dan audio interval.
4. **Tab 4: Progress & Mentor**
   - Grafik penurunan berat badan, kalkulator BMI & TDEE, serta tab konsultasi AI Mentor.
5. **Tab 5: Settings**
   - Konfigurasi profil fisik, toggle suara audio beep, manajemen kunci API Gemini, dan tombol Backup / Restore Data (file `.json`).

---

## 6. Penanganan Error & Edge Cases
- **Izin GPS Ditolak / Tidak Tersedia:** Tampilkan dialog instruksi ramah pengguna untuk mengaktifkan izin lokasi di browser atau beralih ke input manual jarak/durasi.
- **Lonjakan GPS / Akurasi Rendah:** Filter titik dengan `accuracy > 30` meter agar jarak tidak bertambah tiba-tiba saat diam di tempat.
- **Layar Mati saat Tracking:** Gunakan `navigator.wakeLock.request('screen')` saat sesi aktif, dan tangani *visibilitychange* untuk meminta kembali wake lock saat pengguna kembali ke tab browser.
- **Koneksi Internet Putus:** Seluruh kalkulasi, database IndexedDB, audio synthesizer, dan animasi siluet tetap berfungsi 100% tanpa gangguan. Peta menggunakan caching tile OpenStreetMap.
- **API Key Gemini Tidak Valid / Habis Kuota:** Tampilkan pesan error yang jelas dan kembalikan asisten ke mode rekomendasi lokal tanpa merusak aplikasi.

---

## 7. Rencana Pengujian (Testing Strategy)
- **Unit Testing:**
  - Formula perhitungan jarak Haversine & filter akurasi.
  - Perhitungan Pace (menit:detik per km).
  - Formula kalori MET spesifik bobot 83 kg.
  - Perhitungan BMR & TDEE Mifflin-St Jeor.
- **Integration Testing:**
  - Operasi CRUD IndexedDB untuk aktivitas dan log berat badan.
  - Alur ekspor dan impor backup data JSON.
  - Transisi state Workout Timer (Work -> Rest -> Next -> Completed).
- **Manual Device Verification:**
  - Uji responsivitas pada layar mobile browser (Chrome/Safari di HP).
  - Uji audio beep synthesizer pada browser mobile.
  - Uji Leaflet GPS live tracking pada rute jalan nyata.
