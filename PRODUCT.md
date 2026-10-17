# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Pengguna Utama:** Pria usia 26 tahun, tinggi badan 165 cm, berat badan awal 83 kg (kategori Obesitas Tingkat 1 dengan BMI ~30.5).
- **Situasi & Kebutuhan:** Membutuhkan panduan dan alat pelacak mandiri untuk menurunkan berat badan menuju target 65 kg (BMI normal) secara konsisten dan aman dari cedera sendi/lutut, tanpa menggunakan alat gym apapun (*zero-equipment*).

## Product Purpose
**Tahes** (bahasa walikan khas Jawa Timur yang berarti "Sehat") adalah aplikasi pelacak kebugaran dan mentor penurunan berat badan personal bergaya Strava yang berjalan 100% *offline-first* di web/PWA smartphone. Aplikasi ini bertujuan mendampingi pengguna mencapai defisit kalori harian yang sehat melalui kombinasi jalan cepat/jogging outdoor dan latihan penguatan beban tubuh (*bodyweight calisthenics*) ramah lutut di rumah.

## Positioning
Berbeda dari Strava konvensional yang berfokus pada media sosial publik dan kompetisi kecepatan lari/sepeda, **Tahes** adalah pelacak privat (*Personal Strava*) yang menggabungkan:
1. Pelacakan rute GPS jalan/lari tanpa ketergantungan server cloud.
2. Katalog sirkuit kalistenik bebas loncatan (*low impact*) yang secara khusus disesuaikan untuk melindungi sendi individu dengan kelebihan beban (BB 83 kg).
3. Konsultasi AI Mentor langsung yang memberikan alternatif gerakan saat tubuh pegal serta panduan defisit kalori tanpa biaya langganan.

## Operating Context
- **Lingkungan Penggunaan:** Digunakan di luar ruangan saat jalan cepat pagi/sore hari (di jalan komplek, taman terbuka, atau jalan aspal) dan di dalam ruangan/kamar tidur saat melakukan sirkuit kalistenik.
- **Ritual Olahraga:**
  - 3–4x seminggu: *Brisk walking* / jalan cepat 30–45 menit outdoor.
  - 2–3x seminggu: Sirkuit penguatan beban tubuh (*Incline push-ups*, *Chair squats*, *Glute bridges*, *Planks*, *Step jacks*).
  - Mingguan: Timbang berat badan setiap hari Minggu pagi untuk mencatat progres ke dalam grafik.
- **Kendala Perangkat:** Sering dijalankan pada smartphone hemat baterai/low-end, membutuhkan konsumsi memori ringan, pencegah layar mati (*Wake Lock*), dan nada audio penanda interval yang tidak bergantung pada file eksternal.

## Capabilities and Constraints
- **Capabilities:**
  - Real-time GPS tracking dengan OpenStreetMap via Leaflet, live pace (`MM:SS /km`), jarak (km), split audio 1 km, dan kalori MET spesifik bobot pengguna.
  - Guided Interval Player untuk sirkuit beban tubuh dengan audio synthesizer countdown 3-2-1 dan petunjuk postur aman.
  - Kalkulator metabolik otomatis (BMR Mifflin-St Jeor, TDEE, defisit kalori harian ~1.800 kkal, dan BMI).
  - Grafik tren penurunan berat badan dari 83 kg ke 65 kg.
  - Smart Rule-Based Mentor yang berfungsi 100% offline + integrasi opsional Google Gemini API Key.
  - Penyimpanan lokal penuh di IndexedDB + LocalStorage dengan fitur Ekspor & Impor cadangan JSON.
- **Constraints:**
  - *Zero equipment:* Tidak boleh ada instruksi atau fitur yang mewajibkan barbel, dumbbell, mesin gym, atau alat berbayar.
  - *Joint Protection:* Menghindari gerakan *high-impact* seperti jumping squats berlebih atau burpees agresif pada fase awal.
  - *Privacy-First:* Tidak ada data kesehatan atau koordinat GPS pribadi yang diunggah ke pihak ketiga tanpa izin pengguna.

## Brand Commitments
- **Nama Produk:** **Tahes** (Sehat).
- **Tone of Voice:** Suportif, memotivasi, realistis, ramah, dan berbasis sains kebugaran tanpa menghakimi.
- **Identitas Visual:** Atletik modern bergaya Strava (oranye menyala `#FC4C02`, latar gelap pekat `#020617`, kartu slate `#0F172A`/`#1E293B`, tipografi angka kontras tinggi).

## Evidence on Hand
- Repositori aktif dengan implementasi produksi lengkap berbasis React 18, Vite, Tailwind CSS, Leaflet, Lucide Icons, dan Dexie.js.
- Seluruh spesifikasi desain terdokumentasi di `docs/superpowers/specs/2026-10-17-personal-strava-weightloss-design.md` dan rencana implementasi di `docs/superpowers/plans/2026-10-17-personal-strava-weightloss.md`.
- 35 unit test lulus uji verifikasi otomatis.

## Product Principles
1. **Keamanan Sendi Sebelum Intensitas:** Di bobot 83 kg, mencegah cedera lutut jauh lebih penting daripada memaksakan loncatan ekstrem. Latihan harus berkelanjutan (*sustainable*).
2. **Kemandirian Lokal & Tanpa Hambatan (*Zero Friction*):** Aplikasi harus bisa langsung dibuka dan dipakai berolahraga tanpa keharusan login, tanpa wajib kuota internet, dan tanpa bergantung pada server luar.
3. **Kejelasan Metrik yang Memotivasi:** Angka pace, jarak, kalori, dan grafik penurunan timbangan disajikan bersih dan kontras tinggi agar mudah dipantau sekilas saat berolahraga.
4. **Pendampingan yang Mengedukasi:** Memberikan pemahaman mengapa defisit kalori dan latihan beban tubuh penting menjaga massa otot saat membakar lemak.

## Accessibility & Inclusion
- Layout ramah satu tangan pada layar smartphone dengan target sentuh tombol aksi minimal 44x44px.
- Kontras teks tinggi untuk keterbacaan di bawah sinar matahari luar ruangan.
- Sinyal ganda (visual teks + audio synthesizer beep) untuk setiap transisi waktu latihan dan kilometer split.
