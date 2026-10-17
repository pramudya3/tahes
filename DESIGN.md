---
name: Tahes
description: Personal Strava & Zero-Equipment Bodyweight Tracker
colors:
  primary: "#FC4C02"
  primary-hover: "#E34402"
  neutral-bg: "#020617"
  neutral-card: "#0F172A"
  neutral-card-soft: "#1E293B"
  neutral-border: "#334155"
  neutral-text: "#F8FAFC"
  neutral-text-muted: "#94A3B8"
  accent-success: "#10B981"
  accent-warning: "#F59E0B"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.neutral-card-soft}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "14px 20px"
  card-surface:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "20px"
  chip-badge:
    backgroundColor: "{colors.neutral-card-soft}"
    textColor: "{colors.neutral-text-muted}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Tahes

## Overview

**Creative North Star: "The Minimalist Trackbook"**

Tahes mengusung estetika buku catatan atletik digital (*trackbook*) yang ultra-minimalis, presisi, dan bebas dari ornamen palsu. Desainnya lahir dari kebutuhan nyata seorang atlet yang sedang berolahraga di bawah terik matahari atau saat tangan basah oleh keringat: informasi harus terbaca dalam sepersekian detik, tanpa keraguan, dan tanpa tombol kecil yang sulit disentuh.

Secara filosofis, visual Tahes tidak meniru aplikasi media sosial yang bising dengan dekorasi gradien berlebihan atau animasi kosmetik yang lambat. Sebaliknya, antarmukanya memanfaatkan kanvas gelap pekat (*deep nocturnal slate*) sebagai latar tenang, di mana angka-angka metrik olahraga dan garis rute GPS oranye menyala tampil dengan kontras murni seperti instrumen kokpit pesawat performa tinggi.

**Key Characteristics:**
- **Extreme Contrast at Rest:** Teks dan angka utama berwarna putih salju tajam di atas lapisan slate hitam, menjamin keterbacaan tinggi di luar ruangan.
- **Selective Ignition:** Warna oranye Strava (`#FC4C02`) hanya dinyalakan untuk aksi utama, rute gerak aktif, dan metrik penting; warna tidak dihamburkan ke seluruh penjuru layar.
- **Generous Touch Targets:** Sudut membulat organik (*tactile curvature* 16px – 24px) dengan area tekan besar yang memberikan rasa percaya diri saat tombol dipicu saat bergerak.

## Colors

Palet warna Tahes didasarkan pada prinsip instrumen monokrom gelap dengan aksen kinetik tunggal yang bertenaga.

### Primary
- **Ignition Orange** (`#FC4C02`): Representasi energi, tekad pembakaran kalori, dan identitas atletik lari. Digunakan secara eksklusif untuk tombol CTA utama, polyline rute GPS real-time, badge aktif, dan highlight data kecepatan (pace).
- **Ignition Orange Deep** (`#E34402`): Warna transisi saat tombol primer disentuh atau ditekan (*active state*).

### Secondary
- **Kinetic Amber** (`#F59E0B`): Digunakan khusus untuk kalori terbakar, penanda *streak* konsistensi harian, dan peringatan keselamatan lutut.
- **Joint Shield Emerald** (`#10B981`): Digunakan untuk penanda gerakan ramah sendi, target berat badan ideal, dan status keberhasilan sesi latihan.

### Neutral
- **Nocturnal Base** (`#020617`): Kanvas terdalam layar; menghemat konsumsi daya layar OLED di smartphone dan meniadakan silau saat dipakai subuh atau malam hari.
- **Card Slate Layer** (`#0F172A`): Lapisan permukaan kartu konten utama yang memberikan batas visual lembut tanpa memerlukan garis tepi tebal.
- **Card Surface Soft** (`#1E293B`): Lapisan untuk kartu bersarang (*nested slot*), kolom input, dan latar tombol sekunder.
- **Subtle Border** (`#334155`): Garis pembatas 1px yang halus, memisahkan hirarki informasi secara bersih.
- **Pure White** (`#F8FAFC`): Nilai metrik utama, judul, dan angka besar.
- **Slate Muted** (`#94A3B8`): Label keterangan, satuan (`km`, `kkal`, `/km`), dan teks instruksi sekunder.

