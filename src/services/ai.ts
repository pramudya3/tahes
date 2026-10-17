import { getUserProfile } from '../db/index';

/**
 * Built-in Rule-Based Mentor Responses (100% Offline)
 * Tailored for profile: 165 cm, 83 kg, 26 years old, beginner.
 */
export function getLocalMentorResponse(userPrompt: string): string {
  const prompt = userPrompt.toLowerCase();
  const profile = getUserProfile();

  if (
    prompt.includes('lutut') ||
    prompt.includes('sakit') ||
    prompt.includes('nyeri') ||
    prompt.includes('pegal') ||
    prompt.includes('sendi')
  ) {
    return (
      `Sebagai mentor Anda, prioritas #1 di bobot ${profile.currentWeightKg} kg adalah melindungi sendi lutut. ` +
      `Jika lutut terasa nyeri, segera hentikan latihan yang membebani paha depan dan ganti dengan gerakan aman seperti Glute Bridge (mengaktifkan bokong) atau peregangan ringan. ` +
      `Gunakan kompres dingin 15 menit jika ada rasa panas, dan pastikan setiap squat selalu menggunakan bantuan kursi (box squat).`
    );
  }

  if (
    prompt.includes('makan') ||
    prompt.includes('makanan') ||
    prompt.includes('kalori') ||
    prompt.includes('defisit') ||
    prompt.includes('diet') ||
    prompt.includes('nasi')
  ) {
    return (
      `Untuk menurunkan berat badan dari ${profile.currentWeightKg} kg ke ${profile.targetWeightKg} kg secara sehat: ` +
      `Target asupan harian Anda adalah sekitar 1.750 - 1.850 kkal/hari (defisit ~400-500 kkal dari TDEE). ` +
      `Prinsip piring makan Anda: 1/2 piring sayuran hijau/serat, 1/4 piring sumber protein tinggi (telur, dada ayam, tempe/tahu, ikan), dan 1/4 piring karbohidrat kompleks (nasi merah/nasi putih secukupnya). ` +
      `Hindari minuman manis boba/soda karena kalorinya cair dan cepat menaikkan lemak.`
    );
  }

  if (
    prompt.includes('lari') ||
    prompt.includes('jalan') ||
    prompt.includes('pace') ||
    prompt.includes('kardio')
  ) {
    return (
      `Di fase awal, saya sangat menganjurkan Anda fokus pada Brisk Walking (jalan cepat) dengan pace 8:30 - 9:30 /km selama 35-45 menit. ` +
      `Jalan cepat membakar lemak secara efisien tanpa memberikan beban impak 3-4x berat badan ke lutut seperti lari kencang. ` +
      `Jika ingin mulai berlari, gunakan metode Jog-Walk Interval (1 menit lari sangat santai, 2 menit jalan cepat, ulangi 8-10 siklus).`
    );
  }

  if (
    prompt.includes('push up') ||
    prompt.includes('plank') ||
    prompt.includes('squat') ||
    prompt.includes('kalistenik')
  ) {
    return (
      `Untuk latihan beban tubuh tanpa alat: ` +
      `1. Lakukan Incline Push-Up (tangan di tepi meja atau kursi kuat) daripada push-up lantai datar agar bahu dan pergelangan tangan tidak tertekan. ` +
      `2. Chair Squat: dorong pinggul ke belakang seperti hendak duduk, sentuh kursi pelan lalu berdiri tegak. ` +
      `3. Forearm Plank: kunci perut dan tahan 20-30 detik. Latihan ini menjaga otot Anda tetap kencang selagi lemak menyusut.`
    );
  }

  return (
    `Halo! Sebagai mentor kebugaran Anda (fokus penurunan berat badan aman dari ${profile.currentWeightKg} kg ke ${profile.targetWeightKg} kg tanpa alat): ` +
    `Kunci sukses terbesar adalah konsistensi harian: jalan cepat 30-40 menit, sirkuit kalistenik 2-3x seminggu, dan defisit kalori ~400 kkal. ` +
    `Ada yang ingin Anda tanyakan seputar teknik gerakan, tips lutut, atau strategi makanan hari ini?`
  );
}

/**
 * Sends a prompt to Google Gemini API if user has configured an API Key,
 * otherwise transparently falls back to local smart mentor engine.
 */
export async function sendAICoachMessage(prompt: string): Promise<string> {
  const profile = getUserProfile();

  if (!profile.geminiApiKey || profile.geminiApiKey.trim() === '') {
    return getLocalMentorResponse(prompt);
  }

  try {
    const apiKey = profile.geminiApiKey.trim();
    const systemInstruction =
      `Anda adalah mentor kebugaran dan pelatih pribadi khusus untuk pengguna usia ${profile.age} tahun, ` +
      `tinggi badan ${profile.heightCm} cm, berat badan saat ini ${profile.currentWeightKg} kg (target ${profile.targetWeightKg} kg). ` +
      `Pengguna berolahraga TANPA ALAT GYM APAPUN (hanya beban tubuh dan jalan kaki/jogging). ` +
      `Prioritas utama adalah menjaga sendi lutut dari cedera akibat kelebihan beban (hindari menyarankan gerakan jumping high-impact). ` +
      `Berikan jawaban yang suportif, ilmiah, ringkas, memotivasi, dan dalam Bahasa Indonesia yang ramah dan profesional.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemInstruction}\n\nPertanyaan Pengguna: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      getLocalMentorResponse(prompt);
    return text;
  } catch {
    // Graceful fallback to local mentor if network fails or API key invalid
    return getLocalMentorResponse(prompt);
  }
}
