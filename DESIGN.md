---
name: Tahes
description: The Monochrome Monolith - Precision Minimalist Bodyweight & Fitness Instrument
colors:
  primary: "#FFFFFF"
  primary-hover: "#E4E4E7"
  primary-text: "#09090B"
  accent-stop: "#FF2E54"
  neutral-bg: "#09090B"
  neutral-card: "#121214"
  neutral-card-soft: "#18181B"
  neutral-border: "#27272A"
  neutral-text: "#FFFFFF"
  neutral-text-muted: "#A1A1AA"
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
    textColor: "{colors.primary-text}"
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
    backgroundColor: "{colors.neutral-card-soft}"
    textColor: "{colors.neutral-text-muted}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: Tahes

## Overview

**Creative North Star: "The Monochrome Monolith"**

Tahes mengadopsi estetika instrumen presisi monokromatik brutalist yang terinspirasi dari filosofi desain industri Dieter Rams (Braun ET66, AW10), Teenage Engineering (OP-1, TP-7), Leica Monochrom, dan instrumen kronometer laboratorium Swiss. 

Pendekatan ini mengeliminasi kebisingan warna (*dopamine-chasing color noise*) dan menggantikannya dengan kejernihan absolut:
1. **Zero-Distraction Telemetry:** Angka metrik, waktu split, dan status denyut tubuh disajikan dengan kontras monokromatik ekstrem (21:1 WCAG AAA) menggunakan tipografi tabular berbobot tebal di atas kanvas karbon pekat.
2. **Tactile Mechanical Buttons:** Tombol aksi utama mengusung plat putih solid (*Pure Stark White* `#FFFFFF`) dengan teks karbon legam (`#09090B`) dan fondasi beveled perak (`#A1A1AA`) yang menekan turun saat disentuh fisik.
3. **The Laser Crimson Needle:** Mengacu pada tombol shutter merah Leica dan jarum split chronometer, aksen merah Laser Crimson (`#FF2E54` / `#DC2626`) dikhususkan secara sangat ketat (*hyper-restricted*) hanya untuk pemicu penahanan selesai (*hold-to-finish*), beacon perekaman aktif, dan aksi destruktif.

## Colors

### Primary
- **Stark Pure White** (`#FFFFFF`): Warna pemicu aksi utama (*primary trigger*), angka telemetri jarak puncak, dan kurva rute polyline GPS aktif.
- **Brushed Silver / Hover** (`#E4E4E7`): Warna keadaan saat tombol putih disentuh atau di-hover.
- **Jet Carbon Text** (`#09090B`): Warna teks di atas plat putih tombol aksi untuk kontras absolut 21:1.

### Safety & Emergency
- **Laser Crimson Needle** (`#FF2E54` / `#DC2626`): Jarum krisis instrumen; pemicu hold-to-finish, tombol rekam live beacon, dan konfirmasi pembatalan.
- **Joint Shield Emerald** (`#10B981`): Status gerakan aman sendi (*zero impact*), kepatuhan istirahat, dan garis sasaran berat badan ideal (65 kg).
- **Caution Zinc / Amber** (`#F59E0B`): Digunakan hemat untuk peringatan beban lutut dan streak harian.

### Neutral Containers
- **Matte Carbon Canvas** (`#09090B`): Kanvas instrumen terdalam; mematikan piksel OLED smartphone untuk efisiensi baterai maksimal dan meniadakan silau refleksi.
- **Obsidian Charcoal** (`#121214`): Wadah kartu etape telemetri dan panel aktivitas.
- **Zinc Elevated Soft** (`#18181B`): Lapisan elevasi sekunder, wadah isian formulir, dan tombol sekunder.
- **Precision Wire Silver** (`#27272A`): Garis kisi instrumen teknis berketebalan 1px.
- **Pure White Text** (`#FFFFFF`): Angka telemetri utama dan judul etape.
- **Cool Zinc Muted** (`#A1A1AA`): Satuan metrik (`km`, `min`, `kcal`), label deskriptor, dan teks panduan postur.

## Typography

**Display & Headline Font:** Grotesque Athletic Sans (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)  
**Telemetry & Numbers Font:** Tabular Monospace Numerical Stack (`font-mono, monospace, tabular-nums`)  
**Instrument Label Font:** Uppercase Heavy Tracking Sans (`tracking-widest font-black`)

## Components

### Buttons
- **Primary:** Plat putih solid (`bg-white text-black font-black`), border bawah 3px mekanis (`#A1A1AA`), efek penekanan fisik `active:translate-y-1`.
- **Secondary:** Latar Zinc Slate (`#18181B`), border kawat `#27272A`, teks putih tajam, border bawah 3px `#09090B`.
- **Stop / Finish Hold:** Plat Laser Crimson (`#FF2E54` / `#DC2626`), progres fill `#991B1B`, teks putih tebal.

### Cards & Panels
- Latar Obsidian Charcoal (`#121214`), sudut melengkung 16px (`rounded-2xl`), border kawat perak presisi 1px (`#27272A`).

### Active Segments & Pills
- Segmen aktif bernilai putih tegas (`bg-white text-black font-black shadow-sm`), segmen tidak aktif bernilai zinc pudar transparan (`text-zinc-400 hover:text-zinc-200`).