### Named Rules
**The 10% Ignition Rule.** Warna oranye primer hanya boleh menempati maksimal 10% dari total area visual pada satu layar. Kelangkaan warna oranye adalah alasan mengapa ia begitu kuat memandu mata pengguna.

## Typography

**Display & Headline Font:** System Athletic Sans-Serif (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)  
**Data & Numbers Font:** Bold Proportional Numerical Weighting  
**Label Font:** Uppercase Tracked Sans-Serif  

**Character:** Tipografi Tahes lugas, fungsional, dan maskulin tanpa terkesan kaku. Berat huruf meloncat dramatis antara angka raksasa yang sangat tebal (*black 900*) dan label mikro yang renggang (*tracked uppercase 700*).

### Hierarchy
- **Display** (weight: 900, size: `clamp(2.5rem, 5vw, 3.75rem)`, line-height: 1): Digunakan khusus untuk metrik pahlawan seperti kilometer total pada layar pelacak (`0.00`) dan hitung mundur timer detik (`30`).
- **Headline** (weight: 900, size: `1.5rem` / 24px, line-height: 1.2): Judul halaman utama, kartu ucapan beranda, dan modal selesai latihan.
- **Title** (weight: 800, size: `1.125rem` / 18px, line-height: 1.3): Judul program latihan, nama gerakan kalistenik, dan sub-header kartu.
- **Body** (weight: 400, size: `0.875rem` / 14px, line-height: 1.5): Teks petunjuk postur, deskripsi sirkuit latihan, dan pesan obrolan AI Coach.
- **Label** (weight: 700, size: `0.6875rem` / 11px, letter-spacing: `0.08em`, text-transform: uppercase): Keterangan metrik (`JARAK`, `WAKTU`, `AVG PACE`, `KALORI`).

### Named Rules
**The Number-First Rule.** Dalam setiap kartu metrik olahraga, angka kuantitatif selalu berukuran minimal 2 kali lebih besar daripada label teks penjelasnya.

## Layout

Aplikasi dirancang dengan pendekatan **Mobile-First Track Layout** yang dibatasi pada lebar maksimal (`max-w-lg` atau 512px) di desktop agar tetap menjaga proporsi ergonomis genggaman tangan satu jempol (*thumb zone*).

- **Grid Spasial:** Kelipatan ritme 4px dan 8px (`gap-2`, `gap-3`, `gap-4`).
- **Bottom Navigation Dock:** Mengambang permanen di bagian bawah layar dengan efek kaca buram (*backdrop-blur-md*) dan padding area aman perangkat (`safe-area-inset-bottom`).
- **HUD (Heads-Up Display) Panel:** Bagian bawah pelacak GPS mengunci 3 kolom metrik terpenting dalam rasio horizontal 1:1:1.

## Elevation & Depth

Tahes menganut filosofi **Tonal Layering** murni. Permukaan antarmuka berwujud datar pada kondisi diam (*flat at rest*). Ilusi kedalaman tidak diciptakan oleh bayangan tebal yang keruh, melainkan melalui perbedaan kontras alami antar tingkat warna abu-abu gelap:
1. Lapisan 0: Dasar Layar (`#020617`)
2. Lapisan 1: Kartu Utama (`#0F172A`)
3. Lapisan 2: Slot Metrik & Tombol (`#020617` transparan atau `#1E293B`)

### Shadow Vocabulary
- **Ignition Pulse** (`box-shadow: 0 10px 25px -5px rgba(252, 76, 2, 0.25)`): Diberikan eksklusif pada tombol aksi utama oranye dan marker posisi GPS untuk memberi kesan bertenaga.
- **Dock Glass Shadow** (`box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5)`): Memberikan batas apung bagi navigasi bawah terhadap konten yang digulir.

