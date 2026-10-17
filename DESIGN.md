---
name: Tahes
description: Tactical Rally Pacebook & Zero-Equipment Bodyweight Tracker
colors:
  primary: "#FF3B00"
  primary-hover: "#D63200"
  neutral-bg: "#0B0F19"
  neutral-card: "#111827"
  neutral-card-soft: "#1A2436"
  neutral-border: "#24334A"
  neutral-text: "#F8FAFC"
  neutral-text-muted: "#8292A8"
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
    fontWeight: 900
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  caption:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.3
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "10px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.08em"
  micro:
    fontFamily: "monospace"
    fontSize: "9px"
    fontWeight: 800
    lineHeight: 1.1
  nano:
    fontFamily: "monospace"
    fontSize: "8px"
    fontWeight: 700
    lineHeight: 1.1
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "16px"
  "2xl": "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "14px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.neutral-card-soft}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "12px 18px"
  card-surface:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "20px"
  chip-badge:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-text-muted}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: Tahes

## Overview

**Creative North Star: "The Tactical Rally Pacebook"**

Tahes lahir dari disiplin reli ketahanan (*endurance rally*): kecepatan, presisi navigasi co-driver, dan toleransi nol terhadap kegagalan instrumen. Pada kecepatan tinggi di bawah sengatan sinar matahari tropis atau saat jemari basah oleh keringat, atlet tidak membutuhkan ornamen palsu, kartu bergradasi pastel, atau animasi kosmetik yang lambat. Mereka membutuhkan telemetri panggung (*stage telemetry*) yang terbaca instan dan tombol pemicu fisik yang memberikan konfirmasi sentuhan nyata.

Secara filosofis, Tahes memperlakukan setiap sesi olahraga sebagai etape reli (*rally stage*). Latar belakang aspal pekat (*asphalt black* `#0B0F19`) dipadukan dengan garis batas teknis `#24334A`, angka telemetri putih salju monospaced/tabular, dan aksen oranye reli berdaya pendar tinggi (*Rally Orange* `#FF3B00`) yang hanya dinyalakan pada metrik kritis dan pemicu aksi utama.

**Key Characteristics:**
- **Mechanical Cockpit Tactility:** Tombol aksi utama mengusung konstruksi mekanis taktil dengan border bawah tebal 4px yang menekan turun saat disentuh (*mechanical push feel*), memberikan kepastian responsif saat bergerak.
- **Rally Tripmeter Layout:** Metrik jarak, waktu elapsed, dan split pace tersusun dalam format tripmeter kokpit bergaris batas presisi dengan angka numerik proporsional tebal (*font-mono 900*).
- **Joint Shield Protocols:** Indikator ramah sendi (*zero impact*) dan zona keselamatan lutut ditandai dengan warna hijau emerald pelindung (`#10B981`) dan amber kewaspadaan (`#F59E0B`), menjaga keselamatan atlet berbobot 83kg secara non-kompromistis.

## Colors

Palet warna Tahes dirancang berdasarkan standar visibilitas instrumen kokpit reli malam dan siang hari.

### Primary
- **Rally Orange** (`#FF3B00`): Warna energi kinetik, pemicu start etape (*stage trigger*), dan jalur polyline rute GPS real-time.
- **Rally Orange Deep** (`#D63200`): Warna dasar saat tombol primer ditekan penuh.

### Secondary
- **Joint Shield Emerald** (`#10B981`): Menandai kepatuhan gerakan ramah sendi, target berat badan ideal, dan status etape selesai.
- **Caution Amber** (`#F59E0B`): Peringatan keselamatan lutut, indikator kalori terbakar, dan pencapaian streak harian.

### Neutral
- **Deep Asphalt** (`#0B0F19`): Kanvas terdalam kokpit; menghemat konsumsi baterai OLED ponsel low-end dan meniadakan silau outdoor.
- **Stage Slate** (`#111827`): Lapisan kontainer kartu etape dan instrumen telemetri utama.
- **Cockpit Soft** (`#1A2436`): Slot tombol sekunder dan wadah isian formulir.
- **Technical Border** (`#24334A`): Garis kisi instrumen teknis berketebalan 1px.
- **Pure White** (`#F8FAFC`): Angka telemetri utama dan teks pembacaan langsung.
- **Slate Technical Muted** (`#8292A8`): Satuan metrik (`km`, `kcal`, `min`) dan deskriptor etape.

### Named Rules
**The Stage Ignition Rule.** Warna oranye reli `#FF3B00` dibatasi khusus untuk aksi aktif dan data pace split real-time. Tidak boleh digunakan sebagai latar belakang teks pasif atau dekorasi non-fungsional.

## Typography

**Display & Headline Font:** Athletic Grotesque Sans (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)  
**Telemetry & Numbers Font:** Tabular Monospace Numerical Stack (`font-mono, monospace, tabular-nums`)  
**Stage Label Font:** Uppercase Heavy Condensed Sans  

**Character:** Tipografi Tahes bertenaga, kaku, dan presisi tinggi. Angka-angka numerik menggunakan font tabular monospaced agar tidak bergeser atau bergetar saat digit bertambah secara real-time.