### Named Rules
**The Flat-At-Rest Rule.** Seluruh kartu dan container bersikap datar pada kondisi diam. Bayangan dan efek glow oranye hanya diizinkan muncul sebagai respons terhadap interaksi sentuh atau status sesi yang sedang merekam aktif.

## Shapes

Bahasa bentuk Tahes memadukan geometri fungsional dengan kelengkungan organik yang ramah jempol tangan:
- **Pill Containers** (`rounded-3xl` / 24px): Kartu feed, modal timbangan, dan dialog latihan. Sudut lengkung yang lebar memberikan kesan modern, ramah, dan tidak menusuk mata.
- **Action Buttons & Input** (`rounded-2xl` / 16px): Tombol pemicu sesi olahraga dan bidang isian form.
- **Pill Badges** (`rounded-full` / 9999px): Indikator status kategori (misal *Ramah Sendi*, *Streak*, *Pace Split*).

## Components

### Buttons
- **Shape:** Rounded-2xl (16px radius), tinggi minimal 48px – 56px.
- **Primary:** Latar belakang Ignition Orange (`#FC4C02`), teks putih bold tebal, bayangan lembut oranye, transisi sentuh mengecil halus (`active:scale-[0.98]`).
- **Secondary / Ghost:** Latar belakang Slate (`#1E293B`), garis batas halus 1px (`#334155`), teks slate terang.

### Cards / Containers
- **Corner Style:** Rounded-3xl (24px radius).
- **Background:** Slate 900 (`#0F172A`) dengan border tipis 1px (`#1E293B`).
- **Internal Padding:** 16px hingga 20px (`p-4` atau `p-5`).

### Inputs / Fields
- **Style:** Latar gelap Slate 950 (`#020617`), border Slate 800, teks putih tajam, radius 12px – 16px.
- **Focus State:** Garis batas berubah tegas menjadi Ignition Orange (`#FC4C02`) tanpa outline bawaan browser.

### Navigation
- **Bottom Dock:** Bar navigasi 5 tab dengan ikon Lucide React berukuran 20px. Tab aktif ditandai dengan ikon dan teks oranye menyala serta titik aksen di bawahnya. Tombol tengah lari/jalan (*Record*) memiliki bingkai aksen bulat yang sedikit lebih menonjol.

### Signature Component: The Workout Countdown Ring
- Cincin lingkaran SVG 192px yang berputar hitung mundur dengan garis tepi 12px. Warna cincin berubah dinamis: **Oranye** saat fase kerja/latihan berlangsung, dan seketika berubah menjadi **Hijau Emerald** yang menenangkan saat waktu istirahat antar set dimulai.

## Do's and Don'ts

### Do:
- **Do** gunakan rasio kontras minimal 4.5:1 untuk semua teks instruksi dan 7:1 untuk angka metrik kecepatan/jarak.
- **Do** beri ruang sentuh minimal 44x44px untuk setiap elemen yang dapat diklik di smartphone.
- **Do** sertakan satuan metrik (`km`, `kkal`, `/km`, `detik`) dalam format ukuran yang lebih kecil dan warna muted tepat di samping atau di bawah angka utama.
- **Do** pertahankan palet oranye `#FC4C02` khusus untuk hal-hal yang berkaitan dengan aksi, energi gerak, dan pencapaian.

### Don't:
- **Don't** menggunakan warna merah menyala untuk pesan umum; gunakan amber untuk peringatan kehati-hatian lutut dan oranye untuk identitas brand.
- **Don't** memasang animasi dekoratif yang memperlambat transisi layar saat pengguna sedang berolahraga.
- **Don't** menyembunyikan metrik kritis (jarak tempuh dan waktu berjalan) di balik menu atau gestur geser tambahan.
- **Don't** menggunakan huruf berukuran di bawah 10px pada antarmuka smartphone.