### Hierarchy
- **Display** (weight: 900, size: `clamp(2.5rem, 5vw, 3.75rem)`, line-height: 1): Digunakan khusus untuk jarak etape tripmeter (`3.25`) dan timer mundur interval detik.
- **Headline** (weight: 900, size: `1.5rem` / 24px, line-height: 1.2): Judul etape dan modal ringkasan aktivitas.
- **Title** (weight: 900, size: `1.125rem` / 18px, line-height: 1.3): Judul sirkuit latihan dan nama gerakan kalistenik.
- **Body** (weight: 400, size: `0.875rem` / 14px, line-height: 1.5): Teks petunjuk postur dan catatan panduan AI coach.
- **Label** (weight: 800, size: `0.625rem` / 10px, letter-spacing: `0.08em`, text-transform: uppercase): Keterangan etape (`STAGE DISTANCE`, `ELAPSED`, `SPLIT PACE`, `CALORIES`).

### Named Rules
**The Tripmeter Primacy Rule.** Pada setiap kartu instrumen, angka numerik berbobot tebal minimal 2.5 kali lipat lebih besar dibanding teks label deskriptor di atasnya.

## Layout

Aplikasi mengadopsi tata letak **Rally Stage Console** yang dioptimalkan untuk genggaman satu tangan pada smartphone (`max-w-lg` 512px).

- **Grid Spasial:** Kelipatan ritme 4px, 8px, 12px, 16px.
- **Heads-Up Display (HUD):** Panel bawah pelacak GPS mengunci jarak utama di tengah dengan 3 slot sekunder bergaris batas presisi di bawahnya.
- **Pacer Bottom Dock:** Bar navigasi bawah berlatar `#0B0F19`/95 dengan tombol tengah lari berkarakter pemicu panggung (*stage ignition button*).

## Elevation & Depth

Tahes menggunakan pendekatan **Mechanical Depth & Beveled Edges**. Kedalaman tidak dibangun lewat bayangan kabur yang berat (*drop shadow blur*), melainkan melalui ketebalan garis batas bawah mekanis (*physical beveled borders*):
- Tombol Primer: `border-b-4 border-[#B82A00]` yang menekan turun `translateY(4px)` saat disentuh.
- Tombol Sekunder: `border-b-3 border-[#0F1622]` yang menekan turun `translateY(3px)` saat disentuh.
- Kartu Etape: Datar pada posisi diam (*flat at rest*) dengan garis tepi teknis `#24334A`.

### Shadow Vocabulary
- **Rally Beacon Pulse** (`box-shadow: 0 8px 20px -4px rgba(255, 59, 0, 0.3)`): Menyorot tombol utama mulai etape dan beacon posisi GPS aktif.

### Named Rules
**The Mechanical Confirmation Rule.** Setiap tombol kontrol aksi harus memiliki transisi penekanan fisik nyata (*tactile push response*) saat disentuh untuk mengonfirmasi eksekusi instruksi.

## Shapes

- **Stage Cards & Containers** (`rounded-2xl` / 16px): Kontainer instrumen dengan sudut membulat terkontrol yang kokoh dan efisien secara ruang.
- **Mechanical Buttons** (`rounded-xl` / 14px): Tombol pemicu dengan sudut tegas.
- **Telemetry Chips** (`rounded-md` / 6px): Badge kategori dan penanda status etape.

## Components

### Buttons
- **Shape:** Rounded-xl (14px), tinggi minimal 48px – 54px.
- **Primary:** Latar Rally Orange (`#FF3B00`), border bawah 4px `#B82A00`, teks putih tebal 900, efek tekan mekanis `active:translate-y-1`.
- **Secondary:** Latar Cockpit Soft (`#1A2436`), border teknis `#24334A`, border bawah 3px `#0F1622`, teks putih tebal 700.

### Cards / Containers
- **Corner Style:** Rounded-2xl (16px).
- **Background:** Stage Slate (`#111827`) dengan border teknis 1px (`#24334A`).
- **Internal Padding:** 16px hingga 20px (`p-4` atau `p-5`).

### Inputs / Fields
- **Style:** Latar gelap Deep Asphalt (`#0B0F19`), border teknis `#24334A`, teks putih tajam, radius 12px.
- **Focus State:** Garis batas menyala menjadi Rally Orange (`#FF3B00`) tanpa cincin pendar kabur berlebih.

### Navigation
- **Pacer Console Dock:** Bar navigasi 5 tab dengan ikon monoline Lucide React. Tab aktif disorot dengan warna Rally Orange dan pill penanda dasar.

### Signature Component: The Rally Tripmeter Display
- Modul pembacaan jarak panggung terintegrasi dengan angka kilometer raksasa font-mono 900 di atas latar asphalt, diapit oleh tiga pembacaan telemetry split pace, waktu elapsed, dan kalori terhitung untuk berat badan 83kg.

## Do's and Don'ts

### Do:
- **Do** gunakan font tabular monospaced untuk angka metrik kecepatan, jarak, dan countdown timer agar tidak bergetar saat digit berubah.
- **Do** berikan tombol aksi ruang sentuh minimal 48x48px dengan umpan balik penekanan mekanis.
- **Do** utamakan kontras tinggi minimal 7:1 untuk teks instruksi dan angka metrik di bawah terik matahari.
- **Do** pertahankan label ramah sendi (*zero impact*) pada setiap gerakan yang melibatkan lutut untuk atlet 83kg.

### Don't:
- **Don't** menggunakan gradasi warna pastel atau bayangan blur tebal yang mengurangi keterbacaan di luar ruangan.
- **Don't** mengubah posisi tombol saat transisi status latihan sedang berlangsung.
- **Don't** menyembunyikan metrik split pace dan jarak tempuh di balik menu tambahan.
- **Don't** menggunakan huruf berukuran di bawah 10px pada smartphone.
